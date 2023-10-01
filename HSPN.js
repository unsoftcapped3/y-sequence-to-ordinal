// I'll make this as clear as I can

const count=(x)=>(x.match(/\(/g)||[]).length-(x.match(/\)/g)||[]).length;

function unabbreviate(x){ // removes sugar
  let y=x;
  y=y.replaceAll('ψ','psi');
  y=y.replaceAll('Ω','W');
  y=y.replaceAll('ω','w');
  y=y.replaceAll('psi','p');
  y=y.replaceAll('_','');
  y=y.replaceAll(/W\d+/g,p=>'W'.repeat(Number(p.slice(1))));
  function e(x){return x.replaceAll(/p\(W{2,}\)/g,p=>'W'.repeat(p.length-4));}
  while(e(y)!=y){y=e(y);}
  y=y.replaceAll('w','p(1)')
  y=y.replaceAll(/[1-9]\d*/g,p=>{return 'p(0)+'.repeat(Number(p)).slice(0,-1)});
  return y;
}

function abbreviate(x){ // adds sugar syntax
  let y=x;
  y=y.replaceAll(/W{2,}/g,p=>`W_${p.length}`);
  y=y.replaceAll('W','Ω');
  y=y.replaceAll('p(0)','1')
  y=y.replaceAll(/(1\+)+1/g,p=>((p.length+1)/2).toString())
  y=y.replaceAll('p(1)','ω')
  y=y.replaceAll('p','ψ');
  return y;
}

function std(x){return x==''?0:unabbreviate(abbreviate(x));} // equivalent to p(W_{x+1}) -> W_x

function paren(x,n,sw=true){ // finds the index of matching paren at index i in x; if it's given W_x and sw is true, it finds the end of the W_x
  if(x[n-1]=='W'&&sw){
    n--;
    let i=n;
    while(x[i]=='W'){i++;}
    return i-1;
  }
  let q=x[n]=='('?1:-1;
  let i=n;
  let t=0;
  while(1){t+=(x[i]=='('?1:x[i]==')'?-1:0);if(!t){break;};i+=q;}
  return i;
}


function lv(x){ // level function
  if(x=='0'){return 0;}
  else if(x.match(/^W+(\+|$)/)){return paren(x,1)+1;}
  else{
    let t=paren(x,1);
    return Math.max(0,lv(x.slice(2,t))-1);
  }
}

function arg(x){ // psi-argument of first term of x
  if(x[0]=='0'){return x;}
  if(x[0]=='W'){return 'W'.repeat(paren(x,1)+1);}
  return x.slice(2,paren(x,1))
}

function lt(x,y){ // literally x is smaller than y
  if(y=='0'){return false;}
  if(x=='0'){return true;}
  if(lv(x)==lv(y)){
    let x_=paren(x,1);
    let y_=paren(y,1);
    if(x.slice(0,x_+1)==y.slice(0,y_+1)){return lt(std(x.slice(x_+2)),std(y.slice(y_+2)));}
    return lt(arg(x),arg(y));
  }
  return lv(x)<lv(y);
}

function limit(s,n){return 'p('.repeat(n+1)+'W'.repeat(s+n)+'+'+'W'.repeat(s+n)+')'.repeat(n+1);}

function fix(s){while(count(s)){s+=')';}return s;}
function trim(s){while(s.at(-1)==')'){s=s.slice(0,-1);}return s;}

