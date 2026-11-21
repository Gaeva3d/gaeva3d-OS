# QA UI documental — contrato 9

PASS restrito à tupla accepted-documentary-consolidation-r9-r1, MT DOC-R9-QA-01. Nenhum achado documental impeditivo no setor UI. Sem PASS de produto, acessibilidade executada, gates ou outro setor.

Revisor agent-93ed66c5-84b7-4158-bf46-1edbe1c27055; autor agent-65a76b70-79bc-4539-b8b9-840998b76a10. Não participei da autoria dos contratos revisados; minhas revisões anteriores eram QA. Nenhum parecer futuro de pares foi consultado.

Manifesto de entrada: e89c43ed3af0feece37fcfbba6688d3668798988d46649568b9d03b8cc7ebfaf; review-input: e1ca7d28e10801fde590975765502fbb8d646d2648c1330fc06dd80968840961. Todos os 157 membros conferidos por bytes e SHA-256 antes/depois.

## Critérios inspecionados

- 1101: Only confirmed eligible encrypted recoverable intent can promise queue; permission and original outcome check precede bounded retry. Fonte: save-failure-catalog.md row 1101; SQ-01 / LC-02.
- 1102: Unknown server result remains uncertain, including planned no-queue actions. Query only if safe and authorized; no automatic replay without eligible queue. Fonte: catalog row 1102, SQ-03/SQ-04, TEST-156.
- 1103 / precedence: Expected local protection failure or loss displaces queue promise and carries server uncertainty advice; planned no-copy is not misclassified as storage failure. Fonte: catalog mapping rules, SQ-02 / LC-09 / LC-10.
- 1104: Preserve draft, compare current authorized record, require explicit new operation/version; no automatic overwrite. Fonte: catalog row 1104; LC-06 / AC-155 / TEST-155.
- 1105: Block unauthorized display/query/send; current online access and same actor/company/record scope required on recovery; no leak to other account even with record edit permission. Fonte: catalog row 1105; LC-07/08, AC-178/180.
- 1106: Identify authorized invalid fields and correction; corrected data is new intent; no repeated invalid payload. Fonte: catalog row 1106; SQ-05 / AC-154 / TEST-154.
- Saved plus failed cleanup: Protected authorized operation stays Salvo; repeat only corresponding cleanup, never domain submission. v2/new references survive v1 acknowledgement. Fonte: catalog precedence; SQ-06; phase-spec confirmation row.
- Draft versus submitted intent: Before Save, local encrypted draft only. Save freezes ID/version/content; later edits remain separate. No promise all clicks enter durable queue or app executes while closed. Fonte: phase-spec P4; LC-01/05; product-behavior-r9.md.
- Wrong acknowledgement / schedule regression: Original response differs from query envelope identity; loaded aggregate version governs new edits. Absent, disabled, denied, conflict and configured states remain separate; FIELD_READ_DENIED never becomes fabricated empty/default. Fonte: SQ-07; eight serialized schedule chains and sixteen single-ID-swap negatives; ACAT8/9.
- Scope per action / integration: 39 catalog entries grant no queue eligibility themselves. Queries and two internal operations excluded from UI Save. Concrete form inventory remains future work; #2 UI implementation not opened. Fonte: save-action-bindings-r9.json; phase-spec #2 boundary.
- Accessibility specification: Literal Falha + stable number + useful action, textual field indication, announcements without color-only communication, keyboard and focus criteria present. Actual focus/ARIA/screen reader/contrast/responsiveness/help access remain NOT_EXECUTED. Fonte: catalog introduction, phase-spec P6 and C7; WCAG22 1.4.1/3.3.1/3.3.3/4.1.3.
- Recovery / open lifecycle decisions: No recovery promise after deletion/all keys lost; no production enablement of undecided abandonment/logout/revocation lifecycle. Options and recommendation explicitly unapproved, not silently chosen. Fonte: product-behavior-r9.md open decisions; phase-spec final paragraph.

## Evidência e limites

review_checks.py exit 0: 18 vínculos LC/SQ; seis códigos; 39 classificações; oito cadeias de agenda e 16 swaps com um único ID incorreto. verify_saved.py exit 0: 238 positivos/238 negativos salvos. verify_relations.py exit 0; dois grupos negativos exit 1 esperado. verify.py --requests exit 0: 39/117; verify.py exit 0. Comandos completos e saídas em commands.json. Checks não executam geradores nem produto. Preservação byte a byte dos contratos tipados é regressão documental, não nova prova operacional.

Consulta própria em consultation.json/navigation.json e primary-source-notes.json. Fontes humanas são os bytes salvos dos comentários 7026601969/7027205182; não reivindico uma nova consulta autenticada ao GitHub. Referências Shared completas e canônicas selecionadas lidas. Graphify exit 0; ranking limitado não substituiu fontes.

Decisões de abandono e destino após logout/revogação continuam OPEN e impedem habilitar os fluxos dependentes em produção; não impedem esta consolidação que as declara abertas. Inventário e elegibilidade concreta de formulários, autorização, CAS, browser, armazenamento, cifra/chaves, foco, leitor de tela, contraste, responsividade e ajuda integrada não foram executados. Raiz canônica UNKNOWN; AGENTS do projeto não localizado nem modificado. Nenhuma implementação, Git, infra, API, Drive, publicação ou configuração alterada.

Sugestão ao coordenador para registro futuro autorizado no AGENTS: estado de erro público deve combinar decisão autoritativa autorizada com evidência local; confirmação protegida mantém Salvo mesmo com limpeza pendente, e perda da cópia esperada exige 1103 sem promessa de fila. Referência: catálogo r9 e comentários humanos, limites locais do IndexedDB.

Escritas somente nesta pasta nova: scripts de revisão, recibos, notas de consulta e relatórios. Fontes e pacote de entrada permaneceram intactos. Tokens OpenBot indisponíveis; o leitor Codex não mede este host.
