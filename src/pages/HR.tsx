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
import { useBranch } from '@/components/BranchContext'
import { MOCK_EMPLOYEES } from '@/lib/data'
import { Calculator, UserPlus, Calendar as CalendarIcon } from 'lucide-react'

export default function HR() {
  const { currentBranch } = useBranch()
  const employees = MOCK_EMPLOYEES.filter(
    (e) => currentBranch === 'Consolidado' || e.branch === currentBranch,
  )

  const calculateTotal = (emp: any) => {
    if (emp.contract === 'CLT') {
      return emp.salary + 800 // base + benefícios mockup
    }
    if (emp.contract === 'PJ') {
      return (emp.rate || 0) * (emp.hours || 0)
    }
    return 0
  }

  const totalPayroll = employees.reduce((acc, curr) => acc + calculateTotal(curr), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Equipe & RH</h1>
          <p className="text-muted-foreground">
            Controle de ponto, folha e cadastros ({currentBranch}).
          </p>
        </div>
        <Button className="bg-foreground text-background hover:bg-foreground/90">
          <UserPlus className="mr-2 h-4 w-4" /> Novo Colaborador
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-subtle md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Quadro de Colaboradores</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.role}</TableCell>
                    <TableCell>
                      <Badge variant={emp.contract === 'CLT' ? 'default' : 'secondary'}>
                        {emp.contract}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Ver Perfil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-elevation border-primary/20 bg-primary/5 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-primary" /> Prévia da Folha
            </CardTitle>
            <p className="text-xs text-muted-foreground flex items-center">
              <CalendarIcon className="w-3 h-3 mr-1" /> Mês de Referência: Outubro
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-background rounded-lg border shadow-sm text-center">
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Estimado</p>
              <p className="text-3xl font-bold text-foreground">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  totalPayroll,
                )}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 rounded hover:bg-muted/50 transition-colors">
                <span className="text-muted-foreground">Base CLT (c/ benefícios)</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    employees
                      .filter((e) => e.contract === 'CLT')
                      .reduce((a, b) => a + calculateTotal(b), 0),
                  )}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded hover:bg-muted/50 transition-colors">
                <span className="text-muted-foreground">Prestadores PJ (Horas)</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    employees
                      .filter((e) => e.contract === 'PJ')
                      .reduce((a, b) => a + calculateTotal(b), 0),
                  )}
                </span>
              </div>
            </div>

            <Button className="w-full mt-4" variant="default">
              Aprovar & Exportar Folha
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
