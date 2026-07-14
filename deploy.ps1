Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  AeroTwin AI - Cloud Deployment Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Build Frontend for Production" -ForegroundColor Yellow
Set-Location -LiteralPath "D:\turbo engine\frontend"
npm run build
if ($?) { Write-Host "  ✓ Frontend built" -ForegroundColor Green } else { Write-Host "  ✗ Build failed" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "Step 2: Deploy Frontend to Vercel" -ForegroundColor Yellow
Write-Host "  Run: cd frontend && npx vercel --prod" -ForegroundColor White
Write-Host "  Or connect your Git repo to Vercel dashboard" -ForegroundColor White

Write-Host ""
Write-Host "Step 3: Deploy Backend to Render" -ForegroundColor Yellow
Write-Host "  1. Push to GitHub/GitLab" -ForegroundColor White
Write-Host "  2. Go to https://dashboard.render.com" -ForegroundColor White
Write-Host "  3. New Web Service -> Connect repo" -ForegroundColor White
Write-Host "  4. Root Directory: backend" -ForegroundColor White
Write-Host "  5. Build Command: pip install -r requirements.txt" -ForegroundColor White
Write-Host "  6. Start Command: uvicorn main:app --host 0.0.0.0 --port \$PORT" -ForegroundColor White

Write-Host ""
Write-Host "Step 4: Update Frontend Env" -ForegroundColor Yellow
Write-Host "  Set VITE_API_URL in Vercel to: https://your-backend.onrender.com" -ForegroundColor White

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Done!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
