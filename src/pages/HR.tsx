import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import useHRStore from '@/stores/useHRStore'
import { Search, Plus, MoreHorizontal, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export default function HR() {
  const { employees, syncWithGoogle, addEmployee } = useHRStore()
  const [activeTab, setActiveTab] = useState('Todos')
  const [search, setSearch] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [isNewCollabOpen, setIsNewCollabOpen] = useState(false)
  const [newCollab, setNewCollab] = useState({
    name: '',
    emailProfessional: '',
    role: '',
    area: '',
    contractType: 'CLT',
  })

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      syncWithGoogle()
      setIsSyncing(false)
      toast.success('Sincronização Google Workspace concluída!', {
        description: 'Dados de colaboradores e fotos foram atualizados do diretório.',
      })
    }, 1500)
  }

  const handleCreateCollab = () => {
    if (!newCollab.name || !newCollab.emailProfessional) {
      toast.error('Preencha os campos obrigatórios.')
      return
    }

    addEmployee({
      id: Math.random().toString(36).substr(2, 9),
      name: newCollab.name,
      email: newCollab.emailProfessional,
      role: newCollab.role,
      area: newCollab.area,
      integration: null,
      equipmentCount: 0,
      lines: 0,
      status: 'Ativo',
      admissionDate: new Date().toISOString().split('T')[0],
      emailProfessional: newCollab.emailProfessional,
      contractType: newCollab.contractType,
    })

    toast.success('Colaborador adicionado com sucesso!')
    setIsNewCollabOpen(false)
    setNewCollab({ name: '', emailProfessional: '', role: '', area: '', contractType: 'CLT' })
  }

  const filtered = employees.filter((e) => {
    if (activeTab === 'Contratações' && e.status === 'Desligado') return false
    if (activeTab === 'Saídas' && e.status === 'Ativo') return false
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Colaboradores</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} /> Sincronizar
            RH Google
          </Button>
          <Button onClick={() => setIsNewCollabOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo colaborador
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent border-b border-border/50 rounded-none w-full justify-start h-12 p-0 space-x-6">
          <TabsTrigger
            value="Todos"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 font-medium"
          >
            Todos
          </TabsTrigger>
          <TabsTrigger
            value="Contratações"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 font-medium"
          >
            Contratações
          </TabsTrigger>
          <TabsTrigger
            value="Saídas"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 font-medium"
          >
            Saídas
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex justify-between items-center py-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Busque por colaborador"
            className="pl-9 bg-background shadow-sm border-muted"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            className="text-muted-foreground font-medium"
            onClick={() => toast.info('Filtros avançados em desenvolvimento.')}
          >
            Filtros
          </Button>
          <Button variant="ghost" size="icon" onClick={() => toast.info('Mais ações disponíves.')}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="shadow-subtle border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b-border/50">
              <TableHead className="font-semibold text-foreground pl-6">Nome</TableHead>
              <TableHead className="font-semibold text-foreground">E-mail</TableHead>
              <TableHead className="font-semibold text-foreground">Cargo</TableHead>
              <TableHead className="font-semibold text-foreground">Área</TableHead>
              <TableHead className="font-semibold text-foreground text-center">
                Integração
              </TableHead>
              <TableHead className="font-semibold text-foreground text-center">
                Equipamentos
              </TableHead>
              <TableHead className="font-semibold text-foreground text-center">Linhas</TableHead>
              <TableHead className="font-semibold text-foreground">Situação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((emp) => (
              <TableRow
                key={emp.id}
                className="hover:bg-muted/20 border-b-border/50 transition-colors"
              >
                <TableCell className="font-medium text-foreground pl-6">
                  <Link
                    to={`/rh/colaborador/${emp.id}`}
                    className="hover:underline text-primary transition-all underline-offset-4"
                  >
                    {emp.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                <TableCell>{emp.role}</TableCell>
                <TableCell className="text-muted-foreground">{emp.area}</TableCell>
                <TableCell className="text-center">
                  {emp.integration === 'Google Workspace' && (
                    <img
                      src="https://img.usecurling.com/i?q=google&color=multicolor&shape=fill"
                      alt="Google Workspace"
                      title="Google Workspace Sincronizado"
                      className="h-4 w-4 mx-auto"
                    />
                  )}
                </TableCell>
                <TableCell className="text-center text-muted-foreground font-mono">
                  {emp.equipmentCount}
                </TableCell>
                <TableCell className="text-center text-muted-foreground font-mono">
                  {emp.lines}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={emp.status === 'Ativo' ? 'default' : 'secondary'}
                    className={
                      emp.status === 'Ativo'
                        ? 'bg-success/10 text-success border-success/20 hover:bg-success/20 shadow-none'
                        : 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 shadow-none'
                    }
                  >
                    {emp.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  Nenhum colaborador encontrado com os filtros atuais.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isNewCollabOpen} onOpenChange={setIsNewCollabOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Colaborador</DialogTitle>
            <DialogDescription>Adicione um membro da equipe manualmente.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input
                value={newCollab.name}
                onChange={(e) => setNewCollab({ ...newCollab, name: e.target.value })}
                placeholder="Ex: João da Silva"
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail Profissional</Label>
              <Input
                value={newCollab.emailProfessional}
                onChange={(e) => setNewCollab({ ...newCollab, emailProfessional: e.target.value })}
                placeholder="joao@cavadigital.com.br"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input
                  value={newCollab.role}
                  onChange={(e) => setNewCollab({ ...newCollab, role: e.target.value })}
                  placeholder="Ex: Copywriter"
                />
              </div>
              <div className="space-y-2">
                <Label>Área</Label>
                <Input
                  value={newCollab.area}
                  onChange={(e) => setNewCollab({ ...newCollab, area: e.target.value })}
                  placeholder="Ex: Performance"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCollabOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateCollab}>Criar Cadastro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
