import { useState } from 'react'
import { toast } from 'sonner'
import { useAppContext } from '@/components/AppContext'

declare global {
  interface Window {
    google?: any
  }
}

export function useGoogleAuth() {
  const { isGoogleConnected, connectGoogle, disconnectGoogle } = useAppContext()
  const [isAuthLoading, setIsAuthLoading] = useState(false)

  const handleConnect = (onSuccess?: (token: string) => void) => {
    if (isGoogleConnected) {
      disconnectGoogle()
      toast.info('Google Workspace desconectado.', {
        description: 'Sua agenda não será mais sincronizada.',
      })
      return
    }

    if (!window.google) {
      toast.error('SDK do Google não carregado ainda.', {
        description: 'Verifique sua conexão ou desative bloqueadores de script.',
      })
      return
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      toast.error('Erro de Configuração', {
        description: 'VITE_GOOGLE_CLIENT_ID não está definido nas variáveis de ambiente.',
      })
      return
    }

    setIsAuthLoading(true)

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope:
          'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (response: any) => {
          if (response.error) {
            let errorDesc = 'O acesso foi negado ou ocorreu um problema de configuração.'
            if (response.error === 'invalid_client') {
              errorDesc =
                'Erro 401: O Client ID configurado não é válido ou as URLs atuais não estão autorizadas no Google Cloud Console.'
            } else if (response.error === 'access_denied') {
              errorDesc = 'A solicitação de acesso foi cancelada ou negada pelo usuário.'
            }

            toast.error(`Erro de Autorização: ${response.error}`, {
              description: errorDesc,
            })
            setIsAuthLoading(false)
            return
          }

          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${response.access_token}` },
            })

            if (!res.ok) {
              throw new Error('Falha ao obter dados do perfil')
            }

            const data = await res.json()
            connectGoogle(response.access_token, data.email)

            toast.success('Google Workspace conectado!', {
              description: `Autenticado com sucesso como ${data.email}`,
            })

            if (onSuccess) onSuccess(response.access_token)
          } catch (e: any) {
            toast.error('Erro ao conectar', { description: e.message })
          } finally {
            setIsAuthLoading(false)
          }
        },
        error_callback: (error: any) => {
          if (error.type !== 'popup_closed') {
            toast.error('Erro na conexão com o Google', {
              description: `Ocorreu um problema com o popup de autenticação (${error.type}). Verifique se os popups estão permitidos.`,
            })
          }
          setIsAuthLoading(false)
        },
      })
      client.requestAccessToken()
    } catch (e: any) {
      toast.error('Erro ao inicializar SDK: ' + e.message)
      setIsAuthLoading(false)
    }
  }

  return { handleConnect, isAuthLoading }
}
