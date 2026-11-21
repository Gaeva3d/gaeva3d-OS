"""Assemble immutable documentary artifacts; no project application or network."""
import hashlib
import json
from pathlib import Path
from datetime import datetime, timezone
from zipfile import ZipFile, ZIP_DEFLATED

BASE = Path('C:/Users/teste/OpenBot/Shared/tfd-native-adaptation/gaeva-doc-review-20261118/MOD-001')
# Windows extended paths preserve the original deeply nested reviewed filenames.
OUT = Path('//?/' + (BASE / 'delivery-accepted-r9-r2').as_posix())
PACKET = 'accepted-documentary-consolidation-r9-r1'
PIN = 'e89c43ed3af0feece37fcfbba6688d3668798988d46649568b9d03b8cc7ebfaf'
SOURCES = [
    (PACKET, 'manifest.json', PIN),
    ('qa-accepted-r9-r1-spec', 'manifest.json', '4bbce93c24ba3ddd1e931d37350cf84cb2854934905ca67b3a2cf4148b8c8da3'),
    ('qa-accepted-r9-r1-backend', 'manifest.json', 'a57a0132284d3464ba01a1308e4973e8e64454b426e130d675ec8ea53c1f9ff6'),
    ('qa-accepted-r9-r1-ui', 'manifest-v2.json', '9ff37460c4e50c5ba0e129a8b7063f4b258fb4b4dd51bf29c1dc2902fd59ec4f'),
    ('qa-accepted-r9-r1-security', 'manifest.json', '4f5a69fb1b58ef7b1da50f70a4f99213e4fc4d730fcdd718b4511e6825110bfa'),
]

def sha(data):
    return hashlib.sha256(data).hexdigest()

def read_json(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))

def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def member(root, name):
    p = (root / name).resolve()
    if not p.is_relative_to(root.resolve()):
        raise ValueError(f'Out-of-root manifest member: {name}')
    return p

inputs = {}
manifest_members = 0
for folder, manifest_name, expected in SOURCES:
    root = BASE / folder
    raw = (root / manifest_name).read_bytes()
    assert sha(raw) == expected, (folder, 'manifest drift')
    inputs[(folder, manifest_name)] = raw
    manifest = json.loads(raw.decode('utf-8-sig'))
    for f in manifest['files']:
        data = member(root, f['path']).read_bytes()
        assert sha(data) == f['sha256'], (folder, f['path'], 'hash')
        assert len(data) == f['bytes'], (folder, f['path'], 'size')
        key = (folder, f['path'])
        if key in inputs:
            assert inputs[key] == data
        inputs[key] = data
        manifest_members += 1

review_input = read_json(BASE / PACKET / 'review-input.json')
register = []
for folder, _, manifest_hash in SOURCES[1:]:
    root = BASE / folder
    finding = read_json(root / 'findings.json')
    assert finding['verdict'] == 'PASS', folder
    stage_name = 'stage_receipt-v2.json' if folder.endswith('-ui') else 'stage_receipt.json'
    stage = read_json(root / stage_name)
    for key in ('task', 'view', 'spec', 'catalog', 'errors', 'acceptance', 'patch'):
        assert stage['artifacts'][key]['sha256'] == review_input['artifacts'][key]['sha256'], (folder, key)
    assert stage['actor'] != 'agent-65a76b70-79bc-4539-b8b9-840998b76a10'
    register.append({'folder': folder, 'verdict': 'PASS_DOCUMENTARY_ONLY', 'actor': stage['actor'],
                     'manifest_sha256': manifest_hash, 'stage_receipt': stage_name,
                     'findings_sha256': sha((root / 'findings.json').read_bytes()), 'input_manifest_sha256': PIN})
assert len({r['actor'] for r in register}) == 4
coverage = read_json(BASE / 'qa-accepted-r9-r1-spec' / 'coverage-findings.json')
assert coverage['verdict'] == 'PASS'

OUT.mkdir(exist_ok=False)
for (folder, name), data in inputs.items():
    target = OUT / folder / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)

write_json(OUT / 'review-register.json', {'task_id': 'GAEVA-MOD-001', 'contract_revision': 9,
    'packet_manifest_sha256': PIN, 'coverage_complement_r8_r9': 'PASS_DOCUMENTARY_ONLY',
    'reviews': register, 'formal_gate': 'UNKNOWN', 'implementation_authorized': False,
    'publication_performed': False, 'runtime_validated': False})
write_json(OUT / 'acceptance-record.json', {
    'recorded_at_utc': datetime.now(timezone.utc).isoformat(),
    'source': 'Current human conversation, Nov 20 2026; exact supplied wording',
    'human_words': ['aprovei leia lá e prossiga', 'não me pergunta mais nada só me entraga no final vou sair'],
    'scope': 'Documentary acceptance and continuation of documentary consolidation r8/r9; four independent reviews performed subsequently.',
    'formal_gate': 'UNKNOWN; no retrospective workflow approval event created',
    'upstream_human_comments': [
        'https://github.com/Gaeva3d/gaeva3d-OS/issues/1#issuecomment-7026601969',
        'https://github.com/Gaeva3d/gaeva3d-OS/issues/1#issuecomment-7027205182'],
    'not_authorized_by_this_record': ['product implementation', 'DB or infrastructure changes', 'publication', 'merge', 'deploy']})

