/*

Horizon - a mobile web app view management framework
Author - Alex Grande
Soon to be stable enough for github :)

*/

window.h = window.h || {};

h.transition = (function() {
  var toEl, fromEl;
  
  function isSibling() {
    var hasSibling = false;
    var $siblings = $(toEl).siblings();
    
    $siblings.each(function(el, i) {
      if (fromEl === el) {
        hasSibling = true;
      }
    });
    
    return hasSibling;
  }

  var Transition = function() {
    $("section.view").live("webkitAnimationEnd", function() {
        $(this).removeClass("slide drawer in out reverse");
    });
    
    $("section.view.out").live("webkitAnimationEnd", function() {
      $(this).removeClass("current");
      
      if (!isSibling()) {
        $(this).parents(".current").removeClass("current");
      }
    });
  };
  
  // TODO: create a base view change for default css classes
  Transition.prototype.slide = function(from, to, direction) {
    toEl = to;
    fromEl = from;
    if (!direction) {
        direction = '';
    }
    $(from.element).addClass("slide out "+direction);
    $(to.element).addClass("slide current in "+direction);
  };
  
  Transition.prototype.show = function(from, to) {
    if (from) {
        $(from.element).removeClass("current out");
        $(to.element).addClass("current");
    } else {
        $(to.element).addClass("current");
    }
  };
  
  return new Transition();
})();