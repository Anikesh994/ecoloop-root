# Design: EcoLoop — Intelligent Circular Commerce Platform (AWS-Native)

## Problem Statement

Millions of products bought online are returned, underused, or discarded despite being perfectly usable. Returns are expensive for customers, sellers, and the planet. EcoLoop creates an intelligent ecosystem where returned or unused products automatically find their next best owner through AI-powered routing, quality grading, personalized recommendations, sustainable incentives, peer-to-peer resale, and predictive return prevention.

---

## Platform Pillars

| # | Pillar | Description |
|---|--------|-------------|
| 1 | AI Routing Engine | Automatically decides: resell, refurbish, donate, recycle, or exchange |
| 2 | Smart Quality Grading | Image/video-based AI condition assessment |
| 3 | Personalized Recommendations | Certified refurbished product suggestions per user |
| 4 | Green Credits & Incentives | Sustainability rewards for circular participation |
| 5 | Peer-to-Peer Resale | Trusted marketplace within the Amazon ecosystem |
| 6 | Predictive Return Prevention | ML-powered predictions before purchase to reduce returns |

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                  FRONTEND (React + Vite → S3 + CloudFront)                         │
│  ┌──────────┐ ┌───────────┐ ┌────────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │Dashboard │ │AI Scanner │ │Marketplace │ │P2P Resale│ │Return Prevention  │   │
│  └──────────┘ └───────────┘ └────────────┘ └──────────┘ └───────────────────┘   │
└────────────────────────────────┬─────────────────────────────────────────────────┘
                                 │ HTTPS
┌────────────────────────────────▼─────────────────────────────────────────────────┐
│           CloudFront → ALB → WAF (Rate Limit + SQL/XSS Filtering)                 │
└────────────────────────────────┬─────────────────────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────────────────────┐
│                    ECS FARGATE (Auto-Scaling API Cluster)                          │
│                                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                         FastAPI Application                                  │  │
│  │                                                                              │  │
│  │  ROUTERS:                                                                    │  │
│  │  ┌──────┐ ┌────────┐ ┌───────────┐ ┌──────┐ ┌──────────┐ ┌─────────────┐  │  │
│  │  │ Auth │ │Returns │ │Marketplace│ │ P2P  │ │Analytics │ │Predictions  │  │  │
│  │  └──────┘ └────────┘ └───────────┘ └──────┘ └──────────┘ └─────────────┘  │  │
│  │                                                                              │  │
│  │  SERVICES:                                                                   │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐   │  │
│  │  │ AI Routing   │ │ Grading Svc  │ │ Credits Svc  │ │ Recommendation   │   │  │
│  │  │ Engine       │ │ (Rekognition)│ │ (Ledger)     │ │ Engine           │   │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────────┘   │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────────────┐    │  │
│  │  │ P2P Resale   │ │ Notification │ │ Return Prevention (ML Predict)   │    │  │
│  │  │ Service      │ │ Service      │ │                                  │    │  │
│  │  └──────────────┘ └──────────────┘ └──────────────────────────────────┘    │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
└───────────┬──────────────────┬──────────────────┬────────────────────────────────┘
            │                  │                  │
            ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────────┐  ┌──────────────────────────────────┐
│  Amazon RDS   │  │ Amazon ElastiCache│  │     Async Processing Layer       │
│  PostgreSQL   │  │ (Redis 7)         │  │                                  │
│  Multi-AZ     │  │ - API cache       │  │  SQS Queues:                     │
│               │  │ - Session store   │  │  ├── grading-queue               │
│               │  │ - Recommendations │  │  ├── routing-queue               │
│               │  │   cache           │  │  ├── notification-queue          │
│               │  │ - Green credits   │  │  └── prediction-queue            │
│               │  │   leaderboard     │  │                                  │
└───────────────┘  └───────────────────┘  │  Lambda Workers:                 │
                                           │  ├── GradeProcessor             │
                                           │  ├── RoutingDecisionEngine      │
                                           │  ├── NotificationDispatcher     │
                                           │  └── ReturnRiskScorer           │
                                           └──────────────────────────────────┘
                                                        │
                              ┌──────────────────────────┼───────────────────┐
                              ▼                          ▼                   ▼
                   ┌──────────────────┐     ┌────────────────┐   ┌──────────────┐
                   │ Amazon S3        │     │ Amazon SES     │   │ Amazon       │
                   │ - Product images │     │ - Alerts       │   │ Rekognition  │
                   │ - Video uploads  │     │ - Receipts     │   │ + SageMaker  │
                   │ - ML model data  │     │ - Green credit │   │ (Custom CV)  │
                   └──────────────────┘     │   reports      │   └──────────────┘
                                            └────────────────┘
