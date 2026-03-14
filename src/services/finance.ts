import { supabase } from '@/lib/supabase/client'

export const financeApi = {
  generateBilling: async (data: any) => {
    const { data: result, error } = await supabase.functions.invoke(
      'finance-api/billing/generate',
      { body: data },
    )
    if (error) throw error
    return result
  },
  getBillingStatus: async (id: string) => {
    const { data: result, error } = await supabase.functions.invoke(
      `finance-api/billing/${id}/status`,
      { method: 'GET' },
    )
    if (error) throw error
    return result
  },
  receivePaymentWebhook: async (data: any) => {
    const { data: result, error } = await supabase.functions.invoke(
      'finance-api/webhooks/payments',
      { body: data },
    )
    if (error) throw error
    return result
  },
  issueFiscalNote: async (data: any) => {
    const { data: result, error } = await supabase.functions.invoke('finance-api/fiscal/issue', {
      body: data,
    })
    if (error) throw error
    return result
  },
  getRevenueReport: async () => {
    const { data: result, error } = await supabase.functions.invoke('finance-api/reports/revenue', {
      method: 'GET',
    })
    if (error) throw error
    return result
  },
}
