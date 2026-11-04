import fs from 'node:fs/promises';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
import path from 'node:path';
const ROOT=path.resolve(process.argv[2] ?? path.join(import.meta.dirname,'..'));
const BUILD=process.env.AF_BUILD_DIR ?? '/tmp/africa-delivery-build';
const m=JSON.parse(await fs.readFile(ROOT+'/tools/model-inputs.json','utf8'));
const wb=Workbook.create();
const names=['Summary','Assumptions','Monthly','TCO-A','TCO-B','TCO-C','Availability'];
const sheets=Object.fromEntries(names.map(n=>[n,wb.worksheets.add(n)]));
const val=(s,a,v)=>s.getRange(a).values=[[v]];
const f=(s,a,v)=>s.getRange(a).formulas=[[v]];
function format(s,last=60){
 s.showGridLines=false;s.getRange(`A1:I${last}`).format.font={name:'Arial',size:11};
 s.getRange(`A1:I${last}`).format.rowHeight=24;
 s.getRange(`A1:A${last}`).format.columnWidthPx=330;
 s.getRange(`B1:B${last}`).format.columnWidthPx=120;
 s.getRange(`C1:H${last}`).format.columnWidthPx=125;
 s.getRange(`I1:I${last}`).format.columnWidthPx=340;
 s.getRange(`C5:H${last}`).format.numberFormat='#,##0.00';
 s.getRange('A2:I2').format.font={name:'Arial',size:16,bold:true,color:'#17324D'};
 s.freezePanes.freezeRows(4);
}
function header(s,a){s.getRange(a).format={fill:'#17324D',font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:32};}
for(const s of Object.values(sheets))format(s,62);
const ass=sheets.Assumptions;
val(ass,'A2','Допущения — USD, пять лет после запуска');
ass.getRange('A4:G4').values=[['Показатель','Год 1','Год 2','Год 3','Год 4','Год 5','Источник / смысл']];header(ass,'A4:G4');
const inputs=[['Пользователи на конец года',m.users,'Зарегистрированные; не concurrency'],['Заказы / год',m.orders,'Оценка; год 1 = Monthly'],['Средний чек, USD',m.aov,'План, не рыночный факт'],['GMV, USD',null,'Заказы × AOV'],['Инфляция',Array(5).fill(m.inflation),'Оценка 5%'],['Рост ставок ФОТ',Array(5).fill(m.salary_growth),'Оценка 8%'],['Дисконт',Array(5).fill(m.discount),'Оценка 20%'],['Резерв',Array(5).fill(m.reserve),'15% прямых затрат'],['All-in payment rate',null,'60% NG ×2.30% +40% KE ×1.95%'],['SMS на заказ',Array(5).fill(2),'Лимит включает OTP и повторы'],['USD за SMS',Array(5).fill(.02),'План; quote обязателен'],['WA на заказ',Array(5).fill(1),'Платные сообщения, не conversations'],['USD за WA',Array(5).fill(.01),'План; opt-in / transfer gate'],['Доставка на заказ, USD',Array(5).fill(2),'Партнёр; условная себестоимость'],['USD / мин простоя',Array(5).fill(12000),'A1: выручка в распродажу, не постоянный убыток'],['Включать риск: 0/1',Array(5).fill(0),'0: cash base; 1: stress, не expectation'],['CFO лимит / мес',Array(5).fill(5000),'A6 P11, только первые 6 месяцев']];
inputs.forEach(([label,values,src],i)=>{let r=i+5;val(ass,`A${r}`,label);if(values)ass.getRange(`B${r}:F${r}`).values=[values];val(ass,`G${r}`,src);});
ass.getRange('B5:F21').format.fill='#FFF2CC';ass.getRange('B9:F13').format.numberFormat='0.00%';
for(let y=0;y<5;y++){let c=String.fromCharCode(66+y);f(ass,`${c}8`,`=${c}6*${c}7`);f(ass,`${c}13`,'=$B$24*$B$25+(1-$B$24)*$B$26');}
ass.getRange('A24:B29').values=[['Доля NG',.6],['NG all-in cap модели',.023],['KE all-in cap модели',.0195],['Product FTE / год',48000],['Platform FTE / год',60000],['Доплата on-call / FTE / год',3000]];
val(ass,'A30','Распределённый management / год');val(ass,'B30',36000);
ass.getRange('B24:B26').format.numberFormat='0.00%';ass.getRange('B24:B30').format.fill='#FFF2CC';
val(ass,'A33','Все цены и staffing — оценки до договоров.');val(ass,'A34','Шаблон адаптирован: 6 блоков, monthly CFO check, одноразовые T0.');
val(ass,'A35','Источники: sources/artifact-06.md; sources/README.md E01–E04, E10.');
ass.getRange('A33:I35').format.rowHeight=28;
const monthly=sheets.Monthly;val(monthly,'A2','Технические регулярные расходы по месяцам');
const starts={A:5,B:24,C:43};
for(const [key,start] of Object.entries(starts)){
 const v=m.variants[key];val(monthly,`A${start-1}`,`${key} — ${v.name}`);
 monthly.getRange(`A${start}:H${start}`).values=[['Месяц от запуска','Заказы','Инфра / мес','SaaS / лицензии','SMS + WA','С резервом','Лимит CFO','Запас / превышение']];header(monthly,`A${start}:H${start}`);
 for(let i=0;i<12;i++){let r=start+1+i;val(monthly,`A${r}`,i+1);val(monthly,`B${r}`,m.month_orders[i]);val(monthly,`C${r}`,i<6?v.launch_infra:v.m12_infra);val(monthly,`D${r}`,i<6?v.launch_saas:v.m12_saas);f(monthly,`E${r}`,`=B${r}*(Assumptions!$B$14*Assumptions!$B$15+Assumptions!$B$16*Assumptions!$B$17)`);f(monthly,`F${r}`,`=SUM(C${r}:E${r})*(1+Assumptions!$B$12)`);if(i<6){f(monthly,`G${r}`,'=Assumptions!$B$21');f(monthly,`H${r}`,`=G${r}-F${r}`);}else{val(monthly,`G${r}`,'Новый бюджет');val(monthly,`H${r}`,'Не утверждён');}}
 monthly.getRange(`B${start+1}:D${start+12}`).format.fill='#FFF2CC';
 monthly.getRange(`H${start+1}:H${start+6}`).conditionalFormats.add('cellIs',{operator:'lessThan',formula:0,format:{fill:'#FCE4D6',font:{color:'#C00000'}}});
}
f(ass,'B6','=SUM(Monthly!B6:B17)');
const labels={5:'1. Инфраструктура',6:'2. Лицензии и SaaS',7:'3. Платежи (all-in)',8:'3. SMS',9:'3. WhatsApp',10:'3. Партнёрская доставка',11:'4. Разработка / QA',12:'4. Platform / SRE',13:'4. Доплата за дежурства',14:'4. Архитектура / management',15:'5. Разработка до запуска (T0)',16:'5. Setup / legal (T0)',17:'5. Ежегодный аудит',18:'Прямые затраты',19:'Резерв',20:'Cash TCO',21:'6. Бюджет простоя, мин/год',22:'6. Stress-потери, USD',23:'TCO + включённый риск',24:'Дисконт-фактор',25:'PV cash, годовые платежи',26:'Поправка T0 к PV',27:'NPV cash с T0',29:'Архитектура без транзакций',30:'Cash TCO / заказ',32:'Стоимость заказа при запуске',33:'Стоимость заказа в M12',34:'Max технический бюджет M1–M6',35:'Фикс. расходы: T0 + 6 мес',36:'Перестройка лишняя vs A, 6 мес'};
for(const [key,v] of Object.entries(m.variants)){
 const s=sheets['TCO-'+key],st=starts[key],start=st+1,end=st+12;
 val(s,'A2',key+' — '+v.name);val(s,'A3','Шесть блоков исходного шаблона; USD; T0 + пять лет эксплуатации');
 s.getRange('A4:I4').values=[['Статья','Драйвер','Год 1','Год 2','Год 3','Год 4','Год 5','Итого / результат','Источник / допущение']];header(s,'A4:I4');
 for(const [r,l]of Object.entries(labels))val(s,'A'+r,l);
 for(const [r,l]of Object.entries({40:'План инфраструктуры / год',41:'План SaaS / год',42:'Product FTE',43:'Platform FTE'}))val(s,'A'+r,l);
 s.getRange('C40:G43').values=[v.infra,v.saas,v.product_fte,v.sre_fte];s.getRange('C40:G43').format.fill='#FFF2CC';
 f(s,'C40',`=SUM(Monthly!C${start}:C${end})`);f(s,'C41',`=SUM(Monthly!D${start}:D${end})`);
 const meta=[['SLO stress',v.slo],['T0 setup',v.setup],['T0 разработка',v.prelaunch_cost],['FTE product launch',key==='C'?12:5],['FTE SRE launch',key==='C'?2:1],['FTE product M12',key==='C'?14:6],['FTE SRE M12',key==='C'?4:key==='B'?3:2],['Аудит / год 1',v.annual_audit]];
 meta.forEach(([l,x],i)=>{val(s,'A'+(47+i),l);val(s,'C'+(47+i),x);});s.getRange('C47:C54').format.fill='#FFF2CC';s.getRange('C47').format.numberFormat='0.00%';
 for(let y=0;y<5;y++){
  const c=String.fromCharCode(67+y),a=String.fromCharCode(66+y);
  const forms={5:`=${c}40`,6:`=${c}41`,7:`=Assumptions!${a}8*Assumptions!${a}13`,8:`=Assumptions!${a}6*Assumptions!${a}14*Assumptions!${a}15`,9:`=Assumptions!${a}6*Assumptions!${a}16*Assumptions!${a}17`,10:`=Assumptions!${a}6*Assumptions!${a}18`,11:`=${c}42*Assumptions!$B$27*(1+Assumptions!$B$10)^${y}`,12:`=${c}43*Assumptions!$B$28*(1+Assumptions!$B$10)^${y}`,13:`=SUM(${c}42:${c}43)*Assumptions!$B$29*(1+Assumptions!$B$10)^${y}`,14:`=Assumptions!$B$30*(1+Assumptions!$B$10)^${y}`,15:y===0?'=$C$49':'=0',16:y===0?'=$C$48':'=0',17:`=$C$54*(1+Assumptions!$B$9)^${y}`,18:`=SUM(${c}5:${c}17)`,19:`=${c}18*Assumptions!${a}12`,20:`=SUM(${c}18:${c}19)`,21:'=(1-$C$47)*525600',22:`=${c}21*Assumptions!${a}19`,23:`=${c}20+${c}22*Assumptions!${a}20`,24:`=1/(1+Assumptions!${a}11)^${y+1}`,25:`=${c}20*${c}24`,26:y===0?'=SUM(C15:C16)*(1+Assumptions!$B$12)*(1-C24)':'=0',27:`=SUM(${c}25:${c}26)`,29:`=${c}20-SUM(${c}7:${c}10)*(1+Assumptions!${a}12)`,30:`=${c}20/Assumptions!${a}6`};
  for(const[r,eq]of Object.entries(forms))f(s,`${c}${r}`,eq);
 }
 for(const r of [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,25,26,27,29])f(s,'H'+r,`=SUM(C${r}:G${r})`);
 f(s,'H30','=H20/SUM(Assumptions!B6:F6)');
 for(const [r,i,pr,sr] of [[32,start,50,51],[33,end,52,53]]) f(s,'H'+r,`=((Monthly!C${i}+Monthly!D${i}+C${pr}*Assumptions!$B$27/12+C${sr}*Assumptions!$B$28/12+SUM(C${pr}:C${sr})*Assumptions!$B$29/12+Assumptions!$B$30/12)/Monthly!B${i}+Assumptions!$B$7*Assumptions!$B$13+Assumptions!$B$14*Assumptions!$B$15+Assumptions!$B$16*Assumptions!$B$17+Assumptions!$B$18)*(1+Assumptions!$B$12)`);
 f(s,'H34',`=MAX(Monthly!F${start}:F${start+5})`);
 f(s,'H35',`=SUM(C48:C49)+6*(Monthly!C${start}+Monthly!D${start}+C50*Assumptions!$B$27/12+C51*Assumptions!$B$28/12+SUM(C50:C51)*Assumptions!$B$29/12+Assumptions!$B$30/12)`);
 f(s,'H36',"=H35-'TCO-A'!H35");
 for(const r of [18,20,23,27,29]){s.getRange(`A${r}:H${r}`).format.fill='#E5EDF5';s.getRange(`A${r}:H${r}`).format.font.bold=true;}
 for(const r of [5,6,11,12,13,15,16,17])val(s,'I'+r,'План архитектора; входы ниже');
 for(const r of [7,8,9,10])val(s,'I'+r,'Assumptions; комиссия и доставка одинаковы для A/B/C');
 val(s,'I22','Stress при полном error budget, не ожидаемый убыток');
 val(s,'I36','50k пользователей и 10k заказов/мес; без резерва, без невозвратных лицензий');
 val(s,'I32','Steady month; T0 и ежегодный audit не включены');
 val(s,'I40','Расчёт ёмкости, не подтверждение 10M concurrent');
 s.getRange('C24:G24').format.numberFormat='0.000';
}
const sum=sheets.Summary;val(sum,'A2','Africa Delivery — сравнение TCO');
sum.getRange('A4:D4').values=[['Показатель','A — монолит','B — SOA','C — CTO']];header(sum,'A4:D4');
const sr={5:['Cash TCO, 5 лет',20],6:['Архитектура без транзакций',29],7:['NPV cash с T0',27],8:['Заказ при запуске, USD',32],9:['Заказ в M12, USD',33],10:['Заказ, среднее за 5 лет',30],11:['Ошибка overbuild, 6 мес',36],12:['Max tech M1–M6 / мес',34]};
for(const[r,[label,row]]of Object.entries(sr)){val(sum,'A'+r,label);['A','B','C'].forEach((k,i)=>f(sum,String.fromCharCode(66+i)+r,`='TCO-${k}'!H${row}`));}
val(sum,'A14','Срок до MVP, недель');sum.getRange('B14:D14').values=[[8,10,24]];
val(sum,'A15','Команда запуска, человек');sum.getRange('B15:D15').values=[[6,6,14]];
sum.getRange('B5:D12').format.numberFormat='#,##0.00';sum.getRange('B1:D18').format.columnWidthPx=175;
val(sum,'A18','A: cash-предпочтение; GO зависит от legal, PSP, Net45 и исключений.');
val(sum,'A20','TCO включает выплатные комиссии и курьерскую себестоимость; GMV не выручка.');
val(sum,'A21','Ошибка underbuild A: 10 person-month × $4k + $15k + $5k = $60k.');
val(sum,'A22','Резерв 15%; NPV 20%; потери от downtime выключены в cash TCO.');
sum.getRange('A18:I22').format.rowHeight=28;
sum.getRange('A24:B27').values=[['Underbuild: engineer-month',10],['USD / engineer-month',4000],['Параллельный запуск, USD',15000],['Внешняя проверка миграции, USD',5000]];
sum.getRange('B24:B27').format.fill='#FFF2CC';
val(sum,'A28','Underbuild, USD');f(sum,'B28','=B24*B25+B26+B27');
val(sum,'A29','Underbuild + резерв');f(sum,'B29','=B28*(1+Assumptions!$B$12)');
sum.getRange('B25:B29').format.numberFormat='#,##0.00';
const av=sheets.Availability;val(av,'A2','Цена дополнительной девятки — сценарная оценка');
av.getRange('A4:H4').values=[['Целевой SLO','Tech fixed / мес','Минут / год','Stress $12k/мин','Доплата / год','Сэкономлено минут','Break-even $/мин','Режим']];header(av,'A4:H4');
for(let i=0;i<3;i++){const r=5+i;val(av,'A'+r,[.99,.999,.9999][i]);val(av,'B'+r,[1600,2850,12000][i]);f(av,'C'+r,`=(1-A${r})*525600`);f(av,'D'+r,`=C${r}*Assumptions!$B$19`);if(i){f(av,'E'+r,`=(B${r}-B${r-1})*12`);f(av,'F'+r,`=C${r-1}-C${r}`);f(av,'G'+r,`=E${r}/F${r}`);}val(av,'H'+r,['Минимум; неприемлем','Пилот при исключении','Нужен новый бюджет'][i]);}
av.getRange('A5:A7').format.numberFormat='0.00%';val(av,'A10','Потери — stress выручки, не вероятность простоя и не margin loss.');val(av,'A11','SLO не покупается счётом: нужен fault/load test и история работы.');
val(av,'A13','По $12k/мин резервирование экономически выгодно; cash cap не позволяет обещать его сейчас.');
// Final layout: full comments and readable wrapped headers.
for(const sheet of Object.values(sheets)) {
 sheet.getRange('A4:I62').format.wrapText=true;
}
for(const name of ['TCO-A','TCO-B','TCO-C']){
 sheets[name].getRange('A4:I4').format.rowHeight=52;
 sheets[name].getRange('I5:I54').format.rowHeight=40;
}
ass.getRange('G1:G35').format.columnWidthPx=350;
ass.getRange('A4:G21').format.rowHeight=40;
ass.getRange('B5:F8').format.numberFormat='#,##0';
monthly.getRange('A5:H5').format.rowHeight=55;
monthly.getRange('A24:H24').format.rowHeight=55;
monthly.getRange('A43:H43').format.rowHeight=55;
av.getRange('A4:H7').format.rowHeight=60;
av.getRange('H4:H7').format.columnWidthPx=230;
wb.recalculate();
for(const k of ['A','B','C']){
 const s=sheets['TCO-'+k];const r=m.results[k];
 for(const[cell,expected]of Object.entries({H20:r.tco,H27:r.npv,H29:r.architecture_tco,H32:r.launch_cpo,H33:r.m12_cpo,H34:Math.max(...r.monthly_tech.slice(0,6)),H36:r.overbuild_vs_a})){
  const actual=s.getRange(cell).values[0][0];if(Math.abs(actual-expected)>.01)throw Error(`${k} ${cell}: ${actual} != ${expected}`);
 }
}
const old=sheets.Assumptions.getRange('B25').values[0][0];
val(ass,'B25',.024);wb.recalculate();const changed=sheets['TCO-A'].getRange('H20').values[0][0];if(changed<=m.results.A.tco)throw Error('Input sensitivity failed');
val(ass,'B25',old);wb.recalculate();
const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!|#SPILL!',options:{useRegex:true,maxResults:20},maxChars:2000});
console.log(errors.ndjson);
const out=await SpreadsheetFile.exportXlsx(wb);await out.save(ROOT+'/Task2/tco-model.xlsx');
await fs.mkdir(BUILD+'/previews',{recursive:true});
for(const [sheet,range]of [['Summary','A1:D29'],['Assumptions','A4:G21'],['Monthly','A4:H17'],['TCO-A','A4:H30'],['TCO-B','A4:H30'],['TCO-C','A4:H30'],['Availability','A4:H7']]){
 const blob=await wb.render({sheetName:sheet,range,scale:1.2,format:'png'});await fs.writeFile(`${BUILD}/previews/${sheet}.png`,new Uint8Array(await blob.arrayBuffer()));
}
await fs.writeFile(ROOT+'/review/tco-checks.json',JSON.stringify({date:m.date,formula_error_scan:errors.ndjson,independent_totals:'passed',changed_payment_input:'passed',restored_input:old,sheets:names},null,2));
console.log('TCO exported; seven sheet previews; totals and input change verified.');
