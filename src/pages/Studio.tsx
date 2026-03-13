import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Link } from 'react-router-dom'
import { Wand2, Share2, ImageIcon, Loader2, Download, Palette, Code, Type } from 'lucide-react'
import { useAppContext } from '@/components/AppContext'

export default function Studio() {
  const { clients } = useAppContext()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAsset, setGeneratedAsset] = useState<{ type: string; data?: any } | null>(null)

  const [projectType, setProjectType] = useState('banner')
  const [preset, setPreset] = useState('1080x1080')
  const [customDims, setCustomDims] = useState('1200x400')
  const [prompt, setPrompt] = useState('')
  const [clientId, setClientId] = useState('none')

  // Real-time Style Editor State
  const [bundleColor, setBundleColor] = useState('#E3000F')
  const [bundleFont, setBundleFont] = useState('Inter')

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      if (projectType === 'bundle') {
        setGeneratedAsset({ type: 'bundle' })
      } else {
        let w, h
        if (preset === 'custom') {
          ;[w, h] = customDims.split('x')
        } else {
          ;[w, h] = preset.split('x')
        }
        // Fallback dimensions if invalid
        w = w || '1080'
        h = h || '1080'
        setGeneratedAsset({
          type: 'image',
          data: `https://img.usecurling.com/p/${w}/${h}?q=marketing%20banner&color=gradient`,
        })
      }
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4 animate-fade-in pb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center shrink-0 gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">
            Studio Criativo
          </h1>
          <p className="text-muted-foreground text-sm">
            Geração de assets otimizada para telas wide.
          </p>
        </div>
        <Button variant="outline" className="shadow-sm" asChild>
          <Link to="/portal-cliente">
            <Share2 className="mr-2 h-4 w-4" /> Link de Revisão (Cliente)
          </Link>
        </Button>
      </div>

      <Card className="shrink-0 shadow-md border-t-4 border-t-primary bg-muted/10">
        <CardContent className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-4 items-end">
          <div className="space-y-2">
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

          <div className={`space-y-2 ${preset === 'custom' ? 'md:col-span-2' : ''}`}>
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

          <div
            className={`space-y-2 lg:col-span-1 ${preset === 'custom' ? 'hidden lg:block' : ''}`}
          >
            <Label className="text-xs font-semibold uppercase">Injetar Marca</Label>
            <Select value={clientId} onValueChange={setClientId}>
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

          <div className="space-y-2 md:col-span-2 lg:col-span-2">
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
            className="w-full h-10 shadow-elevation font-semibold"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Gerar Asset
          </Button>
        </CardContent>
      </Card>

      <div className="flex-1 bg-muted/20 border border-border/60 rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner group">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20 z-0 pointer-events-none" />

        {projectType === 'bundle' && generatedAsset?.type === 'bundle' && (
          <div className="absolute right-6 top-6 w-64 bg-background/95 backdrop-blur-md shadow-xl border border-border p-5 rounded-xl z-20 space-y-4 animate-fade-in">
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
          <div className="text-center space-y-4 relative z-10 p-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-background/50 border border-border flex items-center justify-center shadow-sm">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <p className="text-muted-foreground font-medium max-w-sm">
              A IA está renderizando os pixels e compondo a cena...
            </p>
          </div>
        ) : generatedAsset?.type === 'bundle' ? (
          <div className="relative z-10 w-full max-w-2xl animate-fade-in-up p-8 flex flex-col items-center">
            <div
              style={{ fontFamily: bundleFont, borderColor: bundleColor }}
              className="bg-background rounded-2xl p-8 border-t-8 shadow-elevation transition-all duration-300 w-full"
            >
              <h3 className="text-2xl font-bold mb-6">Compre Junto & Economize</h3>
              <div className="flex items-center gap-6 mb-8">
                <div className="flex-1 aspect-square bg-muted/50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-border">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Produto Principal
                  </span>
                </div>
                <span className="text-4xl font-black text-muted-foreground/30">+</span>
                <div className="flex-1 aspect-square bg-muted/50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-border">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Produto Complementar
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground line-through">De: R$ 299,90</p>
                  <p
                    style={{ color: bundleColor }}
                    className="text-3xl font-black transition-colors duration-300"
                  >
                    Por: R$ 199,90
                  </p>
                </div>
                <Button
                  style={{ backgroundColor: bundleColor }}
                  className="h-12 px-8 text-white font-bold hover:opacity-90 transition-all duration-300 shadow-md text-base"
                >
                  Adicionar Kit
                </Button>
              </div>
            </div>
            <div className="mt-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
              <Button className="shadow-md">
                <Code className="mr-2 h-4 w-4" /> Exportar Componente
              </Button>
              <Button variant="secondary" className="shadow-md bg-background/80 backdrop-blur-sm">
                <Share2 className="mr-2 h-4 w-4" /> Enviar para Portal
              </Button>
            </div>
          </div>
        ) : generatedAsset?.type === 'image' ? (
          <div className="relative z-10 p-6 w-full h-full flex flex-col items-center justify-center animate-fade-in-up">
            <img
              src={generatedAsset.data}
              alt="Generated"
              className="max-w-full max-h-[85%] object-contain rounded-lg shadow-elevation border border-border/50 transition-transform hover:scale-[1.01] duration-500"
            />
            <div className="mt-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
              <Button variant="secondary" className="shadow-md bg-background/80 backdrop-blur-sm">
                <Download className="mr-2 h-4 w-4" /> Baixar Alta Resolução
              </Button>
              <Button className="shadow-md">
                <Share2 className="mr-2 h-4 w-4" /> Enviar para Portal
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 relative z-10 p-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-background/50 border border-border flex items-center justify-center shadow-sm">
              <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground font-medium max-w-sm">
              A área de visualização está pronta. Configure os parâmetros acima e gere seu asset.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
