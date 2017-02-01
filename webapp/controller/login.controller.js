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
			var dialog = new sap.m.Dialog('logindialog_id', {
				title: 'Login',
				type: 'Message',
				content: [new sap.m.Input({
					placeholder: 'Username'
				}), new sap.m.Input({
					placeholder: 'Password',
					type: 'Password'
				})],
				beginButton: new sap.m.Button({
					text: 'Login',
					press: function() {
						var dialog = sap.ui.getCore().byId("logindialog_id");
						dialog = dialog.getContent();
						var username = dialog[0].getValue();
						var password = dialog[1].getValue();
						password = btoa(password);
						var oModel = that.getView().getModel();
						var oLogin = {
							"d": {
								"CustomerId": username,
								"Password": password
							}
						};
						oModel.create('/customerLoginSet', oLogin, {
							success: function(oData, oResponse) {
								sap.m.MessageToast.show("Login succesfully");
								var csrfToken = that.getView().getModel().oHeaders;
								csrfToken["UToken"]=oData.UToken;
								var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
								oRouter.navTo("dashboard");
							},
							error: function(oError) {
								var err_response = JSON.parse(oError.responseText);
								sap.m.MessageToast.show("Invalid login credentials");
							}
						});
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