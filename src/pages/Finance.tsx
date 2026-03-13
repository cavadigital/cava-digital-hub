import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { MOCK_FINANCE } from '@/lib/data'
import { ArrowDownRight, ArrowUpRight, Plus, Download } from 'lucide-react'
import { useBranch } from '@/components/BranchContext'

export default function Finance() {
  const { currentBranch } = useBranch()

  const data = MOCK_FINANCE.filter(
    (f) => currentBranch === 'Consolidado' || f.branch === currentBranch,
  )
  const receitas = data.filter((f) => f.type === 'Entrada').reduce((a, b) => a + b.value, 0)
  const despesas = data.filter((f) => f.type === 'Saída').reduce((a, b) => a + b.value, 0)
  const saldo = receitas - despesas

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro Inteligente</h1>
          <p className="text-muted-foreground">Controle unificado com visão por filial.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Registrar Transação Financeira</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="entrada" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="entrada" className="data-[state=active]:text-success">
                    Entrada (Receita)
                  </TabsTrigger>
                  <TabsTrigger value="saida" className="data-[state=active]:text-destructive">
                    Saída (Despesa)
                  </TabsTrigger>
                </TabsList>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Descrição</Label>
                    <Input placeholder="Ex: Mensalidade Cliente X" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Valor Total (R$)</Label>
                      <Input type="number" placeholder="0,00" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Filial</Label>
                      <Select defaultValue="Blumenau">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Blumenau">Blumenau</SelectItem>
                          <SelectItem value="Curitiba">Curitiba</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <TabsContent value="entrada" className="m-0 border-t pt-4 mt-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
                        <div className="space-y-0.5">
                          <Label className="text-base">Pagamento Recorrente</Label>
                          <p className="text-xs text-muted-foreground">
                            Aplica cobrança mensal automática
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="p-3 border rounded-lg space-y-3">
                        <Label className="text-sm font-semibold">Configurar Parcelamento</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label className="text-xs">Valor da Entrada</Label>
                            <Input type="number" placeholder="R$ 0,00" />
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-xs">Qtd. Parcelas</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {[2, 3, 4, 5, 6, 12].map((n) => (
                                  <SelectItem key={n} value={n.toString()}>
                                    {n}x
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
                <div className="flex justify-end pt-4">
                  <Button className="w-full sm:w-auto">Salvar Registro</Button>
                </div>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-subtle">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Receitas (Mês Atual)</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                receitas,
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Despesas (Mês Atual)</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                despesas,
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saldo Operacional</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${saldo >= 0 ? 'text-primary' : 'text-destructive'}`}
            >
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldo)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle>Lançamentos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Filial</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.description}
                    {item.recurring && (
                      <span className="ml-2 text-[10px] bg-muted px-2 py-0.5 rounded uppercase tracking-wider">
                        Recorrente
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{item.branch}</TableCell>
                  <TableCell
                    className={`text-right font-medium ${item.type === 'Entrada' ? 'text-success' : 'text-foreground'}`}
                  >
                    {item.type === 'Entrada' ? '+' : '-'}{' '}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      item.value,
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-success/10 text-success font-medium">
                      Pago
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
