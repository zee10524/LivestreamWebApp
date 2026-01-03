"use client";

import { LiveKitRoom } from "@livekit/components-react";

import { useChatSidebar } from "@/store/use-chat-sidebar";
import { useViewerToken } from "@/hooks/use-viewer-token";
import { cn } from "@/lib/utils";

import { Video, VideoSkeleton } from "./video";
import { Chat, ChatSkeleton } from "./chat";
import { ChatToggle } from "./chat-toggle";
import { Header } from "./header";
import { InfoCard } from "./info-card";

interface StreamPlayerProps {
  user: {
    id: string;
    username: string;
    bio: string | null;
    imageUrl: string;
    _count: { followers: number };
  };
  stream: {
    id: string;
    isChatEnabled: boolean;
    isChatDelayed: boolean;
    isChatFollowersOnly: boolean;
    name: string;
    thumbnailUrl: string | null;
  };
  isFollowing: boolean;
}

export const StreamPlayer = ({
  user,
  stream,
  isFollowing,
}: StreamPlayerProps) => {
  const { token, name, identity } = useViewerToken(user.id);
  const { collapsed } = useChatSidebar((state) => state);

  if (!token || !name || !identity) {
    return <StreamPlayerSkeleton />;
  }

  return (
    <>
      {/* Floating chat toggle */}
      {collapsed && (
        <div className="hidden lg:block fixed top-[100px] right-2 z-50">
          <ChatToggle />
        </div>
      )}

      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        className={cn(
          "grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-6 h-full",
          collapsed && "lg:grid-cols-2 2xl:grid-cols-2"
        )}
      >
        {/* =======================
            CENTER / MAIN COLUMN
           ======================= */}
        <div className="space-y-6 col-span-1 lg:col-span-2 2xl:col-span-5 pb-10 lg:overflow-y-auto hidden-scrollbar">
          {/* 🎥 Video */}
          <Video
            hostName={user.username}
            hostIdentity={user.id}
          />

          {/* 🧾 Header */}
          <Header
            hostName={user.username}
            hostIdentity={user.id}
            viewerIdentity={identity}
            imageUrl={user.imageUrl}
            isFollowing={isFollowing}
            name={stream.name}
          />

          {/* ✏️ Edit Stream Info (CORRECT POSITION) */}
          <InfoCard
            hostIdentity={user.id}
            viewerIdentity={identity}
            name={stream.name}
            thumbnailUrl={stream.thumbnailUrl}
          />
        </div>

        {/* =======================
              CHAT COLUMN
           ======================= */}
        <div
          className={cn(
            "col-span-1 border-l border-white/10",
            collapsed && "hidden"
          )}
        >
          <Chat
            viewerName={name}
            hostName={user.username}
            hostIdentity={user.id}
            isFollowing={isFollowing}
            isChatEnabled={stream.isChatEnabled}
            isChatDelayed={stream.isChatDelayed}
            isChatFollowersOnly={stream.isChatFollowersOnly}
          />
        </div>
      </LiveKitRoom>
    </>
  );
};

export const StreamPlayerSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-6 h-full">
      <div className="space-y-4 col-span-1 lg:col-span-2 2xl:col-span-5 pb-10">
        <VideoSkeleton />
      </div>
      <div className="col-span-1 bg-background">
        <ChatSkeleton />
      </div>
    </div>
  );
};
