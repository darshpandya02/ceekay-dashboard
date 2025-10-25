# 🚀 Ceekay Dashboard Setup Guide

This guide will help you set up and run the Ceekay Dashboard application on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (v20.10+) and **Docker Compose** (v2.0+)
- **Node.js** (v18+) - for local development
- **Git** - for cloning the repository

## 🚀 Quick Start (Docker - Recommended)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd ceekay-dashboard
```

### 2. Run Setup Script

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This script will:

- Create necessary directories
- Copy environment configuration
- Build and start all services
- Run database migrations
- Seed the database with sample data

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

### 4. Login

Use the default admin credentials:

- **Email**: admin@ceekay.com
- **Password**: admin123

## 🛠️ Manual Setup (Development)

### Backend Setup

1. **Navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment**

```bash
cp env.example .env
# Edit .env with your database credentials
```

4. **Setup database**

```bash
# Start PostgreSQL (using Docker)
docker run --name ceekay-postgres -e POSTGRES_DB=ceekay_dashboard -e POSTGRES_USER=ceekay_user -e POSTGRES_PASSWORD=ceekay_password -p 5432:5432 -d postgres:15-alpine

# Run migrations
npx prisma migrate dev

# Seed database
npm run db:seed
```

5. **Start backend server**

```bash
npm run dev
```

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
# For web
npm run web

# For mobile (iOS)
npm run ios

# For mobile (Android)
npm run android
```

## 📊 Sample Data

The application comes with sample CSV files in the `sample-data/` directory:

- `sample-sales-2022.csv` - Sales data for 2022
- `sample-sales-2023.csv` - Sales data for 2023

Upload these files through the application to see the dashboard in action.

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://ceekay_user:ceekay_password@localhost:5432/ceekay_dashboard?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Frontend
EXPO_PUBLIC_API_URL="http://localhost:5000/api"
```

### Database Configuration

The application uses PostgreSQL with Prisma ORM. Key tables:

- `users` - User accounts and roles
- `sales_data` - Sales transactions
- `upload_logs` - CSV upload history

## 📱 Mobile Development

### iOS Setup

1. Install Xcode
2. Install iOS Simulator
3. Run `npm run ios`

### Android Setup

1. Install Android Studio
2. Setup Android SDK
3. Run `npm run android`

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild services
docker-compose up --build -d

# Access database
docker-compose exec postgres psql -U ceekay_user -d ceekay_dashboard

# Access backend container
docker-compose exec backend bash

# Access frontend container
docker-compose exec frontend bash
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🚀 Deployment

### Production Deployment

1. **Update environment variables** for production
2. **Build and deploy**:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment

The application is ready for deployment on:

- **AWS Lightsail**
- **DigitalOcean**
- **Google Cloud Platform**
- **Azure**

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**

   - Change ports in `docker-compose.yml`
   - Kill existing processes using the ports

2. **Database connection failed**

   - Check if PostgreSQL is running
   - Verify database credentials in `.env`

3. **Frontend not loading**

   - Check if backend is running
   - Verify API URL in frontend configuration

4. **CSV upload fails**
   - Check file format (must be CSV)
   - Verify file size (max 10MB)
   - Check backend logs for errors

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Dashboard Endpoints

- `GET /api/dashboard/years` - Get available years
- `GET /api/dashboard/:year` - Get dashboard data

### Upload Endpoints

- `POST /api/upload` - Upload CSV file
- `GET /api/upload/history` - Get upload history

### User Management (Admin only)

- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🎯 Next Steps

1. **Customize the dashboard** with your specific metrics
2. **Add more chart types** for better data visualization
3. **Implement real-time updates** using WebSockets
4. **Add data export functionality** (Excel, PDF)
5. **Set up monitoring and logging** for production
6. **Implement automated backups** for the database

## 🤝 Support

For issues and questions:

1. Check the troubleshooting section
2. Review the logs
3. Create an issue in the repository
4. Contact the development team

---

**Happy Dashboard Building! 🎉**
