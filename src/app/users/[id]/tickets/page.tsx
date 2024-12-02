'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TicketResource } from '@/types/ticket';
import { getUserTickets } from '@/services/api/ticket';
import toast from 'react-hot-toast';
import { ApiError } from '@/types/common';
import TicketCard from '@/components/ticket/ticket-card';

const UserPage = () => {
  const { id: userId } = useParams();
  const [tickets, setTickets] = useState<TicketResource[]>([]);

  useEffect(() => {
    getUserTickets(Number(userId))
      .then((apiResponse) => {
        const tickets = apiResponse.data.data;
        setTickets(tickets);
      })
      .catch((error: ApiError) => {
        toast.error(error.response?.data.message || 'User is not signed in!');
      });
  }, [userId]);
  return (
    <div className="max-w-7xl m-auto mt-10  p-4 md:p-8 md:px-0 flex flex-col gap-3">
      {tickets.map((ticket) => {
        return <TicketCard key={ticket.id} ticket={ticket} />;
      })}
    </div>
  );
};

export default UserPage;
