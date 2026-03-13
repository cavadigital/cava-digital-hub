import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Server, Zap, CheckCircle2 } from 'lucide-react'

const ecoData = [
  {
    category: 'Studio Criativo',
    feature: 'Workspace Horizontal',
    description:
      'Layout otimizado para notebooks com ferramentas no topo e visualizador na parte inferior.',
  },
  {
    category: 'Studio Criativo',
    feature: 'Componentes Interativos',
    description: 'Geração e exportação de código para botões animados e timers de escassez.',
  },
  {
    category: 'Studio Criativo',
    feature: 'Dimensões Customizadas',
    description: 'Suporte para presets padrão e entrada manual de tamanhos para ativos visuais.',
  },
  {
    category: 'Studio Criativo',
    feature: 'Editor de Estilo em Tempo Real',
    description: 'Ajuste instantâneo de cores e fontes da marca sem re-gerar o código.',
  },
  {
    category: 'Studio Criativo',
    feature: 'Smart Bundles',
    description:
      'Combinações automáticas de Banners + CTAs + Modais baseados em objetivos de campanha.',
  },
  {
    category: 'Studio Criativo',
    feature: 'Testes A/B',
    description: 'Geração automática de variação "B" para testes de performance de anúncios.',
  },
  {
    category: 'Copywriting IA',
    feature: 'IA Multilíngue',
    description:
      'Geração inteligente de textos otimizados para anúncios em Português, Inglês e Espanhol.',
  },

  {
    category: 'Governança & Tech',
    feature: 'CAVA Review (Linter)',
    description:
      'Verificação automatizada de SEO e performance para plataformas Wake, Tray e Nuvemshop.',
  },
  {
    category: 'Governança & Tech',
    feature: 'Controle de Versão',
    description: 'Rollback em um clique para o último estado estável da loja do cliente.',
  },

  {
    category: 'Gestão de Clientes',
    feature: 'Portal Transparente',
    description: 'Área dedicada para clientes visualizarem projetos e ativos em veiculação.',
  },
  {
    category: 'Gestão de Clientes',
    feature: 'Health Score Dashboard',
    description:
      'Indicador visual de saúde da conta baseado em métricas de performance (CPM, CTR, CPC).',
  },
  {
    category: 'Gestão de Clientes',
    feature: 'Biblioteca de Marcas',
    description:
      'Kits de identidade salvos (logos, cores, fontes) por cliente para aplicação instantânea na IA.',
  },
  {
    category: 'Gestão de Clientes',
    feature: 'Notificações Automáticas',
    description:
      'Alertas com links de aprovação mobile friendly enviados diretamente aos clientes.',
  },
  {
    category: 'Gestão de Clientes',
    feature: 'Relatórios PDF',
    description: 'Geração de resumos mensais de performance prontos para impressão com um clique.',
  },

  {
    category: 'Automação',
    feature: 'Sincronização de Ads',
    description: 'Exportação direta de criativos aprovados para Meta Ads e Google Ads.',
  },
  {
    category: 'Automação',
    feature: 'Aprovação Mobile',
    description:
      'Fluxo de feedback contínuo via links de compartilhamento otimizados para celular.',
  },
  {
    category: 'Automação',
    feature: 'Otimização de Verba IA',
    description:
      'Recomendações inteligentes para realocação de orçamento entre canais de anúncios.',
  },
]

export default function Ecosystem() {
  return (
    <div className="space-y-6 animate-fade-in-up max-w-5xl mx-auto pb-12">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
          <Server className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Relatório Executivo CAVA Digital</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Resumo estruturado de todas as capacidades atuais da plataforma para apresentação aos
          stakeholders.
        </p>
      </div>

      <Card className="shadow-elevation border-t-4 border-t-primary">
        <CardHeader className="bg-muted/10 border-b">
          <CardTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" /> Capacidades do Sistema
          </CardTitle>
          <CardDescription>
            Lista abrangente de funcionalidades e seu valor de negócio.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[200px]">Categoria</TableHead>
                <TableHead className="w-[250px]">Funcionalidade</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ecoData.map((item, i) => (
                <TableRow key={i} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    {i === 0 || ecoData[i - 1].category !== item.category ? item.category : ''}
                  </TableCell>
                  <TableCell className="font-medium text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    {item.feature}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
