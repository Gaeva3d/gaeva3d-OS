> Contexto TFD · 1100 palavras · 2029 tokens (o200k_base)

# Plano integrado por fase e critérios de saída — MT-A02r1

Uma Task canônica draft por módulo, fases internas ordenadas. [Registro](task-registry.json) distingue Tasks de módulo novas dos10 trabalhos históricos de tela/guia. Não modificar histórico ou criar Task por aba/MT. Allowed_paths futuros são limites propostos, **não autorização de escrita de código neste mandato**. Root A, conhecimento, reviews, Product/Discovery e ledger existentes permanecem protegidos; .git/segredos/uploads/dados/backups não são alvos de implementação.

| Fase / módulo | Saída verificável e dono proposto | Dependência / stop | Estimativa O/M/P h |
| --- | --- | --- | --- |
| F1-P1 MOD001 | DevOps fixa fonte/contexto/lock/digest e contratos config dev/test/prod/restore; inventário de contexto limpo | Aprovação humana da fase; repo/source não rastreável impede promover imagem, sem retry .git |18/36/72 |
| F1-P2 MOD001 | Backend/Database implementam guard antes dos imports, fixtures seguras; DevOps CI/isolamento | P1; tupla não allowlisted, alias/role/URL conflitante ou falta prova recurso novo bloqueia sem conexão |12/24/48 |
| F1-P3 MOD001 | Database/DevOps migrador único/roles e API sem DDL/download; ensaio de recuperação/rollback só autorizado | P2; sem recuperação comprovada não declarar base ready; Q03/Q05 só artefato dependente |12/24/48 |
| F2-P1 MOD002 | Backend/Database identidade tipada/RBAC/arquivos/auditoria; último Admin e projeções | F1 comprovada + D06/D07 aplicáveis; sem autorização campo/objeto, negar |24/48/96 |
| F2-P2 MOD002 | Frontend/UX shell/ficha/contexto e estados acessíveis | P1 + U/V; source modeless:false deve ser adaptado conforme DEC-UX01 |18/36/72 |
| F3-P1 MOD003/006/008/011 | Donos de domínio fecham adapters, migrations, fixtures e estados da fatia vertical | F2; Q03/Q05/PSP/Portal ausente bloqueia apenas integração dependente, sem mock em produção |24/48/96 por conjunto, não por módulo |
| F3-P2 MOD003/008/011 | Backend/Database/Frontend implementam revisão/publicação/aceites/pagamento/gates com teste integrado | P1 e alçadas/políticas aplicáveis; revisão inconsistente ou recebimento não confirmado bloqueia |30/60/120 conjunto |
| F4-P1 MOD004 | Backend atendimento/fila/posse/bot e integração canal já contratada; Frontend U02/03/04/09 | F3 integrado, D01/02/04/06 aplicáveis; unknown sem novo despacho |36/72/144 |
| F4-P2 MOD004 | Oportunidades, compatibilidade DEP01–13 e aposentadoria gradual da entrada Mensagens | P1, D03 por transição; Q05/anexos ou consumidor sem mapa bloqueia corte, não apaga dados |24/48/96 |
| F5 MOD003/009/011 | Produção/OPs filhas, KP e tabela impressão, material/QC/cliente/postagem/tempos aprovados | F4 e D05; agregação e ordenação sem política não ativadas |48/90/180 conjunto |
| F6 MOD005/007/010 e ampliação dos demais | Especificar recortes finais, decisões/fonte/contratos e QA antes da execução | PRD/aplicabilidade ausente: planejamento apenas, não implementação-ready |30/72/150 só preparação |

Estimativas são esforço humano equivalente não calendário/compromisso; baixa confiança, base em fronteiras/fixtures, sem benchmark histórico. Capacidade/prazo/budget não definidos. Somente aplicar somas a MTs sem sobreposição; conjunto F3/F5 não se soma por cada módulo. Tasks de roadmap sem estimativa de execução usam pending-estimate, nunca0 como promessa.

## Roteiro de validação — procedimentos futuros, não executados

