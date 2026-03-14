import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname

  try {
    if (req.method === 'POST' && path.endsWith('/billing/generate')) {
      const body = await req.json().catch(() => ({}))
      return new Response(
        JSON.stringify({ message: 'Billing generated', status: 'pending', data: body }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    if (req.method === 'GET' && path.includes('/billing/') && path.endsWith('/status')) {
      return new Response(
        JSON.stringify({ status: 'paid', updated_at: new Date().toISOString() }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    if (req.method === 'POST' && path.endsWith('/webhooks/payments')) {
      return new Response(JSON.stringify({ message: 'Payment confirmed/Written off' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'POST' && path.endsWith('/fiscal/issue')) {
      return new Response(
        JSON.stringify({
          message: 'Fiscal note issued',
          nfe_number: `NFE-${Math.floor(Math.random() * 10000)}`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    if (req.method === 'GET' && path.endsWith('/reports/revenue')) {
      return new Response(JSON.stringify({ mrr: 25000, defaults: 1200 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
