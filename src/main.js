(function(){
// ***** IS: PACKAGE[X-TABBOX];
  // ** FOR: DOCUMENT[BODY]
  // ** DESCRIPTION: THE X-TABBOX COMPONENT AND ITS RELATED EXTENSIONS AND EVENTS.
  //  * SPECS: OPTIONAL SRC EXTENSION, BOWER, PKGS, LIB
  // * SHOULD: 
    // DO: 

// ***** IS: REGEXP[SILLY]
  // ** FOR: MATCHING KEY=VALUE PAIRS
var sillyParser = /[\w+\-]\=.+/g,
	sillyKey = /[\w+\-]+(?=\=)/g,
	sillyValue = /\=.+/g;

// ***** IS: FUNCTION[SILLY]
  // ** FOR: NODE QEUERIES
  // ** DESCRIPTION: READS ATTRIBUTE "KEY=VALUE" AND CHECKS FOR A MATCH IN A NODE COLLECTION FOR THAT KEY/VALUE PAIR AND RETURNS THAT NODE.
  // ** DOES:
    // * 
function silly(attr, node){
	// LOCAL 
	var r = { attr: null, value: null }, 
		_r = null,
		sillier = function(a,n){
			r.attr = attr.match(sillyKey)[0];
			r.value = attr.match(sillyValue)[0];
			r.value = r.value.replace("\=","");
			for(var i=0; i<n.length; i++){ if(n[i].hasAttribute(r.attr) && n[i].getAttribute(r.attr) === r.value){ return n[i]; } }
			return null; 
		};
	
	/[\w+\-]\=.+/g.test(attr) === true ? (  _r = sillier(attr, node) ) : null;
	/\d+/g.test(attr) === true ? ( _r = node[attr.match(/\d+/g)] ) : null;
	return _r; }

// ***** IS: STRING_PROTOTYPE[COLLECTDOM]
String.prototype.collectDOM = function(){
    var _token = this[0], b = "", n = null;
	if(_token !== "~" && _token !== "#"){ console.log("Your DOM STRING DID NOT START WITH THE CORRECT CHARACTER, PLEASE USE THE: ~ [TILDE] SYMBOL."); return r; }
	for(var i=0; i<this.length; i++) {
		if(this[i] === ";") { return n; }
		else if(this[i] === "~") "keep going";
		else if(this[i] === "(") { n = n === null ? document.getElementsByTagName(b) : silly(b,n); b = ""; }
		else if(this[i] === ")") { n = silly(b, n); b=""; }
		else if(this[i] === "[") { n = n === null? document.getElementsByTagName(b) : silly(b,n); b = ""; }
		else if(this[i] === "]") { n = silly(b, n); b=""; }
		else if(this[i] === "#") { b = this.replace(/^#/g,""); b = b.replace(";",""); return document.getElementById(b); }
		else { b += this[i]; }
	}
	return "ERROR: No termination semi-colon found at the end of the string.";
};

// ***** IS: EVENTS[TOGGLE]
const clickToggle = xtag.events.toggle = {
	attach: ["click"],
	onFilter: function(node, event, data, resolve){
		resolve();
	}
};

// ***** IS: EVENTS[MOUSEOVER]
const toggleOver = xtag.events.toggleOver = {
	attach: ["mouseover"],
	onFilter: function(node, event, data, resolve){
		resolve();
	}
};

// ***** IS: PSEUDO[toggleSet]
const toggleSet = xtag.pseudos.toggleSet = {
	onParse: function(e){
		this.toggleSet = {};
		return this;
	},
	onInvoke: function(e){
		if(e.toggleSet){
			var doc = document.getElementsByTagName("x-toggle");
			for(var key=0; key<doc.length; key++){
				if(doc[key].toggleSet === e.toggleSet) { 
					if( e !== doc[key] ) {
						doc[key].removeAttribute("selected");
						doc[key].targetStatus = "hidden"; 
						doc[key].xtag.toggle[doc[key].name].target.className = doc[key].hiddenClass; 
					}
				}
			}
		}
		return e;
	}
};

/* ***** IS: EXTENSION[TOGGLE]
  ** FOR: 
*/
var count = 0;
const toggle = xtag.extensions.toggle = {
	name: "toggle",
	mixin: (base) => class extends base {
		constructor(){
			super();
			this.xtag ? this.xtag : this.xtag = {};
			this.xtag.toggle ? this.xtag.toggle.length++ : this.xtag.toggle = { length: count+=1 };
			this.name = this.nodeName.toLowerCase() + this.xtag.toggle.length;
			this.xtag.toggle[this.name] = { target: this.targetDisplay.collectDOM() };
		}
		get 'name::attr'(){
			return this.getAttribute("name");
		}
		set 'name::attr'(nm){
			return nm;
		}
		get 'toggleSet::attr'(){
			return this.getAttribute("toggle-set");
		}
		set 'toggleSet::attr'(set){
			return set;
		}
		get 'targetDisplay::attr'(){
			return this.getAttribute("target-display");
		}
		set 'targetDisplay::attr'(dis){
			return dis;
		}
		get 'targetStatus::attr'(){
			return this.getAttribute("target-status");
		}
		set 'targetStatus::attr'(stat){
			return stat;
		}
		get 'activeClass::attr'(){
			return this.getAttribute("active-class") || "default";
		}
		set 'activeClass::attr'(ac){
			return ac;
		}
		get 'hiddenClass::attr'(){
			return this.getAttribute("hidden-class") || "memory";
		}
		set 'hiddenClass::attr'(hc){
			return hc;
		}
		get 'selected::attr'(){
			return this.getAttribute("selected");
		}
		set 'selected::attr'(hc=""){
			return "";
		}
	}
};

/* ***** IS: CUSTOM-ELMENT[X-TABBOX]
  ** FOR: DOCUMENT[BODY]
  ** DESCRIPTION: 
    * A CUSTOM ELEMENT MADE FOR TOGGLING TAB BOX DISPLAYS
***** */
const xtabbox = xtag.create("x-tabbox", class extends XTagElement {
	connectedCallback(){
		this.setStartTab();
		if(this.type!==false){  }
		if(this.resizer!==false){  }
		if(this.tabboxGroup!==false){  }
		if(this.tabPosition!==false){  }
	}
	set 'type::attr'(val){
		return val;
	}
	get 'type::attr'(){
		return this.getAttribute("type")||false;
	}
 	set 'resizer::attr'(rszr){
		return rszr;
	}
 	get 'resizer::attr'(){
		return this.getAttribute("resizer");
	}
 	set 'tabPosition::attr'(tp){
		return tp;
	}
 	get 'itemsDraggable::attr'(){
		return this.getAttribute("items-draggable") || false;
	}
 	set 'itemsDraggable::attr'(tbg){
		return tbg;
	}
 	get 'tabPosition::attr'(){
		return this.getAttribute("tab-position");;
	}
	'resize::template'(){
	}
	setType(type){
	}
	setStartTab(){
		
	}
} );

/* ***** IS: CUSTOM-ELMENT[X-DISPLAY]
  ** FOR: DOCUMENT[BODY]
  ** DESCRIPTION: 
    * A CUSTOM ELEMENT MADE FOR DISPLAYING
***** */
const xdisplay = xtag.create("x-display", class extends XTagElement {

} );

/* ***** IS: CUSTOM-ELMENT[X-ITEM]
  ** FOR: DOCUMENT[BODY]
  ** DESCRIPTION: 
    * A CUSTOM ELEMENT MADE FOR DISPLAYING
***** */
const xitem = xtag.create("x-item", class extends XTagElement {

} );

/* ***** IS: CUSTOM-ELMENT[X-TOGGLE]
  ** FOR: DOCUMENT[BODY]
  ** DESCRIPTION: 
    * A CUSTOM ELEMENT MADE FOR TOGGLING AND DISPLAYING
***** */
const xtoggle = xtag.create("x-toggle", class extends XTagElement.extensions("toggle") {
	constructor(){
		super();
	}
	'toggle::event:toggleSet'(e){
		var docu = this.xtag.toggle.active;
		if(this.targetStatus === "hidden") { docu.className = this.activeClass; this.selected = ""; this.targetStatus = "visible"; }
		else if(this.targetStatus === "visible") { docu.className = this.hiddenClass; this.targetStatus = "hidden"; };
	}
	'toggleOver::event'(e){
		this.xtag.toggle.active = this.xtag.toggle[this.name].target;
	}
} );

})();