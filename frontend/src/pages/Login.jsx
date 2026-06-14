import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Mail, Lock, ArrowRight, User, Sparkles, AlertCircle } from 'lucide-react'
import { authAPI } from '../api/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let res
      if (isRegister) {
        res = await authAPI.register(email, password, fullName)
      } else {
        res = await authAPI.login(email, password)
      }
      localStorage.setItem('ecoloop_token', res.data.access_token)
      localStorage.setItem('ecoloop_user', JSON.stringify({
        id: res.data.user_id,
        email: res.data.email,
        name: res.data.full_name,
        credits: res.data.green_credits
      }))
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Connection failed. Is the backend running?'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-float"/>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-float" style={{animationDelay:'1.5s'}}/>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10 animate-fadeInUp">
        <div className="text-center">
          <div className="w-18 h-18 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-5 shadow-2xl shadow-amber-500/20 animate-float p-4">
            <Leaf size={32} className="text-white"/>
          </div>
          <h1 className="text-4xl font-black theme-text tracking-tight">EcoLoop <span className="gradient-text-animated">AI</span></h1>
          <p className="text-sm theme-text-secondary mt-2 flex items-center justify-center gap-2"><Sparkles size={14} className="text-amber-400"/>Circular Commerce Platform<Sparkles size={14} className="text-amber-400"/></p>
        </div>

        <form onSubmit={handleSubmit} className="theme-card border rounded-2xl p-8 space-y-5 shadow-2xl">
          <h2 className="text-lg font-bold theme-text text-center">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-xs theme-text-muted text-center -mt-3">{isRegister ? 'Join the sustainable commerce revolution' : 'Sign in to your EcoLoop dashboard'}</p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs"><AlertCircle size={14}/>{error}</div>
          )}

          {isRegister && (
            <div className="animate-fadeInUp">
              <label className="block text-xs font-semibold theme-text-secondary uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted"/>
              <input type="text" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Your name" className="w-full theme-input border theme-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-all"/></div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold theme-text-secondary uppercase tracking-wider mb-2">Email</label>
            <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted"/>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full theme-input border theme-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-all" required/></div>
          </div>

          <div>
            <label className="block text-xs font-semibold theme-text-secondary uppercase tracking-wider mb-2">Password</label>
            <div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted"/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Minimum 8 characters" className="w-full theme-input border theme-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-all" required/></div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/20 btn-press">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <>{isRegister?'Create Account':'Sign In'}<ArrowRight size={16}/></>}
          </button>

          <div className="text-center pt-2">
            <button type="button" onClick={()=>{setIsRegister(!isRegister);setError('')}} className="text-xs theme-text-muted hover:text-amber-400 transition">
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {['ECS Fargate','RDS','Rekognition','SageMaker','S3','SES'].map(s=>(<span key={s} className="text-[9px] theme-text-muted theme-card border theme-border px-2 py-0.5 rounded-full">{s}</span>))}
          </div>
        </div>
      </div>
    </div>
  )
}