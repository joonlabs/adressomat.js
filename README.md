![Adress-O-Mat logo](https://adressomat.de/website/images/logo-color.svg)

[![Generic badge](https://img.shields.io/badge/version-1.1-<COLOR>.svg)](https://adressomat.de)
[![Generic badge](https://img.shields.io/badge/status-available-<COLOR>.svg)](https://adressomat.de/status)
# Adress-O-Mat API (JS)
This is the  the javascript binding's home of the adressomat's api. From here you can download [adressomat.js](https://raw.githubusercontent.com/joonlabs/adressomat-api-js/master/js/adressomat.js "Download the js-api-file.") and [autocomplete.js](https://raw.githubusercontent.com/joonlabs/adressomat-api-js/master/js/autocomplete.js "Download the js-api-file.") or include the latest version directly via the script tags below and use it for your projects.
```html
<!-- javascript -->
<script src="https://adressomat.de/api/serve/js/adressomat.js"></script>
<script src="https://adressomat.de/api/serve/js/autocomplete.js"></script>
<!-- css (optional) -->
<link rel="stylesheet" href="https://adressomat.de/api/serve/css/autocomplete.css"/>
```

## adressomat.js
Put the ```adressomat.js```-file from the ```js/``` folder into your project and include it.
After loading the script into the page you can create an instance of the ```AdressOMat```class and use it as described in the following examples.
### query endpoint
The ```/api/query/``` endpoint allows you to search for addresses by string and is called via the ```query({query,limit,...})``` method:
```javascript
let api = new AdressOMat({
    key : "YOUR_API_KEY_HERE"
})

api.query({
    query: "Spielplatzstraße 19",
    limit: 50,  //optional
    callbackSuccess: function (data) { //optional
        console.log(data)
    },
    callbackError: function (data) { //optional
        console.log(data)
    }
})
```
### geo endpoint
The ```/api/geo/``` endpoint allows you to search for addresses near a given location and is called via the ```geo({latitude,lonitude,limit,...})``` method:
```javascript
let api = new AdressOMat({
    key : "YOUR_API_KEY_HERE"
})

api.geocode({
    latitude: 51.754566,
    longitude: 8.59941,
    limit: 25, //optional
    callbackSuccess: function (data) { //optional
        console.log(data)
    },
    callbackError: function (data) { //optional
        console.log(data)
    }
})
```
You can also find a basic implementation of the api in the ```index.html``` file in the root of the repo.

### maps
To use maps, the mapbox-gl framework is required additionally.

```html
<script src="https://adressomat.de/api/serve/js/mapbox-gl.js"></script>
<link rel="stylesheet" href="https://adressomat.de/api/serve/css/mapbox-gl.css"/>
```
Also, if you want to use markers, a style for them should be created.
```css
.marker{
    width: 30px;
    height: 30px;
    background: #000000;
    border-radius: 50%;
}
```

You can then display maps, markers and popups and fly to locations around the world.
```js
let api = new AdressOMat({key: "YOUR_API_KEY_HERE"})

// render a map in the div container with the id "map"
let map = api.Map({
    container: "map",
    latitude: 51.754566,
    longitude: 8.59941,
    zoom: 11
})

// add a marker with popup to the map
map.Marker({
    latitude: 51.754566,
    longitude: 8.59941,
    className: "marker", // optional (default is "marker")
}).setPopup({
    content: "<h3>AdressOMat</h3>Spielplatzstraße 19",
    offset: [0, 5]
}).render({
    map
}).togglePopup()

// fly to a random point
map.flyTo({
    latitude: 51 + (Math.random() - 0.5) * 5,
    longitude: 8 + (Math.random() - 0.5) * 5,
    zoom: 14, // optional (default is 14)
    maxDuration: 6000 // optional (default is 6000) 
})

// disable zoom on scroll
map.disableZoom({
    allowCtr: false // optional (default is false) 
})

// register an click event handler
map.on({
    event: "click",
    handler: function(event){
        alert(`You clicked at: (${event.lngLat.lat}, ${event.lngLat.lng})`)
    }
})
```

## autocomplete.js
The ```autocomplete.js``` script is an extension to the basic ```adressomat.js``` implementation. Include both scripts in your page and initialize the autocompletion of input elements on your page as described below. 
```javascript
window.addEventListener("load", function(){
    AdressOMatInput.init({
        key: "YOUR_API_KEY_HERE",
        messages : { //optional (is default)
            "initial" : "Mindestens 3 Buchstaben eingeben...",
            "noData" : "Keine Ergebnisse gefunden",
        },
        callbacks : { //optional (is default)
            "clickResult" :  AdressOMatInput.fillInResults 
        },
        configuration : { // optional (is default for autocomplete.css)
            "showLogo" : true
        }
    })
})
```
The script will look for input elements with the tag ```adressomat-autocomplete=[VALUE]```.<br>
You can replace ```[VALUE]``` with one or a combination of the following placeholders, to replace it with it's according value, returned from the api.
- **name** (full and formatted address)
- **attributes.street** (street of the address)
- **attributes.housenumber** (housenumber of the address)
- **attributes.postalcode** (postalcode of the address)
- **attributes.city** (city of the address)
- **coordinates.lat** (latitude of the address)
- **coordinates.lat** (longitude of the address)

If you want to specify where to fill address information by default, when a user clicks a result, you can add the tag ```adressomat-autofill="[VALUE]"``` to any other HTML element that supports the value property (e.g. inputs). This tag also support the values specified above.

Thus, to sum up the information above:

````html
<input type="search" adressomat-autocomplete="name" adressomat-autofill="attributes.street" placeholder="street">
<input type="search" adressomat-autofill="attributes.housenumber" placeholder="housenumber">
````
You can also find a basic implementation of the autocompletion feature in the ```index-autocomplete.html``` file in the root of the repo.

## licensing and contact
For more information, data coverage, api keys and anything else, see [adressomat.de](https://adressomat.de "Adressomat Homepage").
