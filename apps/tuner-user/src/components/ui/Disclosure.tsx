"use client";

import { Disclosure as HeadlessDisclosure } from "@headlessui/react";

interface DisclosureProps {
  title: string; // 버튼 내용
  children: string; // 내용
}

export default function closure({ title, children }: DisclosureProps) {
  return (
    <div>
      <HeadlessDisclosure>{({ open }) => <></>}</HeadlessDisclosure>
    </div>
  );
}
