import React, { useState } from 'react'
import { Search, ShoppingCart, Shield, Leaf, CheckCircle } from 'lucide-react'

const initialProducts = [
  { id:'RET-4821', name:'Samsung Galaxy S24 Ultra', category:'Electronics', grade:'Grade A', orig:129999, price:97499, credits:65, img:'📱' },
  { id:'RET-4819', name:'Sony WH-1000XM5', category:'Electronics', grade:'Grade B', orig:29999, price:20999, credits:30, img:'🎧' },
  { id:'RET-4817', name:'MacBook Air M2', category:'Electronics', grade:'Grade A', orig:114999, price:94999, credits:57, img:'💻' },
  { id:'RET-4815', name:'Nike Air Max 90', category:'Fashion', grade:'Grade B', orig:12999, price:8449, credits:13, img:'👟' },
  { id:'RET-4813', name:'Kindle Paperwhite 2024', category:'Electronics', grade:'Grade A', orig:16999, price:13599, credits:17, img:'📚' },
  { id:'RET-4811', name:'Dyson V15 Vacuum', category:'Home', grade:'Grade C', orig:62999, price:37799, credits:63, img:'🏠' },
  { id:'RET-4809', name:'Apple Watch Series 9', category:'Electronics', grade:'Grade B', orig:44999, price:33749, credits:45, img:'⌚' },
  { id:'RET-4807', name:'Lego Technic 2200pc', category:'Toys', grade:'Grade A', orig:18999, price:15199, credits:19, img:'🧱' }
]
const cats = ['All','Electronics','Fashion','Home','Toys']
const grades = ['All','Grade A','Grade B','Grade C']

export default function Marketplace() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [grade, setGrade] = useState('All')
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState(null)

  const filtered = initialProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && (cat==='All'||p.category===cat) && (grade==='All'||p.grade===grade))

  const addToCart = (product) => {
    if (cart.find(c => c.id === product.id)) {
      showToast('Already in cart!', 'amber')
      return
    }
    setCart(prev => [...prev, product])
    showToast(`${product.name} added to cart! +${product.credits} green credits on purchase.`, 'emerald')
  }

  const showToast = (message, color) => {
    setToast({ message, color })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="space-y-6 max-w-7xl relative">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl animate-pulse ${
          toast.color === 'emerald' ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
        }`}>
          <CheckCircle size={16}/> <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold theme-text">Certified Marketplace</h2><p className="text-sm theme-text-secondary mt-1">AI-graded refurbished products with green credit rewards</p></div>
        <div className="flex items-center gap-3">
          {cart.length > 0 && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
              <ShoppingCart size={14} className="text-amber-400"/>
              <span className="text-xs text-amber-400 font-bold">{cart.length} items</span>
              <span className="text-xs theme-text-secondary">Rs.{cart.reduce((s,c)=>s+c.price,0).toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
            <Shield size={14} className="text-amber-400"/><span className="text-xs text-amber-400 font-semibold">Amazon Verified</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted"/>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="w-full theme-input border theme-border rounded-lg pl-10 pr-4 py-2 text-sm theme-text placeholder-slate-500 focus:outline-none focus:border-amber-500"/>
        </div>
        <div className="flex gap-1">{cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${cat===c?'bg-amber-500/20 text-amber-400 border border-amber-500/30':'bg-slate-800 theme-text-secondary border border-transparent'}`}>{c}</button>
        ))}</div>
        <select value={grade} onChange={e=>setGrade(e.target.value)} className="theme-input border theme-border rounded-lg px-3 py-2 text-xs theme-text focus:outline-none focus:border-amber-500">
          {grades.map(g=><option key={g} value={g}>{g==='All'?'All Grades':g}</option>)}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
        {filtered.map(p=>{
          const inCart = cart.find(c=>c.id===p.id)
          return (
          <div key={p.id} className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-4 flex flex-col hover:border-amber-500/30 card-hover">
            <div className="w-full h-36 theme-input rounded-lg border theme-border flex items-center justify-center text-4xl mb-3">{p.img}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${p.grade==='Grade A'?'bg-amber-500/10 text-amber-400 border-amber-500/20':p.grade==='Grade B'?'bg-blue-500/10 text-blue-400 border-blue-500/20':'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{p.grade}</span>
                <span className="text-[10px] theme-text-muted font-mono">{p.id}</span>
              </div>
              <h3 className="text-sm font-semibold theme-text mt-2">{p.name}</h3>
              <p className="text-[10px] theme-text-muted mt-1">{p.category}</p>
            </div>
            <div className="mt-4 pt-3 border-t theme-border">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs theme-text-muted line-through">Rs.{p.orig.toLocaleString('en-IN')}</p>
                  <p className="text-lg font-bold text-amber-400 font-mono">Rs.{p.price.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-green-400 flex items-center gap-1"><Leaf size={10}/>+{p.credits}</p>
                  <p className="text-[10px] theme-text-muted">{Math.round((1-p.price/p.orig)*100)}% off</p>
                </div>
              </div>
              <button onClick={()=>addToCart(p)} className={`w-full mt-3 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition ${inCart ? 'bg-slate-700 theme-text-secondary cursor-default' : 'bg-amber-500 hover:bg-amber-600 text-slate-950'}`}>
                <ShoppingCart size={14}/> {inCart ? 'In Cart ✓' : 'Add to Cart'}
              </button>
            </div>
          </div>
        )})}
      </div>
      {filtered.length===0 && <div className="text-center py-16 theme-text-muted"><p>No products match</p><button onClick={()=>{setSearch('');setCat('All');setGrade('All')}} className="text-xs text-amber-400 mt-2 hover:underline">Clear filters</button></div>}
    </div>
  )
}