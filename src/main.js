(function(){  
  
  var rules = {};
  var sheet = document.head.appendChild(document.createElement('style')).sheet;
  
  function selectTab(tabbox, tab){ 
    xtag.queryChildren(tabbox, 'menu > [selected], ul > [selected]').forEach(function(node){
      node.removeAttribute('selected');
    });
    tab.setAttribute('selected', '');
    var index = xtag.toArray(tab.parentNode.children).indexOf(tab);
    if (index != tabbox.selectedIndex) tabbox.selectedIndex = index;
    if (!rules[index]) {
      rules[index] = 1;
      var transform = 'transform: translateX(' + (index * -100) + '%);';
      sheet.insertRule('x-tabbox[selected-index="' + index + '"] > ul > li:nth-child(' + (index + 1) + '){ opacity: 1; z-index: 1; ' + xtag.prefix.css + transform + transform + '}', sheet.cssRules.length);
    }
    var panel = xtag.queryChildren(tabbox, 'ul > *')[index];
    if (panel) panel.setAttribute('selected', '');
  };

  function selectEvent(e){
    if (this.parentNode && this.parentNode.parentNode == e.currentTarget) selectTab(e.currentTarget, this);
  };
  
  function createAccessor(selector){
    return {
      get: function(){
        return xtag.queryChildren(this, selector)[0];
      }
    }
  };
  
  xtag.register('x-tabbox', {
    events: {
      'tap:delegate(menu > *)': selectEvent,
      'keydown:delegate(menu > *):keypass(13, 32)': selectEvent
    },
    accessors: {
      tabElements: {
        get: function(){
          return xtag.queryChildren(this, 'menu > *');
        }
      },
      panelElements: {
        get: function(){
          return xtag.queryChildren(this, 'ul');
        }
      }, 
      selectedIndex: {
        attribute: {
          validate: function(val){
            var index = Number(val);
            var tab = xtag.queryChildren(this, 'menu > *')[index];
            return tab ? index : -1;
          }
        },
        set: function(val, old){
          selectTab(this, xtag.queryChildren(this, 'menu > *')[val])
        }
      },
      selectedTab: createAccessor('menu > [selected]'),
      selectedPanel: createAccessor('ul > [selected]') 
    }
  });
  
})();
