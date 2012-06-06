/*

Horizon - a mobile web app view management framework
Author - Alex Grande

*/

window.h = (function() {
    var currentView = null;
    var currentWrapper = null;
    
    var app;

    var historyPush = function(view) {
        history.pushState({
            name: view.name,
            parent: view.parent
        }, view.name, "#"+view.name);
    };
    
    function addPopStateEvent() {
      window.addEventListener("popstate", function(e) {
          var name = (e.state) ? e.state.name : null,
              parent = (e.state) ? e.state.parent : null,
              stackList,
              previousView;
          
          if (name && parent) {
              
              parent = findView(app, parent);

              if (parent.viewOrder) {
                  stackList = parent.viewOrder;
                  previousView = stackList[stackList.length-2];
              }

              if (previousView  && previousView === name) {
                  this.goBack();
              } else if (name && name !== this.getCurrentView().name) {
                  this.goTo(parent.views[name]);
              }
          }
          
      }.bind(this), false);
    }
    
    function findView(view, viewName) {
        if (view.name === viewName) {return app;}       
        
        for (var viewChild in view.views) {
            if (view.views[ viewChild ].name === viewName) {
                return view.views[ viewChild ];
            } else {
                findView(view.views[ viewChild ], viewName);
            }
        }
    }
    
    function setActiveViews(incoming) {
        var parent = findView(app, incoming.parent);
        
      var siblings = parent.views;
      
      if (!siblings) {return;}
      
      for (var sibling in siblings) {
        if ( siblings.hasOwnProperty(sibling) ) {
          if (siblings[sibling].name !== incoming.name) {
            siblings[sibling].current = false;
          } else {
            siblings[sibling].current = true;
            $(siblings[sibling].element).addClass("current");
          }
        }
      }

      if (parent.parent) {
        setActiveViews( parent );
      }

    }

    // TOD Fix view going to a view, then returning to a previous view bug.
    function stack(incoming) {
      var parent = findView(app, incoming.parent);
      var stackList = parent.viewOrder;
      if (stackList[stackList.length-1] === incoming.name) {
          return false;
      }
      for (var i = 0; i < stackList.length; i++) {
          if (stackList[i] === incoming.name) {
              stackList.remove(stackList.length - 2, stackList.length);
          }
      }
      if (stackList[stackList.length-1] !== incoming.name) {
          stackList.push(incoming.name);
      }
    }
    
    var Horizon = function() {
      addPopStateEvent.call(this);
    };

    Horizon.prototype.getCurrentView = function() {
      return currentView;
    };
    
    Horizon.prototype.setCurrentView = function(view) {
      currentView = view;
      return view;
    };
    
    
    // TODO Ideally these can be combined
    Horizon.prototype.getCurrentWrapper = function() {
      return currentWrapper;
    };
    
    Horizon.prototype.setCurrentWrapper = function(view) {
      currentWrapper = view;

      return view;
    };

    Horizon.prototype.goTo = function(view, type, direction) {
      var leavingView = this.getCurrentView();
      // var wrapper = this.getCurrentWrapper();
      if (!type) {
          type = "slide";
      }
      
      if (!leavingView) {
          type = "show";
      }
              
      h.transition[type](leavingView, view, direction);    
      
      setActiveViews(view);
      
      if (!view.abstract) {
          this.setCurrentView(view);
          stack(view);
      }

      if (leavingView) {
          h.events.fire("view:leave:"+leavingView.name);
      }
      
      h.events.fire("view:enter:"+view.name);
      
      view.element.height = window.innerHeight + "px";
      
      historyPush(view);
    };
    
    Horizon.prototype.goBack = function() {
      var currentView = this.getCurrentView();
      var parent = findView(app, currentView.parent);

      this.goTo( parent.views[ parent.viewOrder[parent.viewOrder.length-2] ], "slide", "reverse");
    };
        
    Horizon.prototype.create = function(view, options) {
      options = options || {};
      this.viewPath = options.viewPath || "assets/partials/";
      
      app = window[view.name] = view;
      // TODO, test this to make sure I can delete it
      // this.app.wrapper = view;

      document.body.appendChild(view.element);

      this.setCurrentWrapper(view);
    
      return view;
    };
        
    Horizon.prototype.getCurrentIndex = function() {
      var wrapper = this.getCurrentWrapper();
      var index;
      wrapper.viewOrder.forEach(function(view, i) {
         if (wrapper.views[view].current) {
             index = i;
         } 
      });
      
      return index;
    };
    
    
    var horizon = new Horizon();
    
    return horizon;
})();