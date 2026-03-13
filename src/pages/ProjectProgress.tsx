import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '@/components/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Briefcase, Clock, Activity } from 'lucide-react'

export default function ProjectProgress() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const { projects } = useAppContext()
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8 shadow-xl">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Projeto Não Encontrado</h2>
          <p className="text-muted-foreground">
            O link acessado é inválido ou o projeto já foi removido.
          </p>
        </Card>
      </div>
    )
  }

  const progress = Math.min(((project.actualHours || 0) / (project.estimatedHours || 1)) * 100, 100)

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4 py-8 md:py-12 animate-fade-in">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary overflow-hidden">
        <CardHeader className="text-center border-b pb-6 bg-gradient-to-b from-muted/30 to-background">
          <div className="mx-auto w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-4 shadow-sm">
            <Activity className="text-primary w-8 h-8" />
          </div>
          <CardTitle className="text-2xl leading-tight mb-1">{project.title}</CardTitle>
          <CardDescription className="text-sm font-medium">
            Acompanhamento de Projeto
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6 bg-background">
          <div>
            <h4 className="font-semibold text-xs mb-2 text-muted-foreground uppercase tracking-wider">
              Cliente Responsável
            </h4>
            <p className="text-base font-medium flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" /> {project.client}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end mb-1">
              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                Progresso Geral
              </h4>
              <span className="font-bold text-lg text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="bg-muted/40 p-4 rounded-xl border flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-muted-foreground opacity-50" />
              <div>
                <p className="text-sm font-semibold text-foreground">Horas Consumidas</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <strong className="text-foreground">{project.actualHours || 0}h</strong>{' '}
                  realizadas de {project.estimatedHours || 0}h estimadas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground pt-6 opacity-60">
        Portal de Transparência • CAVA Digital
      </p>
    </div>
  )
}
