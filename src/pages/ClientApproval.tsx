import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '@/components/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, ShieldCheck, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

export default function ClientApproval() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const { projects, updateProjectStatus } = useAppContext()
  const project = projects.find((p) => p.id === id)
  const [approved, setApproved] = useState(false)

  useEffect(() => {
    if (project && (project.status === 'Finalizado' || project.status === 'Aprovado')) {
      setApproved(true)
    }
  }, [project])

  if (!project) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-6 shadow-xl">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Link Inválido</h2>
          <p className="text-muted-foreground">
            O projeto solicitado não foi encontrado ou o link expirou.
          </p>
        </Card>
      </div>
    )
  }

  const handleApprove = () => {
    if (id) {
      updateProjectStatus(id, 'Aprovado')
      setApproved(true)
      toast.success('Projeto Aprovado!', {
        description: 'A equipe da CAVA Digital foi notificada e dará andamento.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center p-4 py-8 md:py-12 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Aprovação de Criativo</h1>
          <p className="text-muted-foreground text-sm font-medium">Portal Seguro CAVA Digital</p>
        </div>

        <Card className="shadow-2xl border-t-4 border-t-primary overflow-hidden">
          <CardHeader className="bg-gradient-to-b from-muted/30 to-background border-b pb-4 px-6 pt-6">
            <CardTitle className="text-xl leading-tight mb-1">{project.title}</CardTitle>
            <p className="text-sm text-primary font-semibold">{project.client}</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-square bg-muted flex items-center justify-center relative border-b overflow-hidden group">
              <img
                src={`https://img.usecurling.com/p/800/800?q=${encodeURIComponent(project.title)}&color=gradient`}
                alt="Preview"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 bg-background">
              <div className="mb-6 space-y-2">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Detalhes da Solicitação
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Por favor, revise o criativo gerado. Ao aprovar, o arquivo será liberado para
                  veiculação no Ad Manager ou implantação.
                </p>
              </div>

              {approved ? (
                <div className="bg-success/10 text-success border border-success/20 p-4 rounded-xl flex flex-col items-center justify-center gap-2 font-semibold animate-fade-in">
                  <CheckCircle2 className="w-6 h-6 mb-1" />
                  Arte Aprovada com Sucesso
                  <span className="text-xs font-normal text-success/80">
                    Nossa equipe já foi notificada.
                  </span>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-12 shadow-sm">
                    Solicitar Ajuste
                  </Button>
                  <Button
                    className="flex-1 h-12 shadow-elevation bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
                    onClick={handleApprove}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Aprovar Arte
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground pt-4 opacity-60">
          Powered by CAVA Digital
        </p>
      </div>
    </div>
  )
}
