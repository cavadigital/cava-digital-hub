import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, DownloadCloud } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useState } from 'react'

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
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [search, setSearch] = useState('')

  const handleDownload = (res: any) => {
    const blob = new Blob(['Conteúdo do recurso: ' + res.title], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${res.title.replace(/\s+/g, '_')}.${res.format.toLowerCase()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Download iniciado: ${res.title}`, {
      description: 'O recurso estará disponível na sua pasta de downloads.',
      icon: <DownloadCloud className="w-5 h-5 text-primary" />,
    })
  }

  const filtered = resources.filter((r) => {
    if (activeCategory !== 'Todos' && r.category !== activeCategory) return false
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hub de Marketing</h1>
          <p className="text-muted-foreground">
            Repositório de inteligência, processos e templates.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar recursos..."
            className="pl-9 bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 pb-4 overflow-x-auto">
        {['Todos', 'Performance', 'SEO', 'Social Media', 'Comercial', 'Implantação'].map((cat) => (
          <Badge
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            className={`text-sm py-1 px-3 cursor-pointer transition-colors ${activeCategory !== cat ? 'bg-white hover:bg-muted' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((res, i) => (
          <Card
            key={i}
            className="hover:shadow-elevation transition-all group border-t-4 hover:-translate-y-1 flex flex-col h-full"
            style={{ borderTopColor: 'hsl(var(--primary))' }}
          >
            <CardHeader className="pb-3 flex-1">
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
            <CardContent className="shrink-0 mt-auto">
              <Button
                variant="secondary"
                className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                onClick={() => handleDownload(res)}
              >
                Acessar Recurso
              </Button>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            Nenhum recurso encontrado para os filtros atuais.
          </div>
        )}
      </div>
    </div>
  )
}
