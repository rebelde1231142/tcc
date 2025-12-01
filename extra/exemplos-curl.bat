@echo off
REM Exemplos de testes da API de Email Config
REM Use este arquivo como referência para testar os endpoints

echo.
echo ======================================
echo Email Config API - Exemplos cURL
echo ======================================
echo.

setlocal enabledelayedexpansion

REM Configuração base
set BASE_URL=http://localhost:3001
set EMAIL=seu-email@gmail.com
set SENHA=sua-senha-de-app-sem-espacos

REM Cores (usando PowerShell)
call :test_save_credentials
call :test_get_configuration
call :test_toggle_status
call :test_delete_configuration

endlocal
exit /b 0

:test_save_credentials
echo [1] ===== SALVAR CREDENCIAIS =====
echo Endpoint: POST /api/email-config
echo.
echo Comando:
echo curl -X POST %BASE_URL%/api/email-config ^
echo   -H "Content-Type: application/json" ^
echo   -d "{\"email\": \"%EMAIL%\", \"senha\": \"%SENHA%\"}"
echo.
echo Resposta esperada:
echo {"mensagem": "Configuração de email salva com sucesso"}
echo.
pause
goto :eof

:test_get_configuration
echo [2] ===== CONSULTAR CONFIGURAÇÃO =====
echo Endpoint: GET /api/email-config
echo.
echo Comando:
echo curl %BASE_URL%/api/email-config
echo.
echo Resposta esperada:
echo {
echo   "id": 1,
echo   "email": "seu-email@gmail.com",
echo   "ativo": 1,
echo   "configurado": true
echo }
echo.
pause
goto :eof

:test_toggle_status
echo [3] ===== ATIVAR/DESATIVAR =====
echo Endpoint: PUT /api/email-config/{id}/ativo
echo.
echo Comando (ATIVAR):
echo curl -X PUT %BASE_URL%/api/email-config/1/ativo ^
echo   -H "Content-Type: application/json" ^
echo   -d "{\"ativo\": true}"
echo.
echo Comando (DESATIVAR):
echo curl -X PUT %BASE_URL%/api/email-config/1/ativo ^
echo   -H "Content-Type: application/json" ^
echo   -d "{\"ativo\": false}"
echo.
pause
goto :eof

:test_delete_configuration
echo [4] ===== DELETAR CONFIGURAÇÃO =====
echo Endpoint: DELETE /api/email-config/{id}
echo.
echo Comando:
echo curl -X DELETE %BASE_URL%/api/email-config/1
echo.
echo Resposta esperada:
echo {"mensagem": "Configuração removida com sucesso"}
echo.
pause
goto :eof
