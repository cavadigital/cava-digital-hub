import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const resources = [
  {
    title: 'Template Google Ads CAVA v2',
    category: 'Performance',
    format: 'Sheet',
    color: 'bg-green-100 text-green-800',
  },
  {
    title: 'Calendário de Conteúdo Q4',
    category: 'Social Media',
    format: 'Doc',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    title: 'Manual de Copywriting SEO',
    category: 'SEO',
    format: 'PDF',
    color: 'bg-red-100 text-red-800',
  },
  {
    title: 'Apresentação Institucional 2024',
    category: 'Comercial',
    format: 'Slides',
    color: 'bg-orange-100 text-orange-800',
  },
  {
    title: 'Checklist Go-Live Wake',
    category: 'Implantação',
    format: 'Notion',
    color: 'bg-purple-100 text-purple-800',
  },
]

export default function MarketingHub() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hub de Marketing</h1>
          <p className="text-muted-foreground">
            Repositório de inteligência, processos e templates.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar recursos..." className="pl-9 bg-white shadow-sm" />
        </div>
      </div>

      <div className="flex gap-2 pb-4 overflow-x-auto">
        <Badge variant="default" className="text-sm py-1 px-3 cursor-pointer">
          Todos
        </Badge>
        <Badge
          variant="outline"
          className="text-sm py-1 px-3 bg-white cursor-pointer hover:bg-muted"
        >
          Performance
        </Badge>
        <Badge
          variant="outline"
          className="text-sm py-1 px-3 bg-white cursor-pointer hover:bg-muted"
        >
          SEO
        </Badge>
        <Badge
          variant="outline"
          className="text-sm py-1 px-3 bg-white cursor-pointer hover:bg-muted"
        >
          Social Media
        </Badge>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {resources.map((res, i) => (
          <Card
            key={i}
            className="hover:shadow-elevation transition-all group border-t-4 hover:-translate-y-1"
            style={{ borderTopColor: 'hsl(var(--primary))' }}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${res.color}`}
                >
                  {res.format}
                </span>
                <span className="text-xs text-muted-foreground font-medium">{res.category}</span>
              </div>
              <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors">
                {res.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="secondary"
                className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                Acessar Recurso
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
