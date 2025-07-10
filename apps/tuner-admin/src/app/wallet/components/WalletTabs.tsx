'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import axios from 'axios';
import { toast } from 'sonner';

export default function WalletTabs() {
    const [uid, setUid] = useState('');
    const [to, setTo] = useState('');
    const [value, setValue] = useState('');
    const [surveyId, setSurveyId] = useState('');
    const [answers, setAnswers] = useState('');
    const [message, setMessage] = useState('');
    const [activeMainTab, setActiveMainTab] = useState<string>('token');
    // const [activeSubTab] = useState<string>('createWallet');
    const baseUrl = 'http://localhost:4000';

    // API 요청 함수
    const handleRequest = async (
        url: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        data?: Record<string, unknown>,
    ) => {
        try {
            const res = await axios({ url, method, data });
            toast.success('성공: ' + (res.data?.message || ''));
        } catch (e: unknown) {
            // 내가 수정함
            if (axios.isAxiosError(e)) {
                toast.error(e.response?.data?.error || '요청 실패');
            } else {
                toast.error('요청 실패');
            }
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
                                placeholder="Amount"
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
                            >
                                토큰 생성
                            </Button>
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
                            >
                                토큰 조회
                            </Button>
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
                                placeholder="Amount"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                            <Button
                                onClick={() =>
                                    handleRequest(
                                        baseUrl + '/contract/wallet/token',
                                        'PUT',
                                        { uid, to, value: Number(value) },
                                    )
                                }
                            >
                                토큰 전송
                            </Button>
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
                                placeholder="Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button
                                onClick={() =>
                                    handleRequest(
                                        baseUrl + `/contract/tx/sign`,
                                        'POST',
                                        { message },
                                    )
                                }
                            >
                                TxPool 서명
                            </Button>
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
                        >
                            TxPool 제출
                        </Button>
                    </TabsContent>

                    <TabsContent value="clearTxPool">
                        <Button
                            onClick={() =>
                                handleRequest(
                                    baseUrl + `/contract/tx/clear`,
                                    'GET',
                                )
                            }
                        >
                            TxPool 초기화
                        </Button>
                    </TabsContent>

                    <TabsContent value="viewTxPool">
                        <Button
                            onClick={() =>
                                handleRequest(
                                    baseUrl + `/contract/tx/pool`,
                                    'GET',
                                )
                            }
                        >
                            TxPool 조회
                        </Button>
                    </TabsContent>
                </Tabs>
            </TabsContent>
        </Tabs>
    );
}