```

---

## 1. AWS Services Map

| Concern | AWS Service | Purpose |
|---------|-------------|---------|
| Compute | ECS Fargate | Serverless container orchestration, auto-scaling API |
| Database | RDS PostgreSQL 16 (Multi-AZ) | Relational data, ACID, automatic failover |
| Cache | ElastiCache Redis 7 | API cache, leaderboard, recommendations cache |
| Object Storage | S3 | Product images, video uploads, ML artifacts |
| CDN | CloudFront | Global frontend delivery + image optimization |
| Load Balancer | ALB | Health checks, SSL termination, path routing |
| Message Queue | SQS (FIFO + Standard) | Decoupled async: grading, routing, notifications |
| Serverless Workers | Lambda | Process queues: AI grading, routing decisions, email |
| AI - Vision | Rekognition | Product condition detection (scratches, dents, damage) |
| AI - ML | SageMaker (Endpoint) | Return probability prediction model |
| AI - Personalization | Personalize | Refurbished product recommendations |
| Email | SES | Transactional notifications, green credit reports |
| Secrets | Secrets Manager | DB creds, JWT secrets, API keys (auto-rotation) |
| DNS | Route 53 | Domain + health-checked failover routing |
| Security | WAF + Shield Standard | DDoS, rate limiting, injection protection |
| Monitoring | CloudWatch + X-Ray | Logs, metrics, distributed tracing, alarms |
| CI/CD | CodePipeline + CodeBuild + ECR | Automated Docker builds + rolling deploys |
| Auth | Cognito (optional) / Custom JWT | User pool management |

---

## 2. Backend Architecture

### 2.1 Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                     # App factory + lifespan (startup/shutdown)
│   ├── config.py                   # Pydantic Settings (Secrets Manager / env)
│   ├── database.py                 # SQLAlchemy async engine + session factory
│   ├── models/                     # ORM Models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── return_item.py
│   │   ├── waitlist.py
│   │   ├── order.py
│   │   ├── p2p_listing.py
│   │   ├── green_credit.py
│   │   └── return_prediction.py
│   ├── schemas/                    # Pydantic v2 request/response
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── returns.py
│   │   ├── marketplace.py
│   │   ├── p2p.py
│   │   ├── credits.py
│   │   └── predictions.py
│   ├── routers/                    # API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── returns.py
│   │   ├── marketplace.py
│   │   ├── p2p.py
│   │   ├── credits.py
│   │   ├── analytics.py
│   │   └── predictions.py
│   ├── services/                   # Business logic
│   │   ├── __init__.py
│   │   ├── ai_routing_service.py       # Route decision: resell/refurbish/donate/recycle
│   │   ├── grading_service.py          # Rekognition-based condition grading
│   │   ├── return_service.py           # Return intake orchestration
│   │   ├── marketplace_service.py      # Browse, purchase, waitlist
│   │   ├── p2p_service.py             # Peer-to-peer listing + transactions
│   │   ├── credits_service.py         # Green credits ledger + rewards
│   │   ├── recommendation_service.py  # Personalized refurb suggestions
│   │   ├── prediction_service.py      # Return probability scoring
│   │   ├── notification_service.py    # SES dispatch
│   │   └── storage_service.py         # S3 upload, presigned URLs
│   ├── workers/                    # Lambda handler code (deployed separately)
│   │   ├── __init__.py
│   │   ├── grade_processor.py      # SQS → Rekognition → grade assignment
│   │   ├── routing_engine.py       # SQS → AI routing decision
│   │   ├── notification_sender.py  # SQS → SES email
│   │   └── return_risk_scorer.py   # SQS → SageMaker inference
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── rate_limiter.py
│   │   ├── request_id.py
│   │   └── logging_middleware.py
│   └── utils/
│       ├── __init__.py
│       ├── security.py             # JWT encode/decode + bcrypt
│       ├── pagination.py           # Cursor + offset pagination
│       └── aws_clients.py          # Boto3 client factory (session-cached)
├── alembic/
│   ├── env.py
│   └── versions/
├── alembic.ini
├── tests/
│   ├── conftest.py
│   ├── test_returns.py
│   ├── test_marketplace.py
│   ├── test_p2p.py
│   ├── test_credits.py
│   ├── test_predictions.py
│   └── test_auth.py
├── Dockerfile
├── requirements.txt
├── .env.example
└── buildspec.yml
```

