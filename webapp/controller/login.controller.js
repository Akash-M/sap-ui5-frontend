sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("BikeRentalApp.controller.login", {
		init : function() {
		    sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		    this.getRouter().initialize();
		},
		
		login: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("dashboard");
		},
		
		nav: function(oEvent){
			var route = oEvent.getSource().data("route");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo(route);
		}
		
	});
});