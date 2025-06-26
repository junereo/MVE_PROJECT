export interface DefaultQuestion {
  question: string;
  options: string[];
}

export const defaultQuestions: Record<string, DefaultQuestion[]> = {
  originality: [
    {
      question: "이 음원의 구성이 참신했나요?",
      options: ["매우 참신했다", "참신했다", "보통이다", "진부했다"],
    },
  ],
  popularity: [
    {
      question: "대중적으로 인기를 끌 수 있을까요?",
      options: ["대중적으로 끌 것이다.", "그렇다", "보통이다", "아니다"],
    },
  ],
  sustainability: [
    {
      question: "오래 들어도 질리지 않을 것 같나요?",
      options: ["내 인생의 18 번 곡이다", "그렇다", "보통이다", "그렇지 않다"],
    },
  ],
  expandability: [
    {
      question: "다른 장르로 확장 가능성이 있나요?",
      options: ["어떤 장르로도 확장가능하다", "있다", "잘 모르겠다", "없다"],
    },
  ],
  stardom: [
    {
      question: "이 음원으로 스타성이 돋보이나요?",
      options: [
        "진짜 스타성이 보인다",
        "매우 그렇다",
        "보통이다",
        "그렇지 않다",
      ],
    },
  ],
};
