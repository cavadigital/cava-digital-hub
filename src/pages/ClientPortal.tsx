import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppContext, AssetStatus } from '@/components/AppContext'
import { Check, X, MessageSquare, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ClientPortal() {
  const { clients, updateAssetStatus } = useAppContext()
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({})
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({})

  const client = clients.find((c) => c.id === selectedClientId)

  const handleApprove = (type: 'logos' | 'colors' | 'fonts', index: number | null) => {
    updateAssetStatus(selectedClientId, type, index, 'Approved')
    setShowFeedback({ ...showFeedback, [`${type}-${index}`]: false })
  }

  const handleRequestChange = (
    type: 'logos' | 'colors' | 'fonts',
    index: number | null,
    feedback: string,
  ) => {
    updateAssetStatus(selectedClientId, type, index, 'Revision Requested', feedback)
    setShowFeedback({ ...showFeedback, [`${type}-${index}`]: false })
    setFeedbackInput({ ...feedbackInput, [`${type}-${index}`]: '' })
  }

  const toggleFeedback = (key: string) => {
    setShowFeedback({ ...showFeedback, [key]: !showFeedback[key] })
  }

  const renderStatusBadge = (status: AssetStatus, feedback?: string) => {
    if (status === 'Approved')
      return (
        <Badge className="bg-success/10 text-success border-success/20 shadow-none">Aprovado</Badge>
      )
    if (status === 'Pending') return <Badge variant="outline">Pendente</Badge>
    return (
      <div className="flex flex-col items-end gap-1">
        <Badge className="bg-destructive/10 text-destructive border-destructive/20 shadow-none">
          Revisão Solicitada
        </Badge>
        {feedback && (
          <span
            className="text-[10px] text-muted-foreground max-w-[200px] text-right truncate"
            title={feedback}
          >
            "{feedback}"
          </span>
        )}
      </div>
    )
  }

  const renderActionButtons = (
    type: 'logos' | 'colors' | 'fonts',
    index: number | null,
    status: AssetStatus,
  ) => {
    const key = `${type}-${index}`
    if (status === 'Approved') return null

    return (
      <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 items-end">
        {!showFeedback[key] ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleFeedback(key)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4 mr-1" /> Reprovar
            </Button>
            <Button
              size="sm"
              onClick={() => handleApprove(type, index)}
              className="bg-success hover:bg-success/90 text-white"
            >
              <Check className="h-4 w-4 mr-1" /> Aprovar
            </Button>
          </div>
        ) : (
          <div className="w-full sm:w-72 space-y-2 bg-muted/30 p-3 rounded-lg border">
            <Label className="text-xs">Motivo / Alteração Desejada:</Label>
            <Textarea
              className="h-20 text-sm"
              placeholder="Ex: O tom de azul precisa ser mais escuro..."
              value={feedbackInput[key] || ''}
              onChange={(e) => setFeedbackInput({ ...feedbackInput, [key]: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => toggleFeedback(key)}>
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={() => handleRequestChange(type, index, feedbackInput[key])}
                disabled={!feedbackInput[key]}
              >
                Enviar Feedback
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-12">
      <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl shadow-sm text-center">
        <AlertCircle className="h-8 w-8 text-primary mx-auto mb-3" />
        <h2 className="text-xl font-bold mb-2">Simulação do Portal do Cliente</h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-4">
          Esta visão simula a interface restrita do cliente. Selecione um cliente abaixo para
          visualizar e aprovar os Brand Assets da marca.
        </p>
        <Select value={selectedClientId} onValueChange={setSelectedClientId}>
          <SelectTrigger className="w-full max-w-xs mx-auto bg-background">
            <SelectValue placeholder="Selecione sua Marca..." />
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
        <div className="space-y-6">
          <Tabs defaultValue="assets" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="assets">Aprovação de Marca (Brand Assets)</TabsTrigger>
              <TabsTrigger value="projects">Projetos Ativos</TabsTrigger>
            </TabsList>

            <TabsContent value="assets" className="space-y-6">
              <Card className="shadow-subtle">
                <CardHeader className="border-b bg-muted/10">
                  <CardTitle className="text-lg">Logotipos Oficiais</CardTitle>
                  <CardDescription>
                    Valide os logos que nossa IA usará em suas campanhas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="divide-y">
                  {client.assets.logos.map((logo, idx) => (
                    <div
                      key={idx}
                      className="py-4 flex flex-col sm:flex-row items-center justify-between"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="h-16 w-24 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground font-mono">
                          {logo.value}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">Logo Principal</span>
                          {renderStatusBadge(logo.status, logo.feedback)}
                        </div>
                      </div>
                      {renderActionButtons('logos', idx, logo.status)}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-subtle">
                <CardHeader className="border-b bg-muted/10">
                  <CardTitle className="text-lg">Paleta de Cores</CardTitle>
                  <CardDescription>Confirme as cores institucionais.</CardDescription>
                </CardHeader>
                <CardContent className="divide-y">
                  {client.assets.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="py-4 flex flex-col sm:flex-row items-center justify-between"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div
                          className="h-10 w-10 rounded-full border shadow-sm"
                          style={{ backgroundColor: color.value }}
                        />
                        <div className="flex flex-col">
                          <span className="font-mono text-sm uppercase">{color.value}</span>
                          {renderStatusBadge(color.status, color.feedback)}
                        </div>
                      </div>
                      {renderActionButtons('colors', idx, color.status)}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-subtle">
                <CardHeader className="border-b bg-muted/10">
                  <CardTitle className="text-lg">Tipografia</CardTitle>
                  <CardDescription>Fontes oficiais para títulos e textos.</CardDescription>
                </CardHeader>
                <CardContent className="py-4 flex flex-col sm:flex-row items-center justify-between">
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Títulos (Primária)
                      </p>
                      <p
                        className="text-lg font-medium"
                        style={{ fontFamily: client.assets.fonts.value.primary }}
                      >
                        {client.assets.fonts.value.primary}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Textos (Secundária)
                      </p>
                      <p
                        className="text-base"
                        style={{ fontFamily: client.assets.fonts.value.secondary }}
                      >
                        {client.assets.fonts.value.secondary}
                      </p>
                    </div>
                    <div className="ml-4">
                      {renderStatusBadge(client.assets.fonts.status, client.assets.fonts.feedback)}
                    </div>
                  </div>
                  {renderActionButtons('fonts', null, client.assets.fonts.status)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card className="shadow-subtle p-12 text-center text-muted-foreground">
                Módulo de Projetos (Em Breve)
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
