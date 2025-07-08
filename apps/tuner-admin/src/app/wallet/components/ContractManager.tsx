'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const baseUrl = 'http://localhost:4000';

export default function ContractManager() {
    const [caToken, setCaToken] = useState('');
    const [caBadge, setCaBadge] = useState('');
    const [caSurvey, setCaSurvey] = useState('');
    const [caTransac, setCaTransac] = useState('');
    const [abiSurvey, setAbiSurvey] = useState('');
    const [abiTransac, setAbiTransac] = useState('');

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

    return (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold text-blue-700 mb-2">
                컨트랙트 정보 관리
            </h2>
            <label className="font-semibold">토큰 컨트랙트 :</label>
            <Input
                placeholder="Token Address"
                value={caToken}
                onChange={(e) => setCaToken(e.target.value)}
            />
            <label className="font-semibold">뱃지 컨트랙트 :</label>
            <Input
                placeholder="Badge Address"
                value={caBadge}
                onChange={(e) => setCaBadge(e.target.value)}
            />
            <label className="font-semibold">서베이 컨트랙트 :</label>
            <Input
                placeholder="Survey Address"
                value={caSurvey}
                onChange={(e) => setCaSurvey(e.target.value)}
            />
            <label className="font-semibold">메타 트랜잭션 컨트랙트 :</label>
            <Input
                placeholder="Transac Address"
                value={caTransac}
                onChange={(e) => setCaTransac(e.target.value)}
            />
            <label className="font-semibold">Survey ABI (JSON)</label>
            <textarea
                className="border rounded p-2 w-full font-mono"
                rows={4}
                placeholder="Survey ABI (JSON)"
                value={abiSurvey}
                onChange={(e) => setAbiSurvey(e.target.value)}
            />
            <label className="font-semibold">Transac ABI (JSON)</label>
            <textarea
                className="border rounded p-2 w-full font-mono"
                rows={4}
                placeholder="Transac ABI (JSON)"
                value={abiTransac}
                onChange={(e) => setAbiTransac(e.target.value)}
            />
            <button
                className="w-full bg-blue-600 text-white py-2 rounded"
                onClick={handleContractSave}
            >
                변경
            </button>
        </div>
    );
}
