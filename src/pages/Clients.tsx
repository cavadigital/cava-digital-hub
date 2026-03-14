import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppContext, Client, AssetItem } from '@/components/AppContext'
import {
  UploadCloud,
  Plus,
  X,
  Search,
  Briefcase,
  Palette,
  Type,
  AlertCircle,
  MessageSquare,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function Clients() {
  const { clients, updateClientAssets, updateClientPreferences, addClient } = useAppContext()
  const [search, setSearch] = useState('')
  const [activeClient, setActiveClient] = useState<Client | null>(null)
  const [editedLogos, setEditedLogos] = useState<AssetItem<string>[]>([])
  const [editedColors, setEditedColors] = useState<AssetItem<string>[]>([])
  const [editedFonts, setEditedFonts] = useState<
    AssetItem<{
      primary: string
      secondary: string
      googleFontLink?: string
      embedCode?: string
      observations?: string
    }>
  >({ value: { primary: '', secondary: '' }, status: 'Pending' })
  const [editedPhone, setEditedPhone] = useState('')
  const [editedNotify, setEditedNotify] = useState(false)

  const [isNewBrandKitOpen, setIsNewBrandKitOpen] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEdit = (client: Client) => {
    setActiveClient(client)
    setEditedLogos([...client.assets.logos])
    setEditedColors([...client.assets.colors])
    setEditedFonts({ ...client.assets.fonts })
    setEditedPhone(client.phone || '')
    setEditedNotify(client.notifyWhatsApp || false)
  }

  const handleSave = () => {
    if (activeClient) {
      updateClientAssets(activeClient.id, {
        logos: editedLogos,
        colors: editedColors,
        fonts: editedFonts,
      })
      updateClientPreferences(activeClient.id, editedPhone, editedNotify)
      setActiveClient(null)
      toast.success('Brand Kit atualizado com sucesso!')
    }
  }

  const handleCreateBrandKit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBrandName) {
      toast.error('Informe o nome do cliente ou marca.')
      return
    }
    addClient({
      name: newBrandName,
      healthScore: 100,
      assets: {
        logos: [],
        colors: [{ value: '#000000', status: 'Pending' }],
        fonts: { value: { primary: 'Inter', secondary: 'Inter' }, status: 'Pending' },
      },
    })
    setNewBrandName('')
    setIsNewBrandKitOpen(false)
    toast.success('Novo Brand Kit criado! Você já pode gerenciá-lo.')
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0])
      setEditedLogos([...editedLogos, { value: url, status: 'Pending' }])
      toast.success('Logo carregado e adicionado à lista.')
    }
  }

  const filteredClients = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  const renderBadge = (status: string) => {
    if (status === 'Approved')
      return (
        <Badge className="absolute -top-2 -right-2 scale-75 bg-success hover:bg-success">Ok</Badge>
      )
    if (status === 'Revision Requested')
      return (
        <Badge className="absolute -top-2 -right-2 scale-75 bg-destructive hover:bg-destructive text-white">
          X
        </Badge>
      )
    return (
      <Badge className="absolute -top-2 -right-2 scale-75 bg-warning text-yellow-900 border-yellow-400 hover:bg-warning">
        !
      </Badge>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Brand Kits</h1>
          <p className="text-muted-foreground">
            Gerencie os Kits de Marca (Cores, Fontes e Logos) para uso no Studio Criativo.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar clientes..."
              className="pl-9 bg-white shadow-sm"
            />
          </div>
          <Button onClick={() => setIsNewBrandKitOpen(true)} className="shrink-0 shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Novo
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClients.map((client) => {
          const needsRevision =
            client.assets.logos.some((l) => l.status === 'Revision Requested') ||
            client.assets.colors.some((c) => c.status === 'Revision Requested') ||
            client.assets.fonts.status === 'Revision Requested'

          return (
            <Card
              key={client.id}
              className={`shadow-subtle hover:shadow-elevation transition-shadow ${needsRevision ? 'border-destructive/50 bg-destructive/5' : ''}`}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  {needsRevision && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Revisão Cliente
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{client.name}</CardTitle>
                <CardDescription>Brand Kit sincronizado com a IA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2 flex-wrap">
                    {client.assets.colors.length > 0 ? (
                      client.assets.colors.map((c, i) => (
                        <div key={i} className="relative">
                          <div
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: c.value }}
                            title={c.value}
                          />
                          {c.status === 'Revision Requested' && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive" />
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Sem cores definidas
                      </span>
                    )}
                  </div>
                  {client.healthScore !== undefined && (
                    <Badge
                      className={
                        client.healthScore >= 80
                          ? 'bg-success hover:bg-success text-white'
                          : client.healthScore >= 50
                            ? 'bg-warning text-yellow-900 hover:bg-warning border-yellow-400'
                            : 'bg-destructive hover:bg-destructive text-white'
                      }
                    >
                      Health Score: {client.healthScore}/100
                    </Badge>
                  )}
                </div>
                <Button
                  variant={needsRevision ? 'default' : 'secondary'}
                  className="w-full"
                  onClick={() => handleEdit(client)}
                >
                  Gerenciar Brand Kit
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={isNewBrandKitOpen} onOpenChange={setIsNewBrandKitOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateBrandKit}>
            <DialogHeader>
              <DialogTitle>Novo Brand Kit</DialogTitle>
              <DialogDescription>
                Adicione uma nova marca para gerenciar seus ativos de design no Studio Criativo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="brandName">
                  Nome da Marca / Cliente <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="brandName"
                  placeholder="Ex: Lojas Renner"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsNewBrandKitOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Criar Brand Kit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={!!activeClient} onOpenChange={(open) => !open && setActiveClient(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {activeClient && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">Brand Kit Ativo</Badge>
                </div>
                <SheetTitle className="text-2xl">{activeClient.name}</SheetTitle>
                <SheetDescription>
                  Configure a identidade visual que será injetada nas criações.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-8">
                {/* Communication Settings */}
                <div className="space-y-3 pb-6 border-b">
                  <h4 className="text-sm font-semibold flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" /> Preferências de Comunicação
                  </h4>
                  <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">WhatsApp Cliente</Label>
                      <Input
                        value={editedPhone}
                        onChange={(e) => setEditedPhone(e.target.value)}
                        placeholder="Ex: 5511999999999"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        id="notify-wa"
                        checked={editedNotify}
                        onCheckedChange={setEditedNotify}
                      />
                      <Label htmlFor="notify-wa" className="text-xs cursor-pointer">
                        Ativar Alertas p/ Aprovação
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Logos Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center justify-between">
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" /> Logos da Marca
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud className="w-3 h-3 mr-1" /> Upload
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </h4>
                  <div className="flex gap-4 flex-wrap">
                    {editedLogos.length > 0 ? (
                      editedLogos.map((logo, i) => (
                        <div key={i} className="flex flex-col gap-1 w-28">
                          <div
                            className={`h-20 w-full bg-muted border rounded-md flex items-center justify-center relative p-2 text-center overflow-hidden ${logo.status === 'Revision Requested' ? 'border-destructive bg-destructive/10' : ''}`}
                          >
                            {logo.value.startsWith('blob:') ? (
                              <img
                                src={logo.value}
                                alt="Logo"
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : (
                              <span className="text-[10px] text-muted-foreground font-medium break-all">
                                {logo.value}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-0.5 right-0.5 h-5 w-5 bg-background/80 rounded-full text-muted-foreground hover:text-destructive hover:bg-background"
                              onClick={() =>
                                setEditedLogos(editedLogos.filter((_, idx) => idx !== i))
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            {renderBadge(logo.status)}
                          </div>
                          {logo.feedback && (
                            <span className="text-[10px] text-destructive leading-tight">
                              "{logo.feedback}"
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhum logo configurado.</p>
                    )}
                  </div>
                </div>

                {/* Colors Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center">
                    <Palette className="w-4 h-4 mr-2" /> Paleta de Cores
                  </h4>
                  <div className="flex gap-3 flex-col items-start">
                    {editedColors.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className={`relative flex items-center gap-2 bg-muted/50 p-1.5 rounded-md border shadow-sm ${color.status === 'Revision Requested' ? 'border-destructive bg-destructive/10' : ''}`}
                        >
                          <input
                            type="color"
                            value={color.value}
                            onChange={(e) => {
                              const newColors = [...editedColors]
                              newColors[idx] = { value: e.target.value, status: 'Pending' }
                              setEditedColors(newColors)
                            }}
                            className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                          />
                          <Input
                            value={color.value}
                            onChange={(e) => {
                              const newColors = [...editedColors]
                              newColors[idx] = { value: e.target.value, status: 'Pending' }
                              setEditedColors(newColors)
                            }}
                            className="w-24 h-7 text-xs font-mono uppercase bg-background shadow-none"
                            placeholder="#000000"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              setEditedColors(editedColors.filter((_, i) => i !== idx))
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          {renderBadge(color.status)}
                        </div>
                        {color.feedback && (
                          <span
                            className="text-xs text-destructive flex-1 italic max-w-[200px] truncate"
                            title={color.feedback}
                          >
                            "{color.feedback}"
                          </span>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditedColors([...editedColors, { value: '#000000', status: 'Pending' }])
                      }
                      className="h-9 border-dashed mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Adicionar Cor
                    </Button>
                  </div>
                </div>

                {/* Typography Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center">
                    <Type className="w-4 h-4 mr-2" /> Tipografia e Assets Externos
                  </h4>
                  <div
                    className={`p-4 rounded-xl border space-y-4 ${editedFonts.status === 'Revision Requested' ? 'border-destructive bg-destructive/5' : 'bg-muted/30'}`}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Primária (Títulos)</Label>
                        <Input
                          value={editedFonts.value.primary}
                          onChange={(e) =>
                            setEditedFonts({
                              value: { ...editedFonts.value, primary: e.target.value },
                              status: 'Pending',
                            })
                          }
                          placeholder="Ex: Inter"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Secundária (Textos)</Label>
                        <Input
                          value={editedFonts.value.secondary}
                          onChange={(e) =>
                            setEditedFonts({
                              value: { ...editedFonts.value, secondary: e.target.value },
                              status: 'Pending',
                            })
                          }
                          placeholder="Ex: Roboto"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Google Font Link</Label>
                      <Input
                        value={editedFonts.value.googleFontLink || ''}
                        onChange={(e) =>
                          setEditedFonts({
                            value: { ...editedFonts.value, googleFontLink: e.target.value },
                            status: 'Pending',
                          })
                        }
                        placeholder="https://fonts.googleapis.com/css2?family=..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Embed Code (&lt;link&gt; ou @import)
                      </Label>
                      <Textarea
                        value={editedFonts.value.embedCode || ''}
                        onChange={(e) =>
                          setEditedFonts({
                            value: { ...editedFonts.value, embedCode: e.target.value },
                            status: 'Pending',
                          })
                        }
                        placeholder="Cole o código de incorporação aqui..."
                        className="font-mono text-xs min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        XD Link ou Observações
                      </Label>
                      <Input
                        value={editedFonts.value.observations || ''}
                        onChange={(e) =>
                          setEditedFonts({
                            value: { ...editedFonts.value, observations: e.target.value },
                            status: 'Pending',
                          })
                        }
                        placeholder="Links para UI Kits ou anotações extras..."
                      />
                    </div>

                    {editedFonts.feedback && (
                      <p className="text-xs text-destructive mt-3 bg-destructive/10 p-2 rounded border border-destructive/20 italic">
                        Feedback do Cliente: "{editedFonts.feedback}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setActiveClient(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>Salvar Brand Kit</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
