'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login as loginUser } from '@/services/api/auth';
import { ApiError } from '@/types/common';
import { handleApiFormErrors } from '@/utils/form-errors';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

const loginUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});
export default function LoginUserForm() {
  const router = useRouter();
  const { refreshUser } = useUser();

  const {
    register: registerInput,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    resetField,
  } = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginUserSchema>) => {
    loginUser(data)
      .then(() => {
        refreshUser();
        reset();
        router.replace('/');
      })
      .catch((apiError: ApiError) => {
        handleApiFormErrors(apiError, setError);
        resetField('password');
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...registerInput('email')}
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...registerInput('password')}
            className="w-full p-2 border rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
