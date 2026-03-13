import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useAppContext, Client } from '@/components/AppContext'
import { UploadCloud, Plus, X, Search, Briefcase, Palette, Type } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function Clients() {
  const { clients, updateClientAssets } = useAppContext()
  const [search, setSearch] = useState('')
  const [activeClient, setActiveClient] = useState<Client | null>(null)
  const [editedColors, setEditedColors] = useState<string[]>([])
  const [editedFonts, setEditedFonts] = useState({ primary: '', secondary: '' })

  const handleEdit = (client: Client) => {
    setActiveClient(client)
    setEditedColors([...client.assets.colors])
    setEditedFonts({ ...client.assets.fonts })
  }

  const handleSave = () => {
    if (activeClient) {
      updateClientAssets(activeClient.id, {
        logos: activeClient.assets.logos,
        colors: editedColors,
        fonts: editedFonts,
      })
      setActiveClient(null)
    }
  }

  const filteredClients = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes & Brand Assets</h1>
          <p className="text-muted-foreground">
            Gerencie o portfólio de clientes e suas identidades visuais centralizadas.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar clientes..."
            className="pl-9 bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="shadow-subtle hover:shadow-elevation transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 text-primary">
                <Briefcase className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">{client.name}</CardTitle>
              <CardDescription>Assets sincronizados com geradores IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4 flex-wrap">
                {client.assets.colors.map((c, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
              <Button variant="secondary" className="w-full" onClick={() => handleEdit(client)}>
                Gerenciar Marca
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={!!activeClient} onOpenChange={(open) => !open && setActiveClient(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {activeClient && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">Brand Assets</Badge>
                </div>
                <SheetTitle className="text-2xl">{activeClient.name}</SheetTitle>
                <SheetDescription>
                  Configure a identidade visual que a IA irá usar como referência.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-8">
                {/* Logos Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" /> Logos da Marca
                  </h4>
                  <div className="flex gap-4 flex-wrap">
                    {activeClient.assets.logos.map((logo, i) => (
                      <div
                        key={i}
                        className="h-20 w-28 bg-muted border rounded-md flex flex-col items-center justify-center relative group p-2 text-center"
                      >
                        <span className="text-[10px] text-muted-foreground font-medium break-all">
                          {logo}
                        </span>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <div className="border-2 border-dashed border-border rounded-md h-20 w-28 flex flex-col items-center justify-center text-center bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
                      <UploadCloud className="h-5 w-5 text-muted-foreground mb-1" />
                      <span className="text-[10px] font-medium text-muted-foreground">Upload</span>
                    </div>
                  </div>
                </div>

                {/* Colors Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center">
                    <Palette className="w-4 h-4 mr-2" /> Paleta de Cores
                  </h4>
                  <div className="flex gap-2 flex-wrap items-center">
                    {editedColors.map((color, idx) => (
                      <div
                        key={idx}
                        className="relative flex items-center gap-2 bg-muted/50 p-1.5 rounded-md border shadow-sm"
                      >
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...editedColors]
                            newColors[idx] = e.target.value
                            setEditedColors(newColors)
                          }}
                          className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                        />
                        <span className="text-xs font-mono uppercase w-16">{color}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            setEditedColors(editedColors.filter((_, i) => i !== idx))
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditedColors([...editedColors, '#000000'])}
                      className="h-9 border-dashed"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Adicionar Cor
                    </Button>
                  </div>
                </div>

                {/* Typography Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center">
                    <Type className="w-4 h-4 mr-2" /> Tipografia
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Fonte Primária (Títulos)
                      </Label>
                      <Input
                        value={editedFonts.primary}
                        onChange={(e) =>
                          setEditedFonts({ ...editedFonts, primary: e.target.value })
                        }
                        placeholder="Ex: Inter"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Fonte Secundária (Textos)
                      </Label>
                      <Input
                        value={editedFonts.secondary}
                        onChange={(e) =>
                          setEditedFonts({ ...editedFonts, secondary: e.target.value })
                        }
                        placeholder="Ex: Roboto"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setActiveClient(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>Salvar Configurações</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
