var $id = function(id) {
    return document.getElementById(id);
}

function Checkerboard(x, y) {
    this.row = x;
    this.col = y;
    this.deg = 0;
    this.dom = null;
}
Checkerboard.prototype = { //棋盘格子
    constructor: Checkerboard,
    init: function() {
        this.dom = document.getElementsByTagName('td')[i * 11 + j];
    },
    add: function(num) { //添加
        var square = document.createElement('div');
        this.dpm.appendChild(square);
    },
    delete: function() { //删除
        this.dom.removeChild(this.dom.firstChild);
    }
}

function Cell(row,col) { //活动的小物体
    this.row = row; //所在行
    this.col = col; //所在列
    this.direction = 0; //方向
    this.sq=null;
}
Cell.prototype = {
    constructor: Cell,
    init: function() {
        this.sq=document.createElement('div');
        this.sq.className='sq';
        this.sq.style.top=this.row*41+'px';
        this.sq.style.left=this.col*41+'px';
        $id('container').appendChild(this.sq);
    },
    setDeg:function(num){
        switch(parseInt(num)){
        case 0:this.sq.style.borderTop='12px blue solid';break;
        case 1:this.sq.style.borderLeft='12px blue solid';break;
        case 2:this.sq.style.borderBottom='12px blue solid';break;
        case 3:this.sq.style.borderRight='12px blue solid';break;
        }
    },
    reset:function(){
    	this.sq.style.border='0';
    },
    move: function(cmd) {
        switch (cmd) {
            case 'GO':
                switch (this.direction) {
                    case 0:
                        if (this.row !== 1) {
                            this.row--;
                            this.sq.style.top=this.row*41+'px';
                        }
                        break;
                    case 1:
                        if (this.col != 1) {
                            this.col--;
                            this.sq.style.left=this.col*41+'px';
                        }
                        break;
                    case 2:
                        if (this.row < 10) {
                            this.row++;
                            this.sq.style.top=this.row*41+'px';
                        }
                        break;
                    case 3:
                        if (this.col < 10) {
                            this.col++;
                            this.sq.style.left=this.col*41+'px';
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
                if (this.row !== 1) {
                    this.row--;
                    this.sq.style.top=this.row*41+'px';
                }
                break; 
            case 'TRA LEF':
                if (this.col != 1) {
                    this.col--;
                    this.sq.style.left=this.col*41+'px';
                }
                break;
             case 'TRA RIG':
                if (this.col < 10) {
                    this.col++;
                    this.sq.style.left=this.col*41+'px';
                }
                break;
             case 'TRA BOT':
                if (this.row < 10) {
                    this.row++;
                    this.sq.style.top=this.row*41+'px';
                }
                break;
             case 'MOV TOP':
                this.direction = 0;
                if (this.row !== 1) {
                    this.row--;
                    this.reset();
                    this.setDeg(this.direction);
                    this.sq.style.top=this.row*41+'px';
                }
                break;
             case 'MOV LEF':
                this.direction = 1;
                if (this.col != 1) {
                    this.col--;
                    this.reset();
                    this.setDeg(this.direction);
                    this.sq.style.left=this.col*41+'px';
                }
                break;
            case 'MOV RIG':
                this.direction = 3;
                if (this.col < 10) {
                    this.col++;
                    this.reset();
                    this.setDeg(this.direction);
                    this.sq.style.left=this.col*41+'px';
                }
                break;
            case 'MOV BOT':
                this.direction = 2;
                if (this.row < 10) {
                    this.row++;
                    this.reset();
                    this.setDeg(this.direction);
                    this.sq.style.top=this.row*41+'px';
                }
                break;                             
        }
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
var checker = [],textArr=[];
var cell = new Cell(4, 5);
for (var i = 0; i < 11; i++) {
    checker[i] = [];
    for (var j = 0; j < 11; j++) {
        checker[i][j] = new Checkerboard(i, j);
        checker[i][j].init();
    }
}
cell.init();
var direct = ['GO','TUN LEF','TUN RIG','TUN BAC','TRA TOP','TRA LEF','TRA RIG','TRA BOT','MOV TOP','MOV LEF','MOV RIG','MOV BOT'];

$id('btn_run').addEventListener('click', function() {
    var text = $id('btn_text').value.replace(/(^\s*)|(\s*$)/g, "").replace(/<\/?.+?>/g,"");
    textArr=text.split(/[\r\n]/g);
    var i=0,len=textArr.length;
    var t=setInterval(function(){
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
