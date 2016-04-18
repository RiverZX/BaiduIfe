//命令者模式，单例模式
var $id = function(id) { //获取DOM
	return document.getElementById(id);
}
var air=[],watchArr=[],start=[],send=[]; //air[]保存飞船实例，watchArr[]保存监视器上的每一行对于表格，剩下2个都是定时器;
var console_content=$id('content');
function log(str,color) { //调试台输出信息
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
	this.sudo=sudo; //角速度
	this.Deg=Deg; //初始角度
	this.flag=false;  //是否存在
	this.div=null; //飞船的外形
	this.energy=null; 
	this.energy_num=energy_num; //能量
	this.eating=eating;//消耗速度
	this.recover=recover; //恢复速度
}
Airship.prototype={
	constructor:Airship,
	init:function(track){ //初始化
        this.div=document.createElement('div');
        this.div.className='airship';
        this.div.style.transform='rotate('+this.Deg+'deg)';
        this.energy=document.createElement('div');
        this.energy.className='energy';
        this.energy.innerText=this.energy_num+'%';
        this.div.appendChild(this.energy);
        track.appendChild(this.div);
	},
	move:function(air_id){ //移动
	    this.Deg+=this.sudo;
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
                    _this.energy_num=100;
	    		}
	            _this.energy.innerText=_this.energy_num+'%';
	            _this.energy.style.width=_this.energy_num+"%";
			},1000);
	    }
	    this.div.style.transform='rotate('+this.Deg+'deg)';
	    this.energy.innerText=this.energy_num+'%';
	    this.energy.style.width=this.energy_num+"%";
    },
    reset:function(track,commond,i){ //重设
    	clearInterval(start[i]);
		clearInterval(send[i]);
		this.sendBroadcast(track,commond,i);
    },
    sendBroadcast:function(track,commond,i){ //飞船发出广播
    	var rand,_this=this; 
        send[i]=setInterval(function(){
        	rand=(Math.random())*100;
        	if(rand>90){
                log(track+'上的飞船消息发送失败','red');
        	}else{
        		watcher.receiver(BUS.Adapter.encode(commond,track,_this.energy_num));
        		log('司令成功接到来自'+track+'消息','green');
        	}
        },1000);
    }
}
var watcher={ //飞船监视系统
	receiver:function(msg){
		var arr=BUS.Adapter.deconde(msg);
		var i=parseInt(arr[0].slice(5))-1;
		watchArr[i].childNodes[0].innerText=arr[0];
		watchArr[i].childNodes[1].innerText=arr[1];
		watchArr[i].childNodes[2].innerText=arr[2];
	}
}	
var controler = { //操作者
	track: function(track_type,airship,code_commond,sudo,eating,recover) {
		var commond=BUS.Adapter.deconde(code_commond)[1];
		var i=parseInt(track_type.slice(5))-1;
        switch (commond) {
	    case 'start':
			if(airship&&!airship.flag){
				airship.flag=true;
				airship.reset(track_type,commond,i);
				start[i]=setInterval(function(){
				    airship.move(i);
				},1000);
			}
			break;
		case 'stop':
		    if(airship){ //防止对象不存在时，按下按钮浏览器调试台会报错
                airship.reset(track_type,commond,i);
		    }
			break;
		case 'destroy':
		    if(airship){
                airship.reset(track_type,commond,i);
			    $id(track_type).removeChild($id(track_type).getElementsByClassName('airship')[0]);
			    setTimeout(function(){ //飞船要销毁的时候停一下，让消息发出去给监视台知道
				    clearInterval(send[i]);
		            $id('watch_msg').removeChild(watchArr[i]);
		            watchArr[i]=null;
			    },2000);	
			    air[i]=null;
		    }
			break;
		case 'create':
		    var track=$id(track_type);
		    if(!air[i]){
		        air[i]=new Airship(0,sudo,100,eating,recover);
		        air[i].init(track); 
		        watchArr[i]=document.createElement('tr');
		        var td1=document.createElement('td');
		        var td2=document.createElement('td');
		        var td3=document.createElement('td');
		        watchArr[i].appendChild(td1);
		        watchArr[i].appendChild(td2);
		        watchArr[i].appendChild(td3);
		        $id('watch_msg').appendChild(watchArr[i]);
		        air[i].sendBroadcast(track_type,commond,i);
		    }
	        break;
	    }
	},
	commander: function(mingling) { //司令官
		this['track'](mingling.track_type,mingling.airship,mingling.commond,mingling.sudo,mingling.eating,mingling.recover);
	}
}
var BUS={ //传播介质
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
	Adapter:{
		encode:function(commond,track,energy_num){ //编码器
		   var code=[];
		   switch(commond){
		   case 'start':code[1]='1000';break;	
		   case 'stop':code[1]='0100';break;
		   case 'destroy':code[1]='0010';break;
		   case 'create':code[1]='0001';break;
		   }
		   if(typeof track!=='undefined'){ //是否传入了该参数
				switch (track) {
					case 'track4':
						code[0] = '1000';
						break;
					case 'track3':
						code[0] = '0100';
						break;
					case 'track2':
						code[0] = '0010';
						break;
					case 'track1':
						code[0] = '0001';
						break;
				}
				var arr=energy_num.toString(2);//10进制转换为8位2进制；
				var ar=[],
					len=arr.length;
				if(arr.length<8)
					for(var i=0;i<8;i++) {
						if(i<8-len) {
							ar[i]='0';
						}else{
							ar[i]=arr[i-(8-len)]
						}
					}
				code[2] = ar.join("");//变成字符串
			}
		    return code;
	    },
	    deconde:function(arr){ //解码器
		    var code=[];
		    switch(arr[1]){
		    case '1000':code[1]='start';break;	
		    case '0100':code[1]='stop';break;
		    case '0010':code[1]='destroy';break;
		    case '0001':code[1]='create';break;
		    }
		    if(typeof arr[0]!=='undefined'){
		    	switch(arr[0]){
		        case '1000':code[0]='track4';break;	
		        case '0100':code[0]='track3';break;
		        case '0010':code[0]='track2';break;
		        case '0001':code[0]='track1';break;
		        }
                if(arr[2]=='00000000'){
                	code[2]=0;
                }else{
                	code[2]=parseInt(arr[2].replace(/^(0*)(\s*)/,""),2);
                }
		    }
		  return code;
	    }
	}
}
function getType(i){ //获取飞船类型
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
//各个控制台的拖拽
var controlBox = $id('control'),
    consoleBox = $id('console'),
    controlBar = $id('control_bar'),
    consoleBar = $id('console_bar'),
    watchBox=$id('ship_watch'),
    watchBar=$id('watch_bar');
var params3 = {
		left: 0,
		top: 0,
		currentX: 0,
		currentY: 0,
		flag: false
	},
    params2 = {
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
startDrag(watchBar, watchBox, params3);
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
