var $ = function (id) {
	return document.getElementById(id);
}

var count = [];

function selectWhat () {
	if ($('user-check').checked) {
		count[0] = 1;
	}else {
		count[0] = 0;
	};
	if ($('email-check').checked) {
		count[1] = 1;
	}else {
		count[1] = 0;
	};
	if ($('phone-check').checked) {
		count[2] = 1;
	}else {
		count[2] = 0;
	};
	if ($('password-check').checked) {
		count[3] = 1;
	}else {
		count[3] = 0;
	};
	console.log(count);
}

var $$ = function (element){
	return document.createElement(element);
}
var contain = $('contain');

function addInputElement (name,id,type) {
	var lable = $$('lable');
		lable.innerText = name;
		var div1 = $$('div'),div11 =$$('div'),div12 = $$('div'),Input = $$('input');
		Input.setAttribute("type",type);
		Input.setAttribute("id",id);
		div11.style.display = "block";
		div12.setAttribute("id",id+"info");
		div12.setAttribute("class","info");
		div11.appendChild(lable);
		div11.appendChild(Input);
		div1.appendChild(div11);
		div1.appendChild(div12);
		contain.appendChild(div1);
}

function creatForm (count) {
	contain.innerHTML = "";
	if(count[0] == 1){
		addInputElement("用户名","useInput","text");
	}
	if(count[1] == 1) {
		addInputElement("邮箱","emailInput","text");
	}
	if(count[2] == 1) {
		addInputElement("手机号","phoneInput","text");
	}
	if (count[3] == 1) {
		addInputElement("密码","passwordInput","text");
	};
}

function ifEmpty(element) {
		if (element.value.length == 0) {
			element.parentNode.nextSibling.innerText = "长度为0，请重新输入";
			element.parentNode.nextSibling.style.color = "red";

		}else {
			element.parentNode.nextSibling.innerText ="长度合适";
			element.parentNode.nextSibling.style.color = "lightgreen";
		};
	}

function charMatch(element) {
	if (element.value.length>= 16||element.value.length<=4) {
			element.parentNode.nextSibling.innerText = "长度不匹配，请重新输入";
			element.parentNode.nextSibling.style.color = "red";

		}else {
			element.parentNode.nextSibling.innerText ="长度匹配";
			element.parentNode.nextSibling.style.color = "lightgreen";
		};
}

function phoneMatch(element) {
	if(element.value.length !== 11){
		element.parentNode.nextSibling.innerText = "长度不为11位，请重新输入";
		element.parentNode.nextSibling.style.color = "red";

	}else {
		element.parentNode.nextSibling.innerText ="OK";
		element.parentNode.nextSibling.style.color = "lightgreen";
		};
}

function emailMatch(element) {
	var reg = new RegExp('^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$', 'i');
	if(element.value.match(reg)){
		element.parentNode.nextSibling.innerText = "符合邮箱格式";
		element.parentNode.nextSibling.style.color = "lightgreen";
	} else{
		element.parentNode.nextSibling.innerText = "不符合邮箱格式";
		element.parentNode.nextSibling.style.color = "red";

	}
}

function getId(count){
	var id = [];
	if(count[0] == 1){
		id[0] = $('useInput');
	}else{
		id[0] = 0;
	}
	if(count[1] == 1){
		id[1] = $('emailInput');
	}else{
		id[1] = 0;
	}
	if(count[2] == 1){
		id[2] = $('phoneInput');
	}else{
		id[2] = 0;
	}
	if(count[3] == 1){
		id[3] = $('passwordInput');
	}else{
		id[3] = 0;
	}
	return id;
}

function getOption (){
	var sel = $('sec');
	return sel.options[sel.selectedIndex].innerText;
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
var btn = $('btn');
addEvent(btn,"click",function () {
  selectWhat();
  creatForm(count);
  var option = getOption();
  var getEle = getId(count);
  console.log(getEle);
  for (var i=0;getEle.length>i; i++){
	if(getEle[i] !== 0){
		if(i == 0){
			addEvent(getEle[i],"blur",function(e) {
				if (option == "不为空") {
					ifEmpty(e.target);
				}else{
					charMatch(e.target);
				}
			})
		}else if(i == 1){
			addEvent(getEle[i],"blur",function(e) {
				emailMatch(e.target);
			})
		}else if(i == 2){
			addEvent(getEle[i],"blur",function(e) {
				phoneMatch(e.target);
			})
		}else{
			addEvent(getEle[i],"blur",function(e) {
				charMatch(e.target);
			})
		}
	}
  }
})

// addEvent(getEle[0],"focus",function(e) {
//     console.log(e.target.getAttribute("id"));
//     if(e.target.getAttribute("id") == "useInput"){
//       if(option == "不为空"){
//         ifEmpty(e.target);
//       }else{
//         charMatch(e.target);
//       }
//     }
//   })