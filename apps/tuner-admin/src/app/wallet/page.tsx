// app/admin/wallet/page.tsx
'use client';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import WalletTabs from './components/WalletTabs';
import ContractManager from './components/ContractManager';

interface MutationRequest {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: Record<string, unknown>;
}

interface ApiResponse {
    success?: boolean;
    error?: string;
    message?: string;
    result?: unknown;
    [key: string]: unknown;
}

interface TimestampedResponse {
    timestamp: string;
    data: ApiResponse;
    method?: string;
}

export default function WalletPage() {
    const [uid, setUid] = useState<string>('');
    const [to, setTo] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const [surveyId, setSurveyId] = useState<string>('');
    const [answers, setAnswers] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [lastResponse, setLastResponse] =
        useState<TimestampedResponse | null>(null);
    const [responseHistory, setResponseHistory] = useState<
        TimestampedResponse[]
    >([]);
    const [activeMainTab, setActiveMainTab] = useState<string>('token');
    const [activeSubTab] = useState<string>('createWallet');
    const [filterMethod, setFilterMethod] = useState<string>('ALL');
    const baseUrl = 'http://localhost:4000';
    const [caToken, setCaToken] = useState('');
    const [caBadge, setCaBadge] = useState('');
    const [caSurvey, setCaSurvey] = useState('');
    const [caTransac, setCaTransac] = useState('');
    const [abiSurvey, setAbiSurvey] = useState('');
    const [abiTransac, setAbiTransac] = useState('');

    const resetInputs = (): void => {
        setUid('');
        setTo('');
        setValue('');
        setSurveyId('');
        setAnswers('');
        setMessage('');
    };

    const mutation = useMutation<ApiResponse, AxiosError, MutationRequest>({
        mutationFn: async ({
            url,
            method,
            data,
        }: MutationRequest): Promise<ApiResponse> => {
            const res: AxiosResponse<ApiResponse> = await axios({
                url,
                method,
                data,
            });
            return res.data;
        },
        onSuccess: (data, variables) => {
            const timestamped: TimestampedResponse = {
                timestamp: new Date().toISOString(),
                data,
                method: variables.method,
            };
            setLastResponse(timestamped);
            setResponseHistory((prev) => [...prev.slice(-4), timestamped]);
            toast.success('Success');
            resetInputs();
        },
        onError: (error: unknown) => {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || 'Request failed');
            } else {
                toast.error('Unknown error occurred');
            }
        },
    });

    const handleRequest = (
        url: string,
        method: MutationRequest['method'],
        data?: Record<string, unknown>,
    ): void => {
        mutation.mutate({ url, method, data });
    };

    const fetchContract = async () => {
        try {
            const res = await axios.get(baseUrl + '/contract/ca');
            const data = res.data?.result || res.data?.data || res.data;
            setCaToken(data.ca_token || '');
            setCaBadge(data.ca_badge || '');
            setCaSurvey(data.ca_survey || '');
            setCaTransac(data.ca_transac || '');
            setAbiSurvey(
                data.abi_survey ? JSON.stringify(data.abi_survey, null, 2) : '',
            );
            setAbiTransac(
                data.abi_transac
                    ? JSON.stringify(data.abi_transac, null, 2)
                    : '',
            );
        } catch (e) {
            toast.error('컨트랙트 정보를 불러오지 못했습니다.');
        }
    };

    useEffect(() => {
        fetchContract();
    }, []);

    const handleContractSave = async () => {
        if (
            !caToken ||
            !caBadge ||
            !caSurvey ||
            !caTransac ||
            !abiSurvey ||
            !abiTransac
        ) {
            const emptyFields = [];
            if (!caToken) emptyFields.push('Token Address');
            if (!caBadge) emptyFields.push('Badge Address');
            if (!caSurvey) emptyFields.push('Survey Address');
            if (!caTransac) emptyFields.push('Transac Address');
            if (!abiSurvey) emptyFields.push('Survey ABI');
            if (!abiTransac) emptyFields.push('Transac ABI');
            alert(`빈 값: ${emptyFields.join(', ')}`);
            return;
        }
        try {
            await axios.post(baseUrl + '/contract/ca', {
                ca_token: caToken,
                ca_badge: caBadge,
                ca_survey: caSurvey,
                ca_transac: caTransac,
                abi_survey: JSON.parse(abiSurvey),
                abi_transac: JSON.parse(abiTransac),
            });
            toast.success('컨트랙트 정보가 저장되었습니다.');
            fetchContract();
        } catch (e) {
            toast.error('저장 실패');
        }
    };

    useEffect(() => {
        resetInputs();
    }, [activeMainTab, activeSubTab]);

    const filteredHistory: TimestampedResponse[] =
        filterMethod === 'ALL'
            ? responseHistory
            : responseHistory.filter((res) => res.method === filterMethod);

    return (
        <main>
            <div className="w-full font-bold text-black text-2xl py-3 ">
                Admin Wallet Dashboard
            </div>
            <div className="p-6">
                <WalletTabs />
                <ContractManager />
            </div>
        </main>
    );
}
