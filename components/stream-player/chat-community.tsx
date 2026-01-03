"use client";

import { useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useParticipants } from "@livekit/components-react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommunityItem } from "./community-item";

interface ChatCommunityProps {
  hostName: string;
  viewerName: string;
  isHidden: boolean;
};

export const ChatCommunity = ({
  hostName,
  viewerName,
  isHidden
}: ChatCommunityProps) => {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounceValue(value, 500);

  const participants = useParticipants();

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  const filteredParticipants = useMemo(() => {
    // 1. Deduplicate participants by name to handle multi-tab users
    const deduped = participants.reduce((acc, participant) => {
      const name = participant.name;
      if (!name) return acc;

      if (!acc.some((p) => p.name === name)) {
        acc.push(participant);
      }
      return acc;
    }, [] as any[]);

    // 2. Filter based on the search input
    return deduped.filter((participant) => {
      return participant.name?.toLowerCase().includes(debouncedValue.toLowerCase());
    });
  }, [participants, debouncedValue]);

  if (isHidden) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Community is disabled
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Input
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search community"
        className="border-white/10"
      />
      <ScrollArea className="gap-y-2 mt-4">
        <p className="text-center text-sm text-muted-foreground hidden last:block p-2">
          No results
        </p>
        {filteredParticipants.map((participant) => (
          <CommunityItem
            key={participant.identity}
            hostName={hostName}
            viewerName={viewerName}
            participantName={participant.name}
            participantIdentity={participant.identity}
          />
        ))}
      </ScrollArea>
    </div>
  );
};

export const ChatCommunitySkeleton = () => {
  return (
    <div className="p-4">
      <div className="h-10 w-full bg-white/5 animate-pulse rounded-md" />
      <div className="mt-4 space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-x-3 p-2">
             <div className="h-4 w-full bg-white/5 animate-pulse rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};