"use client";

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
    >
      Logout
    </Button>
  );
}
