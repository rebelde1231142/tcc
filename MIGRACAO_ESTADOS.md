# 🔧 Migração de Estados dos Itens

## Problema
A coluna `estado` na tabela `itens` do banco de dados estava definida como `ENUM` com valores fixos:
- `'em uso'`
- `'quebrado'`
- `'parado'`

Ao tentar salvar com os novos estados (`'operacional'`, `'disponivel'`, `'inoperante'`), o banco rejeitava com o erro:
```
Data truncated for column 'estado' at row 1
```

## Solução
Foi necessário alterar a definição da coluna `estado` no banco de dados.

## Passos para Executar a Migração

### 1. **Fazer Backup do Banco de Dados** (IMPORTANTE!)
```bash
# No phpMyAdmin ou via CLI MySQL
mysqldump -u seu_usuario -p tcc > backup_tcc_2025-11-26.sql
```

### 2. **Executar o Script de Migração**

#### Opção A: Via phpMyAdmin
1. Abra phpMyAdmin
2. Acesse o banco `tcc`
3. Vá para a aba "SQL"
4. Copie e cole o conteúdo do arquivo `migration-estados.sql`
5. Clique em "Executar"

#### Opção B: Via CLI MySQL
```bash
mysql -u seu_usuario -p tcc < migration-estados.sql
```

#### Opção C: Via Node.js (Recomendado - executar pelo backend)
```javascript
// No arquivo back/db.js ou index.js
const migrationSQL = `
ALTER TABLE \`itens\` 
CHANGE COLUMN \`estado\` \`estado\` ENUM('operacional', 'disponivel', 'inoperante', 'em uso', 'quebrado', 'parado') DEFAULT NULL;

UPDATE \`itens\` SET \`estado\` = 'operacional' WHERE \`estado\` = 'em uso';
UPDATE \`itens\` SET \`estado\` = 'disponivel' WHERE \`estado\` = 'parado';
UPDATE \`itens\` SET \`estado\` = 'inoperante' WHERE \`estado\` = 'quebrado';

ALTER TABLE \`itens\` 
CHANGE COLUMN \`estado\` \`estado\` ENUM('operacional', 'disponivel', 'inoperante') DEFAULT NULL;
`;

// Execute as queries
```

### 3. **Verificar se Funcionou**
```sql
-- Verificar a definição da coluna
DESCRIBE itens;

-- Deve mostrar: estado | enum('operacional','disponivel','inoperante')

-- Verificar os dados migrados
SELECT DISTINCT estado FROM itens;

-- Deve mostrar: operacional, disponivel, inoperante
```

### 4. **Testar a Aplicação**
- Tente salvar um item com o novo estado
- Verifique os gráficos e badges

## Mapeamento de Estados
| Antigo | Novo |
|--------|------|
| em uso | operacional |
| parado | disponivel |
| quebrado | inoperante |

## Cores (Permanecem Iguais)
- 🟢 **Verde**: Operacional (era "Em uso")
- 🟡 **Amarelo**: Disponível (era "Parado")
- 🔴 **Vermelho**: Inoperante (era "Quebrado")

## Arquivos Alterados
- ✅ `front/public/index.html` - Opções de seleção e gráficos
- ✅ `front/public/assets/js/graficos-visitante-menu.js` - Gráficos do menu
- ✅ `back/index.js` - Validação de estados
- ✅ `extra/tcc.sql` - Definição do banco de dados

## Suporte
Se encontrar erros durante a migração:
1. Restaure o backup
2. Verifique se o banco está disponível
3. Certifique-se de ter permissões de ALTER TABLE
