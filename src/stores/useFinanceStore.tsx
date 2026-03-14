import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Invoice = {
  id: string
  client: string
  amount: number
  issueDate: string
  dueDate: string
  status: 'Pendente' | 'Pago' | 'Atrasado' | 'Cancelado'
  type: 'Fatura' | 'Boleto' | 'NFS-e'
  number: string
}

interface FinanceStore {
  invoices: Invoice[]
  addInvoice: (i: Invoice) => void
  updateInvoice: (id: string, data: Partial<Invoice>) => void
  generateBoleto: (id: string) => void
  generateNFSe: (id: string) => void
}

const FinanceContext = createContext<FinanceStore | null>(null)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      client: 'Lojas Renner',
      amount: 15000,
      issueDate: '2024-03-01',
      dueDate: '2024-03-15',
      status: 'Pago',
      type: 'NFS-e',
      number: '2024/001',
    },
    {
      id: 'INV-002',
      client: 'TechStore',
      amount: 4500,
      issueDate: '2024-03-05',
      dueDate: '2024-03-10',
      status: 'Atrasado',
      type: 'Boleto',
      number: '2024/002',
    },
    {
      id: 'INV-003',
      client: 'Boutique Z',
      amount: 8200,
      issueDate: '2024-03-10',
      dueDate: '2024-03-25',
      status: 'Pendente',
      type: 'Fatura',
      number: '2024/003',
    },
  ])

  const addInvoice = (i: Invoice) => setInvoices((prev) => [i, ...prev])
  const updateInvoice = (id: string, data: Partial<Invoice>) =>
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)))

  const generateBoleto = (id: string) => {
    updateInvoice(id, { type: 'Boleto', status: 'Pendente' })
  }

  const generateNFSe = (id: string) => {
    updateInvoice(id, { type: 'NFS-e', status: 'Pago' })
  }

  return (
    <FinanceContext.Provider
      value={{ invoices, addInvoice, updateInvoice, generateBoleto, generateNFSe }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export default function useFinanceStore() {
  const context = useContext(FinanceContext)
  if (!context) throw new Error('useFinanceStore must be used within FinanceProvider')
  return context
}
