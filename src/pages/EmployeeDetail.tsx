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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Edit2,
  Phone,
  Hash,
  Wifi,
  MessageSquare,
  PhoneOff,
  ExternalLink,
  MessageCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import useHRStore from '@/stores/useHRStore'
import { toast } from 'sonner'

export default function EmployeeDetail() {
  const { id } = useParams()
  const { employees, updateEmployee } = useHRStore()
  const emp = employees.find((e) => e.id === id)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState(emp || ({} as any))

  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false)
  const [smsCodes, setSmsCodes] = useState<{ code: string; time: string }[]>([])
  const [isReceivingSms, setIsReceivingSms] = useState(false)

  if (!emp)
    return <div className="p-8 text-center text-muted-foreground">Colaborador não encontrado.</div>

  const admission = new Date(emp.admissionDate)
  const diffTime = Math.abs(new Date().getTime() - admission.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0])
      setFormData({ ...formData, photoUrl: url })
      toast.success('Foto pronta para salvamento.')
    }
  }

  const handleGenerateWA = () => {
    const newPhone = `+55 41 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
    setFormData({ ...formData, lines: (formData.lines || 0) + 1, phoneProfessional: newPhone })
    toast.success('Linha de WhatsApp gerada com sucesso!', {
      description: `Número atribuído: ${newPhone} (WhatsApp Web apenas)`,
    })
  }

  const handleSave = () => {
    if (id) updateEmployee(id, formData)
    setIsEditOpen(false)
    toast.success('Colaborador atualizado com sucesso!')
  }

  const simulateSmsReception = () => {
    setIsReceivingSms(true)
    setTimeout(() => {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString()
      setSmsCodes([{ code: newCode, time: new Date().toLocaleTimeString() }, ...smsCodes])
      setIsReceivingSms(false)
      toast.success('Novo código recebido!')
    }, 4000)
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
              {emp.phoneProfessional && <p className="text-foreground">{emp.phoneProfessional}</p>}
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
              <TabsTrigger
                value="recursos"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 font-medium"
              >
                Recursos
              </TabsTrigger>
              <TabsTrigger
                value="financeiro"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 font-medium"
              >
                Dados financeiros
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
                    {admission.toLocaleDateString('pt-BR')}{' '}
                    <span className="text-muted-foreground text-sm ml-1">({diffDays} dias)</span>
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
                      Telefone profissional
                    </Label>
                    <p className="text-base font-medium mt-1">{emp.phoneProfessional || '-'}</p>
                  </div>
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
            <TabsContent value="recursos" className="pt-8">
              <p className="text-sm text-muted-foreground">Nenhum recurso atribuído no momento.</p>
            </TabsContent>
            <TabsContent value="financeiro" className="pt-8">
              <p className="text-sm text-muted-foreground">
                Dados financeiros sob sigilo e acesso restrito.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto w-full p-0 flex flex-col">
          <SheetHeader className="p-6 border-b pb-6 shrink-0 bg-background/95 backdrop-blur z-10 sticky top-0">
            <SheetTitle>Editar Colaborador</SheetTitle>
            <SheetDescription>
              Atualize os dados, contatos e gerencie acessos e telefonia.
            </SheetDescription>
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

            <div className="space-y-4 border-b pb-6">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-success" /> Telefonia (Linhas Virtuais)
              </h4>
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-sm text-[#166534] mb-1">Número para WhatsApp</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Linhas ativas:{' '}
                    <strong className="text-foreground">{formData.lines || 0}</strong>
                  </p>
                  {formData.phoneProfessional && (
                    <p className="text-sm font-mono text-foreground flex items-center gap-2 flex-wrap">
                      {formData.phoneProfessional}
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-white text-muted-foreground shadow-sm font-normal"
                      >
                        WhatsApp Web apenas
                      </Badge>
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateWA}
                  className="shrink-0 bg-white border-[#86efac] hover:bg-[#dcfce3] text-[#166534] shadow-sm font-semibold"
                >
                  <Hash className="w-4 h-4 mr-2" /> Gerar Nova Linha
                </Button>
              </div>

              {formData.lines > 0 && (
                <div className="mt-6 space-y-6 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Saldo Disponível
                    <span className="ml-2 font-normal normal-case text-[10px]">
                      Números virtuais não têm dados, SMS ou ligações
                    </span>
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white border rounded-lg p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-gray-50 shrink-0">
                        <Wifi className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Internet disponível
                        </span>
                        <span className="font-bold text-sm">Sem internet</span>
                      </div>
                    </div>
                    <div className="bg-white border rounded-lg p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-pink-200 flex items-center justify-center bg-pink-50 shrink-0">
                        <MessageSquare className="w-5 h-5 text-pink-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                          SMS disponíveis
                        </span>
                        <span className="font-bold text-sm">Somente recebe</span>
                      </div>
                    </div>
                    <div className="bg-white border rounded-lg p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-gray-50 shrink-0">
                        <PhoneOff className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Ligações disponíveis
                        </span>
                        <span className="font-bold text-sm">Sem ligações</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Confirmação do WhatsApp
                      </h5>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-xs text-gray-600 hover:text-gray-900"
                        onClick={() => {
                          setIsSmsModalOpen(true)
                          simulateSmsReception()
                        }}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" /> Ver SMS (Em tempo real)
                      </Button>
                    </div>
                    {smsCodes.length > 0 && (
                      <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm mt-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-50 border border-green-100 rounded-full flex items-center justify-center text-green-600">
                            <MessageCircle className="w-6 h-6 fill-current" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground">WhatsApp</p>
                            <p className="text-xs text-muted-foreground">
                              Último recebido {smsCodes[0].time}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 text-2xl font-mono font-medium text-gray-800">
                          {smsCodes[0].code.split('').map((digit, i) => (
                            <span
                              key={i}
                              className="bg-white px-3 py-1 rounded shadow-sm border border-gray-200"
                            >
                              {digit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Informações da Linha
                    </h5>
                    <div className="grid grid-cols-2 gap-y-4 max-w-sm ml-12">
                      <span className="text-sm font-semibold text-right text-muted-foreground mr-6">
                        Ativado em
                      </span>
                      <span className="text-sm font-mono text-gray-600 tracking-wide">
                        {new Date().toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-sm font-semibold text-right text-muted-foreground mr-6">
                        Tipo do chip
                      </span>
                      <span className="text-sm text-gray-700">Número virtual</span>
                      <span className="text-sm font-semibold text-right text-muted-foreground mr-6">
                        Centro de custo
                      </span>
                      <span className="text-sm text-gray-700">-</span>
                    </div>
                  </div>
                </div>
              )}
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

      <Dialog open={isSmsModalOpen} onOpenChange={setIsSmsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Caixa de Entrada SMS (Tempo Real)</DialogTitle>
            <DialogDescription>
              Aguardando códigos de verificação para o número {formData.phoneProfessional}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 min-h-[150px] flex flex-col justify-center border rounded-lg bg-muted/30">
            {isReceivingSms && smsCodes.length === 0 ? (
              <div className="flex flex-col items-center text-muted-foreground gap-2">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm">Aguardando envio pelo WhatsApp...</p>
              </div>
            ) : (
              <div className="space-y-3 px-4">
                {smsCodes.map((sms, i) => (
                  <div
                    key={i}
                    className="bg-white p-3 rounded shadow-sm text-sm border flex justify-between"
                  >
                    <span>
                      <strong className="text-primary">{sms.code}</strong> é o seu código de
                      verificação do WhatsApp Business.
                    </span>
                    <span className="text-xs text-muted-foreground">{sms.time}</span>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={simulateSmsReception}
                  disabled={isReceivingSms}
                >
                  {isReceivingSms ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}{' '}
                  Solicitar Novo Código
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
