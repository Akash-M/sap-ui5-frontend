sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("BikeRentalApp.controller.searchbike", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf BikeRentalApp.view.searchbike
		 */
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel("data/stations.json");
			this.getView().setModel(oModel);
		},

		onBack: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("dashboard");
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf BikeRentalApp.view.searchbike
		 */
		//	onBeforeRendering: function() {
		//
		//	},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf BikeRentalApp.view.searchbike
		 */
		onAfterRendering: function() {
			jQuery.sap.require('openui5.googlemaps.MapUtils');
			var util = openui5.googlemaps.MapUtils;

			var id = this.createId("mapVbox");
			var mapId = this.createId("map");

			var oModel = this.getView().getModel();

			var oParentRouter = sap.ui.core.UIComponent.getRouterFor(this);

			var onMarkerClick = function(oEvent) {
				var oContext = oEvent.getSource().getBindingContext();
				var modelProperty = oContext.getModel().getProperty(oContext.sPath);
				if (modelProperty.info !== "Current Location") {
					this.infoWindowClose();
					oParentRouter.navTo("choosebike", oContext);
				}
				else {
					this.removeListeners();
				}
			}

			var getLocationCallback = function(oPos) {

				var currentLocation = [{
					info: "Current Location",
					lat: oPos.lat,
					lng: oPos.lng
				}];

				var aData = oModel.getProperty("/stations");
				aData.push.apply(aData, currentLocation);
				oModel.setProperty("/stations", aData);

				var oMarkers = new openui5.googlemaps.Marker({
					lat: '{lat}',
					lng: '{lng}',
					info: '{info}',
					icon: "{icon}",
					click: onMarkerClick
				});

				var oMap = new openui5.googlemaps.Map(mapId, {
					lat: oPos.lat,
					lng: oPos.lng,
					height: ($(document).height())*0.9 + "px",
					zoom: 14,
					markers: {
						path: "/stations",
						template: oMarkers
					}
				});

				var vBox = sap.ui.getCore().byId(id);
				vBox.addItem(oMap);

				return util.objToLatLng(oPos);

			};

			var updateLocation = function(sLocation) {
				console.log(sLocation);
			};

			util.currentPosition()
				.then(getLocationCallback)
				.then(util.geocodePosition)
				.done(updateLocation);

		},
		
		toolbarnav: function(oEvent){
			var route = oEvent.getSource().data("route");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo(route);
		}

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf BikeRentalApp.view.searchbike
		 */
		//	onExit: function() {
		//
		//	}

	});

});