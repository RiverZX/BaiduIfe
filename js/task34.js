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
    add: function(num) { //添加活动物体
        var square = document.createElement('div');
        square.className = 'square';
        this.deg = -num * 90;
        square.style.transform = 'rotate(' + this.deg + 'deg)';
        this.dom.appendChild(square);
        console.log('thisdeg:'+this.deg);
    },
    delete: function() { //删除物体
        this.dom.removeChild(this.dom.firstChild);
    },
    setDeg: function(num) { //设置角度
        this.deg=(this.deg + num)%360;
        this.dom.firstChild.style.transform = 'rotate(' + this.deg + 'deg)';
        console.log('setdeg:'+this.deg);
    }
}

function Cell(row, col) { //活动的小物体
    this.row = row; //所在行
    this.col = col; //所在列
    this.direction = 0; //方向
}
Cell.prototype = {
    constructor: Cell,
    init: function() {
        checker[this.row][this.col].add(0);
    },
    move: function(cmd) {
        console.log('direction:'+this.direction);
        switch (cmd) {
            case 'GO':
                switch (this.direction) {
                    case 0:
                        if (this.row !== 1) {
                            checker[this.row][this.col].delete(); //删除前一次所在位置的物体
                            this.row--;
                            checker[this.row][this.col].add(this.direction); //在当前位置添加物体
                        }
                        break;
                    case 1:
                        if (this.col != 1) {
                            checker[this.row][this.col].delete();
                            this.col--;
                            checker[this.row][this.col].add(this.direction);
                        }
                        break;
                    case 2:
                        if (this.row < 10) {
                            checker[this.row][this.col].delete();
                            this.row++;
                            checker[this.row][this.col].add(this.direction);
                        }
                        break;
                    case 3:
                        if (this.col < 10) {
                            checker[this.row][this.col].delete();
                            this.col++;
                            checker[this.row][this.col].add(this.direction);
                        }
                        break;
                }
                break;
            case 'TUN LEF':
                checker[this.row][this.col].setDeg(-90);
                this.direction = (this.direction + 1) % 4;
                console.log(this.direction);
                break;
            case 'TUN RIG':
                checker[this.row][this.col].setDeg(90);
                this.direction = (this.direction + 3) % 4;
                break;
            case 'TUN BAC':
                checker[this.row][this.col].setDeg(180);
                this.direction = (this.direction + 2) % 4;
                break;
             case 'TRA TOP':
                if (this.row !== 1) {
                    console.log(this.direction);
                    checker[this.row][this.col].delete(); //删除前一次所在位置的物体
                    this.row--;
                    checker[this.row][this.col].add(this.direction); //在当前位置添加物体
                }
                break; 
            case 'TRA LEF':
                if (this.col != 1) {
                    checker[this.row][this.col].delete();
                    this.col--;
                    checker[this.row][this.col].add(this.direction);
                }
                break;
             case 'TRA RIG':
                if (this.col < 10) {
                    checker[this.row][this.col].delete();
                    this.col++;
                    checker[this.row][this.col].add(this.direction);
                }
                break;
             case 'TRA BOT':
                if (this.row < 10) {
                    checker[this.row][this.col].delete();
                    this.row++;
                    checker[this.row][this.col].add(this.direction);
                }
                break;
             case 'MOV TOP':
                this.direction = 0;
                if (this.row !== 1) {
                    console.log(this.direction);
                    checker[this.row][this.col].delete(); //删除前一次所在位置的物体
                    this.row--;
                    checker[this.row][this.col].add(this.direction); //在当前位置添加物体
                }
                break;
             case 'MOV LEF':
                this.direction = 1;
                if (this.col != 1) {
                    checker[this.row][this.col].delete();
                    this.col--;
                    checker[this.row][this.col].add(this.direction);
                }
                break;
            case 'MOV RIG':
                this.direction = 3;
                if (this.col < 10) {
                    checker[this.row][this.col].delete();
                    this.col++;
                    checker[this.row][this.col].add(this.direction);
                }
                break;
            case 'MOV BOT':
                this.direction = 2;
                if (this.row < 10) {
                    checker[this.row][this.col].delete();
                    this.row++;
                    checker[this.row][this.col].add(this.direction);
                }
                break;                             
        }
    }
}
var checker = [];
var cell = new Cell(4, 5);
for (var i = 0; i < 11; i++) {
    checker[i] = [];
    for (var j = 0; j < 11; j++) {
        checker[i][j] = new Checkerboard(i, j);
        checker[i][j].init();
    }
}
cell.init();
direct = ['GO','TUN LEF','TUN RIG','TUN BAC','TRA TOP','TRA LEF','TRA RIG','TRA BOT','MOV TOP','MOV LEF','MOV RIG','MOV BOT'];

function btnEvent(dom) { //事件监听
    dom.addEventListener('click', function(){
        var text = $id('btn_text').value.toUpperCase();
        if (direct.indexOf(text)!==-1) {
            cell.move(text);
        } 
    }, false);
}
btnEvent($id('btn_run'));