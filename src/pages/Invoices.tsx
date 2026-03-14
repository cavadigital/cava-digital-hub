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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useFinanceStore from '@/stores/useFinanceStore'
import { Receipt, Download, Mail, Plus, X, User, Edit2, List, Cloud } from 'lucide-react'
import { toast } from 'sonner'

export default function Invoices() {
  const { invoices, generateBoleto, generateNFSe, addInvoice } = useFinanceStore()
  const [activeTab, setActiveTab] = useState('todas')
  const [isOSOpen, setIsOSOpen] = useState(false)

  const handleSendEmail = (id: string) => {
    toast.success('Documento enviado por E-mail', {
      description: `A cobrança #${id} foi enviada ao cliente com sucesso.`,
    })
  }

  const handleSaveOS = () => {
    addInvoice({
      id: `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      client: 'Novo Cliente',
      amount: 0,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'Pendente',
      type: 'Boleto',
      number: `2026/${Math.floor(1000 + Math.random() * 9000)}`,
    })
    toast.success('Ordem de Serviço salva com sucesso!', {
      description: 'Boleto Registrado gerado automaticamente para esta OS.',
    })
    setIsOSOpen(false)
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
            className="shadow-sm bg-teal-600 text-white hover:bg-teal-700 font-semibold"
            onClick={() => setIsOSOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Ordem de Serviço
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

      <Dialog open={isOSOpen} onOpenChange={setIsOSOpen}>
        <DialogContent className="max-w-[1200px] h-[90vh] flex flex-col p-0 gap-0 bg-[#f8fafc]">
          <DialogHeader className="p-4 bg-white border-b flex-row justify-between items-center shrink-0">
            <DialogTitle className="text-xl text-[#0f766e] font-normal">
              Nova Ordem de Serviço
            </DialogTitle>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setIsOSOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                Fechar <X className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex gap-6">
                <div className="w-24 h-24 bg-gray-100 rounded-md shrink-0 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-300" />
                </div>
                <div className="flex-1 grid grid-cols-4 gap-x-6 gap-y-4">
                  <div className="col-span-2 space-y-4 pt-2">
                    <div className="relative">
                      <Label className="text-[10px] uppercase font-bold tracking-wider text-[#0f766e] bg-white px-1 absolute -top-2 left-3">
                        Cliente
                      </Label>
                      <Input
                        className="h-10 border-[#14b8a6] rounded-full pl-4"
                        placeholder="Pesquisar cliente..."
                      />
                      <Plus className="absolute right-3 top-3 text-[#14b8a6] w-4 h-4 cursor-pointer" />
                    </div>
                    <div className="relative">
                      <Label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-white px-1 absolute -top-2 left-3">
                        Vendedor
                      </Label>
                      <Input
                        className="h-10 border-gray-200 rounded-full pl-4"
                        placeholder="Pesquisar vendedor..."
                      />
                      <Plus className="absolute right-3 top-3 text-gray-400 w-4 h-4 cursor-pointer" />
                    </div>
                  </div>
                  <div className="col-span-1 space-y-4 pt-2">
                    <Button
                      variant="outline"
                      className="w-full h-10 rounded-full border-[#14b8a6] text-[#0f766e] hover:bg-[#f0fdfa] font-semibold"
                    >
                      Crédito
                    </Button>
                    <div className="relative">
                      <Label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-white px-1 absolute -top-2 left-3">
                        Número de Parcelas
                      </Label>
                      <Input
                        className="h-10 border-gray-200 rounded-full text-center font-medium text-gray-700"
                        defaultValue="A Vista"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 space-y-4 pt-2">
                    <div className="relative">
                      <Label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-white px-1 absolute -top-2 left-3">
                        Previsão de Faturamento
                      </Label>
                      <Input
                        type="date"
                        className="h-10 border-gray-200 rounded-full text-gray-700"
                        defaultValue="2026-03-14"
                      />
                    </div>
                    <div className="relative">
                      <Label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-white px-1 absolute -top-2 left-3">
                        Valor do Desconto
                      </Label>
                      <Input
                        className="h-10 border-gray-200 rounded-full text-right font-mono"
                        defaultValue="0,00"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-72 bg-[#f8fafc] rounded-lg p-5 text-sm shrink-0 border border-gray-100 flex flex-col justify-center">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-500 font-medium">Serviços:</span>
                    <span className="font-mono text-gray-700">R$ 0,00</span>
                  </div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-500 font-medium">Descontos:</span>
                    <span className="font-mono text-gray-700">R$ 0,00</span>
                  </div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-500 font-medium">Despesas Reembolsáveis:</span>
                    <span className="font-mono text-gray-700">R$ 0,00</span>
                  </div>
                  <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Produtos:</span>
                    <span className="font-mono text-gray-700">R$ 0,00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-900">Valor Total:</span>
                    <span className="font-mono text-[#0f766e]">R$ 0,00</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
                <Tabs defaultValue="servico" className="w-full h-full flex flex-col">
                  <TabsList className="bg-white border-b border-gray-100 rounded-none justify-start px-2 h-12 space-x-1">
                    <TabsTrigger
                      value="servico"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-[#0f766e] rounded-none h-full data-[state=active]:text-[#0f766e] data-[state=active]:shadow-none font-medium px-4 text-gray-500"
                    >
                      Serviço
                    </TabsTrigger>
                    <TabsTrigger
                      value="produtos"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-[#0f766e] rounded-none h-full data-[state=active]:shadow-none font-medium px-4 text-gray-500"
                    >
                      Lista de Produtos
                    </TabsTrigger>
                    <TabsTrigger
                      value="despesas"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-[#0f766e] rounded-none h-full data-[state=active]:shadow-none font-medium px-4 text-gray-500"
                    >
                      Despesas Reembolsáveis
                    </TabsTrigger>
                    <TabsTrigger
                      value="deptos"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-[#0f766e] rounded-none h-full data-[state=active]:shadow-none font-medium px-4 text-gray-500"
                    >
                      Departamentos
                    </TabsTrigger>
                    <TabsTrigger
                      value="info"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-[#0f766e] rounded-none h-full data-[state=active]:shadow-none font-medium px-4 text-gray-500"
                    >
                      Informações Adicionais
                    </TabsTrigger>
                    <TabsTrigger
                      value="parcelas"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-[#0f766e] rounded-none h-full data-[state=active]:shadow-none font-medium px-4 text-gray-500"
                    >
                      Parcelas
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="servico" className="p-6 m-0 flex-1 space-y-6 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        variant="ghost"
                        className="text-[#0f766e] hover:text-[#0f766e] hover:bg-[#f0fdfa] h-9"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Incluir serviço
                      </Button>
                      <Button variant="ghost" className="text-gray-500 hover:text-gray-800 h-9">
                        <Edit2 className="w-4 h-4 mr-2" /> Editar Detalhes
                      </Button>
                      <Button variant="ghost" className="text-gray-500 hover:text-gray-800 h-9">
                        <List className="w-4 h-4 mr-2" /> Selecionar serviços já cadastrados
                      </Button>
                    </div>
                    <div className="bg-[#f8fafc] rounded-xl p-6 border border-gray-100 space-y-6">
                      <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-3 space-y-1.5 relative">
                          <Label className="text-xs text-gray-500 font-medium">
                            Tipo de Tributação
                          </Label>
                          <Input
                            className="bg-white border-gray-200 shadow-sm"
                            placeholder="Pesquisar..."
                          />
                        </div>
                        <div className="col-span-3 space-y-1.5 relative">
                          <Label className="text-xs text-gray-500 font-medium">
                            Código do Serviço ou CNAE
                          </Label>
                          <Input
                            className="bg-white border-gray-200 shadow-sm"
                            placeholder="Pesquisar..."
                          />
                        </div>
                        <div className="col-span-3 space-y-1.5 relative">
                          <Label className="text-xs text-gray-500 font-medium">
                            Código da LC116
                          </Label>
                          <Input
                            className="bg-white border-gray-200 shadow-sm"
                            placeholder="Pesquisar..."
                          />
                        </div>
                        <div className="col-span-2 space-y-1.5 relative">
                          <Label className="text-xs text-gray-500 font-medium">
                            % Alíquota do ISS
                          </Label>
                          <Input className="bg-white border-gray-200 shadow-sm" />
                        </div>
                        <div className="col-span-1 flex items-end pb-2">
                          <div className="flex items-center gap-2">
                            <Switch id="retido" />{' '}
                            <Label
                              htmlFor="retido"
                              className="text-sm font-medium text-gray-600 cursor-pointer"
                            >
                              Retido
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-5">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-gray-500 font-medium">Quantidade</Label>
                          <Input className="bg-white border-gray-200 shadow-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-gray-500 font-medium">
                            Valor Unitário
                          </Label>
                          <Input className="bg-white border-gray-200 shadow-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-gray-500 font-medium">% do Desconto</Label>
                          <Input className="bg-white border-gray-200 shadow-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-gray-500 font-medium">Valor do ISS</Label>
                          <Input className="bg-white border-gray-200 shadow-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-gray-500 font-medium">
                            Valor Total do Item
                          </Label>
                          <Input
                            className="bg-white border-gray-200 shadow-sm bg-gray-50"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-2">
                        <Label className="text-xs text-gray-500 font-medium">
                          Descrição Detalhada do Serviço
                        </Label>
                        <Textarea
                          className="bg-white border-gray-200 shadow-sm min-h-[120px] resize-none"
                          placeholder="Insira os detalhes do serviço prestado..."
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="produtos">
                    <div className="p-6 text-gray-500 text-sm">Sem produtos.</div>
                  </TabsContent>
                  <TabsContent value="despesas">
                    <div className="p-6 text-gray-500 text-sm">Nenhuma despesa.</div>
                  </TabsContent>
                  <TabsContent value="deptos">
                    <div className="p-6 text-gray-500 text-sm">Departamentos não configurados.</div>
                  </TabsContent>
                  <TabsContent value="info">
                    <div className="p-6 text-gray-500 text-sm">Informações adicionais.</div>
                  </TabsContent>
                  <TabsContent value="parcelas">
                    <div className="p-6 text-gray-500 text-sm">Parcelas a vista.</div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="w-[240px] border-l bg-white flex flex-col shrink-0 p-6 pt-10 shadow-[-4px_0_15px_-5px_rgba(0,0,0,0.05)] z-10">
              <Button
                className="w-full bg-[#0f766e] hover:bg-[#115e59] text-white rounded-full h-12 flex items-center justify-center font-bold text-base shadow-md transition-transform hover:-translate-y-0.5"
                onClick={handleSaveOS}
              >
                <Cloud className="mr-2 w-5 h-5" /> Salvar Ordem
              </Button>
              <p className="text-xs text-center text-gray-400 mt-4 px-2 leading-relaxed">
                Ao salvar, um boleto registrado será emitido na plataforma bancária.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
