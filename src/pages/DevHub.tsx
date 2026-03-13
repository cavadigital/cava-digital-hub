import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UploadCloud, Code, Settings2, FileJson, Loader2, Copy, Check } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CodeResult {
  html: string
  css: string
  js: string
}

export default function DevHub() {
  const [platform, setPlatform] = useState('Wake')
  const [isConverting, setIsConverting] = useState(false)
  const [codeResult, setCodeResult] = useState<CodeResult | null>(null)
  const [copiedTab, setCopiedTab] = useState<string | null>(null)

  const handleConvert = () => {
    setIsConverting(true)
    setCodeResult(null)

    // Simulate AI Conversion
    setTimeout(() => {
      setCodeResult({
        html: `<!-- Configuração para ${platform} -->\n<div class="cava-custom-layout">\n  <header class="cava-header">\n    <nav class="container">\n      <ul class="flex items-center justify-between">\n        <li><a href="#">Shop</a></li>\n        <li><a href="#">About</a></li>\n      </ul>\n    </nav>\n  </header>\n  <main class="cava-main-content">\n    <section class="hero-banner">\n      <h1>Nova Coleção de Verão</h1>\n      <button class="btn-primary">Comprar Agora</button>\n    </section>\n  </main>\n</div>`,
        css: `/* Estilos Otimizados para ${platform} */\n:root {\n  --brand-primary: #ff4b4b;\n  --spacing-base: 1rem;\n}\n\n.cava-custom-layout {\n  font-family: system-ui, sans-serif;\n  color: #333;\n}\n\n.hero-banner {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: calc(var(--spacing-base) * 4);\n  background: #f8f9fa;\n  border-radius: 8px;\n}\n\n.btn-primary {\n  background-color: var(--brand-primary);\n  color: white;\n  padding: 12px 24px;\n  border-radius: 4px;\n  transition: opacity 0.2s ease;\n}\n\n.btn-primary:hover {\n  opacity: 0.9;\n}`,
        js: `// Javascript Customizations for Dynamic Behaviors\ndocument.addEventListener('DOMContentLoaded', () => {\n  const heroBtn = document.querySelector('.btn-primary');\n  \n  if(heroBtn) {\n    heroBtn.addEventListener('click', (e) => {\n      e.preventDefault();\n      // Custom analytics tracking for ${platform}\n      console.log('Hero button clicked - tracking event fired');\n      \n      // Smooth scroll to products\n      window.scrollTo({\n        top: document.querySelector('.products-grid')?.offsetTop || 500,\n        behavior: 'smooth'\n      });\n    });\n  }\n});`,
      })
      setIsConverting(false)
    }, 3000)
  }

  const handleCopy = (text: string, tab: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTab(tab)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
          <Code className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">AI Code Copilot</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Faça upload do layout de design e converta instantaneamente para código otimizado, pronto
          para implantação em plataformas e-commerce.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-subtle border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">AI Code Implementation</CardTitle>
              <CardDescription>Configurações de conversão do layout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Layout Design (XD/Figma Export)</Label>
                <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                  <UploadCloud className="h-8 w-8 mx-auto text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Arraste o arquivo aqui
                  </p>
                  <p className="text-xs text-muted-foreground">Screenshots ou .fig (Máx 50MB)</p>
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

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-sm p-2 rounded bg-muted/40">
                  <span className="flex items-center text-muted-foreground">
                    <Settings2 className="mr-2 h-4 w-4" /> BEM CSS / Tailwind
                  </span>
                  <Check className="h-4 w-4 text-success" />
                </div>
                <div className="flex items-center justify-between text-sm p-2 rounded bg-muted/40">
                  <span className="flex items-center text-muted-foreground">
                    <FileJson className="mr-2 h-4 w-4" /> SEO & Acessibilidade
                  </span>
                  <Check className="h-4 w-4 text-success" />
                </div>
              </div>

              <Button
                className="w-full font-bold shadow-md"
                size="lg"
                onClick={handleConvert}
                disabled={isConverting}
              >
                {isConverting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando Layout...
                  </>
                ) : (
                  <>
                    <Code className="mr-2 h-5 w-5" /> Convert to Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {codeResult ? (
            <Card className="h-full shadow-elevation border-primary/20 bg-background overflow-hidden animate-fade-in flex flex-col">
              <CardHeader className="border-b bg-muted/30 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="h-5 w-5 text-success" />
                  Código Gerado com Sucesso ({platform})
                </CardTitle>
                <CardDescription>
                  Pronto para ser copiado para o editor da plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col min-h-[500px]">
                <Tabs defaultValue="html" className="flex-1 flex flex-col h-full rounded-none">
                  <TabsList className="w-full justify-start rounded-none border-b bg-muted/10 h-12 px-4">
                    <TabsTrigger value="html" className="data-[state=active]:bg-background">
                      HTML Estrutural
                    </TabsTrigger>
                    <TabsTrigger value="css" className="data-[state=active]:bg-background">
                      CSS Styling
                    </TabsTrigger>
                    <TabsTrigger
                      value="js"
                      className="data-[state=active]:bg-background flex items-center"
                    >
                      Javascript Customizations
                      <span className="ml-2 h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1 relative bg-[#0d1117]">
                    <TabsContent value="html" className="m-0 h-full absolute inset-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-4 right-4 z-10 opacity-70 hover:opacity-100 bg-white/10 hover:bg-white/20 text-white border-none"
                        onClick={() => handleCopy(codeResult.html, 'html')}
                      >
                        {copiedTab === 'html' ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {copiedTab === 'html' ? 'Copiado!' : 'Copiar'}
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
                        className="absolute top-4 right-4 z-10 opacity-70 hover:opacity-100 bg-white/10 hover:bg-white/20 text-white border-none"
                        onClick={() => handleCopy(codeResult.css, 'css')}
                      >
                        {copiedTab === 'css' ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {copiedTab === 'css' ? 'Copiado!' : 'Copiar'}
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
                        className="absolute top-4 right-4 z-10 opacity-70 hover:opacity-100 bg-white/10 hover:bg-white/20 text-white border-none"
                        onClick={() => handleCopy(codeResult.js, 'js')}
                      >
                        {copiedTab === 'js' ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {copiedTab === 'js' ? 'Copiado!' : 'Copiar'}
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
              <h3 className="text-xl font-semibold mb-2">Aguardando Layout</h3>
              <p className="text-muted-foreground max-w-md">
                Faça o upload do design e clique em "Convert to Code". A IA irá analisar a estrutura
                visual e gerar marcação e estilos semânticos.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
