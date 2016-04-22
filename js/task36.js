var $id = function(id) {
    return document.getElementById(id);
}
function Checkerboard(x, y) {
    this.row = x;
    this.col = y;
    this.dom = null;
}
Checkerboard.prototype = { //棋盘格子
    constructor: Checkerboard,
    init: function(num,val) {
    	this.dom=document.createElement('td');
        this.dom.style.width=num+'px';
        this.dom.style.height=num+'px';
        this.dom.value=val;
    },
    add: function() { //添加
        var square = document.createElement('div');
        square.className='square';
        square.value=this.row+','+this.col;
        this.dom.appendChild(square);
        map[this.col-1][this.row-1]=0;
    },
    remv: function() { //删除
        this.dom.removeChild(this.dom.firstChild);
        map[this.row-1][this.col-1]=1;
    },
    bugColor:function(color){
    	this.dom.firstChild.style.backgroundColor=color;
    }
}

function Cell(row,col,wid) { //活动的小物体
    this.row = row; //所在行
    this.col = col; //所在列
    this.wid=wid;
    this.direction = 0; //方向
    this.sq=null;
}
Cell.prototype = {
    constructor: Cell,
    init: function() {
        this.sq=document.createElement('div');
        this.sq.className='sq';
        this.sq.style.width=this.wid+'px';
        this.sq.style.height=this.wid+'px';
        this.sq.style.top=this.row*this.wid+'px';
        this.sq.style.left=this.col*this.wid+'px';
        this.sq.style.borderTop=this.wid/4+'px blue solid';
        $id('container').appendChild(this.sq);
    },
    remov:function(){
    	$id('container').removeChild(this.sq);
    },
    setDeg:function(num){
        switch(parseInt(num)){
        case 0:this.sq.style.borderTop=this.wid/4+'px blue solid';break;
        case 1:this.sq.style.borderLeft=this.wid/4+'px blue solid';break;
        case 2:this.sq.style.borderBottom=this.wid/4+'px blue solid';break;
        case 3:this.sq.style.borderRight=this.wid/4+'px blue solid';break;
        }
    },
    reset:function(){
    	this.sq.style.border='0';
    },
    path:function(x,y){
        var j=0;
        var that=this;
    	var flag=initMap(parseInt(this.row-1),parseInt(this.col-1),parseInt(y-1),parseInt(x-1));
        if(flag==1){
            flag=0;
            console.log(Shortpath);
            t=setInterval(function(){
                if(j+1<Shortpath.length){
                    var arr=Shortpath[j].match(/[0-9]/g);
                    var arr1=Shortpath[j+1].match(/[0-9]/g);
                    that.moveXY(parseInt(arr1[0]),parseInt(arr1[1]),parseInt(arr[0]),parseInt(arr[1]),x,y);
                    j++;
                }else{
                    clearInterval(t);
                    Shortpath=[];
                }
            }, 1000);

        }
    },
    moveXY:function(nowx,nowy,prex,prey,x,y){
        var cmd;
        if(nowx!=prex){
            cmd=nowx-prex>0?3:1;
        }
        if(nowy!=prey){
            cmd=nowy-prey>0?2:0;
        }
        if(this.direction==0&&cmd==1){
            this.move('TUN LEF');
        }else if(this.direction==0&&cmd==2){
            this.move('TUN BAC');
        }else if(this.direction==0&&cmd==3){
            this.move('TUN RIG');
        }else if(this.direction==1&&cmd==0){
            this.move('TUN RIG');
        }else if(this.direction==1&&cmd==2){
            this.move('TUN LEF');
        }else if(this.direction==1&&cmd==3){
            this.move('TUN BAC');
        }else if(this.direction==2&&cmd==0){
            this.move('TUN BAC');
        }else if(this.direction==2&&cmd==1){
            this.move('TUN RIG');
        }else if(this.direction==2&&cmd==3){
            this.move('TUN LEF');
        }else if(this.direction==3&&cmd==0){
            this.move('TUN LEF');
        }else if(this.direction==3&&cmd==1){
            this.move('TUN BAC');
        }else if(this.direction==3&&cmd==2){
            this.move('TUN RIG');
        }else{
        }
        
        if(this.move('GO')==-1){
            clearInterval(t);
            Shortpath=[];
            this.path(x,y);
        };
    },
    stop:function(){
    	clearInterval(t);
    },
    fly:function(x,y){
    	this.row=x;
    	this.col=y;
    	this.sq.style.top=this.row*this.wid+'px';
        this.sq.style.left=this.col*this.wid+'px';
    },
    move: function(cmd) {
        switch (cmd) {
            case 'GO':
                switch (this.direction) {
                    case 0:
                        if (this.row !== 1&&!checker[this.row-1][this.col].dom.firstChild) {
                            this.row--;
                            this.sq.style.top=this.row*this.wid+'px';
                        }else{
                            return -1;
                        }
                        break;
                    case 1:
                        if (this.col != 1&&!checker[this.row][this.col-1].dom.firstChild) {
                            this.col--;
                            this.sq.style.left=this.col*this.wid+'px';
                        }else{
                            return -1;
                        }
                        break;
                    case 2:
                        if (this.row < row&&!checker[this.row+1][this.col].dom.firstChild) {
                            this.row++;
                            this.sq.style.top=this.row*this.wid+'px';
                        }else{
                            return -1;
                        }
                        break;
                    case 3:
                        if (this.col < col&&!checker[this.row][this.col+1].dom.firstChild) {
                            this.col++;
                            this.sq.style.left=this.col*this.wid+'px';
                        }else{
                            return -1;
                        }
                        break;
                }
                break;
            case 'TUN LEF':
                this.reset();
                this.direction=(this.direction +1) % 4;
                this.setDeg(this.direction);
                break;
            case 'TUN RIG':
                this.reset();
                this.direction=(this.direction +3) % 4;
                this.setDeg(this.direction);
                break;
            case 'TUN BAC':
                this.reset();
                this.direction=(this.direction + 2) % 4;
                this.setDeg(this.direction);
                break;
             case 'TRA TOP':
                if (this.row !== 1&&!checker[this.row-1][this.col].dom.firstChild) {
                    this.row--;
                    this.sq.style.top=this.row*this.wid+'px';
                }
                break; 
            case 'TRA LEF':
                if (this.col != 1&&!checker[this.row][this.col-1].dom.firstChild) {
                    this.col--;
                    this.sq.style.left=this.col*this.wid+'px';
                }
                break;
             case 'TRA RIG':
                if (this.col < col&&!checker[this.row][this.col+1].dom.firstChild) {
                    this.col++;
                    this.sq.style.left=this.col*this.wid+'px';
                }
                break;
             case 'TRA BOT':
                if (this.row < row&&!checker[this.row+1][this.col].dom.firstChild) {
                    this.row++;
                    this.sq.style.top=this.row*this.wid+'px';
                }
                break;
             case 'MOV TOP':
                this.direction = 0;
                if (this.row !== 1&&!checker[--this.row][this.col].dom.firstChild) {
                    this.reset();
                    this.setDeg(this.direction);
                    this.sq.style.top=this.row*this.wid+'px';
                }
                break;
             case 'MOV LEF':
                this.direction = 1;
                if (this.col != 1&&!checker[this.row][--this.col].dom.firstChild) {
                    this.reset();
                    this.setDeg(this.direction);
                    this.sq.style.left=this.col*this.wid+'px';
                }
                break;
            case 'MOV RIG':
                this.direction = 3;
                if (this.col < col&&!checker[this.row][++this.col].dom.firstChild) {
                    this.reset();
                    this.setDeg(this.direction);
                    this.sq.style.left=this.col*this.wid+'px';
                }
                break;
            case 'MOV BOT':
                this.direction = 2;
                if (this.row < row&&!checker[++this.row][this.col].dom.firstChild) {
                    this.reset();
                    this.setDeg(this.direction);
                    this.sq.style.top=this.row*this.wid+'px';
                }
                break;                    
        }
		log.addlog('小方块正在移到：（'+this.row+','+this.col+')');
        return 0;
    }
}
var numList={
	row:0,
	List:$id('num'),
	scrollList:function(top){
		this.List.scrollTop=top;
	},
	addRow:function(num){
		if(this.row!==num){
			var span;
				span=document.createElement('span');
		        span.innerText=num;
		        this.List.appendChild(span);
			this.row=num;
		}
	}
}
var log={
	dom:$id('console'),
	addlog:function(str){
		var p=document.createElement('p');
		p.innerText=str;
		this.dom.appendChild(p);
	},
	clearlog:function(){
		this.dom.innerHTML='';
	}
}
var checker = [],textArr=[],row=10,col=10;
var map=[];
var cell=null,clix,cliy,t;
var colNum=$id('colNum'),rowNum=$id('rowNum'),table=$id('table'),menu=$id('menu');
function makeTable(row,col){ //建立图像
	checker = [];
	if(cell){
		cell.remov();
	}
	cell=null;
	var wid=parseInt($id('container').offsetWidth/(row+1));
	var tbody=$id('checkerboard');
	colNum.innerHTML="<span style='width:"+(wid-1)+"px';></span>";
	rowNum.innerHTML='';
	table.style.left=wid+'px';
	tbody.innerHTML='';
	colNum.style.height=(wid-1)+'px';
	rowNum.style.width=(wid-1)+'px';
	for (i=1;i<=row;i++) {
        checker[i] = [];
        var tr=document.createElement('tr');
        var span1=document.createElement('span');
        span1.innerText=i;
        span1.style.width=(wid-1)+'px';
        span1.style.lineHeight=wid+'px';
        var span2=document.createElement('span');
        span2.style.height=(wid)+'px';
        span2.style.width=wid-1+'px';
        span2.innerText=i;
        var aj=[];
        span2.style.lineHeight=wid+'px';
    	for (j=1;j<=col;j++) {
            aj[j-1]=1;
        	checker[i][j] = new Checkerboard(i, j);
        	checker[i][j].init(wid-1,i+','+j);
        	tr.appendChild(checker[i][j].dom);
    	}
        map[i-1]=aj;
    	tbody.appendChild(tr);
    	colNum.appendChild(span1);
    	rowNum.appendChild(span2);
    }
	cell=new Cell(parseInt(row/2), parseInt(col/2),wid);
	cell.init();
}
makeTable(row,col);
var direct = ['GO','TUN LEF','TUN RIG','TUN BAC','TRA TOP','TRA LEF','TRA RIG','TRA BOT','MOV TOP','MOV LEF','MOV RIG','MOV BOT'];
table.addEventListener("mousedown", function(event) {
	var e = event || window.event;
	var target = e.target || e.srcElement;
	var arr=[];
	event.preventDefault();event.stopPropagation();
	if (target.nodeName.toLowerCase() == "td"||target.nodeName.toLowerCase() == "div") {
		arr=target.value.split(/[\,]/);
		menu.style.left=(arr[1]*cell.wid+cell.wid/2)+'px';
		menu.style.top=(arr[0]*cell.wid+cell.wid/2)+'px';
		menu.style.display='block';
		clix=arr[0];
		cliy=arr[1];
	}
},false);
menu.addEventListener('click',function(event){
	var e=event||window.event;
	var target=e.target||e.srcElement;
	if (target.nodeName.toLowerCase() == "li") {
		menu.style.display='none';
		switch(target.innerText){
			case '放墙':checker[clix][cliy].add();break;
			case '拆墙':checker[clix][cliy].remv();break;
			case '移动到这里':cell.path(clix,cliy);break;
			case '飞到这里':cell.fly(clix,cliy);break;
			case '取消所有AI指令':cell.stop();break;
			case '刷墙':checker[clix][cliy].bugColor('green');break;
		}
	}
})
$id('clearlog').onclick=function(){
	log.clearlog();
}
$id('make_tab').addEventListener('click',function(){
	row=parseInt($id('rowIn').value);
    col=parseInt($id('colIn').value);
    makeTable(row,col);
},false);
$id('btn_run').addEventListener('click', function(){
    var text = $id('btn_text').value.replace(/(^\s*)|(\s*$)/g, "").replace(/<\/?.+?>/g,"");
    textArr=text.split(/[\r\n]/g);
    var i=0,len=textArr.length;
    t=setInterval(function(){
    	if (direct.indexOf(textArr[i].toUpperCase())!==-1) { cell.move(textArr[i].toUpperCase());  }
    	i++;
        if(i==len){ clearInterval(t);}
    },800);
}, false);
$id('btn_refresh').addEventListener('click', function() {
    $id('btn_text').value='';
    numList.List.innerHTML='';
}, false);
$id('btn_text').addEventListener('scroll',function(){numList.scrollList(this.scrollTop);},false);
$id('btn_text').addEventListener('keyup',function(){ numList.addRow($id('btn_text').value.replace(/(^\s*)|(\s*$)/g, "").replace(/<\/?.+?>/g,"").split(/[\r\n]/g).length);},false);
