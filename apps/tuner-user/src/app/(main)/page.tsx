"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { useState } from "react";
import Slider from "./components/Slider";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    setIsModalOpen(false);
    router.push("/auth");
  };

  return (
    <div className="content">
      <h1 className="title">HOME</h1>
      <Slider />
    </div>
  );
}
