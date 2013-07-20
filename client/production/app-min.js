!function(a){function extend(b){var c={};if(b)for(var d in b)c[d]={value:b[d],writable:!0,configurable:!0,enumerable:!0};return a.create(this,c)}function create(a){for(var b=this.extend(a),c=[],d=1;d<arguments.length;d++)c.push(arguments[d]);return"function"==typeof b.init&&b.init.apply(b,c),b}function b(b){if(void 0!==a.prototype[b.name])throw"The method "+b.name+"already exists in Object.prototype";a.defineProperty(a.prototype,b.name,{value:b})}b(extend),b(create)}(Object);var E={};E.game=function(){"use strict";var a={mode:"pause"};return a.loadCampaign=function(b,c){$.ajax({url:"/campaigns/"+b+".json",type:"get",success:function(b){a.campaign=b,a.campaign.current=0,a.campaign.getCurrentLevel=function(){return a.campaign.levels[a.campaign.current]},"function"==typeof c&&c()},error:function(a,b){console.log("campaign loading error: "),console.log(b)}})},a.init=function(b){return E.graphics.init("fullscreen",""),E.map.load(b,a.start),this},a.start=function(){a.resume()},a.resume=function(){a.mode="play",E.input.start("play"),E.timer.start(60),a.animationFrame=window.requestAnimationFrame(a.play)},a.play=function(){return"play"===a.mode||"over"===a.mode?(E.timer.process(),E.entities.process(),E.map.position(player),"over"===a.mode&&E.graphics.writeText("Game over!",20,30),a.info(),E.graphics.render(),E.input.process(),player.health<=0&&"play"===a.mode&&a.over(),a.animationFrame=window.requestAnimationFrame(a.play)):"pause"===a.mode?E.graphics.renderText():"levelComplete"===a.mode&&a.levelComplete(),this},a.info=function(){return E.graphics.writeText("FPS: "+Math.round(E.timer.FPS),E.graphics.gameCanvas.width-150,30),E.graphics.writeText("map.offset.x: "+E.map.offset.x,E.graphics.gameCanvas.width-150,50),E.graphics.writeText("map.offset.y: "+E.map.offset.y,E.graphics.gameCanvas.width-150,70),E.graphics.writeText("player.x: "+player.x,E.graphics.gameCanvas.width-150,90),E.graphics.writeText("player.y: "+player.y,E.graphics.gameCanvas.width-150,110),E.graphics.writeText("player.direction.x: "+player.direction.x,E.graphics.gameCanvas.width-150,130),E.graphics.writeText("player.direction.y: "+player.direction.y,E.graphics.gameCanvas.width-150,150),E.graphics.writeText("player.direction angle: "+E.vector.angle(player.direction),E.graphics.gameCanvas.width-200,170),E.graphics.writeText("tile index: "+E.map.getTileIndex(player),E.graphics.gameCanvas.width-150,190),this},a.pause=function(b){return b=b||"Game paused. Press space to resume.",a.mode="pause",E.input.start("pause"),E.graphics.writeText(b,20,30),E.graphics.renderText(),this},a.over=function(){return a.mode="over",E.input.start("over"),this},a.levelComplete=function(){a.campaign.current<a.campaign.levels.length-1?(a.campaign.current++,a.pause(),a.reset()):a.end("You have completed the campaign!")},a.reset=function(){return E.entities.instances=[],cancelAnimationFrame(a.animationFrame),a.init(a.campaign.getCurrentLevel()),this},a.end=function(b){return b=b||"The game has ended",a.pause(b),E.input.stop(),this},$(function(){a.loadCampaign("campaign",function(){a.init(a.campaign.getCurrentLevel())})}),a}(),E.map=function(){"use strict";var a={offset:{x:0,y:0}};return a.init=function(b){a.actors=[],$.extend(!0,a,b),E.tiles.init("",a.tileWidth,a.tileHeight),a.pathGrid=[];for(var c=0,d=0;d<a.rows;d++){a.pathGrid.push([]);for(var e=0;e<a.columns;e++)a.pathGrid[d].push(!a.getTileObj(a.data[c]).passable),c++}for(c=0;c<a.actors.length;c++)E.actors.create(a.actors[c]);return a.playerStart&&(window.player=E.playerPrototype.create(a.playerStart)),E.graphics.clipping||E.graphics.resizeCanvas("game",a.tileWidth*a.columns,a.tileHeight*a.rows),this},a.load=function(b,c){function d(b){a.init(b),"function"==typeof c&&c()}return"object"==typeof b?d(b):$.ajax({url:"/maps/"+b+".json",type:"get",success:function(a){d(a)},error:function(a,b){console.log("map loading error: "),console.log(b)}}),this},a.newMap=function(a,b,c){for(var d={name:a,columns:b,rows:c,tileWidth:64,tileHeight:64,width:64*b,height:64*c,data:[],actors:[]},e=0,f=b*c;f>e;e++)d.data[e]=0;return d},a.save=function(){return delete a.updated,$.ajax({url:"/maps/"+a.name+".json",type:"post",data:{data:JSON.stringify(a)},success:function(){console.log("map saved")}}),this},a.render=function(){for(var b=Math.floor,c=Math.ceil,d=b(-a.offset.y/E.tiles.tileHeight),e=c((E.graphics.gameCanvas.height-a.offset.y)/E.tiles.tileHeight),f=b(-a.offset.x/E.tiles.tileWidth),g=c((E.graphics.gameCanvas.width-a.offset.x)/E.tiles.tileWidth),h=d;e>h;h++)for(var i=f;g>i;i++){var j=a.offset.x+i*E.tiles.tileWidth,k=a.offset.y+h*E.tiles.tileHeight;E.tiles.renderTile(a.data[h*a.columns+i],j,k)}return this},a.checkWithinBounds=function(b){return b.x<0||b.x>a.width||b.y<0||b.y>a.height?!1:!0},a.getTileObj=function(b){var c=a.data[b];return void 0===c?!1:E.tiles.tileset[c]},a.isPassable=function(b){return a.getTileObj(b).passable},a.collisionAdjust=function(b,c){function d(b,c){var d=E.vector.round(E.vector.add(b,c)),e=a.getTileIndex(d);return!a.isPassable(e)}function e(a,b){var c=[],e={topLeft:{x:a.x-a.halfWidth,y:a.y-a.halfHeight},topRight:{x:a.x+a.halfWidth,y:a.y-a.halfHeight},bottomRight:{x:a.x+a.halfWidth,y:a.y+a.halfHeight},bottomLeft:{x:a.x-a.halfWidth,y:a.y+a.halfHeight}};for(var f in e)d(e[f],b)&&c.push(f);return c}function f(a,b,c){var d=Math.sqrt(c.halfWidth*c.halfWidth+c.halfHeight*c.halfHeight),e={topLeft:{x:-1,y:-1},topRight:{x:1,y:-1},bottomRight:{x:1,y:1},bottomLeft:{x:-1,y:1}},f=e[b],g=E.vector.subtract(f,{x:0,y:0});return E.vector.setLength(g,E.vector.mag(g)*d/2)}var g,h,i=E.vector.mag(c),j=[c];c.x&&j.push(E.vector.setLength({x:c.x,y:0},i)),c.y&&j.push(E.vector.setLength({x:0,y:c.y},i)),j.push({x:0,y:0});for(var k=0;k<j.length;k++){if(h=j[k],g=e(b,h),0===g.length)return h;if(1===g.length)return f(h,g[0],b)}},a.position=function(b){return a.offset={x:Math.round(E.graphics.gameCanvas.width/2)-b.x,y:Math.round(E.graphics.gameCanvas.height/2)-b.y},a.offset.x>0&&(a.offset.x=0),a.offset.y>0&&(a.offset.y=0),a.offset.x<E.graphics.gameCanvas.width-a.columns*E.tiles.tileWidth&&(a.offset.x=E.graphics.gameCanvas.width-a.columns*E.tiles.tileWidth),a.offset.y<E.graphics.gameCanvas.height-a.rows*E.tiles.tileHeight&&(a.offset.y=E.graphics.gameCanvas.height-a.rows*E.tiles.tileHeight),this},a.getTileIndex=function(b){if(a.checkWithinBounds(b)){var c=Math.floor(b.x/E.tiles.tileWidth),d=Math.floor(b.y/E.tiles.tileHeight);return d*a.columns+c}return void 0},a.getTileCentre=function(b){"[object Array]"===Object.prototype.toString.call(b)&&(b=a.getTileFromCoords(b));var c=b%a.columns,d=Math.floor(b/a.columns);return{x:c*E.tiles.tileWidth+E.tiles.tileWidth/2,y:d*E.tiles.tileHeight+E.tiles.tileHeight/2}},a.getTileCoords=function(b){return"[object Array]"===Object.prototype.toString.call(b)&&(b=b[0]+b[1]*a.columns),[b%a.columns,Math.floor(b/a.rows)]},a.getTileFromCoords=function(b,c){return"[object Array]"===Object.prototype.toString.call(b)&&(c=b[1],b=b[0]),c*a.columns+b},a.lineTraversable=function(b,c){for(var d,e=E.vector.subtract(b,c),f=E.vector.mag(e),g=E.vector.normalise(e),h=E.vector.clone(b),i=a.getTileIndex(c),j=0;f>j;j++){if(h=E.vector.add(h,g),d=a.getTileIndex(h),d===i)return!0;if(!a.getTileObj(d).passable)return!1}return!0},a.highlightTile=function(b){if(E.graphics.gameCanvas){var c=a.getTileCentre(b);E.graphics.vectors.command(function(){E.graphics.gameContext.strokeStyle="white",E.graphics.gameContext.strokeRect(Math.round(c.x-E.tiles.tileWidth/2)+.5,Math.round(c.y-E.tiles.tileHeight/2)+.5,E.tiles.tileWidth,E.tiles.tileHeight)})}return this},a.highlightMouseTile=function(){return a.highlightTile(a.getTileIndex(E.input.mouseState)),this},a}(),E.entities=function(){"use strict";var a={};return a.instances=[],a.process=function(){for(var b=[],c=0;c<a.instances.length;c++)a.instances[c].process(),a.instances[c].remove||b.push(a.instances[c]);return a.instances=b,this},a.render=function(){for(var b=0;b<a.instances.length;b++)a.instances[b].render();return this},a}(),E.entityPrototype=function(){"use strict";var a={}.extend({hittable:!1,init:function(){if(void 0===a)var a=0;return function(b){return $.extend(this,b),this.entityId=a++,this.halfWidth=this.width/2,this.halfHeight=this.height/2,E.entities.instances.push(this),this}}(),process:function(){return this}});return a}(),E.actorPrototype=function(){"use strict";var a=E.entityPrototype.extend();return a.entityType="actor",a.hittable=!0,a.health=100,a.weapon="gun",a.move=function(a){var b,c=E.vector,d=!1;return a=c.setLength(a,this.speed*E.timer.coeff),a=E.map.collisionAdjust(this,a),b=E.vector.round(c.add(this,a)),this.direction=c.mag(a)?c.normalise(a):this.direction,this.x===b.x&&this.y===b.y&&(d=!0),this.x=b.x,this.y=b.y,!d},a.moveTowards=function(a){var b=E.vector.subtract(this,a);return b=E.vector.setLength(b,this.speed),this.move(b),this},a.moveTo=function(a){var b=E.map,c=b.getTileCoords(b.getTileIndex(this)),d=b.getTileCoords(b.getTileIndex(a)),e=aStar(b.pathGrid,c,d,"Euclidean");return e.length>1?this.moveTowards(b.getTileCentre(e[1])):1===e.length&&this.moveTowards(b.getTileCentre(e[0])),this},a.hit=function(a){return this.invulnerable||(this.health-=a.damage,this.health<=0&&(this.remove=!0)),"function"==typeof this.hitHandler&&this.hitHandler(a),this},a.fire=function(a){var b,c=E.weapons[this.weapon],d=c.projectileSpeed,e=E.vector.subtract(this,a),f=E.vector.setLength(e,d),g=this;return(void 0===this.lastFired||this.lastFired<E.timer.time-c.reloadTime)&&(b=E.projectilePrototype.create({x:this.x,y:this.y,width:4,height:4,colour:"yellow",speed:f,firerId:g.entityId,damage:c.damage}),this.lastFired=E.timer.time),this.direction=E.vector.normalise(e),this},a.render=function(){return E.graphics.gameContext.save(),E.graphics.gameContext.translate(E.map.offset.x,E.map.offset.y),E.graphics.gameContext.translate(this.x,this.y),E.graphics.gameContext.rotate(-E.vector.angle(this.direction,{x:0,y:-1},!0)),E.graphics.gameContext.beginPath(),E.graphics.gameContext.moveTo(-this.halfWidth,this.halfHeight),E.graphics.gameContext.lineTo(0,-this.halfHeight),E.graphics.gameContext.lineTo(this.halfWidth,this.halfHeight),E.graphics.gameContext.fillStyle=this.colour,E.graphics.gameContext.fill(),E.graphics.gameContext.restore(),E.graphics.writeText(this.health,this.x-this.halfWidth+E.map.offset.x,this.y+E.map.offset.y),this},a}(),E.baddyPrototype=function(){"use strict";var a=E.actorPrototype.extend();return a.target={x:0,y:0},a.process=function(){return player.health<=0?this.mode="watch":this.baddySeePlayer()&&(this.setTarget(player),this.fire(player),this.mode=this.targetDistance>this.idealRange?"chase":"attack"),this.processOrders(),this},a.processOrders=function(){return this.orders[this.mode].call(this),this},a.orders={},a.orders.watch=function(){return a},a.orders.attack=function(){return this.direction=E.vector.subtract(this,this.target),player.health>0&&!this.baddySeePlayer()&&(this.mode="chase"),a},a.orders.chase=function(){var b=E.vector.distance(this,this.target);return b<this.speed?(this.x=this.target.x,this.y=this.target.y,this.mode="search",this.direction=this.target.direction):this.moveTo(this.target),a},a.orders.search=function(){var b=E.vector.setLength(this.direction,this.speed);return this.move(b)||(this.mode="returnToStation"),a},a.orders.returnToStation=function(){var b=E.vector.distance(this,this.initial);return b<this.speed?(this.x=this.initial.x,this.y=this.initial.y,this.mode="watch",this.direction=this.initial.direction):this.moveTo(this.initial),a},a.hitHandler=function(a){return this.direction=E.vector.reverse(a.speed),this},a.baddySeePlayer=function(){var a=E.vector.subtract(this,player);return E.vector.mag(a)>this.maxRange||E.vector.dot(this.direction,a)<0?!1:E.map.lineTraversable(this,player)},a.setTarget=function(a){return this.targetTile=E.map.getTileIndex(a),this.target=$.extend({},a,E.map.getTileCentre(this.targetTile)),this.target.direction=E.vector.clone(a.direction),this},a}(),E.actors=function(){"use strict";return{create:function(a){var b=this[a.type];return $.extend(b,a),b.initial=$.extend({},b),E[b.prototype].create(b)},player:{prototype:"actorPrototype",width:32,height:32,colour:"green",speed:5,direction:{x:1,y:0},invulnerable:!1},baddy:{prototype:"baddyPrototype",width:32,height:32,colour:"red",maxRange:500,mode:"watch",idealRange:500,speed:5,direction:{x:1,y:0}}}}(),E.graphics=function(){"use strict";var a={};return a.init=function(b,c,d){return $("#gameContainer").html(""),a.viewport={width:$("#gameContainer").width(),height:$("#gameContainer").height()},"fullscreen"===b&&(a.fullscreen=!0,b=a.viewport.width,c=a.viewport.height),a.initCanvas("game",b,c),a.clipping=void 0===d?!0:d,this},a.initCanvas=function(b,c,d){return c||(c=800),d||(d=600),$("#gameContainer").append('<canvas id="'+b+'Canvas" class="defaultBorder" width="'+c+'px" height="'+d+'px">Your broswer does not support the "canvas element". To play this game you will need a more modern browser.</canvas>'),$("#"+b+"Canvas").css({width:+c+"px",height:d+"px"}),a[b+"Canvas"]=document.getElementById(b+"Canvas"),a[b+"Context"]=a.gameCanvas.getContext("2d"),a[b+"Canvas"].width=c,a[b+"Canvas"].height=d,this},a.textQueue=[],a.writeText=function(b,c,d){return a.textQueue.push({string:b,x:c,y:d}),this},a.writeTextNow=function(b,c,d){var e=a.gameContext.fillStyle,f=a.gameContext.strokeStyle,g=a.gameContext.font;return a.gameContext.fillStyle="white",a.gameContext.strokeStyle="black",a.gameContext.font="12pt Arial",a.gameContext.strokeText(b,c,d),a.gameContext.fillText(b,c,d),a.gameContext.fillStyle=e,a.gameContext.strokeStyle=f,a.gameContext.font=g,this},a.renderText=function(){return a.textQueue.forEach(function(b){a.writeTextNow(b.string,b.x,b.y)}),a.textQueue=[],this},a.vectors={commands:[],render:function(){for(var a=0;a<this.commands.length;a++)this.commands[a]();return this.commands=[],this},command:function(a){return this.commands.push(a),this}},a.render=function(){return a.clipping?a.gameContext.clearRect(-E.map.offset.x,-E.map.offset.y,a.gameCanvas.width,a.gameCanvas.height):a.gameContext.clearRect(-E.map.offset.x,-E.map.offset.y,a.viewport.width,a.viewport.height),E.map.render(),E.entities.render(),a.vectors.render(),a.renderText(),this},a.resizeCanvas=function(b,c,d){return a[b+"Canvas"].width=c,a[b+"Canvas"].height=d,$("#"+b+"Canvas").css({width:+c+"px",height:d+"px"}),this},a}(),E.input=function(){"use strict";var a={};return a.keyMap={80:"pause",27:"quit",65:"left",87:"up",68:"right",83:"down",73:"invulnerable"},a.start=function(b){switch($(document).off(),b){case"play":a.keyState={pause:0,quit:0,left:0,up:0,right:0,down:0},$(document).on("keydown keyup",function(b){var c=""+b.which;return void 0!==a.keyMap[c]?("invulnerable"===a.keyMap[c]&&"keydown"===b.type&&(player.invulnerable=!player.invulnerable),a.keyState[a.keyMap[c]]="keydown"===b.type?1:0,!1):void 0}),a.mouseState={left:0,middle:0,right:0,x:0,y:0},$(document).on("mousedown mouseup",function(b){switch(b.which){case 1:a.mouseState.left="mousedown"===b.type?1:0;break;case 2:a.mouseState.middle="mousedown"===b.type?1:0;break;case 3:a.mouseState.right="mousedown"===b.type?1:0}}),$(document).on("mousemove",function(b){var c=$("#gameCanvas").offset();a.mouseState.x=b.pageX-c.left,a.mouseState.y=b.pageY-c.top});break;case"pause":$(document).off(),$(document).on("keydown",function(a){return 32===a.which&&E.game.resume(),!1});break;case"over":$(document).off(),$(document).on("keydown",function(a){return 32===a.which&&E.game.reset(),!1});break;case"edit":a.mouseState={left:0,middle:0,right:0,x:0,y:0},$(document).on("mousemove",function(b){var c=$("#gameCanvas").offset();a.mouseState.x=b.pageX-c.left,a.mouseState.y=b.pageY-c.top,E.game.update=!0})}return this},a.process=function(){switch(E.game.mode){case"play":a.keyState.pause&&E.game.pause(),a.keyState.quit&&E.game.end("Game ended.");var b=0,c=0;a.keyState.left&&(b+=-5),a.keyState.up&&(c+=-5),a.keyState.right&&(b+=5),a.keyState.down&&(c+=5),(0!==b||0!==c)&&player.move({x:b,y:c}),a.mouseState.left&&player.fire({x:a.mouseState.x-E.map.offset.x,y:a.mouseState.y-E.map.offset.y});break;case"edit":}return this},a.stop=function(){return $(document).off(),this},a}();var aStar=function(){function a(a,b,c,d,e,f,g,h,i,j,k,l,m){return a&&(c&&!i[e][g]&&(l[m++]={x:g,y:e}),d&&!i[e][h]&&(l[m++]={x:h,y:e})),b&&(c&&!i[f][g]&&(l[m++]={x:g,y:f}),d&&!i[f][h]&&(l[m++]={x:h,y:f})),l}function b(a,b,c,d,e,f,g,h,i,j,k,l,m){return a=e>-1,b=j>f,c=k>g,d=h>-1,c&&(a&&!i[e][g]&&(l[m++]={x:g,y:e}),b&&!i[f][g]&&(l[m++]={x:g,y:f})),d&&(a&&!i[e][h]&&(l[m++]={x:h,y:e}),b&&!i[f][h]&&(l[m++]={x:h,y:f})),l}function c(a,b,c,d,e,f,g,h,i,j,k,l){return l}function d(a,b,c,d,e,f){var g=c-1,h=c+1,i=b+1,j=b-1,k=g>-1&&!d[g][b],l=e>h&&!d[h][b],m=f>i&&!d[c][i],n=j>-1&&!d[c][j],o=[],p=0;return k&&(o[p++]={x:b,y:g}),m&&(o[p++]={x:i,y:c}),l&&(o[p++]={x:b,y:h}),n&&(o[p++]={x:j,y:c}),a(k,l,m,n,g,h,i,j,d,e,f,o,p)}function e(a,b,c,d){return d(c(a.x-b.x),c(a.y-b.y))}function f(a,b,c,d){var e=a.x-b.x,f=a.y-b.y;return d(e*e+f*f)}function g(a,b,c){return c(a.x-b.x)+c(a.y-b.y)}function h(h,i,j,k){var l,m,n,o,p,q,r,s,t,u=h[0].length,v=h.length,w=u*v,x=Math.abs,y=Math.max,z={},A=[],B=[{x:i[0],y:i[1],f:0,g:0,v:i[0]+i[1]*u}],C=1;switch(j={x:j[0],y:j[1],v:j[0]+j[1]*u},k){case"Diagonal":n=a;case"DiagonalFree":m=e;break;case"Euclidean":n=a;case"EuclideanFree":y=Math.sqrt,m=f;break;default:m=g,n=c}n||(n=b);do{for(q=w,r=0,o=0;C>o;++o)(k=B[o].f)<q&&(q=k,r=o);if(s=B.splice(r,1)[0],s.v!=j.v)for(--C,t=d(n,s.x,s.y,h,v,u),o=0,p=t.length;p>o;++o)(l=t[o]).p=s,l.f=l.g=0,l.v=l.x+l.y*u,l.v in z||(l.f=(l.g=s.g+m(l,s,x,y))+m(l,j,x,y),B[C++]=l,z[l.v]=1);else{o=C=0;do A[o++]=[s.x,s.y];while(s=s.p);A.reverse()}}while(C);return A}return h}();E.playerPrototype=function(){"use strict";return E.actorPrototype.extend({width:32,height:32,colour:"green",speed:5,direction:{x:1,y:0},invulnerable:!0,process:function(){var a=E.map.getTileIndex(this);return E.map.getTileObj(a).exit&&(E.game.mode="levelComplete"),this}})}(),window.requestAnimationFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(a){window.setTimeout(a,1e3/60)}}(),E.projectilePrototype=function(){"use strict";var a=E.entityPrototype.extend();return a.entityType="projectile",a.process=function(){return this.move(),this},a.move=function(){var a,b=this;return this.x+=this.speed.x*E.timer.coeff,this.y+=this.speed.y*E.timer.coeff,a=E.map.getTileIndex(this),E.map.getTileObj(a).passable||(this.remove=!0),E.entities.instances.forEach(function(a){"projectile"!==a.entityType&&a.entityId!==b.firerId&&a.x-a.halfWidth<b.x&&a.x+a.halfWidth>b.x&&a.y-a.halfHeight<b.y&&a.y+a.halfHeight>b.y&&(b.remove=!0,"function"==typeof a.hit&&a.hit(b))}),this},a.render=function(){var a=E.map.offset.x+this.x,b=E.map.offset.y+this.y;return E.graphics.gameContext.beginPath(),E.graphics.gameContext.arc(a,b,this.halfWidth,0,2*Math.PI),E.graphics.gameContext.fillStyle="yellow",E.graphics.gameContext.fill(),this},a}(),E.tiles=function(){"use strict";var a={};return a.init=function(b,c,d){return a.tileWidth=c,a.tileHeight=d,a.tileset=[{colour:"black",passable:!0},{colour:"blue",passable:!1},{colour:"yellow",passable:!0,exit:!0}],this},a.renderTile=function(b,c,d){return E.graphics.gameContext.fillStyle=a.tileset[b].colour,E.graphics.gameContext.fillRect(c,d,a.tileWidth,a.tileHeight),this},a}(),E.timer=function(){"use strict";var a={};return a.start=function(b){return a.interval=1e3/b,a.time=(new Date).getTime(),a.goalFPS=b,a.FPS=b,a.coeff=1,this},a.process=function(){var b=(new Date).getTime();return a.interval=b-a.time,a.time=b,a.FPS=1e3/a.interval,a.coeff=a.goalFPS/a.FPS,this},a}(),E.util=function(){"use strict";return{valFromString:function(a){for(var b=window,c=a.split("."),d=0;d<c.length;d++)b=b[c[d]];return b}}}(),E.vector=function(){"use strict";var a={};return a.round=function(a){return{x:Math.round(a.x),y:Math.round(a.y)}},a.add=function(a,b){return{x:a.x+b.x,y:a.y+b.y}},a.clone=function(b){return a.add(b,{x:0,y:0})},a.subtract=function(a,b){return{x:b.x-a.x,y:b.y-a.y}},a.reverse=function(b){return a.subtract(b,{x:0,y:0})},a.mag=function(a){return Math.sqrt(a.x*a.x+a.y*a.y)},a.distance=function(b,c){return a.mag(a.subtract(b,c))},a.normalise=function(b){var c=a.mag(b)||1;return{x:b.x/c,y:b.y/c}},a.setLength=function(b,c){return b=a.normalise(b),{x:b.x*c,y:b.y*c}},a.dot=function(a,b){return a.x*b.x+a.y*b.y},a.angle=function(b,c,d){if(void 0===c&&(c={x:0,y:-1}),b=a.normalise(b),c=a.normalise(c),d){var e=Math.atan2(b.y,b.x),f=Math.atan2(c.y,c.x);return f-e}return Math.acos(a.dot(b,c))},a}(),E.weapons=function(){"use strict";return{gun:{projectileSpeed:10,damage:10,reloadTime:100}}}();
/*
//@ sourceMappingURL=/production/sourceMap.js
*/