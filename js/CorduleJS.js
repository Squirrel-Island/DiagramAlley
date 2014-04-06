/**
 * CorduleJS - a lightweight JavaScript module system
 * @author Rob Whitaker
 */
var CorduleJS = (function() {
    
    var modules   = {},
        observers = {},
        removingObserver = "";

    /**
     * The addModule function adds a module to CorduleJS. If a module by the same name already exists
     * or the provided module is not an object with init() and destroy() functions, addModule will throw
     * an error. 
     * 
     * @param name      the name of the module to add
     * @param module    the module object to add
     */   
    var addModule = function(name, module) {
        name = name || '';

        if(typeof module != "object")
            throw Error("CorduleJS.addModule(). Parameter (module). Module must be an object. Found " + typeof module +".");

        if(modules[name])
            throw Error("A module by the name " + name + " already exists. Unable to load duplicate module.");

        if(typeof module.init != "function" || typeof module.destroy != "function")
            throw Error("Integral functions undefined in module '" + name +"': init , destroy. Unable to load module.");

        modules[name] = module;

        modules[name]._ReferralName = name;
        modules[name].init();
    } 

    /**
     * The pushRequest function sends a request and a set of parameters to CorduleJS. If any modules have
     * observers set for that request, CorduleJS will pass the parameters to the observer's callback function.
     * This allows modules to interact without having to know about each other.
     *
     * @param request    the string holding the name of the request
     * @param params     the parameter or set of parameters associated with a given request
     * @return           an array of results returned by the observer(s), false if the request is not handled
     */ 
    var pushRequest = function(request, params) {
        if(!request)
            return false;
        
        if(!params)
            params = {};

        removingObserver = "";

        if(observers[request]) {
            var results = [];
            for(var i = 0; observers[request] && i < observers[request].length; i++) {
                var result = observers[request][i].callback.call(params);
                if(result)
                    results.push(result);
                
                if(removingObserver === request) {
                    i--;
                    removingObserver = "";
                }
            }

            return results;
        }

        return false;
    }

    /**
     * The observe function sets up an observer for a given request. This observer is associated with
     * a specific module, so multiple different modules can have observers listening for the same
     * request.
     *
     * @param moduleRef    a reference to the module that is setting the observer
     * @param request      the string holding the name of the request to be observed
     * @param callback     the function to be called when a request is pushed that matches this one
     * @return             true if observer was successfully set, false otherwise
     */ 
    var observe = function(moduleRef,request, callback) {
        if(!moduleRef || !request || !callback)
            return false;

        if(observers[request]) {

            for(var i=0; i<observers[request].length; i++)
                if(observers[request][i].observerModuleName === moduleRef._ReferralName)
                    return false;

            observers[request].push({"observerModuleName": moduleRef._ReferralName, "callback" : callback});
        } else
            observers[request] = [{"observerModuleName": moduleRef._ReferralName, "callback" : callback}];

        return true;
    }

    /**
     * The removeObserver function removes an observer from CorduleJS.
     *
     * @param moduleRef    a reference to the module that initially set the observer
     * @param request      the request the observer is listening for
     * @return             true if the observer has been removed, false otherwise
     */
    var removeObserver = function(moduleRef,request) {
        if(observers[request]) {
            for(var i = 0; i<observers[request].length; i++) {
                if(observers[request][i].observerModuleName === moduleRef._ReferralName) {
                    removingObserver = request;
                    observers[request].splice(i,1);
                    if(observers[request].length < 1) 
                        observers[request] = null;
                    return true;
                }
            }
        }

        return false;
    } 

    /**
     * The removeModule function calls a modules destroy() function and then deletes
     * the module from CorduleJS.
     *
     * @param moduleName    the name of the module to be removed
     * @return              true if the module has been removed, false otherwise
     */
    var removeModule = function(moduleName) {
        if(modules[moduleName]) {
            modules[moduleName].destroy();
            delete modules[moduleName];

            return true;
        }

        return false;
    }

    return {
        addModule       : addModule,
        pushRequest     : pushRequest,
        observe         : observe,
        removeObserver  : removeObserver,
        removeModule    : removeModule
    };
})();