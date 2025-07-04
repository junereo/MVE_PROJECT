"use client";

import { fetchTemplates, surveyView } from "@/lib/network/api";
import { SurveyData } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface SurveyParticipant {
  id: number;
  nickname: string;
  role: "ordinary" | "Expert" | "admin" | "superadmin";
  reward: number;
}
interface FixedQuestion {
  type: "multiple" | "checkbox" | "subjective";
  options: string[];
  category: string;
  question_text: string;
  question_type: "fixed";
}

interface TemplateQuestionResponse {
  id: number;
  question: Record<string, FixedQuestion[]>;
}

// 더미 데이터

const radarData = [
  { category: "작품성", 남성: 4.6, 여성: 3.4 },
  { category: "대중성", 남성: 3.2, 여성: 4.1 },
  { category: "지속성", 남성: 3.2, 여성: 2.9 },
  { category: "확장성", 남성: 4.5, 여성: 4.1 },
  { category: "스타성", 남성: 4.7, 여성: 3.5 },
];

const ageDistribution = [
  { age: "10대", count: 9 },
  { age: "20대", count: 27 },
  { age: "30대", count: 28 },
  { age: "40대", count: 10 },
  { age: "50대+", count: 15 },
];

// 유튜브 ID 추출 함수
const extractYoutubeId = (url: string): string => {
  const match = url.match(/(?:v=|\/(?:embed\/)?)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : "";
};

export default function SurveyDetailPage() {
  const { id } = useParams();
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [participants, setParticipants] = useState<SurveyParticipant[]>([]);
  const [gradeFilter, setGradeFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [templateQuestions, setTemplateQuestions] = useState<FixedQuestion[]>(
    []
  );

  const perPage = 20;

  useEffect(() => {
    if (!id) return;

    const fetchSurvey = async () => {
      try {
        const result = await surveyView(Array.isArray(id) ? id[0] : id);
        setSurveyData(result.data);
        console.log("설문상세 정보", result.data);

        const rawParticipants = result.data.participants as {
          id: number;
          user: {
            id: number;
            nickname: string;
            badge_issued_at: string | null;
            role: string;
          };
        }[];

        const formatted: SurveyParticipant[] = rawParticipants.map((p) => {
          const isExpert = p.user.badge_issued_at !== null;
          let role: SurveyParticipant["role"];
          switch (p.user.role) {
            case "ordinary":
            case "Expert":
            case "admin":
            case "superadmin":
              role = p.user.role;
              break;
            default:
              role = "ordinary";
          }
          return {
            id: p.user.id,
            nickname: p.user.nickname,
            role,
            reward: isExpert ? result.data.expert_reward : result.data.reward,
          };
        });

        setParticipants(formatted);
      } catch (error) {
        console.error("설문 데이터 요청 실패:", error);
      }
    };

    fetchSurvey();
  }, [id]);

  // 템플릿 질문 fetch는 surveyData가 로드된 이후 실행
  useEffect(() => {
    if (!surveyData || !surveyData.questions) return;

    const fetchQuestions = async () => {
      try {
        const { data }: { data: TemplateQuestionResponse[] } =
          await fetchTemplates(surveyData.questions); // 이 부분 수정
        console.log("고정설문 데이터", data);

        if (data.length > 0) {
          const all: FixedQuestion[] = Object.values(data[0].question).flat();
          setTemplateQuestions(all);
        }
      } catch (err) {
        console.error("질문 템플릿 요청 실패:", err);
      }
    };

    fetchQuestions();
  }, [surveyData]);

  if (!surveyData) {
    return <div className="p-6 text-gray-600">로딩 중...</div>;
  }

  const youtubeId = extractYoutubeId(surveyData.music_uri || "");
  const author = {
    nickname: surveyData.creator?.nickname || "",
    id: surveyData.creator?.id || "",
    type: surveyData.type,
  };
  const reward = {
    total: surveyData.reward_amount || 0,
    normal: surveyData.reward || 0,
    expert: surveyData.expert_reward || 0,
  };

  const filteredParticipants =
    gradeFilter === "전체"
      ? participants
      : participants.filter((p) => p.role === gradeFilter);

  const totalPages = Math.ceil(filteredParticipants.length / perPage);
  const pageData = filteredParticipants.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div>
      <div className="w-full text-black text-2xl py-3 font-bold">
        Survey Detail - {surveyData.survey_title}
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 왼쪽 */}
          <div className="flex-1 flex flex-col space-y-4">
            {/* 유튜브 영상 + 작성자 정보 */}
            <div className="flex flex-col md:flex-row md:items-start gap-10">
              <div className="rounded overflow-hidden aspect-[3/2] md:w-[480px] w-full border">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <div className="space-y-5 w-full flex-1 flex flex-col items-start justify-end gap-1">
                <p className="text-gray-800 font-semibold">
                  👤 작성자:{" "}
                  <span className="text-black">{author.nickname}</span>
                </p>
                <p className="text-gray-800 font-semibold">
                  📘 설문 유형:{" "}
                  <span
                    className={
                      author.type === "official"
                        ? "text-green-600 font-bold"
                        : "text-gray-700"
                    }
                  >
                    {author.type === "official" ? "리워드 설문" : "일반 설문"}
                  </span>
                </p>

                {author.type === "official" && (
                  <>
                    <p className="text-gray-800 font-semibold">
                      💰 총 리워드:{" "}
                      <span className="text-black">{reward.total} STK</span>
                    </p>
                    <p className="text-gray-700">
                      지급 완료:{" "}
                      <span className="text-blue-700 font-semibold">
                        {participants.reduce((acc, cur) => acc + cur.reward, 0)}{" "}
                        STK
                      </span>{" "}
                      / 잔여:{" "}
                      <span className="text-red-600 font-semibold">
                        {reward.total -
                          participants.reduce(
                            (acc, cur) => acc + cur.reward,
                            0
                          )}{" "}
                        STK
                      </span>
                    </p>
                    <p className="text-xs text-gray-600">
                      일반 유저: {reward.normal} STK / Expert: {reward.expert}{" "}
                      STK
                    </p>
                    <div>{surveyData.music_title}</div>
                  </>
                )}

                <a
                  href={`https://www.youtube.com/watch?v=${youtubeId}`}
                  target="_blank"
                  className="bg-red-500 text-white text-sm text-center px-3 py-2 rounded w-full max-w-xs"
                >
                  유튜브에서 보기
                </a>
              </div>
            </div>

            {/* 설문 결과 시각화 */}
            <div className="border-t pt-4 space-y-3">
              <h2 className="font-semibold text-lg">설문 결과</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm mb-1 text-center font-medium">
                    성별별 평균 점수
                  </p>
                  <RadarChart
                    outerRadius={90}
                    width={300}
                    height={250}
                    data={radarData}
                    className="mx-auto"
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} />
                    <Tooltip />
                    <Radar
                      name="남성"
                      dataKey="남성"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="여성"
                      dataKey="여성"
                      stroke="#ec4899"
                      fill="#ec4899"
                      fillOpacity={0.3}
                    />
                    <Legend />
                  </RadarChart>
                </div>

                <div>
                  <p className="text-sm mb-1 text-center font-medium">
                    연령대별 참여자 수
                  </p>
                  <BarChart width={300} height={250} data={ageDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </div>
              </div>
            </div>

            {/* 질문 아코디언 */}
            <div className="mt-2 space-y-2">
              <h2 className="text-lg font-bold">질문 리스트</h2>
              {templateQuestions.map((q, i) => (
                <details key={i} className="border rounded px-4 py-2">
                  <summary className="cursor-pointer font-medium">
                    Q{i + 1}. {q.question_text}
                  </summary>
                  <div className="text-sm text-gray-600 mt-2">
                    유형:{" "}
                    {q.type === "multiple"
                      ? "객관식"
                      : q.type === "checkbox"
                      ? "체크박스"
                      : "주관식"}
                  </div>
                  {q.options.length > 0 && (
                    <ul className="mt-1 list-disc list-inside text-sm text-gray-500">
                      {q.options.map((opt, idx) => (
                        <li key={idx}>{opt}</li>
                      ))}
                    </ul>
                  )}
                </details>
              ))}
            </div>
          </div>

          {/* 오른쪽 - 참여자 테이블 */}
          <div className="w-full md:w-[520px]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">참여자 리스트</h2>
              <select
                value={gradeFilter}
                onChange={(e) => {
                  setCurrentPage(1);
                  setGradeFilter(e.target.value);
                }}
                className="border p-1 text-sm"
              >
                <option value="전체">전체</option>
                <option value="일반">일반</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <table className="w-full border text-sm text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">ID</th>
                  <th className="border px-2 py-1">닉네임</th>
                  <th className="border px-2 py-1">등급</th>
                  <th className="border px-2 py-1">리워드</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{user.id}</td>
                    <td className="border px-2 py-1">{user.nickname}</td>
                    <td className="border px-2 py-1">{user.role}</td>
                    <td className="border px-2 py-1">{user.reward} STK</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
