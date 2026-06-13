import React, { useState } from 'react'
import { Leaf, TrendingUp, Gift, Award, ArrowUpRight, ArrowDownRight, Trophy, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const weekly = [{week:'W1',earned:320,spent:100},{week:'W2',earned:450,spent:200},{week:'W3',earned:280,spent:50},{week:'W4',earned:520,spent:300}]

const initialHistory = [
  {id:1,type:'earn',amount:65,reason:'Return submitted - Grade A',date:'2h ago',bal:1250},
  {id:2,type:'earn',amount:30,reason:'Purchased refurbished',date:'1d ago',bal:1185},
  {id:3,type:'spend',amount:-100,reason:'Redeemed Rs.50 discount',date:'2d ago',bal:1155},
  {id:4,type:'earn',amount:150,reason:'Item donated',date:'3d ago',bal:1255},
  {id:5,type:'earn',amount:75,reason:'P2P sale completed',date:'4d ago',bal:1105},
  {id:6,type:'spend',amount:-200,reason:'Priority waitlist',date:'1w ago',bal:1005}
]

const board = [
  {rank:1,name:'Ananya R.',credits:12850,badge:'Eco Champion'},
  {rank:2,name:'Vikram S.',credits:11200,badge:'Circular Hero'},
  {rank:3,name:'Priya M.',credits:9840,badge:'Green Warrior'},
  {rank:4,name:'You',credits:1250,badge:'Eco Starter',isYou:true},
  {rank:5,name:'Rahul K.',credits:980,badge:'New Leaf'}
]

const redeemOptions = [{c:100,r:'Rs.50 off next purchase'},{c:200,r:'Priority waitlist access'},{c:500,r:'Rs.300 off + free shipping'},{c:1000,r:'Rs.750 off + eco badge'}]

export default function GreenCredits() {
  const [balance, setBalance] = useState(1250)
  const [history, setHistory] = useState(initialHistory)
  const [toast, setToast] = useState(null)

  const showToast = (msg, color='emerald') => {
    setToast({msg, color})
    setTimeout(()=>setToast(null), 3000)
  }

  const redeemCredits = (option) => {
    if (balance < option.c) {
      showToast('Insufficient credits!', 'amber')
      return
    }
    const newBal = balance - option.c
    setBalance(newBal)
    const tx = {id: Date.now(), type:'spend', amount: -option.c, reason: `Redeemed: ${option.r}`, date:'Just now', bal: newBal}
    setHistory(prev => [tx, ...prev])
    showToast(`Redeemed ${option.c} credits for "${option.r}"!`)
  }

  return (
    <div className="space-y-6 max-w-7xl relative">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl ${
          toast.color==='emerald'?'bg-amber-500/20 border-amber-500/30 text-amber-300':'bg-amber-500/20 border-amber-500/30 text-amber-300'
        }`}><CheckCircle size={16}/><span className="text-sm font-medium">{toast.msg}</span></div>
      )}

      <div><h2 className="text-2xl font-bold theme-text">Green Credits & Rewards</h2><p className="text-sm theme-text-secondary mt-1">Earn sustainability points for circular actions</p></div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><Leaf size={18} className="text-amber-400"/><span className="text-xs theme-text-secondary uppercase font-semibold">Balance</span></div>
          <p className="text-3xl font-black theme-text">{balance.toLocaleString()}</p><p className="text-xs text-amber-400 mt-1">green credits</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><TrendingUp size={18} className="text-blue-400"/><span className="text-xs theme-text-secondary uppercase font-semibold">This Month</span></div>
          <p className="text-3xl font-black theme-text">+345</p><p className="text-xs text-blue-400 mt-1">earned</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><Gift size={18} className="text-purple-400"/><span className="text-xs theme-text-secondary uppercase font-semibold">Redeemed</span></div>
          <p className="text-3xl font-black theme-text">{history.filter(h=>h.type==='spend').reduce((s,h)=>s+Math.abs(h.amount),0)}</p><p className="text-xs text-purple-400 mt-1">spent</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2"><Award size={18} className="text-amber-400"/><span className="text-xs theme-text-secondary uppercase font-semibold">Rank</span></div>
          <p className="text-3xl font-black theme-text">#4</p><p className="text-xs text-amber-400 mt-1">Eco Starter</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-5">
            <h3 className="text-sm font-bold theme-text mb-4">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weekly}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/><XAxis dataKey="week" tick={{fill:'#64748b',fontSize:11}} axisLine={false}/><YAxis tick={{fill:'#64748b',fontSize:11}} axisLine={false}/><Tooltip contentStyle={{background:'#0f172a',border:'1px solid #334155',borderRadius:'8px'}}/><Bar dataKey="earned" fill="#f59e0b" radius={[4,4,0,0]}/><Bar dataKey="spent" fill="#8b5cf6" radius={[4,4,0,0]}/></BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-5">
            <h3 className="text-sm font-bold theme-text mb-4">Transactions</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">{history.map(tx=>(
              <div key={tx.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[var(--bg-card-hover)]">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type==='earn'?'bg-amber-500/10':'bg-purple-500/10'}`}>
                    {tx.type==='earn'?<ArrowUpRight size={14} className="text-amber-400"/>:<ArrowDownRight size={14} className="text-purple-400"/>}
                  </div>
                  <div><p className="text-xs theme-text font-medium">{tx.reason}</p><p className="text-[10px] theme-text-muted">{tx.date}</p></div>
                </div>
                <div className="text-right"><p className={`text-sm font-bold font-mono ${tx.type==='earn'?'text-amber-400':'text-purple-400'}`}>{tx.type==='earn'?'+':''}{tx.amount}</p><p className="text-[10px] theme-text-muted">bal:{tx.bal}</p></div>
              </div>
            ))}</div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4"><Trophy size={16} className="text-amber-400"/><h3 className="text-sm font-bold theme-text">Leaderboard</h3></div>
            <div className="space-y-2">{board.map(u=>(
              <div key={u.rank} className={`flex items-center gap-3 p-2.5 rounded-lg ${u.isYou?'bg-amber-500/10 border border-amber-500/20':'hover:bg-[var(--bg-card-hover)]'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${u.rank===1?'bg-amber-500 text-slate-950':u.rank===2?'bg-slate-400 text-slate-950':u.rank===3?'bg-amber-700 theme-text':'bg-slate-800 theme-text-secondary'}`}>{u.rank}</span>
                <div className="flex-1 min-w-0"><p className="text-xs text-slate-200 font-medium truncate">{u.name}</p><p className="text-[10px] theme-text-muted">{u.badge}</p></div>
                <span className="text-xs font-mono text-amber-400 font-bold">{u.credits.toLocaleString()}</span>
              </div>
            ))}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-5">
            <h3 className="text-sm font-bold theme-text mb-4">Redeem Credits</h3>
            <div className="space-y-2">{redeemOptions.map(o=>{const canAfford=balance>=o.c;return(
              <div key={o.c} className={`p-3 rounded-lg border ${canAfford?'theme-border hover:border-amber-500/30':'theme-border opacity-50'} transition`}>
                <div className="flex items-center justify-between"><span className="text-xs theme-text">{o.r}</span><span className="text-xs font-mono text-amber-400">{o.c}pts</span></div>
                {canAfford && <button onClick={()=>redeemCredits(o)} className="w-full mt-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[10px] font-semibold py-1.5 rounded transition">Redeem</button>}
              </div>
            )})}</div>
          </div>
        </div>
      </div>
    </div>
  )
}