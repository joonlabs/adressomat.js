class AdressOMat{
    key = undefined;
    API_ENDPOINT = "https://adressomat.de/api/";
    API_MODULES = ["address", "geo"];

    /*
    create an instance of the Adressomat-class
    */
    constructor({key = null}) {
        this.setKey({
            key : key
        })
    }

    /*
    returns the current api key
    */
    getKey(){
        return this.key
    }

    /*
    changes the current api key
    */
    setKey({key = null}){
        this.key = key
    }

    /*
    creates a query and passes the results to the callback function(s)
    */
    query({query = "", limit = 50, callbackSuccess = function(){}, callbackError = function(){}}){
        query = query || ""
        limit = limit || 50
        callbackSuccess = callbackSuccess || function(){}
        callbackError = callbackError || function(){}

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(xhttp.responseText);
                callbackSuccess(response);
            }else if(this.readyState === 4  && this.status !== 200){
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

    /*
    creates a geocode request and passes the results to the callback function(s)
    */
    geocode({latitude, longitude, distance=10, limit = 50, callbackSuccess = function(){}, callbackError = function(){}}){
        latitude = latitude || undefined
        longitude = longitude || undefined
        distance = distance || 10
        limit = limit || 50
        callbackSuccess = callbackSuccess || function(){}
        callbackError = callbackError || function(){}

// notify user that api can't be called if lat of long is missing
        if(longitude===undefined || latitude===undefined){
            throw new MissingParameterError("Please specify a latitude and a longitude for the geocode request.")
        }

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(xhttp.responseText);
                callbackSuccess(response);
            }else if(this.readyState === 4  && this.status !== 200){
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
}

class MissingParameterError extends Error {
    constructor(message) {
        super(message);
        this.name = "MissingParameterError";
    }
}