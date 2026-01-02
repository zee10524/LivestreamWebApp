"use server";

import {
  IngressAudioEncodingPreset,
  IngressInput,
  IngressClient,
  IngressVideoEncodingPreset,
  RoomServiceClient,
  type CreateIngressOptions,
  TrackSource,
} from "livekit-server-sdk";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);

const ingressClient = new IngressClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);

/* ===============================
   DELETE ALL INGRESSES (TESTING)
================================ */
export const resetIngresses = async () => {
  // 1️⃣ List ALL ingresses
  const ingresses = await ingressClient.listIngress();

  // 2️⃣ Delete ALL rooms (optional, ok for testing)
  const rooms = await roomService.listRooms();
  for (const room of rooms) {
    await roomService.deleteRoom(room.name);
  }

  // 3️⃣ Delete ALL ingresses
  for (const ingress of ingresses) {
    if (ingress.ingressId) {
      await ingressClient.deleteIngress(ingress.ingressId);
    }
  }
};

/* ===============================
   CREATE INGRESS
================================ */
export const createIngress = async (
  type: "RTMP_INPUT" | "WHIP_INPUT"
) => {
  const self = await getSelf();
  if (!self) {
    throw new Error("You must be logged in to continue");
  }

  const ingressType =
    type === "WHIP_INPUT"
      ? IngressInput.WHIP_INPUT
      : IngressInput.RTMP_INPUT;

  // 🔥 Delete all ingresses before creating new one
  await resetIngresses();

  const options: CreateIngressOptions = {
    name: self.username,
    roomName: self.id,
    participantIdentity: self.id,
    participantName: self.username,
  };

  if (ingressType === IngressInput.WHIP_INPUT) {
    options.bypassTranscoding = true;
  } else {
    options.video = {
      source: TrackSource.CAMERA,
      encodingPreset:
        IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
    };
    options.audio = {
      source: TrackSource.MICROPHONE,
      encodingPreset:
        IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
    };
  }

  const ingress = await ingressClient.createIngress(
    ingressType,
    options
  );

  if (!ingress.ingressId || !ingress.url || !ingress.streamKey) {
    throw new Error("Failed to create ingress");
  }

  await db.stream.update({
    where: { userId: self.id },
    data: {
      ingressId: ingress.ingressId,
      serverUrl: ingress.url,
      streamKey: ingress.streamKey,
      isLive: true,
    },
  });

  revalidatePath(`/u/${self.username}/keys`);

  return { success: true };
};
