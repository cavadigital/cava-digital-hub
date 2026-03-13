import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { BranchProvider } from '@/components/BranchContext'
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

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <BranchProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/projetos" element={<Projects />} />
            <Route path="/financeiro" element={<Finance />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/devhub" element={<DevHub />} />
            <Route path="/marketing" element={<MarketingHub />} />
            <Route path="/rh" element={<HR />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BranchProvider>
  </BrowserRouter>
)

export default App
