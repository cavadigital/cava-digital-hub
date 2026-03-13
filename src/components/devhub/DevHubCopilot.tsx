import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CodeResult } from '@/pages/DevHub'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Loader2, Play, Code, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface Issue {
  type: 'error' | 'warning'
  msg: string
}

export function DevHubCopilot({
  codeResult,
  setCodeResult,
}: {
  codeResult: CodeResult | null
  setCodeResult: (c: CodeResult) => void
}) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [issues, setIssues] = useState<Issue[]>([])
  const [showModal, setShowModal] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      // Mock generated code with deliberate SEO/Perf issues to demonstrate the CAVA Linter
      setCodeResult({
        html: '<div class="cava-bundle">\n  <img src="banner.jpg" />\n  <h1>Promoção Especial</h1>\n  <h1>Aproveite Hoje</h1>\n  <script src="tracker.js"></script>\n  <button>Comprar</button>\n</div>',
        css: '.cava-bundle { display: flex; flex-direction: column; }',
        js: 'console.log("Bundle loaded");',
      })
      setIsGenerating(false)
    }, 1500)
  }

  const runLinter = () => {
    const found: Issue[] = []
    const html = codeResult?.html || ''

    if (html.includes('<img') && !html.match(/<img[^>]*alt=/))
      found.push({ type: 'error', msg: 'Imagens sem atributo "alt" (Impacto SEO)' })
    if (html.includes('<img') && !html.match(/<img[^>]*loading="lazy"/))
      found.push({ type: 'warning', msg: 'Imagens sem lazy-loading (Impacto LCP)' })
    if ((html.match(/<h1/g) || []).length > 1)
      found.push({
        type: 'warning',
        msg: 'Múltiplas tags <h1> na mesma estrutura (Hierarquia SEO)',
      })
    if (html.includes('<script') && !html.match(/<script[^>]*(defer|async)/))
      found.push({ type: 'error', msg: 'Script bloqueante de renderização detectado' })

    setIssues(found)
    setShowModal(true)
  }

  const handleDeployForce = () => {
    setShowModal(false)
    toast.success('Deploy forçado concluído.', {
      description: 'Código injetado com avisos ignorados.',
    })
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-[600px]">
      <Card className="flex flex-col shadow-subtle border-t-4 border-t-primary h-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Code className="h-5 w-5 text-primary" /> Copilot IA
          </CardTitle>
          <CardDescription>Descreva a seção ou componente desejado.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <Textarea
            className="flex-1 resize-none bg-muted/30"
            placeholder="Ex: Crie um modal de captura de leads com fundo escuro..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="h-12 text-base font-semibold shadow-elevation"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Gerando...
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" /> Gerar Código
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="flex flex-col shadow-subtle bg-muted/10 h-full relative overflow-hidden">
        <CardHeader className="pb-2 flex flex-row items-center justify-between bg-muted/30 border-b">
          <CardTitle className="text-sm font-mono text-muted-foreground">Editor Preview</CardTitle>
          {codeResult && (
            <Button
              size="sm"
              onClick={runLinter}
              className="bg-success hover:bg-success/90 text-white shadow-sm"
            >
              <ShieldAlert className="mr-2 h-4 w-4" /> Validar & Deploy (Linter)
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-auto text-xs font-mono">
          {codeResult ? (
            <div className="p-4 space-y-4">
              <div>
                <span className="text-primary font-bold block mb-1">HTML</span>
                <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-md overflow-x-auto">
                  {codeResult.html}
                </pre>
              </div>
              <div>
                <span className="text-secondary-foreground font-bold block mb-1">CSS</span>
                <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-md overflow-x-auto">
                  {codeResult.css}
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground/50 p-6 text-center">
              Nenhum código gerado ainda.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {issues.length > 0 ? (
                <AlertTriangle className="h-6 w-6 text-warning" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-success" />
              )}
              CAVA Technical Linter
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {issues.length === 0 ? (
              <div className="p-4 bg-success/10 text-success border border-success/20 rounded-md">
                Análise concluída com sucesso! Nenhum problema de SEO ou Performance detectado.
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  O código gerado contém práticas que podem impactar a performance ou SEO da loja:
                </p>
                <div className="space-y-2">
                  {issues.map((iss, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-md border flex items-start gap-3 ${iss.type === 'error' ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-warning/10 border-warning/20 text-yellow-700'}`}
                    >
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                      <div className="text-sm font-medium">{iss.msg}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            {issues.length > 0 && (
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar & Corrigir
              </Button>
            )}
            <Button
              onClick={handleDeployForce}
              variant={issues.length > 0 ? 'destructive' : 'default'}
            >
              {issues.length > 0 ? 'Ignorar Alertas e Fazer Deploy' : 'Publicar Agora'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
