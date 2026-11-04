#!/usr/bin/env python3
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
M=json.loads((R/'tools/model-inputs.json').read_text())
M['results']={}
for key,v in M['variants'].items():
 annual=[];teams=[];trans=[]
 for y in range(5):
  mult=(1+M['salary_growth'])**y
  team=(v['product_fte'][y]*48000+v['sre_fte'][y]*60000+(v['product_fte'][y]+v['sre_fte'][y])*3000+36000)*mult
  tx=M['orders'][y]*(M['aov'][y]*M['payment_rate']+.05+2)
  oneoff=(v['prelaunch_cost']+v['setup'] if y==0 else 0)+v['annual_audit']*(1+M['inflation'])**y
  annual.append((v['infra'][y]+v['saas'][y]+tx+team+oneoff)*(1+M['reserve']))
  teams.append(team);trans.append(tx)
 monthly=[]
 for i,q in enumerate(M['month_orders']):
  infra=v['launch_infra'] if i<6 else v['m12_infra'];saas=v['launch_saas'] if i<6 else v['m12_saas']
  monthly.append((infra+saas+q*.05)*1.15)
 team0=(5*4000+5000) if key in ['A','B'] else 12*4000+2*5000
 team12=(6*4000+2*5000) if key=='A' else ((6*4000+3*5000) if key=='B' else 14*4000+4*5000)
 fte0=v['prelaunch_team'];fte12=8 if key=='A' else (9 if key=='B' else 18)
 launch_cpo=((v['launch_infra']+v['launch_saas']+team0+fte0*250+3000)/10000+25*.0216+.05+2)*1.15
 m12_cpo=((v['m12_infra']+v['m12_saas']+team12+fte12*250+3000)/100000+25*.0216+.05+2)*1.15
 fixed6=6*(v['launch_infra']+v['launch_saas']+team0+fte0*250+3000)+v['prelaunch_cost']+v['setup']
 M['results'][key]={'annual':annual,'tco':sum(annual),'npv':sum(x/(1.2)**(y+1) for y,x in enumerate(annual)), 'five_year_cpo':sum(annual)/sum(M['orders']),'launch_cpo':launch_cpo,'m12_cpo':m12_cpo,'monthly_tech':monthly,'team_annual':teams,'transaction_annual':trans,'fixed6':fixed6,'risk_year':(1-v['slo'])*525600*12000}
for k in M['results']:M['results'][k]['overbuild_vs_a']=M['results'][k]['fixed6']-M['results']['A']['fixed6']
for k,v in M['variants'].items():
 r=M['results'][k];up=(v['setup']+v['prelaunch_cost'])*1.15
 r['npv']=up+sum((x-(up if i==0 else 0))/1.2**(i+1) for i,x in enumerate(r['annual']))
 r['architecture_tco']=r['tco']-sum(r['transaction_annual'])*1.15

original=json.loads((R/'tools/model-inputs.json').read_text())['results']
for k in M['results']:
 for metric in ['tco','npv','architecture_tco','launch_cpo','m12_cpo','fixed6','overbuild_vs_a']:
  assert abs(M['results'][k][metric]-original[k][metric])<.01,(k,metric)

print(json.dumps(M['results'],ensure_ascii=False,indent=2))
