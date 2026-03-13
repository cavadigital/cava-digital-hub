import React, { createContext, useContext, useState, ReactNode } from 'react'

type Branch = 'Consolidado' | 'Blumenau' | 'Curitiba'

interface BranchContextType {
  currentBranch: Branch
  setBranch: (branch: Branch) => void
}

const BranchContext = createContext<BranchContextType | undefined>(undefined)

export function BranchProvider({ children }: { children: ReactNode }) {
  const [currentBranch, setBranch] = useState<Branch>('Consolidado')
  return (
    <BranchContext.Provider value={{ currentBranch, setBranch }}>{children}</BranchContext.Provider>
  )
}

export function useBranch() {
  const context = useContext(BranchContext)
  if (!context) throw new Error('useBranch must be used within a BranchProvider')
  return context
}
