#!/usr/bin/env python3
"""Render full limited Markdown documents with one fixed A4 style; retain PNG only."""
from pathlib import Path
from html import escape
import re,json,tempfile
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle
from pypdf import PdfReader
import pypdfium2 as pdfium
R=Path(__file__).resolve().parents[1]
for name,file in [('Body','Arial.ttf'),('BodyBold','Arial Bold.ttf')]:
 pdfmetrics.registerFont(TTFont(name,'/System/Library/Fonts/Supplemental/'+file))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='BodyBold',italic='Body',boldItalic='BodyBold')
styles={
'p':ParagraphStyle('p',fontName='Body',fontSize=10.5,leading=14,spaceAfter=6),
'h1':ParagraphStyle('h1',fontName='BodyBold',fontSize=18,leading=22,spaceAfter=10),
'h2':ParagraphStyle('h2',fontName='BodyBold',fontSize=12,leading=16,spaceBefore=8,spaceAfter=5,keepWithNext=True),
'cell':ParagraphStyle('cell',fontName='Body',fontSize=9,leading=11.5)}
def inline(s):
 s=re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',s);s=escape(s)
 return re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',s).replace('`','')
limits={'README.md':1,'Task1/architecture-canvas.md':1,'Task1/stakeholder-matrix.md':2,'Task2/architecture-vision.md':3}
limits.update({str(p.relative_to(R)):2 for p in R.glob('Task*/adr-*.md')})
result={};out=R/'review/page-previews';out.mkdir(exist_ok=True)
with tempfile.TemporaryDirectory(prefix='africa-pages-') as tmp:
 for rel,limit in limits.items():
  story=[];lines=(R/rel).read_text().splitlines();i=0
  while i<len(lines):
   line=lines[i].strip();i+=1
   if not line:continue
   if line.startswith('|'):
    rows=[]
    while True:
     if not re.fullmatch(r'[| :\-]+',line):rows.append([Paragraph(inline(c.strip()),styles['cell']) for c in line.strip('|').split('|')])
     if i>=len(lines) or not lines[i].strip().startswith('|'):break
     line=lines[i].strip();i+=1
    n=len(rows[0]);width=A4[0]-84
    widths=[width*.24,width*.76] if n==2 else ([width*.18,width*.19,width*.12,width*.25,width*.26] if n==5 else [width/n]*n)
    t=Table(rows,colWidths=widths,repeatRows=1)
    t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#E3ECF4')),('GRID',(0,0),(-1,-1),.3,colors.HexColor('#C2D0DC')),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]));story.extend([t,Spacer(1,6)]);continue
   key='p'
   for prefix,k in [('## ','h2'),('# ','h1')]:
    if line.startswith(prefix):key=k;line=line[len(prefix):];break
   story.append(Paragraph(inline(line),styles[key]))
  pdf=Path(tmp)/(Path(rel).stem+'.pdf')
  SimpleDocTemplate(str(pdf),pagesize=A4,leftMargin=42,rightMargin=42,topMargin=38,bottomMargin=40).build(story)
  reader=PdfReader(pdf);pages=len(reader.pages);result[rel]={'pages':pages,'limit':limit,'passed':pages<=limit,'text_extracted_chars':sum(len(p.extract_text()) for p in reader.pages)}
  doc=pdfium.PdfDocument(pdf)
  stem=rel.replace('/','-').replace('.md','').lower()
  for j in range(len(doc)):
   page=doc[j];b=page.render(scale=1.5);b.to_pil().save(out/f'{stem}-page-{j+1}.png');b.close();page.close()
  doc.close()
(R/'review/page-checks.json').write_text(json.dumps({'profile':'A4 portrait, margins42/38/40pt, Arial10.5pt, line14pt; tables9pt/11.5pt, full text','documents':result},ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
if not all(x['passed'] for x in result.values()):raise SystemExit(1)
