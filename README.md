# Ceekay Dashboard

A complete production-ready mobile and web application for Ceekay Enterprise's internal monitoring dashboard for sales and product data.

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

### Default Admin Credentials

- Email: admin@ceekay.com
- Password: admin123

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
