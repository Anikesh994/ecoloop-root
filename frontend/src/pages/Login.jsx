import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Mail, Lock, ArrowRight, User, Sparkles } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    localStorage.setItem('ecoloop_token', 'demo_token')
    setLoading(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-float"/>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-float" style={{animationDelay:'1.5s'}}/>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400/30 rounded-full animate-pulse"/>
        <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-orange-400/30 rounded-full animate-pulse" style={{animationDelay:'1s'}}/>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-400/30 rounded-full animate-pulse" style={{animationDelay:'2s'}}/>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10 animate-fadeInUp">
        {/* Logo */}
        <div className="text-center">
          <div className="w-18 h-18 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-5 shadow-2xl shadow-amber-500/20 animate-float p-4">
            <Leaf size={32} className="text-slate-950"/>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            EcoLoop <span className="gradient-text-animated">AI</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 flex items-center justify-center gap-2">
            <Sparkles size={14} className="text-amber-400"/>
            Circular Commerce Platform
            <Sparkles size={14} className="text-amber-400"/>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass border border-slate-800/50 rounded-2xl p-8 space-y-5 shadow-2xl shadow-black/20 animate-scaleIn">
          <h2 className="text-lg font-bold text-white text-center">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-500 text-center -mt-3">
            {isRegister ? 'Join the sustainable commerce revolution' : 'Sign in to your EcoLoop dashboard'}
          </p>

          {isRegister && (
            <div className="animate-fadeInUp">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                <input type="text" placeholder="Your name" className="w-full bg-slate-950/80 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 focus:shadow-lg focus:shadow-amber-500/5 transition-all"/>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
            <div className="relative group">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition"/>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-slate-950/80 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 focus:shadow-lg focus:shadow-amber-500/5 transition-all" required/>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative group">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition"/>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Minimum 8 characters" className="w-full bg-slate-950/80 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 focus:shadow-lg focus:shadow-amber-500/5 transition-all" required/>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-slate-600 disabled:to-slate-600 text-slate-950 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 btn-press">
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"/>
            ) : (
              <>{isRegister ? 'Create Account' : 'Sign In'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/></>
            )}
          </button>

          <div className="text-center pt-2">
            <button type="button" onClick={()=>setIsRegister(!isRegister)} className="text-xs text-slate-400 hover:text-amber-400 transition">
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </form>

        {/* AWS Footer */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {['ECS Fargate','RDS','Rekognition','SageMaker','S3','SES'].map(s=>(
              <span key={s} className="text-[9px] text-slate-600 bg-slate-800/30 px-2 py-0.5 rounded-full border border-slate-800/50">{s}</span>
            ))}
          </div>
          <p className="text-[10px] text-slate-700">Powered by Amazon Web Services</p>
        </div>
      </div>
    </div>
  )
}