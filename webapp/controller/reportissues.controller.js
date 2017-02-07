sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("BikeRentalApp.controller.reportissues", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf BikeRentalApp.view.reportissues
		 */
		onInit: function() {
			if (window.localStorage.getItem('problemBikeId') !== null) {
				var bikeId = window.localStorage.getItem('problemBikeId');
				var oMessageStrip = sap.ui.getCore().byId(this.createId("reportissuesmessagestrip_id"));
				oMessageStrip.setText("Bike ID : " + bikeId);
			} else {
				//redirect to choose bike controller
				//window.localStorage.setItem('problemBikeId', "sample data");
			}
		},

		onNavBack: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("searchbike");
		},

		submitIssue: function() {

			var issueId = this.getView().byId(this.createId("issuesList")).getSelectedKey();
			var probDesc = this.getView().byId(this.createId("reportissuestextarea_id")).getValue();

			var oProblemBike = {
				"d": {
					"BikeId": window.localStorage.getItem('problemBikeId'),
					"PartId": issueId,
					"ProblemDesc": probDesc
				}
			};

			var oModel = this.getView().getModel();

			oModel.create('/ReportBikeSet', oProblemBike, {
				success: function(oData, oResponse) {
					sap.m.MessageToast.show("Problem reported. We apologize for the inconvenience.");
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("searchbike");
				},
				error: function(oError) {
					sap.m.MessageToast.show("Unable to submit issue report. Please try again later..");
				}
			});
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf BikeRentalApp.view.reportissues
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf BikeRentalApp.view.reportissues
		 */
		onAfterRendering: function() {
			var csrfToken = this.getView().getModel().oHeaders;
			csrfToken["UToken"] = window.localStorage.getItem('UToken');
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf BikeRentalApp.view.reportissues
		 */
		//	onExit: function() {
		//
		//	}

	});

});