import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useFinanceStore from '@/stores/useFinanceStore'
import { Receipt, Download, Mail, Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function Invoices() {
  const { invoices, generateBoleto, generateNFSe } = useFinanceStore()
  const [activeTab, setActiveTab] = useState('todas')

  const handleSendEmail = (id: string) => {
    toast.success('Documento enviado por E-mail', {
      description: `A cobrança #${id} foi enviada ao cliente com sucesso.`,
    })
  }

  const filtered = invoices.filter((inv) => {
    if (activeTab === 'boletos' && inv.type !== 'Boleto') return false
    if (activeTab === 'nfse' && inv.type !== 'NFS-e') return false
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Receipt className="h-8 w-8 text-primary" /> Faturas & Cobranças
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie a emissão de Notas Fiscais de Serviço e Boletos para clientes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="shadow-sm bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
            onClick={() => toast.info('Abertura de formulário manual em desenvolvimento.')}
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Fatura Manual
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-subtle border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-primary uppercase tracking-widest">
              A Receber (Neste Mês)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-primary tracking-tight">
              R$ 12.700<span className="text-xl opacity-70">,00</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-destructive uppercase tracking-widest">
              Inadimplência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-destructive tracking-tight">
              R$ 4.500<span className="text-xl opacity-70">,00</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle border-success/20 bg-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-success uppercase tracking-widest">
              Recebido (Realizado)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-success tracking-tight">
              R$ 15.000<span className="text-xl opacity-70">,00</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader className="border-b bg-muted/10 pb-0 pt-4 px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent h-12 p-0 w-full justify-start space-x-6">
              <TabsTrigger
                value="todas"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 font-medium"
              >
                Todas as Cobranças
              </TabsTrigger>
              <TabsTrigger
                value="boletos"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 font-medium"
              >
                Boletos Emitidos
              </TabsTrigger>
              <TabsTrigger
                value="nfse"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 font-medium"
              >
                NFS-e Emitidas
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b-border/50">
                <TableHead className="pl-6 font-semibold text-foreground">Documento</TableHead>
                <TableHead className="font-semibold text-foreground">Cliente</TableHead>
                <TableHead className="font-semibold text-foreground">Emissão</TableHead>
                <TableHead className="font-semibold text-foreground">Vencimento</TableHead>
                <TableHead className="font-semibold text-foreground">Valor (R$)</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="text-right pr-6 font-semibold text-foreground">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => (
                <TableRow
                  key={inv.id}
                  className="hover:bg-muted/20 transition-colors border-b-border/50"
                >
                  <TableCell className="pl-6">
                    <div className="font-bold text-foreground">{inv.number}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {inv.type}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{inv.client}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(inv.issueDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(inv.dueDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-mono font-semibold">
                    R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`shadow-none ${
                        inv.status === 'Pago'
                          ? 'text-success border-success/30 bg-success/10'
                          : inv.status === 'Atrasado'
                            ? 'text-destructive border-destructive/30 bg-destructive/10'
                            : 'text-yellow-600 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20'
                      }`}
                    >
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 flex justify-end gap-2 items-center h-16">
                    {inv.type === 'Fatura' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateBoleto(inv.id)}
                          className="h-8 text-xs bg-background shadow-sm hover:text-primary hover:border-primary/50"
                        >
                          Gerar Boleto
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateNFSe(inv.id)}
                          className="h-8 text-xs bg-background shadow-sm hover:text-primary hover:border-primary/50"
                        >
                          Emitir NFS-e
                        </Button>
                      </>
                    )}
                    {(inv.type === 'Boleto' || inv.type === 'NFS-e') && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSendEmail(inv.id)}
                          title="Enviar por Email"
                          className="hover:bg-primary/10 hover:text-primary"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Download PDF"
                          className="hover:bg-primary/10 hover:text-primary"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Nenhuma cobrança encontrada para esta visualização.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
