({
  init: function(component) {
    if (component.get("v.initialized") == true) {
      return;
    }
    component.set("v.initialized", true);
    //fill all the display lists.
    //order is: optionsInit -> optionsFull -> optionsFiltered -> optionsDisplay
    var optionsInit = component.get("v.optionsInit");
    var optionsPopular = component.get("v.popularOptions");

    var optionsSet = new Set(optionsInit);
    component.set("v.optionsFull", optionsInit);
    component.set("v.optionsFiltered", optionsInit);
    this.generateOptionsDisplay(component, optionsInit);
  },

  generateOptionsDisplay: function(component, optionsSource) {

    optionsSource.sort(function compare(a, b) {
      if (a.value == 'All') {
        return -1;
      } else if (a.value < b.value) {
        return -1;
      }
      if (a.value > b.value) {
        return 1;
      }
      return 0;
    });

    if (component.get("v.addAlphaCategories")) {
      //reverse iterate through optionsSource, adding in categories
      //reverse needed as we are modifying the array
      //for (var i = optionsSource.length -1 ; i >= 0; i--)
      var optionsDisplay = [];
      var alphaCategoryArray = [];

      //add popular options if present:
      var optionsPopular = component.get("v.popularOptions");
      var optionsDataTypePlural = component.get("v.optionsDataTypePlural");
      var optionsDisplayLabel = 'Popular ' + optionsDataTypePlural;

      if (optionsPopular && optionsPopular.length > 0) {
        optionsDisplay.push({ label: optionsDisplayLabel, value: optionsDisplayLabel, isCategory: true });
        optionsDisplay = [...optionsDisplay, ...optionsPopular];
      }

      for (var i = 0; i < optionsSource.length; i++) {
        var option = optionsSource[i];
        var letter = option.label.substring(0, 1).toUpperCase();

        if (alphaCategoryArray.length == 0) {
          alphaCategoryArray.push({ label: letter, value: letter, isCategory: true });
          alphaCategoryArray.push(option);
        } else if (alphaCategoryArray[0].value === letter) {
          alphaCategoryArray.push(option);
        } else if (alphaCategoryArray[0].value != letter) {

          optionsDisplay = [...optionsDisplay, ...alphaCategoryArray];
          alphaCategoryArray = [];
          alphaCategoryArray.push({ label: letter, value: letter, isCategory: true });
          alphaCategoryArray.push(option);
        }
      }
      //clean up in case we have something still in the alphacategory array
      if (alphaCategoryArray.length) {
        optionsDisplay = [...optionsDisplay, ...alphaCategoryArray]
      }

      component.set("v.optionsDisplay", optionsDisplay);

    } 
    else {
      component.set("v.optionsDisplay", optionsSource);
    }
  },

  doSearch: function(component, search) {

    
    var self = this;
    //var search = component.get("v.searchString");
    if (!search || search.length < 2) {
      //show by default
      //if different, put back and despatch event to tell parent to reverse filter
      var filtered = component.get("v.optionsFiltered");
      var full = component.get("v.optionsFull");

      if (filtered.length < full.length) {
        component.set("v.optionsFiltered", full);
        self.generateOptionsDisplay(component, full);
      }
      return;
    }

    var searchKeys = component.get("v.searchKeys");
    var optionsFull = component.get("v.optionsFull");

    var optionsFiltered = [];
    optionsFull.forEach(function(obj) {
      if (self.isMatch(obj, searchKeys, search)) {
        optionsFiltered.push(obj);
      }
    });

    component.set("v.optionsFiltered", optionsFiltered);
    self.generateOptionsDisplay(component, optionsFiltered);

  },

  //recursive object treversal - currently only traverses deeper arrays
  isMatch: function(searchItem, searchKeys, searchValue) {
    self = this;

    //if a normal property, and matches, we are done
    //looping on keys first as assume that this is a smaller list than the attribute list
    var match = searchKeys.some(function(key) {
      if (!Array.isArray(searchItem[key])) {
        if (searchItem[key] && searchItem[key].search(new RegExp(searchValue, "i")) > -1) {
          return true;
        }
      }
    });
    if (match) {
      return match;
    }

    //else, check for deeper arrays
    match = Object.keys(searchItem).some(function(searchItemElement) {
      if (Array.isArray(searchItemElement)) {
        searchItemElement.some(function(searchItemArray) {
          return self.isMatch(searchItemArray, searchKeys, searchValue);
        });
      }
    });

    return match;

  },

  //recursive object treversal - returns a array based on supplied keys
  getValues: function(searchItem, searchKeys, resultArray) {
    self = this;
    if (Array.isArray(searchItem)) {
      searchItem.forEach(function(searchArrayItem) {
        return self.getValues(searchArrayItem, searchKeys, resultArray);
      });
    } else {
      searchKeys.forEach(function(key) {
        if (searchItem[key]) {
          resultArray.push(searchItem[key]);
        }
      });
      return resultArray;
    }
  },

  getSelectedOptions: function(component) {

    //look in regular list    
    //no need to look in popular options list, as we are setting values lockstep
    var optionsFull = component.get("v.optionsFull");
    var values = [];
    optionsFull.forEach(function(option) {
      if (option.selected) {
        values.push(option);
      }
    });
    return values;

  },

  selectItem: function(component, event) {
    var item = event.currentTarget;
    if (!item || !item.dataset) {
      return;
    }

    var value = item.dataset.value;
    var selected = item.dataset.selected;

    this.performSelection(component,value,selected);

    var selectedOptions = this.getSelectedOptions(component);
    var selectedValues = selectedOptions.map(option => option.value);
    component.set("v.value",selectedValues.join(";"));

  },

  updateSelectedItems: function(component) {
    var value = component.get("v.value");
    var self = this;
    if ($A.util.isEmpty(value)){
      return;
    }
    var selectedItems = value.split(";");
    selectedItems.forEach(item => {
      self.performSelection(component,item,true);
    });
  },

  removeItem: function(component, event){
    var data = event.getParam('data');
    var value = data.tag;

    if ($A.util.isEmpty(value)){
      return;
    }

    //passing in "true" because perform selection toggles the value (good design idea?? hmmm.)
    this.performSelection(component,value,"true");

    var selectedOptions = this.getSelectedOptions(component);
    if (selectedOptions.length == 0){
      component.set("v.value","");
    }
    else {
      var selectedValues = selectedOptions.map(option => option.value);
      component.set("v.value",selectedValues.join(";"));
    }
  },

  performSelection: function(component,value,selected){
    //find the option and set it's value
    component.set("v.showFilter",false);
    var optionsFull = component.get("v.optionsFull");
    optionsFull.forEach(function(option) {
      if (option.value == value) {
        option.selected = selected == "true" ? false : true;
      }
    });

    //if we are using popular options, set it's value as well
    var optionsPopular = component.get("v.popularOptions");
    if (optionsPopular && optionsPopular.length > 0) {
      optionsPopular.forEach(function(option) {
        if (option.value == value) {
          option.selected = selected == "true" ? false : true;
        }
      });
    }
 
    component.set("v.optionsDisplay", component.get("v.optionsDisplay"));
    component.set("v.popularOptions",optionsPopular);
    component.set("v.optionsFull",optionsFull);
  },

  handleTagContainerClick: function(component) {
    component.set("v.showFilter",true);
    component.set("v.searchString","");
    this.doSearch(component,"")
  },

  

})