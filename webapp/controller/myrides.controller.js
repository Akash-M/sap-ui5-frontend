sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("BikeRentalApp.controller.myrides", {

		 
		oWebSocket: null,
	  	
		   getWebsocket : function(myFunc){
			var BikeId = window.localStorage.getItem('rentedBikeId');
			var CustId = window.localStorage.getItem('customerId');
			var webSocket = this.oWebSocket;
		//	var wsUrl = 'wss://i67lp1.informatik.tu-muenchen.de:8443/sap/bc/apc/sap/zws16_t1_rental_bike_push_c_i?CUSTOMER_ID=' + CustId +
		//		'&BIKE_ID=' + BikeId;
		var wsUrl = '/sap/bc/apc/sap/zws16_t1_rental_bike_push_c_i?CUSTOMER_ID=' + CustId +
				'&BIKE_ID=' + BikeId;
			if (webSocket === null) {
				jQuery.sap.require("sap.ui.core.ws.WebSocket"); 
				//webSocket = new WebSocket(wsUrl);
				webSocket = new sap.ui.core.ws.WebSocket(wsUrl);
				this.oWebSocket = webSocket;
				webSocket.attachOpen(function(e){
				console.log("Socket is opened");
					myFunc(webSocket);	
				});
			}else {
				console.log("Socket is allready open");
				myFunc(webSocket);
			}	
		
		},
		
		//oWebSocket: null,
		oWatchId: null,

/*		getOrCreateWebSocketObject: function() {
			console.log("getOrCreateWebSocketObject called! ");
			jQuery.sap.require("sap.ui.core.ws.WebSocket");
			var BikeId = window.localStorage.getItem('rentedBikeId');
			var CustId = window.localStorage.getItem('customerId');
			var wsUrl = 'wss://i67lp1.informatik.tu-muenchen.de:8443/sap/bc/apc/sap/zws16_t1_rental_bike_push_c_i?CUSTOMER_ID=' + CustId +
				'&BIKE_ID=' + BikeId;

			var webSocket = new WebSocket(wsUrl);
			webSocket.onerror = function(event) {
				console.log("WS Error");
				console.log(event);
			};
			webSocket.onopen = function(event) {
				console.log("WS Open");
				console.log(event);
				this.oWebSocket = webSocket;
			};
			webSocket.onmessage = function(event) {
				console.log("WS Message");
				console.log(event);
			};
			this.oWebSocket = webSocket;
			return webSocket;
		},*/

		//Creates model or If Model exist Updates and returns model
		getOrElseCreateLocModel: function(oPos) {
			console.log("getOrElseCreateLocModel Called");
			if (sap.ui.getCore().getModel("currentLocModel") !== undefined) {
				var positions = {
					coords: {
						latitude: oPos.lat,
						longitude: oPos.lng
					}
				};
				this.updatePosition(positions);
				return sap.ui.getCore().getModel("currentLocModel");
			} else {
				var currentLocation = {
					currentLocation: {
						info: "Current Location",
						lat: oPos.lat,
						lng: oPos.lng
					},
					startPoint: {
						lat: (oPos.lat - 0.002),
						lng: (oPos.lng)
					},
					previousLocations: [{
						lat: (oPos.lat - 0.002),
						lng: (oPos.lng)
					}, {
						lat: (oPos.lat - 0.001),
						lng: (oPos.lng)
					}]
				};
				//Create Model to Store Locations Data
				var oCurrentLocationModel = new sap.ui.model.json.JSONModel();
				var oCurrentLocationContext = new sap.ui.model.Context(oCurrentLocationModel, "/currentLocation");

				oCurrentLocationModel.setData(currentLocation);
				sap.ui.getCore().setModel(oCurrentLocationModel, "currentLocModel");
				return sap.ui.getCore().getModel("currentLocModel");
			}
		},
		
	
		

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf BikeRentalApp.view.myrides
		 */
		onInit: function() {
			console.log("Init Called");
			jQuery.sap.require('openui5.googlemaps.MapUtils');
			var util = openui5.googlemaps.MapUtils;

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("myrides").attachPatternMatched(this._onObjectMatched, this);

			window.bikingState = undefined;
			window.startTime = undefined;
			window.stopTime = undefined;
			window.resumeTime = undefined;
			window.pauseCounter = undefined;
			window.selectedStation = undefined;

			//Get Container
			var myridevbox = sap.ui.getCore().byId(this.createId("myRidesVBox"));
			var myridehistory = sap.ui.getCore().byId(this.createId("myRidesHistory"));

			//Update Function set May be the text of The Current Postion
			var updateLocation = function(sLocation) {};

			var that = this;

			util.currentPosition()
				.then(this.geoLocationCallBack.bind(this))
				.then(util.geocodePosition)
				.done(updateLocation);

			var oObjectHeader = new sap.m.ObjectHeader({
				title: "My Past Rides"
			});

			var oPrevRidesList = this.getOrElseCreatePrevRidesList();

			if (myridehistory.indexOfItem(oObjectHeader) === -1) {
				myridehistory.addItem(oObjectHeader);
			}

			if (myridehistory.indexOfItem(oPrevRidesList) === -1) {
				myridehistory.addItem(oPrevRidesList);
			}

			if (window.localStorage.getItem('rentedBikeId')) {
				myridevbox.setVisible(true);
			} else {
				myridevbox.setVisible(false);
			}

		},

		_onObjectMatched: function(oEvent) {
			console.log("on Pattern Match Called");
			window.rentedBikeId = oEvent.getParameter("arguments").rentedBikeId.substr(1);
			var myridevbox = sap.ui.getCore().byId(this.createId("myRidesVBox"));
			var reportIssues = sap.ui.getCore().byId(this.createId("reportIssuesBox"));
			var oWatchId = this.oWatchId;
			if (window.rentedBikeId !== undefined) {
				if (window.rentedBikeId.length < 1) {
					window.rentedBikeId = undefined;
					window.localStorage.setItem('problemBikeId', "00001");
					window.localStorage.setItem('rentedBikeId', window.rentedBikeId);
					myridevbox.setVisible(false);
					reportIssues.setVisible(false);
				} else {
					window.localStorage.setItem('problemBikeId', window.rentedBikeId);

					//Disable Play Button
					var playbtn = sap.ui.getCore().byId(this.createId("playBtn"));
					playbtn.setEnabled(false);

					//Enable Pause Button
					var pausebtn = sap.ui.getCore().byId(this.createId("pausebtn"));
					pausebtn.setEnabled(true);

					//Enable Stop Button
					var stopbtn = sap.ui.getCore().byId(this.createId("stopbtn"));
					stopbtn.setEnabled(true);

					myridevbox.setVisible(true);
					reportIssues.setVisible(true);
					this.oWatchId = this.watchPostion();
					//this.getOrCreateWebSocketObject();
				}
			}
		},

		setBtnsContainerVisibility: function(oVisibility) {
			var btnsFlexContainer = sap.ui.getCore().byId(this.createId("btnsFlexContainer"));
			btnsFlexContainer.setVisible(oVisibility);
		},

		geoLocationCallBack: function(oPos) {
			console.log("geoLocationCallBack Called")
			jQuery.sap.require('openui5.googlemaps.MapUtils');
			var util = openui5.googlemaps.MapUtils;

			var oCurrentLocationModel = this.getOrElseCreateLocModel(oPos);

			var oMap = this.getOrElseCreateMap(oPos);
			var myridevbox = sap.ui.getCore().byId(this.createId("myRidesVBox"));

			oMap.setModel(oCurrentLocationModel);
			myridevbox.addItem(oMap);

			return util.objToLatLng(oPos);
		},

		getOrElseCreateMap: function(oPos) {
			if (sap.ui.getCore().byId("myRidesMap") !== undefined) {
				return sap.ui.getCore().byId("myRidesMap");
			} else {
				var oPolylines = new openui5.googlemaps.Polyline({
					path: "{/previousLocations}",
					strokeColor: "black"
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
					icon: "resources/img/map-marker-icon.png",
					info: "Start Point"
				});

				var currentMarker = new openui5.googlemaps.Marker({
					lat: '{/currentLocation/lat}',
					lng: '{/currentLocation/lng}',
					icon: "resources/img/point-16.png",
					info: "Current Location"
				});

				var oMap = new openui5.googlemaps.Map("myRidesMap", {
					lat: oPos.lat,
					lng: oPos.lng,
					zoom: 15,
					markers: [currentMarker, startMarker],
					polylines: [oPolylines]
				});

				return oMap;
			}
		},

		getOrElseCreatePrevRidesList: function() {
			var custId = window.localStorage.getItem("customerId");
			if (sap.ui.getCore().byId("prevRidesList") !== undefined) {
				return sap.ui.getCore().byId("prevRidesList");
			} else {
				var oListItemTemplate = new sap.m.StandardListItem({
					title: {
						path: 'HistoryId',
						formatter: function(historyId) {
							return "Ride ID: " + historyId;
						}
					},
					/*info: {
						path: 'BikeId',
						formatter: function(BikeID) {
							return "Bike ID: " + BikeID;
						}
					},*/
					description: {
						path: 'RideStart',
						formatter: function(rideDate) {
							return "Date: " + rideDate.substring(6, 8) + "." + rideDate.substring(4, 6) + "." + rideDate.substring(0, 4);
						}
					},
					infoState: sap.ui.core.ValueState.Success
				});
				var oPrevRidesList = new sap.m.List("prevRidesList", {
					items: {
						path: "/CustomerSet('" + custId + "')/CustHistory",
						template: oListItemTemplate
					}
				});
				return oPrevRidesList;
			}
		},

		updatePosition: function(position) {
			//var oWebSocket = this.oWebSocket;
			//console.log(oWebSocket);
			console.log("updatePosition Called");
			var oModel = sap.ui.getCore().getModel("currentLocModel");
			oModel.setProperty("/currentLocation/0/lat", position.coords.latitude);
			oModel.setProperty("/currentLocation/0/lng", position.coords.longitude);
			if (oModel.getProperty("/currentLocation/0/lat") !== position.coords.latitude && oModel.getProperty("/currentLocation/0/lng") !==
				position.coords.longitude) {
				var newLocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				}
				if (window.rentedBikeId !== undefined) {
					var data = {
						U_TOKEN: window.localStorage.getItem('UToken'),
						BIKE_ID: window.localStorage.getItem('rentedBikeId'),
						CUSTOMER_ID: window.localStorage.getItem('customerId'),
						LATITUDE: position.coords.latitude,
						LONGITUDE: position.coords.longitude
					};
					this.getWebsocket(function(websocket){
						jQuery.sap.log.info('Send new messages to web socket');
						websocket.send(JSON.stringify(data));
					});
					//this.oWebSocket.send(JSON.stringify(data));
					oModel.getProperty("/previousLocations").push(newLocation);
				}
			}
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
							window.startTime = new Date();
							console.log(window.startTime);
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
				window.pauseCounter += window.startTime.getTime() - window.pauseTime.getTime();
				console.log(window.pauseCounter);
				window.bikingState = "Riding";
			}

		},

		onPauseBtnPress: function() {
			var stopbtn = sap.ui.getCore().byId(this.createId("stopbtn"));
			var pausebtn = sap.ui.getCore().byId(this.createId("pausebtn"));
			var playbtn = sap.ui.getCore().byId(this.createId("playbtn"));
			playbtn.setEnabled(true);
			stopbtn.setEnabled(false);
			pausebtn.setEnabled(false);
			window.pauseStartTime = new Date();
			window.bikingState = "Paused";
		},

		onStopBtnPress: function() {

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
						
							that.getWebsocket(function(websocket){
										console.log('Close web socket');
										websocket.close();
									});

						if (window.selectedStation === undefined && window.rentedBikeId === undefined) {
							sap.m.MessageToast.show("Please Select a Station");
						} else {
							var oFreeBike = {
								"d": {
									"BikeId": window.localStorage.getItem('rentedBikeId'),
									"BikeStationId": window.selectedStation
								}
							};
							/*window.stopTime = new Date();
							var stopTime = window.stopTime;
							var startTime = window.startTime;
							var oStopDate = stopTime.getFullYear().toString() + "0" + stopTime.getMonth().toString() + stopTime.getDate().toString() +
								stopTime.getHours().toString() + stopTime.getMinutes().toString() +
								stopTime.getSeconds().toString();
							var oStartDate = startTime.getFullYear().toString() + "0" + startTime.getMonth().toString() + startTime.getDate().toString() +
								startTime.getHours().toString() + startTime.getMinutes().toString() +
								startTime.getSeconds().toString();
								
							var oRideHistory ={
								"d": {
									"CustomerId": window.localStorage.getItem('customerId'),
									"BikeId" : window.localStorage.getItem('rentedBikeId'),
									"SartTimestamp" : oStartDate,
									"ReleaseTimeStamp": oStopDate
								}
							};
							oModel.update('/balancecustSet', oRideHistory, {
								success: function(oData, oResponse) {
									dialog.close();
									console.log(oData);
									console.log(oResponse);
								},
								error: function(oError) {
									sap.m.MessageToast.show("There seems to be a problem please try again");
								}
							});*/
							//var diffMs = window.stopTime - window.startTime;
							//var diffMins = Math.floor((diffMs / 1000) / 60);

							oModel.create('/FreeBikesSet', oFreeBike, {
								success: function(oData, oResponse) {
									
									dialog.close();
									window.bikingState = "Stop";
									var myridevbox = sap.ui.getCore().byId(that.createId("myRidesVBox"));
									myridevbox.setVisible(false);
									navigator.geolocation.clearWatch(that.oWatchId);
									window.rentedBikeId = undefined;
									window.localStorage.removeItem('rentedBikeId');
									sap.m.MessageToast.show("Bike Freed Successfully!");
							
									
								},
								error: function(oError) {
									sap.m.MessageToast.show("There seems to be a problem please try again");
								}
							});
						}
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

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf BikeRentalApp.view.myrides
		 */
		onBeforeRendering: function() {
			console.log("onBeforeRendering Called");
			/*if (window.localStorage.getItem('rentedBikeId')) {
				var myridevbox = sap.ui.getCore().byId(this.createId("myRidesVBox"));
				myridevbox.setVisible(true);
			}*/

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf BikeRentalApp.view.myrides
		 */
		onAfterRendering: function() {
			var csrfToken = this.getView().getModel().oHeaders;
			csrfToken["UToken"] = window.localStorage.getItem('UToken');
			console.log("onAfterRendering Called");
			/*if (window.rentedBikeId !== undefined && window.bikingState !== "stop") {

				var myridevbox = sap.ui.getCore().byId(this.createId("myRidesVBox"));
				myridevbox.setVisible(true);

				window.watchId = this.watchPostion();

			}*/
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf BikeRentalApp.view.myrides
		 */
		/*onExit: function() {
			
		},
*/
		onReportIssuePress: function() {
			var oModel = this.getView().getModel();
			var oContext = new sap.ui.model.Context(oModel);
			var oText = new sap.m.Text({
				text: 'Your current ride will be stop and you are expected to release bike at a station',
				wrapping: true,
				maxLines: 8
			});
			var that = this;
			var oModel = this.getView().getModel();
			var dialog = new sap.m.Dialog("confirmRent", {
				title: 'Select Drop Station',
				type: 'Message',
				content: [oText],
				beginButton: new sap.m.Button({
					text: 'OK',
					press: function() {
						/*	var oFreeBike = {
								"d": {
									"BikeId": window.localStorage.getItem('rentedBikeId'),
									"BikeStationId": window.selectedStation
								}
							};
							oModel.create('/FreeBikesSet', oFreeBike, {
								success: function(oData, oResponse) {
									dialog.close();
									sap.m.MessageToast.show("Bike Freed Successfully!");
									window.bikingState = "Stop";
									var myridevbox = sap.ui.getCore().byId(that.createId("myRidesVBox"));
									myridevbox.setVisible(false);
									navigator.geolocation.clearWatch(that.oWatchId);
									window.rentedBikeId = undefined;
									window.localStorage.removeItem('rentedBikeId');
								},
								error: function(oError) {
									sap.m.MessageToast.show("There seems to be a problem please try again");
								}
							});*/
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
		toolbarnav: function(oEvent) {
			var route = oEvent.getSource().data("route");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo(route);
		}

	});

});