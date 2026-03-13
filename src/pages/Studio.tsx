import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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

  const handleClientChange = (val: string) => {
    setClientId(val)
    if (val !== 'none') {
      const client = clients.find((c) => c.id === val)
      if (client) {
        if (client.assets.colors.length > 0) {
          setBundleColor(client.assets.colors[0].value)
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
            Geração de assets otimizada para automação de performance.
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
                    <SelectItem value="1080x1080">Square 1080x1080</SelectItem>
                    <SelectItem value="1080x1920">Story 1080x1920</SelectItem>
                    <SelectItem value="1920x1080">Wide 1920x1080</SelectItem>
                    <SelectItem value="custom">Customizado</SelectItem>
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
              Gerar Asset{isABTesting ? 's' : ''}
            </Button>
          </div>
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
              e gere seu asset.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
