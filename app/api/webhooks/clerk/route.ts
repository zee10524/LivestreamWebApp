import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
// import { resetIngresses } from "@/actions/ingress";

export async function POST(req: Request) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error(
        "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
      );
    }

    // --- Get headers ---
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occurred — missing Svix headers", {
        status: 400,
      });
    }

    // --- Get body ---
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // --- Verify Clerk webhook ---
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("❌ Error verifying Clerk webhook:", err);
      return new Response("Invalid webhook signature", { status: 400 });
    }

    const eventType = evt.type;
    const data = payload.data;

    // --- user.created ---
    if (eventType === "user.created") {
      const username = data.username ;
        // data.username || data.first_name || `user_${data.id}`;

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
      const username =data.username ;
        // data.username || data.first_name || `user_${data.id}`;

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
      try {
        await db.user.delete({
          where: {
            externalUserId: data.id,
          },
        });
      } catch (err: any) {
        if (err.code === "P2025") {
          console.warn("⚠️ Tried to delete a user that doesn't exist:", data.id);
        } else {
          throw err;
        }
      }
    }

    return new Response("✅ Webhook processed successfully", { status: 200 });
  } catch (err) {
    console.error("🔥 Webhook error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
