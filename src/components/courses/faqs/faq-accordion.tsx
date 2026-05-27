"use client";

import { useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  faqs: FaqItem[];
};

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openFaqId, setOpenFaqId] = useState<string | null>(
    faqs[0]?.id ?? null
  );

  return (
    <div className="mt-5 space-y-4">
      {faqs.map((faq) => {
        const isOpen = openFaqId === faq.id;

        return (
          <div key={faq.id} className="rounded-xl bg-bg p-5">
            <button
              type="button"
              onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="figma-b2 text-000">{faq.question}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-fff text-xl text-aaa">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen && (
              <p className="figma-b3 mt-4 max-w-160 text-aaa">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}