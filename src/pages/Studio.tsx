import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Wand2,
  PlaySquare,
  Image as ImageIcon,
  Download,
  Share2,
  UploadCloud,
  Loader2,
} from 'lucide-react'

export default function Studio() {
  const [customSize, setCustomSize] = useState(false)
  const [preset, setPreset] = useState('1080x1080')
  const [width, setWidth] = useState('1080')
  const [height, setHeight] = useState('1080')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate AI generation process
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
                    Gere banners de alta conversão. Configure as dimensões e forneça uma identidade
                    visual para a IA seguir.
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

                    {customSize && (
                      <div className="flex gap-4 pt-2 animate-fade-in-down">
                        <div className="space-y-1.5 flex-1">
                          <Label className="text-xs text-muted-foreground">Width (px)</Label>
                          <Input
                            type="number"
                            placeholder="Largura"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <Label className="text-xs text-muted-foreground">Height (px)</Label>
                          <Input
                            type="number"
                            placeholder="Altura"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Reference Layout/Visual Identity</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                      <UploadCloud className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                      <p className="text-sm font-medium">Faça upload da identidade visual</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG ou PDF (Máx 10MB)</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Banner Description</Label>
                    <Textarea
                      placeholder="Descreva o cenário, elementos em destaque, paleta de cores e o objetivo da campanha..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  <Button
                    className="w-full font-bold text-base h-12 shadow-md hover:shadow-lg transition-all"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Gerando Variações...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" /> Generate Banner
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
                        ? 'A IA está analisando a identidade visual e compondo o banner...'
                        : 'Aguardando configuração para gerar imagens exclusivas...'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="m-0 flex w-full h-full data-[state=active]:flex">
            <div className="w-64 border-r bg-background p-4 flex flex-col gap-4">
              <div className="font-semibold text-sm">Ferramentas</div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-auto w-full">
                Biblioteca CAVA
              </Button>
            </div>
            <div className="flex-1 bg-gray-100 flex items-center justify-center p-8 overflow-hidden relative">
              <div className="absolute top-4 right-4">
                <Button size="sm">
                  <Download className="w-4 h-4 mr-2" /> Exportar
                </Button>
              </div>
              <div className="w-[400px] h-[400px] bg-white shadow-elevation rounded flex items-center justify-center border text-muted-foreground font-medium">
                Canvas Area
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="video"
            className="m-0 flex flex-col w-full h-full data-[state=active]:flex"
          >
            <div className="flex-1 flex">
              <div className="w-72 border-r bg-background p-4">
                <div className="font-semibold text-sm mb-4">Mídia do Projeto</div>
                <div className="space-y-2">
                  <div className="h-16 bg-muted rounded border flex items-center px-3 gap-3 text-sm">
                    <PlaySquare className="w-4 h-4" /> Take_01.mp4
                  </div>
                  <div className="h-16 bg-muted rounded border flex items-center px-3 gap-3 text-sm">
                    <PlaySquare className="w-4 h-4" /> Take_02.mp4
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-black p-8 flex items-center justify-center relative">
                <div className="aspect-video w-full max-w-2xl bg-gray-900 rounded-lg shadow-2xl flex items-center justify-center">
                  <PlaySquare className="w-16 h-16 text-white/20" />
                </div>
              </div>
            </div>
            <div className="h-48 border-t bg-background p-4 flex flex-col">
              <div className="font-semibold text-xs mb-2 text-muted-foreground flex justify-between">
                <span>Timeline</span>
                <span>00:00:00</span>
              </div>
              <div className="flex-1 bg-muted/50 rounded border relative overflow-hidden flex flex-col justify-between py-2">
                <div className="h-8 bg-blue-500/20 border border-blue-500/40 rounded mx-4 w-1/3 mt-1"></div>
                <div className="h-8 bg-green-500/20 border border-green-500/40 rounded mx-4 w-1/2 ml-[20%]"></div>
                <div className="absolute top-0 bottom-0 left-1/4 w-[2px] bg-red-500">
                  <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rotate-45"></div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