### 2.2 Database Schema

```sql
-- ==================== USERS ====================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'buyer',  -- buyer | seller | admin
    green_credits_balance INTEGER DEFAULT 0,
    trust_score DECIMAL(3,2) DEFAULT 1.00,  -- 0.00 - 1.00
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== RETURN ITEMS ====================
CREATE TABLE return_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_id VARCHAR(50) UNIQUE NOT NULL,
    seller_id UUID REFERENCES users(id),
    product_name VARCHAR(255),
    category VARCHAR(100),
    original_price DECIMAL(10,2) NOT NULL,
    suggested_price DECIMAL(10,2),
    assigned_grade VARCHAR(50),         -- Grade A / B / C / D
    routing_decision VARCHAR(50),       -- RESELL | REFURBISH | DONATE | RECYCLE | EXCHANGE
    green_credits_earned INTEGER DEFAULT 0,
    image_keys TEXT[],                  -- S3 keys (multiple images)
    video_key VARCHAR(500),             -- S3 key for video
    vision_data JSONB,                  -- Rekognition raw response
    damage_score DECIMAL(3,2),          -- 0.00 - 1.00
    status VARCHAR(20) DEFAULT 'processing',
    -- processing | grading | routed | available | sold | donated | recycled | archived
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== WAITLIST ====================
CREATE TABLE waitlist_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES users(id),
    buyer_email VARCHAR(255) NOT NULL,
    requested_grade VARCHAR(50),
    requested_category VARCHAR(100),
    max_price DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'waiting',  -- waiting | notified | fulfilled | expired
    created_at TIMESTAMPTZ DEFAULT NOW(),
    notified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- ==================== P2P LISTINGS ====================
CREATE TABLE p2p_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    asking_price DECIMAL(10,2) NOT NULL,
    condition_grade VARCHAR(50),
    image_keys TEXT[],
    ai_verified BOOLEAN DEFAULT FALSE,
    verification_data JSONB,
    status VARCHAR(20) DEFAULT 'active',  -- active | sold | expired | flagged
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ORDERS ====================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES users(id),
    item_id UUID,                       -- return_items.id or p2p_listings.id
    item_type VARCHAR(20) NOT NULL,     -- 'return' | 'p2p'
    purchase_price DECIMAL(10,2) NOT NULL,
    credits_applied INTEGER DEFAULT 0,
    final_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== GREEN CREDITS LEDGER ====================
CREATE TABLE green_credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    amount INTEGER NOT NULL,            -- positive = earned, negative = spent
    reason VARCHAR(100) NOT NULL,
    -- RETURN_SUBMITTED | PURCHASE_REFURB | P2P_SALE | DONATION | RECYCLED | REDEEMED
    reference_id UUID,                  -- related item/order ID
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== RETURN PREDICTIONS ====================
CREATE TABLE return_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    product_id VARCHAR(100),            -- External product catalog ID
    category VARCHAR(100),
    predicted_return_probability DECIMAL(4,3),  -- 0.000 - 1.000
    risk_factors JSONB,                 -- ["size_mismatch", "high_return_category", ...]
    recommendation TEXT,                -- "Consider size guide" / "Watch video review"
    shown_at TIMESTAMPTZ,
    outcome VARCHAR(20),                -- purchased | abandoned | returned | kept
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEXES ====================
CREATE INDEX idx_return_items_status ON return_items(status);
CREATE INDEX idx_return_items_grade ON return_items(assigned_grade);
CREATE INDEX idx_return_items_routing ON return_items(routing_decision);
CREATE INDEX idx_return_items_category ON return_items(category);
CREATE INDEX idx_return_items_created ON return_items(created_at DESC);
CREATE INDEX idx_waitlist_grade_status ON waitlist_entries(requested_grade, status);
CREATE INDEX idx_waitlist_category ON waitlist_entries(requested_category, status);
CREATE INDEX idx_p2p_status_category ON p2p_listings(status, category);
CREATE INDEX idx_p2p_seller ON p2p_listings(seller_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_credits_user ON green_credit_transactions(user_id);
CREATE INDEX idx_predictions_user ON return_predictions(user_id);
CREATE INDEX idx_predictions_product ON return_predictions(product_id);
```

