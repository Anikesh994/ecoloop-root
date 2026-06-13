import React, { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ScanLine, ShoppingBag, Users, Leaf, ShieldCheck, Bell, Search, Wifi, LogOut, Menu, X, Sparkles, Check, Sun, Moon } from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', desc: 'Overview & metrics' },
  { path: '/scan', icon: ScanLine, label: 'AI Scanner', desc: 'Grade & route items' },
  { path: '/marketplace', icon: ShoppingBag, label: 'Marketplace', desc: 'Certified products' },
  { path: '/p2p', icon: Users, label: 'P2P Resale', desc: 'Buy & sell direct' },
  { path: '/credits', icon: Leaf, label: 'Green Credits', desc: 'Rewards & perks' },
  { path: '/predictions', icon: ShieldCheck, label: 'Return Prevention', desc: 'ML predictions' }
]

const searchableItems = [
  { name: 'Samsung Galaxy S24 Ultra', type: 'Marketplace', grade: 'Grade A', price: 97499, page: '/marketplace' },
  { name: 'Sony WH-1000XM5', type: 'Marketplace', grade: 'Grade B', price: 20999, page: '/marketplace' },
  { name: 'MacBook Air M2', type: 'Marketplace', grade: 'Grade A', price: 94999, page: '/marketplace' },
  { name: 'Nike Air Max 90', type: 'Marketplace', grade: 'Grade B', price: 8449, page: '/marketplace' },
  { name: 'iPhone 14 Pro', type: 'P2P', grade: 'Like New', price: 72000, page: '/p2p' },
  { name: 'PS5 Disc Edition', type: 'P2P', grade: 'Like New', price: 38000, page: '/p2p' },
  { name: 'Green Credits', type: 'Page', grade: '', price: 0, page: '/credits' },
  { name: 'Return Prevention', type: 'Page', grade: '', price: 0, page: '/predictions' },
  { name: 'AI Scanner', type: 'Page', grade: '', price: 0, page: '/scan' },
  { name: 'Dashboard', type: 'Page', grade: '', price: 0, page: '/' },
]

const initialNotifications = [
  { id: 1, text: 'Your Grade A item is now listed on marketplace', time: '2 min ago', read: false, link: '/marketplace' },
  { id: 2, text: 'Waitlist match! A Grade B item is available', time: '15 min ago', read: false, link: '/marketplace' },
  { id: 3, text: 'You earned +65 green credits for your return', time: '1 hour ago', read: false, link: '/credits' },
  { id: 4, text: 'P2P listing received a new message', time: '3 hours ago', read: true, link: '/p2p' },
  { id: 5, text: 'Return prediction accuracy: 87%', time: '1 day ago', read: true, link: '/predictions' },
]

