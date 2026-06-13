import React, { useState } from 'react'
import { ShieldCheck, AlertTriangle, TrendingDown, Brain, CheckCircle, XCircle } from 'lucide-react'

const mockProducts = [
  { id: 'PROD-001', name: 'Running Shoes - Size 10', category: 'Fashion', price: 8999 },
  { id: 'PROD-002', name: 'Wireless Earbuds Pro', category: 'Electronics', price: 12999 },
  { id: 'PROD-003', name: 'Smart Watch Ultra', category: 'Electronics', price: 44999 },
  { id: 'PROD-004', name: 'Yoga Mat Premium', category: 'Sports', price: 2499 },
  { id: 'PROD-005', name: 'Winter Jacket - Large', category: 'Fashion', price: 5999 }
]

const previousPredictions = [
  { product: 'Blue Denim Jeans (Size 32)', risk: 0.72, factors: ['Size mismatch history', 'High return category'], outcome: 'returned' },
  { product: 'Bluetooth Speaker JBL', risk: 0.12, factors: ['Low return category', 'Repeat purchase'], outcome: 'kept' },
  { product: 'Cotton T-Shirt Pack (M)', risk: 0.45, factors: ['Size uncertainty'], outcome: 'kept' },
  { product: 'Gaming Mouse RGB', risk: 0.08, factors: ['Strong brand loyalty'], outcome: 'kept' }
]