### 2.3 API Design

```
Auth:
  POST   /api/v1/auth/register              # Create account
  POST   /api/v1/auth/login                 # JWT access + refresh tokens
  POST   /api/v1/auth/refresh               # Refresh access token
  GET    /api/v1/auth/me                    # Profile + credit balance

Returns (Pillar 1 + 2):
  POST   /api/v1/returns/                   # Upload images/video → S3, queue AI grading
  GET    /api/v1/returns/{id}               # Return details + grade + routing decision
  GET    /api/v1/returns/                   # My returns (paginated, filtered)
  GET    /api/v1/returns/{id}/grading       # Detailed AI grading breakdown

Marketplace (Pillar 3):
  GET    /api/v1/marketplace/               # Browse certified items (paginated, filters)
  GET    /api/v1/marketplace/recommended    # Personalized recommendations
  POST   /api/v1/marketplace/purchase       # Buy item (supports green credit redemption)
  POST   /api/v1/marketplace/waitlist       # Join grade/category waitlist
  GET    /api/v1/marketplace/waitlist       # My waitlist entries
  DELETE /api/v1/marketplace/waitlist/{id}  # Cancel waitlist

P2P Resale (Pillar 5):
  POST   /api/v1/p2p/listings              # Create P2P listing (auto AI verification)
  GET    /api/v1/p2p/listings              # Browse P2P marketplace
  GET    /api/v1/p2p/listings/{id}         # Listing detail
  PATCH  /api/v1/p2p/listings/{id}         # Update listing
  DELETE /api/v1/p2p/listings/{id}         # Remove listing
  POST   /api/v1/p2p/listings/{id}/buy     # Purchase P2P item

Green Credits (Pillar 4):
  GET    /api/v1/credits/balance            # Current balance
  GET    /api/v1/credits/history            # Transaction history (paginated)
  GET    /api/v1/credits/leaderboard        # Top green contributors
  POST   /api/v1/credits/redeem             # Apply credits to purchase discount

Predictions (Pillar 6):
  POST   /api/v1/predictions/check          # Pre-purchase return risk score
  GET    /api/v1/predictions/history        # Past predictions + outcomes

Analytics:
  GET    /api/v1/analytics/summary          # Platform KPIs
  GET    /api/v1/analytics/environmental    # CO2 saved, items diverted from landfill
  GET    /api/v1/analytics/trends           # Time-series data
```

### 2.4 AI Routing Engine (Pillar 1)

The core intelligence — decides what happens to each returned item:

