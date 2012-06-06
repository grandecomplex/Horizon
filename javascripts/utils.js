window.h = window.h || {};
/*

Horizon - a mobile web app view management framework
Author - Alex Grande

*/

h.utils = (function() {
    
  // Array Remove - By John Resig (MIT Licensed)
  Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };
  
  
  var Utils = function() {
    this.getFile = function(file, callback) {
      var that = this;
      $.ajax({
        url:file,
        dataType: "html",
        success: function(data) {
            callback.apply(that, [data]);
        },
        cache: false
      });
    };

    this.render = function(data, template, callback) {
      this.getFile(template, function(file) {
        var hbTemplate = Handlebars.compile(file);
        callback(hbTemplate(data));
      });
    };
    
    this.inherits = function(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: { value: ctor, enumerable: false }
      });
    };
  };

  return new Utils();
})();