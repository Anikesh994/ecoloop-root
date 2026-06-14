# 🌿 EcoLoop AI — Intelligent Circular Commerce Platform

> **HackOn with Amazon** | Every product deserves a meaningful second life.

EcoLoop AI is an AWS-native platform that transforms returned or unused products into opportunities — using AI to grade, route, and resell items while rewarding customers for sustainable choices.

---

## 🚀 Problem Statement

Millions of products bought online are returned, underused, or discarded despite being perfectly usable. Returns cost $816B globally and generate 9.6B pounds of landfill waste annually. EcoLoop creates an intelligent ecosystem where every returned product automatically finds its next best owner.

---

## ✨ Features (6 Pillars)

| # | Pillar | Description |
|---|--------|-------------|
| 1 | **AI Routing Engine** | Automatically decides: resell, refurbish, donate, or recycle |
| 2 | **Smart Quality Grading** | Image-based AI condition assessment (Amazon Rekognition) |
| 3 | **Certified Marketplace** | Browse & buy AI-verified refurbished products |
| 4 | **Green Credits System** | Earn sustainability points, redeem for discounts, leaderboard |
| 5 | **Peer-to-Peer Resale** | Sell directly within Amazon's trusted ecosystem |
| 6 | **Return Prevention** | ML predictions before purchase to reduce returns (SageMaker) |

---

## 🏗️ Architecture

```
Frontend (React + Vite)  →  CloudFront + S3
         ↓ HTTPS
ALB + WAF  →  ECS Fargate (FastAPI)
         ↓
┌─────────────────────────────────────────────┐
│  RDS PostgreSQL  │  ElastiCache  │  SQS     │
│  (Multi-AZ)      │  (Redis)      │  +Lambda │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│  S3 (Images)  │  Rekognition  │  SageMaker  │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons |
| Backend | FastAPI (Python), SQLAlchemy 2.0 (async), Pydantic v2 |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (python-jose) + bcrypt |
| AI/CV | Amazon Rekognition (simulated for demo) |
| ML | Amazon SageMaker (simulated for demo) |
| Infra | Docker, ECS Fargate, ALB, S3, SQS, Lambda |

---

## 📁 Project Structure

```
ecoloop-root/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment config
│   └── app/
│       ├── config.py           # Settings (JWT, DB URL)
│       ├── database.py         # SQLAlchemy async engine
│       ├── security.py         # JWT + bcrypt auth
│       ├── models/
│       │   └── models.py       # 7 ORM models
│       ├── routers/
│       │   ├── auth.py         # Register/Login/Me
│       │   ├── returns.py      # AI grading pipeline
│       │   ├── marketplace.py  # Browse/Buy/Waitlist
│       │   ├── p2p.py          # P2P CRUD
│       │   ├── credits.py      # Green credits ledger
│       │   ├── analytics.py    # Dashboard KPIs
│       │   └── predictions.py  # Return risk scoring
│       └── services/
│           └── ai_service.py   # Rekognition + SageMaker simulation
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/
│       │   └── client.js       # Axios API client
│       ├── components/
│       │   └── Layout.jsx      # App shell (sidebar + header)
│       └── pages/
│           ├── Dashboard.jsx
│           ├── ScanReturn.jsx
│           ├── Marketplace.jsx
│           ├── P2PResale.jsx
│           ├── GreenCredits.jsx
│           ├── ReturnPrevention.jsx
│           └── Login.jsx
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:3000

### Usage Flow

1. Open http://localhost:3000/login
2. Register a new account
3. Navigate to **AI Scanner** → upload product image → get AI grade
4. Click **List on Marketplace** → item appears in marketplace
5. Browse **Marketplace** → add to cart
6. Check **Green Credits** → see earned credits, redeem
7. Try **P2P Resale** → create a listing, buy items
8. Try **Return Prevention** → check risk score before buying

---

## 🔌 API Endpoints (28 routes)

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /api/v1/auth/register`, `/login`, `GET /me` |
| Returns | `POST /api/v1/returns/`, `GET /`, `GET /{id}` |
| Marketplace | `GET /api/v1/marketplace/`, `POST /purchase`, `POST /waitlist` |
| P2P | `POST /api/v1/p2p/listings`, `GET /`, `POST /{id}/buy`, `DELETE /{id}` |
| Credits | `GET /balance`, `/history`, `/leaderboard`, `POST /redeem` |
| Predictions | `POST /api/v1/predictions/check`, `GET /history` |
| Analytics | `GET /api/v1/analytics/summary`, `/environmental` |

---

## 🌍 Scaling Strategy

| Concern | Solution |
|---------|----------|
| API Compute | ECS Fargate auto-scaling (2→50 tasks) |
| Database | RDS Multi-AZ + read replicas + PgBouncer |
| AI Processing | SQS + Lambda (serverless, pay-per-item) |
| Caching | ElastiCache Redis (80% read reduction) |
| Images | S3 + CloudFront CDN (400+ edge locations) |
| Frontend | S3 static hosting + CloudFront |
| Security | WAF + Shield + JWT + bcrypt + TLS 1.3 |

---

## 🎯 Key Algorithms

1. **Multi-Factor Grading** — Rekognition label detection → weighted damage score → grade assignment (A/B/C/D)
2. **Routing Decision Matrix** — Grade + category + demand signals → optimal routing (resell/refurbish/donate/recycle)
3. **Return Risk Prediction** — User history + category rates + price sensitivity → calibrated return probability

---

## 📊 Impact Metrics (Projected at Scale)

- 5M items diverted from landfill/year
- $50M+ value recovered from returns
- 2,000+ tons CO₂ prevented
- 25% reduction in return rates via predictions
- 1M+ users earning green credits

---

## 🏆 HackOn with Amazon

Built for the **HackOn with Amazon** hackathon — demonstrating how AI and AWS services can transform reverse logistics into a sustainable, profitable circular economy engine.

**AWS Services Used:** ECS Fargate, RDS, ElastiCache, S3, CloudFront, SQS, Lambda, Rekognition, SageMaker, SES, WAF, Secrets Manager, CloudWatch, X-Ray

---

## 📄 License

MIT License — Built with ❤️ for sustainable commerce.
