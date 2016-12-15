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
			var oLoginBtn = new sap.m.Button("Login", {
				text: "Login",
				press: function() {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("dashboard");
				}
			});
			var oCancelBtn = new sap.m.Button("Cancel", {
				text: "Cancel",
				press: function(){
					sap.ui.getCore().byId("LoginDialog").close();
				}
			});

			var oDialog = new sap.m.Dialog("LoginDialog", {
				title: "Login",
				modal: true,
				contentWidth: "1em",
				buttons: [oLoginBtn, oCancelBtn],
				content: [
					new sap.m.Input({
						placeholder: "Username",
						id: "username"
					}),
					new sap.m.Input({
						placeholder: "Password",
						id: "password"
					})
				]
			});
			sap.ui.getCore().byId("LoginDialog").open();   
		},

		nav: function(oEvent) {
			var route = oEvent.getSource().data("route");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo(route);
		}
	});
});