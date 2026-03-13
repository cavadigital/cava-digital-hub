import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppContext } from '@/components/AppContext'
import {
  AlertCircle,
  Target,
  Activity,
  CheckCircle2,
  MousePointerClick,
  ShoppingCart,
  TrendingUp,
  BarChart3,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

const analyticsData = [
  { month: 'Jul', cliques: 1540, conversoes: 120 },
  { month: 'Ago', cliques: 1850, conversoes: 145 },
  { month: 'Set', cliques: 2100, conversoes: 180 },
  { month: 'Out', cliques: 2800, conversoes: 240 },
]

export default function ClientPortal() {
  const { clients } = useAppContext()
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const client = clients.find((c) => c.id === selectedClientId)

  const liveAssets = [
    {
      id: 1,
      name: 'Banner Black Friday Principal',
      type: 'Design',
      status: 'Active',
      conv: '+12%',
    },
    {
      id: 2,
      name: 'Header Frete Grátis',
      type: 'Componente Injetado',
      status: 'Active',
      conv: '+5%',
    },
    {
      id: 3,
      name: 'Modal de Urgência (Timer)',
      type: 'Smart Bundle',
      status: 'In Review',
      conv: '-',
    },
  ]

  const AssetRow = ({ title, value, status }: { title: string; value: string; status: string }) => (
    <div className="flex justify-between items-center py-3 border-b last:border-0 hover:bg-muted/30 px-2 rounded-md transition-colors">
      <div>
        <span className="font-semibold text-sm block">{title}</span>
        <span className="text-xs text-muted-foreground uppercase font-mono">{value}</span>
      </div>
      <Badge
        variant={status === 'Approved' ? 'default' : 'secondary'}
        className={status === 'Approved' ? 'bg-success hover:bg-success text-white' : ''}
      >
        {status === 'Approved' ? 'Validado' : 'Em Revisão'}
      </Badge>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div className="bg-primary/5 border border-primary/20 p-8 rounded-2xl shadow-sm text-center">
        <Target className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Portal Transparente do Cliente</h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6">
          Acompanhe suas implantações, aprove assets da marca e veja o valor gerado pelas
          integrações CAVA.
        </p>
        <Select value={selectedClientId} onValueChange={setSelectedClientId}>
          <SelectTrigger className="w-full max-w-sm mx-auto bg-background shadow-md h-12 text-lg font-medium">
            <SelectValue placeholder="Selecione sua Conta..." />
          </SelectTrigger>
          <SelectContent>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {client && (
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3 max-w-2xl mx-auto h-12">
            <TabsTrigger value="live" className="text-sm">
              Live Assets
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="assets" className="text-sm">
              Brand Assets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-background shadow-subtle border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Assets Gerados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">24</div>
                </CardContent>
              </Card>
              <Card className="bg-success/5 shadow-subtle border-success/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-success">
                    Uplift Estimado (Conversão)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">+17%</div>
                </CardContent>
              </Card>
              <Card className="bg-background shadow-subtle border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Status do Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold flex items-center text-primary">
                    <Activity className="h-5 w-5 mr-2" /> Otimizado
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-subtle">
              <CardHeader className="border-b bg-muted/10">
                <CardTitle className="text-lg">Implantações Ativas</CardTitle>
                <CardDescription>
                  Banners e códigos injetados rodando na sua loja no momento.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {liveAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {asset.status === 'Active' ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-warning" />
                        )}
                        <div>
                          <p className="font-semibold text-sm">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">{asset.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            asset.status === 'Active'
                              ? 'border-success/50 text-success'
                              : 'border-warning/50 text-yellow-600'
                          }
                        >
                          {asset.status === 'Active' ? 'Online' : 'Em Revisão'}
                        </Badge>
                        <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                          Impacto: {asset.conv}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-subtle border-primary/20">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
                  <MousePointerClick className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.290</div>
                  <p className="text-xs text-muted-foreground mt-1">+24% este mês</p>
                </CardContent>
              </Card>
              <Card className="shadow-subtle border-success/20 bg-success/5">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-success">
                    Conversões (Vendas)
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">685</div>
                  <p className="text-xs text-success/80 mt-1">+18% este mês</p>
                </CardContent>
              </Card>
              <Card className="shadow-subtle">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">CTR Médio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.2%</div>
                  <p className="text-xs text-muted-foreground mt-1">Acima da média do setor</p>
                </CardContent>
              </Card>
              <Card className="shadow-subtle">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">ROI Estimado</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.8x</div>
                  <p className="text-xs text-muted-foreground mt-1">Retorno sobre investimento</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-subtle">
              <CardHeader>
                <CardTitle>Engajamento vs Conversões (Evolução)</CardTitle>
                <CardDescription>
                  Impacto direto das implementações da CAVA na sua loja virtual.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    cliques: { label: 'Cliques nos Assets', color: 'hsl(var(--primary))' },
                    conversoes: { label: 'Conversões Geradas', color: 'hsl(var(--success))' },
                  }}
                  className="h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analyticsData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorCliques" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorConversoes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                      />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tickMargin={10} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="cliques"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorCliques)"
                        strokeWidth={2}
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="conversoes"
                        stroke="hsl(var(--success))"
                        fillOpacity={1}
                        fill="url(#colorConversoes)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets">
            <Card className="shadow-subtle">
              <CardHeader className="border-b bg-muted/10">
                <CardTitle className="text-lg">Configuração da Identidade Visual</CardTitle>
                <CardDescription>
                  Resumo dos elementos aprovados para a IA utilizar.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {client.assets.logos.map((logo, i) => (
                    <AssetRow key={`l${i}`} title="Logo" value={logo.value} status={logo.status} />
                  ))}
                  {client.assets.colors.map((color, i) => (
                    <AssetRow
                      key={`c${i}`}
                      title="Cor Institucional"
                      value={color.value}
                      status={color.status}
                    />
                  ))}
                  <AssetRow
                    title="Fonte Primária"
                    value={client.assets.fonts.value.primary}
                    status={client.assets.fonts.status}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
