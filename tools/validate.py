#!/usr/bin/env python3
"""Validate Sprint 9 structure, arithmetic and cross-file consistency; write a JSON report."""
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
import re,json,hashlib,zipfile,xml.etree.ElementTree as ET
from urllib.parse import unquote
from PIL import Image
from openpyxl import load_workbook
R=Path(__file__).resolve().parents[1];fail=[];stats={}
def check(ok,msg):
 if not ok:fail.append(msg)
def read(p):return (R/p).read_text()
expected={
'Task1':['README.md','stakeholder-matrix.md','architecture-canvas.md','contradictions.md','open-questions.md','stakeholder-map.puml','stakeholder-map.png'],
'Task2':['README.md','options-comparison.md','tco-model.xlsx','tco-methodology.md','adr-001-architecture-style.md','c4-context.puml','c4-context.png','use-cases.puml','use-cases.png','architecture-vision.md','nairobi-slide.pptx','nairobi-slide.png','nairobi-script.md'],
'Task3':['README.md','nfr-registry.md','slo/catalog.md','slo/payments.md','slo/notifications.md','quality-attribute-scenarios.md','fmea.md','adr-002-caching-strategy.md','observability.md','observability.puml','observability.png'],
'Task4':['README.md','data-residency-map.md','cloud-regions-comparison.md','adr-003-data-residency.md','c4-container.puml','c4-container.png','deployment-diagram.puml','deployment-diagram.png','failover-plan.md'],
'Task5':['README.md','capability-map.md','value-stream.puml','value-stream.png','services-per-capability.md','feature-triage.md','roadmap.md','roadmap.puml','roadmap.png','adr-004-payment-provider.md','transition-architecture.md','risk-register.md','team-and-on-call.md']}
for d,files in expected.items():
 for f in files:check((R/d/f).is_file(),f'Missing {d}/{f}')
 for f in files:
  if f!='README.md':check(f']({f})' in read(d+'/README.md'),f'Not in inventory: {d}/{f}')
