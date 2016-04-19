//本题采用命令者模式，单例模式
var $id = function(id) { //获取dom对象
		return document.getElementById(id);
}
var air=[],start=[];
var console_content=$id('content');
function log(str,color) { //调试台打印信息
	var p=document.createElement('p');
	var span1=document.createElement('span');
	span1.style.color='#f0f';
	span1.innerText=getTime();
	var span2=document.createElement('span');
	span2.style.color=color;
	span2.innerText=str;
	p.appendChild(span1);
	p.appendChild(span2);
	console_content.appendChild(p);
}
//获取时间
function getTime() {
    var date = new Date();
    var year = ("0000" + date.getFullYear()).substr(-4);
    var month = ("00" + (date.getMonth() + 1)).substr(-2);
    var day = ("00" + date.getDay()).substr(-2);
    var hour = ("00" + date.getHours()).substr(-2);
    var minute = ("00" + date.getMinutes()).substr(-2);
    var second = ("00" + date.getSeconds()).substr(-2);
    var millisecond = ("000" + date.getMilliseconds()).substr(-3);
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + "." + millisecond;
}
//飞船类
function Airship(Deg,sudo,energy_num){
	this.sudo=sudo;
	this.Deg=Deg;
	this.flag=false;
	this.div=null;
	this.energy=null;
	this.energy_num=energy_num;
}
Airship.prototype={
	constructor:Airship,
	init:function(track){
        this.div=document.createElement('div');
        this.div.className='airship';
        this.div.style.transform='rotate('+this.Deg+'deg)';
        this.energy=document.createElement('div');
        this.energy.className='energy';
        this.energy.innerText=this.energy_num+'%';
        this.div.appendChild(this.energy);
        track.appendChild(this.div);
	},
	move:function(air_id){
	    this.Deg+=this.sudo*10;
	    this.div.style.transform='rotate('+this.Deg+'deg)';
	    this.energy.innerText=--this.energy_num+'%';
	    this.energy.style.width=this.energy_num+"%";
	    if(this.energy_num==0){
	    	clearInterval(air_id);
	    	this.flag=false;
	    	var _this=this;
	    	start[air_id]=setInterval(function(){
				_this.energy_num++;
				_this.energy.innerText=_this.energy_num+'%';
	            _this.energy.style.width=_this.energy_num+"%";
	            if(_this.energy_num==100){
                    clearInterval(start[air_id]);    
	    		}
			},1000);
	    }
    }
}	
var controler = { //操作者
	track: function(track_type,airship,commond,sudo) {
		var rand=(Math.random())*100;
		var i=track_type.slice(5)-1;
		if(rand>70){
			log('向轨道'+(i+1)+'发送的'+commond+'指令丢包了','red');
		}else{
			log('轨道'+(i+1)+'成功接受'+commond+'指令','green');
            switch (commond) { 
			case 'start':
				if(airship&&!airship.flag){
					clearInterval(start[i]);
					airship.flag=true;
					start[i]=setInterval(function(){
				       airship.move(i);
				    },1000);
				}
				break;
			case 'stop':
				clearInterval(start[i]);
				airship.flag=false;
				break;
			case 'destroy':
			    clearInterval(start[i]);
			    $id(track_type).removeChild($id(track_type).getElementsByClassName('airship')[0]);//删除飞船
				arr[i]=null;
				break;
		    case 'create':
		        var track=$id(track_type);
		        if(!air[i]){
		        	air[i]=new Airship(0,sudo,100);
		            air[i].init(track); 
		        }
	            break;
	        }
		}
	},
	commander: function(mingling) { //司令官
		this['track'](mingling.track_type,mingling.airship,mingling.commond,mingling.sudo);
	}
}
function getsudo(dom_id){ //获取速度值
    return parseInt($id(dom_id).value);
}
function airshipEvent(dom,track,commond,sudo){ //事件监听
	dom.addEventListener('click', function(){
		var i=track.slice(5)-1;
		var o={
			track_type:track,
		    airship:air[i],
		    commond:commond,
		    sudo:sudo
		};
		log('司令向轨道'+(i+1)+'发出'+commond+'指令','yellow');
		setTimeout(function(){controler.commander(o);},1000); //司令发出命令
	},false);

}
airshipEvent($id('newOrDie1'),'track1','create',getsudo('number1'));
airshipEvent($id('newOrDie2'),'track2','create',getsudo('number2'));
airshipEvent($id('newOrDie3'),'track3','create',getsudo('number3'));
airshipEvent($id('newOrDie4'),'track4','create',getsudo('number4'));
airshipEvent($id('start1'),'track1','start');
airshipEvent($id('start2'),'track2','start');
airshipEvent($id('start3'),'track3','start');
airshipEvent($id('start4'),'track4','start');
airshipEvent($id('stop1'),'track1','stop');
airshipEvent($id('stop2'),'track2','stop');
airshipEvent($id('stop3'),'track3','stop');
airshipEvent($id('stop4'),'track4','stop');
airshipEvent($id('destroy1'),'track1','destroy');
airshipEvent($id('destroy2'),'track2','destroy');
airshipEvent($id('destroy3'),'track3','destroy');
airshipEvent($id('destroy4'),'track4','destroy');
//拖拽
var controlBox = $id('control');
var consoleBox = $id('console');
var controlBar = $id('control_bar');
var consoleBar = $id('console_bar');
var params2 = {
		left: 0,
		top: 0,
		currentX: 0,
		currentY: 0,
		flag: false
	},
	params1 = {
		left: 0,
		top: 0,
		currentX: 0,
		currentY: 0,
		flag: false
	};
startDrag(controlBar, controlBox, params1);
startDrag(consoleBar, consoleBox, params2);
function getCss(o, key) { //获取css
	return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
}
function startDrag(bar, target, params, callback) {
	if (getCss(target, "left") !== "auto") {
		params.left = getCss(target, "left");
	}
	if (getCss(target, "top") !== "auto") {
		params.top = getCss(target, "top");
	}
	bar.addEventListener("mousedown", function(e) {
		params.flag = true;
		if (!e) {
			e = window.event;
			bar.onselectstart = function() {
				return false;
			}
		}
		params.currentX = e.clientX;
		params.currentY = e.clientY;
	});
	document.addEventListener("mouseup",function(e) {
		params.flag = false;
		if (getCss(target, "left") !== "auto") {
			params.left = getCss(target, "left");
		}
		if (getCss(target, "top") !== "auto") {
			params.top = getCss(target, "top");
		}
	});
	bar.addEventListener("mousemove",function(e) {
		e = e || window.e;
		if (params.flag) {
			var nowX = e.clientX,
				nowY = e.clientY;
			var disX = nowX - params.currentX,
				disY = nowY - params.currentY;
			target.style.left = parseInt(params.left) + disX + "px";
			target.style.top = parseInt(params.top) + disY + "px";
		}
		if (typeof callback == "function") {
			callback(parseInt(params.left) + disX, parseInt(params.top) + disY);
		}
	});
}
