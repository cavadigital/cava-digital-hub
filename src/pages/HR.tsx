import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useBranch } from '@/components/BranchContext'
import { MOCK_EMPLOYEES } from '@/lib/data'
import { UserPlus, Clock } from 'lucide-react'

export default function HR() {
  const { currentBranch } = useBranch()
  const [selectedEmp, setSelectedEmp] = useState<any>(null)

  const employees = MOCK_EMPLOYEES.filter(
    (e) => currentBranch === 'Consolidado' || e.branch === currentBranch,
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Equipe</h1>
          <p className="text-muted-foreground">
            Acompanhe a atividade, assiduidade e controle de ponto ({currentBranch}).
          </p>
        </div>
        <Button className="bg-foreground text-background hover:bg-foreground/90">
          <UserPlus className="mr-2 h-4 w-4" /> Novo Colaborador
        </Button>
      </div>

      <Card className="shadow-subtle">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Painel de Produtividade</CardTitle>
            <CardDescription>Visão em tempo real da equipe ativa.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Cargo/Contrato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assiduidade (Health)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    {emp.name}
                    <div className="text-xs text-muted-foreground mt-0.5">{emp.branch}</div>
                  </TableCell>
                  <TableCell>
                    {emp.role}
                    <div className="mt-1">
                      <Badge
                        variant={emp.contract === 'CLT' ? 'default' : 'outline'}
                        className="text-[10px]"
                      >
                        {emp.contract}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        emp.status === 'Em Atividade'
                          ? 'default'
                          : emp.status === 'Em Pausa'
                            ? 'secondary'
                            : 'outline'
                      }
                      className={
                        emp.status === 'Em Atividade'
                          ? 'bg-success hover:bg-success text-white'
                          : ''
                      }
                    >
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 max-w-[140px]">
                      <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden border">
                        <div
                          className={`h-full ${emp.attendanceScore >= 90 ? 'bg-success' : emp.attendanceScore >= 70 ? 'bg-warning' : 'bg-destructive'}`}
                          style={{ width: `${emp.attendanceScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold tabular-nums">
                        {emp.attendanceScore}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedEmp(emp)}>
                      <Clock className="w-4 h-4 mr-2" /> Ver Ponto
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selectedEmp} onOpenChange={(open) => !open && setSelectedEmp(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedEmp && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle>Gestão de Ponto</SheetTitle>
                <SheetDescription>Histórico de logs de atividade do usuário.</SheetDescription>
              </SheetHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {selectedEmp.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-tight">{selectedEmp.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedEmp.role} • {selectedEmp.contract}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" /> Registros Recentes
                  </h4>
                  <div className="space-y-3">
                    {selectedEmp.recentLogs?.map((log: any, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 border border-border/60 rounded-lg hover:bg-muted/20 transition-colors shadow-sm"
                      >
                        <div>
                          <p className="font-semibold text-sm mb-1">{log.date}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            Entrada: {log.entry} | Saída: {log.exit}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            log.hours === 'Em andamento' ? 'bg-success/10 text-success' : ''
                          }
                        >
                          {log.hours}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <Button variant="outline" className="w-full">
                    Exportar Relatório Completo
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