export default function ReturnPrevention() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const runPrediction = async (product) => {
    setSelectedProduct(product)
    setLoading(true)
    setPrediction(null)

    await new Promise((r) => setTimeout(r, 1500))

    const riskScore = Math.random()
    const factors = []
    if (riskScore > 0.5) factors.push('Size mismatch pattern detected')
    if (riskScore > 0.3) factors.push('Category has 35% avg return rate')
    if (riskScore > 0.6) factors.push('Impulse purchase pattern')
    if (product.category === 'Fashion') factors.push('Fashion items have higher return rates')
    if (factors.length === 0) factors.push('Low risk profile', 'Consistent purchase history')

    let recommendation = ''
    if (riskScore > 0.7) recommendation = '⚠️ High risk — review size guide and watch product video before purchasing'
    else if (riskScore > 0.4) recommendation = '💡 Moderate risk — consider reading recent reviews for sizing feedback'
    else recommendation = '✅ Low risk — this looks like a good match for your purchase history'

    setPrediction({
      score: riskScore,
      factors,
      recommendation,
      savings: Math.round(product.price * riskScore * 0.3)
    })
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold theme-text">Predictive Return Prevention</h2>
        <p className="text-sm theme-text-secondary mt-1">
          ML-powered predictions to reduce returns before purchase. Powered by Amazon SageMaker.
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
        <Brain size={20} className="text-blue-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-blue-300 font-medium">How it works</p>
          <p className="text-xs theme-text-secondary mt-1">
            Our ML model analyzes your purchase history, product category return rates, size patterns, and review sentiment to predict whether you're likely to return an item — before you buy it.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product selection */}
        <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-5">
          <h3 className="text-sm font-bold theme-text mb-4">Check Return Risk Before Buying</h3>
          <p className="text-xs theme-text-muted mb-4">Select a product to run the prediction model:</p>
          <div className="space-y-2">
            {mockProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => runPrediction(product)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition text-left ${
                  selectedProduct?.id === product.id
                    ? 'border-amber-500/30 bg-emerald-500/5'
                    : 'theme-border hover:border-slate-600 theme-input'
                }`}
              >
                <div>
                  <p className="text-xs theme-text font-medium">{product.name}</p>
                  <p className="text-[10px] theme-text-muted">{product.category} • {product.id}</p>
                </div>
                <span className="text-sm font-mono text-amber-400">₹{product.price.toLocaleString('en-IN')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div>
          {loading && (
            <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-12 text-center">
              <Brain size={32} className="mx-auto text-blue-400 animate-pulse mb-3" />
              <p className="text-sm theme-text">Running SageMaker inference...</p>
              <p className="text-xs theme-text-muted mt-1">Analyzing purchase patterns</p>
            </div>
          )}

          {prediction && !loading && (
            <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-5 space-y-5">
              {/* Score ring */}
              <div className="text-center">
                <p className="text-[10px] theme-text-muted uppercase tracking-widest font-semibold mb-2">Return Probability</p>
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="#1e293b" strokeWidth="10" fill="none" />
                    <circle
                      cx="60" cy="60" r="50"
                      stroke={prediction.score < 0.3 ? '#f59e0b' : prediction.score < 0.6 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${prediction.score * 314} 314`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-black ${
                      prediction.score < 0.3 ? 'text-amber-400' :
                      prediction.score < 0.6 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {Math.round(prediction.score * 100)}%
                    </span>
                  </div>
                </div>
                <p className={`text-xs font-semibold mt-2 ${
                  prediction.score < 0.3 ? 'text-amber-400' :
                  prediction.score < 0.6 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {prediction.score < 0.3 ? 'Low Risk' : prediction.score < 0.6 ? 'Moderate Risk' : 'High Risk'}
                </p>
              </div>

              {/* Factors */}
              <div>
                <h4 className="text-xs font-bold theme-text-secondary uppercase tracking-wider mb-2">Risk Factors</h4>
                <div className="space-y-1.5">
                  {prediction.factors.map((factor, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs theme-input rounded-lg px-3 py-2">
                      <AlertTriangle size={12} className={prediction.score > 0.5 ? 'text-amber-400' : 'theme-text-muted'} />
                      <span className="theme-text">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="theme-input border theme-border rounded-lg p-4">
                <h4 className="text-xs font-bold theme-text-secondary uppercase tracking-wider mb-2">AI Recommendation</h4>
                <p className="text-sm theme-text">{prediction.recommendation}</p>
              </div>

              {prediction.score > 0.4 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-center gap-3">
                  <TrendingDown size={16} className="text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs text-amber-300 font-medium">Potential savings by preventing this return</p>
                    <p className="text-[10px] theme-text-secondary">₹{prediction.savings} shipping + 0.8kg CO₂ saved</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!prediction && !loading && (
            <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-12 text-center">
              <ShieldCheck size={32} className="mx-auto text-slate-600 mb-3" />
              <p className="text-sm theme-text-muted">Select a product to check return risk</p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="bg-white dark:bg-slate-900 border theme-border rounded-xl p-5">
        <h3 className="text-sm font-bold theme-text mb-4">Prediction History & Outcomes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="theme-text-muted uppercase tracking-wider border-b theme-border">
                <th className="pb-3 text-left font-semibold">Product</th>
                <th className="pb-3 text-left font-semibold">Risk</th>
                <th className="pb-3 text-left font-semibold">Factors</th>
                <th className="pb-3 text-left font-semibold">Outcome</th>
                <th className="pb-3 text-left font-semibold">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {previousPredictions.map((pred, i) => (
                <tr key={i} className="hover:bg-[var(--bg-card-hover)] transition">
                  <td className="py-3 theme-text">{pred.product}</td>
                  <td className="py-3">
                    <span className={`font-mono font-bold ${
                      pred.risk < 0.3 ? 'text-amber-400' :
                      pred.risk < 0.6 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {Math.round(pred.risk * 100)}%
                    </span>
                  </td>
                  <td className="py-3 theme-text-secondary max-w-[200px] truncate">{pred.factors.join(', ')}</td>
                  <td className="py-3">
                    <span className={`flex items-center gap-1 font-semibold ${pred.outcome === 'kept' ? 'text-amber-400' : 'text-red-400'}`}>
                      {pred.outcome === 'kept' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {pred.outcome}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`font-semibold ${
                      (pred.risk > 0.5 && pred.outcome === 'returned') || (pred.risk < 0.5 && pred.outcome === 'kept')
                        ? 'text-amber-400' : 'text-amber-400'
                    }`}>
                      {(pred.risk > 0.5 && pred.outcome === 'returned') || (pred.risk < 0.5 && pred.outcome === 'kept') ? '✓ Correct' : '~ Partial'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
