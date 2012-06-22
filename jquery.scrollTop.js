/*!
* jQuery scrollintoview() plugin and this also works for mobile devices(ios5+ where this css overflow-y: scroll; -webkit-overflow-scrolling: touch; works)
*
* Version 1.0 (14 Jul 2012)
* Requires jQuery 1.4 or newer

*/

(function ($) {

    var defaults = {
        duration: "fast",
        offset: 0
    };

    var rootrx = /^(?:html)$/i;

    var topBorders = function (domElement, styles) {
        styles = styles || (document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(domElement, null) : domElement.currentStyle);
        var isStyleExist = document.defaultView && document.defaultView.getComputedStyle ? true : false;
        return {
            top: (parseFloat(isStyleExist ? styles.borderTopWidth : $.css(domElement, "borderTopWidth")) || 0)
        };
    };

    var dimensions = function ($element) {
        var win = $(window);
        var isRoot = rootrx.test($element[0].nodeName);
        return {
            scroll: {
                top: (isRoot ? win : $element).scrollTop()
            },
            border: isRoot ? { top: 0} : topBorders($element[0]),
            rect: (function () {
                return {
                    top: isRoot ? 0 : $element[0].getBoundingClientRect().top
                };
            })()
        };
    };

    $.fn.extend({
        ScrollTop: function (options) {

            options = $.extend({}, defaults, options);
            var el = this.eq(0);
            var scroller = el.closest(":scrollable");

            // check if there's anything to scroll in the first place
            var animOptions = {};
            if (scroller.length > 0) {
                scroller = scroller.eq(0);

                var dim = {
                    e: dimensions(el),
                    s: dimensions(scroller)
                };

                var rel = {
                    top: dim.e.rect.top - (dim.s.rect.top + dim.s.border.top)
                };
                animOptions.scrollTop = dim.s.scroll.top + rel.top;
            }
            else {
                animOptions.scrollTop = $(el).scrollTop();
            }

            if (!$.isEmptyObject(animOptions)) {
                if (rootrx.test(scroller[0].nodeName)) {
                    scroller = $("html,body");
                }
                scroller
						.animate(animOptions, options.duration)
						.eq(0)
						.queue(function (next) {
						    $.isFunction(options.complete) && options.complete.call(scroller[0]);
						    next();
						});
            }

            return this;
        }
    });

    var scrollValue = {
        auto: true,
        scroll: true,
        visible: false,
        hidden: false
    };

    $.extend($.expr[":"], {
        scrollable: function (element, index) {

            var styles = (document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(element, null) : element.currentStyle);
            var overflow = {
                y: scrollValue[styles.overflowY.toLowerCase()] || false,
                isRoot: rootrx.test(element.nodeName)
            };

            if (!overflow.y && !overflow.isRoot) {
                return false;
            }

            var vertical = {
                h: {
                    sh: element.scrollHeight,
                    ch: element.clientHeight
                },
                scrollableY: function () {
                    return (overflow.y || overflow.isRoot) && this.h.sh > this.h.ch;
                }
            };
            return vertical.scrollableY();
        }
    });
})(jQuery);
