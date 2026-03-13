import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UploadCloud, Code, Loader2, Copy, Check, Rocket, Shield } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { SavePromptDialog, SmartPromptSuggestions } from '@/components/PromptsLibrary'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { CodeResult } from '@/pages/DevHub'

interface DevHubCopilotProps {
  codeResult: CodeResult | null
  setCodeResult: (res: CodeResult | null) => void
}

export function DevHubCopilot({ codeResult, setCodeResult }: DevHubCopilotProps) {
  const [platform, setPlatform] = useState('Wake')
  const [devPrompt, setDevPrompt] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [copiedTab, setCopiedTab] = useState<string | null>(null)
  const [deployModalOpen, setDeployModalOpen] = useState(false)
  const [deployStatus, setDeployStatus] = useState<
    'idle' | 'verifying' | 'verified' | 'pushing' | 'success'
  >('idle')

  const handleConvert = () => {
    setIsConverting(true)
    setTimeout(() => {
      setCodeResult({
        html: `<!-- Configuração para ${platform} -->\n<div class="cava-custom-layout">\n  <header class="cava-header">...</header>\n</div>`,
        css: `/* Estilos Otimizados para ${platform} */\n:root { --brand-primary: #ff4b4b; }\n.cava-custom-layout { font-family: sans-serif; }`,
        js: `document.addEventListener('DOMContentLoaded', () => { console.log('Init ${platform}'); });`,
      })
      setIsConverting(false)
    }, 2000)
  }

  const handleCopy = (text: string, tab: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTab(tab)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8 mt-2">
      <div className="lg:col-span-5 space-y-6">
        <Card className="shadow-subtle border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">AI Code Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Layout Design (XD/Figma Export)</Label>
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                <UploadCloud className="h-6 w-6 mx-auto text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-semibold mb-1">Arraste o arquivo aqui</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Plataforma Alvo</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wake">Wake</SelectItem>
                  <SelectItem value="Tray">Tray</SelectItem>
                  <SelectItem value="Nuvemshop">Nuvemshop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center mb-1">
                <Label>Instruções (Prompt)</Label>
                <SavePromptDialog currentText={devPrompt} defaultCategory={platform} />
              </div>
              <Textarea
                value={devPrompt}
                onChange={(e) => setDevPrompt(e.target.value)}
                placeholder="Detalhes específicos para a IA..."
                className="h-24 resize-none text-sm"
              />
              <SmartPromptSuggestions category={platform} onSelect={setDevPrompt} />
            </div>

            <Button
              className="w-full font-bold shadow-md"
              size="lg"
              onClick={handleConvert}
              disabled={isConverting}
            >
              {isConverting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Code className="mr-2 h-5 w-5" />
              )}
              {isConverting ? 'Processando...' : 'Gerar Código'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-7">
        {codeResult ? (
          <Card className="h-full shadow-elevation border-primary/20 bg-background overflow-hidden flex flex-col min-h-[500px]">
            <CardHeader className="border-b bg-muted/30 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Check className="h-5 w-5 text-success" /> Código Gerado ({platform})
              </CardTitle>
              <Button
                onClick={() => setDeployModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Rocket className="mr-2 h-4 w-4" /> Direct Deploy
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <Tabs defaultValue="html" className="flex-1 flex flex-col rounded-none">
                <TabsList className="w-full justify-start rounded-none border-b bg-muted/10 h-12 px-4">
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="js">Javascript</TabsTrigger>
                </TabsList>
                <div className="flex-1 relative bg-[#0d1117] p-6 text-sm font-mono overflow-auto h-[400px]">
                  {['html', 'css', 'js'].map((tab) => (
                    <TabsContent key={tab} value={tab} className="m-0 h-full">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-4 right-4 z-10 opacity-70 hover:opacity-100 bg-white/10 text-white border-none"
                        onClick={() => handleCopy(codeResult[tab as keyof CodeResult], tab)}
                      >
                        {copiedTab === tab ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}{' '}
                        Copiar
                      </Button>
                      <pre
                        className={`text-[#${tab === 'html' ? 'e6edf3' : tab === 'css' ? '7ee787' : '79c0ff'}]`}
                      >
                        <code>{codeResult[tab as keyof CodeResult]}</code>
                      </pre>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full min-h-[500px] shadow-subtle border-dashed bg-muted/10 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
              <Code className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aguardando Configurações</h3>
            <p className="text-muted-foreground max-w-md">
              Forneça as instruções para a IA gerar código ou importe blocos da Component Library.
            </p>
          </Card>
        )}
      </div>

      <Dialog
        open={deployModalOpen}
        onOpenChange={(o) => {
          setDeployModalOpen(o)
          if (!o) setDeployStatus('idle')
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-purple-600" /> Direct Deploy Integration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDeployStatus('verifying')
                  setTimeout(() => setDeployStatus('verified'), 1000)
                }}
                disabled={deployStatus !== 'idle'}
                className="flex-1"
              >
                {deployStatus === 'idle' ? 'Conectar' : 'Conectado'}
              </Button>
              <Button
                onClick={() => {
                  setDeployStatus('pushing')
                  setTimeout(() => setDeployStatus('success'), 1500)
                }}
                disabled={deployStatus !== 'verified'}
                className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
              >
                {deployStatus === 'pushing' ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : null}{' '}
                Push Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
