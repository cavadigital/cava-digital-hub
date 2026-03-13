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

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <BranchProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
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
              <Route path="/deploy-monitor" element={<DeployMonitor />} />
              <Route path="/portal-cliente" element={<ClientPortal />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AppProvider>
    </BranchProvider>
  </BrowserRouter>
)

export default App
