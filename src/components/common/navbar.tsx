'use client';
import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Logo } from '@/components/common/logo';
import { UserIcon } from '@/components/common/user-icons';

export default function Navbar() {
  const { user, logoutUser } = useUser();
  return (
    <nav className="bg-white w-full">
      <div className="flex items-center justify-between max-w-7xl mx-auto py-4 pl-1 pr-2">
        <Logo />
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.is_admin ? (
                <Link
                  href="/admin/users/tickets"
                  className="p-2 pl-1.5 text-sm text-white bg-red-500 font-semibold rounded-md hover:bg-red-600 transition-colors flex items-center gap-1"
                  title="Admin Panel"
                >
                  <Shield size={20} />
                </Link>
              ) : (
                <></>
              )}
              <Link
                href={`/users/${user.id}/tickets`}
                className="flex gap-1 items-center"
              >
                <UserIcon />
              </Link>
              <button
                onClick={logoutUser}
                className="px-4 py-2 text-sm text-white bg-red-500 font-semibold rounded-md hover:bg-red-600 transition-colors"
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
      </div>
    </nav>
  );
}
