var lineBreakRegex=/\r?\n/g;
var itemSeparatorRegex=/[\t ,]/g;

var calculatedMountains=null;
function parseSequenceElement(s,i){
  if (s.indexOf("v")==-1||!isFinite(Number(s.substring(s.indexOf("v")+1)))){
    var numval=Number(s);
    return {
      value:numval,
      position:i,
      parentIndex:-1
    };
  }else{
    return {
      value:Number(s.substring(0,s.indexOf("v"))),
      position:i,
      parentIndex:Math.max(Math.min(i-1,Number(s.substring(s.indexOf("v")+1))),-1),
      forcedParent:true
    };
  }
}
function calcMountain(s){
  //if (!/^(\d+,)*\d+$/.test(s)) throw Error("BAD");
  var lastLayer;
  if (typeof s=="string"){
    lastLayer=s.split(itemSeparatorRegex).map(parseSequenceElement);
  }
  else lastLayer=s;
  var calculatedMountain=[lastLayer]; //rows
  while (true){
    //assign parents
    var hasNextLayer=false;
    for (var i=0;i<lastLayer.length;i++){
      if (lastLayer[i].forcedParent){
        if (lastLayer[i].parentIndex!=-1) hasNextLayer=true;
        continue;
      }
      var p;
      if (calculatedMountain.length==1){
        p=lastLayer[i].position+1;
      }else{
        p=0;
        while (calculatedMountain[calculatedMountain.length-2][p].position<lastLayer[i].position+1) p++;
      }
      while (true){
        if (p<0) break;
        var j;
        if (calculatedMountain.length==1){
          p--;
          j=p-1;
        }else{ //ignoring
          p=calculatedMountain[calculatedMountain.length-2][p].parentIndex;
          if (p<0) break;
          j=0;
          while (lastLayer[j].position<calculatedMountain[calculatedMountain.length-2][p].position-1) j++;
        }
        if (j<0||j<lastLayer.length-1&&lastLayer[j].position+1!=lastLayer[j+1].position) break;
        if (lastLayer[j].value<lastLayer[i].value){
          lastLayer[i].parentIndex=j;
          hasNextLayer=true;
          break;
        }
      }
    }
    if (!hasNextLayer) break;
    var currentLayer=[];
    calculatedMountain.push(currentLayer);
    for (var i=0;i<lastLayer.length;i++){
      if (lastLayer[i].parentIndex!=-1){
        currentLayer.push({value:lastLayer[i].value-lastLayer[lastLayer[i].parentIndex].value,position:lastLayer[i].position-1,parentIndex:-1});
      }
    }
    lastLayer=currentLayer;
  }
  return calculatedMountain;
}
function cloneMountain(mountain){
  var newMountain=[];
  for (var i=0;i<mountain.length;i++){
    var layer=[];
    for (var j=0;j<mountain[i].length;j++){
      layer.push({
        value:mountain[i][j].value,
        position:mountain[i][j].position,
        parentIndex:mountain[i][j].parentIndex,
        forcedParent:mountain[i][j].forcedParent
      });
    }
    newMountain.push(layer);
  }
  return newMountain;
}
function parseMatrix(s){
  if (!/^(\(\d*(,\d*)*\))*$/.test(s)) return [];
  var matrix=JSON.parse(
    "["+s
      .replace(itemSeparatorRegex,",")
      .replace(/\(/g,"[")
      .replace(/\)/g,"]")
      .replace(/\]\[/g,"],[")+"]");
  var columns=matrix.length;
  var rows=0;
  for (var i=0;i<columns;i++){
    if (matrix[i].length>rows){
      rows=matrix[i].length;
    }
  }
  for (var i=0;i<columns;i++){
    while (matrix[i].length<rows){
      matrix[i].push(0);
    }
  }
  return matrix;
}
function cloneMatrix(matrix){
  var newMountain=[];
  for (var i=0;i<matrix.length;i++) newMountain.push(mountain[i].slice(0));
  return newMountain;
}
var DIRECTION="D";
function Y_to_M(s){
  var mountain;
  if (typeof s=="string") mountain=calcMountain(s);
  else mountain=cloneMountain(s);
  var matrix=[];
  for (var i=0;i<mountain[0].length;i++) matrix.push([]);
  for (var h=0;h<mountain.length;h++){
    for (var i=0;i<mountain[h].length;i++){
      matrix[mountain[h][i].position+h][h]=mountain[h][i].parentIndex==-1?0:matrix[mountain[h][mountain[h][i].parentIndex].position+h][h]+1;
    }
  }
  for (var i=0;i<mountain[0].length;i++){
    while (matrix[i][matrix[i].length-1]===0&&matrix[i].length>1) matrix[i].pop();
  }
  return matrix.map(e=>"("+e.join(",")+")").join("");
}
function M_to_Y(s){
  var matrix;
  if (typeof s=="string") matrix=parseMatrix(s);
  else matrix=cloneMatrix(s);
  for (var i=0;i<matrix.length;i++){
    while (matrix[i][matrix[i].length-1]===0&&matrix[i].length>1) matrix[i].pop();
    matrix[i].push(0);
  }
  var hydra=[];
  for (var i=0;i<matrix.length;i++){
    hydra.push([]);
    for (var j=0;j<matrix[i].length;j++){
      var p=i;
      hydra[i][j]=-1;
      while (p>=0){
        if (matrix[p][j]<matrix[i][j]){
          hydra[i][j]=p;
          break;
        }
        if (j===0){
          p--;
        }else{
          p=hydra[p][j-1];
        }
      }
    }
  }
  var mountain=[];
  for (var i=0;i<matrix.length;i++){
    for (var h=0;h<matrix[i].length;h++){
      if (mountain.length-1<h) mountain.push([]);
      if (hydra[i][h]==-1){
        mountain[h].push({
          value:1,
          position:i-h,
          parentIndex:-1
        })
      }else{
        var j=0;
        while (mountain[h][j].position+h<hydra[i][h]) j++;
        mountain[h].push({
          value:NaN,
          position:i-h,
          parentIndex:j
        });
      }
    }
  }
  //Build number from ltr, ttb
  for (var i=mountain.length-1;i>=0;i--){
    if (!mountain[i].length){
      mountain.pop();
      continue;
    }
    for (var j=0;j<mountain[i].length;j++){
      if (!isNaN(mountain[i][j].value)) continue;
      var k=0; //find left-up
      while (mountain[i+1][k].position<mountain[i][j].position-1) k++;
      if (mountain[i+1][k].position!=mountain[i][j].position-1) throw Error("Mountain not complete");
      mountain[i][j].value=mountain[i][mountain[i][j].parentIndex].value+mountain[i+1][k].value;
    }
  }
  return mountain[0].map(e=>e.value).join(",");
}
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
  if(iz(a[0])&&iz(p)){
    if(!lt(a[1],[[],[ONE,[],[]],[]])){
      if(eq(log(q),q)&&iz(q[2])&&lt(a[1],[ONE,[],[]])){return [a[0],a[1],[]];}
    }
    return q;
  }
  let m=add([a[0],p,[]],q);
  if(!lt(a[1],[a[0],[suc(a[0]),[],[]],[]])){
    if(eq(log(a[1]),a[1])&&iz(a[2])&&lt(a[1],[suc(a[0]),[],[]])){return [a[0],a[1],[]];}
  }
  return m;
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

