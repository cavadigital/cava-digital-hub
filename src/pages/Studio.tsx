import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Link } from 'react-router-dom'
import {
  Wand2,
  Share2,
  ImageIcon,
  Loader2,
  Download,
  Palette,
  Code,
  Type,
  Send,
  SplitSquareHorizontal,
} from 'lucide-react'
import { useAppContext } from '@/components/AppContext'

type GeneratedAsset = {
  id: string
  type: string
  data?: string
  color?: string
  cta?: string
  label?: string
}

export default function Studio() {
  const { clients } = useAppContext()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([])

  const [projectType, setProjectType] = useState('bundle')
  const [preset, setPreset] = useState('1080x1080')
  const [customDims, setCustomDims] = useState('1200x400')
  const [prompt, setPrompt] = useState('')
  const [clientId, setClientId] = useState('none')
  const [isABTesting, setIsABTesting] = useState(false)

  // Real-time Style Editor State
  const [bundleColor, setBundleColor] = useState('#E3000F')
  const [bundleFont, setBundleFont] = useState('Inter')

  // Copywriting State
  const [offer, setOffer] = useState('')
  const [audience, setAudience] = useState('')
  const [copyLanguage, setCopyLanguage] = useState('pt-BR')
  const [copyVariations, setCopyVariations] = useState<{ headline: string; body: string }[]>([])
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false)

  // Interactive Components State
  const [interactiveType, setInteractiveType] = useState('button')
  const [interactiveColor, setInteractiveColor] = useState('#E3000F')
  const [interactiveText, setInteractiveText] = useState('Comprar Agora')
  const [generatedCode, setGeneratedCode] = useState('')

  const handleClientChange = (val: string) => {
    setClientId(val)
    if (val !== 'none') {
      const client = clients.find((c) => c.id === val)
      if (client) {
        if (client.assets.colors.length > 0) {
          setBundleColor(client.assets.colors[0].value)
          setInteractiveColor(client.assets.colors[0].value)
        }
        if (client.assets.fonts.value.primary) {
          setBundleFont(client.assets.fonts.value.primary)
        }
      }
    }
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const assets: GeneratedAsset[] = []
      const client = clients.find((c) => c.id === clientId)
      const secColor = client?.assets.colors[1]?.value || '#0055FF'

      if (projectType === 'bundle') {
        assets.push({
          id: 'a',
          type: 'bundle',
          cta: 'Adicionar Kit',
          label: 'Versão A (Foco em Ação)',
        })
        if (isABTesting) {
          assets.push({
            id: 'b',
            type: 'bundle',
            color: secColor,
            cta: 'Ver Detalhes',
            label: 'Versão B (Foco em Descoberta)',
          })
        }
      } else {
        let w = '1080',
          h = '1080'
        if (preset === 'custom') {
          const parts = customDims.split('x')
          if (parts.length === 2) {
            w = parts[0]
            h = parts[1]
          }
        } else {
          const parts = preset.split('x')
          if (parts.length === 2) {
            w = parts[0]
            h = parts[1]
          }
        }

        assets.push({
          id: 'a',
          type: 'image',
          data: `https://img.usecurling.com/p/${w}/${h}?q=${encodeURIComponent(prompt || 'marketing banner')}&color=gradient`,
          label: isABTesting ? 'Versão A' : '',
        })

        if (isABTesting) {
          assets.push({
            id: 'b',
            type: 'image',
            data: `https://img.usecurling.com/p/${w}/${h}?q=${encodeURIComponent(prompt || 'marketing banner')}&color=black&dpr=2`,
            label: 'Versão B (Contraste Alto)',
          })
        }
      }
      setGeneratedAssets(assets)
      setIsGenerating(false)
    }, 2000)
  }

  const handleGenerateCopy = () => {
    setIsGeneratingCopy(true)
    setTimeout(() => {
      let variations = []
      if (copyLanguage === 'en-US') {
        variations = [
          {
            headline: `Exclusive Offer: ${offer}!`,
            body: `For you who are ${audience}, enjoy this unique opportunity to transform your day to day.`,
          },
          {
            headline: `Don't Miss Out: ${offer} OFF`,
            body: `Renew your style today. People from ${audience} are already enjoying the best discounts of the year!`,
          },
          {
            headline: `Last Hours: ${offer}`,
            body: `The perfect opportunity for ${audience} to save with intelligence. Get it now!`,
          },
        ]
      } else if (copyLanguage === 'es-ES') {
        variations = [
          {
            headline: `Oferta Exclusiva: ${offer}!`,
            body: `Para ti que eres ${audience}, aprovecha esta oportunidad única para transformar tu día a día.`,
          },
          {
            headline: `No Te Lo Pierdas: ${offer} OFF`,
            body: `Renueva tu estilo hoy mismo. ¡El público de ${audience} ya está aprovechando los mejores descuentos del año!`,
          },
          {
            headline: `Últimas Horas: ${offer}`,
            body: `La oportunidad perfecta para que ${audience} ahorre con inteligencia. ¡Asegúralo ahora!`,
          },
        ]
      } else {
        variations = [
          {
            headline: `Oferta Exclusiva: ${offer}!`,
            body: `Para você que é ${audience}, aproveite essa oportunidade única para transformar seu dia a dia com a CAVA Digital.`,
          },
          {
            headline: `Não Perca: ${offer} OFF`,
            body: `Renove seu estilo hoje mesmo. O público de ${audience} já está aproveitando os melhores descontos do ano!`,
          },
          {
            headline: `Últimas Horas: ${offer}`,
            body: `A oportunidade perfeita para ${audience} economizar com inteligência e praticidade. Garanta agora!`,
          },
        ]
      }
      setCopyVariations(variations)
      setIsGeneratingCopy(false)
    }, 1500)
  }

  const handleGenerateInteractive = () => {
    if (interactiveType === 'button') {
      setGeneratedCode(
        `<button \n  style="background-color: ${interactiveColor}; color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"\n  onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(0,0,0,0.15)'"\n  onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'"\n>\n  ${interactiveText}\n</button>`,
      )
    } else {
      setGeneratedCode(
        `<div style="padding: 16px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #991b1b; font-family: sans-serif; text-align: center; max-width: 300px; margin: 0 auto; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">\n  <strong style="display: block; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">⏳ Oferta expira em:</strong>\n  <span id="cava-timer" style="font-size: 24px; font-weight: 900; font-variant-numeric: tabular-nums;">00:15:00</span>\n</div>\n<script>\n  (function() {\n    let timeLeft = 15 * 60;\n    const timerEl = document.getElementById('cava-timer');\n    const interval = setInterval(() => {\n      if (timeLeft <= 0) { clearInterval(interval); return; }\n      timeLeft--;\n      const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');\n      const s = (timeLeft % 60).toString().padStart(2, '0');\n      if(timerEl) timerEl.innerText = '00:' + m + ':' + s;\n    }, 1000);\n  })();\n</script>`,
      )
    }
  }

  const handleSendToAdManager = (platform: string) => {
    toast.success(`Enviado com sucesso para ${platform}!`, {
      description: 'O criativo está sincronizado e pronto para veiculação.',
    })
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4 animate-fade-in pb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center shrink-0 gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">
            Studio Criativo
          </h1>
          <p className="text-muted-foreground text-sm">
            Geração de ativos otimizada para automação de performance.
          </p>
        </div>
        <Button variant="outline" className="shadow-sm" asChild>
          <Link to="/portal-cliente">
            <Share2 className="mr-2 h-4 w-4" /> Link de Revisão (Cliente)
          </Link>
        </Button>
      </div>

      <Card className="shrink-0 shadow-md border-t-4 border-t-primary bg-muted/10">
        <CardContent className="p-4 md:p-6 flex flex-col gap-4">
          <Tabs defaultValue="visual" className="w-full">
            <TabsList className="mb-4 bg-background/50 backdrop-blur-sm border shadow-sm h-10 w-full sm:w-auto overflow-x-auto justify-start flex-nowrap">
              <TabsTrigger
                value="visual"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shrink-0"
              >
                Visual & Design
              </TabsTrigger>
              <TabsTrigger
                value="copywriting"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shrink-0"
              >
                Copywriting IA
              </TabsTrigger>
              <TabsTrigger
                value="interactive"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shrink-0"
              >
                Componentes Interativos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visual" className="m-0 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="space-y-2 w-full md:w-48 shrink-0">
                  <Label className="text-xs font-semibold uppercase">Tipo de Projeto</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger className="bg-background shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Performance Banner</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="bundle">Smart Bundle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 w-full md:w-auto flex-1 max-w-[320px]">
                  <Label className="text-xs font-semibold uppercase">Dimensões</Label>
                  <div className="flex gap-2">
                    <Select value={preset} onValueChange={setPreset}>
                      <SelectTrigger className="bg-background shadow-sm flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1080x1080">Quadrado 1080x1080</SelectItem>
                        <SelectItem value="1080x1920">Story 1080x1920</SelectItem>
                        <SelectItem value="1920x1080">Wide 1920x1080</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                    {preset === 'custom' && (
                      <Input
                        placeholder="1200x400"
                        value={customDims}
                        onChange={(e) => setCustomDims(e.target.value)}
                        className="w-[110px] bg-background shadow-sm"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2 w-full md:w-56 shrink-0">
                  <Label className="text-xs font-semibold uppercase">Brand Kit (Cliente)</Label>
                  <Select value={clientId} onValueChange={handleClientChange}>
                    <SelectTrigger className="bg-background shadow-sm">
                      <SelectValue placeholder="Nenhum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-3 w-full md:w-auto pb-1 shrink-0 px-2">
                  <Label className="text-xs font-semibold uppercase opacity-0 hidden md:block">
                    Variações A/B
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="ab-test" checked={isABTesting} onCheckedChange={setIsABTesting} />
                    <Label
                      htmlFor="ab-test"
                      className="text-sm font-semibold cursor-pointer flex items-center gap-1.5"
                    >
                      <SplitSquareHorizontal className="h-4 w-4 text-primary" /> Variações A/B
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="space-y-2 flex-1 w-full">
                  <Label className="text-xs font-semibold uppercase">Prompt Criativo</Label>
                  <Input
                    placeholder="Descreva o cenário e objetivos..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="bg-background shadow-sm"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="w-full md:w-56 h-10 shadow-elevation font-semibold shrink-0"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Gerar Criativo{isABTesting ? 's' : ''}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="copywriting" className="m-0 space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-end bg-background p-4 rounded-lg shadow-sm border">
                <div className="space-y-2 flex-1 w-full">
                  <Label className="text-xs font-semibold uppercase">Oferta da Campanha</Label>
                  <Input
                    placeholder="Ex: 20% OFF na Black Friday"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                  />
                </div>
                <div className="space-y-2 flex-1 w-full">
                  <Label className="text-xs font-semibold uppercase">Público-Alvo</Label>
                  <Input
                    placeholder="Ex: Entusiastas de moda 25-40"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                  />
                </div>
                <div className="space-y-2 flex-1 w-full max-w-[160px]">
                  <Label className="text-xs font-semibold uppercase">Idioma</Label>
                  <Select value={copyLanguage} onValueChange={setCopyLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleGenerateCopy}
                  disabled={isGeneratingCopy || !offer || !audience}
                  className="w-full md:w-56 h-10 shadow-md font-semibold shrink-0"
                >
                  {isGeneratingCopy ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Gerar Copy IA
                </Button>
              </div>

              {copyVariations.length > 0 && (
                <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up">
                  {copyVariations.map((copy, idx) => (
                    <Card
                      key={idx}
                      className="shadow-subtle hover:shadow-elevation transition-all border-l-4 border-l-primary group"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">
                          {copy.headline}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">{copy.body}</p>
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs shadow-sm bg-background"
                            onClick={() => {
                              navigator.clipboard.writeText(`${copy.headline}\n\n${copy.body}`)
                              toast.success('Texto copiado!', {
                                description: 'Pronto para colar no Ad Manager.',
                              })
                            }}
                          >
                            Copiar p/ Ads
                          </Button>
                          <Button
                            size="sm"
                            className="w-full text-xs shadow-sm"
                            onClick={() => {
                              setGeneratedAssets((prev) =>
                                prev.map((a) =>
                                  a.type === 'bundle' ? { ...a, cta: copy.headline } : a,
                                ),
                              )
                              toast.success('Aplicado!', {
                                description: 'O título foi aplicado como CTA no Bundle.',
                              })
                            }}
                          >
                            Aplicar no Design
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="interactive" className="m-0 space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-end bg-background p-4 rounded-lg shadow-sm border">
                <div className="space-y-2 flex-1 w-full max-w-[250px]">
                  <Label className="text-xs font-semibold uppercase">Tipo de Componente</Label>
                  <Select value={interactiveType} onValueChange={setInteractiveType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="button">Botão Animado</SelectItem>
                      <SelectItem value="timer">Timer de Escassez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {interactiveType === 'button' && (
                  <>
                    <div className="space-y-2 flex-1 w-full">
                      <Label className="text-xs font-semibold uppercase">Texto do Botão</Label>
                      <Input
                        value={interactiveText}
                        onChange={(e) => setInteractiveText(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 shrink-0">
                      <Label className="text-xs font-semibold uppercase">Cor Principal</Label>
                      <Input
                        type="color"
                        value={interactiveColor}
                        onChange={(e) => setInteractiveColor(e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer bg-background"
                      />
                    </div>
                  </>
                )}
                <Button
                  onClick={handleGenerateInteractive}
                  className="w-full md:w-56 h-10 shadow-md font-semibold shrink-0"
                >
                  <Code className="mr-2 h-4 w-4" /> Gerar Snippet
                </Button>
              </div>

              {generatedCode && (
                <div className="grid gap-6 md:grid-cols-2 animate-fade-in-up">
                  <Card className="shadow-subtle">
                    <CardHeader className="pb-3 border-b bg-muted/10">
                      <CardTitle className="text-base">Preview Visual</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-8 bg-muted/30 border-t border-dashed min-h-[250px]">
                      <div
                        dangerouslySetInnerHTML={{ __html: generatedCode.split('<script')[0] }}
                      />
                    </CardContent>
                  </Card>
                  <Card className="shadow-subtle">
                    <CardHeader className="pb-3 border-b bg-muted/10">
                      <CardTitle className="text-base flex justify-between items-center">
                        Código Gerado (HTML/CSS){' '}
                        <Badge variant="secondary">Pronto para Injeção</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <Textarea
                        value={generatedCode}
                        readOnly
                        className="font-mono text-xs min-h-[170px] bg-muted/50 border-border"
                      />
                      <Button
                        className="w-full shadow-sm"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedCode)
                          toast.success('Código copiado!', {
                            description: 'Cole diretamente no HTML da plataforma do cliente.',
                          })
                        }}
                      >
                        Copiar Código Completo
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex-1 bg-muted/20 border border-border/60 rounded-xl overflow-y-auto overflow-x-hidden relative shadow-inner group">
        <div className="fixed inset-0 bg-gradient-to-b from-transparent to-background/20 z-0 pointer-events-none" />

        {projectType === 'bundle' && generatedAssets.length > 0 && (
          <div className="sticky top-6 right-6 ml-auto w-64 bg-background/95 backdrop-blur-md shadow-xl border border-border p-5 rounded-xl z-20 space-y-4 animate-fade-in mr-6 mt-6">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b pb-2">
              <Palette className="h-4 w-4 text-primary" /> Editor de Estilo
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Palette className="w-3 h-3" /> Cor Destaque
                </Label>
                <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-md border shadow-sm">
                  <input
                    type="color"
                    value={bundleColor}
                    onChange={(e) => setBundleColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                  />
                  <span className="text-xs font-mono uppercase font-semibold">{bundleColor}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Type className="w-3 h-3" /> Tipografia Principal
                </Label>
                <Select value={bundleFont} onValueChange={setBundleFont}>
                  <SelectTrigger className="h-9 text-xs bg-background shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter (Sans)</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Playfair Display">Playfair (Serif)</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {isGenerating ? (
          <div className="text-center space-y-4 relative z-10 p-12 flex flex-col items-center h-full justify-center">
            <div className="w-20 h-20 rounded-full bg-background/50 border border-border flex items-center justify-center shadow-sm">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <p className="text-muted-foreground font-medium max-w-sm">
              A IA está renderizando os pixels e compondo a cena...
            </p>
          </div>
        ) : generatedAssets.length > 0 ? (
          <div
            className={`relative z-10 w-full animate-fade-in-up p-6 md:p-10 flex flex-col gap-10 ${generatedAssets.length > 1 ? 'lg:flex-row lg:items-start lg:justify-center' : 'items-center'}`}
          >
            {generatedAssets.map((asset) => {
              const currentBorderColor = asset.id === 'a' ? bundleColor : asset.color || bundleColor

              return (
                <div
                  key={asset.id}
                  className={`flex flex-col items-center w-full max-w-2xl shrink-0 group/asset ${generatedAssets.length > 1 ? 'lg:w-[48%]' : ''}`}
                >
                  {asset.label && (
                    <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider bg-background/80 px-4 py-1.5 rounded-full border shadow-sm backdrop-blur-sm">
                      {asset.label}
                    </h4>
                  )}

                  {asset.type === 'bundle' ? (
                    <div
                      style={{ fontFamily: bundleFont, borderColor: currentBorderColor }}
                      className="bg-background rounded-2xl p-8 border-t-8 shadow-elevation transition-all duration-300 w-full"
                    >
                      <h3 className="text-2xl font-bold mb-6">Compre Junto & Economize</h3>
                      <div className="flex items-center gap-6 mb-8">
                        <div className="flex-1 aspect-square bg-muted/50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-border">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/30 mb-2" />
                          <span className="text-xs font-medium text-muted-foreground">
                            Principal
                          </span>
                        </div>
                        <span className="text-4xl font-black text-muted-foreground/30">+</span>
                        <div className="flex-1 aspect-square bg-muted/50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-border">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/30 mb-2" />
                          <span className="text-xs font-medium text-muted-foreground">
                            Complementar
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground line-through">
                            De: R$ 299,90
                          </p>
                          <p
                            style={{ color: currentBorderColor }}
                            className="text-3xl font-black transition-colors duration-300"
                          >
                            Por: R$ 199,90
                          </p>
                        </div>
                        <Button
                          style={{ backgroundColor: currentBorderColor }}
                          className="h-12 px-8 text-white font-bold hover:opacity-90 transition-all duration-300 shadow-md text-base"
                        >
                          {asset.cta}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={asset.data}
                      alt="Generated"
                      className="w-full max-h-[60vh] object-contain rounded-lg shadow-elevation border border-border/50 transition-transform hover:scale-[1.01] duration-500 bg-background"
                    />
                  )}

                  <div className="mt-6 flex flex-wrap gap-3 opacity-0 group-hover/asset:opacity-100 transition-opacity translate-y-2 group-hover/asset:translate-y-0 duration-300">
                    {asset.type === 'bundle' && (
                      <Button
                        variant="outline"
                        className="shadow-sm bg-background/80 backdrop-blur-sm"
                      >
                        <Code className="mr-2 h-4 w-4" /> Exportar Code
                      </Button>
                    )}
                    {asset.type === 'image' && (
                      <Button
                        variant="outline"
                        className="shadow-sm bg-background/80 backdrop-blur-sm"
                      >
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="shadow-md">
                          <Send className="mr-2 h-4 w-4" /> Enviar para Ad Manager
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleSendToAdManager('Meta Ads')}>
                          <img
                            src="https://img.usecurling.com/i?q=meta&color=blue&shape=fill"
                            alt="Meta"
                            className="w-4 h-4 mr-2"
                          />{' '}
                          Meta Ads
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendToAdManager('Google Ads')}>
                          <img
                            src="https://img.usecurling.com/i?q=google&color=multicolor&shape=fill"
                            alt="Google"
                            className="w-4 h-4 mr-2"
                          />{' '}
                          Google Ads
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center space-y-4 relative z-10 p-12 flex flex-col items-center h-full justify-center">
            <div className="w-20 h-20 rounded-full bg-background/50 border border-border flex items-center justify-center shadow-sm">
              <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground font-medium max-w-sm">
              A área de visualização está pronta. Configure os parâmetros acima, escolha o Brand Kit
              e gere seu criativo.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
