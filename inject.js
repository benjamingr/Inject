/*
    Lightweight dependency manager using a local registry,
    Author: Benjamin Gruenbaum
*/

(function (global) {
    /* The dependency registry */
    var registry = {};

    //Registers a dependency 
    function register(/* name, arr, func */) {
        var data = getDependencyData.apply(this,arguments);

        // The actual returned function also registered.

        var retFun = function () {
            var resolvedDeps = data.deps.map(resolve).filter(notUndefined);
            var args = Array.prototype.slice.call(arguments);
            return data.func.apply(this, resolvedDeps.concat(args));
        };
        registry[data.name] = retFun;
        return retFun;
    }
    //filters unresolved dependencies
    function notUndefined(elm){
        return elm!==undefined;
    }

    //Parses the dependency data from the arguments passed

    function getDependencyData(){
    	var deps, //the found dependencies
    	    name, // the registered module name
    	    func; //the processed function

    	//register("name",[dependencies],func)
    	if(arguments.length === 3){
    		name = arguments[0]; // name explicit
    		deps = arguments[1]; // dependencies explicit
  			func = arguments[2]
    	}else if (arguments.length === 2){
    		//register([deps],function name(){})
    		if(Array.isArray(arguments[0])){
    			deps = arguments[0];
    			func = arguments[1];
    			name = func.name;
    		//register("name",function(){ })
    		}else{
    			func = arguments[1];
    			deps = depParser(func); //deps in parameters
    			name = arguments[0];
    		}
    	//register(function name(){})
    	}else{
        	func = arguments[0];
        	name = func.name;
        	deps = depParser(func); //deps in parameters
    	}
    	return {name:name,deps:deps,func:func};
    }
    //resolves a dependency
    function resolve(depName) {
        if (registry.hasOwnProperty(depName)) {
            return registry[depName];
        }
        return undefined;
    }

    //Parses a dependency of a function in function(arga,argb...) syntax. Ugly
    // TODO support `...` syntax
    function depParser(func) {
        var argsList = func.toString().match(/\(.*?\)/)[0];
        var args = argsList.substring(1, argsList.length - 1).split(",");
        return args;
    }
    register.get = resolve; // get a function
    register.set = register; // register a function
    
    //Now we register our module.


    //nodejs AMD
    if((typeof module !== "undefined") && module.exports){
        module.exports = register;
    }
    //requirejs 
    else if(typeof require === "function"){
        return define(register);
    //expose globally
    }else{
        global.Inject = register;
    }
    return register;

})(window || global);

//Demonstration

console.clear();

var Person = Inject(function Person() {
    return function () {
        console.log("HI I'm Person");
    };
});
var rlemon = Inject("rlemon",["Person"],function() {
    return function () {
        console.log("Hi, I'm rlemon I like slides");
        var p = Person();
        p();
    };
});

var Zirak = Inject("Zirak",function(){
    console.log("Third syntax just to show");
});

    var People = Inject(function People(Person,rlemon,Zirak,yo) {
        var p = Person();
        var r = rlemon();
        r();
        p();
        Zirak();
        console.log(yo);
    });
var pep = People("YOYOYO");