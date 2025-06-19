"use client";

import Slider from "./components/Slider";
import List from "./components/List";

export default function Home() {
  return (
    <div className="content">
      <h1 className="title">HOME</h1>
      <Slider />
      <div className="mt-5">
        <h2 className="mb-3">설문 목록</h2>
        <List />
      </div>
    </div>
  );
}
