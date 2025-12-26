"use client";
import { toast, Toaster } from 'sonner';
import { useTransition } from "react";

import { onFollow , onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";

interface ActionsProps{
    isFollowing : boolean;
    userId: string;
}

export const Actions = ({ isFollowing, userId}:ActionsProps) => {

  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) =>
          toast.success(`You are now following ${data.following.username}`)
        )
        .catch(() => toast.error("Something went wrong, failed to follow"));
    });
  };

  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(userId)
        .then((data) =>
          toast.success(`You have unfollowed ${data.following.username}`)
        )
        .catch(() => toast.error("Something went wrong, failed to follow"));
    });
  };

  
  const onClick = () => {
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  return (
    <Button variant="primary" disabled={isPending} onClick={onClick}>
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
  );
};