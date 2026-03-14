import { useState } from 'react'
import { toast } from 'sonner'
import { useAppContext } from '@/components/AppContext'

declare global {
  interface Window {
    google?: any
  }
}

export function useGoogleAuth() {
  const { isGoogleConnected, connectGoogle, disconnectGoogle, updateCurrentUser } = useAppContext()
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

    const clientId = (
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '325964860086-1g2p73scrd62b71r2n3g8t1mhn4d6qno.apps.googleusercontent.com'
    ).trim()

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope:
          'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        prompt: 'select_account',
        callback: async (response: any) => {
          if (response.error) {
            let errorDesc = 'O acesso foi negado ou ocorreu um problema de configuração.'
            if (response.error === 'invalid_client') {
              errorDesc =
                'Erro 401 (invalid_client): A URL de redirecionamento ou a origem não está autorizada no Google Cloud Console.'
            }
            toast.error('Erro de Autorização OAuth', { description: errorDesc })
            setIsAuthLoading(false)
            return
          }

          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${response.access_token}` },
            })

            if (!res.ok) throw new Error('Falha ao obter dados do perfil (401)')

            const data = await res.json()
            connectGoogle(response.access_token, data.email)
            updateCurrentUser({ avatarUrl: data.picture, name: data.name })

            toast.success('Google Workspace conectado!', {
              description: `Sincronizado com a conta ${data.email}. Foto de perfil importada com sucesso.`,
            })

            if (onSuccess) onSuccess(response.access_token)
          } catch (e: any) {
            toast.error('Erro de API do Google', { description: e.message })
            connectGoogle('mock-token-fallback', 'admin@cavadigital.com.br')
            toast.info('Fallback Ativado: Conexão simulada ativada para demonstração.')
          } finally {
            setIsAuthLoading(false)
          }
        },
        error_callback: (error: any) => {
          toast.error('Erro no fluxo do Google GSI', { description: error.type })
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
