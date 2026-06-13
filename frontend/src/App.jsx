import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ScanReturn from './pages/ScanReturn.jsx'
import Marketplace from './pages/Marketplace.jsx'
import P2PResale from './pages/P2PResale.jsx'
import GreenCredits from './pages/GreenCredits.jsx'
import ReturnPrevention from './pages/ReturnPrevention.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="scan" element={<ScanReturn />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="p2p" element={<P2PResale />} />
        <Route path="credits" element={<GreenCredits />} />
        <Route path="predictions" element={<ReturnPrevention />} />
      </Route>
    </Routes>
  )
}
