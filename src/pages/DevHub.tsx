import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UploadCloud, Code, Settings2, FileJson, CheckCircle2 } from 'lucide-react'

export default function DevHub() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center space-y-2 mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
          <Code className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">CAVA Layout Converter</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Converta designs complexos do Figma/XD diretamente para pacotes prontos para e-commerces
          (Wake, Tray, Nuvemshop).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-elevation border-primary/20">
          <CardHeader className="text-center">
            <CardTitle>1. Upload do Design</CardTitle>
            <CardDescription>Arraste o arquivo ou cole o link do Figma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
              <UploadCloud className="h-12 w-12 mx-auto text-primary mb-4 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-foreground mb-1">
                Arraste arquivos .xd ou cole link
              </p>
              <p className="text-sm text-muted-foreground mb-4">Tamanho máximo: 50MB</p>
              <Button size="sm">Selecionar Arquivo</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle opacity-50 pointer-events-none filter grayscale">
          <CardHeader className="text-center">
            <CardTitle>2. Processamento IA</CardTitle>
            <CardDescription>O sistema estruturará HTML/CSS otimizado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded bg-muted/50">
              <span className="flex items-center">
                <Settings2 className="mr-2 h-4 w-4" /> Plataforma Alvo
              </span>
              <span className="font-medium text-sm">Wake Commerce</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded bg-muted/50">
              <span className="flex items-center">
                <FileJson className="mr-2 h-4 w-4" /> Otimização SEO
              </span>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <Button className="w-full" disabled>
              Gerar Pacote de Código
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground bg-muted p-4 rounded-lg">
        * A IA gera uma estrutura base (Tailwind + React/HTML) seguindo as melhores práticas de Core
        Web Vitals. Recomendado revisão por um Dev Pleno/Sênior.
      </div>
    </div>
  )
}
