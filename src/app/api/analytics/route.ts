import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerClient()

    // Leads por mês (últimos 6 meses)
    const { data: leadsRaw } = await supabase
      .from('leads')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString())

    // Totais de leads
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    // Leads este mês
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    const { count: leadsThisMonth } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString())

    // Leads mês passado
    const startOfLastMonth = new Date(startOfMonth)
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1)
    const { count: leadsLastMonth } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfLastMonth.toISOString())
      .lt('created_at', startOfMonth.toISOString())

    // Leads esta semana
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const { count: leadsThisWeek } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfWeek.toISOString())

    // Eventos de modal (últimos 6 meses)
    const { data: eventsRaw } = await supabase
      .from('events')
      .select('tipo, session_id, created_at')
      .gte('created_at', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString())

    // Último lead
    const { data: lastLeadArr } = await supabase
      .from('leads')
      .select('nome, created_at')
      .order('created_at', { ascending: false })
      .limit(1)

    // --- Processar leads por mês ---
    const monthMap: Record<string, number> = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthMap[key] = 0
    }
    for (const l of leadsRaw ?? []) {
      const d = new Date(l.created_at)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (key in monthMap) monthMap[key]++
    }
    const MONTHS_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
    const leadsByMonth = Object.entries(monthMap).map(([key, count]) => {
      const [, m] = key.split('-')
      return { mes: MONTHS_PT[parseInt(m) - 1], leads: count }
    })

    // --- Processar abandono por mês ---
    let totalOpens   = 0
    let totalSubmits = 0
    let totalClosed  = 0
    const abandonByMonth: Record<string, { opens: number; submits: number; fechados: number }> = {}

    for (const key of Object.keys(monthMap)) {
      abandonByMonth[key] = { opens: 0, submits: 0, fechados: 0 }
    }
    for (const e of eventsRaw ?? []) {
      const d = new Date(e.created_at)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (e.tipo === 'modal_open')     { totalOpens++;   if (key in abandonByMonth) abandonByMonth[key].opens++ }
      if (e.tipo === 'lead_submitted') { totalSubmits++; if (key in abandonByMonth) abandonByMonth[key].submits++ }
      if (e.tipo === 'modal_closed')   { totalClosed++;  if (key in abandonByMonth) abandonByMonth[key].fechados++ }
    }
    const funnelByMonth = Object.entries(abandonByMonth).map(([key, v]) => {
      const [, m] = key.split('-')
      return {
        mes:      MONTHS_PT[parseInt(m) - 1],
        abertos:  v.opens,
        enviados: v.submits,
        fechados: v.fechados,
      }
    })

    const conversionRate = totalOpens > 0
      ? Math.round((totalSubmits / totalOpens) * 100)
      : null

    return NextResponse.json({
      kpis: {
        totalLeads:      totalLeads ?? 0,
        leadsThisMonth:  leadsThisMonth ?? 0,
        leadsLastMonth:  leadsLastMonth ?? 0,
        leadsThisWeek:   leadsThisWeek ?? 0,
        conversionRate,
        totalClosed,
        lastLead: lastLeadArr?.[0] ?? null,
      },
      leadsByMonth,
      funnelByMonth,
    })
  } catch (err) {
    console.error('[analytics] GET error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}