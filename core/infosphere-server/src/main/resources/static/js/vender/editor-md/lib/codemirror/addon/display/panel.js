(function(a){if(typeof exports=="object"&&typeof module=="object"){a(require("../../lib/codemirror"))}else{if(typeof define=="function"&&define.amd){define(["../../lib/codemirror"],a)}else{a(CodeMirror)}}})(function(a){a.defineExtension("addPanel",function(g,f){if(!this.state.panels){b(this)}var h=this.state.panels;if(f&&f.position=="bottom"){h.wrapper.appendChild(g)}else{h.wrapper.insertBefore(g,h.wrapper.firstChild)}var e=(f&&f.height)||g.offsetHeight;this._setSize(null,h.heightLeft-=e);h.panels++;return new d(this,g,f,e)});function d(f,h,g,e){this.cm=f;this.node=h;this.options=g;this.height=e;this.cleared=false}d.prototype.clear=function(){if(this.cleared){return}this.cleared=true;var e=this.cm.state.panels;this.cm._setSize(null,e.heightLeft+=this.height);e.wrapper.removeChild(this.node);if(--e.panels==0){c(this.cm)}};d.prototype.changed=function(e){var f=e==null?this.node.offsetHeight:e;var g=this.cm.state.panels;this.cm._setSize(null,g.height+=(f-this.height));this.height=f};function b(f){var h=f.getWrapperElement();var g=window.getComputedStyle?window.getComputedStyle(h):h.currentStyle;var e=parseInt(g.height);var i=f.state.panels={setHeight:h.style.height,heightLeft:e,panels:0,wrapper:document.createElement("div")};h.parentNode.insertBefore(i.wrapper,h);var j=f.hasFocus();i.wrapper.appendChild(h);if(j){f.focus()}f._setSize=f.setSize;if(e!=null){f.setSize=function(m,k){if(k==null){return this._setSize(m,k)}i.setHeight=k;if(typeof k!="number"){var l=/^(\d+\.?\d*)px$/.exec(k);if(l){k=Number(l[1])}else{i.wrapper.style.height=k;k=i.wrapper.offsetHeight;i.wrapper.style.height=""}}f._setSize(m,i.heightLeft+=(k-e));e=k}}}function c(e){var g=e.state.panels;e.state.panels=null;var f=e.getWrapperElement();g.wrapper.parentNode.replaceChild(f,g.wrapper);f.style.height=g.setHeight;e.setSize=e._setSize;e.setSize()}});