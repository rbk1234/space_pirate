
// jQuery helpers:

(function($) {
    'use strict';

    // ---------------- Change element's visibility (like show/hide except the element still takes up space)

    $.fn.visible = function() {
        return this.css('visibility', 'visible');
    };

    $.fn.invisible = function() {
        return this.css('visibility', 'hidden');
    };

    $.fn.visibilityToggle = function(state) {
        if ( typeof state === "boolean" ) {
            return state ? this.visible() : this.invisible();
        }

        return this.css('visibility', function(i, visibility) {
            return (visibility === 'visible') ? 'hidden' : 'visible';
        });
    };

    // ---------------- Element exists
    $.fn.elementExists = function() {
        return this.length !== 0;
    };

    // Checks whether element is actually still in DOM, or if it's just cached
    $.fn.isStale = function() {
        // Note: document.contains() does not work in Internet Explorer (IE does not consider the document an element)
        return this[0] !== document && !document.body.contains(this[0]);
    };

    // ---------------- Toggle checkbox if it wasn't the target of the event
    // (e.g. checkbox is in an li element, and the li was clicked)
    $.fn.toggleCheckboxIfNeeded = function(evt) {
        if (evt.target !== this[0]) {
            this.prop('checked', !this.prop('checked'));
        }
    };

    $.fn.onReturnKey = function(onReturn) {
        this.keyup(function(evt) {
            if (evt.keyCode === 13) {
                onReturn();
            }
        });
    };

    // If disable === true, all options except for the one selected will be disabled. If disable === false, enables all options.
    // Useful when disabling a select, because if you disable the select itself, it won't be sent to server on submit
    // (unless you want to do some hidden field micky mousing)
    $.fn.disableOptions = function(disable) {
        this.find('option:selected').prop('disabled', false);
        this.find('option:not(:selected)').prop('disabled', disable);
        return this;
    };

    $.fn.firstOption = function() {
        return this.find('option:first').val();
    };


    // General helpers:

    var util = SpacePirate.namespace("Utilities");

    util.roundToDecimal = function(num, numDecimals) {
        var factor = 10 * numDecimals;
        return Math.round((num + 0.00001) * factor) / factor;
    };

    util.minScreenWidth = function() {
        return parseInt($('.main-content').css('min-width'));
    };

    util.makeCallback = function (target, method) {
        return function () {
            method.apply(target, arguments);
        };
    };

    // Iterates through the keys of the object, calling the given function on each (key, value) pair
    util.iterateObject = function(obj, fn, thisArg) {
        if (obj) {
            Object.keys(obj).forEach(function(key) {
                fn.call(thisArg, key, obj[key]);
            }, this);
        }
    };

    util.currentOrgId = function() {
        return $('#current_org_id').val();
    };

    // Will return defaultValue if arg undefined, or if arg is an element of badValues. Otherwise returns arg.
    util.defaultFor = function (arg, defaultValue, badValues) {
        var useDefault = false;

        if ($.isArray(badValues)) {
            $.each(badValues, function(index, value) {
                if (arg === value) {
                    useDefault = true;
                }
            });
        }

        return (typeof arg === 'undefined' || useDefault) ? defaultValue : arg;
    };

    util.scrollToTop = function() {
        $('html, body').animate({ scrollTop: 0 }, "slow");
    };


    // ----------------- Set <=> Array

    // Warning: Not all browsers support the following:
    //      new Set([1,2,3]);
    //      Array.from(set);
    //      [...set]

    // Also, mozilla's polyfill for Array.from (https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill)
    // doesn't work for Sets (Sets will require a more advanced polyfill).
    // So using these instead for now:

    util.arrayToSet = function(array) {
        if (array instanceof Set) {
            return array;
        }

        var s = new Set();
        if (array) {
            array.forEach(function(element) {
                s.add(element);
            });
        }
        return s;
    };

    util.setToArray = function(setObject) {
        if (setObject instanceof Array) {
            return setObject;
        }

        var arr = [];
        if (setObject) {
            setObject.forEach(function(element) {
                arr.push(element);
            });
        }
        return arr;
    };


    util.objectSize = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    };

    util.renameObjectKey = function (obj, oldKey, newKey) {
        if (oldKey !== newKey) {
            Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, oldKey));
            delete obj[oldKey];
        }
    };

    util.isString = function(obj) {
        return (typeof obj === 'string' || obj instanceof String);
    };

    // Creates an array of length 'length', with each element set to be 'initialValue'
    util.createArray = function(length, initialValue) {
        initialValue = util.defaultFor(initialValue, null);

        var array = [];
        for (var i = 0; i < length; i++) {
            array.push(initialValue);
        }

        return array;
    };

    util.arrayDifference = function (mainArray, subtractedArray) {
        return mainArray.filter(function(i) {
            return subtractedArray.indexOf(i) < 0;
        });
    };

    // Similar to jQuery's inArray, but returns true/false instead of array index
    util.inArray = function(item, array) {
        return array && $.inArray(item, array) !== -1;
    };

    util.arraysEqual = function(array1, array2) {
        if (array1 === array2) {
            return true;
        }
        if (array1 === null || array2 === null) {
            return false;
        }
        if (array1.length !== array2.length) {
            return false;
        }

        for (var i = 0; i < array1.length; ++i) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    };
    

    // Adds commas to break up large numbers: 12345.6789 => 12,345.6789
    util.numberWithCommas = function(number) {
        var parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Only apply commas to non-decimal part of number
        return parts.join(".");
    };

    // Encodes a set of params into a url format. Used in cases where ajax is not an option
    util.encodeParamsInUrl = function (url, params) {
        var encoding = '?';

        $.each(params, function(key, value) {
            encoding += (key + '=' + value + '&');
        });

        encoding = encoding.slice(0, -1); // Get rid of last '&'

        return url + encoding;
    };

    // E.g. '<strong>ABCDEF</strong>' => 'ABCDEF'
    util.removeHtmlTags = function (string) {
        var rex = /(<([^>]+)>)/ig;
        return string.replace(rex, '');
    };

    // Escapes certain characters to avoid 'invalid regular expression' errors when searching
    util.safeRegExp = function(pattern, flags) {
        var safePattern = pattern.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        return new RegExp(safePattern, flags);
    };

    // Serializes a form. Can optionally pass in an object holding any additional parameters you want to send with the form.
    util.serializeForm = function(form, additionalParams) {
        var serializedData = form.serialize();

        if (additionalParams) {
            serializedData += ('&' + $.param(additionalParams));
        }

        return serializedData;
    };
    
    // Updates a Foundation tooltip's title text (simply replacing the 'title' prop will not work during runtime)
    util.updateFoundationTooltip = function($tooltip, newText) {
        if (newText) {
            window.Foundation.libs.tooltip.getTip($tooltip).contents().first().replaceWith(newText);
        }
    };

    util.capitalizeFirstLetter = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    
    util.logPerformance = function (key, start, end) {
        key = util.stringToFixedLength(key, 20);
        var time = util.stringToFixedLength((end - start).toFixed(2), 9, true);
        console.log(key + ' : ' + time + ' milliseconds');
    };

    util.stringToFixedLength = function(str, length, padLeft, padCharacter) {
        padCharacter = util.defaultFor(padCharacter, ' ');

        var padding = new Array(length).join(padCharacter);

        if (typeof str === 'undefined') {
            return padding;
        }

        if (padLeft) {
            return (padding + str).slice(-length);
        } else {
            return (str + padding).substring(0, length);
        }
    };

    util.setupAllNoneCheckbox = function($allNoneCb, $childCbs) {
        function updateAllNone(){
            var numChildrenChecked = $childCbs.filter(':checked').length;

            if(numChildrenChecked === 0) {
                $allNoneCb.prop('checked', false).prop('indeterminate', false);
            }
            else {
                $allNoneCb.prop('checked', true).prop('indeterminate', $childCbs.length !== numChildrenChecked);
            }
        }

        $allNoneCb.on('change', function(){
            $childCbs.prop('checked', $(this).prop('checked'));
        });

        $childCbs.on('change', function(){
            updateAllNone();
        });

        updateAllNone(); // Initial state
    };

})(jQuery);
