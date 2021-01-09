# adressomat-api-js
This is the home for the javascript binding of the adressomat's api. From here you can [download](https://raw.githubusercontent.com/joonlabs/adressomat-api-js/master/adressomat/adressomatv0.1.js "Download the js-api-file.") the current version and use it for you projects.
For access keys and pricing information, please contact us.

## usage
Just download (or clone) the .js-file in the ```adressomat/``` folder and include it into your project.
after loading the script you can create an object and use it as described in the foloowing example:
```javascript
let api = new Adressomat({
    key : "YOUR_API_KEY_HERE"
})

api.query({
    query : "Spielplatzstraße 19",
    limit : 50,
    callbackSuccess : function(data){
        console.log(data)
    }
})
```
You can also find a basic implementation of the api in the ```index.html``` file in the root of the repo.

## licensing and contact
For more information contact info@joonlabs.com.
