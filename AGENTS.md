<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

Leia primeiro CONTEXT.md e apenas a spec/Task pertinente. Preserve dados, autenticação, equipe, autoria e histórico; não implemente itens futuros automaticamente. Após mudança durável, atualize a nota canônica e o changelog. Não afirmar sincronização externa sem evidência.

# Codex Instructions

Read and follow `AGENT_POLICY.md`. It is the shared source of truth for this
repository.

Codex-specific commit attribution:

```text
Co-authored-by: Codex <codex@openai.com>
Agent-Session: [session-id]
```