function root(x,l){ // l-th order root of x
  let b=x.length-1;
  while(x[b]==')'){b--;}
  if(x[b]=='0'){return undefined;}
  let a=b;
  while(x[a]!='+'&&x[a]!='('){a--;}
  a++;
  b++;
  let i=b
  let y=x.slice(a,b)
  if(l==1){
    while(1){
      if(i==x.length){return undefined;}
      let c=paren(x,i,false)
      if(lt(x.slice(c-1,i+1),y)){return [i,x.slice(c-1,i+1)];}
      i++;
    }
  }
  const count=(x)=>(x.match(/\(/g)||[]).length-(x.match(/\)/g)||[]).length
  let h=x.length-1;
  while(x.at(h)!='W'){h--;}
  let v=x.slice(0,root(x,l-1)[0]);
  let z=count(v);
  let q=root(x,l-1)[0]-root(x,l-1)[1].length+2; // bad root candidates
  let w=q;
  let c=root(x,l-1)[1]
  i=root(x,l-1)[0]-root(x,l-1)[1].length+1;
  //console.log(h)
  while(1){
    if(x[i]=='('){
      let m=x.slice(0,i);
      let t=count(m);
      if(t<=z){
        if(lt(fix(x.slice(i-1,h)),root(x,l-1)[1])){
          break;
        }
        q=i;
      }
    }
    i--;
  }
  q--;
  let n=root(x,l-1)[0];
  while(count(x.slice(q,n+1))>0){n++;}
  return [n,x.slice(q,n+1)];
}

function fs(x,n){ // n-th FS element of x
  if(x=='0'){return x;}
  if(x.at(-1)=='W'){
    let y=x;
    while(y.at(-1)=='W'){y=y.slice(0,-1);}
    return y+limit(x.length-y.length,n);
  }
  x=trim(x);
  let o=''
  if(x.at(-1)=='0'){
    if(count(x)==1){o=(x!='p(0')?x.slice(0,-4):'0';}
    else{
        x+='))';
        let k=paren(x,x.length-1);
        let z=x.slice(k-1,-5)+')';
        o=x.slice(0,k-1)+('+'+z).repeat(n+1);
    }
  }
  else{
    let m=false;
    let z=x;
    let y=fix(x);
    let i=0;
    while(z.at(-1)=='W'){i++;z=z.slice(0,-1);}
    let l=i;
    let j=x.length;
    let v='W'.repeat(i);
    let a=undefined;
    while(1){
      while(1){
        if(j==y.length){m=true;break;}
        a=paren(y,j,false);
        if(lt(y.slice(a-1,j+1),v)){break;}
        j++;
      }
      if(m){break;}
      v=y.slice(a-1,j+1);
      i--;
      if(!i){break;}
    }
    if(m){
      o=z+limit(l,n);
    }
    else{
      let r=root(y,l)[0]-root(y,l)[1].length+1;
      if(r<1){n++;}
      o=x.slice(0,r)+z.slice(r).repeat(n);
    }
  }
  o=fix(o).replaceAll('+)',')').replaceAll('(+','(').replaceAll('++','+').replaceAll('()','(0)');
  if(o[0]=='+'){o=o.slice(1);}
  return std(o);
}

function tfs(a,n){
  if(count(a)!=0){return 'Invalid expression';}
  return abbreviate(fs(unabbreviate(a),n));
}

function HTML(x){
  return abbreviate(x).replaceAll(/_\d+/g,x=>`<sub>${Number(x.slice(1))}</sub>`)
}


function executecommand(x){
  if(x==''){return null;}
  let c=x.split(' ')
  if(c[0]=='fs'){return HTML(tfs(c[1],Number(c[2])));}
  if(c[0]=='lt'){return lt(unabbreviate(c[1]),unabbreviate(c[2]));}
  if(c[0]=='lv'){return lv(unabbreviate(c[1])).toString();}
  return 'Unknown command.';
}

function HTMLcommand(x){
  if(x==''){return '';}
  let c=x.split(' ')
  if(c[0]=='fs'){return `fs<br>${HTML(unabbreviate(c[1]))} ${c[2]}`;}
  if(c[0]=='lt'){return `lt ${HTML(unabbreviate(c[1]))} ${HTML(unabbreviate(c[2]))}`;}
  if(c[0]=='lv'){return `lv ${HTML(unabbreviate(c[1]))}`;}
  return x;
}

function executecommands(x){
  x=x.split('\n');
  y=''
  for(let i of x){
    y+='<span style="color:#999">'+HTMLcommand(i)+'</span><br>\n'
    let k=executecommand(i);
    y+=(k==null)?'':k;
    y+='<br>\n<br>\n';
  }
  return y;
}

function calculate(){
  document.getElementById('output').innerHTML=executecommands(document.getElementById('input').value);
}

calculate();

