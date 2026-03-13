import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppContext } from '@/components/AppContext'
import { useGoogleAuth } from '@/hooks/use-google-auth'
import {
  BarChart3,
  List,
  Calendar as CalendarIcon,
  Clock,
  Edit,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MOCK_HOURS_PER_PROJECT_WEEK, MOCK_HOURS_PER_PROJECT_MONTH } from '@/lib/data'
import { toast } from 'sonner'

export default function Profile() {
  const {
    myTimeLogs,
    attendanceState,
    requestTimeLogApproval,
    weeklyGoal,
    getEffectiveGoal,
    currentUser,
    updateCurrentUser,
    isGoogleConnected,
    googleEmail,
  } = useAppContext()

  const { handleConnect, isAuthLoading } = useGoogleAuth()

  const [timeView, setTimeView] = useState<'week' | 'month'>('week')

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(currentUser)

  useEffect(() => {
    setFormData(currentUser)
  }, [currentUser])

  const chartData = timeView === 'week' ? MOCK_HOURS_PER_PROJECT_WEEK : MOCK_HOURS_PER_PROJECT_MONTH
  const totalHours = chartData.reduce((acc, curr) => acc + curr.hours, 0)

  const currentGoal = getEffectiveGoal(weeklyGoal, timeView)
  const balance = totalHours - currentGoal
  const balanceColor =
    balance > 0 ? 'text-success' : balance < 0 ? 'text-destructive' : 'text-foreground'

  const filteredLogs = myTimeLogs.filter((log) => {
    if (!startDate && !endDate) return true

    const [day, month, year] = log.date.split('/')
    const logDate = new Date(`${year}-${month}-${day}T12:00:00`)

    if (startDate) {
      const start = new Date(`${startDate}T00:00:00`)
      if (logDate < start) return false
    }
    if (endDate) {
      const end = new Date(`${endDate}T23:59:59`)
      if (logDate > end) return false
    }
    return true
  })

  const handleSaveProfile = () => {
    updateCurrentUser(formData)
    setIsEditing(false)
    toast.success('Perfil atualizado com sucesso!', {
      description: 'As alterações foram salvas no banco de dados e refletidas no sistema.',
    })
  }

  const handleCancelProfile = () => {
    setFormData(currentUser)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl overflow-hidden shadow-sm border border-primary/20 shrink-0">
            <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{currentUser.name}</h1>
            <p className="text-muted-foreground">
              {currentUser.role} • {currentUser.contract}
            </p>
          </div>
        </div>
        <Badge
          variant={
            attendanceState === 'working'
              ? 'default'
              : attendanceState === 'paused'
                ? 'secondary'
                : 'outline'
          }
          className={attendanceState === 'working' ? 'bg-success hover:bg-success text-white' : ''}
        >
          {attendanceState === 'working'
            ? 'Em Atividade'
            : attendanceState === 'paused'
              ? 'Em Pausa'
              : 'Offline'}
        </Badge>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-12 mb-6">
          <TabsTrigger value="general">Geral & Perfil</TabsTrigger>
          <TabsTrigger value="productivity">Produtividade & Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="shadow-subtle">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Informações Pessoais</CardTitle>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 shadow-sm"
                >
                  <Edit className="w-4 h-4 mr-2" /> Editar Perfil
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome Completo</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nome Completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>E-mail Corporativo</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@empresa.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cargo</Label>
                      <Input
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="Ex: Desenvolvedor Front-end"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+55 11 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contrato</Label>
                      <Select
                        value={formData.contract}
                        onValueChange={(val) => setFormData({ ...formData, contract: val })}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CLT">CLT</SelectItem>
                          <SelectItem value="PJ">PJ</SelectItem>
                          <SelectItem value="Estágio">Estágio</SelectItem>
                          <SelectItem value="Freelancer">Freelancer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={handleCancelProfile}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveProfile} className="shadow-md">
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground block mb-1">
                      Nome Completo
                    </span>
                    <span className="font-semibold">{currentUser.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground block mb-1">
                      E-mail Corporativo
                    </span>
                    <span className="font-semibold">{currentUser.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground block mb-1">Cargo</span>
                    <span className="font-semibold">{currentUser.role}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground block mb-1">Telefone</span>
                    <span className="font-semibold">{currentUser.phone}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground block mb-1">Contrato</span>
                    <span className="font-semibold">{currentUser.contract}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-bold mb-4">Integrações de Conta</h3>
            <Card className="shadow-subtle">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <img
                    src="https://img.usecurling.com/i?q=google&color=multicolor&shape=fill"
                    className="w-4 h-4"
                    alt="Google"
                  />
                  Google Workspace
                </CardTitle>
                <CardDescription>
                  Conecte sua conta Google para sincronização bidirecional de reuniões e eventos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGoogleConnected ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-success/5 border border-success/20 p-4 rounded-lg">
                    <div>
                      <p className="font-semibold text-success flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Conectado com Sucesso
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Conta vinculada: <strong>{googleEmail}</strong>
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleConnect()}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 w-full sm:w-auto"
                    >
                      Desconectar
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 border p-4 rounded-lg">
                    <div>
                      <p className="font-semibold">Nenhuma conta conectada</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Habilite o sync de calendário conectando sua conta oficial.
                      </p>
                    </div>
                    <Button
                      onClick={() => handleConnect()}
                      disabled={isAuthLoading}
                      className="w-full sm:w-auto"
                    >
                      {isAuthLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <img
                          src="https://img.usecurling.com/i?q=google&color=multicolor&shape=fill"
                          className="w-4 h-4 mr-2"
                          alt="Google"
                        />
                      )}
                      Conectar Conta Google
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Relatório de Horas
            </h3>
            <div className="flex bg-muted/50 p-1 rounded-lg border shadow-sm">
              <Button
                variant={timeView === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeView('week')}
              >
                Resumo Semanal
              </Button>
              <Button
                variant={timeView === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeView('month')}
              >
                Resumo Mensal
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="shadow-subtle md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Horas por Projeto ({timeView === 'week' ? 'Semana' : 'Mês'})
                </CardTitle>
                <CardDescription>
                  Distribuição do seu tempo nos principais projetos da agência.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ hours: { label: 'Horas Trabalhadas', color: 'hsl(var(--primary))' } }}
                  className="h-[250px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="project"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        fontSize={10}
                        tickFormatter={(value) =>
                          value.length > 15 ? value.substring(0, 15) + '...' : value
                        }
                      />
                      <YAxis axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="shadow-elevation border-primary/20 bg-primary/5 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-base text-primary">Total Consolidado</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[200px] relative z-10">
                <div className="text-5xl font-black text-foreground mb-2 tabular-nums">
                  {totalHours}h
                </div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest bg-background/50 px-3 py-1 rounded-full border shadow-sm">
                  {timeView === 'week' ? 'Nesta Semana' : 'Neste Mês'}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-subtle relative overflow-hidden">
              <div
                className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${balance > 0 ? 'bg-success' : balance < 0 ? 'bg-destructive' : 'bg-muted'}`}
              />
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-base text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Banco de Horas
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[200px] relative z-10">
                <div className={`text-5xl font-black mb-2 tabular-nums ${balanceColor}`}>
                  {balance > 0 ? '+' : ''}
                  {balance}h
                </div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-full border shadow-sm">
                  Saldo {timeView === 'week' ? 'Semanal' : 'Mensal'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-subtle">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <List className="w-5 h-5 text-muted-foreground" /> Meus Pontos (Histórico)
                </CardTitle>
                <div className="flex items-center gap-2 text-sm bg-background p-1.5 rounded-lg border shadow-sm">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground ml-1" />
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-7 w-[130px] text-xs bg-transparent border-0"
                  />
                  <span className="text-muted-foreground text-xs">até</span>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-7 w-[130px] text-xs bg-transparent border-0"
                  />
                  <Button variant="secondary" size="sm" className="h-7 text-xs px-2">
                    Filtrar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/5">
                    <TableHead className="pl-6">Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Projeto Associado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                        Nenhum registro encontrado para este período.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium pl-6">{log.date}</TableCell>
                        <TableCell className="font-mono text-muted-foreground">
                          {log.time}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.type}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{log.project}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              log.status === 'Aprovado'
                                ? 'default'
                                : log.status === 'Rejeitado'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                            className={
                              log.status === 'Aprovado'
                                ? 'bg-success hover:bg-success text-white'
                                : ''
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          {log.status === 'Rascunho' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8"
                              onClick={() => {
                                requestTimeLogApproval(log.id)
                                toast.success('Aprovação solicitada com sucesso!')
                              }}
                            >
                              Solicitar Aprovação
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
