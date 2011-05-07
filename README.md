jQuery StoreIt Plugin - v0.1.0
==============================
Simple and powerful client-side document storage w/ appropriate
fallbacks for our lesser-capable browser friends.

_Note: This is pre-release software under active
development! Not intended for use in production (yet)!_ 

API
---
###clear###
Clears all contents of the store

    //clear out the store
    $.storeIt("clear");
- - -


###set###
Add a simple or complex obj to the store  

    //Add a simple key, val object
    $.storeIt("set", {"key1" : "val1"});

    //Add a complex document to the store
    $.storeIt("set", {
      "key1":"val1",
      "key2":"val2",
      "key3":{
        "subKey1":"subVal1",
        "subKey2":{
          "subSubKey1": "subSubVal1"
        }
      }
    });
- - -

###get###
Retrieves single key or entire contents of localStorage. If key is not present, return = false;  

    //Get entire store
    $.storeIt("get");

    //Get single Key
    $.storeIt("get", "key3");

    //Get sub-properties
    $.storeIt("get", "key3.subKey1");
- - -

###rm###
Removes a single key or multiple keys (if passed as array)  

    //Remove a single key
    $.storeIt("rm", "key1");

    //Remove multiple keys
    $.storeIt("rm", ["key1", "key2"]);

License
-------
jQuery StoreIt Plugin  
Copyright (c) 2011 Matthew Mirande  
Dual licensed under the MIT or GPL Version 2 licenses.
