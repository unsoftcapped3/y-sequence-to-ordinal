const count=(x)=>(x.match(/\(/g)||[]).length-(x.match(/\)/g)||[]).length;

function unabbreviate(x){ // removes sugar
  let y=x;
  y=y.replaceAll('_','');
  y=y.replaceAll('ψ1','P');
  y=y.replaceAll('ψ','psi');
  y=y.replaceAll('c','P(0)');
  y=y.replaceAll('W','Ω');
  y=y.replaceAll('Ω','p(P(0))');
  y=y.replaceAll('ω','w');
  y=y.replaceAll('psi','p');
  y=y.replaceAll(/W\d+/g,p=>'W'.repeat(Number(p.slice(1))));
  y=y.replaceAll('L','p(P(P(0)))');
  y=y.replaceAll('R','p(P(P(0)+P(0)))');
  y=y.replaceAll('J','p(P(P(P(0))))');
  y=y.replaceAll('I','p(P(d))');
  y=y.replaceAll('d','p(P(P(0))+P(0))');
  y=y.replaceAll('w','p(1)')
  y=y.replaceAll(/[1-9]\d*/g,p=>{return 'p(0)+'.repeat(Number(p)).slice(0,-1)});
  return y;
}

function abbreviate(x){
//  if(x[0]=='P'){
//    if(x=='P(0)'){return 'Ω';}
//    //...
//  }
  x=x.replaceAll('p(0)','1');
  x=x.replaceAll('p(1)','ω');
  x=x.replaceAll(/(1\+)+1/g,p=>((p.length+1)/2).toString());
  x=x.replaceAll('p(P(0))','Ω');
  x=x.replaceAll('p(P(P(0)))','L');
  x=x.replaceAll('p(P(P(0)+P(0)))','R');
  x=x.replaceAll('p(P(p(P(P(0))+P(0))))','I');
  x=x.replaceAll('p(P(P(0))+P(0))','d');
  x=x.replaceAll('p(P(P(P(0))))','J');
  x=x.replaceAll('P(0)','c');
  x=x.replaceAll('P','ψ1');
  x=x.replaceAll('p','ψ');
  return x;
}

function HTML(x){
  return abbreviate(x).replaceAll('ψ1','ψ<sub>1</sub>');
}

function paren(x,n){
  console.log()
  let q=x[n]=='('?1:-1;
  let i=n;
  let t=0;
  while(1){t+=(x[i]=='('?1:x[i]==')'?-1:0);if(!t){break;};i+=q;}
  return i;
}

function firstTerm(x){
  console.log()
  let m=paren(x,1);
  return[x.slice(0,m+1),x.slice(m+2)||'0'];
}

function trimTerm(x){
  console.log()
  let m=paren(x,x.length-1);
  return[x.slice(0,m-2)||'0',x.slice(m-1)];
}

function trim(s){while(s[s.length-1]==')'){s=s.slice(0,-1);}return s;}

function arg(x){
  console.log()
  return firstTerm(x)[0].slice(2,-1);
}

function lt(x,y){
  console.log()
  if(y=='0'){return false;}
  if(x=='0'){return true;}
  if(x[0]=='p'&&y[0]=='P'){return true;}
  if(x[0]=='P'&&y[0]=='p'){return false;}
  if(arg(x)!=arg(y)){return lt(arg(x),arg(y));}
  return lt(firstTerm(x)[1],firstTerm(y)[1]);
}

function exp(x){
  console.log()
  if(lt(x,'P(0)')){return'0';}
  x=arg(x);
  let y='';
  while(lt('P(0)',firstTerm(x)[0])||(firstTerm(x)[0]=='P(0)')){
    y+=firstTerm(x)[0]+'+';
    x=firstTerm(x)[1];
  }
  if(lt(y.slice(0,-1)||'0','P(p(0))')){y='P(0)+'+y;}
  return y.slice(0,-1);
}

function lv(x){
  return exp(trimTerm(arg(x)).at(-1));
}

