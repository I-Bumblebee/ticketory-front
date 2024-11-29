'use client';
import React, { useState } from 'react';
import { getCsrf, login } from '@/services/api/auth';
import { ApiError } from '@/types/common';
import { UserResource } from '@/types/user';

export default function Home() {
  const [user, setUser] = useState<UserResource | null>(null);

  const fetchData = async () => {
    try {
      await getCsrf();
      login({
        email: 'admin@gmail.com',
        password: 'password',
      })
        .then((apiResponse) => apiResponse.data.data)
        .then(setUser)
        .catch((error: ApiError) => {
          console.log(error.response?.data.errors);
        });
    } catch (error) {
      console.log('Error getting csrf cookie', error);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Login</button>
      <pre>{JSON.stringify(user)}</pre>
    </div>
  );
}
