"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import { InfoModal } from "./info-modal";

interface InfoCardProps {
  name: string;
  thumbnailUrl: string | null;
  hostIdentity: string;
  viewerIdentity: string;
}

export function InfoCard({
  name,
  thumbnailUrl,
  hostIdentity,
  viewerIdentity,
}: InfoCardProps) {
  const isHost = viewerIdentity === `host-${hostIdentity}`;
  if (!isHost) return null;

  return (
    <div className="rounded-xl bg-[#18181b] border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-indigo-600/20">
            <Pencil className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">
              Edit Your Stream Info
            </h3>
            <p className="text-xs text-muted-foreground">
              Maximize your visibility
            </p>
          </div>
        </div>

        <InfoModal
          initialName={name}
          initialThumbnailUrl={thumbnailUrl}
        />
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Name</p>
          <p className="text-sm font-medium">{name}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">
            Thumbnail
          </p>

          {thumbnailUrl ? (
            <div className="relative aspect-video w-[260px] rounded-lg overflow-hidden border border-white/10">
              <Image
                src={thumbnailUrl}
                fill
                alt="Thumbnail"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-[260px] aspect-video rounded-lg bg-muted/20 flex items-center justify-center text-xs text-muted-foreground">
              No thumbnail
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
