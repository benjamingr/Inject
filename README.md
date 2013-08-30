Inject
======

Dependency Resolver - small and lightweight.

This is a small light weight dependency resolver allowing for easy parameter dependency injection.

This may be used as a service locator or as a dependency injection container. 
Please - for your own code's sake do not use `Inject.get` to obtain dependencies, instead pass them explicitly
in the function argument list.

If you're coming from Angular - you'll find the syntax very familiar.

Here are some usage examples to get you started:


Let's start by declaring a dependency, we're declaring a `Person` here with no dependencies of its own.

    var Person = Inject(function Person() {
        return function () {
            console.log("HI I'm Person");
        };
    });
    
Alternatively, if we want to use minifiers, we can define the name of the dependency as well as its own dependencies
in an array. 

    var rlemon = Inject("rlemon",["Person"],function() {
        return function () {
            console.log("Hi, I'm rlemon I like slides");
            var p = Person();
            p();
        };
    });
    
Here we declared an `rlemon` dependency, which depends on `person` we've defined earlier. Note we named the dependency
explicitly this time (this is minifier friendly).

Alternatively, we can delcare the dependency name and drop its own dependencies (in this case we have no dependencies
but passing them as parameters works equally well).

    var Zirak = Inject("Zirak",function(){
        console.log("Third syntax just to show");
    });
    
Now, let's demonstrate usage with a function with multiple dependencies. Note that unresolved dependencies will
not be captured and we can use arguments.

    var People = Inject(function People(Person,rlemon,Zirak,yo) {
        var p = Person();
        var r = rlemon();
        r();
        p();
        Zirak();
        console.log(yo);
    });
    
The result of the above is:

>Hi, I'm rlemon I like slides 

>HI I'm Person 

>HI I'm Person 

>Third syntax just to show 

>YOYOYO 

