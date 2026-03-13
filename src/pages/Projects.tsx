import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useBranch } from '@/components/BranchContext'
import { useAppContext } from '@/components/AppContext'
import { Plus, MessageSquare, Paperclip, MoreHorizontal, Clock, Share2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const COLUMNS = [
  'Backlog',
  'Em Design',
  'Desenvolvimento',
  'Aprovação Cliente',
  'Aprovado',
  'Finalizado',
]

export default function Projects() {
  const { currentBranch } = useBranch()
  const { projects } = useAppContext()
  const [activeCard, setActiveCard] = useState<any>(null)

  const filteredProjects = projects.filter(
    (p) => currentBranch === 'Consolidado' || p.branch === currentBranch,
  )

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/aprovacao-cliente?id=${id}`
    navigator.clipboard.writeText(url)
    toast.success('Link de Aprovação Copiado', {
      description: 'Link mobile-friendly copiado para a área de transferência.',
    })
  }

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos & Kanban</h1>
          <p className="text-muted-foreground">Gerencie o fluxo de implantações e campanhas.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Visão Cliente</Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Criar Card
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-h-[600px] w-max">
          {COLUMNS.map((col) => (
            <div
              key={col}
              className="w-80 flex flex-col bg-muted/30 rounded-xl p-4 border border-border/50"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm text-foreground/80">{col}</h3>
                <Badge variant="secondary" className="bg-background">
                  {filteredProjects.filter((p) => p.status === col).length}
                </Badge>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                {filteredProjects
                  .filter((p) => p.status === col)
                  .map((project) => (
                    <Card
                      key={project.id}
                      className="cursor-pointer hover:border-primary/50 transition-colors shadow-subtle group"
                      onClick={() => setActiveCard(project)}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline" className="text-[10px] mb-2">
                            {project.client}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardTitle className="text-sm font-medium leading-tight">
                          {project.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 flex gap-3 text-muted-foreground">
                        <div className="flex items-center text-xs gap-1">
                          <MessageSquare className="h-3 w-3" /> 2
                        </div>
                        <div className="flex items-center text-xs gap-1">
                          <Paperclip className="h-3 w-3" /> 1
                        </div>
                        <div className="flex items-center text-xs gap-1 ml-auto">
                          <Clock className="h-3 w-3" /> Ontem
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                <Button
                  variant="ghost"
                  className="w-full mt-2 text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-border/80 h-10"
                >
                  <Plus className="mr-2 h-4 w-4" /> Adicionar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Sheet open={!!activeCard} onOpenChange={(open) => !open && setActiveCard(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {activeCard && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{activeCard.client}</Badge>
                  <Badge variant="outline">{activeCard.status}</Badge>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="ml-auto"
                    onClick={() => handleShare(activeCard.id)}
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Share for Approval
                  </Button>
                </div>
                <SheetTitle className="text-2xl">{activeCard.title}</SheetTitle>
                <SheetDescription>
                  Criado em 12 Out 2023 • Filial: {activeCard.branch}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Descrição (Oculto p/ Cliente)</h4>
                  <Textarea
                    placeholder="Adicione os detalhes técnicos da implantação aqui..."
                    className="min-h-[100px]"
                    defaultValue="Revisar arquitetura do checkout na VTEX..."
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Checklist</h4>
                  <div className="space-y-2">
                    {['Aprovar wireframe', 'Configurar DNS', 'Testes QA'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-muted/40 p-2 rounded-md">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                          defaultChecked={i === 0}
                        />
                        <span
                          className={`text-sm ${i === 0 ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <h4 className="text-sm font-semibold">Comentários Internos</h4>
                  <div className="flex gap-2">
                    <Input placeholder="Escreva um comentário..." />
                    <Button>Enviar</Button>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-3 text-sm">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        CA
                      </div>
                      <div className="bg-muted p-3 rounded-lg rounded-tl-none flex-1">
                        <p className="font-medium mb-1">
                          Carlos Santos{' '}
                          <span className="text-xs text-muted-foreground font-normal ml-2">
                            Há 2 horas
                          </span>
                        </p>
                        <p className="text-muted-foreground">
                          O cliente solicitou uma alteração na banner principal. O arquivo já está
                          no Studio.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
