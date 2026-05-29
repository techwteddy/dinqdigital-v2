'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SectionHeading } from '@/components/marketing/section-heading'
import { FAQ_ITEMS } from '@/lib/marketing'
import { cn } from '@/lib/utils'

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="scroll-mt-20 border-b border-border py-20 md:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know before you clone, customize, and launch."
        />

        <div className="mx-auto max-w-2xl divide-y divide-border rounded-xl border border-border bg-card">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium transition-colors hover:bg-muted/50"
                  aria-expanded={isOpen}
                >
                  {item.question}
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
