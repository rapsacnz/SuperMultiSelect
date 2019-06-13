({
  reInit: function(component, event, helper) {
    component.set("v.initialized", false);
    helper.init(component);
  },

  init: function(component, event, helper) {
    helper.init(component);
  },

  handleItemClick: function(component, event, helper) {
    helper.removeItem(component,event);
  },
  handleContainerClick: function(component, event, helper) {
    helper.handleContainerClick(component);
  },
})