function D(M,n){
  let X=0;
  for(let i=0;i<M.length;i++){
    if(P(M,0,i)==n&&M[i][1]>0){X++;}
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
    for(j of C(M,i)){q=add(q,o(M,j));}
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

function toString(q){
  if(iz(q)){return '0';}
  if(iz(q[0])&&iz(q[1])){return (eval(toString(q[2]))+1).toString();}
  let [a,b]=s(q,[q[0],q[1],[]]);
  let m=`ψ<sub>${toString(a[0])}</sub>(${toString(a[1])})`;
  if(iz(a[1])){m=`Ω<sub>${toString(a[0])}</sub>`;}
  if(iz(a[1])&&eq(a[0],ONE)){m=`Ω`;}
  if(iz(a[0])){m=`ψ(${toString(a[1])})`}
  if(eq(a[0],[])&&eq(a[1],ONE)){m='ω';}
  else if(!eq(log([a[0],a[1],[]]),[a[0],a[1],[]])){m=`ω<sup>${toString(log(a))}</sup>`;}
//  else if(!le(l(a[1]),[suc(a[0]),[],[]])&&le(l(a[1]),[suc(a[0]),[suc(a[0]),[],[]],[]])){
//    let [f,g]=s(a[1],[suc(a[0]),[suc(a[0]),[],[]],[]]);
//  }
  function getCoef(x){
    if(iz(x[2])){return 1;}
    return getCoef(x[2])+1;
  }
  if(getCoef(a)>1){m+=getCoef(a);}
  if(!iz(b)){m+=`+${toString(b)}`;}
  return m;
}

function calculate(){
  let M=Y_to_M(document.getElementById('input').value);
  try{M=eval('['+M.replaceAll(')(','],[').replaceAll('(','[').replaceAll(')',']')+']');}
  catch(e){return;}
  M=M.map(x=>{let y=x.slice();while(y.length<3){y.push(0)}return y;});
  let A=[...Array(M.length).keys()].map(x=>D(M,x));
  if(Math.max(...A)>15){
    document.getElementById('output').innerHTML='Too complex';
    document.getElementById('output3').innerHTML='';
    let Q='<tr><th class="border">i</th><th class="border" colspan=3>M<sub>i</sub></th><th class="border">o(M,i)</th><th class="border">v(M,i)</th><th class="border">U(M,i)</th><th class="border">Children</th>';
    for(let i=0;i<M.length;i++){
      Q+='<tr>';
      let m=[i.toString(),'('+M[i][0]+',',M[i][1]+',',M[i][2]+')','?','?','?','?'];
      for(let j=0;j<m.length;j++){
        if(j==1||j==2||j==3){Q+='<td class="nborder">';}
        else{Q+='<td class="border">';}
        Q+=`${m[j]}</td>`;
      }
      Q+='</tr>';
    }
    Q+=`<tr><td>Σ</td><td colspan=7>?</td></tr>`;
    document.getElementById('output2').innerHTML=Q;
    return;
  }
  document.getElementById('output').innerHTML=toString(_o(M));
  document.getElementById('output3').innerHTML=(eq(NS(M),_o(M))?'':'<i>n.s.</i> '+toString(NS(M)));
  let Q='<tr><th class="border">i</th><th class="border" colspan=3>M<sub>i</sub></th><th class="border">o(M,i)</th><th class="border">v(M,i)</th><th class="border">U(M,i)</th><th class="border">Children</th>';
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
    let m=[i.toString(),'('+M[i][0]+',',M[i][1]+',',M[i][2]+')',toString(o(M,i)),toString(v(M,i)),(U(M,i)!=-1?U(M,i).toString():'-'),C(M,i)];
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
document.getElementById('input').value='(0,0,0)(1,1,1)(2,1,1)(3,1,0)(1,1,1)(2,1,1)(3,1,0)(1,1,0)(2,2,1)(3,2,1)(4,2,0)(2,2,1)(3,2,1)(4,2,0)(2,2,0)(3,3,1)(4,3,1)(5,3,0)(3,3,1)(4,3,1)(5,3,0)(3,3,0)(4,4,1)(5,4,1)(6,4,0)(4,4,1)(5,4,1)(6,3,0)(5,4,0)(6,5,1)(7,5,1)(8,5,0)(6,5,0)(7,6,1)(8,6,1)(9,6,0)(7,6,0)(8,7,1)(9,7,1)(10,6,0)(9,7,0)(10,8,0)';
calculate();
