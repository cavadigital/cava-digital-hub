import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { MOCK_PROJECTS } from '@/lib/data'
import { toast } from 'sonner'

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
  estimatedHours?: number
  actualHours?: number
}

export type TimeLogStatus = 'Rascunho' | 'Pendente' | 'Aprovado' | 'Rejeitado'

export type TimeLog = {
  id: string
  date: string
  time: string
  type: string
  project?: string
  status: TimeLogStatus
}

export type TeamLog = {
  id: string
  empName: string
  date: string
  hours: string
  project: string
  status: TimeLogStatus
}

export type Holiday = {
  id: string
  date: string
  description: string
}

export type ManagementLog = {
  id: string
  timestamp: string
  manager: string
  employee: string
  action: string
  details: string
}

export type Meeting = {
  id: string
  date: string
  time: string
  endTime: string
  title: string
  type: string
  source: 'internal' | 'google'
  description?: string
  guests?: string
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
  attendanceState: 'idle' | 'working' | 'paused'
  lastEntry: Date | null
  myTimeLogs: TimeLog[]
  addTimeLog: (log: Omit<TimeLog, 'id'>) => void
  teamLogs: TeamLog[]
  setAttendanceRecord: (
    newState: 'idle' | 'working' | 'paused',
    actionName: string,
    project?: string,
  ) => void
  requestTimeLogApproval: (id: string) => void
  reviewTeamLog: (id: string, newStatus: 'Aprovado' | 'Rejeitado') => void
  weeklyGoal: number
  setWeeklyGoal: (goal: number) => void
  holidays: Holiday[]
  addHoliday: (date: string, description: string) => void
  removeHoliday: (id: string) => void
  managementLogs: ManagementLog[]
  getEffectiveGoal: (baseGoal: number, type: 'week' | 'month') => number
  meetings: Meeting[]
  addMeeting: (m: Omit<Meeting, 'id'>) => void
  updateMeeting: (id: string, m: Partial<Meeting>) => void
  deleteMeeting: (id: string) => void
  isGoogleConnected: boolean
  toggleGoogleConnection: () => void
  meetingToConvert: Meeting | null
  setMeetingToConvert: (m: Meeting | null) => void
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

  const [attendanceState, setAttendanceState] = useState<'idle' | 'working' | 'paused'>('idle')
  const [lastEntry, setLastEntry] = useState<Date | null>(null)

  const [myTimeLogs, setMyTimeLogs] = useState<TimeLog[]>([
    {
      id: '1',
      date: new Date().toLocaleDateString('pt-BR'),
      time: '08:55',
      type: 'Entrada',
      project: '-',
      status: 'Rascunho',
    },
  ])

  const [teamLogs, setTeamLogs] = useState<TeamLog[]>([
    {
      id: 't1',
      empName: 'Ana Silva',
      date: new Date().toLocaleDateString('pt-BR'),
      hours: '4h 30m',
      project: 'Implantação Wake',
      status: 'Pendente',
    },
    {
      id: 't2',
      empName: 'Carlos Santos',
      date: new Date().toLocaleDateString('pt-BR'),
      hours: '6h 00m',
      project: 'Migração Tray',
      status: 'Pendente',
    },
  ])

  const [weeklyGoal, setWeeklyGoal] = useState<number>(40)

  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [managementLogs, setManagementLogs] = useState<ManagementLog[]>([
    {
      id: 'ml1',
      timestamp: new Date(Date.now() - 86400000).toLocaleString('pt-BR'),
      manager: 'Admin CAVA',
      employee: 'Ana Silva',
      action: 'Ponto Aprovado',
      details:
        'Data: ' + new Date(Date.now() - 86400000).toLocaleDateString('pt-BR') + ' | Horas: 8h 10m',
    },
  ])

  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [meetingToConvert, setMeetingToConvert] = useState<Meeting | null>(null)

  const [notifiedWa, setNotifiedWa] = useState<Set<string>>(new Set())
  const [promptedConv, setPromptedConv] = useState<Set<string>>(new Set())

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const today = new Date().toISOString().split('T')[0]
    const now = new Date()

    const m1Time = new Date(now.getTime() - 30 * 60000).toTimeString().slice(0, 5)
    const m1End = new Date(now.getTime() - 1 * 60000).toTimeString().slice(0, 5)

    const m2Time = new Date(now.getTime() + 15 * 60000).toTimeString().slice(0, 5)
    const m2End = new Date(now.getTime() + 45 * 60000).toTimeString().slice(0, 5)

    return [
      {
        id: 'debug-post-meeting',
        date: today,
        time: m1Time,
        endTime: m1End,
        title: 'Review Rápida (Test Time)',
        type: 'Interna',
        source: 'internal',
        description:
          'Mock de reunião recém-encerrada para testar o prompt de conversão automática.',
      },
      {
        id: 'debug-wa-reminder',
        date: today,
        time: m2Time,
        endTime: m2End,
        title: 'Call de Alinhamento (Test WA)',
        type: 'Reunião Externa',
        source: 'internal',
        description: 'Mock para testar lembrete de WhatsApp de 15 mins.',
        guests: 'cliente@exemplo.com',
      },
      {
        id: '1',
        date: today,
        time: '09:00',
        endTime: '10:00',
        title: 'Kickoff Nova Nuvemshop',
        type: 'Reunião Externa',
        source: 'internal',
        description: 'Revisão inicial do projeto de implantação da Nuvemshop.',
        guests: 'cliente@loja.com',
      },
      {
        id: '2',
        date: today,
        time: '14:00',
        endTime: '15:00',
        title: 'Apresentação de Layout',
        type: 'Reunião Externa',
        source: 'internal',
        description: 'Design do novo checkout para aprovação do stakeholder.',
        guests: 'aprovacao@cliente.com',
      },
    ]
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const todayStr = now.toISOString().split('T')[0]
      const currentMs = now.getTime()

      meetings.forEach((m) => {
        if (m.date === todayStr) {
          const [sh, sm] = m.time.split(':').map(Number)
          const startMs = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            sh,
            sm,
          ).getTime()

          const [eh, em] = m.endTime ? m.endTime.split(':').map(Number) : [sh + 1, sm]
          const endMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eh, em).getTime()

          const timeToStart = startMs - currentMs
          // Exatamente 15 minutos antes
          if (timeToStart > 14 * 60000 && timeToStart <= 16 * 60000 && !notifiedWa.has(m.id)) {
            toast.success('Lembrete Automático Enviado 🟢', {
              description: `Mensagem WhatsApp enviada: "Olá! Sua reunião '${m.title}' começará em breve às ${m.time}."`,
            })
            setNotifiedWa((prev) => new Set(prev).add(m.id))
          }

          const timeSinceEnd = currentMs - endMs
          // Logo após o término agendado
          if (timeSinceEnd >= 0 && timeSinceEnd <= 5 * 60000 && !promptedConv.has(m.id)) {
            toast('Reunião Encerrada', {
              description: `Deseja converter o tempo da reunião "${m.title}" em um registro de horas para o projeto?`,
              action: {
                label: 'Converter Tempo',
                onClick: () => setMeetingToConvert(m),
              },
              duration: 15000,
            })
            setPromptedConv((prev) => new Set(prev).add(m.id))
          }
        }
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [meetings, notifiedWa, promptedConv])

  const toggleGoogleConnection = () => {
    setIsGoogleConnected((prev) => {
      const next = !prev
      if (next) {
        setMeetings((current) => {
          if (current.some((m) => m.id === 'mock-google-1')) return current
          return [
            ...current,
            {
              id: 'mock-google-1',
              date: new Date().toISOString().split('T')[0],
              time: '11:30',
              endTime: '12:15',
              title: 'Sync de Performance - Lojas Renner',
              type: 'Interna',
              source: 'google',
              description: 'Evento sincronizado bidirecionalmente com o Google Calendar.',
              guests: 'equipe@cavadigital.com.br',
            },
          ]
        })
      } else {
        setMeetings((current) => current.filter((m) => m.source !== 'google'))
      }
      return next
    })
  }

  const addMeeting = (m: Omit<Meeting, 'id'>) => {
    setMeetings((prev) => [...prev, { ...m, id: Math.random().toString(36).substring(2, 9) }])
  }

  const updateMeeting = (id: string, updates: Partial<Meeting>) => {
    setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }

  const deleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id))
  }

  const addHoliday = (date: string, description: string) => {
    const d = new Date(date)
    setHolidays((prev) => [
      ...prev,
      { id: Math.random().toString(36).substr(2, 9), date, description },
    ])
    setManagementLogs((prev) => [
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleString('pt-BR'),
        manager: 'Admin CAVA',
        employee: 'Todos',
        action: 'Adição de Feriado',
        details: `Data: ${d.toLocaleDateString('pt-BR')} - ${description}`,
      },
      ...prev,
    ])
  }

  const removeHoliday = (id: string) => {
    const h = holidays.find((x) => x.id === id)
    if (h) {
      setManagementLogs((prev) => [
        {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toLocaleString('pt-BR'),
          manager: 'Admin CAVA',
          employee: 'Todos',
          action: 'Remoção de Feriado',
          details: `Data: ${new Date(h.date).toLocaleDateString('pt-BR')} - ${h.description}`,
        },
        ...prev,
      ])
    }
    setHolidays((prev) => prev.filter((x) => x.id !== id))
  }

  const getEffectiveGoal = (baseGoal: number, type: 'week' | 'month') => {
    const now = new Date()
    let daysToSubtract = 0

    if (type === 'week') {
      const start = new Date(now)
      start.setDate(now.getDate() - now.getDay())
      start.setHours(0, 0, 0, 0)

      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)

      daysToSubtract = holidays.filter((h) => {
        const d = new Date(h.date)
        return d >= start && d <= end
      }).length
    } else {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      end.setHours(23, 59, 59, 999)

      daysToSubtract = holidays.filter((h) => {
        const d = new Date(h.date)
        return d >= start && d <= end
      }).length
    }

    const totalSubtracted = daysToSubtract * 8
    const calculatedGoal = (type === 'week' ? baseGoal : baseGoal * 4) - totalSubtracted
    return calculatedGoal > 0 ? calculatedGoal : 0
  }

  const setAttendanceRecord = (
    newState: 'idle' | 'working' | 'paused',
    actionName: string,
    project?: string,
  ) => {
    const now = new Date()
    setAttendanceState(newState)
    setLastEntry(now)
    setMyTimeLogs((prev) => [
      {
        id: Math.random().toString(36).substr(2, 9),
        date: now.toLocaleDateString('pt-BR'),
        time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        type: actionName,
        project: project || '-',
        status: 'Rascunho',
      },
      ...prev,
    ])
  }

  const addTimeLog = (log: Omit<TimeLog, 'id'>) => {
    setMyTimeLogs((prev) => [{ ...log, id: Math.random().toString(36).substring(2, 9) }, ...prev])
  }

  const requestTimeLogApproval = (id: string) => {
    setMyTimeLogs((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'Pendente' } : l)))
    const log = myTimeLogs.find((l) => l.id === id)
    if (log) {
      setTeamLogs((prev) => [
        {
          id: log.id,
          empName: 'Admin CAVA',
          date: log.date,
          hours: 'Em andamento',
          project: log.project || '-',
          status: 'Pendente',
        },
        ...prev,
      ])
    }
  }

  const reviewTeamLog = (id: string, newStatus: 'Aprovado' | 'Rejeitado') => {
    const log = teamLogs.find((l) => l.id === id)
    if (log) {
      const now = new Date()
      setManagementLogs((prev) => [
        {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: now.toLocaleString('pt-BR'),
          manager: 'Admin CAVA',
          employee: log.empName,
          action: `Ponto ${newStatus}`,
          details: `Data: ${log.date} | Horas: ${log.hours}`,
        },
        ...prev,
      ])
    }

    setTeamLogs((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)))
    setMyTimeLogs((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)))
  }

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
        attendanceState,
        lastEntry,
        myTimeLogs,
        addTimeLog,
        teamLogs,
        setAttendanceRecord,
        requestTimeLogApproval,
        reviewTeamLog,
        weeklyGoal,
        setWeeklyGoal,
        holidays,
        addHoliday,
        removeHoliday,
        managementLogs,
        getEffectiveGoal,
        meetings,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        isGoogleConnected,
        toggleGoogleConnection,
        meetingToConvert,
        setMeetingToConvert,
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
