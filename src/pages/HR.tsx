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
import { useBranch } from '@/components/BranchContext'
import { MOCK_EMPLOYEES } from '@/lib/data'
import { UserPlus, Clock, Download, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function HR() {
  const { currentBranch } = useBranch()
  const [selectedEmp, setSelectedEmp] = useState<any>(null)

  const employees = MOCK_EMPLOYEES.filter(
    (e) => currentBranch === 'Consolidado' || e.branch === currentBranch,
  )

  const handleExportCSV = () => {
    const headers = 'Colaborador,Data,Entrada,Saída,Total Horas,Projeto\n'
    const rows = employees
      .flatMap((emp) =>
        emp.recentLogs?.map(
          (log) =>
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
      description: 'Pronto para processamento na Folha.',
    })
  }

  const handleExportPDF = () => {
    toast.info('Preparando impressão PDF...')
    setTimeout(() => {
      window.print()
    }, 500)
  }

  return (
    <>
      {/* View for normal display */}
      <div className="space-y-6 animate-fade-in print:hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Equipe</h1>
            <p className="text-muted-foreground">
              Acompanhe a atividade, assiduidade e relatórios ({currentBranch}).
            </p>
          </div>
          <Button className="bg-foreground text-background hover:bg-foreground/90">
            <UserPlus className="mr-2 h-4 w-4" /> Novo Colaborador
          </Button>
        </div>

        <Tabs defaultValue="painel" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6">
            <TabsTrigger value="painel">Painel de Produtividade</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios de Equipe</TabsTrigger>
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
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((emp) => (
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
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedEmp(emp)}>
                            <Clock className="w-4 h-4 mr-2" /> Ver Logs
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
                    Gere os relatórios consolidados de pontos batidos.
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
                      <TableHead>Total de Horas (Mês)</TableHead>
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
                          className="flex flex-col gap-2 p-3 border border-border/60 rounded-lg hover:bg-muted/20 transition-colors shadow-sm"
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
                                log.hours === 'Em andamento' ? 'bg-success/10 text-success' : ''
                              }
                            >
                              {log.hours}
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

      {/* View purely for PDF print layout */}
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
              emp.recentLogs?.map((log, i) => (
                <tr key={`${emp.id}-${i}`}>
                  <td className="border border-gray-300 p-2">{emp.name}</td>
                  <td className="border border-gray-300 p-2">{log.date}</td>
                  <td className="border border-gray-300 p-2">{log.entry}</td>
                  <td className="border border-gray-300 p-2">{log.exit}</td>
                  <td className="border border-gray-300 p-2 font-medium">{log.hours}</td>
                  <td className="border border-gray-300 p-2 text-gray-600">{log.project || '-'}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
        <p className="mt-12 text-center text-xs text-gray-400">
          CAVA Digital Hub • Confidencial Financeiro
        </p>
      </div>
    </>
  )
}
