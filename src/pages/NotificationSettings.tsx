import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useAppContext } from '@/components/AppContext'
import { Mail, Hash, AlertCircle, CheckCircle } from 'lucide-react'

export default function NotificationSettings() {
  const { notificationSettings, updateNotificationSettings } = useAppContext()

  const handleToggle = (key: keyof typeof notificationSettings) => {
    updateNotificationSettings({ [key]: !notificationSettings[key] })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Notificações e Alertas</h1>
        <p className="text-muted-foreground">
          Configure como a equipe recebe os alertas vitais do sistema.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="shadow-subtle">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-success" /> Portal do Cliente (Brand Assets)
            </CardTitle>
            <CardDescription>
              Alertas quando o cliente aprova ou rejeita uma configuração de marca.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label className="text-base">Notificações por Email</Label>
                  <p className="text-xs text-muted-foreground">Envia para o responsável da conta</p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.assetApprovalEmail}
                onCheckedChange={() => handleToggle('assetApprovalEmail')}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label className="text-base">Alertas no Slack (#client-approvals)</Label>
                  <p className="text-xs text-muted-foreground">Inclui link direto para o projeto</p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.assetApprovalSlack}
                onCheckedChange={() => handleToggle('assetApprovalSlack')}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-destructive/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5 text-destructive" /> Monitor de Deploys
            </CardTitle>
            <CardDescription>Alertas críticos para falhas de integração contínua.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label className="text-base">Notificações por Email</Label>
                  <p className="text-xs text-muted-foreground">
                    Envia para o time de desenvolvimento
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.deployErrorEmail}
                onCheckedChange={() => handleToggle('deployErrorEmail')}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label className="text-base">Alertas no Slack (#deploy-alerts)</Label>
                  <p className="text-xs text-muted-foreground">Marca o desenvolvedor ativo</p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.deployErrorSlack}
                onCheckedChange={() => handleToggle('deployErrorSlack')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
