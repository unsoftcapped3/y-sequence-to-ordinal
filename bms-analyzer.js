const ZERO=[];
const ONE=[[],[],[]];

function iz(a){
  return a.length==0;
}

function eq(a,b){
  if(typeof(a)=='number'){return a==b;}
  if(iz(a)||iz(b)){return iz(a)==iz(b);}
  return eq(a[0],b[0])&&eq(a[1],b[1])&&eq(a[2],b[2]);
}

function lt(a,b){
  if(iz(b)){return false;}
  if(iz(a)){return true;}
  if(!eq(a[0],b[0])){return lt(a[0],b[0]);}
  if(!eq(a[1],b[1])){return lt(a[1],b[1]);}
  return lt(a[2],b[2]);
}

function gt(a,b){
  return !(lt(a,b)||eq(a,b))
}

function add(a,b){
  if(iz(a)){return b;}
  if(iz(b)){return a;}
  if(lt([a[0],a[1],[]],[b[0],b[1],[]])){return b;}
  return [a[0],a[1],add(a[2],b)];
}

function suc(a){return add(a,ONE);}

function sub(a,b){
  if(iz(a)){return [];}
  if(iz(b)){return a;}
  if(gt([a[0],a[1],[]],[b[0],b[1],[]])){return a;}
  return sub(a[2],b[2]);
}

function s(a,b){
  if(iz(a)){return [[],[]];}
  if(lt([a[0],a[1],[]],b)){return [[],a];}
  return [[a[0],a[1],s(a[2],b)[0]],s(a[2],b)[1]];
}

function l(a){
  if(iz(a)){return [];}
  if(iz(a[2])){return a;}
  return l(a[2]);
}

function ttc(a,b){
  if(iz(a)){return [];}
  if(iz(ttc(a[2],b))&&lt([a[0],a[1],[]],[b,[],[]])){return [];}
  return [a[0],a[1],ttc(a[2],b)];
}

function exp(a){
  if(lt(a,[[],[ONE,[],[]],[]])){return [[],a,[]];}
  let p=s(a[1],[suc(a[0]),[],[]])[0];
  return [a[0],add(p,sub(a,[a[0],p,[]])),[]];
}

function log(a){
  if(iz(a)){return [];}
  let [p,q]=s(a[1],[suc(a[0]),[],[]]);
  if(iz(a[0])&&iz(p)){return q;}
  return add([a[0],p,[]],q);
}

function P(M,r,n){
  if(r==-1){return n-1;}
  let q=P(M,r-1,n);
  while(q>-1&&M[q][r]>=M[n][r]){q=P(M,r-1,q);}
  return q;
}

function C(M,n){
  let X=[];
  for(let i=0;i<M.length;i++){
    if(P(M,0,i)==n){X.push(i);}
  }
  return X;
}

function U(M,n){
  if(M[n][1]==0||M[n][2]==1||n+1==M.length){return -1;}
  let m=P(M,1,n);
  let L=[M[m][0]+1,M[n][1],M[m][2]+1];
  if(P(M,1,n)==P(M,1,n+1)&&eq(M[n+1],L)){return n+1;}
  let q=n;
  while(q!=-1){
    q=P(M,0,q);
    if(P(M,1,n)==P(M,1,q)&&eq(M[q],L)&&M[n+1][0]>M[q][0]){return q;}
  }
  return -1;
}

function v(M,n){
  if(M[n][1]==0){return [];}
  if(M[n][2]==0){
    let u=U(M,n)>=0?l(v(M,U(M,n))):ONE;
    return add(v(M,P(M,1,n)),u);
  }
  let p=ONE;
  for(i of C(M,n)){
    if(!eq(M[i],[M[n][0]+1,M[n][1],1])){continue;}
    let q=[];
    for(j of C(M,i)){q=add(q,exp(o(M,j)));}
    p=add(p,exp(q));
  }
  return add(v(M,P(M,1,n)),exp(p));
}

function o(M,n){
  let S=[];
  let u=[...Array(M.length).keys()].map(x=>U(M,x));
  for(i of C(M,n)){
    if(eq(M[i],[M[n][0]+1,M[n][1],1])){continue;}
    if(u.includes(i)){
      let c=C(M,i);
      if(c.length){if(eq(M[c.at(-1)],[M[i][0]+1,M[i][1],1])){continue;}}
      else{continue;}
    }
    S=add(S,o(M,i));
  }
  return [v(M,n),S,[]];
}

