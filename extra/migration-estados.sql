-- Script de migração: Atualizar estados dos itens
-- De: "em uso", "quebrado", "parado"
-- Para: "operacional", "disponivel", "inoperante"

-- Primeiro, alterar a coluna enum para aceitar os novos valores
ALTER TABLE `itens` 
CHANGE COLUMN `estado` `estado` ENUM('operacional', 'disponivel', 'inoperante', 'em uso', 'quebrado', 'parado') DEFAULT NULL;

-- Agora, migrar os dados antigos para os novos valores
UPDATE `itens` SET `estado` = 'operacional' WHERE `estado` = 'em uso';
UPDATE `itens` SET `estado` = 'disponivel' WHERE `estado` = 'parado';
UPDATE `itens` SET `estado` = 'inoperante' WHERE `estado` = 'quebrado';

-- Por fim, remover os valores antigos da enum (deixando apenas os novos)
ALTER TABLE `itens` 
CHANGE COLUMN `estado` `estado` ENUM('operacional', 'disponivel', 'inoperante') DEFAULT NULL;

-- Atualizar também a tabela de auditoria para refletir a mudança
-- (comentado, pois é apenas informativo, os dados históricos permanecerão como estavam)
-- SELECT 'Migração concluída com sucesso!' AS 'Status';
