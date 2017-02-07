sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("BikeRentalApp.controller.customersubscription", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf BikeRentalApp.view.customersubscription
		 */
		onInit: function() {
			var oModel = this.getView().getModel();
			console.log(oModel);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf BikeRentalApp.view.customersubscription
		 */
		onBeforeRendering: function() {
			var csrfToken = this.getView().getModel().oHeaders;
			csrfToken["UToken"] = window.localStorage.getItem('UToken');
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf BikeRentalApp.view.customersubscription
		 */
		onAfterRendering: function() {
			var oModel = this.getView().getModel();
			var oVBox1 = sap.ui.getCore().byId(this.createId("custsubsvbox_id1"));
			var oVBox2 = sap.ui.getCore().byId(this.createId("custsubsvbox_id2"));
			var oVBox3 = sap.ui.getCore().byId(this.createId("custsubsvbox_id3"));
			var oVBox4 = sap.ui.getCore().byId(this.createId("custsubsvbox_id4"));
			var oVBox5 = sap.ui.getCore().byId(this.createId("custsubsvbox_id5"));
			
			var oFilter = new sap.ui.model.Filter("CustomerId", sap.ui.model.FilterOperator.EQ, window.localStorage.getItem("customerId"));
			var comFil = new sap.ui.model.Filter({
				filters: [oFilter]
			});
			oVBox1.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
			oVBox2.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
			oVBox3.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
			oVBox4.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
			oVBox5.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf BikeRentalApp.view.customersubscription
		 */
		//	onExit: function() {
		//
		//	}
		
		toolbarnav: function(oEvent) {
			var route = oEvent.getSource().data("route");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo(route);
		}

	});

});