| TEST / REQ Product | Procedimento proposto / aceitação | Dono execução e revisão |
| --- | --- | --- |
| T07-P1/REQ14 | Manifesto allowlisted B ordenado/hashado antes/depois, locks/bases/plataforma e build receipt→digest; label/tag divergente não certifica igualdade | DevOps; qa_backend/Security |
| T07-P2/P3/REQ14 | Instalação limpa por lock de cada contexto, pins/hashes transitivos Python, auditoria de contexto sem segredo/dado e base verificada | DevOps/Backend; qa_backend/Security |
| T07-P4/REQ14 | Guard stdlib testado com mocks, zero import/conexão/mkdir nos negativos: ENV errado/ausente, URL prod+DB_NAME test, tupla errada, alias/opções redirecionadoras; após guard conectar só alvo novo e verificar DB/role/instância antes de fixture | Backend/Database; qa_backend/Security |
| T07-P5/P6/REQ14 | Restart API não executa migration/download/seed; único job/lock/role sem DDL app; falta PRO informa unavailable, artefato elegível fixado quando contrato pronto | Database/DevOps; qa_backend |
| T07-P7/REQ14 | Em recursos novos autorizados restaurar DB+objetos+config/identidade, conciliar hashes/IDs/autoria/links e executar jornada sintética; ensaiar retorno compatível sem perder writes aceitos | DevOps/Database; qa_backend/Security; aprovação operacional separada |
| T01/REQ01/06 | Dataset clienteX/Y e vínculos inconsistentes; contexto exato, seleçãoA/B e retorno de ficha,401/403/404 sem dados alheios ou nova venda | Backend/Frontend; qa_backend/qa_ui |
| T02/REQ07/10 | Matriz ação/registro/campo, download/evento/export/IA, revogação, último Admin concorrente e autoria desativada; nenhum vazamento | Backend/Database; Security/qa_backend |
| T03/REQ04/05 | Capacidade+reservas e principal único sob disputa assumir/pausar/aceitar; relógios/modos/espera COM; bot fence antes de despacho | Backend; qa_backend/Security |
| F01-IDEM/C01 | Nove casos do phase-plan MT-A01r2: alvoA→B vazio, tipo/ID/versão/payload/parâmetro mudado409, replay sucesso após avanço de versão, pending/unknown/rejeição/revogação; um efeito sem replay cruzado | Backend; qa_backend/Security |
| T04/REQ03 | IA não publica, vendedor publica revisão; mudança de conteúdo preserva anterior e invalida aceites afetados; arraste não confirma | Backend/Frontend; qa_backend/qa_ui |
| T05/REQ02/08/09/15 |2D/proposta→confirmação50% ou integral elegível→3D cliente+técnico mesma revisão→material/capacidade→QC/foto final→saldo/postagem; negar cada gate separado e em concorrência; retrabalho sem nova venda | Backend/Database; qa_backend/Security |
| T06/REQ11/12 | Fixtures legado/anexo/system/read_at/count/contexto; mapear/reconciliar IDs/hashes e testar CASCADE só isolado, links antigos e rollback de entrada sem perda | Backend/Database/Frontend; qa_backend/qa_ui |
| T08/REQ13/15 | U01–09/V01–15 e DEC-UX01; teclado/contraste/temas/zoom/móvel/resize sem drag; print table default, não scheduler | Frontend/UIUX; qa_ui independente |
| T09/REQ16 contextual | Config/UOM/processo genérico sem hardcode por marca e recursos dev/test/prod isolados; um produto, nenhuma outra empresa necessária no ensaio atual | DevOps/Backend; qa_backend |

Os procedimentos acima são comandos manuais de validação especificados para o executor após autorização, não scripts de teste inexistentes apresentados como prontos. Comando pytest/npm concreto será associado ao teste real criado na fase, executado via guard test seguro; não invocar conftest atual diretamente. Suites existentes citadas na Discovery são candidatos de regressão, não cobertura futura suficiente de Q03/Q05/restore.

## Maturidade e gates

MOD001: desenho de F1 pronto para revisão, execução pendente. MOD002/003/004/006/008/011: recorte integrado especificado com stops de política/contrato explícitos; implementação condicionada ao fechamento do recorte. MOD009: contrato material/estoque/capacidade definido, ampliação posterior. MOD005/007/010: roadmap com tasks apenas de especificação/PRD, sem fingir maturidade funcional. Cada spec individual informa fases e requisitos locais.

Nenhuma Task é READY operacionalmente; JSON draft. QA independente desta síntese precede aprovação humana G6; G0/G0.5/G1 continuam como observados. Cada fase futura: executor+self-test→QA Backend/UI/Security aplicáveis→rework limitado→PASS→aprovação humana. Main coordena revisão/registro, não autor. Publication/Issue/branch/merge/deploy têm autorização própria ausente.

## Finalizacao r5: estimativas individuais e por fase

Os registros em [estimates/](estimates/) sao o detalhamento atual por ID de fase nativa; os pools macro acima permanecem como totais, nao parcelas adicionais. Julgamento de engenharia de baixa confianca, sem tempos observados. F3: MOD003 24/48/96, MOD006 6/12/24, MOD008 12/24/48, MOD011 12/24/48 (soma 54/108/216). F5: MOD003 18/36/72, MOD009 18/30/60, MOD011 12/24/48 (soma 48/90/180). F6: MOD005/007/010 10/24/50 cada (soma 30/72/150), somente preparacao. MOD001/002/004 mantem totais anteriores.

Distribuicao por fase nativa: MOD001 conserva 18/36/72 + 12/24/48 + 12/24/48. Demais Tasks de tres fases alocam 25% contrato, 50% execucao, 25% revisao/documentacao, cobrindo seus MTs sem duplicar horas. Roadmaps alocam 100% a fase documental unica. Pressupoe equipe familiar com a base, recursos isolados e contratos disponiveis; inclui autotestes, QA e uma correcao limitada. Exclui espera por decisoes/provedor e funcionalidades desconhecidas. Mudanca de contrato/stop exige reestimativa antes da fase afetada; numeros nao resolvem PRD ausente nem aprovam gates.
