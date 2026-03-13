import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppContext } from '@/components/AppContext'
import { Search, Save, BookOpen, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

export function SavePromptDialog({
  currentText,
  defaultCategory = 'General',
  trigger,
}: {
  currentText: string
  defaultCategory?: string
  trigger?: React.ReactNode
}) {
  const { addPrompt } = useAppContext()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(defaultCategory)
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    if (!title || !currentText) return
    addPrompt({ title, text: currentText, category })
    setOpen(false)
    setTitle('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="h-8">
            <Save className="mr-2 h-4 w-4" /> Salvar Prompt
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salvar na Biblioteca de Prompts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Título do Prompt</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Banner Alta Conversão Wake"
            />
          </div>
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Design, Dev, Performance"
            />
          </div>
          <div className="space-y-2">
            <Label>Conteúdo</Label>
            <Textarea value={currentText} readOnly className="h-32 bg-muted/50" />
          </div>
          <Button onClick={handleSave} className="w-full">
            Salvar Prompt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function BrowsePromptsDialog({
  onSelect,
  trigger,
}: {
  onSelect: (text: string) => void
  trigger?: React.ReactNode
}) {
  const { prompts } = useAppContext()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="h-8">
            <BookOpen className="mr-2 h-4 w-4" /> Prompts Salvos
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Biblioteca de Prompts Vencedores</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título ou categoria..."
              className="pl-9"
            />
          </div>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {filtered.map((prompt) => (
              <div
                key={prompt.id}
                className="p-4 border rounded-lg hover:border-primary/50 transition-colors bg-muted/10"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{prompt.title}</h4>
                    <Badge variant="secondary" className="mt-1 text-[10px]">
                      {prompt.category}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      onSelect(prompt.text)
                      setOpen(false)
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" /> Usar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{prompt.text}</p>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Nenhum prompt encontrado.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
