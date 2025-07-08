'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function WalletTabs() {
    const [uid, setUid] = useState('');
    const [to, setTo] = useState('');
    const [value, setValue] = useState('');
    const [surveyId, setSurveyId] = useState('');
    const [answers, setAnswers] = useState('');
    const [message, setMessage] = useState('');
    const [activeMainTab, setActiveMainTab] = useState<string>('token');
    const [activeSubTab] = useState<string>('createWallet');
    const baseUrl = 'http://localhost:4000';

    // 실제 요청 함수는 props로 넘기거나 context로 처리하는 것이 좋으나, 예시로 버튼만 둡니다.

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
                            <Button>지갑 생성</Button>
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
                            <Button>토큰 생성</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="getToken">
                        <div className="space-y-2">
                            <Input
                                placeholder="UID"
                                value={uid}
                                onChange={(e) => setUid(e.target.value)}
                            />
                            <Button>토큰 조회</Button>
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
                            <Button>토큰 전송</Button>
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
                            <Button>토큰 소각</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="getBadge">
                        <div className="space-y-2">
                            <Input
                                placeholder="UID"
                                value={uid}
                                onChange={(e) => setUid(e.target.value)}
                            />
                            <Button>뱃지 조회</Button>
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
                            <Button>설문 제출</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="getSurveyUri">
                        <div className="space-y-2">
                            <Input
                                placeholder="Survey ID"
                                value={surveyId}
                                onChange={(e) => setSurveyId(e.target.value)}
                            />
                            <Button>설문 URI 조회</Button>
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
                            <Button>TxPool 서명</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="submitTxPool">
                        <Button>TxPool 제출</Button>
                    </TabsContent>

                    <TabsContent value="clearTxPool">
                        <Button>TxPool 초기화</Button>
                    </TabsContent>

                    <TabsContent value="viewTxPool">
                        <Button>TxPool 조회</Button>
                    </TabsContent>
                </Tabs>
            </TabsContent>
        </Tabs>
    );
}
