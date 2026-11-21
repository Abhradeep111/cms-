# CorpXcloud CMS — Enterprise Full-Stack Content Management System

Production-oriented Content Management System (CMS) designed for the **CorpXcloud** enterprise website. This system provides a Next.js administrative dashboard and a FastAPI backend powered by MongoDB, enabling dynamic content editing without modifying the public site's visual design.

---

## 1. Project Architecture

The monorepo is organized into independently runnable services:

```
CMS/
├── frontend/                     # Next.js 15 (App Router) + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/login/     # CMS Authentication portal
│   │   │   ├── (dashboard)/      # Admin CMS Suite
│   │   │   │   ├── dashboard/    # CMS overview and real-time statistics
│   │   │   │   ├── homepage/     # 9 homepage section editors (Hero, About, Products, etc.)
│   │   │   │   ├── products/     # Products & Modules management (CRUD, reorder, status)
│   │   │   │   ├── services/     # Services & Solutions management (CRUD)
│   │   │   │   ├── testimonials/ # Customer feedback & social proof
│   │   │   │   ├── faqs/         # Knowledge base & FAQs
│   │   │   │   ├── media/        # Centralized media library & file uploader
│   │   │   │   ├── navigation/   # Header & footer navigation tree
│   │   │   │   ├── contact-footer/ # Corporate info, social links, footer settings
│   │   │   │   ├── seo/          # Page-by-page SEO meta tags & OpenGraph
│   │   │   │   └── settings/     # Global site settings & maintenance mode
│   │   │   └── ...               # Public landing page routes (unchanged design)
│   │   ├── components/           # UI components, layout, forms
│   │   ├── features/             # Feature-specific API clients & types
│   │   ├── contexts/             # AuthContext, ToastProvider
│   │   └── lib/                  # HTTP client with cookie/CSRF handling
├── backend/                      # Python 3.12+ / FastAPI / Beanie ODM / MongoDB
│   ├── app/
│   │   ├── core/                 # Settings, security (JWT + Argon2), permissions
│   │   ├── db/                   # MongoDB motor connection & database seeder
│   │   ├── modules/              # Modular domain features:
│   │   │   ├── auth/             # Authentication & user sessions
│   │   │   ├── dashboard/        # CMS aggregate metrics
│   │   │   ├── faqs/             # FAQs CRUD & categorization
│   │   │   ├── homepage/         # Homepage sections & public compatibility endpoint
│   │   │   ├── media/            # Uploads with magic byte validation
│   │   │   ├── navigation/       # Navigation tree management
│   │   │   ├── products/         # Products & modules CRUD
│   │   │   ├── revisions/        # Content versioning & audit trail
│   │   │   ├── seo/              # SEO metadata
│   │   │   ├── services/         # Services & industry solutions CRUD
│   │   │   ├── settings/         # Site settings, contact, footer
│   │   │   └── testimonials/     # Testimonials CRUD
│   │   └── scripts/              # `create_admin.py` utility
│   ├── tests/                    # Async Pytest suite (Auth, Products, Services)
│   └── pyproject.toml            # uv project configuration
├── infrastructure/               # Database initialization scripts
│   └── mongo-init.js
└── docker-compose.yml            # Multi-container orchestration
```

---

## 2. Technology Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS with CorpXcloud corporate palette (`navy`, `sky`, `aqua`, `royal`, `canvas`)
- **Forms & Validation:** React Hook Form + Zod (`zodResolver`)
- **HTTP Client:** Axios with `withCredentials: true` and automatic CSRF header injection
- **Icons & Motion:** Lucide React, Framer Motion
- **State Management:** React Context (`AuthContext`, `ToastProvider`), TanStack Query, Jotai

### Backend
- **Framework:** FastAPI (Python 3.12+)
- **Dependency & Env Manager:** `uv`
- **Database & ODM:** MongoDB 8.0 with Beanie ODM + Motor async driver
- **Authentication:** JWT in HttpOnly secure cookies + Bearer token support
- **Password Hashing:** Argon2 via `pwdlib`
- **Validation:** Pydantic v2 & Pydantic Settings
- **File Processing:** Python Multipart with magic-byte MIME type validation
- **Testing & Quality:** Pytest, HTTPX, Ruff (linting & formatting)

---

## 3. Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+ and `uv`
- MongoDB 7.0+ (running locally on port 27017 or via Docker)

---

### Starting MongoDB
If running locally:
```powershell
& "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "data\db" --port 27017 --bind_ip 127.0.0.1
```

Or using Docker:
```bash
docker-compose up mongodb -d
```

---

### Backend Setup & Execution

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Synchronize virtual environment with `uv`:
   ```bash
   uv sync
   ```

3. Configure environment variables (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Start the FastAPI development server:
   ```bash
   uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

The backend automatically seeds initial homepage sections, products, services, testimonials, FAQs, navigation, and the default superadmin user upon startup.

- **API Documentation (Swagger UI):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Alternative Documentation (ReDoc):** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Health Check:** [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

### Frontend Setup & Execution

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env.local` contains:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
   ```

4. Start Next.js development server:
   ```bash
   npm run dev
   ```

- **Public Landing Page:** [http://localhost:3000](http://localhost:3000)
- **CMS Admin Login:** [http://localhost:3000/login](http://localhost:3000/login)
- **CMS Admin Dashboard:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## 4. Default Credentials

| Field | Value |
|---|---|
| **Email** | `admin@corpxcloud.com` |
| **Password** | `Admin@CorpX2026!` |
| **Role** | `superadmin` |

To reset or create a new admin via CLI:
```bash
cd backend
uv run python scripts/create_admin.py newadmin@corpxcloud.com SecurePass123! --role superadmin --name "Admin Name"
```

---

## 5. Verification & Tests

### Backend Unit & Integration Tests
```bash
cd backend
uv run pytest
```
Result: `12 passed in 0.92s`

### Backend Code Quality Check
```bash
cd backend
uv run ruff check .
```
Result: `All checks passed!`

### Frontend Type Check & Linting
```bash
cd frontend
npx tsc --noEmit
npm run lint
```
Result: Zero TypeScript errors, lint checks clean.

---

## 6. Docker Deployment

To launch the full stack (MongoDB, Backend, and Frontend) in production containers:
```bash
docker-compose up --build -d
```
Services exposed:
- **Frontend:** Port 3000
- **Backend API:** Port 8000
- **MongoDB:** Port 27017
