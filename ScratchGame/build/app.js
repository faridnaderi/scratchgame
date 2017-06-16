"use strict";!function(){function e(e,d){function u(){P=[],X=[],x=[0,0,0,0,0,0,0,0,0],b=!1,v=PIXI.RenderTexture.create(t.screen.width,t.screen.height),w=new PIXI.Sprite(v),i.interactive=!0,i.removeChildren(),s(),l(),i.addChild(y),i.addChild(m),i.addChild(w),h(),i.addChild(g);for(var e in r)r[e].style.backgroundImage="";o.className=""}function s(){(y=new PIXI.Sprite(d.forground.texture)).width=t.screen.width,y.height=t.screen.height}function l(){(m=new PIXI.Graphics).beginFill(6699034),m.drawRect(0,0,t.screen.width,t.screen.height),m.endFill(),m.mask=w}function h(){for(var e=100,t=50,r=0;r<3;r++)for(var o=0;o<3;o++)!function(r,o){function a(){return n[Math.floor(Math.random()*(n.length-1))]}i.addChild(function(){var n=new PIXI.Sprite(d["coin_"+a()].texture);return n.position.set(t+o*(e+t),t+r*(e+t)),n.width=e,n.height=e,n.mask=w,P.push(n),n}()),i.addChild(function(){var n=new PIXI.Graphics;return n.beginFill(0,0),n.drawRect(0,0,200,200),n.endFill(),n.position.set(1.25*t+o*(e+t),2*t+r*(e+t)),n.width=e/1.5,n.height=e/1.5,n.interactive=!0,X.push(n),n.on("pointerover",function(){var e=3*r+o;b&&!x[e]&&p(e)}),n}())}(r,o)}function f(e,n){x[e]=parseInt(n)}function p(e){function t(e){var t=[];if(c.map(function(i,r){i>=e&&t.push(n[r])}),t.length)if(t.sort(function(e,n){return n-e}),2===e){var i=0===d.indexOf(t[0])?1:0;d=[t[0],t[0],d[i]]}else d=[t[0],t[0],t[0]]}var c=[],d=[];f(e,P[e].texture.baseTexture.imageUrl.replace("images/coins/","").replace(".png","")),function(){x.map(function(e){var t=n.indexOf(e);-1!==t&&(c[t]||(c[t]=0),c[t]++)})}(),function(){c.map(function(e,t){d.push(n[t])}),d.sort(function(e,n){return n-e})}(),t(2),t(3),function(){d.slice(0,3).map(function(e,n){r[n].style.backgroundImage="url(images/coins/"+e+".png)"})}(),function(){-1===x.indexOf(0)&&(i.interactive=!1,o.className+=" show-overlay",d[0]===d[1]&&d[1]===d[2]?(o.className+=" winner",a.innerHTML=d[0]):o.className+=" loser")}()}var g=new PIXI.Sprite(d.cursor.texture),I=[new PIXI.Sprite(d.scratch_brush_1.texture),new PIXI.Sprite(d.scratch_brush_2.texture),new PIXI.Sprite(d.scratch_brush_3.texture)],m=void 0,v=void 0,w=void 0,y=void 0,P=void 0,X=void 0,x=void 0,b=!1;u(),function(){i.interactive=!0,i.on("pointerdown",function(e){b=!0}),i.on("pointerup",function(){return b=!1}),i.on("pointermove",function(e){var n=e.data.global;if(g.position.copy(n),b){n.x-=50,n.y-=50;var i=I[Math.floor(Math.random()*(I.length-1))];i.position.copy(n),t.renderer.render(i,v,!1,null,!1)}})}(),c.addEventListener("click",u)}var n=[5,10,20,50,100,500,1e3,5e3,1e4,25e3,5e4],t=new PIXI.Application(500,500),i=t.stage,r=[document.getElementById("slot1"),document.getElementById("slot2"),document.getElementById("slot3")],o=document.getElementById("body"),a=document.getElementById("winner_coins"),c=document.getElementById("reset_button");!function(){document.getElementById("canvas-container").appendChild(t.view),t.view.style.marginTop=-t.view.offsetHeight/2-100+"px",t.view.style.marginLeft=-t.view.offsetHeight/2+"px"}(),function(){n.map(function(e){return PIXI.loader.add("coin_"+e,"images/coins/"+e+".png")}),PIXI.loader.add("forground","images/forground.jpg"),PIXI.loader.add("cursor","images/handicon.png");for(var e=1;e<=3;e++)PIXI.loader.add("scratch_brush_"+e,"images/scratchmask"+e+".png")}(),PIXI.loader.load(e)}();