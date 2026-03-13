import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Calendar as CalendarIcon,
  Sparkles,
  Plus,
  PlayCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash,
  RefreshCw,
} from 'lucide-react'
import { useAppContext, Meeting } from '@/components/AppContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'

export default function Agenda() {
  const {
    meetings,
    isGoogleConnected,
    toggleGoogleConnection,
    addMeeting,
    updateMeeting,
    deleteMeeting,
  } = useAppContext()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : ''

  const visibleMeetings = useMemo(() => {
    return meetings
      .filter((m) => m.date === selectedDateStr && (isGoogleConnected || m.source === 'internal'))
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [meetings, selectedDateStr, isGoogleConnected])

  const [activePreview, setActivePreview] = useState<Meeting | null>(null)

  const previewMeeting =
    activePreview && visibleMeetings.find((m) => m.id === activePreview.id)
      ? activePreview
      : visibleMeetings[0] || null

  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    date: new Date(),
    time: '09:00',
    endTime: '10:00',
    type: 'Interna',
    description: '',
    guests: '',
  })

  const [isSyncing, setIsSyncing] = useState(false)

  const handleToggleGoogle = () => {
    setIsSyncing(true)
    setTimeout(() => {
      toggleGoogleConnection()
      setIsSyncing(false)
      if (!isGoogleConnected) {
        toast.success('Google Workspace conectado!', {
          description: 'Sincronização bidirecional ativada com sucesso.',
        })
      } else {
        toast.info('Google Workspace desconectado.', {
          description: 'Reuniões externas foram ocultadas.',
        })
      }
    }, 800)
  }

  const handleOpenCreate = () => {
    setFormData({
      id: '',
      title: '',
      date: selectedDate || new Date(),
      time: '09:00',
      endTime: '10:00',
      type: 'Interna',
      description: '',
      guests: '',
    })
    setIsEditing(false)
    setIsSchedulerOpen(true)
  }

  const handleOpenEdit = (m: Meeting) => {
    const localDate = new Date(m.date + 'T12:00:00')
    setFormData({
      id: m.id,
      title: m.title,
      date: localDate,
      time: m.time,
      endTime: m.endTime || '',
      type: m.type,
      description: m.description || '',
      guests: m.guests || '',
    })
    setIsEditing(true)
    setIsSchedulerOpen(true)
  }

  const handleSave = () => {
    if (!formData.title || !formData.date || !formData.time || !formData.endTime) {
      toast.error('Preencha os campos obrigatórios (Título, Data e Horários).')
      return
    }

    const meetingData: Omit<Meeting, 'id'> = {
      title: formData.title,
      date: formData.date.toISOString().split('T')[0],
      time: formData.time,
      endTime: formData.endTime,
      type: formData.type,
      description: formData.description,
      guests: formData.guests,
      source: isGoogleConnected ? 'google' : 'internal',
    }

    if (isEditing && formData.id) {
      updateMeeting(formData.id, meetingData)
      toast.success('Reunião atualizada com sucesso!', {
        description: isGoogleConnected ? 'Sincronizado com Google Calendar.' : '',
      })
      if (activePreview?.id === formData.id) {
        setActivePreview({ ...meetingData, id: formData.id } as Meeting)
      }
    } else {
      addMeeting(meetingData)
      toast.success('Reunião agendada com sucesso!', {
        description: isGoogleConnected ? 'Adicionado ao seu Google Calendar.' : '',
      })
    }

    setIsSchedulerOpen(false)
  }

  const handleDelete = (id: string) => {
    const meet = meetings.find((m) => m.id === id)
    deleteMeeting(id)
    toast.success('Reunião cancelada com sucesso.', {
      description: meet?.source === 'google' ? 'Removido do Google Calendar.' : '',
    })
    if (activePreview?.id === id) setActivePreview(null)
    setIsSchedulerOpen(false)
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda Integrada & IA</h1>
          <p className="text-muted-foreground">
            Gerencie seus compromissos e automatize resumos de reuniões.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isGoogleConnected ? 'outline' : 'secondary'}
            onClick={handleToggleGoogle}
            disabled={isSyncing}
            className={
              isGoogleConnected ? 'border-primary/20 hover:bg-primary/5' : 'bg-background shadow-sm'
            }
          >
            {isSyncing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
            ) : isGoogleConnected ? (
              <CheckCircle2 className="mr-2 h-4 w-4 text-success" />
            ) : (
              <img
                src="https://img.usecurling.com/i?q=google&color=multicolor&shape=fill"
                className="w-4 h-4 mr-2"
                alt="Google"
              />
            )}
            {isGoogleConnected ? 'Google Conectado' : 'Conectar Google Workspace'}
          </Button>
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" /> Agendar Reunião
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-subtle">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => setSelectedDate(d || new Date())}
                className="rounded-md mx-auto"
              />
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" /> Compromissos do Dia
                </div>
                <Badge variant="secondary">{visibleMeetings.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {visibleMeetings.length === 0 ? (
                <div className="text-center text-muted-foreground py-6 text-sm">
                  Nenhum compromisso agendado para este dia.
                </div>
              ) : (
                visibleMeetings.map((meet) => (
                  <div
                    key={meet.id}
                    onClick={() => setActivePreview(meet)}
                    className={`flex gap-3 p-3 rounded-lg border transition-colors cursor-pointer group ${
                      previewMeeting?.id === meet.id
                        ? 'bg-primary/5 border-primary/30'
                        : 'border-border/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="font-bold text-primary w-12 shrink-0 text-sm mt-0.5">
                      {meet.time}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                        {meet.title}
                        {meet.source === 'google' && (
                          <img
                            src="https://img.usecurling.com/i?q=google&color=multicolor&shape=fill"
                            className="w-3 h-3 shrink-0"
                            alt="Google Event"
                            title="Sincronizado com Google Calendar"
                          />
                        )}
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-[10px] mt-1.5 bg-background shadow-sm"
                      >
                        {meet.type}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {previewMeeting ? (
            <Card className="h-full shadow-subtle border-primary/20 bg-gradient-to-br from-background to-primary/5 relative overflow-hidden">
              {previewMeeting.source === 'google' && (
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <img
                    src="https://img.usecurling.com/i?q=google&color=solid-black&shape=fill"
                    className="w-32 h-32"
                    alt="Google"
                  />
                </div>
              )}
              <CardHeader className="pb-4 border-b border-primary/10 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 shadow-sm">
                        <Sparkles className="h-3 w-3 mr-1" /> Meeting Intelligence
                      </Badge>
                      {previewMeeting.source === 'google' && (
                        <Badge
                          variant="outline"
                          className="border-blue-200 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
                        >
                          Google Calendar
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl mb-1">{previewMeeting.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm font-medium">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> {previewMeeting.time} -{' '}
                        {previewMeeting.endTime}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />{' '}
                        {previewMeeting.type === 'Interna' ? 'CAVA Hub (Virtual)' : 'Google Meet'}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-background shadow-sm"
                      onClick={() => handleOpenEdit(previewMeeting)}
                    >
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-background text-destructive hover:bg-destructive/10 border-destructive/20 shadow-sm"
                      onClick={() => handleDelete(previewMeeting.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 relative z-10">
                <div className="space-y-6">
                  {previewMeeting.description && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">
                        Descrição
                      </h4>
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                        {previewMeeting.description}
                      </p>
                    </div>
                  )}

                  {previewMeeting.guests && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider flex items-center">
                        <Users className="w-4 h-4 mr-1" /> Participantes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {previewMeeting.guests.split(',').map((g, i) => (
                          <Badge key={i} variant="secondary" className="bg-muted shadow-sm">
                            {g.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-border/50">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" /> Resumo Gerado por IA (Simulação)
                    </h4>
                    <div className="text-sm text-muted-foreground leading-relaxed bg-background p-4 rounded-lg border shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">Gravação: Processada</span>
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-primary">
                          <PlayCircle className="w-3 h-3 mr-1" /> Ouvir
                        </Button>
                      </div>
                      A equipe discutiu os pontos principais da pauta.
                      <span
                        className="bg-yellow-100 dark:bg-yellow-900/30 px-1 mx-1 rounded cursor-text text-foreground"
                        title="Selecionado para criar tarefa"
                      >
                        Ficou acordado que uma nova proposta será enviada até sexta-feira.
                      </span>
                      As próximas etapas foram documentadas no Kanban.
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button className="shadow-md">
                      <Plus className="mr-2 h-4 w-4" /> Criar Atividade no Kanban
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full shadow-subtle border-dashed flex flex-col items-center justify-center p-12 text-center bg-muted/10">
              <CalendarIcon className="h-16 w-16 text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-semibold text-foreground/80 mb-2">
                Sua Agenda Inteligente
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Selecione um compromisso na lista para visualizar os detalhes, editar ou acompanhar
                o resumo gerado pela IA.
              </p>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isSchedulerOpen} onOpenChange={setIsSchedulerOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Reunião' : 'Agendar Reunião'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Modifique os detalhes do seu compromisso.'
                : 'Crie um novo compromisso na sua agenda.'}
              {isGoogleConnected &&
                !isEditing &&
                ' Será sincronizado automaticamente com o Google Calendar.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Título da Reunião <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Sync de Alinhamento"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>
                  Data <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal bg-background"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, 'dd/MM/yyyy') : <span>Selecione</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(d) => d && setFormData({ ...formData, date: d })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) => setFormData({ ...formData, type: val })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Interna">Interna</SelectItem>
                    <SelectItem value="Reunião Externa">Externa</SelectItem>
                    <SelectItem value="RH">RH / Entrevista</SelectItem>
                    <SelectItem value="Kickoff">Kickoff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>
                  Hora de Início <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>
                  Hora de Término <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Participantes (Emails)</Label>
              <Input
                placeholder="Separados por vírgula"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>Descrição / Pauta</Label>
              <Textarea
                placeholder="Detalhes do encontro..."
                className="min-h-[80px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSchedulerOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? 'Salvar Alterações' : 'Confirmar Agendamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
