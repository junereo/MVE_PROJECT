// src/lib/utils/chart.ts
import { DateTime } from 'luxon';
import { Survey } from '@/app/dashboard/page';

export const getWeeklyParticipationTrend = (surveys: Survey[]) => {
    const now = DateTime.local();
    const monday = now.set({ weekday: 1 }).startOf('day'); // 월요일 (ISO 기준)

    const dateCounts: Record<string, number> = {};

    for (let i = 0; i < 7; i++) {
        const date = monday.plus({ days: i }).toFormat('yyyy-MM-dd');
        dateCounts[date] = 0;
    }

    surveys.forEach((survey) => {
        survey.participants?.forEach((p) => {
            const createdDate = DateTime.fromISO(p.created_at).toFormat(
                'yyyy-MM-dd',
            );
            if (createdDate in dateCounts) {
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
    const monthCounts: Record<string, number> = {};
    for (let i = 1; i <= 12; i++) {
        const month = DateTime.fromObject({
            year: currentYear,
            month: i,
        }).toFormat('yyyy-MM');
        monthCounts[month] = 0;
    }

    // 2. 참여 횟수 누적 (중복 제거 없음)
    surveys.forEach((survey) => {
        survey.participants?.forEach((p) => {
            const month = DateTime.fromISO(p.created_at).toFormat('yyyy-MM');
            if (monthCounts[month] !== undefined) {
                monthCounts[month]++;
            }
        });
    });

    // 3. 그래프용 포맷 변환
    return Object.entries(monthCounts).map(([month, count]) => ({
        date: month, // ← 'date' 키로 맞춰줌
        participants: count,
    }));
};
