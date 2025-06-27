// app/admin/wallet/page.tsx
"use client";
import { useEffect, useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

interface MutationRequest {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
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
  const [uid, setUid] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [surveyId, setSurveyId] = useState<string>("");
  const [answers, setAnswers] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [lastResponse, setLastResponse] = useState<TimestampedResponse | null>(
    null
  );
  const [responseHistory, setResponseHistory] = useState<TimestampedResponse[]>(
    []
  );
  const [activeMainTab, setActiveMainTab] = useState<string>("token");
  const [activeSubTab] = useState<string>("createWallet");
  const [filterMethod, setFilterMethod] = useState<string>("ALL");
  const baseUrl = "http://localhost:4000";

  const resetInputs = (): void => {
    setUid("");
    setTo("");
    setValue("");
    setSurveyId("");
    setAnswers("");
    setMessage("");
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
      toast.success("Success");
      resetInputs();
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Request failed");
      } else {
        toast.error("Unknown error occurred");
      }
    },
  });

  const handleRequest = (
    url: string,
    method: MutationRequest["method"],
    data?: Record<string, unknown>
  ): void => {
    mutation.mutate({ url, method, data });
  };

  useEffect(() => {
    resetInputs();
  }, [activeMainTab, activeSubTab]);

  const filteredHistory: TimestampedResponse[] =
    filterMethod === "ALL"
      ? responseHistory
      : responseHistory.filter((res) => res.method === filterMethod);

  return (
    <main className="">
      <div className="w-full font-bold text-black text-2xl py-3 ">
        Admin Wallet Dashboard
      </div>
      <div className="p-6">
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
                      handleRequest(baseUrl + "/contract/wallet", "POST", {
                        uid,
                      })
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
                      handleRequest(
                        baseUrl + "/contract/wallet/token",
                        "POST",
                        {
                          uid,
                          value,
                        }
                      )
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
                      handleRequest(
                        baseUrl + `/contract/survey/submit`,
                        "POST",
                        {
                          uid,
                          surveyId,
                          answers,
                        }
                      )
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
      </div>
    </main>
  );
}
