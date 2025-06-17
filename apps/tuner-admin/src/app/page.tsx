'use client';

import { useQuery } from '@tanstack/react-query';
// import UseQueryGet from "./test/useQueryGet";
import axiosClient from '@/lib/network/axios';

const fetchSession = async () => {
  const { data } = await axiosClient.get(
    'https://jsonplaceholder.typicode.com/todos/1',
  );
  return data;
};

const Home = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
  });

  if (isLoading) return <>로딩 중....</>;
  if (isError) return <>에러 남</>;

  return (
    <div>
      {/* <UseQueryGet data={data} /> */}
      <div>나는 홈</div>
    </div>
  );
};

export default Home;
