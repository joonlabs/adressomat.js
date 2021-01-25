class AdressOMatInput{
    /*
    initiates the adressomat and looks for input elements with the specified tag
     */
    static init({key, messages, callbacks}={key:null, messages:{}, callbacks:{}}){
        key = key || window.ADRESSOMAT_APIKEY || null
        messages = messages || {}
        callbacks = callbacks || {}
        messages = {
            "initial" : ("initial" in messages) ? messages.initial : "Mindestens 3 Buchstaben eingeben...",
            "noData" : ("noData" in messages) ? messages.noData : "Keine Ergebnisse gefunden",
        }
        callbacks = {
            "clickResult" : ("clickResult" in callbacks) ? callbacks.clickResult : AdressOMatInput.fillInResults
        }

        if(key===undefined) throw new MissingAPIKeyError("Please specify an API Key to authtenticate your requests. You can re-init the Adress-O-Mat input autocomplete by calling AdressOMat.init()")

        // create an instance of the api to use for the autcompletes
        AdressOMatInput.api = new AdressOMat({ key: key })
        AdressOMatInput.messages = messages
        AdressOMatInput.callbacks = callbacks
        AdressOMatInput.currentInput = null
        AdressOMatInput.currentPopUp = null

        AdressOMatInput.searchAndSetUpInputs()
    }

    /*
    adds the listeners to all input elements
     */
    static searchAndSetUpInputs(){
        let inputs = document.querySelectorAll("input[adressomat-autocomplete]")
        for(let input of inputs){
            let placeholder = input.getAttribute("adressomat-autocomplete")
            input.addEventListener("keyup", function(){
                if(input.value.length>=3){
                    AdressOMatInput.queryAndDisplayResults({query: input.value, placeholder:placeholder})
                }else{
                    AdressOMatInput.displayMessageInPopUp({message: AdressOMatInput.messages.initial})
                }
            })

            input.addEventListener("focusin", function(){
                AdressOMatInput.destroyAllSuggestionPopUps({
                    callback : function(){
                        AdressOMatInput.createSuggestionPopUp(input)
                        input.dispatchEvent(new Event('keyup'));
                    },
                    timeout : 0
                })

            })

            input.addEventListener("focusout", function(){
                AdressOMatInput.focusIsInInput = false
                AdressOMatInput.destroyAllSuggestionPopUps()
            })
        }

        // add listener for scroll
        window.addEventListener("scroll", function(){
            AdressOMatInput.refreshPositionOfCurrentPopUp()
        })
    }

    /*
    create a new suggestion popup below an input element
     */
    static createSuggestionPopUp(input){
        AdressOMatInput.focusIsInInput = true
        let suggestions = document.createElement("div")
        // style suggestion box
        suggestions.className = "adressomat-suggestions "+input.getAttribute("adressomat-autocomplete")
        suggestions.style.position = "fixed"
        suggestions.style.top = (AdressOMatInput.getCoords({elem:input}).top+input.offsetHeight) + "px"
        suggestions.style.left = AdressOMatInput.getCoords({elem:input}).left + "px"
        suggestions.style.width = input.offsetWidth+"px"
        suggestions.style.padding = "8px"
        suggestions.style.backgroundColor = "#fafafa"
        suggestions.style.boxSizing = "border-box"
        suggestions.style.borderBottomLeftRadius = "3px"
        suggestions.style.borderBottomRightRadius = "3px"

        suggestions.setAttribute("adressomat-popup", "")

        // make current popup available for other function
        AdressOMatInput.currentPopUp = suggestions
        AdressOMatInput.currentInput = input

        // add suggestion to dom
        document.body.appendChild(suggestions)

        AdressOMatInput.displayMessageInPopUp({message: AdressOMatInput.messages.initial})
    }

    /*
    refreshes the position of the current popup
     */
    static refreshPositionOfCurrentPopUp(){
        if(AdressOMatInput.currentPopUp !== null && AdressOMatInput.currentInput !== null){
            AdressOMatInput.currentPopUp.style.top = (AdressOMatInput.getCoords({elem:AdressOMatInput.currentInput}).top+AdressOMatInput.currentInput.offsetHeight) + "px"
            AdressOMatInput.currentPopUp.style.left = AdressOMatInput.getCoords({elem:AdressOMatInput.currentInput}).left + "px"
        }
    }

    /*
    returns the bounding box of an element
     */
    static getCoords({elem}) {
        var box = elem.getBoundingClientRect();

        var top  = box.top;
        var left = box.left;

        return { top: top, left: left };
    }

    static displayMessageInPopUp({message=""}={message:""}){
        AdressOMatInput.currentPopUp.innerHTML = ""
        // build initial message
        AdressOMatInput.currentPopUp.appendChild(
            AdressOMatInput.buildSuggestion({
                innerHTML:message,
                isHint:true
            })
        )
    }

    /*
    remove all suggestion popups
     */
    static destroyAllSuggestionPopUps({callback=function(){}, timeout=100}={callback:function(){}, timeout:100}){
        setTimeout((function(){
            if(AdressOMatInput.focusIsInInput===false) {
                let elems = document.querySelectorAll("div[adressomat-popup]")
                for (let el of elems) {
                    el.parentNode.removeChild(el)
                }
                AdressOMatInput.currentPopUp = null
                AdressOMatInput.currentInput = null
            }
            callback()
        }), timeout)
    }

    /*
    returns a single suggestion element
     */
    static buildSuggestion({innerHTML="", isHint=false, data={}}){
        let suggestion = document.createElement("div")
        suggestion.className = "suggestion "+(isHint ? "hint": "result")
        suggestion.innerHTML = innerHTML
        suggestion.onclick = onclick
        if(!isHint){
             (function(data){
                 suggestion.onmousedown = function(){AdressOMatInput.callbacks.clickResult({data: data})}
            })(data)
        }
        return suggestion
    }

    /*
    run the query and display the results
     */
    static queryAndDisplayResults({query="", placeholder}={query:"", placeholder:"name"}){
        AdressOMatInput.api.query({
            query: query,
            limit: 35,
            callbackSuccess: function (data) {
                // reset suggestions
                AdressOMatInput.currentPopUp.innerHTML = ""

                // display message if no data
                if(data.data.length===0){
                    AdressOMatInput.displayMessageInPopUp({message: AdressOMatInput.messages.noData})
                }

                // display data
                for(let d of data.data){
                    //console.log(AdressOMatInput.formatPlaceholderWithData({placeholder:placeholder, data:d}))
                    AdressOMatInput.currentPopUp.appendChild(
                        AdressOMatInput.buildSuggestion({
                            innerHTML: AdressOMatInput.formatPlaceholderWithData({placeholder:placeholder, data:d}),
                            isHint:false,
                            data: d
                        })
                    )
                }

            },
            callbackError: function (data) {
                console.log(data)
            }
        })
    }

    /*
    replaces a given placeholder with data
     */
    static formatPlaceholderWithData({placeholder="", data={}}={placeholder:"", data:{}}){
        placeholder = placeholder.replace("name", data.name)
        placeholder = placeholder.replace("attributes.street", data.attributes.street ? data.attributes.street : "")
        placeholder = placeholder.replace("attributes.housenumber", data.attributes.housenumber ? data.attributes.housenumber : "")
        placeholder = placeholder.replace("attributes.postalcode", data.attributes.postalcode ? data.attributes.postalcode : "")
        placeholder = placeholder.replace("attributes.city", data.attributes.city ? data.attributes.city : "")
        placeholder = placeholder.replace("coordinates.lat", data.coordinates.lat ? data.coordinates.lat : "")
        placeholder = placeholder.replace("coordinates.long", data.coordinates.long ? data.coordinates.long : "")
        return placeholder
    }

    /*
    fills all inputs in page with given data
     */
    static fillInResults({data}={data:{}}){
        let inputs = document.querySelectorAll("input[adressomat-autofill]")
        for(let input of inputs){
            let placeholder = input.getAttribute("adressomat-autofill")
            input.value = AdressOMatInput.formatPlaceholderWithData({placeholder:placeholder, data:data})
        }
    }
}

class MissingAPIKeyError extends Error {
    constructor(message) {
        super(message);
        this.name = "MissingAPIKeyError";
    }
}