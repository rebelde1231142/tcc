#!/usr/bin/env powershell

# Script para testar a configuração de email
# Uso: .\test-email-config.ps1

Write-Host "🧪 Testando Nova Configuração de Email" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001"
$email = Read-Host "Entre com seu email do Gmail"
$senha = Read-Host "Entre com a senha de app (sem espacos)"

Write-Host ""
Write-Host "1️⃣ Tentando SALVAR as credenciais..." -ForegroundColor Yellow

$body = @{
    email = $email
    senha = $senha
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/email-config" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body
    
    Write-Host "✅ Sucesso! Resposta:" -ForegroundColor Green
    Write-Host $response
} catch {
    Write-Host "❌ Erro ao salvar: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "2️⃣ Tentando CONSULTAR a configuração..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/email-config" `
        -Method GET
    
    Write-Host "✅ Sucesso! Configuração atual:" -ForegroundColor Green
    Write-Host $response | ConvertTo-Json
} catch {
    Write-Host "❌ Erro ao consultar: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Todos os testes passaram!" -ForegroundColor Green
Write-Host "Email configurado com sucesso!"
