import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    console.log("📬 Received Clerk webhook");

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) throw new Error("Missing CLERK_WEBHOOK_SECRET");

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature)
      return new Response("Missing Svix headers", { status: 400 });

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    const data = payload.data;
    const eventType = evt.type;

    // MAKE SURE username is never null
    const username =
      data.username ||
      data.first_name ||
      data.last_name ||
      data.email_addresses?.[0]?.email_address?.split("@")[0] ||
      `user_${data.id.substring(0, 6)}`;

    // --- user.created ---
    if (eventType === "user.created") {
      await db.user.upsert({
        where: { externalUserId: data.id },
        update: {},
        create: {
          externalUserId: data.id,
          username,
          imageUrl: data.image_url ?? "",
          stream: {
            create: {
              name: `${username}'s stream`,
            },
          },
        },
      });
    }

    // --- user.updated ---
    if (eventType === "user.updated") {
      await db.user.upsert({
        where: { externalUserId: data.id },
        update: {
          username,
          imageUrl: data.image_url ?? "",
        },
        create: {
          externalUserId: data.id,
          username,
          imageUrl: data.image_url ?? "",
          stream: {
            create: {
              name: `${username}'s stream`,
            },
          },
        },
      });
    }

    // --- user.deleted ---
    if (eventType === "user.deleted") {
      await db.user.delete({
        where: { externalUserId: data.id },
      }).catch((err: any) => {
        if (err.code !== "P2025") throw err;
      });
    }

    return new Response("✅ Webhook processed successfully", { status: 200 });

  } catch (err) {
    console.error("🔥 Webhook error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
