import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MOCK_FINANCE, MOCK_AGENDA } from '@/lib/data'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ArrowUpRight, ArrowDownRight, Clock, Plus, MonitorPlay, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBranch } from '@/components/BranchContext'
import { useAppContext } from '@/components/AppContext'

const chartData = [
  { month: 'Jan', receitas: 45000, despesas: 32000 },
  { month: 'Fev', receitas: 52000, despesas: 34000 },
  { month: 'Mar', receitas: 48000, despesas: 33000 },
  { month: 'Abr', receitas: 61000, despesas: 38000 },
  { month: 'Mai', receitas: 59000, despesas: 36000 },
  { month: 'Jun', receitas: 72000, despesas: 41000 },
]

export default function Index() {
  const { currentBranch } = useBranch()
  const { projects } = useAppContext()

  const activeProjects = projects.filter(
    (p) =>
      p.status !== 'Finalizado' &&
      p.status !== 'Aprovado' &&
      (currentBranch === 'Consolidado' || p.branch === currentBranch),
  ).length

  const totalRevenue = MOCK_FINANCE.filter(
    (f) => f.type === 'Entrada' && (currentBranch === 'Consolidado' || f.branch === currentBranch),
  ).reduce((a, b) => a + b.value, 0)

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Visão Executiva</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta ao CAVA Digital Hub ({currentBranch}).
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="shadow-elevation">
            <Plus className="mr-2 h-4 w-4" /> Novo Projeto
          </Button>
          <Button variant="secondary">
            <Clock className="mr-2 h-4 w-4" /> Bater Ponto
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-subtle hover:shadow-elevation transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fluxo de Caixa Mensal</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                totalRevenue,
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-success flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5%
              </span>{' '}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle hover:shadow-elevation transition-shadow border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <MonitorPlay className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{activeProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Implantações e campanhas em andamento
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle hover:shadow-elevation transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reuniões Hoje</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_AGENDA.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Próxima às {MOCK_AGENDA[0]?.time}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-5 shadow-subtle">
          <CardHeader>
            <CardTitle>Desempenho Financeiro</CardTitle>
            <CardDescription>Receitas vs Despesas (Últimos 6 meses)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                receitas: { label: 'Receitas', color: 'hsl(var(--success))' },
                despesas: { label: 'Despesas', color: 'hsl(var(--destructive))' },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    fontSize={12}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `R$${v / 1000}k`}
                    fontSize={12}
                    width={60}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="receitas"
                    stroke="hsl(var(--success))"
                    fillOpacity={1}
                    fill="url(#colorReceitas)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="despesas"
                    stroke="hsl(var(--destructive))"
                    fillOpacity={1}
                    fill="url(#colorDespesas)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-subtle">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Feed da equipe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              {
                title: 'Layout Aprovado',
                desc: 'Lojas Renner - Wake',
                time: 'Há 10 min',
                icon: Zap,
                color: 'text-success',
              },
              {
                title: 'Reunião Gravada',
                desc: 'Sync de Performance',
                time: 'Há 1h',
                icon: MonitorPlay,
                color: 'text-primary',
              },
              {
                title: 'Novo Card',
                desc: 'Ajuste banner principal',
                time: 'Há 2h',
                icon: Plus,
                color: 'text-muted-foreground',
              },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`mt-0.5 rounded-full p-1.5 bg-muted/50 ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium leading-none">{activity.title}</span>
                  <span className="text-xs text-muted-foreground">{activity.desc}</span>
                  <span className="text-[10px] text-muted-foreground/70">{activity.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
