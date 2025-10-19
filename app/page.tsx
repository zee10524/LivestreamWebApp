'use client';

import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from '@clerk/nextjs';

export default function Page(): React.ReactElement {
  return (
    <>
      <SignedIn>
        <div className="flex flex-col gap-y-4 p-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