for p in R.glob('Task*/**/*'):
 if p.is_file():
  check(p.name=='README.md' or bool(re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+',p.name)),f'Filename: {p}')
  check(p.suffix not in ['.svg','.pdf','.docx'],f'Forbidden final format: {p}')
  if p.suffix=='.md' and p.name!='README.md':check('## Assumptions' in p.read_text(),f'Missing assumptions: {p}')
# Generated-document links; original source bodies are evidence, not authored navigation.
def slug(s):
 s=re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',s).strip().lower();s=re.sub(r'[^\w\- ]','',s);return s.replace(' ','-')
linkcount=0
for p in R.rglob('*.md'):
 if p.parts[-2]=='sources' and p.name!='README.md':continue
 for target in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if target.startswith(('http:','https:','mailto:')):continue
  target=unquote(target.strip('<>'));file,_,anchor=target.partition('#');q=(p.parent/file).resolve() if file else p
  linkcount+=1;check(q.exists(),f'Broken link {p.relative_to(R)} -> {target}')
  if anchor and q.is_file() and q.suffix=='.md':
   anchors={slug(x) for x in re.findall(r'^#{1,6}\s+(.+)$',q.read_text(),re.M)}
   check(anchor.lower() in anchors,f'Broken anchor {p.relative_to(R)} -> {target}')
stats['local_links_checked']=linkcount
pumls=list(R.glob('Task*/*.puml'));check(len(pumls)==8,'Expected 8 diagrams');stats['plantuml_png_pairs']=len(pumls)
for p in pumls:
 check(p.with_suffix('.png').is_file(),f'Missing PNG: {p}')
 with Image.open(p.with_suffix('.png')) as im:check(im.format=='PNG' and min(im.size)>100,f'Invalid PNG: {p}')
 check('!include http' not in p.read_text(),f'Remote include {p}')
 for line in p.read_text().splitlines():
  if line.startswith('Rel('):check(len(re.findall(r'"[^"]+"',line))>=2,f'Unlabelled relation: {line}')
# Uniform ADR structure.
ads=sorted(R.glob('Task*/adr-*.md'));check(len(ads)==4,'Expected 4 ADRs');template=re.findall(r'^## (.+)$',read('templates/adr-template.md'),re.M)
for i,p in enumerate(sorted(ads,key=lambda x:x.name),1):
 check(p.name.startswith(f'adr-{i:03d}-'),f'ADR numbering {p}')
 check(re.findall(r'^## (.+)$',p.read_text(),re.M)==template,f'ADR headings differ {p}')
 check('contradictions.md' in p.read_text(),f'ADR lacks conflict reference {p}')
stats['adr_count']=len(ads)
def rows(rel):return [[c.strip() for c in x.strip('|').split('|')] for x in read(rel).splitlines() if x.startswith('|') and not re.fullmatch(r'[| :\-]+',x)]
questions=rows('Task1/open-questions.md')[1:];check(len(questions)==5,'Expected exactly 5 questions');stats['open_questions']=len(questions)
contr=rows('Task1/contradictions.md')[1:];check(len(contr)>=5,'Need >=5 contradictions');stats['contradictions']=len(contr)
qas=rows('Task3/quality-attribute-scenarios.md')[1:];check(len(qas)>=5 and all(len(r)==7 for r in qas),'QAS: ID + six fields');stats['qas']=len(qas)
fmea=rows('Task3/fmea.md')[1:]
for r in fmea:check(int(r[3])*int(r[4])*int(r[5])==int(r[6]),f'FMEA RPN {r[0]}')
check(len(fmea)>=5,'Need>=5 FMEA');stats['fmea']=len(fmea)
features=rows('Task5/feature-triage.md')[1:];check(len(features)==29,'Need29 features');check([int(r[0]) for r in features]==list(range(1,30)),'Feature numbering')
stats['features']={'total':len(features),'mvp_partial':sum('MVP' in r[2] for r in features),'excluded':sum('Исключено' in r[2] for r in features)}
check(stats['features']['mvp_partial']==6,'MVP feature count');stats['features']['deferred']=29-stats['features']['mvp_partial']-stats['features']['excluded']
cn=set(re.findall(r'CN\.[A-Z]+\.\d+',read('sources/cloud-native-checklist.md')));mapped=set(re.findall(r'CN\.[A-Z]+\.\d+',read('Task3/nfr-registry.md')));check(cn<=mapped,'CN checklist incomplete');stats['cn_items']=len(cn)
speech=read('Task2/nairobi-script.md').split('<!-- speech-start -->')[1].split('<!-- speech-end -->')[0];words=len(speech.split());check(1200<=words<=1500,'Speech length');stats['speech_words']=words
with zipfile.ZipFile(R/'Task2/nairobi-slide.pptx') as z:
 slides=[x for x in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',x)];check(len(slides)==1,'Need one slide');stats['pptx_slides']=len(slides)
 root=ET.fromstring(z.read(slides[0]));texts=root.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/main}t');check(len(texts)>=10,'PPTX not editable text');stats['pptx_text_runs']=len(texts)
receipt=json.loads(read('review/slide-validation.json'));check(receipt['finalSha256']==hashlib.sha256((R/'Task2/nairobi-slide.pptx').read_bytes()).hexdigest(),'PPTX receipt hash mismatch')
# Verify all cached formula results and cross-engine arithmetic.
f=load_workbook(R/'Task2/tco-model.xlsx',data_only=False);v=load_workbook(R/'Task2/tco-model.xlsx',data_only=True);fc=0
for s in f:
 for row in s:
  for cell in row:
   if cell.data_type=='f':
    fc+=1;cached=v[s.title][cell.coordinate]
    check(cached.value is not None and cached.data_type!='e',f'Uncalculated/error formula {s.title}!{cell.coordinate}')
stats['xlsx_formulas_with_cache']=fc;check(fc>=500,'Unexpectedly few formulas')
m=json.loads(read('tools/model-inputs.json'))
for k,res in m['results'].items():
 for cell,key in {'H20':'tco','H27':'npv','H29':'architecture_tco','H32':'launch_cpo','H33':'m12_cpo','H35':'fixed6','H36':'overbuild_vs_a'}.items():check(abs(v['TCO-'+k][cell].value-res[key])<.01,f'TCO mismatch {k}:{key}')
check(v['Summary']['B28'].value==60000 and v['Summary']['B29'].value==69000,'Underbuild incorrect')
check(abs(v['Assumptions']['B6'].value-sum(m['month_orders']))<.01,'Year1 orders != monthly sum')
stats['xlsx_sheets']=v.sheetnames
pages=json.loads(read('review/page-checks.json'));check(all(x['passed'] for x in pages['documents'].values()),'Page limits');stats['page_counts']={k:v['pages'] for k,v in pages['documents'].items()}
result={'date':datetime.now(ZoneInfo('Europe/Moscow')).date().isoformat(),'status':'passed' if not fail else 'failed','checks':stats,'failures':fail,'boundary':'Documentation/package checks only; no production SLA, benchmark, legal approval or vendor contract asserted.'}
(R/'review/validation-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result,ensure_ascii=False,indent=2))
raise SystemExit(bool(fail))