function fix(s){while(count(s)){s+=')';}return s;}
function trim(s){while(s.at(-1)==')'){s=s.slice(0,-1);}return s;}

function root1(x){
  let i=trim(x).length+1;
  let c=undefined;
  while(1){
    c=paren(x,i)
    if(lt(x.slice(c-1,i+1),'P(0)')){break;}
    i++;
    if(i==x.length){return undefined;}
  }
  console.log();
  let v=lv(x.slice(c-1,i+1));
  let p=c;
  let q=i;
  let m=c;
  let n=i;
  i++;
  if(i>=x.length){return undefined;}
  while(1){
    c=paren(x,i);
    if(x[c-1]=='p'){
      let l=lv(x.slice(c-1,i+1));
      if(lv(x.slice(m-1,n+1))=='0'){m=p;n=q;break;}
      if(lt(l,v)){break;}
      m=c;
      n=i;
    }
    i++;
    if(i==x.length){return undefined;}
  }
  return [n,x.slice(m-1,n+1)]
}

function root2(x){
  console.log();
  if(root1(x)===undefined){return undefined;}
  let h=x.length-1;
  let i=trim(x).length+1;
  let q=root1(x)[0]-root1(x)[1].length+2; // bad root candidates
  let w=q;
  let c=root1(x)[1]
  i=root1(x)[0]-root1(x)[1].length+1;
  let v=x.slice(0,root1(x)[0]);
  let z=count(v);
  while(1){
    if(x[i]=='('&&x[i-1]=='p'){
      console.log(i,x.slice(0,i));
      let m=x.slice(0,i);
      let t=count(m);
      let c=paren(x,i)
      if(t<=z){
        if(lt(fix(x.slice(i-1,c)),root1(x)[1])){
          break;
        }
        if(lt(x.slice(i-1,c+1),'P(0)')){
          q=i;
          if(t<z){z=t;}
        }
      }
    }
    i--;
  }
  q--;
  let n=root1(x)[0];
  while(count(x.slice(q,n+1))>0){n++;}
  return [n,x.slice(q,n+1)];
}

function fs(x,n){
  if(x=='0'){return x;}
  let y=x;
  let m=paren(x,x.length-1);
  let d=x.slice(m-1);
  if(d=='p(0)'){return x.slice(0,m-2);}
  x=trim(x);
  let o=''
  console.log(x);
  if(x.at(-3)=='p'){
    x+='))';
    let k=paren(x,x.length-1);
    let z=x.slice(k-1,-5)+')';
    o=x.slice(0,k-1)+('+'+z).repeat(n+1);
  }
  else{
    let r=root2(y);
    if(r==undefined){
      let b=trim(x).slice(0,-3);
      o=b+'p('+'P('.repeat(n)
    }
    else{
      let b=trim(x.slice(r[0]-r[1].length+1,r[0])).slice(0,-3);
      o=x.slice(0,r[0]-r[1].length+1)+b.repeat(n);
    }
  }
  o=fix(o).replaceAll('+)',')').replaceAll('(+','(').replaceAll('++','+').replaceAll('()','(0)');
  if(o[0]=='+'){o=o.slice(1);}
  return o;
}

function tfs(a,n){
  if(count(a)!=0){return 'Invalid expression';}
  return abbreviate(fs(unabbreviate(a),n));
}

function executecommand(x){
  if(x==''){return null;}
  let c=x.split(' ')
  if(c[0]=='fs'){return HTML(tfs(c[1],Number(c[2])));}
  if(c[0]=='lt'){return lt(unabbreviate(c[1]),unabbreviate(c[2]));}
  return 'Unknown command.';
}

function HTMLcommand(x){
  if(x==''){return '';}
  let c=x.split(' ')
  if(c[0]=='fs'){return `fs<br>${HTML(unabbreviate(c[1]))} ${c[2]}`;}
  if(c[0]=='lt'){return `lt ${HTML(unabbreviate(c[1]))} ${HTML(unabbreviate(c[2]))}`;}
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
