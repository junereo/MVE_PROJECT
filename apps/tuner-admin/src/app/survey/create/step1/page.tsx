// app/survey/create/step1/page.tsx
import { Suspense } from 'react';
import SurveyStep1Client from './SurveyStep1';

export default function SurveyStep1Page() {
    return (
        <Suspense fallback={<div className="p-4">로딩 중입니다...</div>}>
            <SurveyStep1Client />
        </Suspense>
    );
}
