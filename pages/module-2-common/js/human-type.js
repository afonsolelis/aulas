// human-type.js — Character-by-character typing with realistic typos
// Depends on globals defined in each slide: T(), _run
// Usage: d = typeLine('id', [{c:'kw',v:'SELECT'},...], d) + GAP;
//   Returns absolute end-time so calls can be chained.

(function() {
  var ADJ = {
    a:'sqz',b:'vng',c:'xvd',d:'sfe',e:'rdw',f:'dgr',g:'fht',h:'gjy',
    i:'uoj',j:'hku',k:'jli',l:'kop',m:'nj',n:'bmh',o:'ipl',p:'ol',
    q:'wa',r:'etd',s:'adw',t:'rfy',u:'yih',v:'cbf',w:'qea',x:'zsc',
    y:'tug',z:'asx'
  };
  function nearby(c) {
    var lo=c.toLowerCase(), a=ADJ[lo];
    if(!a) return c;
    var r=a[Math.floor(Math.random()*a.length)];
    return c===c.toUpperCase()?r.toUpperCase():r;
  }
  function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function buildHtml(arr) {
    if(!arr.length) return '';
    var out='',cls=arr[0].c,buf='';
    for(var i=0;i<arr.length;i++){
      if(arr[i].c!==cls){ out+='<span class="'+cls+'">'+buf+'</span>'; cls=arr[i].c; buf=''; }
      buf+=arr[i].h;
    }
    return out+'<span class="'+cls+'">'+buf+'</span>';
  }

  window.typeLine = function(id, tokens, startDelay) {
    var TYPO  = 0.04;    // 4 % chance per alpha char (max 1 per line)
    var CMIN  = 22;      // ms min per char
    var CMAX  = 52;      // ms max per char
    var SPC   = 12;      // ms for spaces
    var PAUSE = 320;     // ms "notice the mistake"
    var BKSP  = 55;      // ms backspace
    var SLOW  = 35;      // extra ms after fix

    var t=startDelay, typed=[], hadTypo=false;

    // show line + cursor
    T(function(){
      if(!_run) return;
      var el=document.getElementById(id);
      if(el){ el.classList.add('vis'); el.innerHTML='<span class="tcur"></span>'; }
    }, t);
    t+=12;

    // flatten tokens to char array
    var chars=[];
    tokens.forEach(function(tok){
      for(var i=0;i<tok.v.length;i++)
        chars.push({ch:tok.v[i], h:esc(tok.v[i]), c:tok.c});
    });

    chars.forEach(function(co,idx){
      var isA=/[a-zA-Z]/.test(co.ch);
      var doTypo=isA && !hadTypo && Math.random()<TYPO;
      var isLast=idx===chars.length-1;

      if(doTypo){
        hadTypo=true;
        var wh=esc(nearby(co.ch));
        // wrong char
        (function(w){ T(function(){
          if(!_run) return; var el=document.getElementById(id); if(!el) return;
          typed.push({h:w,c:co.c});
          el.innerHTML=buildHtml(typed)+'<span class="tcur"></span>';
        }, t); })(wh);
        t+=PAUSE;
        // backspace
        T(function(){
          if(!_run) return; var el=document.getElementById(id); if(!el) return;
          typed.pop();
          el.innerHTML=buildHtml(typed)+'<span class="tcur"></span>';
        }, t);
        t+=BKSP;
      }

      // correct char
      (function(c,last){ T(function(){
        if(!_run) return; var el=document.getElementById(id); if(!el) return;
        typed.push({h:c.h,c:c.c});
        el.innerHTML=buildHtml(typed)+(last?'':'<span class="tcur"></span>');
      }, t); })(co,isLast);

      t+=(co.ch===' ')?SPC:(CMIN+Math.random()*(CMAX-CMIN));
      if(doTypo) t+=SLOW;
    });

    return t;
  };
})();
