"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";

interface AccordionItemProps {
  title: string;
  content: ReactNode;
}

export default function Accordion({ title, content }: AccordionItemProps) {
  return (
    <Disclosure>
      {({ open }) => (
        <div className="rounded-lg bg-white shadow">
          <DisclosureButton className="flex w-full justify-between items-center px-4 py-2 text-left text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg">
            <span>{title}</span>
            <ChevronUpIcon
              className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </DisclosureButton>
          <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-700">
            {content}
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
}
