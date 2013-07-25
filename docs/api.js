YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "actorPrototype",
        "actors",
        "baddyPrototype",
        "campaign",
        "entities",
        "entityPrototype",
        "game",
        "graphics",
        "input",
        "map",
        "objectPrototype",
        "palette",
        "playerPrototype",
        "polyfills",
        "projectilePrototype",
        "screen",
        "tiles",
        "timer",
        "util",
        "vector",
        "weapons"
    ],
    "modules": [
        "actorPrototype",
        "actors",
        "baddyPrototype",
        "campaign",
        "entities",
        "game",
        "graphics",
        "input",
        "map",
        "objectPrototype",
        "palette",
        "playerPrototype",
        "polyfills",
        "projectilePrototype",
        "screen",
        "tiles",
        "timer",
        "util",
        "vector",
        "weapons"
    ],
    "allModules": [
        {
            "displayName": "actorPrototype",
            "name": "actorPrototype",
            "description": "Prototype for all actors. Inherits from entity prototype\n\nFor more information on how Escape uses inheritance see objectPrototype.js"
        },
        {
            "displayName": "actors",
            "name": "actors",
            "description": "Definitions for all the actor types in the game. Also includes a factory method (create)\nto create an actor of that type"
        },
        {
            "displayName": "baddyPrototype",
            "name": "baddyPrototype",
            "description": "Prototype for all baddies. Inherits from actor prototype\n\nFor more information on how Escape uses inheritance see objectPrototype.js"
        },
        {
            "displayName": "campaign",
            "name": "campaign",
            "description": "Handles all state and behaviour for campaigns"
        },
        {
            "displayName": "entities",
            "name": "entities",
            "description": "entities object contains code for tracking, processing and rendering entities"
        },
        {
            "displayName": "game",
            "name": "game",
            "description": "ESCAPE\n\nThe game entry point code and loop"
        },
        {
            "displayName": "graphics",
            "name": "graphics",
            "description": "Graphics module\nContains all code that outputs to the canvas"
        },
        {
            "displayName": "input",
            "name": "input",
            "description": "Input module\nContains all code relating to input"
        },
        {
            "displayName": "map",
            "name": "map",
            "description": "Map module. Objects and methods concerning the map"
        },
        {
            "displayName": "objectPrototype",
            "name": "objectPrototype",
            "description": "Extend Object.prototype with helper methods to simplify inheritance\n\nEscape uses prototypal style inheritance rather than the constructor / pseudo-classical \napproach used by many javascript developers. The \"blueprints\" for each type of object\nare defined as objects in files named \"<type>Prototype.js\". A new object of that type can \nbe created using \"var newObj = <type>Prototype.create();\". To create a new prototype based\nupon a previous one use \"var newPrototype = <type>Prototype.extend();\"\n\nIt could be argued that extending Object.prototype in this way is an anti-pattern due to the\neffect it could have on code written by those who are unaware that it has been extended. However,\nthe code below takes account of the most common types of conflict and employs suitable preventative\nmeasures so this sort of problem should not occur."
        },
        {
            "displayName": "palette",
            "name": "palette",
            "description": "Command palette for the game editor"
        },
        {
            "displayName": "playerPrototype",
            "name": "playerPrototype",
            "description": "Prototype for the player. Inherits from actor prototype\n\nFor more information on how Escape uses inheritance see objectPrototype.js"
        },
        {
            "displayName": "polyfills",
            "name": "polyfills",
            "description": "Polyfills module"
        },
        {
            "displayName": "projectilePrototype",
            "name": "projectilePrototype",
            "description": "Prototype for all projectiles. Inherits from entity prototype\n\nFor more information on how Escape uses inheritance see objectPrototype.js"
        },
        {
            "displayName": "screen",
            "name": "screen",
            "description": "Screen methods"
        },
        {
            "displayName": "tiles",
            "name": "tiles",
            "description": "Tiles module.\n\nHandles all functionality associated with map tiles\nIf you're looking for something and can't find it then try the map module"
        },
        {
            "displayName": "timer",
            "name": "timer",
            "description": "Keeps track of the time between frames\n\nTODO: expand with functionality to set custom timers"
        },
        {
            "displayName": "util",
            "name": "util",
            "description": "Utility methods that do not really belong any where else"
        },
        {
            "displayName": "vector",
            "name": "vector",
            "description": "A library of useful vector math functions\n\nAt first glance it may appear that a nicer syntax could be obtained by creating a vector type\nand attaching these methods to the prototype. However, the most common use case is an object\nof a different type that happens to have x and y properties. As using apply/call is fiddly\nin terms of syntax and multiple inheritance is memory inefficient in javascript (an object can \nonly be linked to a single prototype), I believe this approach to be best."
        },
        {
            "displayName": "weapons",
            "name": "weapons",
            "description": "Weapon definitions"
        }
    ]
} };
});