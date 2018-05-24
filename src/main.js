/* ***** IS: X-TABBOX
	** DOES:
	** DEVELEPMENT NOTES:
	   * Enhancement: Put in enhancement for sheet styles to write a stylesheet for the current nodes name. [see comments #1]
	   * Enhancement: Put in enhancement for event targets to accept events for all elements with a menu as a child. ```* > menu > *``` . [see comments #2]
***** */
const _x_display_ = (function _io_display_() {
    var rules = {};
    var _sheet = document.head.appendChild(document.createElement('style')),
		sheet = _sheet.sheet;
		
		_sheet.className = "sheet_tabbox";

    function selectTab(tabbox, tab) {
        var previous = [], fireSelected = tab && !tab.hasAttribute('selected');

        xtag.queryChildren(tabbox, 'menu > [selected], ul > [selected]').forEach(function (node) {
            previous.push(node);
            node.removeAttribute('selected');
        });

        tab.setAttribute('selected', '');

        var index = xtag.toArray(tab.parentNode.children).indexOf(tab);
        if (index != tabbox.selectedIndex) tabbox.selectedIndex = index;

        if (!rules[index]) {
            rules[index] = 1;
            var transform = 'transform: translateX(' + (index * -100) + '%);';
			/* ** @note #1:
			  * Changed the static x-tabbox pointer to an evolving element name 
			  * so that you can use this tabbox's built in stylesheet builder in prototypes.
			** */
            sheet.insertRule(tabbox.nodeName.toLowerCase() + '[selected-index="' + index + '"] > ul > li:nth-of-type(' + (index + 1) + '){ opacity: 1; z-index: 1; ' + xtag.prefix.css + transform + transform + '}', sheet.cssRules.length);
        }

        var panel = xtag.queryChildren(tabbox, 'ul > li')[index];
        if (panel) panel.setAttribute('selected', '');

        if (fireSelected) xtag.fireEvent(tabbox, 'tabselected', {
            detail: {
                currentTab: tab,
                currentPanel: panel,
                previousTab: previous[0],
                previousPanel: previous[1]
            }
        }); 
    };

    function selectEvent(e) {
        if (this.parentNode && this.parentNode.parentNode == e.currentTarget) selectTab(e.currentTarget, this);
    };

    function createAccessor(selector) {
        return {
            get: function () {
                return xtag.queryChildren(this, selector)[0];
            }
        }
    };

    const _tabbox = xtag.register('x-tabbox', {
        events: {
			/* **
			  * @note #2: 
			  * changed this to target any element that has a menu as a child to make it more friendly to prototypes
			** */
            'tap:delegate(* > menu > *)': selectEvent,
            'keydown:delegate(* > menu > *):keypass(13, 32)': selectEvent
        },
        accessors: {
            tabElements: {
                get: function () {
                    return xtag.queryChildren(this, 'menu > *');
                }
            },
            panelElements: {
                get: function () {
                    return xtag.queryChildren(this, 'ul');
                }
            },
            selectedIndex: {
                attribute: {
                    validate: function (val) {
                        var index = Number(val);
                        var tab = xtag.queryChildren(this, 'menu > *')[index];
                        return tab ? index : -1;
                    }
                },
                set: function (val, old) {
                    selectTab(this, xtag.queryChildren(this, 'menu > *')[val]);
                }
            },
            selectedTab: createAccessor('menu > [selected]'),
            selectedPanel: createAccessor('ul > [selected]')
        }
    });
    return _tabbox;
})();

