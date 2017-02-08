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
								console.log(oData);
								var csrfToken = that.getView().getModel().oHeaders;
								csrfToken["UToken"] = oData.UToken;
								window.localStorage.setItem('customerId', oData.CustomerId);
								window.localStorage.setItem('UToken', oData.UToken);
								var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
								oRouter.navTo("dashboard");
								sap.m.MessageToast.show("Login succesfully");
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

		connect: function(oEvent) {
			jQuery.sap.require("sap.ui.core.ws.WebSocket");
			jQuery.sap.require("sap.ui.core.ws.SapPcpWebSocket");

			var wsUrl = 'wss://i67lp1.informatik.tu-muenchen.de:8443/sap/bc/apc/sap/zws16_t1_rental_bike_push_c_i';
			//var webSocket = new sap.ui.core.ws.SapPcpWebSocket(wsUrl, sap.ui.core.ws.SapPcpWebSocket.SUPPORTED_PROTOCOLS.v10);
			var webSocket = new WebSocket(wsUrl);

			//var wsUrl = 'ws://i67lp1.informatik.tu-muenchen.de:8000/sap/bc/apc/sap/zws16_t1_rental_bike_push_c_i';
			//var webSocket = new sap.ui.core.ws.SapPcpWebSocket(wsUrl, sap.ui.core.ws.SapPcpWebSocket.SUPPORTED_PROTOCOLS.v10);
			webSocket.onerror = function(event) {
				console.log("WS Error");
				console.log(event);
			};
			webSocket.open = function(event) {
				console.log("WS Open");
				console.log(event);

			};
			webSocket.message = function(event) {
				console.log("WS Message");
				console.log(event);
			};

			var data = {
				"CustomerId": window.localStorage.getItem("CustomerId")
			};

			webSocket.send(data);

			webSocket.message = function(event) {
				console.log("WS Message");
				console.log(event);
			};

			webSocket.close();

		},

		nav: function(oEvent) {
			var route = oEvent.getSource().data("route");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo(route);
		}
	});
});