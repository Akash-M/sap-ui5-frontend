sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("BikeRentalApp.controller.registration", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf BikeRentalApp.view.registration
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf BikeRentalApp.view.registration
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf BikeRentalApp.view.registration
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf BikeRentalApp.view.registration
		 */
		//	onExit: function() {
		//
		//	}
		onNavBack: function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("login");
		},
		
		register: function(oEvent) {
			var oModel = this.getView().getModel();
			
			var fname = sap.ui.getCore().byId(this.createId("firstname_id")).getValue();
			var lname = sap.ui.getCore().byId(this.createId("lastname_id")).getValue();
			var email = sap.ui.getCore().byId(this.createId("email_id")).getValue();
			var password = sap.ui.getCore().byId(this.createId("password_id")).getValue();
			var mobile = sap.ui.getCore().byId(this.createId("mobileno_id")).getValue();
			//var bdate = sap.ui.getCore().byId(this.createId("bdate_id")).getValue();
			
			var bdate = sap.ui.getCore().byId(this.createId("birthdate_id")).getDateValue();
			console.log(dateformat);
			
			var oRegister = {
				"d": {
					"FirstName" : fname,
					"LastName" : lname,
					"Bdate" : bdate,
					"MobilePhoneNumber" : mobile,
					"Email" : email,
					
				}
			}
			
			
			
			/*var oRegister = {
				"d": {
					"BikeId": oModelData.BikeId,
					"CustomerId": "CUST00003"
				}
			};*/
			/*oModel.create('/RentBikeSet', oRentBike, {
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
			});*/
		}

	});

});