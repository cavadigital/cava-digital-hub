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
import { Wand2, Share2, ImageIcon, Loader2, Download } from 'lucide-react'
import { useAppContext } from '@/components/AppContext'

export default function Studio() {
  const { clients } = useAppContext()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [clientId, setClientId] = useState('none')
  const [preset, setPreset] = useState('1080x1080')

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const [w, h] = preset.split('x')
      setGeneratedImage(
        `https://img.usecurling.com/p/${w}/${h}?q=marketing%20banner&color=gradient`,
      )
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
            <Select defaultValue="banner">
              <SelectTrigger className="bg-background shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="banner">Performance Banner</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase">Dimensões</Label>
            <Select value={preset} onValueChange={setPreset}>
              <SelectTrigger className="bg-background shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1080x1080">Square 1080x1080</SelectItem>
                <SelectItem value="1080x1920">Story 1080x1920</SelectItem>
                <SelectItem value="1920x1080">Wide 1920x1080</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 lg:col-span-1">
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

        {generatedImage && !isGenerating ? (
          <div className="relative z-10 p-6 w-full h-full flex flex-col items-center justify-center animate-fade-in-up">
            <img
              src={generatedImage}
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
              {isGenerating ? (
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              ) : (
                <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
              )}
            </div>
            <p className="text-muted-foreground font-medium max-w-sm">
              {isGenerating
                ? 'A IA está renderizando os pixels e compondo a cena...'
                : 'A área de visualização está pronta. Configure os parâmetros acima e gere seu asset.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
