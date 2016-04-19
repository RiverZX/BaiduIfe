//命令者模式，单例模式
var $id = function(id) {
	return document.getElementById(id);
}
var a1=0,a2=0,air=[],start=[];
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
function Airship(Deg,sudo,energy_num,eating,recover){
	this.sudo=sudo; //速度
	this.Deg=Deg; //角度
	this.flag=false; //是否存在
	this.div=null; //飞船的DOM
	this.energy=null;
	this.energy_num=energy_num;//能量
	this.eating=eating; //消耗速度
	this.recover=recover; //恢复速度
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
	    console.log(this.Deg);
	    this.energy_num-=this.eating;
	    if(this.energy_num<=0){
	    	this.energy_num=0;
	    	clearInterval(start[air_id]);
	    	this.flag=false;
	    	var _this=this;
	    	start[air_id]=setInterval(function(){
				_this.energy_num+=_this.recover;
	            if(_this.energy_num>=100){
                    clearInterval(start[air_id]);  
                    console.log(start[air_id]);
                    _this.energy_num=100;
	    		}
	            _this.energy.innerText=_this.energy_num+'%';
	            _this.energy.style.width=_this.energy_num+"%";
			},1000);
	    }
	    this.div.style.transform='rotate('+this.Deg+'deg)';
	    this.energy.innerText=this.energy_num+'%';
	    this.energy.style.width=this.energy_num+"%";
    }
}	
var controler = { //操作者
	track: function(track_type,airship,code_commond,sudo,eating,recover) {
		var commond=BUS.Adapter.deconde(code_commond);
		var i=parseInt(track_type.slice(5))-1;
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
			$id(track_type).removeChild($id(track_type).getElementsByClassName('airship')[0]);
			air[i]=null;
			break;
		case 'create':
		    var track=$id(track_type);
		    if(!air[i]){
		        air[i]=new Airship(0,sudo,100,eating,recover);
		        air[i].init(track); 
		    }
	        break;
	    }
	},
	commander: function(mingling) { //司令官
		this['track'](mingling.track_type,mingling.airship,mingling.commond,mingling.sudo,mingling.eating,mingling.recover);
	}
}
var BUS={ //bus传播介质
	send:function(track,commond,type){
		var i=parseInt(track.slice(5))-1;
		var o={
			track_type:track,
		    airship:air[i],
		    commond:BUS.Adapter.encode(commond),
		    sudo:type.sudo,
		    eating:type.eating,
		    recover:type.recover
		};
		log('司令向轨道'+(i+1)+'发出'+commond+'指令','yellow');
		var rand=(Math.random())*100;
		setTimeout(function(){
		    if(rand>90){
			    log('向轨道'+(i+1)+'发送的'+commond+'指令丢包了','red');
			    BUS.send(track,commond,type);
		    }else{
			    log('轨道'+(i+1)+'成功接受'+commond+'指令','green');
			    controler.commander(o);
		    }
		},300);
	},
	Adapter:{ //编码解码器
		encode:function(commond){ //编码器
		   var code;
		   switch(commond){
		   case 'start':code='1000';break;	
		   case 'stop':code='0100';break;
		   case 'destroy':code='0010';break;
		   case 'create':code='0001';break;
		   }
		   return code;
	    },
	    deconde:function(commond){ //解码器
		  var code;
		  switch(commond){
		   case '1000':code='start';break;	
		   case '0100':code='stop';break;
		   case '0010':code='destroy';break;
		   case '0001':code='create';break;
		   }
		  return code;
	    }
	}
}
function getType(i){ //获取要创建的飞船类型
	var type={
		sudo:parseInt($id('air_type'+i).value.match(/[0-9]/g)[0]),
		eating:parseInt($id('air_type'+i).value.match(/[0-9]/g)[2]),
		recover:parseInt($id('air_regain'+i).value.match(/[0-9]/g)[0])
	};
	return type;
}
function airshipEvent(dom,track,commond){ //事件监听
	dom.addEventListener('click', function(){
		var type=getType(track.slice(5));
		BUS.send(track,commond,type);
	},false);

}
airshipEvent($id('newOrDie1'),'track1','create');
airshipEvent($id('newOrDie2'),'track2','create');
airshipEvent($id('newOrDie3'),'track3','create');
airshipEvent($id('newOrDie4'),'track4','create');
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
function getCss(o, key) {
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
