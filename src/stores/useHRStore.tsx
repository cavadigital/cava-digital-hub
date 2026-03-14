import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Employee = {
  id: string
  name: string
  email: string
  role: string
  area: string
  integration: 'Google Workspace' | null
  equipmentCount: number
  lines: number
  status: 'Ativo' | 'Desligado'
  admissionDate: string
  resignationDate?: string
  phoneProfessional?: string
  emailProfessional?: string
  phonePersonal?: string
  emailPersonal?: string
  photoUrl?: string
  contractType: string
}

interface HRStore {
  employees: Employee[]
  addEmployee: (e: Employee) => void
  updateEmployee: (id: string, data: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  syncWithGoogle: () => void
}

const HRContext = createContext<HRStore | null>(null)

export function HRProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Luis Ciatti',
      email: 'dev@cavadigital.com.br',
      role: 'Desenvolvedor',
      area: 'Implantação',
      integration: 'Google Workspace',
      equipmentCount: 0,
      lines: 0,
      status: 'Desligado',
      admissionDate: '2023-01-10',
      resignationDate: '2023-12-01',
      phoneProfessional: '',
      emailProfessional: 'dev@cavadigital.com.br',
      contractType: 'CLT',
    },
    {
      id: '2',
      name: 'Mayara Iaworski',
      email: 'mayara.iaworski@cavadigital.com.br',
      role: 'Customer Success',
      area: 'Implantação | Performance',
      integration: 'Google Workspace',
      equipmentCount: 0,
      lines: 1,
      status: 'Ativo',
      admissionDate: '2024-02-19',
      phoneProfessional: '(41) 98486-4181',
      emailProfessional: 'mayara.iaworski@cavadigital.com.br',
      phonePersonal: '(41) 98486-4181',
      emailPersonal: 'mayaraiaworski@icloud.com',
      photoUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=mayara',
      contractType: 'Estagiário',
    },
    {
      id: '3',
      name: 'Murillo Silva e Miranda',
      email: 'murillo.miranda@cavadigital.com.br',
      role: 'Video Maker',
      area: 'Performance',
      integration: 'Google Workspace',
      equipmentCount: 0,
      lines: 2,
      status: 'Ativo',
      admissionDate: '2023-05-15',
      phoneProfessional: '(41) 99999-1111',
      emailProfessional: 'murillo.miranda@cavadigital.com.br',
      contractType: 'PJ',
    },
    {
      id: '4',
      name: 'Bruno Freitas Silva',
      email: 'socialmedia@cavadigital.com.br',
      role: 'Social Media',
      area: 'Performance',
      integration: 'Google Workspace',
      equipmentCount: 0,
      lines: 0,
      status: 'Desligado',
      admissionDate: '2023-02-10',
      resignationDate: '2023-10-05',
      emailProfessional: 'socialmedia@cavadigital.com.br',
      contractType: 'CLT',
    },
    {
      id: '5',
      name: 'Thiago Vianna Kuhn',
      email: 'marketing@cavadigital.com.br',
      role: 'Marketing Digital',
      area: 'Performance',
      integration: 'Google Workspace',
      equipmentCount: 0,
      lines: 1,
      status: 'Ativo',
      admissionDate: '2022-08-01',
      phoneProfessional: '(41) 98888-2222',
      emailProfessional: 'marketing@cavadigital.com.br',
      contractType: 'CLT',
    },
    {
      id: '6',
      name: 'Carlos Eduardo Deodato',
      email: 'carlos.deodato@cavadigital.com.br',
      role: 'CTO',
      area: 'Performance',
      integration: 'Google Workspace',
      equipmentCount: 0,
      lines: 1,
      status: 'Ativo',
      admissionDate: '2021-03-12',
      phoneProfessional: '(41) 97777-3333',
      emailProfessional: 'carlos.deodato@cavadigital.com.br',
      contractType: 'Sócio',
    },
  ])

  const addEmployee = (e: Employee) => setEmployees((prev) => [...prev, e])
  const updateEmployee = (id: string, data: Partial<Employee>) =>
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)))
  const deleteEmployee = (id: string) => setEmployees((prev) => prev.filter((e) => e.id !== id))

  const syncWithGoogle = () => {
    setEmployees((prev) =>
      prev.map((e) => ({
        ...e,
        integration: 'Google Workspace',
        photoUrl:
          e.photoUrl ||
          `https://img.usecurling.com/ppl/thumbnail?seed=${e.name.replace(/\s+/g, '')}`,
      })),
    )
  }

  return (
    <HRContext.Provider
      value={{ employees, addEmployee, updateEmployee, deleteEmployee, syncWithGoogle }}
    >
      {children}
    </HRContext.Provider>
  )
}

export default function useHRStore() {
  const context = useContext(HRContext)
  if (!context) throw new Error('useHRStore must be used within HRProvider')
  return context
}