README = '''# Fundação do GAEVA — entrega documental r9

Consolidação documental concluída com quatro PASS independentes atuais: Spec, Backend, UI documental e segurança operacional documental. A cobertura complementar r8/r9 recebeu PASS separado. O aceite informado pelo humano está em acceptance-record.json; não foi convertido em gate operacional.

## O que foi consolidado

Contratos da Fundação, rascunhos locais cifrados, intenções imutáveis de salvamento, fila durável elegível e seis códigos de falha. O salvamento só é confirmado após a confirmação protegida do servidor. A retomada verifica a autorização e o resultado da operação original antes de qualquer repetição permitida. Edições novas e conflitos são preservados. São contratos e testes documentais, ainda sem implementação ou ensaio do produto.

## Leitura do produto

- [Spec completa](accepted-documentary-consolidation-r9-r1/candidate/docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/phase-spec.md)
- [Falhas 1101–1106](accepted-documentary-consolidation-r9-r1/candidate/docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/save-failure-catalog.md)
- [Cenários complementares de aceite](accepted-documentary-consolidation-r9-r1/candidate/docs/gaeva/retomada-tfd/transformacao-filaops/spec/modules/MOD-001/save-acceptance-r9.json)
- [Task r9 e responsáveis](accepted-documentary-consolidation-r9-r1/candidate/docs/gaeva/retomada-tfd/transformacao-filaops/spec/tasks/MOD-001/task.md)
- [Limites e instruções internas dos agentes](accepted-documentary-consolidation-r9-r1/internal-governance.md)

A Task contém rotas internas do framework TFD para os agentes. Essas rotas organizam a entrega; não definem a arquitetura de software do GAEVA. A leitura de produto começa pela spec e pelos comportamentos acima. Os artefatos revisados foram copiados sem alterar seus bytes.

## Pareceres e verificação

- [QA Spec](qa-accepted-r9-r1-spec/report.md) e [cobertura complementar](qa-accepted-r9-r1-spec/coverage-report.md)
- [QA Backend](qa-accepted-r9-r1-backend/report.md)
- [QA UI documental](qa-accepted-r9-r1-ui/report.md)
- [Segurança operacional documental](qa-accepted-r9-r1-security/review.md)

review-register.json vincula os quatro atores independentes, pareceres e hashes à mesma revisão. Os comandos e exits ficam nas respectivas pastas de QA e no [relatório autoral](accepted-documentary-consolidation-r9-r1/delivery-report.md). Os verificadores locais passaram; negativos de troca de ID retornaram exit 1 esperado. Isso demonstra verificações documentais e de fixtures, não comportamento do ERP em execução.

45 caminhos são propostas de aplicação, com sete preimages e sete arquivos apenas de contexto. combined.patch não foi aplicado. Não copiar a árvore candidate inteira para uma pasta de projeto.

## Limites preservados

Prazo de abandono e destino da cópia após logout/revogação continuam OPEN, com alternativas e recomendação na documentação. Nenhuma decisão foi inventada; recursos dependentes dessas políticas não podem ser habilitados em produção.

Gate formal UNKNOWN; raiz canônica para aplicação não comprovada. A0 FAILED; P1 OPEN; P2/P3 não liberadas. RPO zero e RTO de até cinco minutos não foram medidos. Estimativas devem ser revistas antes das fases ampliadas. Não houve código de produto, banco, infraestrutura, restauração, failover, build, commit, publicação, merge ou deploy. As Tasks #2–#11 não foram revisadas nesta consolidação.

O conteúdo da Issue #1 não foi atualizado por esta entrega: a versão antiga publicada não equivale a este pacote r9. O pacote pode ser lido diretamente pelos arquivos anexados, sem depender do acesso ao Project.

Este ZIP inclui os cinco manifestos atuais e todos os membros por eles declarados. Referências históricas externas permanecem apontadas às suas origens; o ZIP não é uma exportação completa de todo o histórico do projeto.
'''
(OUT / 'README.md').write_text(README, encoding='utf-8')
(OUT / 'build_r9_delivery.py').write_bytes(Path(__file__).read_bytes())

payload = sorted(p for p in OUT.rglob('*') if p.is_file())
delivery = {'task_id': 'GAEVA-MOD-001', 'contract_revision': 9,
    'input_manifests': [{'folder': f, 'name': n, 'sha256': h} for f, n, h in SOURCES],
    'files': [{'path': p.relative_to(OUT).as_posix(), 'sha256': sha(p.read_bytes()), 'bytes': p.stat().st_size} for p in payload]}
write_json(OUT / 'delivery-manifest.json', delivery)
payload.append(OUT / 'delivery-manifest.json')
archive = OUT / 'GAEVA-MOD-001-r9-documental-consolidado.zip'
with ZipFile(archive, 'x', compression=ZIP_DEFLATED) as z:
    for p in payload:
        z.write(p, p.relative_to(OUT).as_posix())
with ZipFile(archive) as z:
    assert z.testzip() is None
    assert len(z.namelist()) == len(payload)
    for p in payload:
        assert z.read(p.relative_to(OUT).as_posix()) == p.read_bytes()
for (folder, name), data in inputs.items():
    assert member(BASE / folder, name).read_bytes() == data, ('source drift after assembly', folder, name)
checks = {'status': 'PASS_ASSEMBLY_ONLY', 'input_manifests_verified': len(SOURCES),
    'input_manifest_members_verified': manifest_members, 'independent_review_count': 4,
    'current_coverage_pass': True, 'zip_members': len(payload), 'zip_crc_and_exact_readback': True,
    'source_no_drift': True, 'zip_sha256': sha(archive.read_bytes()),
    'zip_bytes': archive.stat().st_size, 'product_or_runtime_tested': False,
    'command': 'python -B build_r9_delivery.py', 'exit_code': 0,
    'previous_attempt': {'folder': 'delivery-accepted-r9-r1', 'exit_code': 1,
        'reason': 'Windows path length while copying unchanged artifacts',
        'resolution': 'New output r2 with Windows extended paths; partial r1 preserved'}}
write_json(OUT / 'delivery-checks.json', checks)
print(json.dumps(checks, ensure_ascii=False))
