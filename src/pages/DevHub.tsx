import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DevHubCopilot } from '@/components/devhub/DevHubCopilot'
import { DevHubLibrary } from '@/components/devhub/DevHubLibrary'
import { UIComponent } from '@/components/AppContext'
import { toast } from 'sonner'
import { Code, Layers } from 'lucide-react'

export interface CodeResult {
  html: string
  css: string
  js: string
}

export default function DevHub() {
  const [activeTab, setActiveTab] = useState('copilot')
  const [codeResult, setCodeResult] = useState<CodeResult | null>(null)

  const handleInject = (comp: UIComponent) => {
    if (codeResult) {
      setCodeResult({
        html: codeResult.html + '\n\n<!-- Injected: ' + comp.name + ' -->\n' + comp.code.html,
        css: codeResult.css + '\n\n/* Injected: ' + comp.name + ' */\n' + comp.code.css,
        js: codeResult.js + '\n\n// Injected: ' + comp.name + '\n' + comp.code.js,
      })
    } else {
      setCodeResult(comp.code)
    }
    setActiveTab('copilot')
    toast.success(`Componente "${comp.name}" injetado com sucesso no Copilot.`)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-12">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
          <Code className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Dev Hub & UI Library</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Gere código de layout com IA e injete componentes reutilizáveis direto nas plataformas de
          e-commerce.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 h-12 mx-auto mb-8">
          <TabsTrigger value="copilot" className="flex items-center gap-2">
            <Code className="w-4 h-4" /> AI Copilot
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Layers className="w-4 h-4" /> Component Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="copilot" className="m-0 border-0 p-0">
          <DevHubCopilot codeResult={codeResult} setCodeResult={setCodeResult} />
        </TabsContent>
        <TabsContent value="library" className="m-0 border-0 p-0">
          <DevHubLibrary onInject={handleInject} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
