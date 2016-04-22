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

var $ = function (id) {
    return document.getElementById(id);
}

function addfilenode(name,parentNode) {
    var li = document.createElement('li');
    var p = document.createElement('p');
    p.innerText = name;
    li.appendChild(p);
    parentNode.appendChild(li);
}

function addfoldernode (name,parentNode) {
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    var p = document.createElement('p');
    p.innerText = name;
    var span1 = document.createElement('span');
    var span2 = document.createElement('span');
    var span3 = document.createElement('span');
    span1.innerText = "ADDFILE";
    span2.innerText = "ADDFOLDER";
    span3.innerText ="DEL";
    li.appendChild(p);
    li.appendChild(span1);
    li.appendChild(span2);
    li.appendChild(span3);
    ul.appendChild(li);
    parentNode.appendChild(ul);
}

var root = $("root") ;

addEvent(root,"click",function (e) {
    if(e.target.tagName.toLowerCase() == "span") {
        if(e.target.innerText == "ADDFILE") {
            var filename = prompt("please input a file name:","");
            var parentNode = e.target.parentNode.childNodes;
            console.log(parentNode[7].nodeName);
            for (var i = 0;parentNode.length > i; i++) {
                if(parentNode[i].nodeName.toLowerCase() === "ul"){
                    console.log(i);
                    parentNode = parentNode[i]; 
                    console.log(parentNode);
                    addfilenode(filename,parentNode);
                }
            }
            
        }else if(e.target.innerText == "ADDFOLDER") {
            var foldername = prompt("please input a foder name:","");
            var parentNode = e.target.parentNode.childNodes;
           // parentNode = parentNode[parentNode.length-2];//获得父元素中的 ul节点
            for (var i = 0;parentNode.length > i; i++) {
                if(parentNode[i].nodeName.toLowerCase() === "ul"){
                    console.log(i);
                    console.log(parentNode[i]);
                    addfoldernode(foldername,parentNode[i]);
                }
            }
            if (e.target.parentNode.nodeName == 'ul') {
                addfoldernode(foldername,e.target.parentNode);
            };
        }else if(e.target.innerText == "DEL") {
            var parentNode = e.target.parentNode, grandNode = parentNode.parentNode;
            grandNode.removeChild(parentNode);
        }
    }

    if (e.target.tagName.toLowerCase() == "p") {
        var parentNode = e.target.parentNode.childNodes;
        for (var i = 0;parentNode.length > i; i++) {
                if(parentNode[i].nodeName.toLowerCase() === "ul"){
                   if (parentNode[i].style.display == "none"){
                    parentNode[i].style.display = "";
                   }else {
                    parentNode[i].style.display = "none";
                    console.log(parentNode[i]);
                   }
                }
            }
    };
})

