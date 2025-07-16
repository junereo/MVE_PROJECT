// components/admin/UserActivitySummary.tsx
'use client';

import React from 'react';

interface UserActivitySummaryProps {
    participationCount: number;
    creationCount: number;
    totalReward: number;
    withdrawableReward: number;
}

const SummaryCard = ({
    title,
    value,
}: {
    title: string;
    value: string | number;
}) => (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-4 w-full">
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
    </div>
);

const UserActivitySummary: React.FC<UserActivitySummaryProps> = ({
    participationCount,
    creationCount,
    totalReward,
    withdrawableReward,
}) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 w-full max-w-4xl">
            <SummaryCard title="참여 설문 수" value={participationCount} />
            <SummaryCard title="생성 설문 수" value={creationCount} />
            <SummaryCard title="총 리워드" value={`${totalReward} MVE`} />
            <SummaryCard
                title="출금 가능 리워드"
                value={`${withdrawableReward} MVE`}
            />
        </div>
    );
};

export default UserActivitySummary;