function _o(M){
  let S=[];
  for(let i=0;i<M.length;i++){if(eq(M[i],[0,0,0])){S=add(S,o(M,i));}}
  return sf(S);
}

function NS(M){
  let S=[];
  for(let i=0;i<M.length;i++){if(eq(M[i],[0,0,0])){S=add(S,o(M,i));}}
  return S;
}

function sp(a,b,c){
  if(iz(c)){return [a,b,[]];}
  if(lt(b,c[1])&&gt(c,[a,[],[]])){
    let t=ttc(c[1],suc(c[0]));
    console.log(t);
    return sp(a,add(t,sub([c[0],c[1],[]],[c[0],t,[]])),c[2]);
  }
  return sp(a,add(b,[c[0],c[1],[]]),c[2]);
}

function sf(a){
  if(iz(a)){return [];}
  return add(sp(sf(a[0]),[],sf(a[1])),sf(a[2]));
}

function createTable(X){return X.map(x=>'<tr>'+x.map(y=>'<td>'+y+'</td>').join('')+'</tr>').join('');}

function toString(a){
  if(iz(a)){return '0';}
  if(iz(a[0])&&iz(a[1])){return (eval(toString(a[2]))+1).toString();}
  let m=`ψ<sub>${toString(a[0])}</sub>(${toString(a[1])})`;
  if(iz(a[1])){m=`Ω<sub>${toString(a[0])}</sub>`;}
  if(iz(a[1])&&eq(a[0],ONE)){m=`Ω`;}
  if(iz(a[0])){m=`ψ(${toString(a[1])})`}
  if(eq(a[0],[])&&eq(a[1],ONE)){m='ω';}
  else if(!eq(log([a[0],a[1],[]]),[a[0],a[1],[]])){m=`ω<sup>${toString(log(a))}</sup>`;}
  if(!iz(a[2])){m+=`+${toString(a[2])}`;}
  return m;
}

function calculate(){
  let M=document.getElementById('input').value;
  try{M=eval('[['+M.slice(1,-1).replaceAll(')(','],[')+']]');}
  catch(e){return;}
  M=M.map(x=>{let y=x.slice();while(y.length<3){y.push(0)}return y;});
  document.getElementById('output').innerHTML=toString(_o(M));
  document.getElementById('output3').innerHTML=(eq(NS(M),_o(M))?'':'<i>n.s.</i> '+toString(NS(M)));
  let Q='<tr><th class="border">#</th><th class="border" colspan=3>Column</th><th class="border">o(M,i)</th><th class="border">v(M,i)</th><th class="border">U(M,i)</th><th class="border">Children</th>';
  let u=[...Array(M.length).keys()].map(x=>U(M,x));
  for(let i=0;i<M.length;i++){
    Q+='\n';
    if(eq(M[i],[0,0,0])){Q+='<tr style="background-color:cyan">';}
    else if(u.includes(i)){
      let c=C(M,i);
      if(c.length){
        if(eq(M[c.at(-1)],[M[i][0]+1,M[i][1],1])){Q+='<tr style="color:#bbb;background-color:yellow">'}
        else{Q+='<tr style="background-color:lime">'}
      }
      else{Q+='<tr style="color:#bbb;background-color:yellow">';}
    }
    else if(M[i][2]==1&&eq(M[P(M,0,i)],[M[i][0]-1,M[i][1],1])){Q+='<tr style="color:#bbb;">';}
    else{Q+='<tr>'}
    let m=[i.toString(),'('+M[i][0]+',',M[i][1]+',',M[i][2]+')',toString(o(M,i)),toString(v(M,i)),(U(M,i)!=-1?U(M,i).toString():'-'),(C(M,i).length!=0?C(M,i):'-')];
    for(let j=0;j<m.length;j++){
      if(j==1||j==2||j==3){Q+='<td class="nborder">';}
      else{Q+='<td class="border">';}
      Q+=`${m[j]}</td>`;
    }
    Q+='</tr>';
  }
  Q+=`<tr><td>Σ</td><td colspan=7>${toString(NS(M))}</td></tr>`;
  document.getElementById('output2').innerHTML=Q;
}
document.getElementById('input').value='(0)(1,1,1)(2,1,1)(3,1)(1,1,1)(2,1,1)(3,1)(1,1)(2,2,1)(3,2,1)(4,2)(2,2,1)(3,2,1)(4,1)(3,2)(4,3,1)(5,3,1)(6,3)';
calculate();