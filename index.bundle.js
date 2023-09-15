(()=>{"use strict";var t,i={947:(t,i,e)=>{e.d(i,{Z:()=>r});var n=e(537),o=e.n(n),a=e(645),s=e.n(a)()(o());s.push([t.id,".game-canvas {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n}","",{version:3,sources:["webpack://./src/App.module.css"],names:[],mappings:"AAAA;EACE,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,MAAM;EACN,OAAO;AACT",sourcesContent:[".game-canvas {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n}"],sourceRoot:""}]),s.locals={"game-canvas":"game-canvas"};const r=s},488:(t,i,e)=>{e.d(i,{Z:()=>r});var n=e(537),o=e.n(n),a=e(645),s=e.n(a)()(o());s.push([t.id,".ui-controller {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n}","",{version:3,sources:["webpack://./src/react-ui/UIController.module.css"],names:[],mappings:"AAAA;EACE,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,MAAM;EACN,OAAO;AACT",sourcesContent:[".ui-controller {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n}"],sourceRoot:""}]),s.locals={"ui-controller":"ui-controller"};const r=s},460:(t,i,e)=>{e.d(i,{Z:()=>r});var n=e(537),o=e.n(n),a=e(645),s=e.n(a)()(o());s.push([t.id,".dialog {\n  position: absolute;\n  top: 45%;\n  left: 50%;\n  transform: translateX(-25%);\n  z-index: 5;\n  background-color: rgba(0, 0, 0, 0.5);\n  align-items: center;\n  color: white;\n  display: flex;\n  flex-direction: row;\n}\n\n@keyframes text {\n  from {\n    width: 0%;\n  }\n  to {\n    width: 100%;\n  }\n}\n\n@keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n\n.dialog-key {\n  width: 50px;\n  height: 50px;\n  text-align: center;\n  font-weight: bold;\n  font-size: 40px;\n  border: 3px gold solid;\n}\n\n.dialog-content {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  padding: 10px;\n  font-size: 25px;\n  font-family: pixel-font, sans-serif;\n}\n\n.dialog-animation-text {\n  animation-name: text;\n  animation-duration: 1s;\n  animation-timing-function: linear;\n}\n\n.dialog-animation-fade {\n  animation-name: fadeIn;\n  animation-duration: 200ms;\n  animation-timing-function: linear;\n}\n","",{version:3,sources:["webpack://./src/react-ui/components/Dialog.module.css"],names:[],mappings:"AAAA;EACE,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,2BAA2B;EAC3B,UAAU;EACV,oCAAoC;EACpC,mBAAmB;EACnB,YAAY;EACZ,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE;IACE,SAAS;EACX;EACA;IACE,WAAW;EACb;AACF;;AAEA;EACE;IACE,UAAU;EACZ;EACA;IACE,UAAU;EACZ;AACF;;AAEA;EACE,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,iBAAiB;EACjB,eAAe;EACf,sBAAsB;AACxB;;AAEA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,mBAAmB;EACnB,aAAa;EACb,eAAe;EACf,mCAAmC;AACrC;;AAEA;EACE,oBAAoB;EACpB,sBAAsB;EACtB,iCAAiC;AACnC;;AAEA;EACE,sBAAsB;EACtB,yBAAyB;EACzB,iCAAiC;AACnC",sourcesContent:[".dialog {\n  position: absolute;\n  top: 45%;\n  left: 50%;\n  transform: translateX(-25%);\n  z-index: 5;\n  background-color: rgba(0, 0, 0, 0.5);\n  align-items: center;\n  color: white;\n  display: flex;\n  flex-direction: row;\n}\n\n@keyframes text {\n  from {\n    width: 0%;\n  }\n  to {\n    width: 100%;\n  }\n}\n\n@keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n\n.dialog-key {\n  width: 50px;\n  height: 50px;\n  text-align: center;\n  font-weight: bold;\n  font-size: 40px;\n  border: 3px gold solid;\n}\n\n.dialog-content {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  padding: 10px;\n  font-size: 25px;\n  font-family: pixel-font, sans-serif;\n}\n\n.dialog-animation-text {\n  animation-name: text;\n  animation-duration: 1s;\n  animation-timing-function: linear;\n}\n\n.dialog-animation-fade {\n  animation-name: fadeIn;\n  animation-duration: 200ms;\n  animation-timing-function: linear;\n}\n"],sourceRoot:""}]),s.locals={dialog:"dialog","dialog-key":"dialog-key","dialog-content":"dialog-content","dialog-animation-text":"dialog-animation-text",text:"text","dialog-animation-fade":"dialog-animation-fade",fadeIn:"fadeIn"};const r=s},354:(t,i,e)=>{var n=e(784),o=e(29),a=e(379),s=e.n(a),r=e(795),h=e.n(r),l=e(569),c=e.n(l),d=e(565),p=e.n(d),u=e(216),m=e.n(u),f=e(589),y=e.n(f),w=e(947),g={};g.styleTagTransform=y(),g.setAttributes=p(),g.insert=c().bind(null,"head"),g.domAPI=h(),g.insertStyleElement=m(),s()(w.Z,g),w.Z&&w.Z.locals&&w.Z.locals;var A=e(940),x=e(277);function v({frameSize:t,animationNames:i,assetPath:e,idleAnimationName:n,animationSettings:o,scale:a="1"}){return s=this,r=void 0,l=function*(){const s=i.map(((i,e)=>function(t,i,e){const n={};for(let o=0;o<4;o++)n[`${t}${o}`]={frame:{x:o*e.width,y:i*e.height,w:e.width,h:e.height},sourceSize:{w:e.width,h:e.height}};return n}(i,e,t))),r={frames:Object.assign({},...s),meta:{scale:a},animations:s.reduce(((t,e,n)=>(t[i[n]]=Object.keys(e),t)),{})},h=new A.c2G(A.VL4.from(e),r);yield h.parse();const l=new A.W20;return l.switchAnimation=t=>{l.children.length>0&&l.removeChildAt(0);const i=new A.KgH(h.animations[t]);l.addChild(i),o&&(Object.assign(i,o["*"],o[t]),(null==i?void 0:i.autoPlay)&&i.play())},l.spriteSheet=h,l.play=()=>{var t;return null===(t=l.children[0])||void 0===t?void 0:t.play()},l.nextFrame=()=>{const t=l.children[0];t.currentFrame=t.currentFrame+1>=t.totalFrames?0:t.currentFrame+1},l.prevFrame=()=>{const t=l.children[0];t.currentFrame=t.currentFrame-1<0?t.totalFrames:t.currentFrame-1},l.switchAnimation(n),l},new((h=void 0)||(h=Promise))((function(t,i){function e(t){try{o(l.next(t))}catch(t){i(t)}}function n(t){try{o(l.throw(t))}catch(t){i(t)}}function o(i){var o;i.done?t(i.value):(o=i.value,o instanceof h?o:new h((function(t){t(o)}))).then(e,n)}o((l=l.apply(s,r||[])).next())}));var s,r,h,l}const k=100;var E;!function(t){t[t.floor=0]="floor",t[t.wall=1]="wall",t[t.door=2]="door"}(E||(E={}));class b extends A.W20{constructor(t,i){super(),this.map=t,this.app=i,this.kind="character",this.zIndex=1,this.speed=5}init(){return t=this,i=void 0,n=function*(){this.animation=yield v({frameSize:{width:100,height:120},assetPath:"assets/character-sprite.png",animationNames:["walk-down","walk-up","walk-left","walk-right","idle"],idleAnimationName:"idle",animationSettings:{"*":{animationSpeed:.1666,loop:!0,autoPlay:!0},idle:{autoPlay:!0,animationSpeed:.0666}},scale:"1.4"}),this.addChild(this.animation),this.animation.x=(k-this.width)/2,this.stopWalking(),this.app.ticker.add(this.onTick.bind(this))},new((e=void 0)||(e=Promise))((function(o,a){function s(t){try{h(n.next(t))}catch(t){a(t)}}function r(t){try{h(n.throw(t))}catch(t){a(t)}}function h(t){var i;t.done?o(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(s,r)}h((n=n.apply(t,i||[])).next())}));var t,i,e,n}destroy(){super.destroy(),this.app.ticker.remove(this.onTick.bind(this))}onTick(t){if(this.walkDirection)switch(this.walkDirection){case"up":this.move(0,this.speed*t);break;case"down":this.move(0,-this.speed*t);break;case"left":this.move(this.speed*t,0);break;case"right":this.move(-this.speed*t,0)}}move(t,i){const e={x:this.x+-1*t,y:this.y+-1*i};this.collidesWithWall(e,t,i)?this.stopWalking():(this.x=e.x,this.y=e.y,this.zIndex=Math.round(e.y/k),this.map.container.y+=i,this.map.container.x+=t)}collidesWithWall(t,i,e){const n=Math.floor(this.x/k)!==Math.floor((this.x+this.width)/k),o=Math.floor(this.y/k)!==Math.floor((this.y+this.height)/k),a=[];return e<0||e>0?(a.push({x:Math.floor((t.x+20)/k),y:Math.ceil((t.y-this.height/2)/k)}),n&&a.push({x:Math.floor((t.x+this.width)/k),y:Math.ceil((t.y-this.height/2)/k)})):i>0?(a.push({x:Math.floor((t.x+20)/k),y:Math.ceil((t.y-this.height/2)/k)}),o&&a.push({x:Math.floor((t.x+20)/k),y:Math.ceil((t.y-this.height/2)/k)})):i<0&&(a.push({x:Math.floor((t.x+this.width)/k),y:Math.ceil((t.y-this.height/2)/k)}),o&&a.push({x:Math.floor((t.x+this.width)/k),y:Math.ceil((t.y-this.height/2)/k)})),a.some((i=>{const e=this.map.cells.find((t=>t.x===i.x&&t.y===i.y&&t.solid));return!!e&&(e.kind===E.wall&&(e.properties.wallType.includes("vertical")||e.properties.wallType.includes("right-corner"))&&"vertical-T"!==e.properties.wallType?t.x<e.x*k+10:e.solid)}))}walk(t){this.walkDirection!==t&&(this.stopWalking(),this.walkDirection=t,this.animation.switchAnimation(`walk-${t}`))}stopWalking(){this.walkDirection=void 0,this.animation.switchAnimation("idle")}}function C(t,i){return Math.floor(Math.random()*(i-t+1))+t}var M;function B(t,i,e){const n={top:void 0,bottom:void 0,left:void 0,right:void 0,self:void 0};return e.forEach((e=>{e.kind!==E.wall&&e.kind!==E.door||(e.x===t&&e.y===i&&(n.self=e),e.x===t-1&&e.y===i&&(n.left=e),e.x===t+1&&e.y===i&&(n.right=e),e.x===t&&e.y===i-1&&(n.top=e),e.x===t&&e.y===i+1&&(n.bottom=e))})),n}function T({x:t,y:i},e){var n,o,a,s,r;const h=B(t,i,e),l=null===(o=null===(n=h.top)||void 0===n?void 0:n.properties)||void 0===o?void 0:o.wallType,c=null===(s=null===(a=h.self)||void 0===a?void 0:a.properties)||void 0===s?void 0:s.wallType;return(null===(r=h.self)||void 0===r?void 0:r.kind)===E.door||(null==c?void 0:c.includes("window"))?"floor":h.self?!(null==l?void 0:l.includes("horizontal"))&&"vertical-T"!==l||"horizontal-right-corner-bottom"===l?"floor-shadow-left":"floor-shadow-corner":h.top&&((null==l?void 0:l.includes("horizontal"))||h.top.kind===E.door)?"horizontal-right-corner-top"===l?"floor-shadow-top-left":"floor-shadow-top":"floor"}function S({x:t,y:i},e){var n;const o=B(t,i,e);if(o.left&&o.right){if(o.bottom)return"horizontal-T";if("horizontal-window-left"===(null===(n=o.left.properties)||void 0===n?void 0:n.wallType))return"horizontal-window-right";const t=!!e.find((t=>o.right.x+1===t.x&&o.right.y===t.y&&t.kind===E.wall));return o.right.kind===E.wall&&t&&0===C(0,3)?"horizontal-window-left":"horizontal"}return o.top&&o.bottom?o.right?"vertical-T":"vertical":o.left?o.bottom?"horizontal-right-corner-bottom":o.top?"horizontal-right-corner-top":"horizontal-right":o.right?o.bottom?"horizontal-left-corner-bottom":o.top?"horizontal-left-corner-top":"horizontal-left":o.top?"vertical-bottom":o.bottom?"vertical-top":"pillar"}!function(t){t[t.North=0]="North",t[t.East=1]="East",t[t.South=2]="South",t[t.West=3]="West"}(M||(M={}));function z(t,i){switch(i){case M.North:return t.reduce(((t,i)=>i.y<t.y?i:t));case M.East:return t.reduce(((t,i)=>i.x>t.x?i:t));case M.South:return t.reduce(((t,i)=>i.y>t.y?i:t));case M.West:return t.reduce(((t,i)=>i.x<t.x?i:t))}}function W(t,i){return C(Math.max(t.x+1,i.x+1),Math.min(t.x+t.width-2,i.x+i.width-2))}function P(t,i){return C(Math.max(t.y+1,i.y+1),Math.min(t.y+t.height-2,i.y+i.height-2))}class I{constructor(){this.container=new A.W20,this.entities=[];const{map:t,startCoords:i}=function(){const t=Array.from({length:20}).map((()=>({x:0,y:0,width:C(5,10),height:C(5,10)})));t.slice(1).forEach(((i,e)=>{const n=C(0,3);!function(t,i,e){const n=C(1,2),o=Math.min(t.width,e.width),a=Math.min(t.height,e.height);let s,r;const h=1===C(0,1)?1:-1;switch(i){case M.North:t.y=e.y-t.height-n,t.x=e.x+C(0,o-3)*h,s=W(t,e),t.corridor={from:{x:s,y:t.y+t.height-1},to:{x:s,y:e.y},direction:i};break;case M.East:t.x=e.x+e.width+n,t.y=e.y+C(0,a-3)*h,r=P(t,e),t.corridor={from:{x:t.x,y:r},to:{x:e.x+e.width-1,y:r},direction:i};break;case M.South:t.y=e.y+e.height+n,t.x=e.x+C(0,o-3)*h,s=W(t,e),t.corridor={from:{x:s,y:t.y},to:{x:s,y:e.y+e.height-1},direction:i};break;case M.West:t.x=e.x-t.width-n,t.y=e.y+C(0,a-3)*h,r=P(t,e),t.corridor={from:{x:t.x+t.width-1,y:r},to:{x:e.x,y:r},direction:i}}}(i,n,0===e?t[0]:z(t,n))}));const i=z(t,M.West),e=z(t,M.North),n=i.x,o=e.y,a=[];return t.forEach((t=>{for(let i=0;i<t.height;i++)for(let e=0;e<t.width;e++){const s=0===e||e===t.width-1||0===i||i===t.height-1,r=Math.abs(n-(t.x+e)),h=Math.abs(o-(t.y+i));void 0===a[h]&&(a[h]=[]),a[h][r]=s?1:0}})),t.filter((t=>!!t.corridor)).forEach((t=>{const{from:i,to:e,direction:s}=t.corridor,r=s===M.North||s===M.South?Math.abs(i.y-e.y):Math.abs(i.x-e.x);for(let t=0;t<=r;t++){let e=Math.abs(n-i.x),r=Math.abs(o-i.y);s===M.North?r+=t:s===M.East?e-=t:s===M.South?r-=t:s===M.West&&(e+=t),void 0===a[r]&&(a[r]=[]),a[r][e]=0,s===M.North||s===M.South?(a[r][e-1]=1,a[r][e+1]=1):s!==M.East&&s!==M.West||(void 0===a[r-1]&&(a[r-1]=[]),void 0===a[r+1]&&(a[r+1]=[]),a[r-1][e]=1,a[r+1][e]=1)}if(s===M.North||s===M.South){const t=Math.abs(n-e.x),i=Math.abs(o-e.y);a[i][t]=2}})),{map:a,startCoords:{x:Math.abs(n-(t[0].x+Math.floor(t[0].width/2))),y:Math.abs(o-(t[0].y+Math.floor(t[0].height/2)))}}}();this.rawMap=t,this.startLocation=i}init(){return t=this,i=void 0,n=function*(){this.cells=yield function(t){return i=this,e=void 0,o=function*(){const i=t.reduce(((i,e,n)=>(e.forEach(((e,o)=>{var a;const s=e;i.push({kind:s,x:o,y:n,solid:s===E.wall||s===E.door,damage:0}),s!==E.wall&&s!==E.door||void 0===t[n][o+1]||void 0===(null===(a=t[n-1])||void 0===a?void 0:a[o])||i.push({kind:E.floor,x:o,y:n,solid:!1,damage:0})})),i)),[]);for(let t=0;t<i.length;t++){const n=i[t],o=i.find((t=>t.x===n.x-1&&t.y===n.y&&t.kind===E.wall));switch(n.kind){case E.wall:if(n.properties={wallType:S(n,i)},n.properties.windowType="horizontal-window-left"===(e=n.properties).wallType?"left":"horizontal-window-right"===e.wallType?"right":void 0,"right"===n.properties.windowType?n.damage=o.damage:n.properties.windowType&&(n.damage=C(0,3)),n.properties.wallType.includes("window")){n.asset=yield v({frameSize:{width:100,height:200},assetPath:`assets/walls/${n.properties.wallType}.png`,animationNames:["default"],idleAnimationName:"default",animationSettings:{"*":{animationSpeed:.1666,loop:!1}}});for(let t=n.damage;t>0;t--)n.asset.nextFrame();n.asset.pivot.y=n.asset.height/2}else n.asset=A.jyi.from(`assets/walls/${n.properties.wallType}.png`),n.asset.anchor.y=n.asset.height/2;n.asset.zIndex=n.y;break;case E.floor:n.properties={floorType:T(n,i)},n.asset=A.jyi.from(`assets/floors/${n.properties.floorType}.png`),n.asset.zIndex=-1;break;case E.door:n.asset=yield v({frameSize:{width:100,height:200},assetPath:"assets/door.png",animationNames:["open","close"],idleAnimationName:"open",animationSettings:{"*":{animationSpeed:.1666,loop:!1}}}),n.properties={open:!1,toggle:()=>{const t=n;t.properties.open?t.properties.open&&(t.properties.open=!1,t.solid=!0,t.asset.switchAnimation("close"),t.asset.play()):(t.properties.open=!0,t.solid=!1,t.asset.switchAnimation("open"),t.asset.play())}},n.asset.zIndex=n.y,n.asset.pivot.y=n.asset.height/2}n.asset.x=n.x*k,n.asset.y=n.y*k}var e;return i},new((n=void 0)||(n=Promise))((function(t,a){function s(t){try{h(o.next(t))}catch(t){a(t)}}function r(t){try{h(o.throw(t))}catch(t){a(t)}}function h(i){var e;i.done?t(i.value):(e=i.value,e instanceof n?e:new n((function(t){t(e)}))).then(s,r)}h((o=o.apply(i,e||[])).next())}));var i,e,n,o}(this.rawMap),this.cells.forEach((t=>this.container.addChild(t.asset))),this.container.sortableChildren=!0},new((e=void 0)||(e=Promise))((function(o,a){function s(t){try{h(n.next(t))}catch(t){a(t)}}function r(t){try{h(n.throw(t))}catch(t){a(t)}}function h(t){var i;t.done?o(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(s,r)}h((n=n.apply(t,i||[])).next())}));var t,i,e,n}destroy(){this.container.destroy(),this.entities.forEach((t=>t.destroy()))}addEntity(t){this.entities.push(t),this.container.addChild(t)}getEntities(){return this.entities}getCell(t,i){const e=Math.round(t/k),n=Math.round(i/k);return this.cells.find((t=>t.x===e&&t.y===n))}getCells(t,i,e){return this.cells.filter((n=>n.x>=Math.round((t-e)/k)&&n.x<=Math.round((t+e)/k)&&n.y>=Math.round((i-e)/k)&&n.y<=Math.round((i+e)/k)))}}const N=new class{constructor(){this.eventCounter=0}listen(t){this.listener=t}showDialog(t,i){var e;const n=(this.eventCounter++).toString();null===(e=this.listener)||void 0===e||e.call(this,"new",{id:n,type:"dialog",content:t,options:i});const o=()=>this.closeDialog(n);return(null==i?void 0:i.dismissTimeout)&&setTimeout(o,i.dismissTimeout),o}closeDialog(t){var i;null===(i=this.listener)||void 0===i||i.call(this,"delete",{id:t})}};class D{constructor(t,i,e){this.character=t,this.map=i,this.app=e,this.pressedKeys=new Set,this.checkForInteractions=()=>{var t;const{x:i,y:e}=this.character,n=this.map.getCells(i,e,40),o=n.some((t=>t.kind===E.door)),a=n.some((t=>t.kind===E.wall&&t.damage>0));if(o){if(this.dialogDismiss)return;this.dialogDismiss=N.showDialog({key:"E",message:"Interact"},{animation:"fade"})}else if(a){if(this.dialogDismiss)return;this.dialogDismiss=N.showDialog({key:"E",message:"Repair"},{animation:"fade"})}else null===(t=this.dialogDismiss)||void 0===t||t.call(this),this.dialogDismiss=void 0},window.addEventListener("keydown",this.onKeyDown.bind(this)),window.addEventListener("keyup",this.onKeyUp.bind(this)),this.app.ticker.add(this.onTick.bind(this))}destroy(){this.app.ticker.remove(this.onTick.bind(this))}onTick(){this.checkForInteractions()}checkKeysPressed(){switch(this.pressedKeys.values().next().value){case"e":this.interact();break;case"ArrowUp":this.character.walk("up");break;case"ArrowDown":this.character.walk("down");break;case"ArrowLeft":this.character.walk("left");break;case"ArrowRight":this.character.walk("right");break;default:this.character.stopWalking()}}interact(){const{x:t,y:i}=this.character,e=this.map.getCells(t,i,40),n=e.find((t=>t.kind===E.door)),o=e.find((t=>t.kind===E.wall&&t.damage>0));!n||n.x===Math.round(t/k)&&n.y===Math.round((i+20)/k)&&Math.abs(n.y*k-i)<50?o&&(o.asset.prevFrame(),o.damage--):n.properties.toggle()}onKeyDown(t){(t.key.includes("Arrow")||"e"===t.key)&&(this.pressedKeys.add(t.key),this.checkKeysPressed())}onKeyUp(t){this.pressedKeys.delete(t.key),this.checkKeysPressed()}}function O(t,i,e,n){return Math.sqrt(Math.pow(e-t,2)+Math.pow(n-i,2))}function Z(t,i,e,n){const o=e.getCell(i.x-1,i.y-1),a=[];e.cells.forEach((t=>{a[t.y]||(a[t.y]=[]),void 0===a[t.y][t.x]&&(a[t.y][t.x]=t.solid?-1:0)})),a[t.y][t.x]=2;const s=function t(i,e){const a=i.pop();if(!a||e[a.y][a.x]>n)return!1;const{x:s,y:r}=a,h=e[r][s];if(o.x===s&&o.y===r)return!0;const l=h+1;return l>n||(r-1>=0&&0===e[r-1][s]&&(e[r-1][s]=l,i.push({y:r-1,x:s})),r+1<e.length&&0===e[r+1][s]&&(e[r+1][s]=l,i.push({y:r+1,x:s})),s-1>=0&&0===e[r][s-1]&&(e[r][s-1]=l,i.push({y:r,x:s-1})),s+1<e[r].length&&0===e[r][s+1]&&(e[r][s+1]=l,i.push({y:r,x:s+1}))),t(i,e)}([t],a);if(!s)return[];const r=[];let h=o.x,l=o.y;for(;;)if(r.unshift({x:h,y:l}),h-1>=0&&a[l][h-1]===a[l][h]-1)h--;else if(h+1<a[l].length&&a[l][h+1]===a[l][h]-1)h++;else if(l-1>=0&&a[l-1][h]===a[l][h]-1)l--;else{if(!(l+1<a.length&&a[l+1][h]===a[l][h]-1))break;l++}return r}class F extends A.W20{constructor(t,i,e,n=200,o=50){super(),this.map=t,this.app=i,this.speed=e,this.detectionRange=n,this.hitRange=o,this.kind="enemy",this.app.ticker.add(this.onTick.bind(this))}init(){return t=this,i=void 0,n=function*(){this.animation=yield v({frameSize:{width:100,height:100},assetPath:"assets/enemy-sprite.png",animationNames:["walk-down","walk-up","walk-left","walk-right","idle"],idleAnimationName:"idle",animationSettings:{"*":{animationSpeed:.1666,loop:!0,autoPlay:!0},idle:{autoPlay:!0,animationSpeed:.0666}},scale:"1"}),this.addChild(this.animation),this.animation.x=(k-this.width)/2,this.stopWalking()},new((e=void 0)||(e=Promise))((function(o,a){function s(t){try{h(n.next(t))}catch(t){a(t)}}function r(t){try{h(n.throw(t))}catch(t){a(t)}}function h(t){var i;t.done?o(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(s,r)}h((n=n.apply(t,i||[])).next())}));var t,i,e,n}destroy(){super.destroy(),this.app.ticker.remove(this.onTick.bind(this))}onTick(){var t;(null===(t=this.path)||void 0===t?void 0:t.length)>0&&this.walkOnPath();for(const t of this.map.getEntities()){const i=O(this.x,this.y,t.x,t.y);if("character"===t.kind&&i<this.hitRange);else if("character"===t.kind&&i<this.detectionRange&&i>this.hitRange&&(!this.path||0===this.path.length||this.path[this.path.length-1].x!==Math.round(t.x/k)&&this.path[this.path.length-1].y!==Math.round(t.y/k))){const e=this.map.getCell(this.x-1,this.y-1);return void(this.path=Z(e,t,this.map,i/k+4))}}}walkOnPath(){const t=this.path[0],i=t.x*k,e=t.y*k,n=i-this.x,o=e-this.y,a=O(this.x,this.y,i,e);Math.abs(n)>Math.abs(o)?n>0?this.walk("right"):this.walk("left"):o>0?this.walk("down"):this.walk("up"),a<this.hitRange?(this.x=i,this.y=e,this.path.shift(),this.stopWalking()):(this.x+=n/a*this.speed,this.y+=o/a*this.speed)}walk(t){this.walkDirection!==t&&(this.stopWalking(),this.walkDirection=t,this.animation.switchAnimation(`walk-${t}`))}stopWalking(){this.walkDirection=void 0,this.animation.switchAnimation("idle")}}const j=new A.MxU({width:window.innerWidth,height:window.innerHeight,resizeTo:window,backgroundColor:"#000000"});class K{constructor(){this.map=new I,j.stage.filterArea=j.screen;const t=new x.X({vignetting:1});j.stage.filters=[t];const i=setInterval((()=>{t.vignetting-=.01,t.vignetting<.67&&(clearInterval(i),N.showDialog({message:"Uh.. Where am I?"},{dismissTimeout:2e3,animation:"text"}))}),50)}init(){return t=this,i=void 0,n=function*(){yield this.map.init(),this.character=new b(this.map,j),yield this.character.init(),this.character.x=this.map.startLocation.x*k,this.character.y=this.map.startLocation.y*k,this.map.addEntity(this.character);const t=new F(this.map,j,2,300);yield t.init(),t.x=this.map.startLocation.x*k,t.y=this.map.startLocation.y*k,this.map.addEntity(t);const i=j.view.width/2,e=j.view.height/2;this.map.container.x=i-this.character.x,this.map.container.y=e-this.character.y,j.stage.addChild(this.map.container),this.interactionManager=new D(this.character,this.map,j)},new((e=void 0)||(e=Promise))((function(o,a){function s(t){try{h(n.next(t))}catch(t){a(t)}}function r(t){try{h(n.throw(t))}catch(t){a(t)}}function h(t){var i;t.done?o(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(s,r)}h((n=n.apply(t,i||[])).next())}));var t,i,e,n}destroy(){this.interactionManager.destroy(),this.map.destroy()}}var R=e(488),U={};U.styleTagTransform=y(),U.setAttributes=p(),U.insert=c().bind(null,"head"),U.domAPI=h(),U.insertStyleElement=m(),s()(R.Z,U),R.Z&&R.Z.locals&&R.Z.locals;var L=e(460),Y={};Y.styleTagTransform=y(),Y.setAttributes=p(),Y.insert=c().bind(null,"head"),Y.domAPI=h(),Y.insertStyleElement=m(),s()(L.Z,Y),L.Z&&L.Z.locals&&L.Z.locals;const X={dialog:function({content:t,options:i}){return n.createElement("div",{className:"dialog "+("fade"===(null==i?void 0:i.animation)?"dialog-animation-fade":"")},t.key&&n.createElement("kbd",{className:"dialog-key"},t.key),n.createElement("div",{className:"dialog-content "+("text"===(null==i?void 0:i.animation)?"dialog-animation-text":"")},t.message))}};function $(){const[t,i]=n.useState([]);return n.useEffect((()=>{N.listen(((t,e)=>{switch(t){case"new":i((t=>[...t,e]));break;case"delete":i((t=>t.filter((t=>t.id!==e.id))))}}))}),[N]),n.createElement("div",{className:"ui-controller"},t.map((t=>{const i=X[t.type];return n.createElement(i,Object.assign({key:t.id},t))})))}(0,o.s)(document.getElementById("root")).render(n.createElement((function(){return n.useEffect((()=>{const t=document.createElement("div");t.className="game-canvas",t.appendChild(j.view),document.body.appendChild(t);const i=new K;return i.init(),i.destroy}),[]),n.createElement($,null)}),null))}},e={};function n(t){var o=e[t];if(void 0!==o)return o.exports;var a=e[t]={id:t,loaded:!1,exports:{}};return i[t].call(a.exports,a,a.exports,n),a.loaded=!0,a.exports}n.m=i,t=[],n.O=(i,e,o,a)=>{if(!e){var s=1/0;for(c=0;c<t.length;c++){for(var[e,o,a]=t[c],r=!0,h=0;h<e.length;h++)(!1&a||s>=a)&&Object.keys(n.O).every((t=>n.O[t](e[h])))?e.splice(h--,1):(r=!1,a<s&&(s=a));if(r){t.splice(c--,1);var l=o();void 0!==l&&(i=l)}}return i}a=a||0;for(var c=t.length;c>0&&t[c-1][2]>a;c--)t[c]=t[c-1];t[c]=[e,o,a]},n.n=t=>{var i=t&&t.__esModule?()=>t.default:()=>t;return n.d(i,{a:i}),i},n.d=(t,i)=>{for(var e in i)n.o(i,e)&&!n.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:i[e]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=(t,i)=>Object.prototype.hasOwnProperty.call(t,i),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.nmd=t=>(t.paths=[],t.children||(t.children=[]),t),(()=>{var t={826:0};n.O.j=i=>0===t[i];var i=(i,e)=>{var o,a,[s,r,h]=e,l=0;if(s.some((i=>0!==t[i]))){for(o in r)n.o(r,o)&&(n.m[o]=r[o]);if(h)var c=h(n)}for(i&&i(e);l<s.length;l++)a=s[l],n.o(t,a)&&t[a]&&t[a][0](),t[a]=0;return n.O(c)},e=self.webpackChunkweb_app=self.webpackChunkweb_app||[];e.forEach(i.bind(null,0)),e.push=i.bind(null,e.push.bind(e))})(),n.nc=void 0;var o=n.O(void 0,[814],(()=>n(354)));o=n.O(o)})();
//# sourceMappingURL=index.bundle.js.map