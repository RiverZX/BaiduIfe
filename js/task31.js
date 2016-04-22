function changeRadio () {
	if(document.getElementById('student').checked ){
		document.getElementById('college').className ="student";
		document.getElementById('text').className = "text hide";
	}else {
		document.getElementById('college').className ="student hide";
		document.getElementById('text').className = "text";
	}
}

function selectData () {
	var data = {
		北京: ["北京大学", "清华大学", "北京航空航天大学"],
        上海: ["复旦大学", "上海交通大学", "同济大学"],
        杭州: ["浙江大学", "杭州电子科技大学", "浙江工业大学"]
	}

	var space = document.getElementById('sec1'),
	spaceCollege = document.getElementById('sec2');
	var target = space.options[space.selectedIndex].innerText;
	console.log(target);
	spaceCollege.innerHTML="";
	switch(target){
		case"北京":
			for(var i in data.北京){
				var option = document.createElement('option');
				option.innerText=data.北京[i];
				spaceCollege.appendChild(option);
			}
			break;
		case"上海":
			for(var i in data.上海){
				var option = document.createElement('option');
				option.innerText=data.上海[i];
				spaceCollege.appendChild(option);
			}
			break;
		case"杭州":
			for(var i in data.杭州){
				var option = document.createElement('option');
				option.innerText=data.杭州[i];
				spaceCollege.appendChild(option);
			}
			break;
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

var btn =document.getElementById('sec1');

addEvent(btn,"change",function() {
	selectData();
})

window.onload = selectData(); 

