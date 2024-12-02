'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { UserResource } from '@/types/user';
import { TicketResource } from '@/types/ticket';
import { getTickets } from '@/services/api/ticket';
import { ApiError } from '@/types/common';
import toast from 'react-hot-toast';
import TicketCard from '@/components/ticket/ticket-card';

const InspectUserTickets = () => {
  const { user } = useUser();
  const [userTickets, setUserTickets] = useState<
    { user: UserResource; tickets: TicketResource[] }[]
  >([]);

  useEffect(() => {
    // User not yet loaded
    if (user === undefined) return;

    getTickets()
      .then((apiResponse) => {
        console.log(apiResponse.data.data);
        setUserTickets(apiResponse.data.data);
      })
      .catch((error: ApiError) => {
        if (error.status === 403) {
          toast.error('Admin permissions required!');
        } else if (error.status === 401) {
          toast.error('You need to be signed in');
        } else {
          toast.error(
            error.response?.data?.message ||
              'Something went wrong. Please try again later.'
          );
        }
      });
  }, [user]);

  return (
    <div className="max-w-7xl m-auto mt-10  p-4 md:p-8 md:px-0 flex flex-col gap-16">
      {userTickets?.map(({ user, tickets }) => {
        return (
          <div key={user.id} className="flex flex-col gap-2">
            <h2 className="text-3xl capitalize">{user.full_name}</h2>
            <div className="flex flex-col gap-3">
              {tickets?.length ? (
                tickets.map((ticket) => {
                  return <TicketCard key={ticket.id} ticket={ticket} />;
                })
              ) : (
                <div className="text-gray-500 font-medium">
                  User has not purchased any tickets yet
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InspectUserTickets;