```
Input: Grading results + item metadata + market demand signals

Decision Matrix:
┌─────────────────┬────────────────────────────────────────────────────┐
│ Condition       │ Routing Decision                                    │
├─────────────────┼────────────────────────────────────────────────────┤
│ Grade A (95%+)  │ RESELL as "Like New" on marketplace               │
│ Grade B (80%+)  │ RESELL as "Refurbished" with discount             │
│ Grade C (60%+)  │ REFURBISH → send to repair → then resell          │
│ Grade D (40%+)  │ DONATE to registered charities                     │
│ Grade F (<40%)  │ RECYCLE → extract materials                        │
│ Any + Match     │ EXCHANGE → direct swap with P2P buyer match        │
└─────────────────┴────────────────────────────────────────────────────┘

Factors weighted:
  - Damage score (from Rekognition)
  - Category repair feasibility
  - Current marketplace demand (waitlist depth)
  - Environmental impact score
  - Resale value vs refurbishment cost
```

### 2.5 Smart Quality Grading Flow (Pillar 2)

```
1. User uploads images (+ optional video) via POST /api/v1/returns/
2. Backend stores media in S3, creates DB record (status: processing)
3. Sends message to SQS grading-queue
4. Lambda GradeProcessor:
   a. Calls Rekognition DetectLabels + DetectCustomLabels
   b. Identifies: scratches, dents, cracks, discoloration, missing parts
   c. Computes damage_score (0.0 = pristine, 1.0 = destroyed)
   d. Assigns grade: A/B/C/D/F based on thresholds
   e. Updates DB record
   f. Sends message to routing-queue
5. Lambda RoutingDecisionEngine:
   a. Reads grade + category + demand signals
   b. Applies routing decision matrix
   c. Calculates suggested_price + green_credits
   d. Updates DB record (status: available/routed)
   e. Cross-matches waitlist → sends to notification-queue if match
6. Lambda NotificationDispatcher:
   a. Sends SES email to matched buyers
   b. Updates waitlist entries
```

### 2.6 Green Credits System (Pillar 4)

```
Earning Credits:
  - Submit a return for circular routing: +50 credits
  - Item successfully resold (seller): +100 credits
  - Purchase refurbished item: +30 credits
  - P2P sale completed: +75 credits
  - Item donated: +150 credits
  - Item recycled: +25 credits

Spending Credits:
  - Redeem as purchase discount: 100 credits = ₹50 off
  - Priority waitlist access: 200 credits
  - Boost P2P listing visibility: 50 credits

Leaderboard:
  - Redis sorted set for real-time ranking
  - Monthly/all-time views
  - Badges: "Eco Warrior", "Circular Champion", etc.
```

### 2.7 Return Prevention (Pillar 6)

```
Pre-purchase prediction via SageMaker endpoint:

Features:
  - User's historical return rate
  - Product category return rate
  - Size/color selection patterns
  - Review sentiment for the product
  - Time-of-year seasonality
  - Price sensitivity indicators

Output:
  - return_probability: 0.0 - 1.0
  - risk_factors: ["size_mismatch", "impulse_buy_pattern", ...]
  - recommendation: "Check size guide" / "Watch video review first"

Integration:
  - Called at product page view / add-to-cart
  - Displayed as gentle nudge (not blocking)
  - Tracked for model improvement (outcome: kept vs returned)
```

---

## 3. Frontend Architecture

### 3.1 Technology Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Framework | React 18 + Vite | Fast builds, component model, ecosystem |
| Styling | Tailwind CSS 3 | Already used, utility-first, production purge |
| State | Zustand | Lightweight global state |
| Server state | TanStack Query v5 | Cache, retry, optimistic updates, pagination |
| HTTP | Axios | Auth interceptors, request/response transforms |
| Routing | React Router v6 | Nested layouts, protected routes |
| Forms | React Hook Form + Zod | Type-safe validation |
| Charts | Recharts | Analytics + environmental impact visualizations |
| File upload | react-dropzone | Multi-image + video drag-and-drop |
| Notifications | react-hot-toast | Real-time alerts |

### 3.2 Page Structure

