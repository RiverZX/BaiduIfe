var openList = []; //开启列表,存节点Node
var closeList = []; //关闭列表
var COST_STRAIGHT = 1; //垂直方向或水平方向移动的路径评分
var row; //行
var column; //列
var Shortpath = [];
//从起点(x1,y1)查找目标(x2,y2),（-1：错误，0：没找到，1：找到了）
function search1(x1, y1, x2, y2) {
  if (x1 < 0 || x1 >= row || x2 < 0 || x2 >= row || y1 < 0 || y1 >= column || y2 < 0 || y2 >= column) {
    return -1;
  }
  if (map[x1][y1] == 0 || map[x2][y2] == 0) {
    return -1;
  }
  var sNode = new Node(x1, y1, null); //起点
  var eNode = new Node(x2, y2, null); //目标
  openList.push(sNode);
  var resultList = search(sNode, eNode);
  if (resultList.length == 0) {
    return 0;
  }
  for (i = 0; i < resultList.length; i++) {
    map[resultList[i].getX()][resultList[i].getY()] = 2;
  }
  return 1;
}
//查找核心算法
function search(sNode, eNode) {
  var resultList = [];
  var isFind = false;
  var node = null;
  while (openList.length > 0) {
    //取出开启列表中最低F值，即第一个存储的值的F为最低的
    node = openList[0];

    //判断是否找到目标点
    if (node.getX() == eNode.getX() && node.getY() == eNode.getY()) {
      isFind = true;
      break;
    }

    //上
    if ((node.getY()-1)>=0) {
      checkPath(node.getX(), node.getY()-1, node, eNode, COST_STRAIGHT);
    }

    //下
    if ((node.getY() + 1) < column) {
      checkPath(node.getX(), node.getY() + 1, node, eNode, COST_STRAIGHT);
    }

    //左
    if ((node.getX() - 1) >= 0) {
      checkPath(node.getX() - 1, node.getY(), node, eNode, COST_STRAIGHT);
    }
    //右
    if ((node.getX() + 1) < row) {
      checkPath(node.getX() + 1, node.getY(), node, eNode, COST_STRAIGHT);
    }

    //从开启列表中删除
    //添加到关闭列表中       
    closeList.push(openList.shift());

    //开启列表中排序，把F值最低的放到最底端
    openList.sort(compare);
  }
  if (isFind) {
    getPath(resultList, node);
  }
  return resultList;
}

//查询此路(x,y)是否能走通
function checkPath(x, y, parentNode, eNode, cost) {
  var node = new Node(x, y, parentNode);
  //查找地图中是否能通过
  if (map[x][y]==0) {
    closeList.push(node);
    console.log(map[x][y]+'x:'+x+'y:'+y);
    return false;
  }
  
  //查找关闭列表中是否存在
  if (isListContains(closeList, x, y) != -1) {
    return false;
  }
  //查找开启列表中是否存在
  var index = -1;
  if ((index = isListContains(openList, x, y)) != -1) {
    //G值是否更小，即是否更新G，F值
    if ((parentNode.getG() + cost) < openList[index].getG()) {
      node.setParentNode(parentNode);
      countG(node, eNode, cost);
      countF(node);
      openList[index] = node;
    }
  } else {
    //添加到开启列表中
    node.setParentNode(parentNode);
    count(node, eNode, cost);
    openList.push(node);
  }
  return true;
}
//集合中是否包含某个元素(-1：没有找到，否则返回所在的索引)
function isListContains(list, x, y) {
  var i, node;
  for (i = 0; i < list.length; i++) {
    node = list[i];
    if (node.getX() == x && node.getY() == y) {
      return i;
    }
  }
  return -1;
}
//从终点往返回到起点
function getPath(resultList, node) {
  if (node.getParentNode() != null) {
    getPath(resultList, node.getParentNode());
  }
  resultList.push(node);
  Shortpath.push((node.getX()+1)+'='+(node.getY()+1));
}

//计算G,H,F值
function count(node, eNode, cost) {
  countG(node, eNode, cost);
  countH(node, eNode);
  countF(node);
}
//计算G值
function countG(node, eNode,cost) {
  if (node.getParentNode() == null) {
    node.setG(cost);
  } else {
    node.setG(node.getParentNode().getG() + cost);
  }
}
//计算H值
function countH(node, eNode) {
  var dx = Math.abs(node.getX() - eNode.getX());
  var dy = Math.abs(node.getY() - eNode.getY());
  node.setF(dx+dy);
}
//计算F值
function countF(node) {
  node.setF(node.getG() + node.getH());
}
//节点类
function Node(x, y, parentNode) {
  this.x = x;
  this.y = y;
  this.parentNode = parentNode; //父节点
  this.g = 0; //当前点到起点的移动耗费
  this.h = 0; //当前点到终点的移动耗费，即曼哈顿距离|x1-x2|+|y1-y2|(忽略障碍物)
  this.f = 0; //f=g+h
}

Node.prototype.getX = function() {
  return this.x;
}
Node.prototype.setX = function(x) {
  this.x = x;
}
Node.prototype.getY = function() {
  return this.y;
}
Node.prototype.setY = function(y) {
  this.y = y;
}
Node.prototype.getParentNode = function() {
  return this.parentNode;
}
Node.prototype.setParentNode = function(parentNode) {
  this.parentNode = parentNode;
}
Node.prototype.getG = function() {
  return this.g;
}
Node.prototype.setG = function(g) {
  this.g = g;
}
Node.prototype.getH = function() {
  return this.h;
}
Node.prototype.setH = function(h) {
  this.h = h;
}
Node.prototype.getF = function() {
  return this.f;
}
Node.prototype.setF = function(f) {
  this.f = f;
}
Node.prototype.toString = function() {
    return "(" + this.x + "," + this.y + "," + this.f + ")";
  }
  //节点比较类
function compare(o1, o2) {
  return o1.getF() - o2.getF();
}

function initMap(sx, sy, ex, ey) {
  column = map[0].length;
  row = map[0].length;
  var flag = search1(sx, sy, ex, ey);
  if (flag == -1) {
    return -1;
  } else if (flag == 0) {
    return 0;
  } else {
    openList = []; //开启列表,存节点Node
    closeList = [];
    for (x = 0; x < row; x++) {
      for (y = 0; y < row; y++) {
        if (map[x][y] == 2) { //输出搜索路径
          map[x][y] = 1;
        }
      }
    }
    return 1;
  }
  return -1;
}