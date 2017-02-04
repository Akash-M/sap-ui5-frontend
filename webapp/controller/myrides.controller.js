sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("BikeRentalApp.controller.myrides", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf BikeRentalApp.view.myrides
		 */
		onInit: function() {
			//var oModel = new sap.ui.model.json.JSONModel("data/mockLocations.json");
			//this.getView().setModel(oModel);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("myrides").attachPatternMatched(this._onObjectMatched, this);
			window.bikingState = undefined;
			window.startTime = undefined;
			window.stopTime = undefined;
			window.resumeTime = undefined;
		},

		_onObjectMatched: function(oEvent) {
			window.rentedBikeId = oEvent.getParameter("arguments").rentedBikeId.substr(1);
			console.log(window.rentedBikeId);

		},

		updatePosition: function(position) {
			var oModel = sap.ui.getCore().getModel("currentLocModel");
			oModel.setProperty("/currentLocation/0/lat", position.coords.latitude);
			oModel.setProperty("/currentLocation/0/lng", position.coords.longitude);
			var newLocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			}
			oModel.getProperty("/previousLocations").push(newLocation);
			console.log(oModel);
		},

		watchPostion: function() {
			if (navigator.geolocation) {
				return navigator.geolocation.watchPosition(this.updatePosition.bind(this));
			} else {
				var dialog = new sap.m.Dialog({
					title: 'Error',
					type: 'Message',
					state: 'Error',
					content: new sap.m.Text({
						text: 'The geolocation on your device is either disabled or not supported.'
					}),
					beginButton: new sap.m.Button({
						text: 'Ok',
						press: function() {
							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
					}
				});
				this.getView().addDependent(dialog);
				dialog.open();
				return undefined;
			}
		},

		onPlayBtnPress: function(oEvent) {
			var stopbtn = sap.ui.getCore().byId(this.createId("stopbtn"));
			var pausebtn = sap.ui.getCore().byId(this.createId("pausebtn"));
			var playbtn = sap.ui.getCore().byId(this.createId("playBtn"));
			if (window.bikingState === undefined) {
				var dialog = new sap.m.Dialog({
					title: 'Confirm Message',
					type: 'Message',
					content: [new sap.m.Text({
						text: 'It is recommended to set the accuracy of the GPS to high.  Once you click ok the timer will start.',
						wrapping: true,
						maxLines: 8
					}), new sap.m.Text({
						text: 'Your ride details and location will be tracked and stored. Are you sure you want to continue ?',
						wrapping: true,
						maxLines: 8
					})],
					beginButton: new sap.m.Button({
						text: 'Ok',
						press: function() {
							playbtn.setEnabled(false);
							stopbtn.setEnabled(true);
							pausebtn.setEnabled(true);
							window.startTime = new Date().toISOString();
							window.bikingState = "Riding";
							dialog.close();
						}
					}),
					endButton: new sap.m.Button({
						text: 'Close',
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
			} else if (window.bikingState === "Paused") {
				playbtn.setEnabled(false);
				stopbtn.setEnabled(true);
				pausebtn.setEnabled(true);
				window.resumeTime = new Date().toISOString();
				window.bikingState = "Riding";
			}

		},

		onPauseBtnPress: function() {
			var stopbtn = sap.ui.getCore().byId(this.createId("stopbtn"));
			var pausebtn = sap.ui.getCore().byId(this.createId("pausebtn"));
			var playbtn = sap.ui.getCore().byId(this.createId("playBtn"));
			playbtn.setEnabled(true);
			stopbtn.setEnabled(false);
			pausebtn.setEnabled(false);
			window.pauseTime = new Date().toISOString();
			window.bikingState = "Paused";
		},

		onStopBtnPress: function() {
			window.stopTime = new Date().toISOString();
			var oSelectItemTemplate = new sap.ui.core.Item({
				text: '{Name}',
				key: '{BikeStationId}'
			})
			var oSelectStation = new sap.m.Select("stationSelect", {
				items: {
					path: "/BikeStationSet",
					template: oSelectItemTemplate
				} //,
				//selectedKey: '{/BikeStationSet/0/BikeStationId}',
				//selectedId: '{/BikeStationSet/0/BikeStationId}'
			});
			oSelectStation.attachChange(function(oEvent) {
				window.selectedStation = oSelectStation.getSelectedKey();
			})
			var oModel = this.getView().getModel();
			var oContext = new sap.ui.model.Context(oModel);
			oSelectStation.setBindingContext(oContext);
			//var bikecount = oEvent.getSource().data("bikecount");
			var that = this;
			var oModel = this.getView().getModel();
			var dialog = new sap.m.Dialog("confirmRent", {
				title: 'Select Drop Station',
				type: 'Message',
				content: [oSelectStation],
				beginButton: new sap.m.Button({
					text: 'OK',
					press: function() {
						dialog.close();
						var oFreeBike = {
							"d": {
								"BikeId": window.rentedBikeId,
								"BikeStationId": window.selectedStation
							}
						};
						oModel.create('/FreeBikesSet', oFreeBike, {
							success: function(oData, oResponse) {
								sap.m.MessageToast.show("Bike Freed Successfully!");
								//var gmap = sap.ui.getCore().byId(this.createId("map1"));
								//var btnContainer = sap.ui.getCore().byId(this.createId("btnsFlexContainer"));
								//btnContainer.destroy();
								//gmap.destroy();
								window.bikingState = "Stop";
							},
							error: function(oError) {
								//var err_response = JSON.parse(oError.responseText);
								//var err_message = err_response.error.message.value;
								sap.m.MessageToast.show("There seems to be a problem please try again");
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

		/*getLocationCallback: function(oPos, oMap) {
			window.currentPostion = oPos;
			return oPos;
			oMap.setLng(oPos.Lng);
			oMap.setLat(o)
		},*/

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf BikeRentalApp.view.myrides
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf BikeRentalApp.view.myrides
		 */
		onAfterRendering: function() {
			if (window.rentedBikeId !== undefined) {
				jQuery.sap.require('openui5.googlemaps.MapUtils');
				var util = openui5.googlemaps.MapUtils;
				var myridevbox = sap.ui.getCore().byId(this.createId("myRidesVBox"));
				var oCurrentLocationModel = new sap.ui.model.json.JSONModel();
				var oCurrentLocationContext = new sap.ui.model.Context(oCurrentLocationModel, "/currentLocation");

				var getLocationCallback = function(oPos) {

					var currentLocation = {
						currentLocation: {
							info: "Current Location",
							lat: oPos.lat,
							lng: oPos.lng
						},
						startPoint: {
							lat: (oPos.lat-0.002),
							lng: (oPos.lng)
						},
						previousLocations: [{
								lat: (oPos.lat-0.002),
								lng: (oPos.lng)
							}, {
								lat: (oPos.lat-0.001),
								lng: (oPos.lng)
							}
						]
					};

					oCurrentLocationModel.setData(currentLocation);
					sap.ui.getCore().setModel(oCurrentLocationModel, "currentLocModel");
					
					var oPolylines = new openui5.googlemaps.Polyline({
						path: "{/previousLocations}",
						//strokeColor: "black"
					});

					var oMarkers = new openui5.googlemaps.Marker({
						info: '{info}',
						lat: '{lat}',
						lng: '{lng}',
						icon: "resources/img/point-16.png"
					});
					
					var startMarker = new openui5.googlemaps.Marker({
						lat: '{/startPoint/lat}',
						lng: '{/startPoint/lng}',
						icon: "resources/img/map-marker-icon.png"
					});
					
					var currentMarker = new openui5.googlemaps.Marker({
						lat: '{/currentLocation/lat}',
						lng: '{/currentLocation/lng}',
						icon: "resources/img/point-16.png"
					});

					/*var aData = oModel.getProperty("/ZWS16T1BIKESTNSet");
					console.log(aData);
					aData.push.apply(aData, currentLocation);
					oModel.setProperty("/stations", aData);*/
					//console.log(oModel)

					var oMap = new openui5.googlemaps.Map("myRidesMap", {
						lat: oPos.lat,
						lng: oPos.lng,
						zoom: 15,
						markers: [currentMarker, startMarker],
						polylines: [oPolylines]
					});

					oMap.setModel(oCurrentLocationModel);
					oMap.setBindingContext(oCurrentLocationContext, "currentLocModel");
					//console.log(oMap);
					myridevbox.addItem(oMap);

					return util.objToLatLng(oPos);

				};

				var updateLocation = function(sLocation) {
					/*var aData = oModel.getProperty("/stations");
					oModel.setProperty("/stations/"+aData.length+"/info", sLocation);
					console.log(oModel);*/
				};

				util.currentPosition()
					.then(getLocationCallback)
					.then(util.geocodePosition)
					.done(updateLocation);

				setInterval(this.watchPostion(), 1)

			}

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf BikeRentalApp.view.myrides
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