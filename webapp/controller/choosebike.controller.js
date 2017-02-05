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
		},

		_onObjectMatched: function(oEvent) {

			var oModel = this.getView().getModel();

			if (oEvent.getParameter("arguments") !== undefined) {
				var stationPath = oEvent.getParameter("arguments").stationPath;
				var oMessageStrip = sap.ui.getCore().byId(this.createId("stationStrip"));
				oModel.stationDetails = oModel.getProperty("/" + stationPath);
				oMessageStrip.setText(oModel.getProperty("/" + stationPath).Name);
			}

			var oFilter1 = new sap.ui.model.Filter("BikeStationId", sap.ui.model.FilterOperator.EQ, oModel.stationDetails.BikeStationId);
			var oList = sap.ui.getCore().byId(this.createId("bikelist"));
			
			var comFil;
			
			if (this.getView().byId("biketypeFilterid").getSelectedItem() === null || 
				this.getView().byId("biketypeFilterid").getSelectedItem().getText() === 'Choose bike type') {
				comFil = new sap.ui.model.Filter([oFilter1]);
				oList.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
			} else {
				var bikename = this.getView().byId("biketypeFilterid").getSelectedItem().getText();
				var oFilter2 = new sap.ui.model.Filter("BikeName", sap.ui.model.FilterOperator.EQ, bikename);
				comFil = new sap.ui.model.Filter({filters: [oFilter1, oFilter2],and: true});
				oList.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
			}

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
			var sPath = oEvent.getSource().getBindingContext().getPath();
			var oModel = this.getView().getModel();
			var oModelData = oModel.getProperty(sPath);
			var oRentBike = {
				"d": {
					"BikeId": oModelData.BikeId,
					"CustomerId": window.localStorage.getItem('customerId')
				}
			};
			//var bikecount = oEvent.getSource().data("bikecount");
			var that = this;
			var dialog = new sap.m.Dialog("confirmRent", {
				title: 'Confirm your booking for bike '+ oModelData.BikeId,
				type: 'Message',
				content: [new sap.m.Text({
					text: 'You will be redirected to manage your ride on confirmation.',
					wrapping: true,
					maxLines: 8
				})],
				buttons: [new sap.m.Button({
					text: 'OK',
					type:'Accept',
					press: function() {
						dialog.close();
						oModel.create('/RentBikeSet', oRentBike, {
							success: function(oData, oResponse) {
								sap.m.MessageToast.show("Bike Rented Successfully!");
								var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
								oRouter.navTo("myrides", {
									rentedBikeId: oModelData.BikeId
								});
							},
							error: function(oError) {
								var err_response = JSON.parse(oError.responseText);
								var err_message = err_response.error.message.value;
								sap.m.MessageToast.show("You have already rented a bike. Please release the bike before booking another one.");
								sap.m.MessageToast.show(err_message);
							}
						});
					}
				}),new sap.m.Button({
					text: 'Report Issue',
					type: 'Transparent',
					press: function() {
						dialog.close();
						window.localStorage.setItem('problemBikeId', oModelData.BikeId);
						var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
						oRouter.navTo("reportissues");
					}
				}), new sap.m.Button({
					text: 'Close',
					type:'Reject',
					press: function() {
						dialog.close();
					}
				})],
				afterClose: function() {
					dialog.destroy();
				}
			});
			var vBox = new sap.m.VBox({
				items: [dialog]
			});
			this.getView().addDependent(vBox);
			dialog.open();
			/*var dialog = new sap.m.Dialog("confirmRent", {
				title: 'Confirm your booking',
				type: 'Message',
				content: [new sap.m.Text({
					text: 'You will be redirected to manage your ride on confirmation.',
					wrapping: true,
					maxLines: 8
				})],
				beginButton: new sap.m.Button({
					text: 'OK',
					press: function() {
						dialog.close();
						oModel.create('/RentBikeSet', oRentBike, {
							success: function(oData, oResponse) {
								sap.m.MessageToast.show("Bike Rented Successfully!");
								var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
								oRouter.navTo("myrides", {
									rentedBikeId: oModelData.BikeId
								});
							},
							error: function(oError) {
								//var err_response = JSON.parse(oError.responseText);
								//var err_message = err_response.error.message.value;
								sap.m.MessageToast.show("You have already rented a bike. Please release the bike before booking another one.");
							}
						});

					}
				}),
				endButton: new sap.m.Button({
					text: 'Close',
					press: function() {
						dialog.close();
					}
				}), 
				buttons: [new sap.m.Button({
					text: 'Report Issue',
					press: function() {
						dialog.close();
					}
				})],
				afterClose: function() {
					dialog.destroy();
				}
			});
			var vBox = new sap.m.VBox({
				items: [dialog]
			});
			this.getView().addDependent(vBox);
			dialog.open();*/

		},

		toolbarnav: function(oEvent) {
			var route = oEvent.getSource().data("route");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo(route);
		},
		
		reportProblem: function(){
			
		}

	});

});