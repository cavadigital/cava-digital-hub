import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Prompt = {
  id: string
  title: string
  text: string
  category: string
}

export type Client = {
  id: string
  name: string
  assets: {
    logos: string[]
    colors: string[]
    fonts: { primary: string; secondary: string }
  }
}

interface AppContextType {
  prompts: Prompt[]
  addPrompt: (p: Omit<Prompt, 'id'>) => void
  clients: Client[]
  updateClientAssets: (id: string, assets: Client['assets']) => void
}

const defaultClients: Client[] = [
  {
    id: '1',
    name: 'Lojas Renner',
    assets: {
      logos: ['renner-logo-primary.png'],
      colors: ['#E3000F', '#000000', '#FFFFFF'],
      fonts: { primary: 'Montserrat', secondary: 'Arial' },
    },
  },
  {
    id: '2',
    name: 'TechStore',
    assets: {
      logos: ['techstore-main.svg'],
      colors: ['#0055FF', '#222222', '#F4F4F4'],
      fonts: { primary: 'Roboto', secondary: 'Open Sans' },
    },
  },
  {
    id: '3',
    name: 'Boutique Z',
    assets: {
      logos: ['boutique-z.jpg'],
      colors: ['#FF1493', '#111111'],
      fonts: { primary: 'Playfair Display', secondary: 'Lato' },
    },
  },
]

const defaultPrompts: Prompt[] = [
  {
    id: '1',
    title: 'Black Friday Hero Banner',
    text: 'Crie um banner de alta conversão para Black Friday. O foco deve ser no desconto de até 70%. Use elementos visuais que transmitam urgência (cronômetros, faixas de alerta) e siga estritamente a paleta de cores da marca. Destaque o CTA "Comprar Agora".',
    category: 'Performance Banner',
  },
  {
    id: '2',
    title: 'Wake Mobile Header CSS',
    text: 'Gere um CSS otimizado para o header mobile da plataforma Wake. O menu deve ser off-canvas (hamburguer), a barra de busca deve expandir ao clicar, e o logo deve ficar centralizado. Use variáveis CSS para as cores da marca.',
    category: 'Wake CSS',
  },
  {
    id: '3',
    title: 'Post Carrossel Instagram',
    text: 'Gere 3 imagens para um carrossel educativo no Instagram sobre "Como escolher o produto ideal". Design limpo, muito espaço em branco, tipografia grande e legível. A última imagem deve conter um CTA para o link na bio.',
    category: 'Social Media',
  },
]

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [prompts, setPrompts] = useState<Prompt[]>(defaultPrompts)
  const [clients, setClients] = useState<Client[]>(defaultClients)

  const addPrompt = (p: Omit<Prompt, 'id'>) => {
    const newPrompt = { ...p, id: Math.random().toString(36).substr(2, 9) }
    setPrompts([...prompts, newPrompt])
  }

  const updateClientAssets = (id: string, assets: Client['assets']) => {
    setClients(clients.map((c) => (c.id === id ? { ...c, assets } : c)))
  }

  return (
    <AppContext.Provider value={{ prompts, addPrompt, clients, updateClientAssets }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}
