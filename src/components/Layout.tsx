import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  CalendarDays,
  Kanban,
  Briefcase,
  CircleDollarSign,
  Palette,
  Code2,
  Megaphone,
  Users,
  Search,
  Bell,
  Settings,
  LogOut,
  Activity,
  MonitorSmartphone,
  BarChart3,
  BookOpen,
  User,
  TrendingUp,
  Clock,
  Receipt,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useBranch } from './BranchContext'
import { useAppContext } from './AppContext'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
  { title: 'Dash Executivo', icon: TrendingUp, url: '/dashboard-executivo' },
  { title: 'Agenda', icon: CalendarDays, url: '/agenda' },
  { title: 'Projetos', icon: Kanban, url: '/projetos' },
  { title: 'Clientes', icon: Briefcase, url: '/clientes' },
  { title: 'Financeiro', icon: CircleDollarSign, url: '/financeiro' },
  { title: 'Faturas & Cobranças', icon: Receipt, url: '/faturas' },
  { title: 'Colaboradores', icon: Users, url: '/rh' },
  { title: 'Studio Criativo', icon: Palette, url: '/studio' },
  { title: 'Dev Hub', icon: Code2, url: '/devhub' },
  { title: 'Marketing Hub', icon: Megaphone, url: '/marketing' },
  { title: 'Analytics IA', icon: BarChart3, url: '/analytics' },
]

const externalItems = [
  { title: 'Monitor de Deploys', icon: Activity, url: '/deploy-monitor' },
  { title: 'Portal do Cliente', icon: MonitorSmartphone, url: '/portal-cliente' },
  { title: 'Relatório Executivo', icon: BookOpen, url: '/relatorio-executivo' },
]

export default function Layout() {
  const location = useLocation()
  const { currentBranch, setBranch } = useBranch()
  const { meetingToConvert, setMeetingToConvert, projects, addTimeLog, currentUser } =
    useAppContext()

  const [logTitle, setLogTitle] = useState('')
  const [logDuration, setLogDuration] = useState('')
  const [logProject, setLogProject] = useState('')

  useEffect(() => {
    if (meetingToConvert) {
      setLogTitle(meetingToConvert.title)
      const [sh, sm] = meetingToConvert.time.split(':').map(Number)
      const [eh, em] = meetingToConvert.endTime.split(':').map(Number)
      let diff = eh * 60 + em - (sh * 60 + sm)
      if (diff <= 0) diff = 60
      const h = Math.floor(diff / 60)
      const m = diff % 60
      setLogDuration(`${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm' : ''}`.trim())
      setLogProject('')
    }
  }, [meetingToConvert])

  const handleSaveTimeLog = () => {
    if (!logProject) {
      toast.error('Selecione um projeto para associar as horas.')
      return
    }
    addTimeLog({
      date: new Date().toLocaleDateString('pt-BR'),
      time: logDuration,
      type: 'Reunião',
      project: logProject,
      status: 'Rascunho',
    })
    setMeetingToConvert(null)
    toast.success('Horas registradas com sucesso!', {
      description: 'Acesse seu Perfil para solicitar aprovação.',
    })
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const term = e.currentTarget.value
      if (term) {
        toast.info('Pesquisa global iniciada', { description: `Buscando por: "${term}"...` })
      }
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar className="border-r border-sidebar-border shadow-elevation print:hidden">
          <SidebarHeader className="p-4 flex items-center justify-center h-20">
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
              <span className="text-sidebar-primary-foreground">CAVA</span>
              <span className="text-sidebar-primary">Digital</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname === item.url || location.pathname.startsWith(item.url + '/')
                    }
                    tooltip={item.title}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarSeparator className="my-4 mx-2 opacity-50" />
            <div className="px-2 mb-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Ferramentas
            </div>
            <SidebarMenu>
              {externalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium text-muted-foreground">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 bg-sidebar-accent rounded-md p-2 cursor-pointer hover:bg-sidebar-accent/80 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatarUrl} />
                    <AvatarFallback>
                      {currentUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-xs flex-1 min-w-0">
                    <span className="font-semibold text-sidebar-foreground truncate block">
                      {currentUser.name}
                    </span>
                    <span className="text-sidebar-foreground/70 truncate block">
                      {currentUser.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mb-2">
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="w-full cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" /> Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/configuracoes/notificacoes"
                    className="w-full cursor-pointer flex items-center"
                  >
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" /> Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => toast.info('Sessão encerrada.')}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sair do Sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 overflow-hidden w-full print:w-full print:bg-white print:overflow-visible">
          <header className="h-20 shrink-0 border-b bg-background/80 glass-effect flex items-center justify-between px-6 sticky top-0 z-10 print:hidden">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger />
              <div className="relative w-full max-w-md hidden md:flex">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar projetos, tarefas, clientes..."
                  className="pl-9 bg-muted/50 border-none focus-visible:ring-primary shadow-sm"
                  onKeyDown={handleSearch}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select value={currentBranch} onValueChange={(val: any) => setBranch(val)}>
                <SelectTrigger className="w-[160px] h-9 bg-muted/30 border-none shadow-subtle font-medium">
                  <SelectValue placeholder="Selecione a Filial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consolidado">Visão Global</SelectItem>
                  <SelectItem value="Blumenau">Filial Blumenau</SelectItem>
                  <SelectItem value="Curitiba">Filial Curitiba</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-muted"
                asChild
              >
                <Link to="/configuracoes/notificacoes">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                </Link>
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 md:p-8 bg-background animate-fade-in print:p-0 print:m-0 print:overflow-visible">
            <Outlet />
          </main>
        </SidebarInset>
      </div>

      <Dialog open={!!meetingToConvert} onOpenChange={(open) => !open && setMeetingToConvert(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Converter em Registro de Horas
            </DialogTitle>
            <DialogDescription>
              Deseja registrar essas {logDuration} em um projeto faturável?
            </DialogDescription>
          </DialogHeader>
          {meetingToConvert && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Título da Atividade</Label>
                <Input value={logTitle} onChange={(e) => setLogTitle(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Tempo Calculado</Label>
                <Input value={logDuration} readOnly className="bg-muted font-mono" />
                <p className="text-[10px] text-muted-foreground">
                  Extraído automaticamente do convite ({meetingToConvert.time} às{' '}
                  {meetingToConvert.endTime}).
                </p>
              </div>
              <div className="grid gap-2">
                <Label>
                  Projeto Associado <span className="text-destructive">*</span>
                </Label>
                <Select value={logProject} onValueChange={setLogProject}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Selecione um projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.title}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMeetingToConvert(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTimeLog}>Salvar Registro de Horas</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
