sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("BikeRentalApp.controller.myrides", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf BikeRentalApp.view.myrides
		 */
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel("data/mockLocations.json");
			this.getView().setModel(oModel);
		},

		updatePosition: function(position) {
			var oModel = this.getView().getModel();
			oModel.setProperty("/current/lat", position.coords.latitude);
			oModel.setProperty("/current/lng", position.coords.longitude);
			oModel.setProperty("/current/info", "Current");
			console.log(oModel);
		},

		watchPostion: function() {
			if (navigator.geolocation) {
				console.log(this);
				var watchID = navigator.geolocation.watchPosition(this.updatePosition.bind(this));
				console.log(watchID);
			} else {
				console.log("Error: This version of application does not support geolocation");
			}
		},

		onPlayBtnPress: function() {
			console.log("Riding....");
		},
		
		onPauseBtnPress: function() {
			console.log("Pausing....");
		},
		
		onStopBtnPress: function() {
			console.log("Stoping....");
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf BikeRentalApp.view.myrides
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf BikeRentalApp.view.myrides
		 */
		onAfterRendering: function() {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf BikeRentalApp.view.myrides
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