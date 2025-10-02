@echo off
echo ========================================
echo    RPPH Job System - Prisma Setup
echo ========================================
echo.

echo [1/6] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

echo.
echo [2/6] Installing Prisma dependencies...
npm install prisma @prisma/client
if %errorlevel% neq 0 (
    echo ❌ Failed to install Prisma dependencies
    pause
    exit /b 1
) else (
    echo ✅ Prisma dependencies installed
)

echo.
echo [3/6] Generating Prisma client...
npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    echo Please check your schema.prisma file
    pause
    exit /b 1
) else (
    echo ✅ Prisma client generated
)

echo.
echo [4/6] Setting up environment variables...
if not exist .env.local (
    echo Creating .env.local file...
    echo DATABASE_URL="mysql://root:password@localhost:3306/rpph_job_system" > .env.local
    echo NEXTAUTH_URL="http://localhost:3000" >> .env.local
    echo NEXTAUTH_SECRET="your-secret-key-here" >> .env.local
    echo LINE_CLIENT_ID="your-line-client-id" >> .env.local
    echo LINE_CLIENT_SECRET="your-line-client-secret" >> .env.local
    echo ✅ Environment file created
) else (
    echo ✅ Environment file already exists
)

echo.
echo [5/6] Testing database connection...
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => { console.log('✅ Database connection successful'); prisma.$disconnect(); }).catch(err => { console.log('❌ Database connection failed:', err.message); process.exit(1); });"
if %errorlevel% neq 0 (
    echo ❌ Database connection failed
    echo Please:
    echo 1. Install MySQL
    echo 2. Create database: rpph_job_system
    echo 3. Update DATABASE_URL in .env.local
    echo 4. Run: npx prisma db push
    pause
    exit /b 1
) else (
    echo ✅ Database connection successful
)

echo.
echo [6/6] Running database migration...
npx prisma db push
if %errorlevel% neq 0 (
    echo ❌ Database migration failed
    echo Please check your database connection and try again
    pause
    exit /b 1
) else (
    echo ✅ Database migration completed
)

echo.
echo ========================================
echo    Prisma Setup completed!
echo ========================================
echo.
echo Next steps:
echo 1. Run: node migrate-to-prisma.js (to migrate data from JSON)
echo 2. Start your Next.js application: npm run dev
echo 3. Test the Prisma API endpoints
echo.
echo Prisma Studio: npx prisma studio
echo.
pause
