(function(){
  // ***** docElement *****
  var docElement = document.documentElement;
  (Element.prototype.matches || (Element.prototype.matches = docElement.webkitMatchesSelector ||
                                                             docElement.msMatchesSelector ||
                                                             docElement.oMatchesSelector))

  // LITERAL REGULAR EXPRESSION'S
    // == NOTE[regexParseExt]: CHANGE (\w+)|(::|:) to ([\w+\-]+)(::|:), TO ADD A HYPHENATED  PROPERTY NAMEs
var regexParseExt = /(\w+)|(::|:)(\w+)(?:\((.+?(?=\)))\))?/g,
	  regexCommaArgs = /,\s*/,
	  range = document.createRange();

  // ***** DELEGATEACTION()
function delegateAction(node, pseudo, event) {
var match,
	target = event.target,
	root = event.currentTarget;

while (!match && target && target != root) {
  if (target.tagName && target.matches(pseudo.args)) match = target;
  target = target.parentNode;
}

if (!match && root.tagName && root.matches(pseudo.args)) match = root;
if (match) pseudo.fn = pseudo.fn.bind(match);
else return null;
}

/* ***** IS: CAMELS
  ** FOR: 
[POC FOR EDITION: [GITHUB]@KIPOMAHA ***** */
function camels(p){
	var silly = "";
	if(/[a-z]+(?=[A-Z])/g.test(p) === true) {
		let i = p.match(/[a-z]+(?=[A-Z])/g);
		let m = p.match(/[A-Z][a-z]+/g);
		for(let x=0; x<i.length; x++){ silly+=i[x]+"-"+m[x]+"-"; }
		silly = silly.replace(/\-$/,"");
		return silly;
	}
	else return p;
}

  // ***** XTAG *****
  var xtag = {
	 // ***** LENGTH
	length: 0,
	// ***** EVENTS
    events: {},
	// ***** PSEUDOS
    pseudos: {
      delegate: {
        onInvoke: delegateAction
      }
    },
	// ***** BUILDS
	builds: {
		// ***** IS: XTagElement API
		mixin: (base) => class extends base {
			
		},
		// ***** IS: EVENT API
		active: null,
		// ***** IS: TEMPLATE API
		rendered: null,
		// ***** UDPATE
		update: function() {
			xtag.builds.active = name;
			const klass = createClass();
			return klass;
		}
	},
	// ***** EXTENSIONS
    extensions: {
	  // ***** ATTR
      attr: {
		// ***** MIXIN
        mixin: (base) => class extends base {
          attributeChangedCallback(attr, last, current){
            var desc = this.constructor.getOptions('attributes')[attr];
            if (desc && desc.set && !desc._skip) {
              desc._skip = true;
              desc.set.call(this, current);
              desc._skip = null;
            }
          }
        },
		// ***** TYPES
        types: {
          boolean: {
            set: function(prop, val){
              val || val === '' ? this.setAttribute(prop, '') : this.removeAttribute(prop);
            },
            get: function(prop){
              return this.hasAttribute(prop);
            }
          }
        },
		// ***** ONPARSE
        onParse (klass, prop, args, descriptor, key){
		  // ***** check descriptor.value error
          if (descriptor.value) throw 'Attribute accessor "'+ prop +'" was declared as a value, but must be declared as get or set';

            klass.getOptions('attributes')[prop] = descriptor;

          var type = this.types[args[0]] || {};
          let descSet = descriptor.set;
          let typeSet = type.set || HTMLElement.prototype.setAttribute;

		    // ***** DESCRIPTOR.SET()
			descriptor.set = function(val){
			  if (!descriptor._skip){
				descriptor._skip = true;
				var output;
			  // ***** DESCSET
				if (descSet) output = descSet.call(this, val);
				prop = camels(prop);
				  typeSet.call(this, prop, typeof output == 'undefined' ? val : output);
				  descriptor._skip = null;
				}
			  }

          let descGet = descriptor.get;
          let typeGet = type.get || HTMLElement.prototype.getAttribute;

		    // ***** IS: DESCRIPTOR.GET()
		    descriptor.get = function(){
				var output;
				var val = typeGet.call(this, prop);
				// 
				if (descGet) output = descGet.call(this, val);
				return typeof output == 'undefined' ? val : output;
			}
          delete klass.prototype[key];
        },
		// ***** ONCOMPILED`()
        onCompiled (klass){
          klass.observedAttributes = Object.keys(klass.getOptions('attributes')).concat(klass.observedAttributes || [])
        }
      },

	  // ***** IS: EVENT API
      event: {
		// ***** onParse
        onParse (klass, property, args, descriptor, key){
          delete klass.prototype[key];
          return false;
        },
		// ***** onConstruct
        onConstruct (node, property, args, descriptor){
          xtag.addEvent(node, property, descriptor.value);
        }
      },
	  // ***** IS: TEMPLATE API
      template: {
		// NOTE[MIXIN]: CHANGE MADE COMMITED BY @CSUWILDCAT
		mixin: (base) => class extends base {
          set 'template::attr' (name){
            var _name = name || 'default';
            var template = this.templates[_name];
            if (template) {
              var node = range.createContextualFragment(template.call(this));
              this._templateNode = this._templateNode ? this.replaceChild(node, this._templateNode) && node : this.appendChild(node);
              this._templateRender(this._templateNode);
            }
            else throw new ReferenceError('Template "' + _name + '" is undefined');
			return _name;
          }
          get templates (){
            return this.constructor.getOptions('templates');
          }
          render (name){
            var promise = new Promise(resolve => this._templateRender = resolve)
            this.template = name;
            return promise;
          }
        },
        onParse (klass, property, args, descriptor){
          klass.getOptions('templates')[property || 'default'] = descriptor.value;
          return false;
        },
        onCreate (node, resolve, property, args){
          if (!node._templateInit && JSON.parse(args[0] || false) && args[1] == 'create') {
            node._templateInit = true;
            node.render(property);
          }
          resolve();
        },
        onConnect (node, property, args){
          if (!node._templateInit && JSON.parse(args[0] || false) && (!args[1] || args[1] == 'connect')) {
            node._templateInit = true;
            node.render(property);
          }
        }
      }
    },

	// ***** CREATE()
    create (name, klass){
      var c = klass || name;
      onParse(c); 
      if (klass && name) customElements.define(name, c);
      return c;
    },

	// ***** REGISTER()
    register (name, klass) {
      customElements.define(name, klass);
    },

	// ***** ADDEVENTS()
    addEvents (node, events){
      let refs = {};
      for (let z in events) refs[z] = xtag.addEvent(node, z, events[z]);
      return refs;
    },

	// ***** ADDEVENT()
    addEvent (node, key, fn, capture){
      var type;  
      var stack = fn;
      var ref = { data: {}, capture: capture };
      var pseudos = node.constructor.getOptions('pseudos');
      key.replace(regexParseExt, (match, name, pseudo1, args, pseudo2) => {
		// NAME
        if (name) type = name;
        else {
          var pseudo = pseudo1 || pseudo2,
              pseudo = pseudos[pseudo] || xtag.pseudos[pseudo];
          var _args = args ? args.split(regexCommaArgs) : [];
          stack = pseudoWrap(pseudo, _args, stack, ref);
		  // PSUEDO.ONPARSE
          if (pseudo.onParse) { pseudo.onParse(node, type, _args, stack, ref); }
        }
      });

	  // ***** NODE.ADDEVENTLISTENER()
      node.addEventListener(type, stack, capture);
      ref.type = type;
      ref.listener = stack;
      var event = node.constructor.getOptions('events')[type] || xtag.events[type];
		// CHECK EVENT
		if (event) {
          var listener = function(e){
            new Promise( (resolve, reject) => {
              event.onFilter( this, e, ref, resolve, reject );
            } ).then(() => {
                xtag.fireEvent(e.target, type);
              } );
        }
        ref.attached = event.attach.map( key => {
          return xtag.addEvent(node, key, listener, true);
        } );
		// CHECK EVENT.ONADD
        if (event.onAdd) event.onAdd(node, ref);
      }
      return ref;
    },

	// ***** REMOVEEVENTS()
    removeEvents (node, refs) {
      for ( let z in refs ) { xtag.removeEvent(node, refs[z]); }
    },

	// ***** REMOVEEVENT()
    removeEvent (node, ref){
      node.removeEventListener( ref.type, ref.listener, ref.capture );
      var event = node.constructor.getOptions('events')[ref.type] || xtag.events[ref.type];
	  // CHECK EVENT && EVENT.ONREMOVE
      if (event && event.onRemove) event.onRemove(node, ref);
	  // CHECK REF.ATTACHED
	  if (ref.attached) ref.attached.forEach(attached => { xtag.removeEvent(node, ref) })
    },

	// ***** FIREEVENT()
    fireEvent (node, name, obj = {}){
      let options = Object.assign({
        bubbles: true,
        cancelable: true
      }, obj);
      node.dispatchEvent(new CustomEvent(name, options));
    }
  }

  // ***** CREATECLASS()
  function createClass(options = {}){
    var klass;
    klass = class extends (options.native ? Object.getPrototypeOf(document.createElement(options.native)).constructor : HTMLElement) {
      constructor () {
        super();
        if (!this._data) this._data = {};
        onConstruct(this);
        this._ready = [];
        new Promise((resolve) => {
          onCreate(this, resolve);
        }).then((val) => {
          this._ready.forEach(fn => fn.call(this));
          this._ready = true;
        })
      }
      connectedCallback () {
        onConnect(this);
      }
      get isReady () { return this._ready === true; }
      whenReady (fn){
        if (this.isReady) fn.call(this);
        else this._ready.push(fn);
      }
    };

	// ***** IS: KLASS API LIBRARY
    klass.options = {};
	/* ***** 
	  ** KLASS.CREATEOPTIONS()
	***** */
	klass.createOptions = function(name) {
		// this.options[name] = Object.assign( {}, this.__proto__.options ? this.__proto__.options[name] : {} );
		var _p = this.__proto__, _np = {};
		console.log(this.options);
		return { };
	};

	// ***** KLASS.GETOPTIONS()
	  // CREATES OR RETURNS REQUESTED NAME FROM KLASS.OPTIONS
    klass.getOptions = function(name){ 
      return klass.options[name] = Object.assign( {}, this.__proto__.options ? this.__proto__.options[name] : {} );
    }

	// ***** CREATE THE EXTENSIONS AND PSEUDOS OPTIONS
	klass.getOptions('extensions');
    klass.getOptions('pseudos');

	// ***** KLASS.EXTENSIONS()
    klass.extensions = function extensions(...extensions){
      var exts = this.getOptions('extensions');
      return extensions.reduce((current, extension) => {
        var mixin;
        var extended = current;
        if (!exts[extension.name]) {
          if (typeof extension == 'string') {
            mixin = xtag.extensions[extension].mixin;
          }
          else {
            mixin = extension.mixin;
            exts[extension.name] = extension;
          }
          if (mixin) {
            extended = mixin(current);
            onParse(extended);
          }
        }
        return extended;
      }, this);
    }

	// ***** KLASS.AS
	klass.as = function(tag){
		return createClass( { native: tag } );
	};
    return klass.extensions('attr', 'event', 'template');
  };

  // ***** XTAGELEMENT *****
  XTagElement = null;

	// ***** XTAGELEMENT.BUILDER()
	xtag.builder = function build(opts) { 
		let _bd = null,
			_bds = xtag.builds;

		var klass = null;

		// ***** CHECK IF PARAMETER IS GIVEN
		if(!opts) { return createClass(); };

		// ***** CHECK _BDS[opts.name]
		if( !_bds[opts.name] ) {
			klass = _bds[opts.name] = opts.definition;
			return klass;
		}
		else {
			xtag.builds[opts.name] = opts.definition;
		};
		return klass;
	};
	// ***** START INITIAL BUILDER();
	XTagElement = xtag.builder();

// ***** IS: PSUEDOWRAP()
function pseudoWrap(pseudo, args, fn, detail) {
	return function(){
		var _pseudo = { fn: fn, args: args, detail: detail };
		var output = pseudo.onInvoke(this, _pseudo, ...arguments);
		if (output === null || output === false) return output;
		return _pseudo.fn.apply(this, output instanceof Array ? output : arguments);
	};
}

// ***** IS: ONPARSE()
function onParse(target){
var processedProps = {},
	descriptors = getDescriptors(target),
	extensions = target.getOptions('extensions'),
	processed = target._processedExtensions = new Map();   
    for (let z in descriptors) {
		let matches = [];
		let property;
		let extension;
		let extensionArgs = [];
		let descriptor = descriptors[z];
		let pseudos = target._pseudos || xtag.pseudos;
		z.replace(regexParseExt, function(){ matches.unshift(arguments);  });
			matches.forEach( a => function(match, prop, dots, name, args){
				property = prop || property;
				if (args) var _args = args.split(regexCommaArgs);
				if (dots == '::') {
					extensionArgs = _args || [];
					extension = extensions[name] || xtag.extensions[name];
					if (!processed.get(extension)) processed.set(extension, []);
				}
				else if (!prop){
					let pseudo = pseudos[name];
					if (pseudo) {
						for (let y in descriptor) {
							let fn = descriptor[y];
							if (typeof fn == 'function' && pseudo.onInvoke) {
								fn = descriptor[y] = pseudoWrap(pseudo, _args, fn);
								if (pseudo.onParse) pseudo.onParse(target, property, _args, fn);
							}
						}
					}
				}
			}.apply(null, a) );
		let attachProperty;
		if (extension) {
			processed.get(extension).push([property, extensionArgs, descriptor]);
			if (extension.onParse) attachProperty = extension.onParse(target, property, extensionArgs, descriptor, z);
		}
		if (!property) delete target.prototype[z];
		else if (attachProperty !== false) {
			let prop = processedProps[property] || (processedProps[property] = {});
			for (let y in descriptor) prop[y] = descriptor[y];
		}
	}
	for (let ext of processed.keys()) {
		if (ext.onCompiled) { ext.onCompiled(target, processedProps); }
	}
    Object.defineProperties(target.prototype, processedProps);
  }

// ***** IS: ONCONSTRUCT()
function onConstruct (target){
	var processed = target.constructor._processedExtensions;
	for (let [ext, items] of processed) {
		if (ext.onConstruct) items.forEach(item => ext.onConstruct(target, ...item))
	}
}

// ***** IS: ONCREATE()
function onCreate (target, resolve){
	var processed = target.constructor._processedExtensions;
	for (let [ext, items] of processed) {
		if(ext.onCreate) Promise.all(items.map(item => {
			return new Promise(resolve => ext.onCreate(target, resolve, ...item))
		} ) ).then(() => resolve())
	}
}

// ***** IS: ONCONNECT()
function onConnect (target){
	var processed = target.constructor._processedExtensions;
	for (let [ext, items] of processed) {
	  if (ext.onConnect) items.forEach(item => ext.onConnect(target, ...item))
	}
}

// ***** IS: GETDESCRIPTORS()
function getDescriptors(target){
	var descriptors = {};
	var proto = target.prototype;
	Object.getOwnPropertyNames(proto).forEach(key => {
		descriptors[key] = Object.getOwnPropertyDescriptor(proto, key);
	} );
    return descriptors;
}

  // ***** ATTACH XTAG AND XTAGELEMENT TO THE WINDOW OBJECT *****
  if (typeof define === 'function' && define.amd) {
    define(xtag);
    define(XTagElement);
  }
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = { xtag: xtag, XTagElement: XTagElement };
  }
  else {
    window.xtag = xtag;
    window.XTagElement = XTagElement;
  }
})();