```
frontend/src/pages/
├── Dashboard.jsx           # KPI overview, environmental impact, recent activity
├── ScanReturn.jsx          # Upload images/video → AI grading flow (animated)
├── ReturnDetail.jsx        # Grade breakdown, routing decision, credits earned
├── Marketplace.jsx         # Browse certified refurbished items + filters
├── Recommendations.jsx     # Personalized "For You" refurbished picks
├── P2PMarketplace.jsx      # Peer-to-peer listings browse
├── CreateP2PListing.jsx    # Sell your item (with AI verification)
├── GreenCredits.jsx        # Balance, history, leaderboard, redeem
├── ReturnPrevention.jsx    # Pre-purchase risk check widget/page
├── Orders.jsx              # Purchase history
├── Waitlist.jsx            # Active waitlist subscriptions
├── Login.jsx               # Auth
└── Register.jsx            # Onboarding
```

### 3.3 Key UI Components

```
components/
├── Layout/
│   ├── AppShell.jsx            # Sidebar + header + main content
│   ├── Sidebar.jsx             # Navigation with credit badge
│   └── Header.jsx              # Search, notifications, profile
├── Cards/
│   ├── ProductCard.jsx         # Marketplace item card
│   ├── P2PListingCard.jsx      # Peer listing card
│   ├── GradeCard.jsx           # AI grade result display
│   └── StatsCard.jsx           # KPI metric card
├── AI/
│   ├── GradingProgress.jsx     # Animated grading pipeline UI
│   ├── RoutingDecision.jsx     # Visual routing result
│   └── ReturnRiskBadge.jsx     # Risk score indicator
├── Credits/
│   ├── CreditBalance.jsx       # Animated counter
│   ├── Leaderboard.jsx         # Top contributors table
│   └── RedeemModal.jsx         # Credit redemption flow
└── Shared/
    ├── Pagination.jsx
    ├── Filters.jsx
    ├── EmptyState.jsx
    └── LoadingSpinner.jsx
```

---

## 4. Infrastructure & Deployment

### 4.1 Docker Compose (Local Development with LocalStack)
```yaml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    depends_on: [db, redis, localstack]
    environment:
      - DATABASE_URL=postgresql+asyncpg://ecoloop:ecoloop@db:5432/ecoloop
      - REDIS_URL=redis://redis:6379/0
      - AWS_ENDPOINT_URL=http://localstack:4566
      - AWS_DEFAULT_REGION=ap-south-1
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
      - S3_BUCKET=ecoloop-media
      - SQS_GRADING_QUEUE=grading-queue
      - SQS_ROUTING_QUEUE=routing-queue
      - SQS_NOTIFICATION_QUEUE=notification-queue
      - ENVIRONMENT=development

  frontend:
    build: ./frontend
    ports: ["3000:80"]
    depends_on: [backend]

  db:
    image: postgres:16-alpine
    volumes: [pgdata:/var/lib/postgresql/data]
    environment:
      POSTGRES_DB: ecoloop
      POSTGRES_USER: ecoloop
      POSTGRES_PASSWORD: ecoloop
    ports: ["5432:5432"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  localstack:
    image: localstack/localstack:latest
    ports: ["4566:4566"]
    environment:
      - SERVICES=s3,sqs,ses,secretsmanager
      - DEFAULT_REGION=ap-south-1
    volumes:
      - "./infra/localstack-init.sh:/etc/localstack/init/ready.d/init.sh"

volumes:
  pgdata:
```

### 4.2 AWS Production Deployment

```
Region: ap-south-1 (Mumbai)

VPC (10.0.0.0/16):
├── Public Subnets (2 AZs: ap-south-1a, ap-south-1b)
│   ├── ALB (internet-facing)
│   ├── NAT Gateway (for private subnet outbound)
│   └── Bastion host (SSH jump, optional)
├── Private Subnets (2 AZs)
│   ├── ECS Fargate Tasks (backend API)
│   ├── Lambda Functions (workers)
│   ├── RDS PostgreSQL (Multi-AZ, encrypted)
│   └── ElastiCache Redis (cluster mode disabled, 2 nodes)

ECS Service:
  - Task: 0.5 vCPU, 1 GB RAM (scalable)
  - Min: 2 tasks, Max: 20 tasks
  - Scaling: CPU > 60% OR request count > 1000/min
  - Rolling deployment (min healthy 50%)

Lambda Functions:
  - GradeProcessor: 512 MB, 60s timeout, triggered by SQS
  - RoutingEngine: 256 MB, 30s timeout, triggered by SQS
  - NotificationSender: 128 MB, 10s timeout, triggered by SQS
  - ReturnRiskScorer: 512 MB, 15s timeout, triggered by API Gateway

CI/CD (CodePipeline):
  Source → CodeBuild (Docker) → ECR → ECS Deploy
  Source → CodeBuild (npm) → S3 Sync → CloudFront Invalidation
```

