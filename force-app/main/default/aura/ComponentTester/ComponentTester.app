<aura:application extends="force:slds">

  <aura:attribute name="stateOptions" type="Object[]" default="[]" />
  <aura:attribute name="statesSelected" type="String" default="" />
  <aura:handler name="init" value="{!this}" action="{!c.loadStateOptions}" />

  <div class="slds-card slds-m-top_small" style="position:static;">
    <div class="slds-grid slds-grow slds-p-vertical_x-small slds-p-horizontal_large slds-shrink-none slds-theme_shade">
      <c:SuperMultiSelect label="State" optionsInit="{!v.stateOptions}" class="slds-size_1-of-1 " value="{!v.statesSelected}" addAlphaCategories="true" placeholder="Select a state or search..." />
    </div>
  </div>

</aura:application>
