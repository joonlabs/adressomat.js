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
     * @returns {AdressOMatMap}
     * @constructor
     */
    Map({container, latitude, longitude, zoom}) {
        let key = this.getKey()
        return new AdressOMatMap({container, latitude, longitude, zoom, key})
    }
}

class AdressOMatMap {
    /**
     * creates a new AdressOMatMap
     * @param container id of the div container the map is rendered in
     * @param latitude latitude of the map's center
     * @param longitude longitude of the map's center
     * @param zoom zoom level of the map
     * @param key api key
     */
    constructor({container, latitude, longitude, zoom, key}) {
        if (window.mapboxgl === undefined)
            throw new MissingMapBoxGLError("mapbox-gl.js must be included to display a map. e.g. use https://adressomat.de/api/serve/js/mapbox-gl.js")

        this.container = document.getElementById(container)

        this.map = new window.mapboxgl.Map({
            container: container,
            style: "https://maps.adressomat.de/api/style/?key=" + key,
            center: [longitude, latitude],
            zoom: zoom
        });
    }

    /**
     * disables the zoom function of the map
     * @return {AdressOMatMap}
     */
    enableZoom() {
        this.map.scrollZoom.enable()
        return this
    }

    /**
     * disables the zoom function of the map
     * @return {AdressOMatMap}
     */
    disableZoom({allowCtr}={}) {
        let _this = this

        this.map.scrollZoom.disable()

        if(allowCtr){
            this.container.addEventListener("wheel", function(e){
                if(e.ctrlKey) {
                    _this.container.setAttribute("ctrl-zoom-blocked", "false")
                    _this.map.scrollZoom.enable()
                } else {
                    _this.container.setAttribute("ctrl-zoom-blocked", "true")
                    _this.map.scrollZoom.disable()
                }
            })
        }
        return this
    }

    /**
     * registers an handler for an event
     * @param {String} event
     * @param {Function} handler
     * @return {AdressOMatMap}
     */
    on({event, handler}){
        this.map.on(event, handler)
        return this
    }

    /**
     * flies to a given location
     * @param latitude latitude of the location
     * @param longitude longitude of the location
     * @param duration duration of the animation in ms
     * @param zoom final zoom level
     * @return {AdressOMatMap}
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
        return this
    }

    /**
     * creates a new marker
     * @param latitude
     * @param longitude
     * @param className
     * @constructor
     */
    Marker({latitude, longitude, className}) {
        return new AdressOMapMarker({
            latitude,
            longitude,
            className
        })
    }
}

class AdressOMapMarker {
    /**
     * creates a new AdressOMapMarker
     * @param latitude
     * @param longitude
     * @param className
     */
    constructor({latitude, longitude, className}) {
        let el = document.createElement("div")
        el.className = className || "marker"

        this.marker = new window.mapboxgl.Marker(el).setLngLat([longitude, latitude])
    }

    /**
     * sets the pop up content
     * @param {String} content
     * @param {Number, [Number], Object} [offset]
     * @returns {AdressOMapMarker}
     */
    setPopup({content, offset}) {
        this.marker.setPopup(new window.mapboxgl.Popup({offset: (offset || 0)}).setHTML(content || ""))
        return this
    }

    /**
     * renders the marker on the map
     * @param {AdressOMatMap} map
     * @returns {AdressOMapMarker}
     */
    render({map}) {
        this.marker.addTo(map.map)
        return this
    }

    /**
     * toggles the marker's popup
     * @returns {AdressOMapMarker}
     */
    togglePopup() {
        this.marker.togglePopup()
        return this
    }

    /**
     * returns the marker's HTML-Element
     * @return {*}
     */
    getElement() {
        return this.marker.getElement()
    }

    /**
     * removes a marker from the map
     * @returns {AdressOMapMarker}
     */
    remove() {
        this.marker.remove()
        return this
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