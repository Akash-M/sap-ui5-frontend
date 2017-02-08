sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("BikeRentalApp.controller.dashboard", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf BikeRentalApp.view.Dashboard
		 */
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel("data/tiles.json");
			this.getView().setModel(oModel);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf BikeRentalApp.view.Dashboard
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf BikeRentalApp.view.Dashboard
		 */
		onAfterRendering: function() {
			//var csrfToken = this.getView().getModel().oHeaders;
			//csrfToken["UToken"] = window.localStorage.getItem('UToken');
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf BikeRentalApp.view.Dashboard
		 */
		//	onExit: function() {
		//
		//	}
		tilepress: function(oEvent) {
			var route = oEvent.getSource().getBindingContext().getProperty("id");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo(route);
		},

		toolbarnav: function(oEvent) {
			var route = oEvent.getSource().data("route");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo(route);
		},

		handlepopoverpress: function(oEvent) {
			if (this._oPopover) {
				this._oPopover.destroy();
			}

			// create popover
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("BikeRentalApp.view.useraccount", this);
				this.getView().addDependent(this._oPopover);
			}

			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function() {
				this._oPopover.openBy(oButton);
			});
		}

	});

});