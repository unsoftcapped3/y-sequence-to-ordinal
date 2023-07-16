let ord=[0];
let gens=[0,0,0,0,0,0,0,0];
let oldgens=[-1,-1,-1,-1,-1,-1,-1,-1];
let layer1Unlocked=0;
let unlockLayer1=0;
let stuff=0;
let tab=0;

function obsfucate(x){return [...Array(x.length)].map(x=>String.fromCodePoint(Math.min(Math.floor(Math.random()*94+33),127))).join('').replaceAll('<','>')}
function displayOrd(x){
  if(x<1e7){return x.toLocaleString('en').replaceAll(',',' ');}
  else{
    let m=0;
    let e=0;
    if(x>=1e21){
      if(x==Infinity){return obsfucate('Infinity');}
      m=x.toString().split('e')[0];
      if(!m.match(/\./)){m+='.'}
      m=m.padEnd(8,'0');
      e=x.toString().split('e')[1].slice(1);
    }
    else{
      m=`${x.toString()[0]}.${x.toString().slice(1)}`.padEnd(8,'0');
      e=x.toString().length-1;
    }
    return `${m.slice(0,5)} ${m.slice(5,8)}∙10<sup>${e}</sup>`
  }
}
function ordIncr_(){ord[0]++;}
function genIncr(n){
  if(ord[0]>=10**(n+1)*(gens[n]+1)**(n+1)){
    gens[n]++;
    ord[0]-=10**(n+1)*gens[n]**(n+1);
  }
}
function genDecr(n){
  if(gens[n]>0){
    ord[0]+=10**(n+1)*gens[n]**(n+1);
    gens[n]--;
  }
}
function genIncr10(n){
  if(ord[0]>=[...Array(10).keys()].map(x=>10**(n+1)*(gens[n]+x+1)**(n+1)).reduce((x,y)=>(x+y))){
    for(let i=0;i<10;i++){
      genIncr(n);
    }
  }
}
function doLayer1(){
  stuff+=layer1Unlocked+1+Math.floor(Math.sqrt(Math.log10(ord[0])-10-layer1Unlocked));
  layer1Unlocked++;
  let i=0;
  let c=setInterval(()=>{gens=[0,0,0,0,0,0,0,0];i++;if(i>=10){clearInterval(c);}},50);
  i=0;
  d=setInterval(()=>{ord=[0];i++;if(i>=10){clearInterval(d);}},50);
}
function transfer(n){tab=n;}


let gen0=undefined
let gen1=undefined
let gen2=undefined
let gen3=undefined
let gen4=undefined
let gen5=undefined
let gen6=undefined
let gen7=undefined

let gen0_=0
let gen1_=0
let gen2_=0
let gen3_=0
let gen4_=0
let gen5_=0
let gen6_=0
let gen7_=0

