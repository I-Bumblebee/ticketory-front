'use client';
import React from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { Logo } from '@/components/common/logo';
import { UserIcon } from '@/components/common/user-icons';

export default function Navbar() {
  const { user, logoutUser } = useUser();

  return (
    <nav className="flex items-center justify-between px-4 py-1.5 bg-white shadow-sm ">
      <Logo />
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              href={`/users/${user.id}`}
              className="flex gap-1 items-center"
            >
              <UserIcon />
            </Link>
            <button
              onClick={logoutUser}
              className="px-3 py-2 text-sm text-white bg-red-500 font-semibold rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-white bg-blue-500 font-semibold rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
