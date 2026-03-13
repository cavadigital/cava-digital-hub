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

  const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.oauth2) {
        resolve()
        return
      }
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]',
      )
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve())
        existingScript.addEventListener('error', (e) => reject(e))
        return
      }
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = (e) => reject(e)
      document.head.appendChild(script)
    })
  }

  const handleConnect = async (onSuccess?: (token: string) => void) => {
    if (isGoogleConnected) {
      disconnectGoogle()
      toast.info('Google Workspace desconectado.', {
        description: 'Sua agenda não será mais sincronizada.',
      })
      return
    }

    setIsAuthLoading(true)

    try {
      await loadGoogleScript()
    } catch (e) {
      toast.error('Erro ao carregar script do Google', {
        description: 'Verifique sua conexão ou desative bloqueadores de anúncios.',
      })
      setIsAuthLoading(false)
      return
    }

    // Use environment variable with fallback to avoid "invalid_client" if .env fails to load,
    // and trim to ensure no trailing spaces cause 401 errors.
    const rawClientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '325964860086-1g2p73scrd62b71r2n3g8t1mhn4d6qno.apps.googleusercontent.com'
    const clientId = rawClientId.trim()

    if (!clientId) {
      toast.error('Erro de Configuração', {
        description: 'VITE_GOOGLE_CLIENT_ID não está definido nas variáveis de ambiente.',
      })
      setIsAuthLoading(false)
      return
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope:
          'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        hint: 'contato@cavadigital.com.br',
        prompt: 'consent',
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
