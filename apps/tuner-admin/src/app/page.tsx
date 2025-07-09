'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/lib/network/axios';

const fetchSession = async () => {
    const { data } = await axiosClient.post('/auth/me');
    return data;
};

export default function HomePage() {
    const router = useRouter();

    const { data, isError } = useQuery({
        queryKey: ['session'],
        queryFn: fetchSession,
        retry: false,
    });

    useEffect(() => {
        if (isError) {
            router.replace('/login');
        } else if (data) {
            router.replace('/dashboard');
        }
    }, [isError, data, router]);

    return <></>; // 또는 null
}
