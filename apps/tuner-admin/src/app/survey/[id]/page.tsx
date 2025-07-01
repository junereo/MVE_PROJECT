"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
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

// 더미 데이터
const youtubeId = "0LwcvjNJTuM";
const surveyTitle = " 레전드 일렉기타 감성 평가";
const youtubeTitle = "Lynyrd Skynyrd - Free Bird ";
const channelTitle = " Lynyrd Skynyrd";
console.log(channelTitle);

const author = { nickname: "musicfan99", id: "user_33", type: "official" };
const reward = { total: 500, normal: 10, expert: 20 };
const status = "종료";
console.log(status);

const questions = [
  "이 곡의 작품성은 뛰어난가요?",
  "대중성 있는 멜로디라고 생각하십니까?",
  "지속적으로 듣고 싶은 음악인가요?",
  "이 곡의 확장 가능성이 높다고 보십니까?",
  "아티스트의 스타성이 느껴지나요?",
];

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

const participants = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  nickname: `user_${i + 1}`,
  grade: i % 4 === 0 ? "Expert" : "일반",
  reward: i % 4 === 0 ? reward.expert : reward.normal,
}));

export default function SurveyDetailPage() {
  const { id } = useParams();
  console.log(id);

  const [gradeFilter, setGradeFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  const filteredParticipants =
    gradeFilter === "전체"
      ? participants
      : participants.filter((p) => p.grade === gradeFilter);

  const totalPages = Math.ceil(filteredParticipants.length / perPage);
  const pageData = filteredParticipants.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div>
      <div className=" w-full  text-black text-2xl py-3  font-bold">
        Survey Detail - {surveyTitle}
      </div>
      <div className="p-6 ">
        <div className=" flex flex-col md:flex-row gap-6">
          {/* 왼쪽 */}
          <div className="flex-1 flex flex-col space-y-4  ">
            {/* 설문 제목 */}

            {/* 유튜브 영상 + 작성자 정보 레이아웃 */}
            <div className="flex flex-col md:flex-row md:items-start gap-10 border-t pt-4">
              {/* 유튜브 영상 */}
              <div className="rounded overflow-hidden aspect-[3/2] md:w-[480px] w-full border">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* 작성자 및 설문 정보 */}
              <div className="space-y-5 w-full flex-1 flex flex-col items-start justify-end gap-1">
                <p className="text-gray-800 font-semibold">
                  👤 작성자:{" "}
                  <span className="text-black">{author.nickname}</span> (
                  {author.id})
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
                    <div>{youtubeTitle}</div>
                  </>
                )}

                {/* 유튜브에서 보기 버튼 - 하단에 배치 */}
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
                {/* 오각형 그래프 */}
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
                    {/* 점수 보여주기 */}
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

                {/* 막대 그래프 */}
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
              {questions.map((q, i) => (
                <details key={i} className="border rounded px-4 py-2">
                  <summary className="cursor-pointer font-medium">
                    Q{i + 1}. {q}
                  </summary>
                  <div className="text-sm text-gray-600 mt-2">
                    이 문항은 사용자들의 성실도 평가에 활용됩니다.
                  </div>
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
                    <td className="border px-2 py-1">{user.grade}</td>
                    <td className="border px-2 py-1">{user.reward} STK</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 */}
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
