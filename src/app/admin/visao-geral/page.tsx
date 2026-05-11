'use client'

import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Users, TrendingUp, CalendarDays, MousePointerClick, XCircle, Loader2 } from 'lucide-react'

interface Kpis {
  totalLeads: number
  leadsThisMonth: number
  leadsLastMonth: number
  leadsThisWeek: number
  conversionRate: number | null
  totalClosed: number
  lastLead: { nome: string; created_at: string } | null
}

interface Analytics {
  kpis: Kpis
  leadsByMonth: { mes: string; leads: number }[]
  funnelByMonth: { mes: string; abertos: number; enviados: number; abandonos: number }[]
}

function trend(current: number, previous: number) {
  if (previous === 0) return null
  const pct = Math.round(((current - previous) / previous) * 100)
  return pct
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

const BRAND = { bronze: '#8B5E3C', gold: '#C9A96E', cream: '#F5EFE6', dark: '#3D2B1F' }

export default function VisaoGeralPage() {
  const [data,    setData]    = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-brand-bronze/40" />
      </div>
    )
  }

  if (!data) return null

  const { kpis, leadsByMonth, funnelByMonth } = data
  const trendPct = trend(kpis.leadsThisMonth, kpis.leadsLastMonth)

  const KPIS = [
    {
      label: 'Total de leads',
      value: kpis.totalLeads,
      icon: Users,
      sub: null,
    },
    {
      label: 'Leads este mês',
      value: kpis.leadsThisMonth,
      icon: CalendarDays,
      sub: trendPct !== null
        ? { text: `${trendPct >= 0 ? '+' : ''}${trendPct}% vs mês anterior`, up: trendPct >= 0 }
        : null,
    },
    {
      label: 'Leads esta semana',
      value: kpis.leadsThisWeek,
      icon: TrendingUp,
      sub: null,
    },
    {
      label: 'Taxa de conversão',
      value: kpis.conversionRate !== null ? `${kpis.conversionRate}%` : '—',
      icon: MousePointerClick,
      sub: { text: 'Modal aberto → formulário enviado', up: null },
    },
    {
      label: 'Fecharam sem enviar',
      value: kpis.totalClosed,
      icon: XCircle,
      sub: { text: 'Modal aberto e fechado sem preencher', up: null },
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-playfair text-3xl text-brand-dark">Visão Geral</h1>
          <p className="font-jost text-sm text-brand-dark/50 mt-1">
            Resumo de captação e conversão de leads
          </p>
        </div>
        {kpis.lastLead && (
          <div className="text-right">
            <p className="font-jost text-xs text-brand-dark/40 uppercase tracking-widest">Último lead</p>
            <p className="font-jost text-sm text-brand-dark font-medium">{kpis.lastLead.nome}</p>
            <p className="font-jost text-xs text-brand-dark/40">{formatDate(kpis.lastLead.created_at)}</p>
          </div>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {KPIS.map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="bg-brand-white p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="font-jost text-xs tracking-widest uppercase text-brand-dark/40">{label}</p>
              <Icon size={16} className="text-brand-bronze/40 flex-shrink-0" />
            </div>
            <p className="font-playfair text-3xl text-brand-dark">{value}</p>
            {sub && (
              <p className={`font-jost text-xs mt-2 ${
                sub.up === true  ? 'text-emerald-600' :
                sub.up === false ? 'text-red-500'     : 'text-brand-dark/40'
              }`}>
                {sub.text}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Leads por mês */}
        <div className="bg-brand-white p-6">
          <p className="font-jost text-xs tracking-widest uppercase text-brand-dark/40 mb-6">
            Leads por mês — últimos 6 meses
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={leadsByMonth} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke={BRAND.cream} />
              <XAxis dataKey="mes" tick={{ fontFamily: 'var(--font-inter)', fontSize: 11, fill: BRAND.dark + '80' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontFamily: 'var(--font-inter)', fontSize: 11, fill: BRAND.dark + '80' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontFamily: 'var(--font-inter)', fontSize: 12, border: 'none', background: '#FDFAF6', borderRadius: 0 }}
                cursor={{ fill: BRAND.cream }}
              />
              <Bar dataKey="leads" name="Leads" fill={BRAND.bronze} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Funil: modal aberto vs enviado */}
        <div className="bg-brand-white p-6">
          <p className="font-jost text-xs tracking-widest uppercase text-brand-dark/40 mb-6">
            Funil de conversão — últimos 6 meses
          </p>
          {funnelByMonth.every((d) => d.abertos === 0) ? (
            <div className="h-[220px] flex items-center justify-center">
              <p className="font-jost text-sm text-brand-dark/30">
                Dados disponíveis após os primeiros cliques no CTA
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={funnelByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke={BRAND.cream} />
                <XAxis dataKey="mes" tick={{ fontFamily: 'var(--font-inter)', fontSize: 11, fill: BRAND.dark + '80' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontFamily: 'var(--font-inter)', fontSize: 11, fill: BRAND.dark + '80' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontFamily: 'var(--font-inter)', fontSize: 12, border: 'none', background: '#FDFAF6', borderRadius: 0 }}
                />
                <Legend wrapperStyle={{ fontFamily: 'var(--font-inter)', fontSize: 11 }} />
                <Line type="monotone" dataKey="abertos"  name="Modal aberto"       stroke={BRAND.gold}   strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="enviados" name="Formulário enviado"  stroke={BRAND.bronze} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="fechados" name="Fechou sem enviar"   stroke="#E07070"      strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  )
}