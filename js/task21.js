// 对字符串进行分割
function spiltInput (text) {
	var inputArray = [];
	console.log(text);	
	inputArray = text.split(/[,，;；、\s\n]+/);
	inputArray.forone();
	console.log (inputArray);
	return inputArray;
}
	
var tagArr = [],tagInput = document.getElementById("tag-text"),
tag = document.getElementById("tag"),textArr = [],contain = document.getElementById("contain");

Array.prototype.forone = function() {
   var n = [this[0]];
   for (var i = 1; i <this.length; i++) {
     if(this.indexOf(this[i]) ==i ){
       n.push(this[i]);
     };
   };
   return n;
}

function getText () {
	var text = tagInput.value;
	tagArr.push(text);
	tagArr = tagArr.forone()
	console.log(tagArr);
	// return tagArr.forone(); 这种写法返回的还是原来的值 并不是去重之后的值
	return tagArr;
}

function rank() {
	var contain = document.getElementById("contain");
	for (var n = 0; contain.childNodes.length > n; n++){
		contain.childNodes[n].setAttribute("num",n);
	};

}

function addDiv1 () {
	var str ="",contain = document.getElementById("contain"),i = 0;
	tagArr.forEach(function (v) {
		str += "<div>"+v+"</div>";
		return str;
	});
	tagInput.value ="";
	contain.innerHTML = str;
	rank();
}

// function ifLen () {
// 	if (tagArr.length >= 10) {
// 		tagArr.shift();
// 		addDiv();
// 	}
// }

function addDiv2 (inputArray) {
	var str ="",contain = document.getElementById("text-con"),i = 0;
	inputArray.forEach(function (v) {
		str += "<div>"+v+"</div>";
		return str;
	});
	contain.innerHTML = str;
}

function divClick(event) {
	if(event.target.tagName.toLowerCase() == "div") {
		var divNum = event.target.getAttribute("num");
		console.log(event.target.innerText);
		contain.removeChild(contain.childNodes[divNum]);
		tagArr.splice(divNum,1);
	}
	rank();
}

function divOver(event) {
	var stage = event.target.innerText;
	if (event.target.tagName.toLowerCase() == "div") {
		event.target.innerText=  "删除"+stage+"?";
		console.log(stage);
		};	
}

function divOut(event) {
	var stage = event.target.innerText;
	if (event.target.tagName.toLowerCase() == "div") {
		console.log(stage);
		// 之前的substr为什么就是不行？
		stage=stage.substring(2,stage.length-1);
		console.log(stage);
		event.target.innerText = stage;
	}
}

function addEvent(element, event, listener) {
    try {
        element.addEventListener(event, listener, false);
    }
    catch(e){
        try{
            element.attachEvent("on" + event, listener);
        }
        catch(e) {
            element["on" + event] = listener;
        }
    }
    
}

addEvent(tagInput,"keyup",function(e) {
	if (/[,，;；、\s\n]+/.test(tagInput.value) || e.keyCode ===13) {
		getText();
		addDiv1();
		if (tagArr.length >= 10) {
		tagArr.shift();
		addDiv1();
	};
	}
})

addEvent(tag,"click",divClick);

addEvent(contain,"mouseover",divOver);

addEvent(contain,"mouseout",divOut);

addEvent(btn,"click",function(e) {
	// 必须要在此处才获得文本框里面的值  不然定义在外面de话  他就是空的
	var text = document.getElementById("hobby-text").value.trim();
	var a = spiltInput(text).forone();
	console.log(a);
	addDiv2(a);
});