export default function Layout() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const searchRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const unreadCount = notifications.filter(n => !n.read).length

  // Apply dark class to html
  useEffect(() => {
    if (dark) { document.documentElement.classList.add('dark') } else { document.documentElement.classList.remove('dark') }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase()
      setSearchResults(searchableItems.filter(i => i.name.toLowerCase().includes(q) || i.type.toLowerCase().includes(q)).slice(0, 6))
    } else { setSearchResults([]) }
  }, [searchQuery])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') { setSearchFocused(false); setSearchQuery(''); setShowNotifications(false); setShowUserMenu(false) }
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); searchRef.current?.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const handleResultClick = (item) => { navigate(item.page); setSearchQuery(''); setSearchFocused(false) }
  const markAllRead = () => setNotifications(prev => prev.map(n => ({...n, read: true})))
  const handleNotificationClick = (n) => { setNotifications(prev => prev.map(x => x.id===n.id?{...x,read:true}:x)); setShowNotifications(false); navigate(n.link) }
  const handleLogout = () => { localStorage.removeItem('ecoloop_token'); navigate('/login') }

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300 bg-[var(--bg-primary)]">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed?'w-16':'w-64'} theme-card backdrop-blur-xl border-r flex flex-col shrink-0 transition-all duration-300`}>
        <div className={`p-4 border-b ${dark?'border-slate-800/50':'border-gray-200'} flex items-center justify-between`}>
          {!sidebarCollapsed && <div><h1 className={`text-xl font-black tracking-tight ${dark?'text-white':'text-gray-900'}`}>EcoLoop <span className="gradient-text-animated">AI</span></h1><p className={`text-[9px] mt-0.5 uppercase tracking-[0.2em] font-semibold ${dark?'text-slate-500':'text-gray-400'}`}>Circular Commerce</p></div>}
          {sidebarCollapsed && <Sparkles size={20} className="text-amber-400 mx-auto animate-float"/>}
          <button onClick={()=>setSidebarCollapsed(!sidebarCollapsed)} className={`p-1.5 rounded-lg transition ${dark?'hover:bg-slate-800 text-slate-400 hover:text-white':'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`}>
            {sidebarCollapsed?<Menu size={16}/>:<X size={16}/>}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto scrollbar-thin">
          {navItems.map(({path,icon:Icon,label,desc})=>(
            <NavLink key={path} to={path} end={path==='/'} className={({isActive})=>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 btn-press ${
                isActive
                  ? `bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/5`
                  : `${dark?'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60':'text-gray-500 hover:text-gray-900 hover:bg-gray-100'} border border-transparent`
              }`}>
              <Icon size={18} className="shrink-0 group-hover:scale-110 transition-transform"/>
              {!sidebarCollapsed&&<div className="flex-1 min-w-0"><span className="block truncate">{label}</span><span className={`block text-[10px] truncate ${dark?'text-slate-500 group-hover:text-slate-400':'text-gray-400 group-hover:text-gray-500'}`}>{desc}</span></div>}
              {!sidebarCollapsed && location.pathname===path && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulseGlow"/>}
            </NavLink>
          ))}
        </nav>

        {!sidebarCollapsed&&(
          <div className={`p-3 border-t ${dark?'border-slate-800/50':'border-gray-200'}`}>
            <div onClick={e=>{e.stopPropagation();setShowUserMenu(!showUserMenu)}} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer relative ${dark?'bg-slate-800/30 hover:bg-slate-800/60':'bg-gray-100 hover:bg-gray-200'}`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-amber-500/20">U</div>
              <div className="flex-1 min-w-0"><p className={`text-xs font-semibold truncate ${dark?'text-slate-200':'text-gray-800'}`}>Demo User</p><p className="text-[10px] text-amber-500 font-medium">250 credits</p></div>
              <button onClick={e=>{e.stopPropagation();handleLogout()}} className="text-slate-500 hover:text-red-400 transition p-1 rounded hover:bg-red-500/10"><LogOut size={13}/></button>
              {showUserMenu&&(
                <div className={`absolute bottom-full left-0 right-0 mb-2 border rounded-xl shadow-2xl overflow-hidden animate-fadeInUp z-50 ${dark?'bg-slate-900 border-slate-700':'bg-white border-gray-200'}`} onClick={e=>e.stopPropagation()}>
                  <div className={`p-4 border-b ${dark?'border-slate-800':'border-gray-100'}`}><p className={`text-sm font-bold ${dark?'text-white':'text-gray-900'}`}>Demo User</p><p className={`text-xs ${dark?'text-slate-400':'text-gray-500'}`}>demo@ecoloop.ai</p><p className="text-xs text-amber-500 mt-1 font-medium">250 green credits</p></div>
                  <div className="p-1">
                    <button onClick={()=>{setShowUserMenu(false);navigate('/credits')}} className={`w-full text-left px-3 py-2 text-xs rounded-lg transition ${dark?'text-slate-300 hover:bg-slate-800':'text-gray-700 hover:bg-gray-100'}`}>My Credits & Rewards</button>
                    <button onClick={()=>{setShowUserMenu(false);navigate('/scan')}} className={`w-full text-left px-3 py-2 text-xs rounded-lg transition ${dark?'text-slate-300 hover:bg-slate-800':'text-gray-700 hover:bg-gray-100'}`}>My Returns</button>
                    <button onClick={()=>{setShowUserMenu(false);navigate('/p2p')}} className={`w-full text-left px-3 py-2 text-xs rounded-lg transition ${dark?'text-slate-300 hover:bg-slate-800':'text-gray-700 hover:bg-gray-100'}`}>My Listings</button>
                    <div className={`border-t mt-1 pt-1 ${dark?'border-slate-800':'border-gray-100'}`}><button onClick={handleLogout} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition">Sign Out</button></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`h-14 border-b flex items-center justify-between px-6 shrink-0 relative z-40 backdrop-blur-xl ${dark?'bg-slate-900/60 border-slate-800/50':'bg-white/80 border-gray-200'}`}>
          {/* Search */}
          <div className={`relative transition-all duration-300 ${searchFocused?'w-[480px]':'w-72'}`}>
            <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${searchFocused?'text-amber-500':dark?'text-slate-500':'text-gray-400'}`}/>
            <input ref={searchRef} type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onFocus={()=>setSearchFocused(true)} onBlur={()=>setTimeout(()=>setSearchFocused(false),200)} placeholder="Search products, pages... (/)" className={`w-full border rounded-xl pl-9 pr-12 py-2 text-sm focus:outline-none transition-all ${dark?'bg-slate-800/40 border-slate-700/50 text-slate-300 placeholder-slate-500':'bg-gray-100 border-gray-200 text-gray-800 placeholder-gray-400'} ${searchFocused?'border-amber-500/50 shadow-lg shadow-amber-500/5':''}`}/>
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded font-mono ${dark?'text-slate-600 bg-slate-700/50':'text-gray-400 bg-gray-200'}`}>/</span>
            {searchFocused&&searchResults.length>0&&(
              <div className={`absolute top-full left-0 right-0 mt-2 border rounded-xl shadow-2xl overflow-hidden animate-fadeInDown ${dark?'bg-slate-900 border-slate-700':'bg-white border-gray-200'}`}>
                <div className={`p-2 border-b ${dark?'border-slate-800':'border-gray-100'}`}><p className={`text-[10px] uppercase tracking-wider font-semibold px-2 ${dark?'text-slate-500':'text-gray-400'}`}>{searchResults.length} results</p></div>
                {searchResults.map((item,i)=>(
                  <button key={i} onMouseDown={()=>handleResultClick(item)} className={`w-full flex items-center gap-3 px-4 py-3 transition text-left border-b last:border-0 ${dark?'hover:bg-slate-800/60 border-slate-800/50':'hover:bg-gray-50 border-gray-100'}`}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-500">{item.type==='Marketplace'?<ShoppingBag size={14}/>:item.type==='P2P'?<Users size={14}/>:<LayoutDashboard size={14}/>}</div>
                    <div className="flex-1 min-w-0"><p className={`text-sm font-medium truncate ${dark?'text-slate-200':'text-gray-800'}`}>{item.name}</p><p className={`text-[10px] ${dark?'text-slate-500':'text-gray-400'}`}>{item.type}</p></div>
                    {item.price>0&&<span className="text-xs font-mono text-amber-500">Rs.{item.price.toLocaleString('en-IN')}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button onClick={()=>setDark(!dark)} className={`p-2.5 rounded-xl transition btn-press ${dark?'hover:bg-slate-800/60 text-slate-400 hover:text-amber-400':'hover:bg-gray-100 text-gray-400 hover:text-amber-500'}`} title={dark?'Switch to light':'Switch to dark'}>
              {dark ? <Sun size={17}/> : <Moon size={17}/>}
            </button>

            {/* AWS badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${dark?'bg-slate-800/40 border-slate-700/50':'bg-gray-100 border-gray-200'}`}>
              <Wifi size={11} className="text-amber-500"/><span className={`text-[10px] font-mono ${dark?'text-slate-400':'text-gray-500'}`}>AWS</span><span className="w-1.5 h-1.5 rounded-full bg-green-400"/>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button onClick={e=>{e.stopPropagation();setShowNotifications(!showNotifications);setShowUserMenu(false)}} className={`relative p-2.5 rounded-xl transition btn-press ${dark?'hover:bg-slate-800/60':'hover:bg-gray-100'}`}>
                <Bell size={17} className={dark?'text-slate-400':'text-gray-500'}/>
                {unreadCount>0&&<span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 text-[9px] font-bold text-white flex items-center justify-center">{unreadCount}</span>}
              </button>
              {showNotifications&&(
                <div className={`absolute top-full right-0 mt-2 w-80 border rounded-xl shadow-2xl overflow-hidden animate-fadeInDown z-50 ${dark?'bg-slate-900 border-slate-700':'bg-white border-gray-200'}`} onClick={e=>e.stopPropagation()}>
                  <div className={`p-3 border-b flex items-center justify-between ${dark?'border-slate-800':'border-gray-100'}`}>
                    <h3 className={`text-sm font-bold ${dark?'text-white':'text-gray-900'}`}>Notifications</h3>
                    {unreadCount>0&&<button onClick={markAllRead} className="text-[10px] text-amber-500 hover:text-amber-400 flex items-center gap-1"><Check size={10}/>Mark all read</button>}
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.map(notif=>(
                      <button key={notif.id} onClick={()=>handleNotificationClick(notif)} className={`w-full text-left px-4 py-3 border-b transition ${dark?'border-slate-800/50 hover:bg-slate-800/40':'border-gray-50 hover:bg-gray-50'} ${!notif.read?'bg-amber-500/5':''}`}>
                        <div className="flex items-start gap-3">
                          <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.read?'bg-amber-500':'bg-gray-300 dark:bg-slate-700'}`}/>
                          <div className="flex-1"><p className={`text-xs leading-relaxed ${!notif.read?(dark?'text-slate-200 font-medium':'text-gray-800 font-medium'):(dark?'text-slate-400':'text-gray-500')}`}>{notif.text}</p><p className={`text-[10px] mt-1 ${dark?'text-slate-600':'text-gray-400'}`}>{notif.time}</p></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="animate-fadeInUp"><Outlet/></div>
        </main>
      </div>
    </div>
  )
}