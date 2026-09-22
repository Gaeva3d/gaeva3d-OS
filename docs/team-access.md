> Contexto de produto atualizado em 2026-09-08: [decisões e roadmap conservador](gaeva-os/00-visao-geral.md). Esta auditoria técnica permanece como referência da implementação existente.

# Cadastro de acesso da equipe

## Uso

1. Administração abre **Equipe → Novo integrante**.
2. Informa nome, cargo, perfil, capacidade e e-mail. **Criar acesso ao sistema** vem marcado.
3. **Salvar e criar acesso** cria a conta no Supabase Auth, reutiliza `profiles` e vincula `team_members.user_id` automaticamente.
4. A senha temporária é exibida somente no resultado dessa operação. O administrador copia e compartilha diretamente com a pessoa. Não há envio de e-mail nessa versão.
5. Ao entrar com a senha temporária, a aplicação solicita uma senha própria de pelo menos 12 caracteres.

Em um integrante antigo sem login, usar **Criar acesso** no próprio cartão. Isso preserva o ID do integrante, os responsáveis e as atribuições dos pedidos.

Uma conta existente é vinculada sem substituir a senha. **Gerar nova senha temporária** permite ao administrador recuperar o acesso de outro integrante após confirmação. **Alterar minha senha**, no cabeçalho, modifica somente a conta autenticada.

O cadastro operacional sem login continua disponível desmarcando a opção de criar acesso.

## Reaproveitamento e alterações mínimas

| Necessidade | Estrutura utilizada |
| --- | --- |
| Login e senha | Supabase Auth existente |
| Nome, e-mail e papel de acesso | `profiles` |
| Pessoa na operação, capacidade e atribuições | `team_members` e seu `user_id` único |
| Preparação e repetição segura | `prepare_team_access`, com bloqueio por e-mail e reaproveitamento do integrante |
| Vínculo e papel consistentes | `link_team_access`, transacional, sob o JWT do administrador |
| Histórico de cadastro e perfil | Gatilhos em `profiles`/`team_members` usando `app_private.write_audit_log` e `audit_logs` |
| Troca inicial de senha | Metadado confiável `app_metadata.gaeva_requires_password_change` do Supabase Auth |

Nenhuma tabela, coluna de senha, usuário paralelo ou nova role foi criada.

## Servidor

`supabase/functions/team-access` tem JWT obrigatório. O servidor também valida o token com `auth.getUser` e consulta `profiles.role/is_active`. Os quatro papéis que não são administradores não podem criar, vincular ou redefinir acessos. Qualquer usuário ativo pode alterar somente a própria senha.

As operações no banco usam o cliente com o JWT do administrador e funções `security invoker`, mantendo RLS e autoria da auditoria. O cliente privilegiado fica restrito à API administrativa de Auth. A função utiliza as variáveis nativas `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` do ambiente Edge. Nenhuma chave privada vai para o frontend ou repositório.

Respostas com credenciais têm `Cache-Control: no-store`. A senha não é registrada em logs, tabelas, localStorage ou cache de queries. Ao fechar o diálogo, o estado que a contém é descartado. Senhas temporárias usam aleatoriedade criptográfica.

Uma falha entre criação da conta e vínculo pode deixar uma conta ainda sem integrante vinculado. Repetir a solicitação reaproveita a mesma conta e cadastro; a aplicação não apaga usuários para compensar falhas. Se a senha temporária não tiver sido recebida, o administrador gera outra após concluir o vínculo.

A troca inicial é solicitada pela interface; não constitui uma política adicional de RLS sobre pedidos. O perfil e a autenticação existentes continuam sendo a autorização dos dados. Redefinir a senha não é uma ferramenta de revogação de todas as sessões.

## Validação

1. TypeScript do frontend e do handler Edge; build de produção; lint dos componentes alterados.
2. 23 testes Node, incluindo autorização, proteção contra metadados editáveis, criação, reutilização, corrida de criação, falha parcial, redefinição e troca restrita ao próprio usuário.
3. `tests/team-access-database.sql`: funções reais, vínculo transacional, papéis, RLS, repetição, identidade por e-mail e autoria de auditoria. Todas as fixtures são revertidas.
4. Função publicada e ativa com `verify_jwt = true`.

Não foram usados senha nem sessão de um usuário real para testar criação autenticada ponta a ponta. Nenhuma conta real ou convite foi criado durante a implantação. A primeira operação real ocorre quando o administrador informar o e-mail na equipe. A tentativa de checagem HTTP pelo ambiente local não foi concluída por cancelamento da autorização de rede.

Referências: [Admin createUser](https://supabase.com/docs/reference/javascript/auth-admin-createuser), [Admin updateUserById](https://supabase.com/docs/reference/javascript/auth-admin-updateuserbyid), [autorização de Edge Functions](https://supabase.com/docs/guides/functions/auth-headers).
