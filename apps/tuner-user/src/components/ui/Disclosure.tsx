"use client";

import {
  Disclosure as HeadlessDisclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";

interface DisclosureProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function Disclosure({
  title,
  children,
  defaultOpen = false,
}: DisclosureProps) {
  return (
    <div
      key={defaultOpen ? "open" : "closed"}
      className="w-full border border-gray-200 rounded-md bg-white shadow-sm"
    >
      <HeadlessDisclosure defaultOpen={defaultOpen}>
        {({ open }) => (
          <>
            <DisclosureButton className="flex w-full justify-between items-center px-4 py-2 text-sm md:text-base font-semibold text-gray-900 bg-white hover:bg-gray-50 transition">
              <span>{title}</span>
              <ChevronUpIcon
                className={`h- w-5 text-gray-400 transition-transform duration-300 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </DisclosureButton>
            <DisclosurePanel className="px-2 py-5 text-sm text-gray-800 bg-gray-50">
              {children}
            </DisclosurePanel>
          </>
        )}
      </HeadlessDisclosure>
    </div>
  );
}
