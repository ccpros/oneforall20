import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from './ui/button';

async function UserInformation() {
    const user = await currentUser();

    const firstName = user?.firstName;
    const lastName = user?.lastName;
  return (
    <div className="flex flex-col justify-center items-center mr-6 rounded-lg border py-4 p-4 text-clip"><Avatar className="w-20 h-20 border border-red-400 rounded-full">
        {user?.id ? (
        <AvatarImage src={user?.imageUrl} />
    ) : (
        <AvatarImage src="https://github.com/shadcn.png" />
        )}
    <AvatarImage src={user?.imageUrl || "https://github.com/shadcn.png"} />
    <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
  </Avatar>

  <SignedIn>
    <div className="text-center">
        <p className="font-semibold pt-2">
            {firstName} {lastName}
        </p>

        <p className="text-xs">
            @{firstName}{lastName}-{user?.id?.slice(-4)}
        </p>
    </div>

  </SignedIn>
  <SignedOut>
    <div className="text-center space-x-2">
        <p className="font-semibold">you are not Signed In</p>

        <Button asChild className="[bg-#0B63C4] text-white dark:text-black">
            <SignInButton>
                Sign In
            </SignInButton>
        </Button>
    </div>

  </SignedOut>

  <hr className="w-full border-red-200 my-5" />

  <div className="flex justify-between w-full px-4 text-sm">
    <p className="font-semibold text-gray-400">Posts</p>
    <p className="text-red-800/80">0</p>
  </div>

  <div className="flex justify-between w-full px-4 text-sm">
    <p className="font-semibold text-gray-400">Comments</p>
    <p className="text-red-800/80">0</p>
  </div>
  
  
  </div>
  )
}

export default UserInformation