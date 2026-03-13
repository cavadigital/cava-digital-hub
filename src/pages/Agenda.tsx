import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { MOCK_AGENDA } from '@/lib/data'
import { Video, Calendar as CalendarIcon, Sparkles, Plus, PlayCircle } from 'lucide-react'

export default function Agenda() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda Integrada & IA</h1>
          <p className="text-muted-foreground">
            Sincronizado com Google Workspace @cavadigital.com.br
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Agendar Reunião
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-subtle">
            <CardContent className="p-4">
              <Calendar mode="single" selected={new Date()} className="rounded-md mx-auto" />
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" /> Reuniões de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {MOCK_AGENDA.map((meet) => (
                <div
                  key={meet.id}
                  className="flex gap-4 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="font-bold text-primary w-12 shrink-0">{meet.time}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold group-hover:text-primary transition-colors">
                      {meet.title}
                    </h4>
                    <Badge variant="secondary" className="text-[10px] mt-1">
                      {meet.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="h-full shadow-subtle border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardHeader className="pb-4 border-b border-primary/10">
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30 mb-2">
                    <Sparkles className="h-3 w-3 mr-1" /> Meeting Intelligence
                  </Badge>
                  <CardTitle className="text-xl">Sync de Performance - Lojas Renner</CardTitle>
                  <CardDescription>Gravado hoje às 11:30 (Duração: 45min)</CardDescription>
                </div>
                <Button variant="outline" className="bg-background">
                  <PlayCircle className="mr-2 h-4 w-4 text-primary" /> Ver Gravação
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center">
                    Resumo Gerado por IA
                  </h4>
                  <div className="text-sm text-muted-foreground leading-relaxed bg-background p-4 rounded-lg border shadow-sm">
                    A equipe discutiu a queda na taxa de conversão do checkout mobile.
                    <span
                      className="bg-yellow-100 dark:bg-yellow-900/30 px-1 mx-1 rounded cursor-text"
                      title="Selecionado para criar tarefa"
                    >
                      Ficou acordado que o design vai propor uma nova disposição dos botões de
                      pagamento express.
                    </span>
                    O time de dev precisará implementar a nova API do PagSeguro até o final da
                    semana.
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 flex justify-end">
                  <Button className="shadow-md">
                    <Plus className="mr-2 h-4 w-4" /> Criar Atividade no Kanban
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
