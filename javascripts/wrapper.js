/*

Horizon - a mobile web app view management framework
Author - Alex Grande
Soon to be stable enough for github :)

*/

window.h = window.h || {};

// TODO generalize between view and wrapper

window.h.Wrapper = (function() {
  var ID_NAMESPACE = "-wrapper";
  
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
  
  var Wrapper = function(options) {
    options = options || {};
    this.element = create(this.name);
    this.viewOrder = [];
    this.views = {};
    this.events();
    this.stackList = [];
  };
  
  // interface: name, addEvents, removeEvents
  
  Wrapper.prototype.add = function(view) {
    view.parent = this.name;
    this.views[view.name] = view;
//        this.viewOrder.push(view.name); TODO delete this line?
    this.element.appendChild(view.element);
    
    return view;
  };
  
  Wrapper.prototype.remove = function() {
    // TODO go back?
    delete this.views[this.name];
  };
  
  Wrapper.prototype.events = function() {
    var that = this;
    window.addEventListener("load", function() {
      that.onEnter();
    },false);

    window.addEventListener("unload", function() {
      that.onLeave();
    }, false);
  };
  
  // TODO: get this to cause children methods to fire
  Wrapper.prototype.onEnter = function() {
    var viewLentgh = this.views.length;
    this.addEvents();

    // loop over resurcively to find sub children
    for (var i = 0; i < viewLentgh; i++) {
      if (this.views[i].current) {
        return h.goTo(this.views[i], "show");
      }
    }
  };
  
  Wrapper.prototype.onLeave = function() {
     this.removeEvents();
     if (this.views.length) {
       for (var view in this.views) {
         if (this.views.hasOwnProperty(view)) {
            h.events.fire("view:leave:"+view.name);
         }
       }
     }
  };
  
  Wrapper.prototype.addEvents = function() {};
  
  Wrapper.prototype.removeEvents = function() {};
      
  return Wrapper;

})();