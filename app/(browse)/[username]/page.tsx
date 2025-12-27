import { notFound } from "next/navigation";

import { getUserByUsername } from "@/lib/user-service";
import { isFollowingUser } from "@/lib/follow-service";
import { Actions } from "./_components/action.tsx";
import { isBlockedByUser } from "@/lib/block-service.ts";

interface UserPageProps {
  params: {
    username: string;
  };
};

const UserPage = async ({
  params
}: UserPageProps) => {

  const resolvedParams = await params; // 👈 wait for params
  const user = await getUserByUsername(resolvedParams.username);


    if (!user) {
      notFound();
    }

  const isFollowing = await isFollowingUser(user.id);

  const isBlocked = await isBlockedByUser(user.id);
    //   if (isBlocked) {
    //   notFound();
    // }


  return (
    <div className="flex flex-col gap-y-4">
      <p>username: {user.username}</p>
      <p>user ID: {user.id}</p>
      <p>is following: {isFollowing.toString()}</p>
      <p> is Blocked by this user : {`${isBlocked}`}</p>
      <Actions  userId = {user.id} isFollowing = {isFollowing}/>
    </div>
  );
};

export default UserPage;