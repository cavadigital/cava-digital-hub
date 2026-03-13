import { useState, useMemo, useEffect } from 'react'
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
  MessageCircle,
} from 'lucide-react'
import { useAppContext, Meeting } from '@/components/AppContext'
import { useGoogleAuth } from '@/hooks/use-google-auth'
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
import { ptBR } from 'date-fns/locale'

const formatDuration = (mins: number) => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}livre`.trim()
}

export default function Agenda() {
  const {
    meetings,
    isGoogleConnected,
    googleToken,
    disconnectGoogle,
    updateGoogleMeetings,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    setMeetingToConvert,
  } = useAppContext()

  const { handleConnect, isAuthLoading } = useGoogleAuth()

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
      ? visibleMeetings.find((m) => m.id === activePreview.id)!
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
  const [isAiSuggestionsOpen, setIsAiSuggestionsOpen] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)

  const fetchGoogleEvents = async (token: string) => {
    try {
      setIsSyncing(true)
      const now = new Date()
      // Fetch 1 month back and 2 months forward
      const timeMin = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
      const timeMax = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString()

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          disconnectGoogle()
          throw new Error(
            'Sessão expirada ou permissões insuficientes. Por favor, reconecte sua conta do Google.',
          )
        }
        throw new Error(`Falha ao obter eventos do Google Calendar.`)
      }

      const data = await res.json()

      const mapped: Meeting[] = data.items
        .map((item: any) => {
          let dateStr = ''
          let timeStr = '00:00'
          let endTimeStr = '01:00'

          if (item.start?.dateTime) {
            const startDate = new Date(item.start.dateTime)
            dateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`
            timeStr = startDate.toTimeString().slice(0, 5)

            if (item.end?.dateTime) {
              const endDate = new Date(item.end.dateTime)
              endTimeStr = endDate.toTimeString().slice(0, 5)
            }
          } else if (item.start?.date) {
            dateStr = item.start.date
          }

          if (!dateStr) return null

          return {
            id: item.id,
            date: dateStr,
            time: timeStr,
            endTime: endTimeStr,
            title: item.summary || 'Sem Título',
            type: 'Reunião Externa',
            source: 'google',
            description: item.description || '',
            guests: item.attendees ? item.attendees.map((a: any) => a.email).join(', ') : '',
          }
        })
        .filter(Boolean)

      updateGoogleMeetings(mapped)
    } catch (err: any) {
      console.error(err)
      toast.error('Erro de Sincronização', {
        description: err.message || 'Falha ao sincronizar eventos.',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    if (isGoogleConnected && googleToken && !hasFetched) {
      fetchGoogleEvents(googleToken)
      setHasFetched(true)
    } else if (!isGoogleConnected && hasFetched) {
      setHasFetched(false)
    }
  }, [isGoogleConnected, googleToken, hasFetched])

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
    const [year, month, day] = m.date.split('-').map(Number)
    const localDate = new Date(year, month - 1, day)
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

  const buildGooglePayload = (m: Omit<Meeting, 'id'>) => {
    const [year, month, day] = m.date.split('-').map(Number)
    const [startH, startM] = m.time.split(':').map(Number)
    const [endH, endM] = m.endTime.split(':').map(Number)

    const startDate = new Date(year, month - 1, day, startH, startM)
    const endDate = new Date(year, month - 1, day, endH, endM)

    return {
      summary: m.title,
      description: m.description,
      location: m.type === 'Interna' ? 'CAVA Hub (Virtual)' : '',
      start: {
        dateTime: startDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: m.guests ? m.guests.split(',').map((e) => ({ email: e.trim() })) : [],
    }
  }

  const handleSave = async () => {
    if (!formData.title || !formData.date || !formData.time || !formData.endTime) {
      toast.error('Preencha os campos obrigatórios (Título, Data e Horários).')
      return
    }

    const dateStr = `${formData.date.getFullYear()}-${String(formData.date.getMonth() + 1).padStart(2, '0')}-${String(formData.date.getDate()).padStart(2, '0')}`

    const meetingData: Omit<Meeting, 'id'> = {
      title: formData.title,
      date: dateStr,
      time: formData.time,
      endTime: formData.endTime,
      type: formData.type,
      description: formData.description,
      guests: formData.guests,
      source: isGoogleConnected ? 'google' : 'internal',
    }

    if (isGoogleConnected && googleToken) {
      setIsSchedulerOpen(false)
      const payload = buildGooglePayload(meetingData)
      const isUpdate = isEditing && formData.id && formData.id.length > 10

      const apiCall = isUpdate
        ? fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${formData.id}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${googleToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${googleToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

      toast.promise(
        apiCall.then(async (res) => {
          if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
              disconnectGoogle()
              throw new Error(
                'Sessão expirada. A permissão foi revogada ou a sessão expirou. Reconecte sua conta do Google.',
              )
            }
            throw new Error('Ocorreu um erro ao salvar o compromisso no Google Calendar.')
          }
          const data = await res.json()
          if (isUpdate) {
            updateMeeting(formData.id, meetingData)
          } else {
            addMeeting({ ...meetingData, id: data.id })
          }
          fetchGoogleEvents(googleToken)
        }),
        {
          loading: isUpdate ? 'Atualizando no Google Calendar...' : 'Criando no Google Calendar...',
          success: 'Sincronizado com sucesso com o Google Calendar!',
          error: (err: any) => `Falha na Sincronização: ${err.message || 'Erro de conexão.'}`,
        },
      )
    } else {
      if (isEditing && formData.id) {
        updateMeeting(formData.id, meetingData)
        toast.success('Reunião atualizada com sucesso!')
      } else {
        addMeeting(meetingData)
        toast.success('Reunião agendada com sucesso!')
      }
      setIsSchedulerOpen(false)
    }
  }

  const handleDelete = async (id: string) => {
    const meet = meetings.find((m) => m.id === id)

    if (meet?.source === 'google' && googleToken) {
      setIsSchedulerOpen(false)
      toast.promise(
        fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${googleToken}` },
        }).then(async (res) => {
          if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
              disconnectGoogle()
              throw new Error(
                'Sessão expirada. A permissão foi revogada ou a sessão expirou. Reconecte sua conta do Google.',
              )
            }
            throw new Error('Falha ao remover o compromisso do Google Calendar.')
          }
          deleteMeeting(id)
          if (activePreview?.id === id) setActivePreview(null)
          fetchGoogleEvents(googleToken)
        }),
        {
          loading: 'Removendo do Google Calendar...',
          success: 'Reunião removida com sucesso.',
          error: (err: any) => `Erro ao remover reunião: ${err.message || 'Falha de conexão.'}`,
        },
      )
      return
    }

    deleteMeeting(id)
    toast.success('Reunião cancelada com sucesso.')
    if (activePreview?.id === id) setActivePreview(null)
    setIsSchedulerOpen(false)
  }

  const handleSimulateWhatsApp = (meet: Meeting) => {
    toast.success('Lembrete Automático Enviado 🟢', {
      description: `Mensagem WhatsApp: "Olá! Sua reunião '${meet.title}' começará em breve às ${meet.time}."`,
      icon: (
        <img
          src="https://img.usecurling.com/i?q=whatsapp&color=green&shape=fill"
          className="w-5 h-5 mr-1"
          alt="WA"
        />
      ),
    })
  }

  const handleEndMeeting = (meet: Meeting) => {
    setMeetingToConvert(meet)
  }

  const aiFreeSlots = useMemo(() => {
    if (!selectedDate) return []
    const dateStr = selectedDate.toISOString().split('T')[0]
    const dayMeetings = meetings
      .filter((m) => m.date === dateStr && (isGoogleConnected ? true : m.source === 'internal'))
      .sort((a, b) => a.time.localeCompare(b.time))

    const businessStart = 9 * 60
    const businessEnd = 18 * 60

    const occupied = dayMeetings.map((m) => {
      const [sh, sm] = m.time.split(':').map(Number)
      const [eh, em] = (m.endTime || '19:00').split(':').map(Number)
      return { start: sh * 60 + sm, end: eh * 60 + em }
    })

    let current = businessStart
    const slots = []

    occupied.forEach((occ) => {
      if (current + 30 <= occ.start) {
        const duration = occ.start - current
        slots.push({
          date: selectedDate,
          dateLabel: format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }),
          time: `${Math.floor(current / 60)
            .toString()
            .padStart(2, '0')}:${(current % 60).toString().padStart(2, '0')}`,
          endTime: `${Math.floor(occ.start / 60)
            .toString()
            .padStart(2, '0')}:${(occ.start % 60).toString().padStart(2, '0')}`,
          duration: formatDuration(duration),
          type: duration >= 120 ? 'Tempo de Foco' : 'Horário Disponível',
        })
      }
      current = Math.max(current, occ.end)
    })

    if (current + 30 <= businessEnd) {
      const duration = businessEnd - current
      slots.push({
        date: selectedDate,
        dateLabel: format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }),
        time: `${Math.floor(current / 60)
          .toString()
          .padStart(2, '0')}:${(current % 60).toString().padStart(2, '0')}`,
        endTime: `${Math.floor(businessEnd / 60)
          .toString()
          .padStart(2, '0')}:${(businessEnd % 60).toString().padStart(2, '0')}`,
        duration: formatDuration(duration),
        type: duration >= 120 ? 'Tempo de Foco' : 'Horário Disponível',
      })
    }

    return slots
  }, [meetings, selectedDate, isGoogleConnected])

  const handleSelectSlot = (slot: any) => {
    setIsAiSuggestionsOpen(false)
    setFormData({
      id: '',
      title: '',
      date: slot.date,
      time: slot.time,
      endTime: slot.endTime,
      type: 'Interna',
      description: 'Reunião sugerida pela IA baseada na sua disponibilidade de calendário.',
      guests: '',
    })
    setIsEditing(false)
    setIsSchedulerOpen(true)
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
        <div className="flex flex-wrap gap-2">
          <Button
            variant={isGoogleConnected ? 'outline' : 'secondary'}
            onClick={() => handleConnect()}
            disabled={isSyncing || isAuthLoading}
            className={
              isGoogleConnected ? 'border-primary/20 hover:bg-primary/5' : 'bg-background shadow-sm'
            }
          >
            {isSyncing || isAuthLoading ? (
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
          <Button
            variant="outline"
            onClick={() => setIsAiSuggestionsOpen(true)}
            className="border-primary/20 text-primary hover:bg-primary/5 hidden sm:flex"
          >
            <Sparkles className="mr-2 h-4 w-4" /> Sugerir Horários
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

                  <div className="flex flex-wrap gap-3 pt-2 border-t mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSimulateWhatsApp(previewMeeting)}
                      className="bg-background shadow-sm border-green-200 text-green-700 hover:bg-green-50 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Notificar Convidados (WA)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEndMeeting(previewMeeting)}
                      className="bg-background shadow-sm border-primary/20 text-primary hover:bg-primary/5"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Encerrar e Registrar Tempo
                    </Button>
                    <div className="flex-1 min-w-[20px]" />
                    <Button size="sm" className="shadow-md">
                      <Plus className="mr-2 h-4 w-4" /> Atividade no Kanban
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
                      {formData.date ? (
                        format(formData.date, 'dd/MM/yyyy', { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
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

      <Dialog open={isAiSuggestionsOpen} onOpenChange={setIsAiSuggestionsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Sugestões de Horários (IA)
            </DialogTitle>
            <DialogDescription>
              Nossa inteligência analisou seu calendário e encontrou os melhores slots de tempo
              livre para novos compromissos e foco.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3 max-h-[350px] overflow-y-auto pr-2">
            {aiFreeSlots.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-6">
                Nenhum horário livre encontrado na data selecionada.
              </p>
            ) : (
              aiFreeSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={slot.type === 'Tempo de Foco' ? 'default' : 'outline'}
                        className={
                          slot.type === 'Tempo de Foco'
                            ? 'bg-primary/20 text-primary hover:bg-primary/30'
                            : 'border-muted-foreground/30'
                        }
                      >
                        {slot.type}
                      </Badge>
                      <p className="font-medium text-sm text-foreground flex items-center">
                        <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />{' '}
                        {slot.dateLabel}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {slot.time} - {slot.endTime}{' '}
                      <span className="opacity-70 ml-2">({slot.duration})</span>
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => handleSelectSlot(slot)}>
                    Selecionar
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
