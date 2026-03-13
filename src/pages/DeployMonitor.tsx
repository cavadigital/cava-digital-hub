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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Activity, CheckCircle2, XCircle, AlertTriangle, TerminalSquare } from 'lucide-react'
import { useAppContext } from '@/components/AppContext'
import { toast } from 'sonner'

const MOCK_DEPLOYS = [
  {
    id: '1',
    platform: 'Wake',
    date: '2023-11-01 10:23',
    developer: 'Carlos Santos',
    status: 'Success',
  },
  {
    id: '2',
    platform: 'Tray',
    date: '2023-11-01 11:45',
    developer: 'Ana Silva',
    status: 'Error',
    log: 'Failed to compile CSS: Syntax error on line 45.',
  },
  {
    id: '3',
    platform: 'Nuvemshop',
    date: '2023-11-01 14:10',
    developer: 'Marina Costa',
    status: 'Success',
  },
  {
    id: '4',
    platform: 'Wake',
    date: '2023-11-01 15:30',
    developer: 'Carlos Santos',
    status: 'Version Conflict',
    log: 'Conflict in /templates/home.html. Remote changes detected.',
  },
  {
    id: '5',
    platform: 'Tray',
    date: '2023-11-01 16:20',
    developer: 'Ana Silva',
    status: 'Success',
  },
]

export default function DeployMonitor() {
  const [platformFilter, setPlatformFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const { notificationSettings } = useAppContext()

  const filteredDeploys = MOCK_DEPLOYS.filter((d) => {
    if (platformFilter !== 'All' && d.platform !== platformFilter) return false
    if (statusFilter !== 'All' && d.status !== statusFilter) return false
    return true
  })

  const simulateDeployError = () => {
    if (notificationSettings.deployErrorSlack) {
      toast.error('🚨 Alerta Slack: Erro de Deploy', {
        description: 'Falha crítica detectada no deploy da Nuvemshop (Conflito de versão).',
        action: {
          label: 'Ver Log',
          onClick: () => console.log('Abrindo logs detalhados...'),
        },
      })
    } else {
      toast.info('Erro de deploy detectado (Notificações Slack Desativadas)')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitor de Deploys</h1>
          <p className="text-muted-foreground">
            Acompanhe a integridade e histórico de implantações nas plataformas.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive/10"
          onClick={simulateDeployError}
        >
          <AlertTriangle className="w-4 h-4 mr-2" /> Simular Erro (Notificação)
        </Button>
      </div>

      <Card className="shadow-subtle border-t-4 border-t-primary">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Histórico de Integração Contínua
            </CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Todas</SelectItem>
                  <SelectItem value="Wake">Wake</SelectItem>
                  <SelectItem value="Tray">Tray</SelectItem>
                  <SelectItem value="Nuvemshop">Nuvemshop</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Todos</SelectItem>
                  <SelectItem value="Success">Sucesso</SelectItem>
                  <SelectItem value="Error">Erro</SelectItem>
                  <SelectItem value="Version Conflict">Conflito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Desenvolvedor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeploys.map((deploy) => (
                <TableRow key={deploy.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {deploy.date}
                  </TableCell>
                  <TableCell className="font-medium">{deploy.platform}</TableCell>
                  <TableCell>{deploy.developer}</TableCell>
                  <TableCell>
                    {deploy.status === 'Success' && (
                      <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Sucesso
                      </Badge>
                    )}
                    {deploy.status === 'Error' && (
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">
                        <XCircle className="w-3 h-3 mr-1" /> Erro
                      </Badge>
                    )}
                    {deploy.status === 'Version Conflict' && (
                      <Badge className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20 text-yellow-600 border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Conflito
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {deploy.log ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <TerminalSquare className="h-4 w-4 mr-2" /> Log
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Log de Deploy: {deploy.platform}</DialogTitle>
                            <DialogDescription>Data: {deploy.date}</DialogDescription>
                          </DialogHeader>
                          <div className="bg-[#0d1117] text-[#e6edf3] p-4 rounded-md font-mono text-xs overflow-x-auto mt-4 border border-border">
                            {deploy.log}
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredDeploys.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum deploy encontrado para os filtros selecionados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
