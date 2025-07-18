// src/lib/utils/chart.ts
import { DateTime } from 'luxon';
import { Survey } from '@/app/dashboard/page';

export const getWeeklyParticipationTrend = (surveys: Survey[]) => {
    const now = DateTime.local();
    const monday = now.set({ weekday: 1 }).startOf('day'); // 월요일 (ISO 기준)

    const dateCounts: Record<string, number> = {};
    const seen = new Set<string>();

    for (let i = 0; i < 7; i++) {
        const date = monday.plus({ days: i }).toFormat('yyyy-MM-dd');
        dateCounts[date] = 0;
    }

    surveys.forEach((survey) => {
        survey.participants?.forEach((p) => {
            const createdDate = DateTime.fromISO(p.created_at).toFormat(
                'yyyy-MM-dd',
            );
            const key = `${p.user_id}-${createdDate}`;
            if (createdDate in dateCounts && !seen.has(key)) {
                seen.add(key);
                dateCounts[createdDate]++;
            }
        });
    });

    return Object.entries(dateCounts).map(([date, count]) => ({
        date,
        participants: count,
    }));
};

export const getMonthlyParticipationTrend = (surveys: Survey[]) => {
    const now = DateTime.now();
    const currentYear = now.year;

    // 1. 전체 1~12월을 기본값으로 미리 세팅
    const monthCounts: Record<string, Set<number>> = {};
    for (let i = 1; i <= 12; i++) {
        const month = DateTime.fromObject({
            year: currentYear,
            month: i,
        }).toFormat('yyyy-MM');
        monthCounts[month] = new Set();
    }

    // 2. 참여자가 존재하는 월만 추가
    surveys.forEach((survey) => {
        survey.participants?.forEach((p) => {
            const month = DateTime.fromISO(p.created_at).toFormat('yyyy-MM');
            if (monthCounts[month]) {
                monthCounts[month].add(p.user_id); // 유저 ID 기준으로 중복 제거
            }
        });
    });

    // 3. 그래프용 포맷 변환
    return Object.entries(monthCounts).map(([month, userSet]) => ({
        date: month, // ← 'date' 키로 맞춰줌
        participants: userSet.size,
    }));
};
