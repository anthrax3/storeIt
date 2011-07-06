//
/*
* jQuery StoreIt Plugin - v0.1.0
* Abstraction of browser storage options - localStorage & cookies (NYI)
*
* Copyright (c) 2011 Matthew Mirande
* Dual licensed under the MIT or GPL Version 2 licenses.
*/

/*
* DOCS:
* @TITLE: clear();
* @DESC:  Clears all contents of localStorage
* @USAGE: $.fn.storeIt("clear");
*
*
* @TITLE: set();
* @DESC:  Sets a simple or complex obj to localStorage
* @USAGE: Simple: $.fn.storeIt("set", {"key1" : "val1"});
*         Complex: $.fn.storeIt("set", {
*           "key1":"val1",
*           "key2":"val2",
*           "key3":{
*             "subKey1":"subVal1",
*             "subKey2":{
*               "subSubKey1": "subSubVal1"
*             }
*           }
*         });
* @TODO:  Support simple syntax $.fn.storeIt("set", "key", "val");
*
*
* @TITLE: get();
* @DESC:  Retrieves single key or entire contents of localStorage.
*         If key is not present, return = false;
* @USAGE: All: $.fn.storeIt("get");
*         Single Key: $.fn.storeIt("get", "key3");
*         Sub-properties: $.fn.storeIt("get", "key3.subKey1");
*
*
* @TITLE: rm();
* @DESC:  Deletes a single key or multiple keys (if passed as array)
* @USAGE: Single: $.fn.storeIt("rm", "key1");
*         Multiple: $.fn.storeIt("rm", ["key1", "key2"]);
* @TODO:  Sub-property deletion via $.fn.storeIt("rm", "key1.subKeky1");
*
**/
(function ($) {
  //browser feature checks (source: hasJS - https://github.com/phiggins42/has.js)
  var hasLocalStorage = (function () {
      try {
        return "localStorage" in window && window["localStorage"] !== null;
      } catch (e) {
        return false;
      }
    })(),
    hasJSONParse = (function () {
      var parsed, supported = false;
      try {
        if ("JSON" in window && typeof JSON.parse == "function") {
          parsed = JSON.parse('{"a":true}');
          supported = !!(parsed && parsed.a);
        }
      } catch (e) {

      }
      return supported;
    })(),
    hasJSONStringify = (function () {
      try {
        return ("JSON" in window) && typeof JSON.stringify == "function" && JSON.stringify({ a: true }) == '{"a":true}';
      } catch (e) {
        return false;
      }
    })();

  //main plugin methods
  var methods = {
    init: function (key, val) {
      // default is to set localStorage
      // TODO: Update the method call logic / router (below) to allow
      // "key", "val" signature
      if (typeof key == "object") {
        methods.set(key);
      } else {
        methods.set(key, val);
      }
      //$.error("Supported commands are: get, set, clear, remove, count, key, and indexOf");
    },
    get: function (key) {
      var val = {},
          isNested = key ? key.indexOf(".") != -1 ? true : false : false;
      if (!key) {
        //get all contents of localStorage via: get();
        //deep-nested properties via: get("my.obj.prop");
        var len = localStorage.length,
            iKey,
            iVal;

        for (var i = 0; i < len; i = i + 1) {
          iKey = localStorage.key(i);
          iVal = localStorage.getItem(iKey);

          val[iKey] = JSON.parse(iVal);
        }
        return val;
      } else if (isNested) {
        var iObj = {};

        key = key.split(".");
        iObj = JSON.parse(localStorage.getItem(key[0]));

        //bail if the prop cannot be found - TODO: what if prop is missing lower down in the obj tree?
        if (!iObj) { return false; }

        key.shift();

        $.each(key, function (idx, value) {
          iObj = iObj[value] || false; //maybe?
        });
        return iObj;
      } else {
        iObj = ( localStorage.getItem(key) === null ) ? false : localStorage.getItem(key);
        return JSON.parse(iObj);
      }
    },
    set: function (key, val) {
      if (typeof key == "object") {
        var iObj = {},
            setVal;

        //grab current localStorage contents and merge with new key obj - ugly if you have lots of data!
        iObj = methods.get();
        $.extend(true, iObj, key);

        //set key, val collection in obj (sub-properties will be stringified json)
        $.each(iObj, function (iKey) {
          setVal = JSON.stringify(iObj[iKey]);
          localStorage.setItem(iKey, setVal);
        });
      } else {
        localStorage.setItem(key, val);
      }
    },
    clear: function () {
      localStorage.clear();
    },
    rm: function (key) {
      var store = methods.get(),
          keys = [];

      if (typeof key === "string") {
        //remove single key via: "key1"
        localStorage.removeItem(key);
      } else {
        //remove multiple keys via: ["key1", "key2"]
        $.each(key, function (iKey, iVal) {
          localStorage.removeItem(iVal);
        });
      }
    },
    count: function () {
      return localStorage.length;
    },
    key: function (idx) {
      return localStorage.key(idx);
    },
    indexOf: function (key) {
      var len = localStorage.length,
          iKey,
          pos = -1;

      for (var i = 0; i < len; i = i + 1) {
        iKey = localStorage.key(i);
        if (key === iKey) {
          pos = i;
        }
      }
      return pos;
    }
  };

  //attached method routing function
  $.storeIt = $.fn.storeIt = function (method) {
    //disable is browser doesn't have the features we need
    if (hasLocalStorage && hasJSONParse && hasJSONStringify) {
      if (methods[method]) { //call method directly if passed - ex: $.fn.store("get")
        //TODO - prevent calls to methods if required argument is not supplied
        //TODO - handle calls like $.fn.store("set", "key4", "val4");
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === "object" || !method) { //call init if raw object or nothing is passed 
        return methods.init.apply(this, arguments);
      } else { //show error if method is unrecognized
        $.error("Method " + method + " is not available in jQuery.storeIt");
      }
    } else {
      $.error("Browser does not support jQuery.storeIt >:-(");
    }
  };
})(jQuery);
