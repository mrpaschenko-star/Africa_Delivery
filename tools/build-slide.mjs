import fs from 'node:fs/promises';
import path from 'node:path';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {pathToFileURL} from 'node:url';
const root=path.resolve(process.argv[2] ?? path.join(import.meta.dirname,'..'));
const work=process.env.AF_BUILD_DIR ?? '/tmp/africa-delivery-slide-build';
const skill=process.env.PRESENTATION_SKILL_DIR;
if(!skill || !process.env.RUNTIME_PYTHON) throw Error('Set PRESENTATION_SKILL_DIR and RUNTIME_PYTHON');
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const p=Presentation.create({slideSize:{width:1280,height:720}});const s=p.slides.add();s.background.fill='#F5F7FA';
function box(x,y,w,h,fill){return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0}})}
function text(t,x,y,w,h,size=24,color='#183247',bold=false){const a=box(x,y,w,h,'none');a.text=t;a.text.style={typeface:'Arial',fontSize:size,color,bold};return a;}
box(0,0,1280,12,'#087F8C');
text('AFRICA DELIVERY  /  РЕШЕНИЕ ДЛЯ НАЙРОБИ',55,35,1160,28,18,'#087F8C',true);
text('Пилот NG + KE к 15 октября',55,83,1160,62,44,'#183247',true);
text('Модульный монолит • локальные данные • партнёрские платежи и доставка',55,155,1160,45,25);
const cards=[['8 недель','6 контракторов','6 из 29 функций — частично'],['$4 025 / мес','Стартовый tech-бюджет','Максимум M1–M6: $4 887.50'],['$6.72 → $3.50','Стоимость заказа','Запуск → месяц 12']];
for(let i=0;i<3;i++){let x=55+i*398;box(x,231,374,166,'#FFFFFF');text(cards[i][0],x+23,250,332,51,36,'#087F8C',true);text(cards[i][1],x+23,310,332,34,23,'#183247',true);text(cards[i][2],x+23,353,332,31,19);}
text('Альтернативы и цена ошибки',55,425,1170,33,26,'#183247',true);
text('SOA: 10 недель   |   План CTO: 24 недели и 14 человек',55,468,1170,33,23);
text('При 50k пользователей план CTO дороже на $759k за 6 месяцев; выделение модуля — ~$60k',55,508,1170,52,22);
box(55,575,1170,82,'#FFF0D6');
text('Решить сегодня: scope • SLO пилота вместо 99.99% • CN-исключение • legal / PSP / Net45',72,589,1136,52,23,'#644514',true);
text('Плановые оценки, не договоры. M12: $12 995/мес, новый бюджет. Источники: A1/A5/A6, TCO-A/B/C, ADR-001.',55,679,1170,22,15,'#53677A');
s.speakerNotes.text='Источники: sources/artifact-01.md; artifact-05.md; artifact-06.md. Расчёт: Task2/tco-model.xlsx Summary/TCO-A/B/C. Cost/order включает текущий ФОТ, платёж, сообщения, курьера и резерв, исключает T0/ежегодный audit. Overbuild: фиксированные T0+6 месяцев C−A при 50k registered/10k orders per month. Все approval gates открыты. Полный текст: nairobi-script.md. Учебная дата launch 15.10.2026; подготовка 02.11.2026.';
await fs.mkdir(work+'/.codex-finalizer',{recursive:true});await fs.mkdir(work+'/output',{recursive:true});
const candidate=work+'/.codex-finalizer/candidate.pptx';await(await PresentationFile.exportPptx(p)).save(candidate);
await finalizePresentation({workspaceDir:work,candidatePath:candidate,finalPath:work+'/output/nairobi-slide.pptx',pythonExecutable:process.env.RUNTIME_PYTHON,integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],explicitTotalSlideCount:1,fontPolicy:{basis:'design',families:['Arial']},verifyArtifactToolImport:true,receiptPath:work+'/.codex-finalizer/slide-validation.json'});
await fs.copyFile(work+'/output/nairobi-slide.pptx',root+'/Task2/nairobi-slide.pptx');
const img=await p.export({slide:s,format:'png',scale:1.5});await fs.writeFile(root+'/Task2/nairobi-slide.png',new Uint8Array(await img.arrayBuffer()));
console.log('One editable slide finalized and preview rendered.');
