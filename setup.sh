#!/bin/bash

# TaskFlow Setup Script
# This script helps you set up TaskFlow for local development

set -e

echo "🚀 TaskFlow Setup"
echo "================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL from https://www.postgresql.org/download"
    exit 1
fi

echo "✅ PostgreSQL detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --prefix backend
npm install --prefix frontend
echo "✅ Dependencies installed"
echo ""

# Create database
echo "🗄️  Setting up database..."
if createdb taskflow_db 2>/dev/null; then
    echo "✅ Database created"
else
    echo "⚠️  Database already exists (or error occurred)"
fi

# Run schema
echo "📋 Running schema..."
psql taskflow_db < backend/schema.sql
echo "✅ Schema applied"
echo ""

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your DATABASE_URL and SESSION_SECRET"
fi

if [ ! -f frontend/.env ]; then
    echo "📝 Creating frontend/.env..."
    cp frontend/.env.example frontend/.env
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update backend/.env with your database credentials"
echo "2. Run: npm run dev --prefix backend"
echo "3. In another terminal: npm run dev --prefix frontend"
echo "4. Open http://localhost:5173"
echo ""
