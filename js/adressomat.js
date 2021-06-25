class AdressOMat {
    /*
    create an instance of the Adressomat-class
    */
    constructor({key} = {key: null}) {
        this.API_ENDPOINT = "https://adressomat.de/api/";
        this.API_MODULES = ["address", "geo"];

        this.setKey({
            key: key
        })
    }

    /*
    returns the current api key
    */
    getKey() {
        return this.key
    }

    /*
    changes the current api key
    */
    setKey({key = null}) {
        this.key = key
    }

    /**
     * creates a query and passes the results to the callback function(s)
     * @param query query sent to the server
     * @param limit max number of entries
     * @param callbackSuccess function called on data receive
     * @param callbackError function called on error
     */
    query({
              query = "", limit = 50, callbackSuccess = function () {
        }, callbackError = function () {
        }
          }) {
        query = query || ""
        limit = limit || 50
        callbackSuccess = callbackSuccess || function () {
        }
        callbackError = callbackError || function () {
        }

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(xhttp.responseText);
                callbackSuccess(response);
            } else if (this.readyState === 4 && this.status !== 200) {
                console.warn("There was an error, while retreiving the answer from the api.\nFor further detail, see the response in the callbackError function.")
                let response = JSON.parse(xhttp.responseText);
                callbackError(response);
            }
        }
        ;
        xhttp.open(
            "GET",
            this.API_ENDPOINT + this.API_MODULES[0] +
            "/?query=" + encodeURIComponent(query) +
            "&limit=" + encodeURIComponent(limit) +
            "&key=" + this.getKey(), true
        );
        xhttp.send();
    }

    /**
     * creates a geocode request and passes the results to the callback function(s)
     * @param latitude latitude
     * @param longitude longitude
     * @param distance max distance
     * @param limit max number of entries
     * @param callbackSuccess function called on data receive
     * @param callbackError function called on error
     */
    geocode({
                latitude, longitude, distance = 10, limit = 50, callbackSuccess = function () {
        }, callbackError = function () {
        }
            }) {
        latitude = latitude || undefined
        longitude = longitude || undefined
        distance = distance || 10
        limit = limit || 50
        callbackSuccess = callbackSuccess || function () {
        }
        callbackError = callbackError || function () {
        }

        // notify user that api can't be called if lat of long is missing
        if (longitude === undefined || latitude === undefined) {
            throw new MissingParameterError("Please specify a latitude and a longitude for the geocode request.")
        }

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(xhttp.responseText);
                callbackSuccess(response);
            } else if (this.readyState === 4 && this.status !== 200) {
                console.warn("There was an error, while retreiving the answer from the api.\nFor further detail, see the response in the callbackError function.")
                let response = JSON.parse(xhttp.responseText);
                callbackError(response);
            }
        }
        ;
        xhttp.open(
            "GET",
            this.API_ENDPOINT + this.API_MODULES[1] +
            "/?lat=" + encodeURIComponent(latitude) +
            "&long=" + encodeURIComponent(longitude) +
            "&distance=" + encodeURIComponent(distance) +
            "&limit=" + encodeURIComponent(limit) +
            "&key=" + this.getKey(), true
        );
        xhttp.send();
    }

    /**
     * creates and renders a new map
     * @param container id of the div container the map is rendered in
     * @param latitude latitude of the map's center
     * @param longitude longitude of the map's center
     * @param zoom zoom level of the map
     * @returns {_AdressOMatMap}
     * @constructor
     */
    Map({container, latitude, longitude, zoom}) {
        let key = this.getKey()
        return new _AdressOMatMap({container, latitude, longitude, zoom, key})
    }
}

class _AdressOMatMap {
    /**
     * creates a new _AdressOMatMap
     * @param container id of the div container the map is rendered in
     * @param latitude latitude of the map's center
     * @param longitude longitude of the map's center
     * @param zoom zoom level of the map
     * @param key api key
     */
    constructor({container, latitude, longitude, zoom, key}) {
        if (window.mapboxgl === undefined)
            throw new MissingMapBoxGLError("mapbox-gl.js must be included to display a map. e.g. use https://adressomat.de/api/serve/js/mapbox-gl.js")

        this.map = new window.mapboxgl.Map({
            container: container,
            style: "https://maps.adressomat.de/api/style?key=" + key,
            center: [longitude, latitude],
            zoom: zoom
        });
    }


    /**
     * adds a marker to the map
     * @param latitude latitude of the marker
     * @param longitude longitude of the marker
     * @param className class name of the marker
     * @param popupContent HTML formatted content of the popup
     * @param popupOffset offset of the popup
     * @param popupVisible shows the popup by default if true
     */
    addMarker({latitude, longitude, className, popupContent, popupOffset, popupVisible}) {
        let el = document.createElement("div")
        el.className = className || "marker"

        let marker = new window.mapboxgl.Marker(el).setLngLat([longitude, latitude])

        if (popupContent !== undefined)
            marker.setPopup(new window.mapboxgl.Popup({offset: popupOffset}).setHTML(popupContent))

        marker.addTo(this.map)

        if(popupVisible)
            marker.togglePopup()
    }

    /**
     * flies to a given location
     * @param latitude latitude of the location
     * @param longitude longitude of the location
     * @param duration duration of the animation in ms
     * @param zoom final zoom level
     */
    flyTo({latitude, longitude, duration, zoom}) {
        this.map.flyTo({
            center: [
                longitude,
                latitude
            ],
            zoom: zoom || 14,
            duration: duration || 6000,
            essential: true
        });
    }
}

class MissingParameterError extends Error {
    constructor(message) {
        super(message);
        this.name = "MissingParameterError";
    }
}

class MissingMapBoxGLError extends Error {
    constructor(message) {
        super(message);
        this.name = "MissingMapBoxGLError";
    }
}