# Ceekay Dashboard

A complete production-ready mobile and web application for Ceekay Enterprise's internal monitoring dashboard for sales and product data.

## Live Demo

- App: https://ceekay-dashboard.vercel.app
- API: https://ceekay-dashboard-api.vercel.app (health check at `/health`)

Demo login (also shown on the login screen):

- Email: `demo@ceekay-demo.dev`
- Password: `demo-dashboard-2026`

The demo database holds synthetic sample sales data only (products named "Demo ..."). User management is read-only in the demo, and uploaded CSVs replace that year's demo data.

### Deployment (Vercel)

- `frontend/` is the `ceekay-dashboard` project: a static Expo web export (`npx expo export -p web` to `dist/`). `EXPO_PUBLIC_API_URL` must point at the API's `/api` path at build time.
- `backend/` is the `ceekay-dashboard-api` project: the Express app runs as a Vercel Function. Env vars: `CEEKAY_DATABASE_URL` (Postgres URL with `schema=ceekay_dashboard`), `JWT_SECRET`, `CORS_ORIGIN`, `DEMO_MODE=true`.
- Create tables with `npx prisma db push` and seed the demo with `npx ts-node prisma/seed.ts`, with `DATABASE_URL` set to the same schema.

## 🚀 Features

- **Role-based Authentication**: Admin and User roles with JWT authentication
- **Interactive Dashboard**: Visualize sales and product data with charts
- **CSV Upload**: Upload and process sales data by year
- **User Management**: Admin can manage users (add/remove/list)
- **Responsive Design**: Works on mobile and web platforms
- **Real-time Data**: Live dashboard updates

## 🛠 Tech Stack

### Frontend

- React Native + React Native Web
- Expo
- TypeScript
- Redux Toolkit
- React Navigation
- Tailwind React Native
- Axios
- React Native Charts

### Backend

- Node.js + Express.js
- TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- Multer (file upload)
- CSV-parser
- bcrypt

### Deployment

- Docker + Docker Compose
- Environment-based configuration

## 📁 Project Structure

```
ceekay-dashboard/
├── frontend/                 # React Native app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── screens/         # App screens
│   │   ├── navigation/      # Navigation setup
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema & migrations
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Installation

1. **Clone and setup**

```bash
git clone <repository-url>
cd ceekay-dashboard
```

2. **Environment Setup**

```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Start with Docker**

```bash
docker-compose up --build
```

4. **Or run locally**

```bash
# Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npx expo start
```

### Demo Admin Credentials (created by the seed script)

- Email: demo@ceekay-demo.dev
- Password: demo-dashboard-2026

## 📱 App Screens

1. **Login Screen** - Email/password authentication
2. **Dashboard Screen** - Sales metrics with year selector
3. **CSV Upload Screen** - Upload sales data by year
4. **User Management** - Admin-only user management
5. **Profile Screen** - User profile and logout

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users (Admin only)

- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Data

- `POST /api/upload` - Upload CSV file
- `GET /api/dashboard/:year` - Get dashboard data for year
- `GET /api/years` - Get available years

## 🗄 Database Schema

### Users Table

- id, name, email, password, role, createdAt, updatedAt

### Sales Data Table

- id, productName, category, salesAmount, month, year, createdAt

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

1. Build frontend: `cd frontend && npm run build`
2. Deploy backend to your server
3. Set up PostgreSQL database
4. Run migrations: `npx prisma migrate deploy`

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Rate limiting

## 📈 Next Steps

- [ ] Add data export functionality
- [ ] Implement real-time notifications
- [ ] Add advanced analytics
- [ ] Mobile app store deployment
- [ ] Performance monitoring
- [ ] Automated testing pipeline

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

Private - Ceekay Enterprise
