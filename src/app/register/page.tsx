'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as registerUser } from '@/services/api/auth';
import { ApiError } from '@/types/common';
import { handleApiFormErrors } from '@/utils/form-errors';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const registrationSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    lastname: z.string().min(1, { message: 'Lastname is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    password_confirmation: z.string().min(6, {
      message: 'Password confirmation must be at least 6 characters',
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export default function RegistrationForm() {
  const router = useRouter();
  const {
    register: registerInput,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: z.infer<typeof registrationSchema>) => {
    registerUser(data)
      .then(() => {
        toast.success('Please verify email <3');
        reset();
        router.push('/login');
      })
      .catch((apiError: ApiError) => {
        handleApiFormErrors(apiError, setError);
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 px-2.5 md:px-0"
      >
        <div>
          <label htmlFor="name" className="block mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            {...registerInput('name')}
            className="w-full p-2 border rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastname" className="block mb-2">
            Lastname
          </label>
          <input
            type="text"
            id="lastname"
            {...registerInput('lastname')}
            className="w-full p-2 border rounded"
          />
          {errors.lastname && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lastname.message}
            </p>
          )}
        </div>

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

        <div>
          <label htmlFor="password_confirmation" className="block mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="password_confirmation"
            {...registerInput('password_confirmation')}
            className="w-full p-2 border rounded"
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <span>Already have an account?</span>
          <Link
            href="/login"
            className="text-blue-500 font-semibold hover:text-blue-600 transition duration-300 hover:underline"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
