


import React from "react";
import { notFound } from "next/navigation";

import { getUserByUsername } from "@/lib/user-service";
import { isFollowingUser } from "@/lib/follow-service";
import { isBlockedByUser } from "@/lib/block-service";
import { StreamPlayer } from "@/components/stream-player";

interface UserPageProps {
  params: {
    username: string;
  };
}

/* ✅ Next.js 15: params is a Promise ONLY here */
export async function generateMetadata({ params }: UserPageProps) {
  const { username } = await params;

  return {
    title: username,
  };
}

/* ✅ params is NOT a Promise here */
export default async function UserPage({ params }: UserPageProps) {
  const { username } =await params;

  const user = await getUserByUsername(username);

  if (!user) notFound(); // ✅ only check user existence

  const isBlocked = await isBlockedByUser(user.id);
  if (isBlocked) notFound();

  const isFollowing = await isFollowingUser(user.id);

  const transformedUser = {
    id: user.id,
    username: user.username,
    bio: user.bio,
    imageUrl: user.imageUrl,
    _count: {
      followers: user._count.followedBy,
    },
  };

  return (
    <StreamPlayer
      user={transformedUser}
      isFollowing={isFollowing}
      stream={user.stream} // can be null
    />
  );
}
