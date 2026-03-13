import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Wand2, PlaySquare, Image as ImageIcon, Download, Share2 } from 'lucide-react'

export default function Studio() {
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
            className="m-0 p-6 flex flex-col w-full data-[state=active]:flex h-full"
          >
            <div className="grid md:grid-cols-2 gap-8 h-full">
              <div className="space-y-6 flex flex-col justify-center">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Geração de Banners</h2>
                  <p className="text-muted-foreground text-sm">
                    Descreva o conceito e deixe a IA da CAVA criar variações de alta fidelidade para
                    campanhas.
                  </p>
                </div>

                <div className="space-y-4 bg-background p-6 rounded-xl border shadow-sm">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dimensões</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option>1080x1080 (Feed)</option>
                      <option>1080x1920 (Stories/Reels)</option>
                      <option>1200x628 (Facebook Ads)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prompt Criativo</label>
                    <Textarea
                      placeholder="Ex: Um banner moderno para e-commerce de moda feminina, tema verão, cores vibrantes com destaque para um cupom de 20% OFF."
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                  <Button
                    className="w-full font-bold text-lg h-12 shadow-md hover:shadow-lg transition-all"
                    size="lg"
                  >
                    <Wand2 className="mr-2 h-5 w-5" /> Gerar Variações
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl border-dashed border-2 border-border flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0"></div>
                <div className="text-center space-y-4 relative z-10 p-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground text-sm max-w-[250px]">
                    Aguardando prompt para gerar imagens exclusivas...
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="m-0 flex w-full h-full data-[state=active]:flex">
            {/* Mock Design Editor */}
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
            {/* Mock Video Editor */}
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
