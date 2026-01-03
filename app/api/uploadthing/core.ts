import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

const uploadthing = createUploadthing();

export const ourFileRouter = {
  thumbnail: uploadthing({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const self = await getSelf();
      if (!self) throw new Error("Unauthorized");

      return { userId: self.id };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      await db.stream.update({
        where: {
          userId: metadata.userId,
        },
        data: {
          thumbnailUrl: file.url,
        },
      });

      return { fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
