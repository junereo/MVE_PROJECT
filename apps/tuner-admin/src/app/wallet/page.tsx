// app/admin/wallet/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

export default function WalletPage() {
  const [uid, setUid] = useState("");
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [surveyId, setSurveyId] = useState("");
  const [answers, setAnswers] = useState("");
  const [message, setMessage] = useState("");
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [responseHistory, setResponseHistory] = useState<any[]>([]);
  const [activeMainTab, setActiveMainTab] = useState("token");
  const [activeSubTab, setActiveSubTab] = useState("createWallet");
  const [filterMethod, setFilterMethod] = useState<string>("ALL");
  const baseUrl = "http://localhost:4000";

  const resetInputs = () => {
    setUid("");
    setTo("");
    setValue("");
    setSurveyId("");
    setAnswers("");
    setMessage("");
  };

  const mutation = useMutation({
    mutationFn: async ({
      url,
      method,
      data,
    }: {
      url: string;
      method: string;
      data?: any;
    }) => {
      const res = await axios({ url, method, data });
      return res.data;
    },
    onSuccess: (data) => {
      const timestamped = { timestamp: new Date().toISOString(), data };
      setLastResponse(timestamped);
      setResponseHistory((prev) => [...prev.slice(-4), timestamped]);
      toast.success("Success");
      resetInputs();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Request failed");
    },
  });

  const handleRequest = (url: string, method: string, data?: any) => {
    mutation.mutate({ url, method, data });
  };

  useEffect(() => {
    resetInputs();
  }, [activeMainTab, activeSubTab]);

  const filteredHistory =
    filterMethod === "ALL"
      ? responseHistory
      : responseHistory.filter((res) => res.method === filterMethod);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Wallet Dashboard</h1>
      <Tabs value={activeMainTab} onValueChange={setActiveMainTab}>
        <TabsList>
          <TabsTrigger value="token">Token</TabsTrigger>
          <TabsTrigger value="survey">Survey</TabsTrigger>
          <TabsTrigger value="txpool">TxPool</TabsTrigger>
        </TabsList>

        <TabsContent value="token">
          <Tabs defaultValue="createWallet">
            <TabsList className="mb-4 flex-wrap">
              <TabsTrigger value="createWallet">Create Wallet</TabsTrigger>
              <TabsTrigger value="createToken">Create Token</TabsTrigger>
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
                    handleRequest(baseUrl + "/contract/wallet", "POST", { uid })
                  }
                >
                  Create Wallet
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
                    handleRequest(baseUrl + "/contract/wallet/token", "POST", {
                      uid,
                      value,
                    })
                  }
                >
                  Create Token
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
                      baseUrl + `/contract/wallet/token/${uid}`,
                      "GET"
                    )
                  }
                >
                  Get Token
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
                    handleRequest(baseUrl + "/contract/wallet/token", "PUT", {
                      uid,
                      to,
                      value: Number(value),
                    })
                  }
                >
                  Send Token
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
                      baseUrl + "/contract/wallet/token",
                      "DELETE",
                      { uid, value: Number(value) }
                    )
                  }
                >
                  Burn Token
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
                      baseUrl + `/contract/wallet/badge/${uid}`,
                      "GET"
                    )
                  }
                >
                  Get Badge
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="survey">
          <Tabs defaultValue="submitSurvey">
            <TabsList className="mb-4 flex-wrap">
              <TabsTrigger value="submitSurvey">Submit Survey</TabsTrigger>
              <TabsTrigger value="getSurveyUri">Get Survey URI</TabsTrigger>
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
                    handleRequest(baseUrl + `/contract/survey/submit`, "POST", {
                      uid,
                      surveyId,
                      answers,
                    })
                  }
                >
                  Submit Survey
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
                      baseUrl + `/contract/survey/uri/${surveyId}`,
                      "GET"
                    )
                  }
                >
                  Get Survey URI
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="txpool">
          <Tabs defaultValue="signTx">
            <TabsList className="mb-4 flex-wrap">
              <TabsTrigger value="signTx">TxPool Sign</TabsTrigger>
              <TabsTrigger value="submitTxPool">Submit TxPool</TabsTrigger>
              <TabsTrigger value="clearTxPool">Clear TxPool</TabsTrigger>
              <TabsTrigger value="viewTxPool">View TxPool</TabsTrigger>
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
                    handleRequest(baseUrl + `/contract/tx/sign`, "POST", {
                      message,
                    })
                  }
                >
                  TxPool Sign
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="submitTxPool">
              <Button
                onClick={() =>
                  handleRequest(baseUrl + `/contract/tx/submit`, "POST")
                }
              >
                Submit TxPool
              </Button>
            </TabsContent>

            <TabsContent value="clearTxPool">
              <Button
                onClick={() =>
                  handleRequest(baseUrl + `/contract/tx/clear`, "GET")
                }
              >
                Clear TxPool
              </Button>
            </TabsContent>

            <TabsContent value="viewTxPool">
              <Button
                onClick={() =>
                  handleRequest(baseUrl + `/contract/tx/pool`, "GET")
                }
              >
                View TxPool
              </Button>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {mutation.isPending && (
        <div className="text-sm text-muted-foreground">Loading...</div>
      )}

      {lastResponse && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-muted-foreground mb-1">
            📋 Last API Response
          </h2>
          <p className="text-xs text-muted-foreground mb-1">
            Timestamp: {lastResponse.timestamp}
          </p>
          <pre className="bg-muted text-sm p-4 rounded whitespace-pre-wrap">
            {JSON.stringify(lastResponse.data, null, 2)}
          </pre>
        </div>
      )}
      {responseHistory.length > 1 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2 items-center">
              <h2 className="text-sm font-semibold text-muted-foreground">
                🕘 Response History (Last 5)
              </h2>
              <select
                className="text-xs border border-gray-300 rounded px-2 py-1"
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
              >
                <option value="ALL">ALL</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResponseHistory([])}
            >
              Clear History
            </Button>
          </div>
          <Accordion type="multiple" className="w-full">
            {filteredHistory.map((res, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger>
                  <span className="text-xs text-muted-foreground">
                    {res.timestamp} | {res.method}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap overflow-x-auto bg-muted p-3 rounded text-sm">
                    {JSON.stringify(res.data, null, 2)}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </main>
  );
}
