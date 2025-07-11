'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
// import { Tabs, Tab } from "@/components/ui/tabs"; // 잘못된 import 제거

const baseUrl = 'http://localhost:4000';

// 컨트랙트 주소 검증 함수
const validateContractAddress = (address: string): boolean => {
    if (!address) return true; // 빈 값은 검증 통과 (저장 시에만 체크)
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// ABI JSON 형식 검증 함수
const validateAbiFormat = (abi: string): boolean => {
    if (!abi.trim()) return true; // 빈 값은 검증 통과 (저장 시에만 체크)
    const trimmedAbi = abi.trim();
    return trimmedAbi.startsWith('[') || trimmedAbi.startsWith('{');
};

const isValidEthAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

export default function ContractManager() {
    const [caToken, setCaToken] = useState('');
    const [caBadge, setCaBadge] = useState('');
    const [caSurvey, setCaSurvey] = useState('');
    const [caTransac, setCaTransac] = useState('');
    const [abiSurvey, setAbiSurvey] = useState('');
    const [abiBadge, setAbiBadge] = useState('');
    const [abiTransac, setAbiTransac] = useState('');

    // 에러 상태 관리
    const [errors, setErrors] = useState({
        caToken: false,
        caBadge: false,
        caSurvey: false,
        caTransac: false,
        abiSurvey: false,
        abiBadge: false,
        abiTransac: false,
    });

    // 입력값 변경 시 검증
    const handleAddressChange = (field: keyof typeof errors, value: string) => {
        const isValid = validateContractAddress(value);
        setErrors((prev) => ({ ...prev, [field]: !isValid }));

        // 해당 필드의 setter 함수 호출
        switch (field) {
            case 'caToken':
                setCaToken(value);
                break;
            case 'caBadge':
                setCaBadge(value);
                break;
            case 'caSurvey':
                setCaSurvey(value);
                break;
            case 'caTransac':
                setCaTransac(value);
                break;
        }
    };

    // ABI 입력값 변경 시 검증
    const handleAbiChange = (
        field: 'abiSurvey' | 'abiBadge' | 'abiTransac',
        value: string,
    ) => {
        const isValid = validateAbiFormat(value);
        setErrors((prev) => ({ ...prev, [field]: !isValid }));

        // 해당 필드의 setter 함수 호출
        if (field === 'abiSurvey') {
            setAbiSurvey(value);
        } else if (field === 'abiBadge') {
            setAbiBadge(value);
        } else {
            setAbiTransac(value);
        }
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
            setAbiBadge(
                data.abi_badge ? JSON.stringify(data.abi_badge, null, 2) : '',
            );
            setAbiTransac(
                data.abi_transac
                    ? JSON.stringify(data.abi_transac, null, 2)
                    : '',
            );

            // 초기 로드 시 에러 상태 초기화
            setErrors({
                caToken: false,
                caBadge: false,
                caSurvey: false,
                caTransac: false,
                abiSurvey: false,
                abiBadge: false,
                abiTransac: false,
            });
        } catch (e) {
            console.log(e as unknown);
            toast.error('컨트랙트 정보를 불러오지 못했습니다.');
        }
    };

    useEffect(() => {
        fetchContract();
    }, []);

    const [saving, setSaving] = useState(false);

    const handleContractSave = async () => {
        if (
            !caToken ||
            !caBadge ||
            !caSurvey ||
            !caTransac ||
            !abiSurvey ||
            !abiBadge ||
            !abiTransac
        ) {
            const emptyFields = [];
            if (!caToken) emptyFields.push('Token Address');
            if (!caBadge) emptyFields.push('Badge Address');
            if (!caSurvey) emptyFields.push('Survey Address');
            if (!caTransac) emptyFields.push('Transac Address');
            if (!abiSurvey) emptyFields.push('Survey ABI');
            if (!abiBadge) emptyFields.push('Badge ABI');
            if (!abiTransac) emptyFields.push('Transac ABI');
            alert(`빈 값: ${emptyFields.join(', ')}`);
            return;
        }

        // 저장 전 최종 검증
        const hasErrors = Object.values(errors).some((error) => error);
        if (hasErrors) {
            // 어떤 필드에서 에러가 발생했는지 확인
            const errorFields = [];
            if (errors.caToken) errorFields.push('토큰 컨트랙트');
            if (errors.caBadge) errorFields.push('뱃지 컨트랙트');
            if (errors.caSurvey) errorFields.push('서베이 컨트랙트');
            if (errors.caTransac) errorFields.push('메타 트랜잭션 컨트랙트');
            if (errors.abiSurvey) errorFields.push('Survey ABI');
            if (errors.abiBadge) errorFields.push('Badge ABI');
            if (errors.abiTransac) errorFields.push('Transac ABI');

            alert(
                `입력 형식이 올바르지 않습니다.\n\n문제가 있는 필드:\n${errorFields.join(
                    '\n',
                )}\n\n컨트랙트 주소: 0x로 시작하고 총 42자여야 합니다.\nABI: [ 또는 { 로 시작해야 합니다.`,
            );
            return;
        }

        setSaving(true);
        try {
            await axios.post(baseUrl + '/contract/ca', {
                ca_token: caToken,
                ca_badge: caBadge,
                ca_survey: caSurvey,
                ca_transac: caTransac,
                abi_survey: JSON.parse(abiSurvey),
                abi_badge: JSON.parse(abiBadge),
                abi_transac: JSON.parse(abiTransac),
            });
            toast.success('컨트랙트 정보가 저장되었습니다.');
            alert('변경 되었습니다.');
            fetchContract();
        } catch (e) {
            console.log(e as unknown);
            toast.error('저장 실패');
        } finally {
            setSaving(false);
        }
    };

    const [approveSpender, setApproveSpender] = useState('');
    const [approveAmount, setApproveAmount] = useState('');
    const [resultMessage, setResultMessage] = useState<string>('');
    const [approveTokenAddress, setApproveTokenAddress] = useState('');
    // caToken이 바뀔 때 approveTokenAddress도 자동으로 동기화
    useEffect(() => {
        setApproveTokenAddress(caToken);
    }, [caToken]);

    const [tab, setTab] = useState<'approve' | 'allowance'>('approve');
    const [allowanceOwner, setAllowanceOwner] = useState('');
    const [allowanceSpender, setAllowanceSpender] = useState('');
    const [allowanceTokenAddress, setAllowanceTokenAddress] = useState('');
    const [allowanceResult, setAllowanceResult] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [allowanceLoading, setAllowanceLoading] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [allowanceTimeoutId, setAllowanceTimeoutId] =
        useState<NodeJS.Timeout | null>(null);

    // caToken이 바뀔 때 approveTokenAddress, allowanceTokenAddress 자동 동기화
    useEffect(() => {
        setApproveTokenAddress(caToken);
        setAllowanceTokenAddress(caToken);
    }, [caToken]);
    // caTransac이 바뀔 때 approveSpender, allowanceSpender 자동 동기화
    useEffect(() => {
        setApproveSpender(caTransac);
        setAllowanceSpender(caTransac);
    }, [caTransac]);

    const handleApproveOrRevoke = async () => {
        setResultMessage('');
        setLoading(true);
        const tId = setTimeout(() => setLoading(false), 20000);
        setTimeoutId(tId);
        if (!approveSpender || !approveTokenAddress || approveAmount === '') {
            setLoading(false);
            toast.error('오너 주소, 토큰 컨트랙트 주소, 수량 모두 입력하세요.');
            return;
        }
        if (!isValidEthAddress(approveSpender)) {
            setLoading(false);
            toast.error(
                '오너 주소는 0x로 시작하는 42자 이더리움 주소여야 합니다.',
            );
            return;
        }
        if (!isValidEthAddress(approveTokenAddress)) {
            setLoading(false);
            toast.error(
                '토큰 컨트랙트 주소는 0x로 시작하는 42자 이더리움 주소여야 합니다.',
            );
            return;
        }
        const amountNum = Number(approveAmount);
        if (isNaN(amountNum) || amountNum < 0) {
            setLoading(false);
            toast.error('수량은 0 이상의 숫자여야 합니다.');
            return;
        }
        const summary =
            `아래 정보로 실행하시겠습니까?\n\n` +
            `오너 주소: ${approveSpender}\n` +
            `토큰 컨트랙트 주소: ${approveTokenAddress}\n` +
            `수량: ${approveAmount} (${
                amountNum === 0 ? '위임 취소' : '위임 승인'
            })`;
        if (!window.confirm(summary)) {
            setLoading(false);
            return;
        }
        try {
            if (amountNum === 0) {
                const res = await axios.post(
                    baseUrl + '/contract/wallet/revoke',
                    {
                        spender: approveSpender,
                        tokenAddress: approveTokenAddress,
                    },
                );
                toast.success('Revoke 성공: ' + res.data.txHash);
                setResultMessage(
                    `✅ 위임 취소 성공!\nTxHash: ${res.data.txHash}`,
                );
            } else if (amountNum > 0) {
                const res = await axios.post(
                    baseUrl + '/contract/wallet/approve',
                    {
                        spender: approveSpender,
                        tokenAddress: approveTokenAddress,
                        amount: amountNum.toString(),
                    },
                );
                toast.success('Approve 성공: ' + res.data.txHash);
                setResultMessage(
                    `✅ 위임 승인 성공!\nTxHash: ${res.data.txHash}`,
                );
            }
        } catch (e: unknown) {
            let msg = '실패';

            if (typeof e === 'object' && e !== null && 'response' in e) {
                const err = e as { response?: { data?: { error?: string } } };
                msg = err.response?.data?.error || msg;
            } else if (e instanceof Error) {
                msg = e.message;
            }

            toast.error(msg);
            setResultMessage(`❌ 실패: ${msg}`);
        } finally {
            if (timeoutId) clearTimeout(timeoutId);
            setLoading(false);
        }
    };

    const handleAllowanceCheck = async () => {
        setAllowanceResult('');
        setAllowanceLoading(true);
        const tId = setTimeout(() => setAllowanceLoading(false), 20000);
        setAllowanceTimeoutId(tId);
        if (
            !isValidEthAddress(allowanceOwner) ||
            !isValidEthAddress(allowanceSpender) ||
            !isValidEthAddress(allowanceTokenAddress)
        ) {
            setAllowanceLoading(false);
            toast.error(
                '모든 주소는 0x로 시작하는 42자 이더리움 주소여야 합니다.',
            );
            return;
        }
        try {
            const res = await axios.post(
                baseUrl + '/contract/wallet/allowance',
                {
                    owner: allowanceOwner,
                    spender: allowanceSpender,
                    tokenAddress: allowanceTokenAddress,
                },
            );
            setAllowanceResult(res.data.allowance);
        } catch (e: unknown) {
            let errorMessage = '';

            if (typeof e === 'object' && e !== null && 'response' in e) {
                const err = e as { response?: { data?: { error?: string } } };
                errorMessage = err.response?.data?.error || '';
            } else if (e instanceof Error) {
                errorMessage = e.message;
            }

            setAllowanceResult('조회 실패: ' + errorMessage);
        } finally {
            if (allowanceTimeoutId) clearTimeout(allowanceTimeoutId);
            setAllowanceLoading(false);
        }
    };

    return (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold text-blue-700 mb-2">
                컨트랙트 정보 관리
            </h2>

            {/* Approve/Revoke TunerToken UI */}
            <div className="mt-8 p-4 bg-white rounded-xl shadow space-y-2 border border-blue-200">
                {/* 탭 버튼 */}
                <div className="flex gap-2 mb-4">
                    <button
                        className={`px-4 py-2 rounded-t ${
                            tab === 'approve'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setTab('approve')}
                    >
                        토큰 위임 Approve / Revoke
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t ${
                            tab === 'allowance'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setTab('allowance')}
                    >
                        Allowance 조회
                    </button>
                </div>
                {/* 탭 내용 */}
                {tab === 'approve' && (
                    <div className="flex flex-col gap-2">
                        {/* 오너 주소 input: caTransac 값 자동 세팅, 직접 수정 가능 */}
                        <input
                            type="text"
                            placeholder="오너 주소 (0x... 42자)"
                            className={`border rounded p-2 font-mono ${
                                approveSpender &&
                                !isValidEthAddress(approveSpender)
                                    ? 'border-red-500'
                                    : ''
                            }`}
                            value={approveSpender}
                            onChange={(e) => setApproveSpender(e.target.value)}
                            maxLength={42}
                        />
                        {approveSpender &&
                            !isValidEthAddress(approveSpender) && (
                                <p className="text-red-500 text-xs ml-1">
                                    0x로 시작하는 42자 이더리움 주소여야 합니다.
                                </p>
                            )}
                        <input
                            type="text"
                            placeholder="토큰 컨트랙트 주소 (0x... 42자)"
                            className={`border rounded p-2 font-mono ${
                                approveTokenAddress &&
                                !isValidEthAddress(approveTokenAddress)
                                    ? 'border-red-500'
                                    : ''
                            }`}
                            value={approveTokenAddress}
                            onChange={(e) =>
                                setApproveTokenAddress(e.target.value)
                            }
                            maxLength={42}
                        />
                        {approveTokenAddress &&
                            !isValidEthAddress(approveTokenAddress) && (
                                <p className="text-red-500 text-xs ml-1">
                                    0x로 시작하는 42자 이더리움 주소여야 합니다.
                                </p>
                            )}
                        <input
                            type="number"
                            placeholder="수량 ether (0: 위임 취소, 1 이상: 위임 승인)"
                            className="border rounded p-2 font-mono"
                            value={approveAmount}
                            onChange={(e) => setApproveAmount(e.target.value)}
                            min={0}
                        />
                        <Button
                            className="bg-blue-600 text-white mt-2"
                            onClick={handleApproveOrRevoke}
                            disabled={loading}
                        >
                            {loading ? '실행 중...' : '실행'}
                        </Button>
                        {resultMessage && (
                            <div className="mt-3 p-3 bg-gray-100 rounded text-sm whitespace-pre-wrap border border-gray-300">
                                {resultMessage}
                            </div>
                        )}
                    </div>
                )}
                {tab === 'allowance' && (
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder="owner 주소 (0x... 42자)"
                            className={`border rounded p-2 font-mono ${
                                allowanceOwner &&
                                !isValidEthAddress(allowanceOwner)
                                    ? 'border-red-500'
                                    : ''
                            }`}
                            value={allowanceOwner}
                            onChange={(e) => setAllowanceOwner(e.target.value)}
                            maxLength={42}
                        />
                        {/* spender: caTransac 값 자동 세팅, 직접 수정 가능 */}
                        <input
                            type="text"
                            placeholder="spender 주소 (0x... 42자)"
                            className={`border rounded p-2 font-mono ${
                                allowanceSpender &&
                                !isValidEthAddress(allowanceSpender)
                                    ? 'border-red-500'
                                    : ''
                            }`}
                            value={allowanceSpender}
                            onChange={(e) =>
                                setAllowanceSpender(e.target.value)
                            }
                            maxLength={42}
                        />
                        {/* 토큰 컨트랙트 주소: caToken 값 자동 세팅, 직접 수정 가능 */}
                        <input
                            type="text"
                            placeholder="토큰 컨트랙트 주소 (0x... 42자)"
                            className={`border rounded p-2 font-mono ${
                                allowanceTokenAddress &&
                                !isValidEthAddress(allowanceTokenAddress)
                                    ? 'border-red-500'
                                    : ''
                            }`}
                            value={allowanceTokenAddress}
                            onChange={(e) =>
                                setAllowanceTokenAddress(e.target.value)
                            }
                            maxLength={42}
                        />
                        <Button
                            className="bg-blue-600 text-white mt-2"
                            onClick={handleAllowanceCheck}
                            disabled={allowanceLoading}
                        >
                            {allowanceLoading ? '조회 중...' : 'Allowance 조회'}
                        </Button>
                        {allowanceResult && (
                            <div className="mt-3 p-3 bg-gray-100 rounded text-sm whitespace-pre-wrap border border-gray-300">
                                allowance: {allowanceResult}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="pt-10">
                <label className="font-semibold">토큰 컨트랙트 :</label>
                <Input
                    placeholder="Token Address"
                    value={caToken}
                    onChange={(e) =>
                        handleAddressChange('caToken', e.target.value)
                    }
                    className={errors.caToken ? 'border-red-500' : ''}
                />
                {errors.caToken && (
                    <p className="text-red-500 text-sm mt-1">
                        형식이 맞지 않습니다
                    </p>
                )}
            </div>

            <div>
                <label className="font-semibold">뱃지 컨트랙트 :</label>
                <Input
                    placeholder="Badge Address"
                    value={caBadge}
                    onChange={(e) =>
                        handleAddressChange('caBadge', e.target.value)
                    }
                    className={errors.caBadge ? 'border-red-500' : ''}
                />
                {errors.caBadge && (
                    <p className="text-red-500 text-sm mt-1">
                        형식이 맞지 않습니다
                    </p>
                )}
            </div>

            <div>
                <label className="font-semibold">서베이 컨트랙트 :</label>
                <Input
                    placeholder="Survey Address"
                    value={caSurvey}
                    onChange={(e) =>
                        handleAddressChange('caSurvey', e.target.value)
                    }
                    className={errors.caSurvey ? 'border-red-500' : ''}
                />
                {errors.caSurvey && (
                    <p className="text-red-500 text-sm mt-1">
                        형식이 맞지 않습니다
                    </p>
                )}
            </div>

            <div>
                <label className="font-semibold">
                    메타 트랜잭션 컨트랙트 :
                </label>
                <Input
                    placeholder="Transac Address"
                    value={caTransac}
                    onChange={(e) =>
                        handleAddressChange('caTransac', e.target.value)
                    }
                    className={errors.caTransac ? 'border-red-500' : ''}
                />
                {errors.caTransac && (
                    <p className="text-red-500 text-sm mt-1">
                        형식이 맞지 않습니다
                    </p>
                )}
            </div>

            <div>
                <label className="font-semibold">Survey ABI (JSON)</label>
                <textarea
                    className={`border rounded p-2 w-full font-mono ${
                        errors.abiSurvey ? 'border-red-500' : ''
                    }`}
                    rows={4}
                    placeholder="Survey ABI (JSON)"
                    value={abiSurvey}
                    onChange={(e) =>
                        handleAbiChange('abiSurvey', e.target.value)
                    }
                />
                {errors.abiSurvey && (
                    <p className="text-red-500 text-sm mt-1">
                        형식이 맞지 않습니다
                    </p>
                )}
            </div>

            <div>
                <label className="font-semibold">Badge ABI (JSON)</label>
                <textarea
                    className={`border rounded p-2 w-full font-mono ${
                        errors.abiBadge ? 'border-red-500' : ''
                    }`}
                    rows={4}
                    placeholder="Badge ABI (JSON)"
                    value={abiBadge}
                    onChange={(e) =>
                        handleAbiChange('abiBadge', e.target.value)
                    }
                />
                {errors.abiBadge && (
                    <p className="text-red-500 text-sm mt-1">
                        형식이 맞지 않습니다
                    </p>
                )}
            </div>

            <div>
                <label className="font-semibold">
                    Meta Transaction ABI (JSON)
                </label>
                <textarea
                    className={`border rounded p-2 w-full font-mono ${
                        errors.abiTransac ? 'border-red-500' : ''
                    }`}
                    rows={4}
                    placeholder="Meta Transaction ABI (JSON)"
                    value={abiTransac}
                    onChange={(e) =>
                        handleAbiChange('abiTransac', e.target.value)
                    }
                />
                {errors.abiTransac && (
                    <p className="text-red-500 text-sm mt-1">
                        형식이 맞지 않습니다
                    </p>
                )}
            </div>
            <button
                className="w-full bg-blue-600 text-white py-2 rounded"
                onClick={handleContractSave}
                disabled={saving}
            >
                {saving ? '변경 중...' : '변경'}
            </button>
        </div>
    );
}