### 4.3 Scalability Strategy

| Concern | Solution | Scale Target |
|---------|----------|--------------|
| API compute | ECS Fargate auto-scaling | 2→20 tasks, 10K req/min |
| Database reads | ElastiCache + RDS read replicas | 50K reads/min cached |
| Database writes | RDS Multi-AZ, connection pooling | 5K writes/min |
| Background jobs | SQS + Lambda (auto-scale to demand) | 1000 concurrent |
| Image processing | Lambda + Rekognition (auto-scale) | Burst to 500/min |
| File uploads | S3 (unlimited) + presigned URLs | No bottleneck |
| Frontend | CloudFront (global edge) | Millions of users |
| Notifications | SES (auto-scale) | 50K emails/day |

---

## 5. Security

| Layer | Implementation |
|-------|---------------|
| Network | VPC private subnets, security groups (least privilege), NACLs |
| Edge | WAF (rate limit 1000 req/5min/IP, SQL injection, XSS rules) |
| DDoS | AWS Shield Standard (free, automatic) |
| Transport | TLS 1.3 everywhere (CloudFront → ALB → ECS, internal) |
| Auth | JWT access (15 min) + refresh (7 days), bcrypt(12) |
| Secrets | Secrets Manager with auto-rotation (DB, JWT key) |
| Data at rest | RDS encryption (KMS), S3 SSE-S3, ElastiCache encryption |
| Input | Pydantic validation, file type verification, size limits |
| CORS | Locked to CloudFront domain only |
| IAM | Per-service task roles (ECS, Lambda), no wildcard policies |
| Audit | CloudTrail for all API calls, S3 access logs |

---

## 6. Observability

| Concern | Implementation |
|---------|---------------|
| Structured logs | CloudWatch Logs (JSON format, per-service log groups) |
| Request tracing | X-Ray (end-to-end: ALB → ECS → Lambda → RDS) |
| Metrics | CloudWatch custom metrics (items graded, credits issued, queue depth) |
| Dashboards | CloudWatch Dashboard (ops view + business KPIs) |
| Alarms | Error rate > 5%, P99 latency > 3s, queue age > 5min, DLQ messages > 0 |
| Health | /health endpoint (DB + Redis + S3 connectivity) |
| Business metrics | Items processed/day, credits circulation, environmental impact |

---

## 7. Decision Log

| Decision | Choice | Alternatives Considered |
|----------|--------|------------------------|
| Compute | ECS Fargate | EC2 (ops overhead), App Runner (less control), Lambda API (cold starts) |
| Database | RDS PostgreSQL | DynamoDB (poor for joins/analytics), Aurora (overkill at start) |
| AI Vision | Rekognition + Custom Labels | SageMaker full pipeline (too complex), third-party (vendor lock) |
| ML Prediction | SageMaker Endpoint | Lambda + scikit-learn (scaling limits), Bedrock (not for tabular) |
| Queue | SQS + Lambda | Celery (not serverless), Step Functions (overkill per item) |
| Recommendations | Personalize / Redis-cached | Custom ML (time), simple rules (not personalized enough) |
| Frontend hosting | S3 + CloudFront | Amplify (less control), ECS (wasteful for static) |
| Email | SES | SNS (no rich templates), third-party (cost + lock-in) |
| Local dev | LocalStack | Real AWS (costly), mocks (unrealistic) |
| Region | ap-south-1 | us-east-1 (latency), multi-region (premature) |
| Auth | Custom JWT | Cognito (adds UX complexity, harder to customize) |
| Credits store | PostgreSQL + Redis cache | DynamoDB (overkill), blockchain (unnecessary) |
