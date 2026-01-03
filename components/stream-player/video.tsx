"use client";

import { ConnectionState, Track } from "livekit-client";
import { 
  useConnectionState, 
  useRemoteParticipant, 
  useTracks 
} from "@livekit/components-react";

import { OfflineVideo } from "./offline-video";
import { LoadingVideo } from "./loading-video";
import { LiveVideo } from "./live-video";

interface VideoProps {
  hostName: string;
  hostIdentity: string;
};

export const Video = ({
  hostName,
  hostIdentity,
}: VideoProps) => {
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);
  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.Microphone,
  ]).filter((track) => track.participant.identity === hostIdentity);

  let content;

  if (!participant && connectionState === ConnectionState.Connected) {
    content = <OfflineVideo username={hostName} />;
  } else if (!participant || tracks.length === 0) {
    content = <LoadingVideo label={connectionState} />;
  } else {
    content = <LiveVideo participant={participant} />;
  }

  return (
    <div className="aspect-video border-b group relative">
      {content}
    </div>
  );
};

export const VideoSkeleton = () => {
  return (
    <div className="aspect-video border-b group relative bg-background">
      <div className="flex flex-col space-y-4 items-center justify-center h-full">
        <div className="h-12 w-12 text-muted-foreground animate-pulse bg-white/5 rounded-full" />
        <div className="h-4 w-32 bg-white/5 animate-pulse rounded-md" />
      </div>
    </div>
  );
};