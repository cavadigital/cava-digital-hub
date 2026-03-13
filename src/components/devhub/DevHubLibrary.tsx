import { useState } from 'react'
import { useAppContext, UIComponent } from '@/components/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Download, Code, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function DevHubLibrary({ onInject }: { onInject: (c: UIComponent) => void }) {
  const { uiComponents, addUIComponent, deleteUIComponent } = useAppContext()
  const [previewComp, setPreviewComp] = useState<UIComponent | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newComp, setNewComp] = useState<Partial<UIComponent>>({
    platform: 'Wake',
    category: 'Buttons',
    code: { html: '', css: '', js: '' },
  })

  const handleAdd = () => {
    if (newComp.name && newComp.code) {
      addUIComponent({
        name: newComp.name,
        platform: newComp.platform || 'Wake',
        category: newComp.category || 'Buttons',
        code: newComp.code,
      })
      setIsAdding(false)
      setNewComp({ platform: 'Wake', category: 'Buttons', code: { html: '', css: '', js: '' } })
    }
  }

  return (
    <div className="space-y-6 mt-2">
      <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" /> Repositório de UI
          </h2>
          <p className="text-sm text-muted-foreground">Blocos validados prontos para injeção.</p>
        </div>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Novo Componente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Salvar Componente na Biblioteca</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Componente</Label>
                  <Input
                    placeholder="Ex: Carrossel V2"
                    value={newComp.name || ''}
                    onChange={(e) => setNewComp({ ...newComp, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Plataforma</Label>
                  <Select
                    value={newComp.platform}
                    onValueChange={(v) => setNewComp({ ...newComp, platform: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wake">Wake</SelectItem>
                      <SelectItem value="Tray">Tray</SelectItem>
                      <SelectItem value="Nuvemshop">Nuvemshop</SelectItem>
                      <SelectItem value="Todas">Todas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={newComp.category}
                  onValueChange={(v) => setNewComp({ ...newComp, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Headers">Headers</SelectItem>
                    <SelectItem value="Footers">Footers</SelectItem>
                    <SelectItem value="Carousels">Carousels</SelectItem>
                    <SelectItem value="Buttons">Buttons</SelectItem>
                    <SelectItem value="Modals">Modals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>HTML</Label>
                <Textarea
                  className="font-mono text-xs h-20"
                  value={newComp.code?.html || ''}
                  onChange={(e) =>
                    setNewComp({ ...newComp, code: { ...newComp.code!, html: e.target.value } })
                  }
                />
              </div>
              <Button onClick={handleAdd}>Salvar Componente</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {uiComponents.map((comp) => (
          <Card
            key={comp.id}
            className="shadow-subtle hover:border-primary/50 transition-all group"
          >
            <CardHeader className="pb-3 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 h-7 w-7"
                onClick={() => deleteUIComponent(comp.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <div className="flex justify-between items-start">
                <Badge variant="outline">{comp.platform}</Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {comp.category}
                </Badge>
              </div>
              <CardTitle className="text-base mt-3 leading-snug">{comp.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setPreviewComp(comp)}
              >
                <Eye className="w-4 h-4 mr-2" /> Preview
              </Button>
              <Button size="sm" className="flex-1" onClick={() => onInject(comp)}>
                <Download className="w-4 h-4 mr-2" /> Injetar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!previewComp} onOpenChange={(open) => !open && setPreviewComp(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview Renderizado: {previewComp?.name}</DialogTitle>
          </DialogHeader>
          {previewComp && (
            <div className="mt-4 border rounded-md bg-muted/10 overflow-hidden relative min-h-[350px]">
              <iframe
                title="preview"
                className="w-full h-[350px] border-none"
                srcDoc={`<html><head><style>${previewComp.code.css}</style></head><body style="margin:0;padding:20px;display:flex;justify-content:center;align-items:center;min-height:100vh;">${previewComp.code.html}<script>${previewComp.code.js}</script></body></html>`}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
