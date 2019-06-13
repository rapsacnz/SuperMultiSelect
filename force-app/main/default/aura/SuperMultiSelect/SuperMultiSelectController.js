({

  reInit: function(component, event, helper) {
    component.set("v.initialized", false);
    helper.init(component);
  },

  init: function(component, event, helper) {
    helper.init(component);
  },

  updateSelectedItems: function(component, event, helper) {
    helper.updateSelectedItems(component);
  },

  handleClick: function(component, event, helper) {
    var mainDiv = component.find('main-div');
    $A.util.addClass(mainDiv, 'slds-is-open');
    component.set('v.isActive', true);
  },

  handleClose: function(component, event, helper) {
    var mainDiv = component.find('main-div');
    $A.util.removeClass(mainDiv, 'slds-is-open');
    component.set('v.isActive', false);
  },

  handleOnInput: function(component, event, helper) {
    var search = event.target.value;
    helper.doSearch(component,search);
  },

  handleSelection: function(component, event, helper){
    helper.selectItem(component, event);
  },

  handleTagRemoved: function(component, event, helper){
    helper.removeItem(component, event);
  },

  handleTagContainerClick: function(component, event, helper){
    helper.handleTagContainerClick(component, event);
  }

  



})