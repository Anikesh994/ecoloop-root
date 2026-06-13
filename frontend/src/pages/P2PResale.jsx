import React, { useState } from 'react'
import { Plus, Shield, MessageCircle, Star, MapPin, Clock, CheckCircle, X } from 'lucide-react'

const initialListings = [
  { id:'P2P-001', title:'iPhone 14 Pro - Barely Used', seller:'Priya M.', rating:4.8, reviews:12, price:72000, originalPrice:129900, condition:'Like New', category:'Electronics', location:'Mumbai', posted:'2h ago', aiVerified:true, image:'📱' },
  { id:'P2P-002', title:'Herman Miller Aeron Chair', seller:'Rahul K.', rating:4.9, reviews:28, price:45000, originalPrice:125000, condition:'Good', category:'Furniture', location:'Bangalore', posted:'5h ago', aiVerified:true, image:'🪑' },
  { id:'P2P-003', title:'PS5 Disc Edition + 3 Games', seller:'Amit S.', rating:4.7, reviews:8, price:38000, originalPrice:54990, condition:'Like New', category:'Gaming', location:'Delhi', posted:'1d ago', aiVerified:true, image:'🎮' },
  { id:'P2P-004', title:'Canon EOS R6 Mark II Body', seller:'Sneha P.', rating:5.0, reviews:5, price:155000, originalPrice:240000, condition:'Excellent', category:'Electronics', location:'Hyderabad', posted:'3h ago', aiVerified:false, image:'📷' },
  { id:'P2P-005', title:'Peloton Bike+ (2023)', seller:'Vikram D.', rating:4.6, reviews:3, price:85000, originalPrice:175000, condition:'Good', category:'Fitness', location:'Chennai', posted:'6h ago', aiVerified:true, image:'🚴' },
  { id:'P2P-006', title:'Bose QC Ultra Earbuds', seller:'Ananya R.', rating:4.9, reviews:15, price:18000, originalPrice:32900, condition:'Like New', category:'Electronics', location:'Pune', posted:'4h ago', aiVerified:true, image:'🎵' }
]

