'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/services/api/email';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const user = searchParams.get('user');
    const hash = searchParams.get('hash');
    const expires = searchParams.get('expires');
    const signature = searchParams.get('signature');

    if (!user || !hash || !expires || !signature) {
      router.push('/');
      return;
    }

    verifyEmail(user, hash, expires, signature)
      .then(() => {
        // TODO: Show success notification
        router.push('/login');
      })
      .catch(() => {
        // TODO: Show fail notification
        // WIP: Add request verification email support
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="text-center">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
        </div>
        <h2 className="text-xl text-gray-700 font-semibold">
          Verifying your email address
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we confirm your email
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

