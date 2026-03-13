import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppContext } from '@/components/AppContext'
import {
  AlertCircle,
  Target,
  Activity,
  CheckCircle2,
  MousePointerClick,
  ShoppingCart,
  TrendingUp,
  FileText,
  Sparkles,
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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const analyticsData = [
  { month: 'Jul', cliques: 1540, conversoes: 120 },
  { month: 'Ago', cliques: 1850, conversoes: 145 },
  { month: 'Set', cliques: 2100, conversoes: 180 },
  { month: 'Out', cliques: 2800, conversoes: 240 },
]

const assetPerformanceData = [
  {
    asset: 'Banner Black Friday (A)',
    platform: 'Meta Ads',
    cpm: 'R$ 15,20',
    cpc: 'R$ 0,45',
    ctr: '3.2%',
    conv: 120,
  },
  {
    asset: 'Banner Black Friday (B)',
    platform: 'Google Ads',
    cpm: 'R$ 18,50',
    cpc: 'R$ 0,60',
    ctr: '2.8%',
    conv: 85,
  },
  {
    asset: 'Header Frete Grátis',
    platform: 'Meta Ads',
    cpm: 'R$ 12,00',
    cpc: 'R$ 0,35',
    ctr: '4.5%',
    conv: 210,
  },
  {
    asset: 'Modal de Urgência (Timer)',
    platform: 'TikTok Ads',
    cpm: 'R$ 9,80',
    cpc: 'R$ 0,22',
    ctr: '5.1%',
    conv: 270,
  },
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
      <div className="bg-primary/5 border border-primary/20 p-8 rounded-2xl shadow-sm text-center print:hidden">
        <Target className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Portal Transparente do Cliente</h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6">
          Acompanhe suas implantações, aprove ativos da marca e veja o valor gerado pelas
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
          <TabsList className="mb-6 grid w-full grid-cols-3 max-w-2xl mx-auto h-12 print:hidden">
            <TabsTrigger value="live" className="text-sm">
              Criativos Ativos
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">
              Performance
            </TabsTrigger>
            <TabsTrigger value="assets" className="text-sm">
              Ativos de Marca
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-background shadow-subtle border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Criativos Gerados</CardTitle>
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
            {/* Header for print only */}
            <div className="hidden print:block border-b pb-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Relatório de Performance Mensal</h1>
              </div>
              <p className="text-muted-foreground">
                Cliente: <strong>{client.name}</strong> • Gerado em:{' '}
                {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center print:hidden mb-2 gap-4">
              <h3 className="text-xl font-bold">Analytics Avançado</h3>
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="shadow-sm border-primary/20 hover:bg-primary/5"
              >
                <FileText className="mr-2 h-4 w-4 text-primary" /> Gerar Relatório PDF
              </Button>
            </div>

            <Card className="shadow-subtle border-primary/20 bg-primary/5 col-span-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Budget Optimization Insights (IA)
                </CardTitle>
                <CardDescription>
                  Análise preditiva baseada nos resultados dos últimos 30 dias.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      O canal <strong>Meta Ads</strong> está apresentando um{' '}
                      <strong>CTR 35% superior</strong> e um <strong>CPA 20% menor</strong> em
                      comparação ao Google Ads para os formatos de Smart Bundles veiculados este
                      mês.
                    </p>
                    <p className="text-sm font-semibold text-primary bg-primary/10 p-2.5 rounded-lg border border-primary/20 inline-block">
                      Recomendação: Realocar 15% do orçamento diário do Google Ads para campanhas de
                      remarketing no Meta Ads.
                    </p>
                  </div>
                  <div className="shrink-0 flex gap-4">
                    <div className="bg-background border-2 border-primary/30 rounded-xl p-4 text-center shadow-sm w-36 relative overflow-hidden">
                      <Badge className="absolute -top-1 -right-1 scale-[0.65] bg-success uppercase tracking-widest font-bold">
                        Maior Conversão
                      </Badge>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">Meta Ads</p>
                      <p className="font-black text-xl text-primary">3.2% CTR</p>
                    </div>
                    <div className="bg-muted/30 border border-transparent rounded-xl p-4 text-center w-36 opacity-80">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">Google Ads</p>
                      <p className="font-bold text-xl text-muted-foreground">2.1% CTR</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-subtle border-primary/20">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">CPM Médio</CardTitle>
                  <Activity className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 14,80</div>
                  <p className="text-xs text-muted-foreground mt-1">-5% este mês</p>
                </CardContent>
              </Card>
              <Card className="shadow-subtle border-primary/20">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">CPC Médio</CardTitle>
                  <MousePointerClick className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 0,42</div>
                  <p className="text-xs text-muted-foreground mt-1">-12% este mês</p>
                </CardContent>
              </Card>
              <Card className="shadow-subtle">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">CTR Geral</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.8%</div>
                  <p className="text-xs text-success mt-1">+0.5% este mês</p>
                </CardContent>
              </Card>
              <Card className="shadow-subtle border-success/20 bg-success/5">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-success">
                    Conversões Geradas
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">685</div>
                  <p className="text-xs text-success/80 mt-1">+18% este mês</p>
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
                    cliques: { label: 'Cliques nos Criativos', color: 'hsl(var(--primary))' },
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

            <Card className="shadow-subtle">
              <CardHeader>
                <CardTitle>Comparativo de Performance de Criativos</CardTitle>
                <CardDescription>
                  Correlacione banners gerados no Studio com suas métricas de anúncio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Criativo</TableHead>
                      <TableHead>Plataforma</TableHead>
                      <TableHead>CPM</TableHead>
                      <TableHead>CPC</TableHead>
                      <TableHead>CTR</TableHead>
                      <TableHead className="text-right">Conversões</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetPerformanceData.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-primary">{row.asset}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px]">
                            {row.platform}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.cpm}</TableCell>
                        <TableCell>{row.cpc}</TableCell>
                        <TableCell className="font-medium">{row.ctr}</TableCell>
                        <TableCell className="text-right font-bold text-success">
                          {row.conv}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
