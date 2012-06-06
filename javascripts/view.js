/*

Horizon - a mobile web app view management framework
Author - Alex Grande
Soon to be stable enough for github :)

*/

window.h = window.h || {};

window.h.View = (function() {
  var ID_NAMESPACE = "-view";

  var content;
  
  var viewIndex = 0;
  
  function create(name) {
    var nameSpaced = name+ID_NAMESPACE;
    var element = document.getElementById(nameSpaced);
    if (!element) {
        element = document.createElement("section");
        element.id = name+ID_NAMESPACE;
    }
    
    $(element).addClass("view");

    return element;
  }
  
  var View = function(options) {
    options = options || {};
    this.noContent = this.noContent || null;
    this.element = create(this.name);
    if (!this.abstract) {
        this.setContent(options); 
    }
    // TODO deprecated?
    this.viewOrder = [];
    
    this.stack = [];

    this.views = {};
    this.events();
  };
  
  // interface: name, addEvents, removeEvents
  
  // TODO: Does a view need add? Wouldn't only wrappers need to add and remove views?
  View.prototype.add = function(view, parent) {
    view.parent = this.name;
    this.views[view.name] = view;
//        this.viewOrder.push(view.name);
    if (parent) {
      this.element.querySelector(parent).appendChild(view.element);
    } else {
      this.element.appendChild(view.element);
    }
    
    return view;
  };
  
  View.prototype.remove = function() {
    delete this.views[this.name];
  };
  
  View.prototype.events = function() {
    var that = this;
    h.events.subscribe("view:enter:"+this.name, function(e) {
        that.onEnter();
    });
    
    h.events.subscribe("view:leave:"+this.name, function(e) {
         that.onLeave();           
    });
  };
  
  // TODO: get this to cause children methods to fire if it is showing
  View.prototype.onEnter = function() {
    this.addEvents();
  };
  
  View.prototype.onLeave = function() {
    this.removeEvents();
  };
  
  View.prototype.addEvents = function() {};
  
  View.prototype.removeEvents = function() {};
  
  View.prototype.getContent = function() {
    return content;
  };
  
  View.prototype.setContent = function(options, callback) {
    var data = (!options.data || this.noContent) ? null : options.data;
    
    h.utils.render(data, h.viewPath+this.name+".html", function(compiledContent) {
      content = compiledContent;
      // TODO: Remove jquery dependency
      if (options.child) {
        $(this.element).append(content);
      } else {
        $(this.element).empty().html(content);
      }
      
      if (typeof options.fireEvent === "undefined" || options.fireEvent !== false) {
        if (this.onLoad) {
          this.onLoad();
        }
        
        h.events.fire("content:loaded:"+this.name);
      }
      
      if (callback) {callback();}
    }.bind(this));
  };
      
  return View;
})();