import React, { useState, useEffect } from 'react'
import { analyticsAPI } from '../api/client'
import { useNavigate } from 'react-router-dom'
import { Package, Leaf, TrendingUp, Recycle, ShoppingBag, Users, ArrowUpRight, BarChart3 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const stats = [
  { label: 'Items Processed', value: '12,847', change: '+23%', icon: Package, color: 'text-amber-400' },
  { label: 'Green Credits', value: '384,200', change: '+18%', icon: Leaf, color: 'text-green-400' },
  { label: 'Value Recovered', value: 'Rs.48.3L', change: '+31%', icon: TrendingUp, color: 'text-blue-400' },
  { label: 'CO2 Prevented', value: '2.4 tons', change: '+12%', icon: Recycle, color: 'text-teal-400' },
  { label: 'Marketplace Sales', value: '3,291', change: '+27%', icon: ShoppingBag, color: 'text-purple-400' },
  { label: 'P2P Transactions', value: '1,856', change: '+45%', icon: Users, color: 'text-amber-400' }
]

const trendData = [
  { day: 'Mon', items: 142 }, { day: 'Tue', items: 198 }, { day: 'Wed', items: 176 },
  { day: 'Thu', items: 221 }, { day: 'Fri', items: 254 }, { day: 'Sat', items: 189 }, { day: 'Sun', items: 163 }
]

const routingData = [
  { name: 'Resell', value: 45, color: '#f59e0b' },
  { name: 'Refurbish', value: 25, color: '#3b82f6' },
  { name: 'Donate', value: 15, color: '#8b5cf6' },
  { name: 'Recycle', value: 10, color: '#f59e0b' },
  { name: 'Exchange', value: 5, color: '#ec4899' }
]

const activity = [
  { id: 'RET-4821', grade: 'Grade A', routing: 'RESELL', price: 'Rs.8,400', time: '2m ago' },
  { id: 'RET-4820', grade: 'Grade C', routing: 'REFURBISH', price: 'Rs.3,200', time: '5m ago' },
  { id: 'RET-4819', grade: 'Grade B', routing: 'RESELL', price: 'Rs.6,100', time: '8m ago' },
  { id: 'RET-4818', grade: 'Grade D', routing: 'DONATE', price: '-', time: '12m ago' },
  { id: 'RET-4817', grade: 'Grade A', routing: 'RESELL', price: 'Rs.12,800', time: '15m ago' }
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [liveStats, setLiveStats] = useState(null)

  useEffect(() => {
    analyticsAPI.summary().then(res => setLiveStats(res.data)).catch(() => {})
  }, [])
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold theme-text">Platform Dashboard</h2>
        <p className="text-sm theme-text-secondary mt-1">Real-time circular economy metrics and AI routing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {stats.map((s) => { const Icon = s.icon; return (
          <div key={s.label} className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-slate-800"><Icon size={20} className={s.color}/></div>
            <div className="flex-1">
              <p className="text-[11px] theme-text-secondary uppercase tracking-wider font-semibold">{s.label}</p>
              <p className="text-xl font-bold theme-text mt-0.5">{s.value}</p>
            </div>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">{s.change}</span>
          </div>
        )})}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border theme-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-sm font-bold theme-text">Processing Trend</h3><p className="text-xs theme-text-muted">This week</p></div>
            <BarChart3 size={16} className="theme-text-muted"/>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
              <XAxis dataKey="day" tick={{fill:'#64748b',fontSize:11}} axisLine={false}/>
              <YAxis tick={{fill:'#64748b',fontSize:11}} axisLine={false}/>
              <Tooltip contentStyle={{background:'#0f172a',border:'1px solid #334155',borderRadius:'8px'}}/>
              <Area type="monotone" dataKey="items" stroke="#f59e0b" fill="url(#g1)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-5">
          <h3 className="text-sm font-bold theme-text mb-1">AI Routing</h3>
          <p className="text-xs theme-text-muted mb-4">Item destinations</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart><Pie data={routingData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
              {routingData.map((e,i)=><Cell key={i} fill={e.color}/>)}
            </Pie><Tooltip contentStyle={{background:'#0f172a',border:'1px solid #334155',borderRadius:'8px'}}/></PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {routingData.map(r=>(
              <div key={r.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{backgroundColor:r.color}}/><span className="theme-text-secondary">{r.name}</span></div>
                <span className="theme-text font-mono">{r.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold theme-text">Recent Activity</h3>
          <button onClick={() => navigate('/scan')} className="text-xs text-amber-400 hover:text-emerald-300 flex items-center gap-1">View all <ArrowUpRight size={12}/></button>
        </div>
        <table className="w-full text-xs">
          <thead><tr className="theme-text-muted uppercase border-b theme-border">
            <th className="pb-3 text-left">ID</th><th className="pb-3 text-left">Grade</th><th className="pb-3 text-left">Routing</th><th className="pb-3 text-left">Price</th><th className="pb-3 text-right">Time</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-800/50">
            {activity.map(a=>(
              <tr key={a.id} className="hover:bg-[var(--bg-card-hover)]">
                <td className="py-3 font-mono theme-text">{a.id}</td>
                <td className="py-3"><span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">{a.grade}</span></td>
                <td className="py-3"><span className={a.routing==='RESELL'?'text-amber-400':a.routing==='REFURBISH'?'text-blue-400':a.routing==='DONATE'?'text-purple-400':'text-amber-400'}>{a.routing}</span></td>
                <td className="py-3 font-mono theme-text">{a.price}</td>
                <td className="py-3 text-right theme-text-muted">{a.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}