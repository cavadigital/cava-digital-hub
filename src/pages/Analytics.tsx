import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { BrainCircuit, Clock, Zap, CheckCircle2 } from 'lucide-react'

const trendData = [
  { month: 'Jan', manual: 120, aiAssisted: 40, saved: 80 },
  { month: 'Fev', manual: 130, aiAssisted: 45, saved: 85 },
  { month: 'Mar', manual: 140, aiAssisted: 35, saved: 105 },
  { month: 'Abr', manual: 110, aiAssisted: 30, saved: 80 },
  { month: 'Mai', manual: 150, aiAssisted: 40, saved: 110 },
  { month: 'Jun', manual: 160, aiAssisted: 35, saved: 125 },
]

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics IA</h1>
          <p className="text-muted-foreground">
            Acompanhe a eficiência e economia de tempo usando nossos fluxos de IA.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-subtle bg-primary/5 border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total de Horas Economizadas</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">585h</div>
            <p className="text-xs text-muted-foreground mt-1">+12% este mês</p>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Prompts Reutilizados</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground mt-1">Execuções da biblioteca</p>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Assets Auto-Aplicados</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground mt-1">Injeções de marca</p>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Componentes Injetados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">Dev Hub Library</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle>Tendência de Eficiência (Horas)</CardTitle>
            <CardDescription>Trabalho Manual vs Assistido por IA</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                manual: { label: 'Manual Estimado', color: 'hsl(var(--muted-foreground))' },
                aiAssisted: { label: 'Tempo Efetivo (IA)', color: 'hsl(var(--primary))' },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorManual" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--muted-foreground))"
                        stopOpacity={0.1}
                      />
                      <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
                  <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="manual"
                    stroke="hsl(var(--muted-foreground))"
                    fillOpacity={1}
                    fill="url(#colorManual)"
                  />
                  <Area
                    type="monotone"
                    dataKey="aiAssisted"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorAI)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle>Horas Salvas por Mês</CardTitle>
            <CardDescription>Impacto direto na rentabilidade</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                saved: { label: 'Horas Poupadas', color: 'hsl(var(--success))' },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
                  <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="saved" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
