'use client';
import React from 'react';
import { useUser } from '@/context/UserContext';

export default function Home() {
  const { user } = useUser();
  return (
    <div>
      <pre>{JSON.stringify(user)}</pre>
    </div>
  );
}
