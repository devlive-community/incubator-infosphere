(function(a){if(typeof exports=="object"&&typeof module=="object"){a(require("../../lib/codemirror"))}else{if(typeof define=="function"&&define.amd){define(["../../lib/codemirror"],a)}else{a(CodeMirror)}}})(function(q){q.TernServer=function(N){var M=this;this.options=N||{};var L=this.options.plugins||(this.options.plugins={});if(!L.doc_comment){L.doc_comment=true}if(this.options.useWorker){this.server=new J(this)}else{this.server=new tern.Server({getFile:function(O,P){return G(M,O,P)},async:true,defs:this.options.defs||[],plugins:L})}this.docs=Object.create(null);this.trackChange=function(O,P){g(M,O,P)};this.cachedArgHints=null;this.activeArgHints=null;this.jumpStack=[];this.getHint=function(O,P){return o(M,O,P)};this.getHint.async=true};q.TernServer.prototype={addDoc:function(L,N){var M={doc:N,name:L,changed:null};this.server.addFile(L,x(this,M));q.on(N,"change",this.trackChange);return this.docs[L]=M},delDoc:function(M){var L=y(this,M);if(!L){return}q.off(L.doc,"change",this.trackChange);delete this.docs[L.name];this.server.delFile(L.name)},hideDoc:function(M){c(this);var L=y(this,M);if(L&&L.changed){h(this,L)}},complete:function(L){L.showHint({hint:this.getHint})},showType:function(L,N,M){v(this,L,N,"type",M)},showDocs:function(L,N,M){v(this,L,N,"documentation",M)},updateArgHints:function(L){m(this,L)},jumpToDef:function(L){b(this,L)},jumpBack:function(L){w(this,L)},rename:function(L){r(this,L)},selectName:function(L){e(this,L)},request:function(L,O,R,Q){var M=this;var P=j(this,L.getDoc());var N=t(this,P,O,Q);this.server.request(N,function(S,T){if(!S&&M.options.responseFilter){T=M.options.responseFilter(P,O,N,S,T)}R(S,T)})},destroy:function(){if(this.worker){this.worker.terminate();this.worker=null}}};var l=q.Pos;var d="CodeMirror-Tern-";var K=250;function G(N,M,O){var L=N.docs[M];if(L){O(x(N,L))}else{if(N.options.getFile){N.options.getFile(M,O)}else{O(null)}}}function j(N,O,L){for(var Q in N.docs){var P=N.docs[Q];if(P.doc==O){return P}}if(!L){for(var M=0;;++M){Q="[doc"+(M||"")+"]";if(!N.docs[Q]){L=Q;break}}}return N.addDoc(L,O)}function y(L,M){if(typeof M=="string"){return L.docs[M]}if(M instanceof q){M=M.getDoc()}if(M instanceof q.Doc){return j(L,M)}}function g(N,P,R){var O=j(N,P);var L=N.cachedArgHints;if(L&&L.doc==P&&u(L.start,R.to)<=0){N.cachedArgHints=null}var Q=O.changed;if(Q==null){O.changed=Q={from:R.from.line,to:R.from.line}}var M=R.from.line+(R.text.length-1);if(R.from.line<Q.to){Q.to=Q.to-(R.to.line-M)}if(M>=Q.to){Q.to=M+1}if(Q.from>R.from.line){Q.from=R.from.line}if(P.lineCount()>K&&R.to-Q.from>100){setTimeout(function(){if(O.changed&&O.changed.to-O.changed.from>100){h(N,O)}},200)}}function h(L,M){L.server.request({files:[{type:"full",name:M.name,text:x(L,M)}]},function(N){if(N){window.console.error(N)}else{M.changed=null}})}function o(M,L,N){M.request(L,{type:"completions",types:true,docs:true,urls:true},function(U,R){if(U){return f(M,L,U)}var V=[],O="";var W=R.start,X=R.end;if(L.getRange(l(W.line,W.ch-2),W)=='["'&&L.getRange(X,l(X.line,X.ch+2))!='"]'){O='"]'}for(var S=0;S<R.completions.length;++S){var P=R.completions[S],T=z(P.type);if(R.guess){T+=" "+d+"guess"}V.push({text:P.name+O,displayText:P.name,className:T,data:P})}var Q={from:W,to:X,list:V};var Y=null;q.on(Q,"close",function(){s(Y)});q.on(Q,"update",function(){s(Y)});q.on(Q,"select",function(ab,aa){s(Y);var Z=M.options.completionTip?M.options.completionTip(ab.data):ab.data.doc;if(Z){Y=B(aa.parentNode.getBoundingClientRect().right+window.pageXOffset,aa.getBoundingClientRect().top+window.pageYOffset,Z);Y.className+=" "+d+"hint-doc"}});N(Q)})}function z(L){var M;if(L=="?"){M="unknown"}else{if(L=="number"||L=="string"||L=="bool"){M=L}else{if(/^fn\(/.test(L)){M="fn"}else{if(/^\[/.test(L)){M="array"}else{M="object"}}}}return d+"completion "+d+"completion-"+M}function v(M,L,P,N,O){M.request(L,N,function(Q,S){if(Q){return f(M,L,Q)}if(M.options.typeTip){var R=M.options.typeTip(S)}else{var R=D("span",null,D("strong",null,S.type||"not found"));if(S.doc){R.appendChild(document.createTextNode(" — "+S.doc))}if(S.url){R.appendChild(document.createTextNode(" "));var T=R.appendChild(D("a",null,"[docs]"));T.href=S.url;T.target="_blank"}}p(L,R);if(O){O()}},P)}function m(U,Y){c(U);if(Y.somethingSelected()){return}var N=Y.getTokenAt(Y.getCursor()).state;var ab=q.innerMode(Y.getMode(),N);if(ab.mode.name!="javascript"){return}var P=ab.state.lexical;if(P.info!="call"){return}var M,X=P.pos||0,S=Y.getOption("tabSize");for(var aa=Y.getCursor().line,T=Math.max(0,aa-9),Z=false;aa>=T;--aa){var V=Y.getLine(aa),R=0;for(var W=0;;){var Q=V.indexOf("\t",W);if(Q==-1){break}R+=S-(Q+R)%S-1;W=Q+1}M=P.column-R;if(V.charAt(M)=="("){Z=true;break}}if(!Z){return}var O=l(aa,M);var L=U.cachedArgHints;if(L&&L.doc==Y.getDoc()&&u(O,L.start)==0){return i(U,Y,X)}U.request(Y,{type:"type",preferFunction:true,end:O},function(ac,ad){if(ac||!ad.type||!(/^fn\(/).test(ad.type)){return}U.cachedArgHints={start:W,type:A(ad.type),name:ad.exprName||ad.name||"fn",guess:ad.guess,doc:Y.getDoc()};i(U,Y,X)})}function i(O,S,P){c(O);var L=O.cachedArgHints,Q=L.type;var R=D("span",L.guess?d+"fhint-guess":null,D("span",d+"fname",L.name),"(");for(var N=0;N<Q.args.length;++N){if(N){R.appendChild(document.createTextNode(", "))}var T=Q.args[N];R.appendChild(D("span",d+"farg"+(N==P?" "+d+"farg-current":""),T.name||"?"));if(T.type!="?"){R.appendChild(document.createTextNode(":\u00a0"));R.appendChild(D("span",d+"type",T.type))}}R.appendChild(document.createTextNode(Q.rettype?") ->\u00a0":")"));if(Q.rettype){R.appendChild(D("span",d+"type",Q.rettype))}var M=S.cursorCoords(null,"page");O.activeArgHints=B(M.right+1,M.bottom,R)}function A(P){var O=[],Q=3;function M(R){var T=0,U=Q;for(;;){var S=P.charAt(Q);if(R.test(S)&&!T){return P.slice(U,Q)}if(/[{\[\(]/.test(S)){++T}else{if(/[}\]\)]/.test(S)){--T}}++Q}}if(P.charAt(Q)!=")"){for(;;){var N=P.slice(Q).match(/^([^, \(\[\{]+): /);if(N){Q+=N[0].length;N=N[1]}O.push({name:N,type:M(/[\),]/)});if(P.charAt(Q)==")"){break}Q+=2}}var L=P.slice(Q).match(/^\) -> (.*)$/);return{args:O,rettype:L&&L[1]}}function b(N,L){function M(Q){var O={type:"definition",variable:Q||null};var P=j(N,L.getDoc());N.server.request(t(N,P,O),function(R,T){if(R){return f(N,L,R)}if(!T.file&&T.url){window.open(T.url);return}if(T.file){var U=N.docs[T.file],S;if(U&&(S=H(U.doc,T))){N.jumpStack.push({file:P.name,start:L.getCursor("from"),end:L.getCursor("to")});a(N,P,U,S.start,S.end);return}}f(N,L,"Could not find a definition.")})}if(!I(L)){F(L,"Jump to variable",function(O){if(O){M(O)}})}else{M()}}function w(M,L){var O=M.jumpStack.pop(),N=O&&M.docs[O.file];if(!N){return}a(M,j(M,L.getDoc()),N,O.start,O.end)}function a(N,M,O,P,L){O.doc.setSelection(P,L);if(M!=O&&N.options.switchToDoc){c(N);N.options.switchToDoc(O.name,O.doc)}}function H(T,P){var R=P.context.slice(0,P.contextOffset).split("\n");var V=P.start.line-(R.length-1);var M=l(V,(R.length==1?P.start.ch:T.getLine(V).length)-R[0].length);var W=T.getLine(V).slice(M.ch);for(var U=V+1;U<T.lineCount()&&W.length<P.context.length;++U){W+="\n"+T.getLine(U)}if(W.slice(0,P.context.length)==P.context){return P}var X=T.getSearchCursor(P.context,0,false);var N,L=Infinity;while(X.findNext()){var S=X.from(),Q=Math.abs(S.line-M.line)*10000;if(!Q){Q=Math.abs(S.ch-M.ch)}if(Q<L){N=S;L=Q}}if(!N){return null}if(R.length==1){N.ch+=R[0].length}else{N=l(N.line+(R.length-1),R[R.length-1].length)}if(P.start.line==P.end.line){var O=l(N.line,N.ch+(P.end.ch-P.start.ch))}else{var O=l(N.line+(P.end.line-P.start.line),P.end.ch)}return{start:N,end:O}}function I(L){var N=L.getCursor("end"),M=L.getTokenAt(N);if(M.start<N.ch&&(M.type=="comment"||M.type=="string")){return false}return/\w/.test(L.getLine(N.line).slice(Math.max(N.ch-1,0),N.ch+1))}function r(N,L){var M=L.getTokenAt(L.getCursor());if(!/\w/.test(M.string)){return f(N,L,"Not at a variable")}F(L,"New name for "+M.string,function(O){N.request(L,{type:"rename",newName:O,fullDocs:true},function(P,Q){if(P){return f(N,L,P)}k(N,Q.changes)})})}function e(N,L){var M=j(N,L.doc).name;N.request(L,{type:"refs"},function(P,S){if(P){return f(N,L,P)}var O=[],T=0;for(var Q=0;Q<S.refs.length;Q++){var R=S.refs[Q];if(R.file==M){O.push({anchor:R.start,head:R.end});if(u(T,R.start)>=0&&u(T,R.end)<=0){T=O.length-1}}}L.setSelections(O,T)})}var C=0;function k(Q,R){var O=Object.create(null);for(var P=0;P<R.length;++P){var L=R[P];(O[L.file]||(O[L.file]=[])).push(L)}for(var M in O){var T=Q.docs[M],N=O[M];if(!T){continue}N.sort(function(V,U){return u(U.start,V.start)});var S="*rename"+(++C);for(var P=0;P<N.length;++P){var L=N[P];T.doc.replaceRange(L.text,L.start,L.end,S)}}}function t(Q,T,R,S){var N=[],O=0,L=!R.fullDocs;if(!L){delete R.fullDocs}if(typeof R=="string"){R={type:R}}R.lineCharPositions=true;if(R.end==null){R.end=S||T.doc.getCursor("end");if(T.doc.somethingSelected()){R.start=T.doc.getCursor("start")}}var P=R.start||R.end;if(T.changed){if(T.doc.lineCount()>K&&L!==false&&T.changed.to-T.changed.from<100&&T.changed.from<=P.line&&T.changed.to>R.end.line){N.push(n(T,P,R.end));R.file="#0";var O=N[0].offsetLines;if(R.start!=null){R.start=l(R.start.line- -O,R.start.ch)}R.end=l(R.end.line-O,R.end.ch)}else{N.push({type:"full",name:T.name,text:x(Q,T)});R.file=T.name;T.changed=null}}else{R.file=T.name}for(var M in Q.docs){var U=Q.docs[M];if(U.changed&&U!=T){N.push({type:"full",name:U.name,text:x(Q,U)});U.changed=null}}return{query:R,files:N}}function n(T,M,R){var Y=T.doc;var P=null,N=null,Q,U=4;for(var L=M.line-1,S=Math.max(0,L-50);L>=S;--L){var Z=Y.getLine(L),W=Z.search(/\bfunction\b/);if(W<0){continue}var O=q.countColumn(Z,null,U);if(P!=null&&P<=O){continue}P=O;N=L}if(N==null){N=S}var V=Math.min(Y.lastLine(),R.line+20);if(P==null||P==q.countColumn(Y.getLine(M.line),null,U)){Q=V}else{for(Q=R.line+1;Q<V;++Q){var O=q.countColumn(Y.getLine(Q),null,U);if(O<=P){break}}}var X=l(N,0);return{type:"part",name:T.name,offsetLines:X.line,text:Y.getRange(X,l(Q,0))}}var u=q.cmpPos;function D(O,L){var P=document.createElement(O);if(L){P.className=L}for(var N=2;N<arguments.length;++N){var M=arguments[N];if(typeof M=="string"){M=document.createTextNode(M)}P.appendChild(M)}return P}function F(L,N,M){if(L.openDialog){L.openDialog(N+": <input type=text>",M)}else{M(prompt(N,""))}}function p(M,Q){if(M.state.ternTooltip){s(M.state.ternTooltip)}var P=M.cursorCoords();var S=M.state.ternTooltip=B(P.right+1,P.bottom,Q);function R(){N=true;if(!O){L()}}function L(){M.state.ternTooltip=null;if(!S.parentNode){return}M.off("cursorActivity",L);M.off("blur",L);M.off("scroll",L);E(S)}var O=false,N=false;q.on(S,"mousemove",function(){O=true});q.on(S,"mouseout",function(T){if(!q.contains(S,T.relatedTarget||T.toElement)){if(N){L()}else{O=false}}});setTimeout(R,1700);M.on("cursorActivity",L);M.on("blur",L);M.on("scroll",L)}function B(L,O,N){var M=D("div",d+"tooltip",N);M.style.left=L+"px";M.style.top=O+"px";document.body.appendChild(M);return M}function s(L){var M=L&&L.parentNode;if(M){M.removeChild(L)}}function E(L){L.style.opacity="0";setTimeout(function(){s(L)},1100)}function f(M,L,N){if(M.options.showError){M.options.showError(L,N)}else{p(L,String(N))}}function c(L){if(L.activeArgHints){s(L.activeArgHints);L.activeArgHints=null}}function x(L,M){var N=M.doc.getValue();if(L.options.fileFilter){N=L.options.fileFilter(N,M.name,M.doc)}return N}function J(L){var P=L.worker=new Worker(L.options.workerScript);P.postMessage({type:"init",defs:L.options.defs,plugins:L.options.plugins,scripts:L.options.workerDeps});var N=0,O={};function M(Q,R){if(R){Q.id=++N;O[N]=R}P.postMessage(Q)}P.onmessage=function(R){var Q=R.data;if(Q.type=="getFile"){G(L,Q.name,function(S,T){M({type:"getFile",err:String(S),text:T,id:Q.id})})}else{if(Q.type=="debug"){window.console.log(Q.message)}else{if(Q.id&&O[Q.id]){O[Q.id](Q.err,Q.body);delete O[Q.id]}}}};P.onerror=function(Q){for(var R in O){O[R](Q)}O={}};this.addFile=function(Q,R){M({type:"add",name:Q,text:R})};this.delFile=function(Q){M({type:"del",name:Q})};this.request=function(Q,R){M({type:"req",body:Q},R)}}});