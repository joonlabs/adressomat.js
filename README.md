# Adress-O-Mat API (JS)
This is the  the javascript binding's home of the adressomat's api. From here you can [download](https://raw.githubusercontent.com/joonlabs/adressomat-api-js/master/js/adressomat.js "Download the js-api-file.") the current version and use it for your projects.
For access keys and pricing information, see [adressomat.de](https://adressomat.de "Adressomat Homepage").

## Usage
Just download (or clone) the .js-file in the ```js/``` folder and include it into your project.
After loading the script into your project you can create an object of the ```AdressOMat```class and use it as described in the following examples.
### /api/query/
The ```/api/query/``` endpoint allows you to search for addresses by string:
```javascript
let api = new AdressOMat({
    key : "YOUR_API_KEY_HERE"
})

api.query({
    query: "Spielplatzstraße 19",
    limit: 50,
    callbackSuccess: function (data) {
        console.log(data)
    },
    callbackError: function (data) {
        console.log(data)
    }
})
```
### /api/geo/
The ```/api/geo/``` endpoint allows you to search for addresses by coordinates:
```javascript
let api = new AdressOMat({
    key : "YOUR_API_KEY_HERE"
})

api.geocode({
    latitude: 51.754566,
    longitude: 8.59941,
    limit: 25,
    callbackSuccess: function (data) {
        console.log(data)
    },
    callbackError: function (data) {
        console.log(data)
    }
})
```
You can also find a basic implementation of the api in the ```index.html``` file in the root of the repo.

## licensing and contact
For more informatione, access keys and anything else, see [adressomat.de](https://adressomat.de "Adressomat Homepage").
