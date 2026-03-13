import React, { createContext, useContext, useState, ReactNode } from 'react'
import { MOCK_PROJECTS } from '@/lib/data'

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
  phone?: string
  notifyWhatsApp?: boolean
  healthScore?: number
  assets: {
    logos: AssetItem<string>[]
    colors: AssetItem<string>[]
    fonts: AssetItem<{ primary: string; secondary: string }>
  }
}

export type UIComponent = {
  id: string
  name: string
  category: string
  platform: string
  code: { html: string; css: string; js: string }
}

export type NotificationSettings = {
  assetApprovalEmail: boolean
  assetApprovalSlack: boolean
  deployErrorEmail: boolean
  deployErrorSlack: boolean
}

export type Project = {
  id: string
  title: string
  client: string
  status: string
  branch: string
  description?: string
}

interface AppContextType {
  prompts: Prompt[]
  addPrompt: (p: Omit<Prompt, 'id'>) => void
  clients: Client[]
  updateClientAssets: (id: string, assets: Client['assets']) => void
  updateClientPreferences: (id: string, phone: string, notifyWhatsApp: boolean) => void
  updateAssetStatus: (
    clientId: string,
    type: 'logos' | 'colors' | 'fonts',
    index: number | null,
    status: AssetStatus,
    feedback?: string,
  ) => void
  uiComponents: UIComponent[]
  addUIComponent: (comp: Omit<UIComponent, 'id'>) => void
  deleteUIComponent: (id: string) => void
  notificationSettings: NotificationSettings
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void
  projects: Project[]
  updateProjectStatus: (id: string, status: string) => void
  addProject: (p: Omit<Project, 'id'>) => void
}

const defaultClients: Client[] = [
  {
    id: '1',
    name: 'Lojas Renner',
    phone: '5511999999999',
    notifyWhatsApp: true,
    healthScore: 92,
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
    phone: '5511888888888',
    notifyWhatsApp: false,
    healthScore: 68,
    assets: {
      logos: [{ value: 'techstore-main.svg', status: 'Pending' }],
      colors: [
        { value: '#0055FF', status: 'Pending' },
        { value: '#222222', status: 'Pending' },
      ],
      fonts: { value: { primary: 'Roboto', secondary: 'Open Sans' }, status: 'Pending' },
    },
  },
]

const defaultPrompts: Prompt[] = [
  {
    id: '1',
    title: 'Black Friday Hero Banner',
    text: 'Crie um banner de alta conversão para Black Friday.',
    category: 'Performance Banner',
  },
]

const defaultUIComponents: UIComponent[] = [
  {
    id: 'c1',
    name: 'Header Promocional Fluido',
    category: 'Headers',
    platform: 'Wake',
    code: {
      html: '<div style="background:#000;color:#fff;text-align:center;padding:8px;font-family:sans-serif;">Frete Grátis acima de R$199</div>',
      css: '/* Adicione estilos no seu painel */',
      js: 'console.log("Promo Header Init");',
    },
  },
  {
    id: 'c2',
    name: 'Botão Flutuante (WhatsApp)',
    category: 'Buttons',
    platform: 'Tray',
    code: {
      html: '<a href="#" style="position:fixed;bottom:20px;right:20px;background:#25D366;color:#fff;padding:12px 20px;border-radius:50px;text-decoration:none;font-family:sans-serif;box-shadow:0 4px 10px rgba(0,0,0,0.2);">WhatsApp</a>',
      css: '',
      js: '',
    },
  },
]

const defaultNotificationSettings: NotificationSettings = {
  assetApprovalEmail: true,
  assetApprovalSlack: true,
  deployErrorEmail: true,
  deployErrorSlack: true,
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [prompts, setPrompts] = useState<Prompt[]>(defaultPrompts)
  const [clients, setClients] = useState<Client[]>(defaultClients)
  const [uiComponents, setUiComponents] = useState<UIComponent[]>(defaultUIComponents)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(
    defaultNotificationSettings,
  )
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)

  const addPrompt = (p: Omit<Prompt, 'id'>) => {
    setPrompts([...prompts, { ...p, id: Math.random().toString(36).substr(2, 9) }])
  }

  const updateClientAssets = (id: string, assets: Client['assets']) => {
    setClients(clients.map((c) => (c.id === id ? { ...c, assets } : c)))
  }

  const updateClientPreferences = (id: string, phone: string, notifyWhatsApp: boolean) => {
    setClients(clients.map((c) => (c.id === id ? { ...c, phone, notifyWhatsApp } : c)))
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

  const addUIComponent = (comp: Omit<UIComponent, 'id'>) => {
    setUiComponents([...uiComponents, { ...comp, id: Math.random().toString(36).substr(2, 9) }])
  }

  const deleteUIComponent = (id: string) => {
    setUiComponents(uiComponents.filter((c) => c.id !== id))
  }

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings({ ...notificationSettings, ...settings })
  }

  const updateProjectStatus = (id: string, status: string) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, status } : p)))
  }

  const addProject = (p: Omit<Project, 'id'>) => {
    setProjects([...projects, { ...p, id: Math.random().toString(36).substr(2, 9) }])
  }

  return (
    <AppContext.Provider
      value={{
        prompts,
        addPrompt,
        clients,
        updateClientAssets,
        updateClientPreferences,
        updateAssetStatus,
        uiComponents,
        addUIComponent,
        deleteUIComponent,
        notificationSettings,
        updateNotificationSettings,
        projects,
        updateProjectStatus,
        addProject,
      }}
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
