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
import { useAppContext, UIComponent } from '@/components/AppContext'
import { Layers, Zap, Plus, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function DevHubLibrary({ onInject }: { onInject: (c: UIComponent) => void }) {
  const { uiComponents } = useAppContext()
  const [objective, setObjective] = useState<string>('')

  // Smart Bundle Logic based on objective
  const getBundleRecommendation = () => {
    if (objective === 'flash-sale') return uiComponents // Mock: Returns all (Header Promo + WA Float)
    if (objective === 'lead-gen') return uiComponents.filter((c) => c.category === 'Buttons')
    return []
  }

  const recommendedBundle = getBundleRecommendation()

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="bg-primary/5 border-primary/20 shadow-elevation">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary fill-primary" /> Smart Bundles Assistant
          </CardTitle>
          <CardDescription>
            Selecione o objetivo da campanha para receber combinações otimizadas de componentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-full sm:w-72">
              <Select value={objective} onValueChange={setObjective}>
                <SelectTrigger className="bg-background shadow-sm border-primary/30">
                  <SelectValue placeholder="Objetivo de Marketing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flash-sale">Promoção / Venda Relâmpago</SelectItem>
                  <SelectItem value="lead-gen">Geração de Leads</SelectItem>
                  <SelectItem value="awareness">Brand Awareness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {recommendedBundle.length > 0 && (
              <div className="flex-1 flex flex-col sm:flex-row gap-4 items-center bg-background p-3 rounded-lg border border-primary/20 shadow-sm w-full animate-fade-in-up">
                <div className="flex-1 flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Pacote Sugerido:
                  </Badge>
                  {recommendedBundle.map((c) => (
                    <Badge key={c.id} variant="outline" className="text-[10px] uppercase">
                      {c.name}
                    </Badge>
                  ))}
                </div>
                <Button
                  onClick={() => recommendedBundle.forEach((c) => onInject(c))}
                  className="w-full sm:w-auto shadow-md"
                >
                  Injetar Bundle Completo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Layers className="h-5 w-5" /> Componentes Individuais
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {uiComponents.map((comp) => (
            <Card
              key={comp.id}
              className="shadow-subtle hover:shadow-md transition-all group border-l-4 border-l-transparent hover:border-l-primary"
            >
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="text-[10px]">
                    {comp.category}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {comp.platform}
                  </Badge>
                </div>
                <h4 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                  {comp.name}
                </h4>
                <div className="mt-auto pt-4">
                  <Button
                    variant="secondary"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() => onInject(comp)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Injetar no Copilot
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
