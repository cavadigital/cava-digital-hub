import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  UploadCloud,
  Code,
  Settings2,
  FileJson,
  Loader2,
  Copy,
  Check,
  Rocket,
  Shield,
} from 'lucide-react'
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
import { SavePromptDialog, BrowsePromptsDialog } from '@/components/PromptsLibrary'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface CodeResult {
  html: string
  css: string
  js: string
}

export default function DevHub() {
  const [platform, setPlatform] = useState('Wake')
  const [devPrompt, setDevPrompt] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [codeResult, setCodeResult] = useState<CodeResult | null>(null)
  const [copiedTab, setCopiedTab] = useState<string | null>(null)

  // Direct Deploy States
  const [deployModalOpen, setDeployModalOpen] = useState(false)
  const [deployPlatform, setDeployPlatform] = useState(platform)
  const [deployStatus, setDeployStatus] = useState<
    'idle' | 'verifying' | 'verified' | 'pushing' | 'success'
  >('idle')

  const handleConvert = () => {
    setIsConverting(true)
    setCodeResult(null)

    setTimeout(() => {
      setCodeResult({
        html: `<!-- Configuração para ${platform} -->\n<div class="cava-custom-layout">\n  <header class="cava-header">\n    <nav class="container">\n      <ul class="flex items-center justify-between">\n        <li><a href="#">Shop</a></li>\n        <li><a href="#">About</a></li>\n      </ul>\n    </nav>\n  </header>\n</div>`,
        css: `/* Estilos Otimizados para ${platform} */\n:root {\n  --brand-primary: #ff4b4b;\n}\n\n.cava-custom-layout {\n  font-family: system-ui, sans-serif;\n}`,
        js: `// Javascript Customizations for Dynamic Behaviors\ndocument.addEventListener('DOMContentLoaded', () => {\n  console.log('Script loaded for ${platform}');\n});`,
      })
      setIsConverting(false)
    }, 3000)
  }

  const handleCopy = (text: string, tab: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTab(tab)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  const openDeployModal = () => {
    setDeployPlatform(platform)
    setDeployStatus('idle')
    setDeployModalOpen(true)
  }

  const handleVerify = () => {
    setDeployStatus('verifying')
    setTimeout(() => setDeployStatus('verified'), 1500)
  }

  const handlePush = () => {
    setDeployStatus('pushing')
    setTimeout(() => setDeployStatus('success'), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
          <Code className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">AI Code Copilot</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Faça upload do layout de design, defina instruções por prompt e gere código pronto para
          implantação em plataformas e-commerce.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-subtle border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">AI Code Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Layout Design (XD/Figma Export)</Label>
                <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                  <UploadCloud className="h-8 w-8 mx-auto text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Arraste o arquivo aqui
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Plataforma Alvo</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Selecione a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wake">Wake Commerce</SelectItem>
                    <SelectItem value="Tray">Tray</SelectItem>
                    <SelectItem value="Nuvemshop">Nuvemshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center mb-1">
                  <Label>Instruções Adicionais (Prompt)</Label>
                  <div className="flex gap-2">
                    <BrowsePromptsDialog onSelect={setDevPrompt} />
                    <SavePromptDialog currentText={devPrompt} defaultCategory="Dev CSS/JS" />
                  </div>
                </div>
                <Textarea
                  value={devPrompt}
                  onChange={(e) => setDevPrompt(e.target.value)}
                  placeholder="Detalhes específicos para a IA. Ex: Usar flexbox, focar em acessibilidade, seguir BEM CSS..."
                  className="h-28 resize-none text-sm"
                />
              </div>

              <Button
                className="w-full font-bold shadow-md"
                size="lg"
                onClick={handleConvert}
                disabled={isConverting}
              >
                {isConverting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando Layout e Prompt...
                  </>
                ) : (
                  <>
                    <Code className="mr-2 h-5 w-5" /> Generate Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          {codeResult ? (
            <Card className="h-full shadow-elevation border-primary/20 bg-background overflow-hidden animate-fade-in flex flex-col">
              <CardHeader className="border-b bg-muted/30 pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Check className="h-5 w-5 text-success" /> Código Gerado ({platform})
                  </CardTitle>
                </div>
                <Button
                  onClick={openDeployModal}
                  className="bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                >
                  <Rocket className="mr-2 h-4 w-4" /> Direct Deploy
                </Button>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col min-h-[500px]">
                <Tabs defaultValue="html" className="flex-1 flex flex-col h-full rounded-none">
                  <TabsList className="w-full justify-start rounded-none border-b bg-muted/10 h-12 px-4">
                    <TabsTrigger value="html" className="data-[state=active]:bg-background">
                      HTML
                    </TabsTrigger>
                    <TabsTrigger value="css" className="data-[state=active]:bg-background">
                      CSS
                    </TabsTrigger>
                    <TabsTrigger value="js" className="data-[state=active]:bg-background">
                      Javascript
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex-1 relative bg-[#0d1117]">
                    <TabsContent value="html" className="m-0 h-full absolute inset-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-4 right-4 z-10 opacity-70 hover:opacity-100 bg-white/10 text-white border-none"
                        onClick={() => handleCopy(codeResult.html, 'html')}
                      >
                        {copiedTab === 'html' ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}{' '}
                        Copiar
                      </Button>
                      <div className="p-6 overflow-auto h-full text-sm font-mono text-[#e6edf3]">
                        <pre>
                          <code>{codeResult.html}</code>
                        </pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="css" className="m-0 h-full absolute inset-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-4 right-4 z-10 opacity-70 hover:opacity-100 bg-white/10 text-white border-none"
                        onClick={() => handleCopy(codeResult.css, 'css')}
                      >
                        {copiedTab === 'css' ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}{' '}
                        Copiar
                      </Button>
                      <div className="p-6 overflow-auto h-full text-sm font-mono text-[#7ee787]">
                        <pre>
                          <code>{codeResult.css}</code>
                        </pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="js" className="m-0 h-full absolute inset-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-4 right-4 z-10 opacity-70 hover:opacity-100 bg-white/10 text-white border-none"
                        onClick={() => handleCopy(codeResult.js, 'js')}
                      >
                        {copiedTab === 'js' ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}{' '}
                        Copiar
                      </Button>
                      <div className="p-6 overflow-auto h-full text-sm font-mono text-[#79c0ff]">
                        <pre>
                          <code>{codeResult.js}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full min-h-[500px] shadow-subtle border-dashed bg-muted/10 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Code className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aguardando Configurações</h3>
              <p className="text-muted-foreground max-w-md">
                Defina o arquivo de design e forneça as instruções detalhadas (ou use um Prompt
                Vencedor) para a IA gerar uma marcação estrutural perfeita.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Direct Deploy Modal */}
      <Dialog
        open={deployModalOpen}
        onOpenChange={(open) => {
          setDeployModalOpen(open)
          if (!open) setDeployStatus('idle')
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
              <Label>Plataforma de Destino</Label>
              <Select value={deployPlatform} onValueChange={setDeployPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wake">Wake Commerce</SelectItem>
                  <SelectItem value="Tray">Tray</SelectItem>
                  <SelectItem value="Nuvemshop">Nuvemshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>API Key / Store Token</Label>
              <Input type="password" placeholder="••••••••••••••••••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Environment URL (opcional)</Label>
              <Input placeholder="https://..." />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleVerify}
                disabled={deployStatus !== 'idle'}
                className="flex-1"
              >
                {deployStatus === 'verifying' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : deployStatus === 'verified' ||
                  deployStatus === 'pushing' ||
                  deployStatus === 'success' ? (
                  <Check className="h-4 w-4 mr-2 text-success" />
                ) : (
                  <Shield className="h-4 w-4 mr-2" />
                )}
                {deployStatus === 'verifying'
                  ? 'Verificando...'
                  : deployStatus === 'idle'
                    ? 'Verificar Conexão'
                    : 'Conectado'}
              </Button>
              <Button
                onClick={handlePush}
                disabled={deployStatus !== 'verified'}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {deployStatus === 'pushing' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Rocket className="h-4 w-4 mr-2" />
                )}
                {deployStatus === 'pushing'
                  ? 'Enviando...'
                  : deployStatus === 'success'
                    ? 'Código Injetado!'
                    : 'Push Code'}
              </Button>
            </div>

            {deployStatus === 'success' && (
              <div className="p-3 mt-2 bg-success/10 text-success text-sm rounded-md border border-success/20 flex items-start">
                <Check className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                <p>
                  Transferência concluída. Arquivos HTML, CSS e JS injetados no editor de template
                  da <b>{deployPlatform}</b> via API.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
