import { currentUser } from "@clerk/nextjs/server";
import { getUserByUsername } from "@/lib/user-service";
import { StreamPlayer } from "@/components/stream-player/index";

interface CreatorPageProps {
  params: {
    username: string;
  };
}

const CreatorPage = async ({ params }: CreatorPageProps) => {
  const { username } = await params; // ✅ SAFE destructuring

  const externalUser = await currentUser();
  const user = await getUserByUsername(username);

  if (!user || user.externalUserId !== externalUser?.id || !user.stream) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="h-full">
      <StreamPlayer
        user={user as any}
        stream={user.stream}
        isFollowing={false}
      />
    </div>
  );
};

export default CreatorPage;
