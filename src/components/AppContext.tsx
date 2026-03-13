import React, { createContext, useContext, useState, ReactNode } from 'react'

export type AssetStatus = 'Pending' | 'Approved' | 'Revision Requested'

export type AssetItem<T> = {
  value: T
  status: AssetStatus
  feedback?: string
}

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
    logos: AssetItem<string>[]
    colors: AssetItem<string>[]
    fonts: AssetItem<{ primary: string; secondary: string }>
  }
}

interface AppContextType {
  prompts: Prompt[]
  addPrompt: (p: Omit<Prompt, 'id'>) => void
  clients: Client[]
  updateClientAssets: (id: string, assets: Client['assets']) => void
  updateAssetStatus: (
    clientId: string,
    type: 'logos' | 'colors' | 'fonts',
    index: number | null,
    status: AssetStatus,
    feedback?: string,
  ) => void
}

const defaultClients: Client[] = [
  {
    id: '1',
    name: 'Lojas Renner',
    assets: {
      logos: [{ value: 'renner-logo-primary.png', status: 'Approved' }],
      colors: [
        { value: '#E3000F', status: 'Approved' },
        { value: '#000000', status: 'Approved' },
        { value: '#FFFFFF', status: 'Approved' },
      ],
      fonts: { value: { primary: 'Montserrat', secondary: 'Arial' }, status: 'Approved' },
    },
  },
  {
    id: '2',
    name: 'TechStore',
    assets: {
      logos: [{ value: 'techstore-main.svg', status: 'Pending' }],
      colors: [
        { value: '#0055FF', status: 'Pending' },
        { value: '#222222', status: 'Pending' },
      ],
      fonts: { value: { primary: 'Roboto', secondary: 'Open Sans' }, status: 'Pending' },
    },
  },
  {
    id: '3',
    name: 'Boutique Z',
    assets: {
      logos: [
        {
          value: 'boutique-z.jpg',
          status: 'Revision Requested',
          feedback: 'O logo está em baixa resolução.',
        },
      ],
      colors: [
        { value: '#FF1493', status: 'Approved' },
        { value: '#111111', status: 'Approved' },
      ],
      fonts: {
        value: { primary: 'Playfair Display', secondary: 'Lato' },
        status: 'Revision Requested',
        feedback: 'Gostaria de uma fonte mais moderna para os títulos.',
      },
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
    title: 'Post Carrossel Instagram',
    text: 'Gere 3 imagens para um carrossel educativo no Instagram sobre "Como escolher o produto ideal". Design limpo, muito espaço em branco, tipografia grande e legível. A última imagem deve conter um CTA para o link na bio.',
    category: 'Social Media',
  },
  {
    id: '3',
    title: 'Wake Mobile Header CSS',
    text: 'Gere um CSS otimizado para o header mobile da plataforma Wake. O menu deve ser off-canvas (hamburguer), a barra de busca deve expandir ao clicar, e o logo deve ficar centralizado. Use variáveis CSS para as cores da marca.',
    category: 'Wake',
  },
  {
    id: '4',
    title: 'Tray Checkout Adjustments',
    text: 'Forneça um script JS e CSS para otimizar a visualização de parcelamento no checkout da Tray. Destaque o valor à vista em verde e oculte juros desnecessários.',
    category: 'Tray',
  },
  {
    id: '5',
    title: 'Nuvemshop Carousel JS',
    text: 'Crie uma inicialização de carrossel (Slick ou Swiper) configurada especificamente para as classes nativas da Nuvemshop, com autoplay e setas customizadas.',
    category: 'Nuvemshop',
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

  const updateAssetStatus = (
    clientId: string,
    type: 'logos' | 'colors' | 'fonts',
    index: number | null,
    status: AssetStatus,
    feedback?: string,
  ) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c
        const newAssets = { ...c.assets }
        if (type === 'fonts') {
          newAssets.fonts = { ...newAssets.fonts, status, feedback }
        } else if (type === 'logos' && index !== null) {
          const arr = [...newAssets.logos]
          arr[index] = { ...arr[index], status, feedback }
          newAssets.logos = arr
        } else if (type === 'colors' && index !== null) {
          const arr = [...newAssets.colors]
          arr[index] = { ...arr[index], status, feedback }
          newAssets.colors = arr
        }
        return { ...c, assets: newAssets }
      }),
    )
  }

  return (
    <AppContext.Provider
      value={{ prompts, addPrompt, clients, updateClientAssets, updateAssetStatus }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}
