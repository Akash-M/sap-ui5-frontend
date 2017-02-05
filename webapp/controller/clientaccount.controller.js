sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("BikeRentalApp.controller.clientaccount", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf BikeRentalApp.view.clientaccount
		 */
		onInit: function() {
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf BikeRentalApp.view.clientaccount
		 */
		onBeforeRendering: function() {
			var oModel = this.getView().getModel();
			var oVBox1 = sap.ui.getCore().byId(this.createId("customerprofilevbox_id1"));
			var oVBox2 = sap.ui.getCore().byId(this.createId("customerprofilevbox_id2"));
			var oVBox3 = sap.ui.getCore().byId(this.createId("customerprofilevbox_id3"));
			//var oVBox4 = sap.ui.getCore().byId(this.createId("customerprofilevbox_id4"));
			var oVBox5 = sap.ui.getCore().byId(this.createId("customerprofilevbox_id5"));
			var oVBox6 = sap.ui.getCore().byId(this.createId("customerprofilevbox_id6"));
			var oVBox7 = sap.ui.getCore().byId(this.createId("customerprofilevbox_id7"));
			var oVBox8 = sap.ui.getCore().byId(this.createId("customerprofilevbox_id8"));
			var oVBox9 = sap.ui.getCore().byId(this.createId("customerprofilevbox_id9"));
			
			var oFilter = new sap.ui.model.Filter("CustomerId", sap.ui.model.FilterOperator.EQ, window.localStorage.getItem("customerId"));
			var comFil = new sap.ui.model.Filter({
				filters: [oFilter]
			});
			oVBox1.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
			oVBox2.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
			oVBox3.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
			//oVBox4.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
			oVBox5.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
			oVBox6.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
			oVBox7.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
			oVBox8.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
			oVBox9.getBinding("items").filter(comFil, sap.ui.model.FilterType.Application);
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf BikeRentalApp.view.clientaccount
		 */
		onAfterRendering: function() {

		},

		save: function() {
			var fname = sap.ui.getCore().byId(this.createId("customerprofilevbox_id1")).getItems();
			var lname = sap.ui.getCore().byId(this.createId("customerprofilevbox_id3")).getItems();
			var mobile = sap.ui.getCore().byId(this.createId("customerprofilevbox_id5")).getItems();
			var email = sap.ui.getCore().byId(this.createId("customerprofilevbox_id6")).getItems();
			var cardno = sap.ui.getCore().byId(this.createId("customerprofilevbox_id7")).getItems();
			
			var oProfile = {
				"d":{
					"FirstName":fname[0].getValue(),
					"LastName":lname[0].getValue(),
					"MobilePhoneNumber":mobile[0].getValue(),
					"Email":email[0].getValue(),
					"CardNo":cardno[0].getValue()
				}
			};
			
			var custId = window.localStorage.getItem("customerId");
			var path = "/CustomerSet('"+custId+"')";
			
			var oModel = this.getView().getModel();
			
			oModel.update(path, oProfile, {
				success: function(oData, oResponse) {
					sap.m.MessageToast.show("Updates Successfully");
				},
				error: function(oError) {
					var err_response = JSON.parse(oError.responseText);
					var err_message = err_response.error.message.value;
					sap.m.MessageToast.show(err_response);
				}
			});
			
			
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf BikeRentalApp.view.clientaccount
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