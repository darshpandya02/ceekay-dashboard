#!/bin/bash

# Ceekay Dashboard Setup Script
echo "🚀 Setting up Ceekay Dashboard..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backend/uploads
mkdir -p backend/logs
mkdir -p frontend/assets

# Copy environment file
echo "⚙️ Setting up environment..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Created .env file from template"
    echo "⚠️  Please update .env with your configuration before running the application"
else
    echo "✅ .env file already exists"
fi

# Build and start services
echo "🐳 Building and starting Docker containers..."
docker-compose up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec backend npx prisma migrate deploy

# Seed the database
echo "🌱 Seeding database..."
docker-compose exec backend npm run db:seed

echo "✅ Setup complete!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Database: localhost:5432"
echo ""
echo "👤 Default Admin Credentials:"
echo "   Email: admin@ceekay.com"
echo "   Password: admin123"
echo ""
echo "📊 Sample Data:"
echo "   Upload the CSV files from sample-data/ folder to get started"
echo ""
echo "🛠️ Useful Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Access database: docker-compose exec postgres psql -U ceekay_user -d ceekay_dashboard"
