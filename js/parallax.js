window.one = window.one || {};

one.parallax = function (dom, config) {
    config = config || {};
    config.x = config.x || 1;
    config.y = config.y || 1;
    var layers = [];
    var getStyle = function (el, cssprop) {
        if (el.nodeType !== 3) {
            if (el.currentStyle) { // IE
                return el.currentStyle[cssprop];
            } else if (document.defaultView && document.defaultView.getComputedStyle) { // Firefox
                return document.defaultView.getComputedStyle(el, '')[cssprop];
            } else { // Try and get inline style
                return el.style[cssprop];
            }
        }
        return undefined;
    };
    var traverse = function (el) {
        for (var i = 0; i < el.childNodes.length; i++) {
            if (el.childNodes[i].nodeType === 1) {
                var child = el.childNodes[i],
                    zIndex = getStyle(child, 'z-index');
                if (zIndex !== undefined && zIndex !== 'auto') {
                    layers.push({ node: child, zIndex: parseInt(zIndex, 10) });
                }
                traverse(child);
            }
        }
    };

    traverse(dom);

    var move = function(e) {
        var x = e.pageX || window.event.clientX + document.body.scrollLeft,
            y = e.pageY || window.event.clientY + document.body.scrollTop,
            width = window.innerWidth || (document.documentElement || document.body).clientWidth,
            height = window.innerHeight || (document.documentElement || document.body).clientHeight,
            offsetX = ((x / width) - 0.5) * config.x;
            offsetY = ((y / height) - 0.5) * config.y;

        for (var i = 0; i < layers.length; i++) {
            layers[i].node.style.marginLeft = -(100 - layers[i].zIndex) * offsetX + 'px';
            layers[i].node.style.marginTop = -(100 - layers[i].zIndex) * offsetY + 'px';
        }
    };

    if (window.attachEvent) {
        window.attachEvent('onmousemove', move);
    } else if (window.addEventListener) {
        window.addEventListener('mousemove', move, false);
    } else {
        var oldMove = window.onmousemove;
        if (oldMove) {
            window.onmousemove = function(e) {
                oldMove(e);
                move(e);
            };
        } else {
            window.onmousemove = move;
        }
    }
};
