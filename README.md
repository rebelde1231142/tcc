# TCC Inventário – Guia de Desenvolvimento

## Visão geral
Aplicação full-stack (Node.js + Express + MySQL no backend; HTML/JS/Bootstrap no frontend) para gestão de itens com histórico de auditoria e controle de acesso por CPF.

## Pré-requisitos
- Node.js 18+
- MySQL 8+

## Configuração do backend
1. Copie `back/.env.example` para `back/.env` e ajuste os valores:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`
   - `ADMIN_CPFS` (apenas dígitos, separados por vírgula)
   - Opcional: variáveis do Gmail/OAuth em `back/emailService.js`
2. Instale dependências no backend:
   - Abra o terminal na pasta `back/` e rode `npm install`.
3. Inicie o backend:
   - Em `back/`, rode `npm start` ou `node index.js`.

Observações:
- O backend serve o frontend estático de `front/public` automaticamente.
- As credenciais do banco são lidas via variáveis de ambiente (ver `back/db.js`).

## Configuração do frontend
O frontend é servido pelo próprio backend. Acesse no navegador:
- http://localhost:3000/

## Acesso ao histórico (auditoria)
- A rota `GET /api/auditoria` é protegida. Apenas CPFs na variável `ADMIN_CPFS` podem acessar.
- O CPF é enviado pelo frontend no cabeçalho `X-User-CPF`.
- Página de histórico: `/page/admin/historico.html`.
- O link “Histórico” só aparece no menu se o backend confirmar permissão via `GET /api/auditoria/permissao`.

## Variáveis de ambiente importantes
- `ADMIN_CPFS`: lista de CPFs autorizados (só dígitos, separados por vírgula).
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`: parâmetros do MySQL.
- `PORT`: porta do servidor Express (padrão 3000).

## Solução de problemas
- 404 em `/api/auditoria/permissao`:
  - Garanta que o backend foi reiniciado após as mudanças.
  - Confirme que está acessando via o mesmo host do backend (as URLs no front são relativas).
- 403 em `/api/auditoria`:
  - Verifique se o CPF do usuário logado está listado em `ADMIN_CPFS` (apenas dígitos).
  - Certifique-se de que o `X-User-CPF` está sendo enviado. O app usa `usuarioLogado.CPF` armazenado no `localStorage`.
- Tabelas/colunas de auditoria:
  - O backend cria a tabela `Auditoria` ao iniciar. Se a tabela já existia, ele tenta acrescentar `grupo` e `itemId`.
- Gráficos não carregam:
  - O front verifica a existência dos canvases antes de renderizar; se não existirem, são ignorados.

## Scripts úteis
- Backend:
  - `cd back` ; `npm install` ; `npm start`
- Frontend: servido pelo backend em `http://localhost:3000/`.

## Segurança
- Não faça commit de `.env` com credenciais reais.
- Valide CPFs apenas com dígitos. O backend normaliza valores.

## Estrutura
- `back/`: API, autenticação, auditoria, relatórios
- `front/public/`: Dashboard, páginas de usuário e admin

## Licença
Uso acadêmico.