export default function P2PResale() {
  const [showForm, setShowForm] = useState(false)
  const [listings, setListings] = useState(initialListings)
  const [toast, setToast] = useState(null)
  const [messageModal, setMessageModal] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [formData, setFormData] = useState({ title:'', price:'', category:'Electronics', condition:'Like New', description:'' })

  const showToastMsg = (message, color='emerald') => {
    setToast({ message, color })
    setTimeout(() => setToast(null), 3000)
  }

  const publishListing = () => {
    if (!formData.title || !formData.price) {
      showToastMsg('Please fill title and price', 'amber')
      return
    }
    const newListing = {
      id: 'P2P-' + Math.floor(100+Math.random()*900),
      title: formData.title,
      seller: 'You',
      rating: 5.0,
      reviews: 0,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.price) * 1.4,
      condition: formData.condition,
      category: formData.category,
      location: 'Your City',
      posted: 'Just now',
      aiVerified: true,
      image: '📦'
    }
    setListings(prev => [newListing, ...prev])
    setShowForm(false)
    setFormData({ title:'', price:'', category:'Electronics', condition:'Like New', description:'' })
    showToastMsg('Listing published! AI verification complete.')
  }

  const buyItem = (listing) => {
    setListings(prev => prev.filter(l => l.id !== listing.id))
    showToastMsg(`Purchase confirmed! ${listing.title} for Rs.${listing.price.toLocaleString('en-IN')}. +30 green credits earned!`)
  }

  const sendMessage = () => {
    if (!messageText.trim()) return
    showToastMsg(`Message sent to ${messageModal.seller}: "${messageText}"`)
    setMessageModal(null)
    setMessageText('')
  }

  return (
    <div className="space-y-6 max-w-7xl relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl ${
          toast.color==='emerald'?'bg-amber-500/20 border-amber-500/30 text-amber-300':'bg-amber-500/20 border-amber-500/30 text-amber-300'
        }`}><CheckCircle size={16}/><span className="text-sm font-medium">{toast.message}</span></div>
      )}

      {/* Message Modal */}
      {messageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 border theme-border rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold theme-text">Message {messageModal.seller}</h3>
              <button onClick={()=>setMessageModal(null)} className="theme-text-secondary hover:theme-text"><X size={18}/></button>
            </div>
            <p className="text-xs theme-text-secondary">About: {messageModal.title}</p>
            <textarea value={messageText} onChange={e=>setMessageText(e.target.value)} placeholder="Hi, I'm interested in this item..." className="w-full theme-input border theme-border rounded-lg px-4 py-3 text-sm theme-text focus:outline-none focus:border-amber-500 h-24 resize-none"/>
            <div className="flex gap-3">
              <button onClick={sendMessage} className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg text-sm">Send Message</button>
              <button onClick={()=>setMessageModal(null)} className="bg-slate-800 hover:bg-slate-700 theme-text px-4 py-2.5 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold theme-text">Peer-to-Peer Resale</h2><p className="text-sm theme-text-secondary mt-1">Buy & sell within Amazon's trusted ecosystem</p></div>
        <button onClick={()=>setShowForm(!showForm)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition text-sm flex items-center gap-2"><Plus size={16}/> Sell an Item</button>
      </div>

      {/* Create listing form */}
      {showForm && (
        <div className="bg-slate-900 border border-amber-500/20 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold theme-text uppercase tracking-wider">Create P2P Listing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs theme-text-secondary font-semibold mb-1.5">Product Title</label><input value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})} className="w-full theme-input border theme-border rounded-lg px-4 py-2.5 text-sm theme-text focus:outline-none focus:border-amber-500" placeholder="e.g., iPhone 14 Pro 256GB"/></div>
            <div><label className="block text-xs theme-text-secondary font-semibold mb-1.5">Asking Price (Rs.)</label><input type="number" value={formData.price} onChange={e=>setFormData({...formData,price:e.target.value})} className="w-full theme-input border theme-border rounded-lg px-4 py-2.5 text-sm text-amber-400 font-mono focus:outline-none focus:border-amber-500" placeholder="50000"/></div>
            <div><label className="block text-xs theme-text-secondary font-semibold mb-1.5">Category</label><select value={formData.category} onChange={e=>setFormData({...formData,category:e.target.value})} className="w-full theme-input border theme-border rounded-lg px-4 py-2.5 text-sm theme-text focus:outline-none focus:border-amber-500"><option>Electronics</option><option>Furniture</option><option>Fashion</option><option>Gaming</option><option>Fitness</option></select></div>
            <div><label className="block text-xs theme-text-secondary font-semibold mb-1.5">Condition</label><select value={formData.condition} onChange={e=>setFormData({...formData,condition:e.target.value})} className="w-full theme-input border theme-border rounded-lg px-4 py-2.5 text-sm theme-text focus:outline-none focus:border-amber-500"><option>Like New</option><option>Excellent</option><option>Good</option><option>Fair</option></select></div>
          </div>
          <div><label className="block text-xs theme-text-secondary font-semibold mb-1.5">Description</label><textarea value={formData.description} onChange={e=>setFormData({...formData,description:e.target.value})} className="w-full theme-input border theme-border rounded-lg px-4 py-2.5 text-sm theme-text focus:outline-none focus:border-amber-500 h-20 resize-none" placeholder="Describe the item..."/></div>
          <div className="flex items-center gap-3 text-xs theme-text-secondary theme-input border theme-border rounded-lg p-3"><Shield size={14} className="text-blue-400 shrink-0"/><span>Your listing will be AI-verified using Amazon Rekognition</span></div>
          <div className="flex gap-3">
            <button onClick={publishListing} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition text-sm">Publish Listing</button>
            <button onClick={()=>setShowForm(false)} className="bg-slate-800 hover:bg-slate-700 theme-text px-6 py-2.5 rounded-xl transition text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Listings grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {listings.map(listing=>(
          <div key={listing.id} className="bg-white dark:bg-slate-900 border theme-border rounded-xl overflow-hidden hover:theme-border card-hover">
            <div className="h-40 theme-input flex items-center justify-center text-5xl border-b theme-border relative">
              {listing.image}
              {listing.aiVerified && (<div className="absolute top-2 left-2 flex items-center gap-1 bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-full"><CheckCircle size={10} className="text-blue-400"/><span className="text-[9px] text-blue-400 font-semibold">AI Verified</span></div>)}
              <span className="absolute top-2 right-2 text-[10px] bg-slate-900 px-2 py-0.5 rounded border theme-border theme-text-secondary font-mono">{listing.id}</span>
            </div>
            <div className="p-4 space-y-3">
              <div><h3 className="text-sm font-bold theme-text leading-tight">{listing.title}</h3><p className="text-xs theme-text-muted mt-1">{listing.category} - {listing.condition}</p></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-[9px] font-bold theme-text">{listing.seller[0]}</div>
                  <div><p className="text-xs theme-text font-medium">{listing.seller}</p><div className="flex items-center gap-1"><Star size={9} className="text-amber-400 fill-amber-400"/><span className="text-[10px] theme-text-secondary">{listing.rating} ({listing.reviews})</span></div></div>
                </div>
                <div className="text-right text-[10px] theme-text-muted"><div className="flex items-center gap-1"><MapPin size={9}/>{listing.location}</div><div className="flex items-center gap-1 mt-0.5"><Clock size={9}/>{listing.posted}</div></div>
              </div>
              <div className="pt-3 border-t theme-border">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-xs theme-text-muted line-through">Rs.{listing.originalPrice.toLocaleString('en-IN')}</p>
                    <p className="text-lg font-bold text-amber-400 font-mono">Rs.{listing.price.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-semibold">{Math.round((1-listing.price/listing.originalPrice)*100)}% off</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>{setMessageModal(listing);setMessageText('')}} className="flex-1 bg-slate-800 hover:bg-slate-700 theme-text font-medium py-2 rounded-lg transition text-xs flex items-center justify-center gap-1"><MessageCircle size={12}/> Message</button>
                  <button onClick={()=>buyItem(listing)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg transition text-xs">Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {listings.length===0 && <div className="text-center py-16 theme-text-muted"><p>No listings yet</p></div>}
    </div>
  )
}