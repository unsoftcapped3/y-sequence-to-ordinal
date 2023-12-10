let d=document.getElementById("output");
let q=document.getElementById("expr");
let t='';
let p=true;
function spans(x){return document.getElementById(x.toString());}
function c(){
  let Ac=0;
  let Cc=0;
  let ee=''
  for(i of t){
    if(i=='C'){Cc++;}
    else{Ac++;}
  }
  p=Ac-Cc==1;
  if(!p){ee=((Ac-Cc<1)?'Too many':'Not enough')+' C\'s'}
  else{
    let c=0;
    for(i of [...t.split('').keys()]){
      c+=t[i]=='C'?-1:1;
      if(c<1){p=0;ee='Mismatched C\'s';break;}
    }
  }
  if(p){
    for(i of [...Array(t.length).keys()]){spans(i).setAttribute('style','font-size=16pt;color:#000');}
  }
  else{
    for(i of [...Array(t.length).keys()]){spans(i).setAttribute('style','font-size=16pt;color:#888');}
  }
  document.getElementById('error').innerHTML=ee;
}
function f(){
  t=q.value;
  d.innerHTML='';
  [...t.split('').keys()].forEach(i=>{d.innerHTML+=`<span id='${i}'>${t[i]}</span>`;});
  c();
}
function h(x){
  if(t[x]!='C'){return[x,x];}
  let s2=x;
  let c=0;
  while(c!=1){
    s2--;
    c+=t[s2]=='C'?-1:1;
  }
  let e2=s2;
  c=0;
  while(c!=1){
    e2--;
    c+=t[e2]=='C'?-1:1;
  }
  return [s2,e2]
}
function g(x){
  if(p){
    if(x<0){return;}
    for(i of [...t.split('').keys()]){spans(i).setAttribute('style','color:#000');}
    spans(x).setAttribute('style','color:#f80')
    let s2=x-1;
    if(t[x]=='C'){
      let s2=h(x)[0];
      let e2=h(x)[1];
      for(i of [...Array(x).keys()].slice(s2)){spans(i).setAttribute('style','color:#f00');}
      for(i of [...Array(s2).keys()].slice(e2)){spans(i).setAttribute('style','color:#0f0');}
    }
    p=[x];
    v=x;
    for(i of[0,1,2]){
      if(v==t.length-1){break;}
      while(1){
        v++;
        if(t[v]!='C'){continue;}
        if(h(v)[1]<=p.at(-1)){
          p.push(v);
          break;
        }
      }
    }
    //console.log(p)
    //console.log(' ')
    let col=['#0ee','#0aa','#077']
    //console.log(p,[...p.keys()].toReversed().slice(0,-1))
    for(i of [...p.keys()].toReversed().slice(0,-1)){for(j of [...Array(p[i]+1).keys()].slice(h(p[i])[1])){if(j>x||j<h(x)[1]){spans(j).setAttribute('style',`color:${col[i-1]}`);}}}
  }
}

document.getElementById('expr').addEventListener('keyup',(e)=>{if(e.code=='Enter'){f();}});
document.getElementById('disp').addEventListener('click',(e)=>{f();});
d.addEventListener('click',(e)=>{id=e.target.tagName.toLowerCase()=='span'?Number(e.target.id):-1;g(id);});
