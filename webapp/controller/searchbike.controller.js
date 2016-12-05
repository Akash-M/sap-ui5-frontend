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
		//	onInit: function() {
		//
		//	},

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

			var getLocationCallback = function(oPos) {

				var oMarkers = new openui5.googlemaps.Marker({
					lat: oPos.lat,
					lng: oPos.lng,
					info: "Klinikum GrossHardern"
				});

				console.log(oMarkers);

				var oMap = new openui5.googlemaps.Map("map1", {
					lat: oPos.lat,
					lng: oPos.lng,
					zoom: 15,
					markers: [oMarkers]
				});

				console.log(oMap);

				var oVBox = new sap.m.VBox("oVBox", {
					items: [oMap]
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