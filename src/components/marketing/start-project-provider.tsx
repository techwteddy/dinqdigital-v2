'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { QuoteModal } from '@/components/QuoteModal'

type StartProjectContextValue = {
  isModalOpen: boolean
  openQuoteModal: () => void
  closeQuoteModal: () => void
}

const StartProjectContext = createContext<StartProjectContextValue | null>(null)

export function StartProjectProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openQuoteModal = useCallback(() => setIsModalOpen(true), [])
  const closeQuoteModal = useCallback(() => setIsModalOpen(false), [])

  const value = useMemo(
    () => ({
      isModalOpen,
      openQuoteModal,
      closeQuoteModal,
    }),
    [isModalOpen, openQuoteModal, closeQuoteModal]
  )

  return (
    <StartProjectContext.Provider value={value}>
      {children}
      <QuoteModal open={isModalOpen} onClose={closeQuoteModal} />
    </StartProjectContext.Provider>
  )
}

export function useStartProject() {
  const context = useContext(StartProjectContext)
  if (!context) {
    throw new Error('useStartProject must be used within StartProjectProvider')
  }
  return context
}
