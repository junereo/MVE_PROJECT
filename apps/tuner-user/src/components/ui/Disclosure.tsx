"use client";

import {
  Disclosure as HeadlessDisclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";

interface DisclosureProps {
  title: string; // 버튼 내용
  children: ReactNode; // 내용
}

export default function Disclosure({ title, children }: DisclosureProps) {
  return (
    <div className="w-full rounded-lg bg-white p-2 shadow">
      <HeadlessDisclosure>
        {({ open }) => (
          <>
            <DisclosureButton className="flex w-full justify-between items-center rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200">
              <span>{title}</span>
              <ChevronUpIcon
                className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </DisclosureButton>
            <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-700">
              {children}
            </DisclosurePanel>
          </>
        )}
      </HeadlessDisclosure>
    </div>
  );
}
