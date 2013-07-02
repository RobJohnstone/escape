Escape
======

HTML5 Game - 1942: You are a British paratrooper captured in France during a raid on a secret German radar installation. Taken to a Gestapo interrogation centre you must now escape and return to Britain. 

This is an extremely early alpha (in fact it is more a prototype designed to test gameplay principles - hence the horrible vector graphics). If the gameplay is promising then this will eventually turn into a complete game

How to play:
------------

To be honest it's not really playable at the moment. If you really want to check it out then clone the repo or download the files and use your browser (Chrome only at the moment, but will be cross-browser in due course) to view the index.html file (The game currently assumes it is running at \<insert domain (e.g. localhost)\>/escape/index.html). But seriously, this is not yet a game. What might be more interesting is to look at the source and to compare with your own approaches in creating HTML5 games. The controls are:

+ w: move up
+ d: move right
+ s: move down
+ a: move left
+ p: pause
+ click to fire

Advanced Install
----------------

For developers with a bit of experience there is an alternative way to install the game. The advantage of this approach is that you will be able to use the build scripts and also use the map editor which will not save files if the simple process is followed. [I've only been able so far to test this process on linux (Ubuntu 12.10). If it does not work then it may be that my directions do not translate well to your operating system. Please let me know and I'll investigate]

1. Install node.js (http://nodejs.org)
2. Install git (http://git-scm.com)
3. Install grunt (type: 'npm install -g grunt-cli')
3. Clone the repo (from the command line when in the correct parent directory, type: 'git clone https://github.com/RobJohnstone/escape.git')
4. Navigate into the escape directory (type: 'cd escape')
5. Install dependencies (type: 'npm install')
6. Start the server (type: './escape.sh')

The last command should also open your default web browser (hopefully Chrome as that is what the game is currently tested in! If not, open Chrome and type 'localhost:8080' into the address bar. As long as you do not have anything else running on that port then the game will start).

Technology:
-----------

+ canvas element
+ (*)localStorage
+ AJAX
+ (*)HTML5 audio
+ Javascript game engine
+ (*)An as yet undetermined server side setup for storing saved games, etc. Probably PHP or Python. Google App Engine is a strong contender at this point but it has not been properly looked into.

(*) indicates that the technology is not yet implemented

Dependencies:
-------------

JQuery (this is currently used for convenience but is used in only a few areas and may not be required in future)
