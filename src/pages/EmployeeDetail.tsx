import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Edit2 } from 'lucide-react'
import useHRStore from '@/stores/useHRStore'
import { toast } from 'sonner'

export default function EmployeeDetail() {
  const { id } = useParams()
  const { employees, updateEmployee } = useHRStore()
  const emp = employees.find((e) => e.id === id)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState<any>(emp || {})

  useEffect(() => {
    if (emp) setFormData(emp)
  }, [emp])

  if (!emp) {
    return <div className="p-8 text-center text-muted-foreground">Colaborador não encontrado.</div>
  }

  const admission = emp.admissionDate ? new Date(emp.admissionDate) : new Date()
  const diffTime = Math.abs(new Date().getTime() - admission.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 0

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0])
      setFormData({ ...formData, photoUrl: url })
      toast.success('Foto pronta para salvamento.')
    }
  }

  const handleSave = () => {
    if (id) updateEmployee(id, formData)
    setIsEditOpen(false)
    toast.success('Colaborador atualizado com sucesso!')
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/rh">Colaboradores</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="font-medium text-foreground">{emp.name}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{emp.name}</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setFormData(emp)
            setIsEditOpen(true)
          }}
          className="shadow-sm"
        >
          <Edit2 className="w-4 h-4 mr-2" /> Editar colaborador
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-80 shrink-0 space-y-6">
          <div className="rounded-xl overflow-hidden shadow-sm border border-border aspect-square relative bg-muted flex items-center justify-center">
            {emp.photoUrl ? (
              <img src={emp.photoUrl} alt={emp.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl font-bold text-muted-foreground opacity-50">
                {emp.name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold uppercase tracking-tight leading-tight">{emp.name}</h2>
            <p className="text-muted-foreground text-sm font-medium">
              {emp.role} | {emp.area}
            </p>
            <div className="pt-2 space-y-1 text-sm">
              <p className="text-primary hover:underline cursor-pointer">{emp.emailProfessional}</p>
            </div>
            <div className="pt-3">
              <Badge
                variant={emp.status === 'Ativo' ? 'default' : 'secondary'}
                className={`shadow-none ${emp.status === 'Ativo' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}
              >
                {emp.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <Tabs defaultValue="gerais" className="w-full">
            <TabsList className="bg-transparent border-b border-border/50 rounded-none w-full justify-start h-12 p-0 space-x-6 overflow-x-auto flex-nowrap">
              <TabsTrigger
                value="gerais"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 font-medium"
              >
                Informações gerais
              </TabsTrigger>
              <TabsTrigger
                value="historico"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 font-medium"
              >
                Histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gerais" className="pt-8 space-y-12 animate-fade-in-up">
              <div className="grid sm:grid-cols-2 gap-y-8 gap-x-12">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Cargo
                  </Label>
                  <p className="text-base font-medium mt-1">{emp.role}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Área
                  </Label>
                  <p className="text-base font-medium mt-1">{emp.area}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Regime de contratação
                  </Label>
                  <p className="text-base font-medium mt-1">{emp.contractType}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Data de admissão
                  </Label>
                  <p className="text-base font-medium mt-1">
                    {emp.admissionDate ? admission.toLocaleDateString('pt-BR') : '-'}
                    {emp.admissionDate && (
                      <span className="text-muted-foreground text-sm ml-1">({diffDays} dias)</span>
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Data de desligamento
                  </Label>
                  <p className="text-base font-medium mt-1">
                    {emp.resignationDate
                      ? new Date(emp.resignationDate).toLocaleDateString('pt-BR')
                      : '-'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Integração
                  </Label>
                  <p className="text-base font-medium mt-1 flex items-center gap-2">
                    {emp.integration === 'Google Workspace' && (
                      <img
                        src="https://img.usecurling.com/i?q=google&color=multicolor&shape=fill"
                        alt="G"
                        className="w-5 h-5"
                      />
                    )}
                    {emp.integration || 'Nenhuma'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Situação
                  </Label>
                  <p className="mt-1">
                    <Badge
                      variant="outline"
                      className={`shadow-none text-sm ${emp.status === 'Ativo' ? 'text-success border-success/30' : 'text-destructive border-destructive/30'}`}
                    >
                      {emp.status}
                    </Badge>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 border-b pb-2">
                  Contato
                </h3>
                <div className="grid sm:grid-cols-2 gap-y-8 gap-x-12">
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      E-mail profissional
                    </Label>
                    <p className="text-base font-medium mt-1">{emp.emailProfessional || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Telefone pessoal
                    </Label>
                    <p className="text-base font-medium mt-1">{emp.phonePersonal || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      E-mail pessoal
                    </Label>
                    <p className="text-base font-medium mt-1">{emp.emailPersonal || '-'}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="historico" className="pt-8">
              <p className="text-sm text-muted-foreground">
                Nenhum evento registrado no histórico.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto w-full p-0 flex flex-col">
          <SheetHeader className="p-6 border-b pb-6 shrink-0 bg-background/95 backdrop-blur z-10 sticky top-0">
            <SheetTitle>Editar Colaborador</SheetTitle>
            <SheetDescription>Atualize os dados e contatos do colaborador.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 p-6 space-y-8">
            <div className="space-y-4 border-b pb-6">
              <h4 className="font-semibold text-sm">Foto de Perfil (Override do Google)</h4>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted border overflow-hidden shadow-sm shrink-0">
                  {formData.photoUrl && (
                    <img src={formData.photoUrl} className="w-full h-full object-cover" />
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="max-w-[250px] cursor-pointer text-xs"
                />
              </div>
            </div>

            <div className="grid gap-4">
              <h4 className="font-semibold text-sm">Dados Básicos e Contato</h4>
              <div className="grid gap-2">
                <Label>Nome Completo</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Cargo</Label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Área/Departamento</Label>
                  <Input
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>E-mail Profissional</Label>
                  <Input
                    type="email"
                    value={formData.emailProfessional}
                    onChange={(e) =>
                      setFormData({ ...formData, emailProfessional: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>E-mail Pessoal</Label>
                  <Input
                    type="email"
                    value={formData.emailPersonal || ''}
                    onChange={(e) => setFormData({ ...formData, emailPersonal: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Telefone Pessoal</Label>
                  <Input
                    value={formData.phonePersonal || ''}
                    onChange={(e) => setFormData({ ...formData, phonePersonal: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Data de Admissão</Label>
                  <Input
                    type="date"
                    value={formData.admissionDate || ''}
                    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Data de Desligamento</Label>
                  <Input
                    type="date"
                    value={formData.resignationDate || ''}
                    onChange={(e) => setFormData({ ...formData, resignationDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
          <SheetFooter className="p-6 border-t shrink-0 bg-background z-10 sticky bottom-0">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="shadow-md">
              Salvar Alterações
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
