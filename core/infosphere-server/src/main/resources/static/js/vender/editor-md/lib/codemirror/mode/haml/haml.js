(function(b){if(typeof exports=="object"&&typeof module=="object"){b(require("../../lib/codemirror"),require("../htmlmixed/htmlmixed"),require("../ruby/ruby"))}else{if(typeof define=="function"&&define.amd){define(["../../lib/codemirror","../htmlmixed/htmlmixed","../ruby/ruby"],b)}else{b(CodeMirror)}}})(function(b){b.defineMode("haml",function(k){var h=b.getMode(k,{name:"htmlmixed"});var a=b.getMode(k,"ruby");function i(c){return function(d,e){var f=d.peek();if(f==c&&e.rubyState.tokenize.length==1){d.next();e.tokenize=j;return"closeAttributeTag"}else{return l(d,e)}}}function l(c,d){if(c.match("-#")){c.skipToEnd();return"comment"}return a.token(c,d.rubyState)}function j(c,d){var e=c.peek();if(d.previousToken.style=="comment"){if(d.indented>d.previousToken.indented){c.skipToEnd();return"commentLine"}}if(d.startOfLine){if(e=="!"&&c.match("!!")){c.skipToEnd();return"tag"}else{if(c.match(/^%[\w:#\.]+=/)){d.tokenize=l;return"hamlTag"}else{if(c.match(/^%[\w:]+/)){return"hamlTag"}else{if(e=="/"){c.skipToEnd();return"comment"}}}}}if(d.startOfLine||d.previousToken.style=="hamlTag"){if(e=="#"||e=="."){c.match(/[\w-#\.]*/);return"hamlAttribute"}}if(d.startOfLine&&!c.match("-->",false)&&(e=="="||e=="-")){d.tokenize=l;return d.tokenize(c,d)}if(d.previousToken.style=="hamlTag"||d.previousToken.style=="closeAttributeTag"||d.previousToken.style=="hamlAttribute"){if(e=="("){d.tokenize=i(")");return d.tokenize(c,d)}else{if(e=="{"){d.tokenize=i("}");return d.tokenize(c,d)}}}return h.token(c,d.htmlState)}return{startState:function(){var d=h.startState();var c=a.startState();return{htmlState:d,rubyState:c,indented:0,previousToken:{style:null,indented:0},tokenize:j}},copyState:function(c){return{htmlState:b.copyState(h,c.htmlState),rubyState:b.copyState(a,c.rubyState),indented:c.indented,previousToken:c.previousToken,tokenize:c.tokenize}},token:function(c,d){if(c.sol()){d.indented=c.indentation();d.startOfLine=true}if(c.eatSpace()){return null}var e=d.tokenize(c,d);d.startOfLine=false;if(e&&e!="commentLine"){d.previousToken={style:e,indented:d.indented}}if(c.eol()&&d.tokenize==l){c.backUp(1);var f=c.peek();c.next();if(f&&f!=","){d.tokenize=j}}if(e=="hamlTag"){e="tag"}else{if(e=="commentLine"){e="comment"}else{if(e=="hamlAttribute"){e="attribute"}else{if(e=="closeAttributeTag"){e=null}}}}return e}}},"htmlmixed","ruby");b.defineMIME("text/x-haml","haml")});