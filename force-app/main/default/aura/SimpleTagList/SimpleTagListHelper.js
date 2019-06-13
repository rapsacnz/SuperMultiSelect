({
  init: function(component) {

    if (component.get("v.initialized")) {
      return;
    }
    component.set("v.initialized", true);

    var value = component.get("v.value");
    if (!value){
      component.set("v.values", []);
    }
    else {
      var values = value.split(';');
      component.set("v.values", value.split(';'));
    }
    
  },

  removeItem: function(component,event) {

    if(event.currentTarget && event.currentTarget.dataset && event.currentTarget.tagName){
      var evt =component.getEvent('tagRemoved');
      evt.setParams({data:{tag:event.currentTarget.dataset.tagName} });
      evt.fire();
    }
    event.preventDefault();
    event.stopImmediatePropagation();
  },

  handleContainerClick: function(component) {
    var evt =component.getEvent('tagContainerClick');
    evt.fire();
  },
})