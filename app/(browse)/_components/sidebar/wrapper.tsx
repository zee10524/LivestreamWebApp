"use client";

import React from "react";
import { useIsClient } from "usehooks-ts";

import { useSidebar } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";

import { ToggleSkeleton } from "./toggle";
import { RecommendedSkeleton } from "./recommended";
import { FollowingSkeleton } from "./following";

export function Wrapper({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar((state) => state);
  const isClient = useIsClient();

  const classes = cn(
    "fixed left-0 flex flex-col w-60 h-full bg-[#252731] border-r border-[#2D2E35] z-50 text-white",
    collapsed && "w-[70px]"
  );

  if (!isClient)
    return (
      <aside className={classes}>
        <ToggleSkeleton />
        <FollowingSkeleton />
        <RecommendedSkeleton />
      </aside>
    );

  return <aside className={classes}>{children}</aside>;
}
