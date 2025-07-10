'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import axios from 'axios';
import { toast } from 'sonner';

function TxPoolTable() {
    const [status, setStatus] = useState('all');
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPool = async (status: string = 'all') => {
        setLoading(true);
        const res = await axios.get(
            `http://localhost:4000/contract/tx/pool?status=${status}`,
        );
        setRows(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPool(status || 'all');
    }, [status]);

    return (
        <div>
            <div className="mb-2">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value || 'all')}
                >
                    <option value="all">전체</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                </select>
            </div>
            {loading ? (
                <div>로딩 중...</div>
            ) : (
                <table className="min-w-full border text-xs">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>UID</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>TxHash</th>
                            <th>Requested At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row: any) => (
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                <td>{row.user_id}</td>
                                <td>{row.amount}</td>
                                <td>{row.status}</td>
                                <td
                                    style={{
                                        maxWidth: 120,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {row.txhash}
                                </td>
                                <td>
                                    {new Date(
                                        row.requested_at,
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default function WalletTabs() {
    const [uid, setUid] = useState('');
    const [to, setTo] = useState('');
    const [value, setValue] = useState('');
    const [surveyId, setSurveyId] = useState('');
    const [answers, setAnswers] = useState('');
    const [message, setMessage] = useState('');
    const [activeMainTab, setActiveMainTab] = useState<string>('token');
    const [resultMessage, setResultMessage] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const baseUrl = 'http://localhost:4000';
    const [showTxPoolTable, setShowTxPoolTable] = useState(false);

    const handleRequest = async (
        url: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        data?: Record<string, unknown>,
    ) => {
        setResultMessage('');
        setLoading(true);
        const tId = setTimeout(() => setLoading(false), 20000);
        setTimeoutId(tId);

        try {
            const res = await axios({ url, method, data });
            if (timeoutId) clearTimeout(timeoutId);
            setLoading(false);

            const { txHash, allowance, token, ...rest } = res.data || {};
            let msg = '성공';
            if (txHash) msg += `\nTxHash: ${txHash}`;
            if (allowance) msg += `\nAllowance: ${allowance}`;
            if (token) msg += `\nToken: ${token}`;

            for (const k in rest) {
                if (!['txHash', 'allowance', 'token'].includes(k)) {
                    msg += `\n${k}: ${rest[k]}`;
                }
            }

            setResultMessage(msg);
            toast.success(msg);
        } catch (e: any) {
            if (timeoutId) clearTimeout(timeoutId);
            setLoading(false);
            const errMsg = e?.response?.data?.error || '요청 실패';
            setResultMessage('실패: ' + errMsg);
            toast.error(errMsg);
        }
    };

    return (
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab}>
            <TabsList>
                <TabsTrigger value="token">Token</TabsTrigger>
                <TabsTrigger value="survey">Survey</TabsTrigger>
                <TabsTrigger value="txpool">TxPool</TabsTrigger>
            </TabsList>

            <TabsContent value="token">
                <Tabs defaultValue="createWallet">
                    <TabsList className="mb-4 flex-wrap">
                        <TabsTrigger value="createWallet">
                            Create Wallet
                        </TabsTrigger>
                        <TabsTrigger value="createToken">
                            Create Token
                        </TabsTrigger>
                        <TabsTrigger value="getToken">Get Token</TabsTrigger>
                        <TabsTrigger value="sendToken">Send Token</TabsTrigger>
                        <TabsTrigger value="burnToken">Burn Token</TabsTrigger>
                        <TabsTrigger value="getBadge">Get Badge</TabsTrigger>
                    </TabsList>

                    <TabsContent value="createWallet">
                        <div className="space-y-2">
                            <Input
                                placeholder="UID"
                                value={uid}
                                onChange={(e) => setUid(e.target.value)}
                            />
                            <Button
                                onClick={() =>
                                    handleRequest(
                                        baseUrl + '/contract/wallet',
                                        'POST',
                                        { uid },
                                    )
                                }
                            >
                                지갑 생성
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="createToken">
                        <div className="space-y-2">
                            <Input
                                placeholder="UID"
                                value={uid}
                                onChange={(e) => setUid(e.target.value)}
                            />
                            <Input
                                placeholder="Amount (ETH)"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                            <Button
                                onClick={() =>
                                    handleRequest(
                                        baseUrl + '/contract/wallet/token',
                                        'POST',
                                        { uid, value },
                                    )
                                }
                                disabled={loading}
                            >
                                {loading ? '실행 중...' : '토큰 생성'}
                            </Button>
                            {resultMessage && (
                                <div className="mt-2 p-2 bg-gray-100 rounded text-sm whitespace-pre-wrap border border-gray-300">
                                    {resultMessage.length > 100
                                        ? resultMessage.slice(0, 100) + '...'
                                        : resultMessage}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="getToken">
                        <div className="space-y-2">
                            <Input
                                placeholder="UID"
                                value={uid}
                                onChange={(e) => setUid(e.target.value)}
                            />
                            <Button
                                onClick={() =>
                                    handleRequest(
                                        baseUrl +
                                            `/contract/wallet/token/${uid}`,
                                        'GET',
                                    )
                                }
                                disabled={loading}
                            >
                                {loading ? '조회 중...' : '토큰 조회'}
                            </Button>
                            {resultMessage && (
                                <div className="mt-2 p-2 bg-gray-100 rounded text-sm whitespace-pre-wrap border border-gray-300">
                                    {resultMessage.length > 100
                                        ? resultMessage.slice(0, 100) + '...'
                                        : resultMessage}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="sendToken">
                        <div className="space-y-2">
                            <Input
                                placeholder="Sender UID"
                                value={uid}
                                onChange={(e) => setUid(e.target.value)}
                            />
                            <Input
                                placeholder="To UID"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                            />
                            <Input
                                placeholder="Amount (ETH)"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                            <Button
                                onClick={() =>
                                    handleRequest(
                                        baseUrl + '/contract/wallet/token',
                                        'PUT',
                                        { uid, to, value },
                                    )
                                }
                                disabled={loading}
                            >
                                {loading ? '실행 중...' : '토큰 전송'}
                            </Button>
                            {resultMessage && (
                                <div className="mt-2 p-2 bg-gray-100 rounded text-sm whitespace-pre-wrap border border-gray-300">
                                    {resultMessage.length > 100
                                        ? resultMessage.slice(0, 100) + '...'
                                        : resultMessage}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="burnToken">
                        <div className="space-y-2">
                            <Input
                                placeholder="UID"
                                value={uid}
                                onChange={(e) => setUid(e.target.value)}
                            />
                            <Input
                                placeholder="Amount"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                            <Button
                                onClick={() =>
                                    handleRequest(
                                        baseUrl + '/contract/wallet/token',
                                        'DELETE',
                                        { uid, value: Number(value) },
                                    )
                                }
                            >
                                토큰 소각
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="getBadge">
                        <div className="space-y-2">
                            <Input
                                placeholder="UID"
                                value={uid}
                                onChange={(e) => setUid(e.target.value)}
                            />
                            <Button
                                onClick={() =>
                                    handleRequest(
                                        baseUrl +
                                            `/contract/wallet/badge/${uid}`,
                                        'GET',
                                    )
                                }
                            >
                                뱃지 조회
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </TabsContent>

            <TabsContent value="survey">
                <Tabs defaultValue="submitSurvey">
                    <TabsList className="mb-4 flex-wrap">
                        <TabsTrigger value="submitSurvey">
                            Submit Survey
                        </TabsTrigger>
                        <TabsTrigger value="getSurveyUri">
                            Get Survey URI
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="submitSurvey">
                        <div className="space-y-2">
                            <Input
                                placeholder="UID"
                                value={uid}
                                onChange={(e) => setUid(e.target.value)}
                            />
                            <Input
                                placeholder="Survey ID"
                                value={surveyId}
                                onChange={(e) => setSurveyId(e.target.value)}
                            />
                            <Input
                                placeholder="Answers (JSON)"
                                value={answers}
                                onChange={(e) => setAnswers(e.target.value)}
                            />
                            <Button
                                onClick={() =>
                                    handleRequest(
                                        baseUrl + `/contract/survey/submit`,
                                        'POST',
                                        { uid, surveyId, answers },
                                    )
                                }
                            >
                                설문 제출
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="getSurveyUri">
                        <div className="space-y-2">
                            <Input
                                placeholder="Survey ID"
                                value={surveyId}
                                onChange={(e) => setSurveyId(e.target.value)}
                            />
                            <Button
                                onClick={() =>
                                    handleRequest(
                                        baseUrl +
                                            `/contract/survey/uri/${surveyId}`,
                                        'GET',
                                    )
                                }
                            >
                                설문 URI 조회
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </TabsContent>

            <TabsContent value="txpool">
                <Tabs defaultValue="signTx">
                    <TabsList className="mb-4 flex-wrap">
                        <TabsTrigger value="signTx">TxPool Sign</TabsTrigger>
                        <TabsTrigger value="submitTxPool">
                            Submit TxPool
                        </TabsTrigger>
                        <TabsTrigger value="clearTxPool">
                            Clear TxPool
                        </TabsTrigger>
                        <TabsTrigger value="viewTxPool">
                            View TxPool
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="signTx">
                        <div className="space-y-2">
                            <Input
                                placeholder="UID"
                                value={uid}
                                onChange={(e) => setUid(e.target.value)}
                            />
                            <Input
                                placeholder="Message (Amount, ETH)"
                                type="number"
                                value={message}
                                onChange={(e) =>
                                    setMessage(
                                        e.target.value.replace(/[^0-9.]/g, ''),
                                    )
                                }
                                min={0}
                                step="any"
                            />
                            <Button
                                onClick={() => {
                                    if (!message || isNaN(Number(message))) {
                                        toast.error(
                                            '숫자만 입력하세요 (ether 단위)',
                                        );
                                        return;
                                    }
                                    handleRequest(
                                        baseUrl + `/contract/tx/sign`,
                                        'POST',
                                        { message: message, uid },
                                    );
                                }}
                                disabled={loading}
                            >
                                {loading ? '실행 중...' : 'TxPool 서명'}
                            </Button>
                            {resultMessage && (
                                <div className="mt-2 p-2 bg-gray-100 rounded text-sm whitespace-pre-wrap border border-gray-300">
                                    {resultMessage}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="submitTxPool">
                        <Button
                            onClick={() =>
                                handleRequest(
                                    baseUrl + `/contract/tx/submit`,
                                    'POST',
                                )
                            }
                            disabled={loading}
                        >
                            {loading ? '실행 중...' : 'TxPool 제출'}
                        </Button>
                        {resultMessage && (
                            <div className="mt-2 p-2 bg-gray-100 rounded text-sm whitespace-pre-wrap border border-gray-300">
                                {resultMessage}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="clearTxPool">
                        <Button
                            onClick={() =>
                                handleRequest(
                                    baseUrl + `/contract/tx/clear`,
                                    'GET',
                                )
                            }
                            disabled={loading}
                        >
                            {loading ? '실행 중...' : 'TxPool 초기화'}
                        </Button>
                        {resultMessage && (
                            <div className="mt-2 p-2 bg-gray-100 rounded text-sm whitespace-pre-wrap border border-gray-300">
                                {resultMessage}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="viewTxPool">
                        <TxPoolTable />
                    </TabsContent>
                </Tabs>
            </TabsContent>
        </Tabs>
    );
}
