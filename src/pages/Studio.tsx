import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Wand2,
  PlaySquare,
  Image as ImageIcon,
  Download,
  Share2,
  UploadCloud,
  Loader2,
} from 'lucide-react'
import { useAppContext } from '@/components/AppContext'
import { SavePromptDialog, BrowsePromptsDialog } from '@/components/PromptsLibrary'

export default function Studio() {
  const { clients } = useAppContext()
  const [customSize, setCustomSize] = useState(false)
  const [preset, setPreset] = useState('1080x1080')
  const [width, setWidth] = useState('1080')
  const [height, setHeight] = useState('1080')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const [promptText, setPromptText] = useState('')
  const [selectedClientId, setSelectedClientId] = useState<string>('none')

  const client = clients.find((c) => c.id === selectedClientId)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const finalW = customSize ? width : preset.split('x')[0]
      const finalH = customSize ? height : preset.split('x')[1]
      setGeneratedImage(
        `https://img.usecurling.com/p/${finalW}/${finalH}?q=marketing%20banner&color=gradient`,
      )
      setIsGenerating(false)
    }, 2500)
  }

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col animate-fade-in">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">
            Studio Criativo
          </h1>
          <p className="text-muted-foreground">
            Ambiente integrado para edição e geração de assets com IA.
          </p>
        </div>
        <Button variant="outline" className="shadow-sm">
          <Share2 className="mr-2 h-4 w-4" /> Link de Revisão (Cliente)
        </Button>
      </div>

      <Tabs defaultValue="ai" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full max-w-md grid grid-cols-3 mx-auto shadow-sm">
          <TabsTrigger
            value="ai"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Wand2 className="mr-2 h-4 w-4" /> Gerador IA
          </TabsTrigger>
          <TabsTrigger value="design">
            <ImageIcon className="mr-2 h-4 w-4" /> Design
          </TabsTrigger>
          <TabsTrigger value="video">
            <PlaySquare className="mr-2 h-4 w-4" /> Vídeo
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 bg-muted/20 border rounded-xl mt-6 overflow-hidden flex shadow-subtle relative">
          <TabsContent
            value="ai"
            className="m-0 p-6 flex flex-col w-full data-[state=active]:flex h-full overflow-y-auto"
          >
            <div className="grid lg:grid-cols-2 gap-8 h-full min-h-max">
              <div className="space-y-6 flex flex-col">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">AI Banner Studio</h2>
                  <p className="text-muted-foreground text-sm">
                    Gere banners de alta conversão referenciando automaticamente os Brand Assets.
                  </p>
                </div>

                <div className="space-y-5 bg-background p-6 rounded-xl border shadow-sm flex-1">
                  <div className="space-y-3">
                    <Label>Dimensões do Banner</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={!customSize && preset === '1080x1080' ? 'default' : 'outline'}
                        onClick={() => {
                          setPreset('1080x1080')
                          setCustomSize(false)
                        }}
                        size="sm"
                        className="text-xs"
                      >
                        Square 1080x1080
                      </Button>
                      <Button
                        variant={!customSize && preset === '1080x1920' ? 'default' : 'outline'}
                        onClick={() => {
                          setPreset('1080x1920')
                          setCustomSize(false)
                        }}
                        size="sm"
                        className="text-xs"
                      >
                        Story 1080x1920
                      </Button>
                      <Button
                        variant={customSize ? 'default' : 'outline'}
                        onClick={() => setCustomSize(true)}
                        size="sm"
                        className="text-xs"
                      >
                        Custom Size
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label>Carregar Assets do Cliente</Label>
                    <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Selecione um cliente para injetar a marca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum (Configuração Manual)</SelectItem>
                        {clients.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {client && (
                      <div className="text-xs bg-primary/5 text-primary-foreground/80 p-3 rounded-md border border-primary/20 mt-2 animate-fade-in-up">
                        <strong className="text-primary block mb-1">
                          ✓ Identidade Injetada no Prompt:
                        </strong>
                        Cores: {client.assets.colors.join(', ')} <br />
                        Fontes: {client.assets.fonts.primary}, {client.assets.fonts.secondary}{' '}
                        <br />
                        Logo: {client.assets.logos[0] || 'Nenhum logo'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <Label>Descrição do Banner (Prompt)</Label>
                      <div className="flex gap-2">
                        <BrowsePromptsDialog onSelect={setPromptText} />
                        <SavePromptDialog
                          currentText={promptText}
                          defaultCategory="Performance Banner"
                        />
                      </div>
                    </div>
                    <Textarea
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="Descreva o cenário, elementos em destaque e o objetivo da campanha..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  <Button
                    className="w-full font-bold text-base h-12 shadow-md hover:shadow-lg transition-all"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={isGenerating || !promptText}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Gerando Variações...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" /> Gerar Banner
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl border border-border flex items-center justify-center relative overflow-hidden group min-h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0"></div>

                {generatedImage && !isGenerating ? (
                  <div className="relative z-10 p-4 w-full h-full flex flex-col items-center justify-center animate-fade-in">
                    <img
                      src={generatedImage}
                      alt="Banner Gerado"
                      className="max-w-full max-h-[80%] object-contain rounded-md shadow-elevation border"
                    />
                    <div className="mt-6 flex gap-3">
                      <Button variant="secondary" className="shadow-sm">
                        <Download className="mr-2 h-4 w-4" /> Baixar
                      </Button>
                      <Button className="shadow-sm">
                        <Share2 className="mr-2 h-4 w-4" /> Enviar para Aprovação
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 relative z-10 p-8">
                    <div className="mx-auto w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                      {isGenerating ? (
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm max-w-[250px]">
                      {isGenerating
                        ? 'A IA está analisando o prompt e compondo o banner...'
                        : 'Aguardando configuração para gerar imagens exclusivas...'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Dummy Tabs for Design and Video */}
          <TabsContent value="design" className="m-0 flex w-full h-full data-[state=active]:flex">
            <div className="w-full flex items-center justify-center text-muted-foreground">
              Editor Integrado (Em Breve)
            </div>
          </TabsContent>
          <TabsContent value="video" className="m-0 flex w-full h-full data-[state=active]:flex">
            <div className="w-full flex items-center justify-center text-muted-foreground">
              Edição de Vídeo (Em Breve)
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
