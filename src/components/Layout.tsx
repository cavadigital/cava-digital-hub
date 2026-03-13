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
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useBranch } from './BranchContext'

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
  { title: 'Dash Executivo', icon: TrendingUp, url: '/dashboard-executivo' },
  { title: 'Agenda', icon: CalendarDays, url: '/agenda' },
  { title: 'Projetos', icon: Kanban, url: '/projetos' },
  { title: 'Clientes', icon: Briefcase, url: '/clientes' },
  { title: 'Financeiro', icon: CircleDollarSign, url: '/financeiro' },
  { title: 'Studio Criativo', icon: Palette, url: '/studio' },
  { title: 'Dev Hub', icon: Code2, url: '/devhub' },
  { title: 'Marketing Hub', icon: Megaphone, url: '/marketing' },
  { title: 'Analytics IA', icon: BarChart3, url: '/analytics' },
  { title: 'RH & Equipe', icon: Users, url: '/rh' },
]

const externalItems = [
  { title: 'Monitor de Deploys', icon: Activity, url: '/deploy-monitor' },
  { title: 'Portal do Cliente', icon: MonitorSmartphone, url: '/portal-cliente' },
  { title: 'Relatório Executivo', icon: BookOpen, url: '/relatorio-executivo' },
]

export default function Layout() {
  const location = useLocation()
  const { currentBranch, setBranch } = useBranch()

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
                    isActive={location.pathname === item.url}
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
            <div className="flex items-center gap-3 bg-sidebar-accent rounded-md p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-xs">
                <span className="font-semibold text-sidebar-foreground">Admin CAVA</span>
                <span className="text-sidebar-foreground/70">admin@cavadigital</span>
              </div>
            </div>
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

              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/perfil" className="w-full cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" /> Perfil & Produtividade
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/configuracoes/notificacoes"
                      className="w-full cursor-pointer flex items-center"
                    >
                      <Bell className="mr-2 h-4 w-4" /> Notificações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 md:p-8 bg-background animate-fade-in print:p-0 print:m-0 print:overflow-visible">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
