sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("BikeRentalApp.controller.choosebike", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf BikeRentalApp.view.choosebike
		 */
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("choosebike").attachPatternMatched(this._onObjectMatched, this);
			//var oModel = new sap.ui.model.json.JSONModel("data/biketypes.json");
			//this.getView().setModel(oModel);

		},

		_onObjectMatched: function(oEvent) {
			this.getView().bindElement({
				path: "/" + oEvent.getParameter("arguments").stationPath,
				model: "BikeTypes"
			});
		},

		_handleRouteMatched: function(oEvent) {
			//var view = this.getView();
			//console.log(oEvent.getParameters("arguments"));
			//view.setBindingContext(evt.getParameter("ctx"));

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf BikeRentalApp.view.choosebike
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf BikeRentalApp.view.choosebike
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf BikeRentalApp.view.choosebike
		 */
		//	onExit: function() {
		//
		//	}
		tilepress: function(oEvent) {

			var bikecount = oEvent.getSource().data("bikecount");
			var that = this;

			if (bikecount > 0) {
				var dialog = new sap.m.Dialog({
					title: 'Confirm your booking',
					type: 'Message',
					content: [new sap.m.Text({
						text: 'You will be redirected to manage your ride on confirmation.',
						wrapping: true,
						maxLines: 8
					})],
					beginButton: new sap.m.Button({
						text: 'Ok',
						press: function() {
							dialog.close();
							var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter.navTo("myrides");
						}
					}),
					endButton: new sap.m.Button({
						text: 'Close',
						press: function() {
							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
					}
				});
				var vBox = new sap.m.VBox({
					items: [dialog]
				});
				this.getView().addDependent(vBox);
				dialog.open();
			} else {
				var dialog = new sap.m.Dialog({
					title: 'Booking failure',
					type: 'Message',
					content: [new sap.m.Text({
						text: 'We are sorry, but no bikes of this type available currently. Please choose another bike.',
						wrapping: true,
						maxLines: 8
					})],
					beginButton: new sap.m.Button({
						text: 'Ok',
						press: function() {
							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
					}
				});
				var vBox = new sap.m.VBox({
					items: [dialog]
				});
				this.getView().addDependent(vBox);
				dialog.open();
			}
		},

		toolbarnav: function(oEvent) {
			var route = oEvent.getSource().data("route");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo(route);
		}

	});

});