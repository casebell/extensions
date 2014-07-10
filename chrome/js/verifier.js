(function($) {

	$.fn.isVisible = function() {
		var deferred = $.Deferred();

		if (typeof(this) !== 'undefined' &&
			this.is(':visible')) {
			deferred.resolve("Element is visible");
		} else {
			deferred.reject("Element is NOT visible");
		}

		return deferred.promise();
	}

	$.fn.hasValue = function(text) {
		var deferred = $.Deferred();

		if (typeof(this) !== 'undefined') {
			if (this.val() !== 'undefined' && this.val().length > 0) {
				if (this.val() == text) {
					deferred.resolve("Element has correct value: " + text);
				} else {
					deferred.reject("Element value is '" + this.val() + "' instead of '" + text + "'");
				}
			} else {
				if (this.text() == text) {
					deferred.resolve("Element has correct value: " + text);
				} else {
					deferred.reject("Element value is '" + this.text() + "' instead of '" + text + "'");
				}
			}
		}

		return deferred.promise();
	}

	$.fn.verifyAttribute = function(attr, value) {
		var deferred = $.Deferred();

		var attrValue = this.attr(attr);
		if (attrValue == value) {
			deferred.resolve("Element attribute '" + attr + "' has correct value: " + value);
		} else {
			deferred.reject("Element attribute '" + attr + "' value is '" + attrValue + "' instead of '" + value + "'");
		}

		return deferred.promise();
	}
}(jQuery));