let update=setInterval(()=>{
                             document.getElementById('ord').innerHTML=displayOrd(ord[0]);
                             document.getElementById('ordrate').innerHTML=displayOrd(gen0_);

                             if(tab==0){
                               for(let i=1;i<=8;i++){
                                 document.getElementById(`t${i}-gen`).innerHTML=`x${displayOrd(gens[i-1])}`;
                                 document.getElementById(`t${i}-gen-cost`).innerHTML=displayOrd((gens[i-1]+1)**i*10**i);
                               }
                             }
                             if(tab==1){
                               document.getElementById('l1-0').innerHTML=`You have <b>${displayOrd(stuff)}</b> something`+((stuff==1)?'':'s')+', which '+(stuff==1?'is':'are')+' multiplying your';

                             }

                             if(!layer1Unlocked){document.getElementById('layer-1').style.display='none';}
                             else{document.getElementById('layer-1').style.display='inline';}
                             if(!unlockLayer1||tab!=0){
                               document.getElementById('unlock-layer-1').style.display='none';
                             }
                             else{
                               if(layer1Unlocked){document.getElementById('unlock-layer-1').innerHTML=`Sacrifice everything for ${displayOrd(layer1Unlocked+1+Math.floor(Math.sqrt(Math.log10(ord[0])-10-layer1Unlocked)))} somethings`;}
                               else{document.getElementById('unlock-layer-1').innerHTML=`Sacrifice everything for ${displayOrd(layer1Unlocked+1+Math.floor(Math.sqrt(Math.log10(ord[0])-10-layer1Unlocked)))} `+obsfucate('something');}
                               document.getElementById('unlock-layer-1').style.display='inline';
                             }

                             if(tab==0){
                               document.getElementById('l0-1').style.display='inline';
                               document.getElementById('l1-0').style.display='none';
                               document.getElementById('l1-1').style.display='none';
                               document.getElementById('l1-2').style.display='none';
                             }
                             else{
                               document.getElementById('l0-1').style.display='none';
                               document.getElementById('l1-0').style.display='inline';
                               document.getElementById('l1-1').style.display='inline';
                               for(let i=1;i<9;i++){document.getElementById(`l1-t${i}-n`).innerHTML=displayOrd((i+1)**stuff);}
                               document.getElementById('l1-2').style.display='inline';
                             }

                             if(ord[0]>=1e10*10**layer1Unlocked){unlockLayer1=1;}
                             else{unlockLayer1=0;}

                             if(oldgens[0]!=gens[0]){
                               clearInterval(gen0);
                               gen0_=gens[0]*2**stuff;
                               gen0=setInterval(()=>{ord[0]+=gen0_>50?Math.round(gen0_/50):1;},gen0_>0?(gen0_>=50?20:1000/gen0_):1e20);
                             }
                             if(oldgens[1]!=gens[1]){
                               clearInterval(gen1);
                               gen1_=gens[1]*3**stuff;
                               gen1=setInterval(()=>{gens[0]+=gen1_>50?Math.round(gen1_/50):1;},gen1_>0?(gen1_>=50?20:1000/gen1_):1e20);
                             }
                             if(oldgens[2]!=gens[2]){
                               clearInterval(gen2);
                               gen2_=gens[2]*4**stuff;
                               gen2=setInterval(()=>{gens[1]+=gen2_>50?Math.round(gen2_/50):1;},gen2_>0?(gen2_>=50?20:1000/gen2_):1e20);
                             }
                             if(oldgens[3]!=gens[3]){
                               clearInterval(gen3);
                               gen3_=gens[3]*5**stuff;
                               gen3=setInterval(()=>{gens[2]+=gen3_>50?Math.round(gen3_/50):1;},gen3_>0?(gen3_>=50?20:1000/gen3_):1e20);
                             }
                             if(oldgens[4]!=gens[4]){
                               clearInterval(gen4);
                               gen4_=gens[4]*6**stuff;
                               gen4=setInterval(()=>{gens[3]+=gen4_>50?Math.round(gen4_/50):1;},gen4_>0?(gen4_>=50?20:1000/gen4_):1e20);
                             }
                             if(oldgens[5]!=gens[5]){
                               clearInterval(gen5);
                               gen5_=gens[5]*7**stuff;
                               gen5=setInterval(()=>{gens[4]+=gen5_>50?Math.round(gen5_/50):1;},gen5_>0?(gen5_>=50?20:1000/gen5_):1e20);
                             }
                             if(oldgens[6]!=gens[6]){
                               clearInterval(gen6);
                               gen6_=gens[6]*8**stuff;
                               gen6=setInterval(()=>{gens[5]+=gen6_>50?Math.round(gen6_/50):1;},gen6_>0?(gen6_>=50?20:1000/gen6_):1e20);
                             }
                             if(oldgens[7]!=gens[7]){
                               clearInterval(gen7);
                               gen7_=gens[7]*9**stuff;
                               gen7=setInterval(()=>{gens[6]+=gen7_>50?Math.round(gen7_/50):1;},gen7_>0?(gen7_>=50?20:1000/gen7_):1e20);
                             }
                             oldgens=gens.slice()
                           },40)
