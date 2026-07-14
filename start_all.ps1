Write-Host "====================================" -ForegroundColor Green
Write-Host "  AeroTwin AI - Digital Twin System" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

Write-Host "[1/2] Starting Backend (port 8000)..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
  cd "D:\turbo engine\backend"
  python -m uvicorn main:app --host 0.0.0.0 --port 8000
}
Start-Sleep -Seconds 4

Write-Host "[2/2] Starting Frontend (port 5173)..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
  cd "D:\turbo engine\frontend"
  npm run dev
}
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "  System Ready!" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "  API docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to stop all services..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Stop-Job $backendJob -ErrorAction SilentlyContinue
Stop-Job $frontendJob -ErrorAction SilentlyContinue
Remove-Job $backendJob -ErrorAction SilentlyContinue
Remove-Job $frontendJob -ErrorAction SilentlyContinue
Write-Host "Services stopped." -ForegroundColor Yellow
