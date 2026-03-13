import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBranch } from '@/components/BranchContext'
import { MOCK_EMPLOYEES } from '@/lib/data'
import { UserPlus, Clock, Download, FileText, CheckCircle2, XCircle } from 'lucide-react'
import { useAppContext } from '@/components/AppContext'
import { toast } from 'sonner'

export default function HR() {
  const { currentBranch } = useBranch()
  const {
    teamLogs,
    reviewTeamLog,
    holidays,
    addHoliday,
    removeHoliday,
    managementLogs,
    getEffectiveGoal,
  } = useAppContext()
  const [selectedEmp, setSelectedEmp] = useState<any>(null)

  const [newHolidayDate, setNewHolidayDate] = useState<Date | undefined>(undefined)
  const [newHolidayDesc, setNewHolidayDesc] = useState('')

  const employees = MOCK_EMPLOYEES.filter(
    (e) => currentBranch === 'Consolidado' || e.branch === currentBranch,
  )

  const handleExportCSV = () => {
    const headers = 'Colaborador,Data,Entrada,Saída,Total Horas,Projeto\n'
    const rows = employees
      .flatMap((emp) =>
        (emp.recentLogs || [])
          .filter((log: any) => log.status === 'Aprovado' || log.status === 'Approved')
          .map(
            (log: any) =>
              `${emp.name},${log.date},${log.entry},${log.exit},${log.hours},${log.project || 'Geral'}`,
          ),
      )
      .join('\n')
    const csv = headers + rows
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.setAttribute('download', 'relatorio_folha.csv')
    a.click()
    toast.success('CSV exportado com sucesso!', {
      description: 'Apenas pontos aprovados foram incluídos.',
    })
  }

  const handleExportPDF = () => {
    toast.info('Preparando impressão PDF...')
    setTimeout(() => {
      window.print()
    }, 500)
  }

  const handleAddHoliday = () => {
    if (newHolidayDate && newHolidayDesc) {
      addHoliday(newHolidayDate.toISOString(), newHolidayDesc)
      setNewHolidayDate(undefined)
      setNewHolidayDesc('')
      toast.success('Feriado adicionado', { description: 'A meta de horas será recalculada.' })
    }
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in print:hidden max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Equipe & RH</h1>
            <p className="text-muted-foreground">
              Acompanhe a atividade, assiduidade e gerencie aprovações de ponto ({currentBranch}).
            </p>
          </div>
          <Button className="bg-foreground text-background hover:bg-foreground/90">
            <UserPlus className="mr-2 h-4 w-4" /> Novo Colaborador
          </Button>
        </div>

        <Tabs defaultValue="painel" className="w-full">
          <TabsList className="grid w-full lg:grid-cols-5 md:grid-cols-3 grid-cols-2 h-auto gap-1 mb-6 p-1 bg-muted/50 rounded-lg">
            <TabsTrigger value="painel">Painel</TabsTrigger>
            <TabsTrigger value="aprovacoes" className="relative">
              Aprovações
              {teamLogs.filter((l) => l.status === 'Pendente').length > 0 && (
                <span className="absolute top-1 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />
              )}
            </TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            <TabsTrigger value="feriados">Feriados</TabsTrigger>
            <TabsTrigger value="historico">Histórico de Gestão</TabsTrigger>
          </TabsList>

          <TabsContent value="painel" className="space-y-6">
            <Card className="shadow-subtle">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle>Visão em Tempo Real</CardTitle>
                  <CardDescription>Status atual da equipe ativa.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Cargo/Contrato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assiduidade (Health)</TableHead>
                      <TableHead>Banco de Horas</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((emp) => {
                      const effectiveGoal = getEffectiveGoal(emp.weeklyGoal || 40, 'week')
                      const balance = (emp.workedHours || 0) - effectiveGoal
                      return (
                        <TableRow key={emp.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium">
                            {emp.name}
                            <div className="text-xs text-muted-foreground mt-0.5">{emp.branch}</div>
                          </TableCell>
                          <TableCell>
                            {emp.role}
                            <div className="mt-1">
                              <Badge
                                variant={emp.contract === 'CLT' ? 'default' : 'outline'}
                                className="text-[10px]"
                              >
                                {emp.contract}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                emp.status === 'Em Atividade'
                                  ? 'default'
                                  : emp.status === 'Em Pausa'
                                    ? 'secondary'
                                    : 'outline'
                              }
                              className={
                                emp.status === 'Em Atividade'
                                  ? 'bg-success hover:bg-success text-white'
                                  : ''
                              }
                            >
                              {emp.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3 max-w-[140px]">
                              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden border">
                                <div
                                  className={`h-full ${emp.attendanceScore >= 90 ? 'bg-success' : emp.attendanceScore >= 70 ? 'bg-warning' : 'bg-destructive'}`}
                                  style={{ width: `${emp.attendanceScore}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold tabular-nums">
                                {emp.attendanceScore}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                balance > 0
                                  ? 'bg-success/10 text-success border-success/30 font-semibold'
                                  : balance < 0
                                    ? 'bg-destructive/10 text-destructive border-destructive/30 font-semibold'
                                    : 'bg-muted text-muted-foreground font-semibold'
                              }
                            >
                              {balance > 0 ? '+' : ''}
                              {balance}h
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedEmp(emp)}>
                              <Clock className="w-4 h-4 mr-2" /> Ver Logs
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aprovacoes" className="space-y-6">
            <Card className="shadow-subtle border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle>Aprovações Pendentes</CardTitle>
                <CardDescription>Revise e aprove as horas submetidas pela equipe.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Horas</TableHead>
                      <TableHead>Projeto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamLogs.filter((l) => l.status === 'Pendente').length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                          Nenhuma solicitação de aprovação pendente.
                        </TableCell>
                      </TableRow>
                    )}
                    {teamLogs
                      .filter((l) => l.status === 'Pendente')
                      .map((log) => (
                        <TableRow key={log.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{log.empName}</TableCell>
                          <TableCell>{log.date}</TableCell>
                          <TableCell className="font-mono">{log.hours}</TableCell>
                          <TableCell className="text-muted-foreground">{log.project}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Pendente</Badge>
                          </TableCell>
                          <TableCell className="text-right flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-success text-success hover:bg-success/10"
                              onClick={() => {
                                reviewTeamLog(log.id, 'Aprovado')
                                toast.success(`Ponto aprovado para ${log.empName}`)
                              }}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-destructive text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                reviewTeamLog(log.id, 'Rejeitado')
                                toast.error(`Ponto rejeitado para ${log.empName}`)
                              }}
                            >
                              <XCircle className="w-4 h-4 mr-1" /> Rejeitar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios" className="space-y-6 animate-fade-in-up">
            <Card className="shadow-subtle">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle>Exportação de Folha de Pagamento</CardTitle>
                  <CardDescription>
                    Gere os relatórios consolidados apenas com pontos validados/aprovados.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExportCSV}>
                    <Download className="w-4 h-4 mr-2" /> Exportar para Folha (CSV)
                  </Button>
                  <Button variant="secondary" onClick={handleExportPDF}>
                    <FileText className="w-4 h-4 mr-2" /> Gerar PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Contrato</TableHead>
                      <TableHead>Total de Horas Aprovadas</TableHead>
                      <TableHead className="text-right">Visualizar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((emp) => (
                      <TableRow key={`rep-${emp.id}`}>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell>{emp.contract}</TableCell>
                        <TableCell className="font-semibold">{emp.hours || 160}h</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedEmp(emp)}>
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feriados" className="space-y-6 animate-fade-in-up">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-subtle md:col-span-1">
                <CardHeader>
                  <CardTitle>Adicionar Feriado</CardTitle>
                  <CardDescription>
                    Defina dias não úteis para ajuste automático da meta.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <div className="flex justify-center border rounded-md p-2 bg-background">
                      <Calendar
                        mode="single"
                        selected={newHolidayDate}
                        onSelect={setNewHolidayDate}
                        className="mx-auto"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      placeholder="Ex: Feriado Nacional"
                      value={newHolidayDesc}
                      onChange={(e) => setNewHolidayDesc(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleAddHoliday}
                    disabled={!newHolidayDate || !newHolidayDesc}
                  >
                    Registrar Feriado
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-subtle md:col-span-2">
                <CardHeader>
                  <CardTitle>Feriados e Recessos Registrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {holidays.map((h) => (
                        <TableRow key={h.id}>
                          <TableCell>{new Date(h.date).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{h.description}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => removeHoliday(h.id)}
                            >
                              Remover
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {holidays.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                            Nenhum feriado registrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="historico" className="space-y-6 animate-fade-in-up">
            <Card className="shadow-subtle">
              <CardHeader>
                <CardTitle>Histórico de Gestão</CardTitle>
                <CardDescription>
                  Trilha de auditoria para todas as ações administrativas e alterações de ponto.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Gestor</TableHead>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {managementLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {log.timestamp}
                        </TableCell>
                        <TableCell className="font-medium">{log.manager}</TableCell>
                        <TableCell>{log.employee}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {log.details}
                        </TableCell>
                      </TableRow>
                    ))}
                    {managementLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                          Nenhum registro encontrado no histórico.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Sheet open={!!selectedEmp} onOpenChange={(open) => !open && setSelectedEmp(null)}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            {selectedEmp && (
              <>
                <SheetHeader className="mb-6">
                  <SheetTitle>Histórico de Logs</SheetTitle>
                  <SheetDescription>Detalhes dos pontos de {selectedEmp.name}.</SheetDescription>
                </SheetHeader>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border shadow-sm">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                      {selectedEmp.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-tight">{selectedEmp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedEmp.role} • {selectedEmp.contract}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" /> Registros Detalhados
                    </h4>
                    <div className="space-y-3">
                      {selectedEmp.recentLogs?.map((log: any, i: number) => (
                        <div
                          key={i}
                          className={`flex flex-col gap-2 p-3 border rounded-lg transition-colors shadow-sm ${log.status === 'Rejeitado' ? 'bg-destructive/5 border-destructive/20 hover:bg-destructive/10' : 'border-border/60 hover:bg-muted/20'}`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-sm mb-1">{log.date}</p>
                              <p className="text-xs text-muted-foreground font-mono">
                                Entrada: {log.entry} | Saída: {log.exit}
                              </p>
                            </div>
                            <Badge
                              variant="secondary"
                              className={
                                log.status === 'Aprovado'
                                  ? 'bg-success/10 text-success border-success/20'
                                  : log.status === 'Rejeitado'
                                    ? 'bg-destructive/10 text-destructive border-destructive/30'
                                    : ''
                              }
                            >
                              {log.hours} • {log.status || 'Valido'}
                            </Badge>
                          </div>
                          {log.project && (
                            <div className="text-[10px] text-muted-foreground mt-1 border-t pt-1">
                              Projeto associado: <strong>{log.project}</strong>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden print:block p-8 bg-white text-black min-h-screen">
        <h1 className="text-3xl font-bold mb-2">Relatório de Horas e Folha - CAVA Digital</h1>
        <p className="text-sm mb-8 text-gray-600 border-b pb-4">
          Gerado em: {new Date().toLocaleDateString()} • {currentBranch}
        </p>

        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left">Colaborador</th>
              <th className="border border-gray-300 p-2 text-left">Data</th>
              <th className="border border-gray-300 p-2 text-left">Entrada</th>
              <th className="border border-gray-300 p-2 text-left">Saída</th>
              <th className="border border-gray-300 p-2 text-left">Total Horas</th>
              <th className="border border-gray-300 p-2 text-left">Projeto/Atividade</th>
            </tr>
          </thead>
          <tbody>
            {employees.flatMap((emp) =>
              (emp.recentLogs || [])
                .filter((log: any) => log.status === 'Aprovado' || log.status === 'Approved')
                .map((log: any, i: number) => (
                  <tr key={`${emp.id}-${i}`}>
                    <td className="border border-gray-300 p-2">{emp.name}</td>
                    <td className="border border-gray-300 p-2">{log.date}</td>
                    <td className="border border-gray-300 p-2">{log.entry}</td>
                    <td className="border border-gray-300 p-2">{log.exit}</td>
                    <td className="border border-gray-300 p-2 font-medium">{log.hours}</td>
                    <td className="border border-gray-300 p-2 text-gray-600">
                      {log.project || '-'}
                    </td>
                  </tr>
                )),
            )}
          </tbody>
        </table>
        <p className="mt-12 text-center text-xs text-gray-400">
          CAVA Digital Hub • Apenas Pontos Aprovados
        </p>
      </div>
    </>
  )
}
