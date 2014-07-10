/*  resolves if element is visible
    returns a jQuery.Deferred().promise()
    fails if it processes longer than threshold (default: 1000ms) */
;
(function($, undefined) {
    $.waitForElement = function(selector, thresh, annotate) {

        var d = $.Deferred(),
            start = +new Date(),
            threshold = thresh || 1000,
            _document = document,
            _setTimeout = setTimeout;

        function pollElement() {
            var element = $(selector);
            logger.log('pollElement');
            if (checkTime(d)) {
                logger.log('checkTime');
                if (element) {
                    logger.log('element');
                    if (!$(element).is(':visible')) {
                        logger.log('is not Visible');
                        _setTimeout(pollElement, 0);
                    } else {
                        logger.log('is visible');
                        if (typeof(annotate) !== 'undefined' &&
                            annotate === true) {
                            $(selector).css("border", "2px dotted red");
                        }

                        d.resolve();
                        return;
                    }
                } else {
                    logger.log('no element');
                    _setTimeout(pollElement, 0);
                }
            } else {
                logger.log('A TAKA');
            }
        }

        function checkTime(d) {
            var time = (+new Date()) - start;
            logger.log(d.state());
            logger.log(time);
            if (time > threshold) {
                d.reject();
                logger.log('checkTime reject');
                return false;
            } else {
                logger.log('checkTime pass');
                return true;
            }
        }

        pollElement();

        return d.promise();
    };
})(jQuery);

var dispatchMouseEvent = function(target, var_args) {
    var e = document.createEvent("MouseEvents");
    // If you need clientX, clientY, etc., you can call
    // initMouseEvent instead of initEvent
    e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
    target.dispatchEvent(e);
};

(function($) {

    $.fn.click = function() {
        if (this.get().length > 0) {
            dispatchMouseEvent(this.get()[0], 'click', true, true);
        }
    }
}(jQuery));

(function($) {

    $.scrollToElement = function(element) {
        if (this.get().length > 0) {
            dispatchMouseEvent(this.get()[0], 'click', true, true);
        }
    }
}(jQuery));