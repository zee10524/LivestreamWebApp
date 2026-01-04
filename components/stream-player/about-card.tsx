"use client";

import { VerifiedMark } from "@/components/verified-mark";

interface AboutCardProps {
  hostName: string;
  hostIdentity: string;
  viewerIdentity: string;
  bio: string | null;
  followedByCount: number;
}

export const AboutCard = ({
  hostName,
  hostIdentity,
  viewerIdentity,
  bio,
  followedByCount,
}: AboutCardProps) => {
  const hostAsViewer = `host-${hostIdentity}`;
  const isHost = viewerIdentity === hostAsViewer;

  const followedByLabel =
    followedByCount === 1 ? "follower" : "followers";

  return (
    <div className="px-0 lg:px-4">
      <div className="rounded-xl bg-background p-6 lg:p-10 flex flex-col gap-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 font-semibold text-lg lg:text-2xl">
            About {hostName}
            <VerifiedMark />
          </div>

          {isHost && (
            <button className="text-sm font-medium text-muted-foreground hover:text-primary transition">
              EDIT
            </button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-primary">
            {followedByCount}
          </span>{" "}
          {followedByLabel}
        </div>

        <p className="text-sm leading-relaxed">
          {bio ||
            "This user prefers to keep an air of mystery about them."}
        </p>
      </div>
    </div>
  );
};
