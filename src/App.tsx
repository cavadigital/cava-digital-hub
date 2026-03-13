import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { BranchProvider } from '@/components/BranchContext'
import { AppProvider } from '@/components/AppContext'
import Layout from './components/Layout'
import NotFound from './pages/NotFound'

// Pages
import Index from './pages/Index'
import Projects from './pages/Projects'
import Finance from './pages/Finance'
import Agenda from './pages/Agenda'
import Studio from './pages/Studio'
import DevHub from './pages/DevHub'
import MarketingHub from './pages/MarketingHub'
import HR from './pages/HR'
import Clients from './pages/Clients'
import DeployMonitor from './pages/DeployMonitor'
import ClientPortal from './pages/ClientPortal'
import Analytics from './pages/Analytics'
import NotificationSettings from './pages/NotificationSettings'
import ClientApproval from './pages/ClientApproval'
import Ecosystem from './pages/Ecosystem'
import Profile from './pages/Profile'
import ExecutiveDashboard from './pages/ExecutiveDashboard'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <BranchProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/aprovacao-cliente" element={<ClientApproval />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/projetos" element={<Projects />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/financeiro" element={<Finance />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/devhub" element={<DevHub />} />
              <Route path="/marketing" element={<MarketingHub />} />
              <Route path="/rh" element={<HR />} />
              <Route path="/dashboard-executivo" element={<ExecutiveDashboard />} />
              <Route path="/deploy-monitor" element={<DeployMonitor />} />
              <Route path="/portal-cliente" element={<ClientPortal />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/relatorio-executivo" element={<Ecosystem />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/configuracoes/notificacoes" element={<NotificationSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AppProvider>
    </BranchProvider>
  </BrowserRouter>
)

export default App
