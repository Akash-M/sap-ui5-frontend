sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("BikeRentalApp.controller.login", {
		init: function() {
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
		},

		login: function(oEvent) {
			var that = this;
			var dialog = new sap.m.Dialog({
					title: 'Login',
					type: 'Message',
					content: [new sap.m.Input({
						placeholder: 'Username'
					}), new sap.m.Input({
						placeholder: 'Password',
						type:'Password'
					})],
					beginButton: new sap.m.Button({
						text: 'Login',
						press: function() {
							var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter.navTo("dashboard");
						}
					}),
					endButton: new sap.m.Button({
						text: 'Cancel',
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
			
		},

		nav: function(oEvent) {
			var route = oEvent.getSource().data("route");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo(route);
		}
	});
});