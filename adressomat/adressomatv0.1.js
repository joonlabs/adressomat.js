class Adressomat{
    key = null;
    API_ENDPOINT= "https://adressomat.de/api/";
    
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
    makes a query and passes the results to the callback function(s)
     */
    query({query = "", limit = 50, callbackSuccess = function(){}, callbackError = function(){}}){
        query = query || ""
        limit = limit || 50
        callbackSuccess = callbackSuccess || function(){}
        callbackError = callbackError || function(){}

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(xhttp.responseText);
                callbackSuccess(response);
            }
        };
        xhttp.open("GET", this.API_ENDPOINT+"?query="+encodeURIComponent(query)+"&limit="+encodeURIComponent(limit)+"&key="+this.getKey(), true);
        xhttp.send();
    }
}