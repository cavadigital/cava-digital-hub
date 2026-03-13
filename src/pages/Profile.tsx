import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppContext } from '@/components/AppContext'
import { BarChart3, List } from 'lucide-react'
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

export default function Profile() {
  const { myTimeLogs, attendanceState } = useAppContext()
  const [timeView, setTimeView] = useState<'week' | 'month'>('week')

  const chartData = timeView === 'week' ? MOCK_HOURS_PER_PROJECT_WEEK : MOCK_HOURS_PER_PROJECT_MONTH
  const totalHours = chartData.reduce((acc, curr) => acc + curr.hours, 0)

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl overflow-hidden shadow-sm border border-primary/20 shrink-0">
            <img
              src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=admin"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin CAVA</h1>
            <p className="text-muted-foreground">Administrador de Sistema • Gestor</p>
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

      <Tabs defaultValue="productivity" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-12 mb-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="productivity">Produtividade</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground block mb-1">
                    Email Corporativo
                  </span>
                  <span className="font-semibold">admin@cavadigital.com.br</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block mb-1">Cargo</span>
                  <span className="font-semibold">Gestor de Operações</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block mb-1">Telefone</span>
                  <span className="font-semibold">+55 41 99999-9999</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block mb-1">Contrato</span>
                  <span className="font-semibold">CLT</span>
                </div>
              </div>
            </CardContent>
          </Card>
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

          <div className="grid md:grid-cols-3 gap-6">
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
                <div className="text-6xl font-black text-foreground mb-2 tabular-nums">
                  {totalHours}h
                </div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest bg-background/50 px-3 py-1 rounded-full border shadow-sm">
                  {timeView === 'week' ? 'Nesta Semana' : 'Neste Mês'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-subtle">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <List className="w-5 h-5 text-muted-foreground" /> Meus Pontos Batidos (Recentes)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/5">
                    <TableHead className="pl-6">Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Projeto Associado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myTimeLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                        Nenhum registro encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    myTimeLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium pl-6">{log.date}</TableCell>
                        <TableCell className="font-mono text-muted-foreground">
                          {log.time}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              log.type === 'Entrada' || log.type === 'Retorno'
                                ? 'default'
                                : 'secondary'
                            }
                            className={
                              log.type === 'Entrada' ? 'bg-success hover:bg-success text-white' : ''
                            }
                          >
                            {log.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{log.project}</TableCell>
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
