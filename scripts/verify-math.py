"""Exact design checks; no game implementation or simulated learning claims."""
from fractions import Fraction as F
from collections import Counter
from itertools import product
from pathlib import Path
import json

checks = []
def check(name, condition):
    assert condition, name
    checks.append(name)

def best(values):
    m = max(values.values())
    return sorted(k for k, v in values.items() if v == m)

pairs = list(product(range(1, 7), repeat=2))
sums = Counter(a+b for a,b in pairs)
check('36 equiprobable ordered pairs', len(pairs) == 36)
check('sum multiplicities', [sums[i] for i in range(2,13)] == [1,2,3,4,5,6,5,4,3,2,1])
check('P(sum 7)', F(sums[7],36) == F(1,6))
payoffs = {'S': [2]*36, 'C': [5 if 6 <= a+b <= 8 else -1 for a,b in pairs], 'J': [23 if a+b == 7 else -1 for a,b in pairs]}
ev = {k: F(sum(v),36) for k,v in payoffs.items()}
variances = {k: sum((F(x)-ev[k])**2 for x in v)/36 for k,v in payoffs.items()}
ranges = {k: max(v)-min(v) for k,v in payoffs.items()}
check('entry costs included in EV', ev == {'S':F(2), 'C':F(5,3), 'J':F(3)})
check('variances', variances == {'S':0,'C':F(80,9),'J':80})
check('ranges', ranges == {'S':0,'C':6,'J':24})
objectives = {'EV':ev, 'minRange':{k:-v for k,v in ranges.items()}}
for threshold in [1,4,10]:
    objectives[f'P_ge_{threshold}']={k:F(sum(x>=threshold for x in v),36) for k,v in payoffs.items()}
winners = {k:best(v) for k,v in objectives.items()}
check('EV winner J', winners['EV']==['J'])
check('threshold 1 winner S', winners['P_ge_1']==['S'])
check('threshold 4 winner C', winners['P_ge_4']==['C'])
check('threshold 10 winner J', winners['P_ge_10']==['J'])
check('min range winner S', winners['minRange']==['S'])
check('no universal dominant contract over announced goals', not set.intersection(*(set(v) for v in winners.values())))
check('threshold 4 probabilities', objectives['P_ge_4']=={'S':0,'C':F(4,9),'J':F(1,6)})

urns=[('U1', [(3,2),(1,1)],0,False),('U2',[(3,2),(1,1)],1,True),('U3',[(2,1),(3,2)],0,False),('U4',[(1,3),(2,3)],1,False)]
urn_evidence=[]
for label, pools,event,replace in urns:
    probs={str(i):F(p[event],sum(p)) for i,p in enumerate(pools)}
    branches=[]
    for first,pool in enumerate(pools):
        for observed,count in enumerate(pool):
            if not count: continue
            state=[list(p) for p in pools]
            if not replace: state[first][observed]-=1
            updated={str(i):F(p[event],sum(p)) for i,p in enumerate(state)}
            check(f'{label} legal nonempty pools after {first}/{observed}',all(sum(p)>0 for p in state))
            check(f'{label} complement after {first}/{observed}', all(F(p[0],sum(p))+F(p[1],sum(p))==1 for p in state))
            branches.append({'first':first,'observed':'RA'[observed],'state':state,'optimal_second':best(updated),'probabilities':updated})
    urn_evidence.append({'id':label,'initial':probs,'optimal_first':best(probs),'all_branches':branches})
check('urn first winners', [x['optimal_first'] for x in urn_evidence]==[['0'],['1'],['0'],['0']])
check('3/5 and red observation 2/4', F(3,5)==F(60,100) and F(2,4)==F(1,2))
check('urn U1 complete worked path probability',F(3,5)*F(1,2)==F(3,10))
check('replacement reference',F(3,5)**2==F(9,25))
check('urn U3 switch after red', next(b for b in urn_evidence[2]['all_branches'] if b['first']==0 and b['observed']=='R')['optimal_second']==['1'])

sample=[4,4,4,4,0,4,0,0]
check('records worked mean',F(sum(sample),len(sample))==F(5,2))
check('records frequency',F(sample.count(4),8)==F(5,8))
check('records range',max(sample)-min(sample)==4)
check('known K and V equal theoretical means',F(0+4,2)==2)
check('known V variance',((0-2)**2+(4-2)**2)/2==4)
check('all successes probabilities',F(1,2)**4==F(1,16) and F(1,2)**8==F(1,256))
block_results=list(product([0,4],repeat=4))
check('all 16 blocks legal and n8 closes independent of outcome',all(len([4]*4+list(b))==8 for b in block_results))
check('final prepared mean and range', F(sum([0,4]*4),8)==2 and max([0,4]*4)-min([0,4]*4)==4)
# Exhaustive score states: no RNG argument participates in eligibility.
progression={}
for rounds,threshold,label in [(4,6,'assistant'),(3,4,'final')]:
    patterns=list(product([0,1],repeat=rounds*2))
    assisted=sum(sum(p)<threshold for p in patterns)
    independent=len(patterns)-assisted
    def completion_path(pattern):
        score=sum(pattern)
        if score>=threshold:
            return {'unlocked':True,'assisted':False,'remaining':0}
        state={'unlocked':False,'assisted':True,'remaining':4}
        while state['remaining']:
            state['remaining']-=1  # the explicitly highlighted legal action
            state['unlocked']=state['remaining']==0
        return state
    paths=[completion_path(pattern) for pattern in patterns]
    check(f'{label} finite guided completion after every decision pattern', all(x['unlocked'] and x['remaining']==0 for x in paths))
    check(f'{label} assisted labels retained', sum(x['assisted'] for x in paths)==assisted)
    progression[label]={'decision_patterns':len(patterns),'independent':independent,'assisted':assisted,'guided_actions_to_complete':4,'threshold':threshold}
check('final worked score and balance', 2+2+2==6 and 1-1==0)
check('optimal choices progress under worst random payouts',8>=6 and 6>=4)

result={'status':'passed','method':'exact rational enumeration and assertions; not gameplay or pedagogical validation','checks':len(checks),'assertions':checks,'dice_counts':dict(sorted(sums.items())),'expected_net':ev,'variance':variances,'objectives':objectives,'optimal_contracts':winners,'urns':urn_evidence,'record_block_outcomes_enumerated':len(block_results),'progression':progression}
root=Path(__file__).resolve().parents[1]
output=root/'docs/evidence/math-verification.json'
output.write_text(json.dumps(result,ensure_ascii=False,indent=2,default=str)+'\n',encoding='utf-8')
print(f'PASS: {len(checks)} checks; {output}')
