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
import { useAppContext, Project } from '@/components/AppContext'
import {
  Plus,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  Clock,
  Share2,
  AlertCircle,
  Link2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

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
  const { projects, clients, updateProjectStatus, addProject, addProjectComment } = useAppContext()
  const [activeCard, setActiveCard] = useState<Project | null>(null)

  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const [newProject, setNewProject] = useState({ title: '', client: '', description: '' })

  const [checklists, setChecklists] = useState<
    Record<string, { text: string; checked: boolean }[]>
  >({
    '1': [
      { text: 'Aprovar wireframe', checked: true },
      { text: 'Configurar DNS', checked: false },
    ],
  })
  const [newChecklistItem, setNewChecklistItem] = useState('')

  const [newComment, setNewComment] = useState('')

  const filteredProjects = projects.filter(
    (p) => currentBranch === 'Consolidado' || p.branch === currentBranch,
  )

  const overBudgetProjects = filteredProjects.filter(
    (p) =>
      p.estimatedHours &&
      p.actualHours &&
      p.actualHours / p.estimatedHours >= 0.8 &&
      p.status !== 'Finalizado' &&
      p.status !== 'Aprovado',
  )

  const handleShare = (id: string) => {
    const project = projects.find((p) => p.id === id)
    const client = clients.find((c) => c.name === project?.client)
    const url = `${window.location.origin}/aprovacao-cliente?id=${id}`

    navigator.clipboard.writeText(url)

    if (client?.notifyWhatsApp && client?.phone) {
      const message = `Olá! A arte do projeto "${project?.title}" está pronta para sua avaliação. Acesse o link para revisar e aprovar: ${url}`
      const waUrl = `https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
      window.open(waUrl, '_blank')
      toast.success('Alerta WhatsApp Disparado', {
        description: `Mensagem gerada e copiada para o cliente ${client.name}.`,
      })
    } else {
      window.open(url, '_blank')
      toast.success('Link de Aprovação Aberto', {
        description: 'A página de aprovação mobile-friendly foi aberta em uma nova guia.',
      })
    }
  }

  const handleGenerateClientLink = (id: string) => {
    if (!id) return
    const url = `${window.location.origin}/projeto/progresso?id=${id}`
    window.open(url, '_blank')
    toast.success('Visão Cliente Aberta', {
      description: 'URL de acompanhamento restrito aberta em uma nova guia.',
    })
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('projectId', id)
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    const projectId = e.dataTransfer.getData('projectId')
    if (projectId) {
      updateProjectStatus(projectId, status)
      if (activeCard?.id === projectId) {
        setActiveCard({ ...activeCard, status })
      }
    }
    setDraggedItem(null)
  }

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.title || !newProject.client) {
      toast.error('Preencha os campos obrigatórios.')
      return
    }

    addProject({
      title: newProject.title,
      client: newProject.client,
      description: newProject.description,
      status: 'Backlog',
      branch: currentBranch === 'Consolidado' ? 'Curitiba' : currentBranch,
    })

    toast.success('Projeto criado com sucesso!')
    setIsNewProjectOpen(false)
    setNewProject({ title: '', client: '', description: '' })
  }

  const handleAddChecklistItem = () => {
    if (!activeCard || !newChecklistItem.trim()) return
    const currentList = checklists[activeCard.id] || []
    setChecklists({
      ...checklists,
      [activeCard.id]: [...currentList, { text: newChecklistItem, checked: false }],
    })
    setNewChecklistItem('')
  }

  const handleToggleChecklist = (idx: number) => {
    if (!activeCard) return
    const currentList = [...(checklists[activeCard.id] || [])]
    currentList[idx].checked = !currentList[idx].checked
    setChecklists({
      ...checklists,
      [activeCard.id]: currentList,
    })
  }

  const handleAddComment = () => {
    if (!activeCard || !newComment.trim()) return
    addProjectComment(activeCard.id, {
      id: Math.random().toString(),
      text: newComment,
      author: 'Admin CAVA',
      time: 'Agora',
      avatar: 'AD',
    })
    setNewComment('')
  }

  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)
    return parts.map((part, i) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          {part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      ),
    )
  }

  // Refresh active card comments from context
  const activeProjectRefreshed = activeCard ? projects.find((p) => p.id === activeCard.id) : null

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos & Kanban</h1>
          <p className="text-muted-foreground">Gerencie o fluxo de implantações e campanhas.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (filteredProjects[0]) {
                handleGenerateClientLink(filteredProjects[0].id)
              } else {
                toast.info('Nenhum projeto para visualizar.')
              }
            }}
          >
            Visão Cliente (Amostra)
          </Button>
          <Button onClick={() => setIsNewProjectOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Criar Card
          </Button>
        </div>
      </div>

      {overBudgetProjects.length > 0 && (
        <div className="flex flex-col gap-3 mb-2 animate-fade-in-up">
          {overBudgetProjects.map((p) => {
            const pct = Math.round(((p.actualHours || 0) / (p.estimatedHours || 1)) * 100)
            const isCritical = pct >= 100
            return (
              <div
                key={p.id}
                className={`flex items-center gap-3 p-4 rounded-xl border shadow-sm ${
                  isCritical
                    ? 'bg-destructive/10 border-destructive/30 text-destructive'
                    : 'bg-warning/10 border-warning/30 text-yellow-600'
                }`}
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">Alerta de Orçamento: {p.title}</h4>
                  <p className="text-xs opacity-90">
                    O projeto atingiu {pct}% da capacidade estimada ({p.actualHours}/
                    {p.estimatedHours}h).
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-h-[600px] w-max">
          {COLUMNS.map((col) => (
            <div
              key={col}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col)}
              className="w-80 flex flex-col bg-muted/30 rounded-xl p-4 border border-border/50 transition-colors"
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
                  .map((project) => {
                    const ratio = (project.actualHours || 0) / (project.estimatedHours || 1)
                    const isOver = ratio >= 0.8 && project.status !== 'Finalizado'
                    const isDragging = draggedItem === project.id
                    const commentCount = (project.comments || []).length

                    return (
                      <Card
                        key={project.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, project.id)}
                        onDragEnd={() => setDraggedItem(null)}
                        className={`cursor-pointer transition-all shadow-subtle group ${isOver ? 'border-warning/50' : 'hover:border-primary/50'} ${isDragging ? 'opacity-50 scale-95' : ''}`}
                        onClick={() => setActiveCard(project)}
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <Badge
                              variant="outline"
                              className={`text-[10px] mb-2 ${isOver ? 'border-warning/50 text-warning' : ''}`}
                            >
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
                            <MessageSquare className="h-3 w-3" /> {commentCount}
                          </div>
                          <div className="flex items-center text-xs gap-1">
                            <Paperclip className="h-3 w-3" /> 1
                          </div>
                          <div className="flex items-center text-xs gap-1 ml-auto">
                            {isOver && <AlertCircle className="h-3 w-3 text-warning" />}
                            <Clock className="h-3 w-3 ml-1" /> Ontem
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}

                <Button
                  variant="ghost"
                  className="w-full mt-2 text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-border/80 h-10"
                  onClick={() => setIsNewProjectOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Adicionar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateProject}>
            <DialogHeader>
              <DialogTitle>Novo Card / Projeto</DialogTitle>
              <DialogDescription>Crie uma nova atividade e adicione ao Kanban.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">
                  Nome do Projeto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Ex: Campanha Dia das Mães"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client">
                  Cliente <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newProject.client}
                  onValueChange={(val) => setNewProject({ ...newProject, client: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Objetivo/Descrição</Label>
                <Textarea
                  id="desc"
                  placeholder="Descreva brevemente o objetivo..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsNewProjectOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Criar Card</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={!!activeCard} onOpenChange={(open) => !open && setActiveCard(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {activeCard && activeProjectRefreshed && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge>{activeCard.client}</Badge>
                  <div className="w-40">
                    <Select
                      value={activeCard.status}
                      onValueChange={(v) => {
                        updateProjectStatus(activeCard.id, v)
                        setActiveCard({ ...activeCard, status: v })
                      }}
                    >
                      <SelectTrigger className="h-7 text-xs font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COLUMNS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/20 text-primary hover:bg-primary/5"
                      onClick={() => handleGenerateClientLink(activeCard.id)}
                      title="Gerar link restrito de acompanhamento do projeto"
                    >
                      <Link2 className="w-4 h-4 mr-2" /> Visão Cliente
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                      onClick={() => handleShare(activeCard.id)}
                      title="Enviar arte gerada para aprovação do cliente"
                    >
                      <Share2 className="w-4 h-4 mr-2" /> Aprovação de Arte
                    </Button>
                  </div>
                </div>
                <SheetTitle className="text-2xl">{activeCard.title}</SheetTitle>
                <SheetDescription>
                  Criado em 12 Out 2023 • Filial: {activeCard.branch}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Comparativo de Performance</h4>
                  <div className="flex flex-col gap-3 bg-muted/40 p-4 rounded-xl border border-border/60">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span>Estimado: {activeCard.estimatedHours || 0}h</span>
                      <span>Realizado: {activeCard.actualHours || 0}h</span>
                    </div>
                    {(() => {
                      const ratio = (activeCard.actualHours || 0) / (activeCard.estimatedHours || 1)
                      const indicatorClass =
                        ratio >= 1
                          ? 'bg-destructive'
                          : ratio >= 0.8
                            ? 'bg-yellow-500'
                            : 'bg-success'
                      return (
                        <Progress
                          value={Math.min(ratio * 100, 100)}
                          indicatorColor={indicatorClass}
                          className="h-2"
                        />
                      )
                    })()}

                    {(activeCard.actualHours || 0) >= (activeCard.estimatedHours || 0) * 0.8 && (
                      <p
                        className={`text-xs mt-1 font-semibold flex items-center ${
                          (activeCard.actualHours || 0) >= (activeCard.estimatedHours || 0)
                            ? 'text-destructive'
                            : 'text-yellow-600'
                        }`}
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {(activeCard.actualHours || 0) >= (activeCard.estimatedHours || 0)
                          ? 'Projeto excedeu a estimativa de horas'
                          : 'Projeto próximo do limite de horas estimadas'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Descrição (Oculto p/ Cliente)</h4>
                  <Textarea
                    placeholder="Adicione os detalhes técnicos da implantação aqui..."
                    className="min-h-[100px]"
                    defaultValue={
                      activeCard.description || 'Revisar arquitetura do checkout na VTEX...'
                    }
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Checklist Infinito</h4>
                  <div className="space-y-2">
                    {(checklists[activeCard.id] || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-muted/40 p-2 rounded-md">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                          checked={item.checked}
                          onChange={() => handleToggleChecklist(i)}
                        />
                        <span
                          className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {item.text}
                        </span>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2 pt-2">
                      <Input
                        placeholder="Adicionar novo item..."
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddChecklistItem()
                          }
                        }}
                      />
                      <Button variant="secondary" onClick={handleAddChecklistItem}>
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <h4 className="text-sm font-semibold">Comentários Internos</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Escreva um comentário (links são clicáveis)..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <Button onClick={handleAddComment}>Enviar</Button>
                  </div>
                  <div className="mt-4 space-y-4">
                    {(activeProjectRefreshed.comments || []).map((comment) => (
                      <div key={comment.id} className="flex gap-3 text-sm">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {comment.avatar}
                        </div>
                        <div className="bg-muted p-3 rounded-lg rounded-tl-none flex-1">
                          <p className="font-medium mb-1">
                            {comment.author}{' '}
                            <span className="text-xs text-muted-foreground font-normal ml-2">
                              {comment.time}
                            </span>
                          </p>
                          <p className="text-muted-foreground break-words leading-relaxed">
                            {renderTextWithLinks(comment.text)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(activeProjectRefreshed.comments || []).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum comentário registrado ainda.
                      </p>
                    )}
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
