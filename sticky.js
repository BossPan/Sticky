var stickies = document.getElementById('stickies');
window.onload = init;

function addEvent(obj, type, handler) {
    if(obj.addEventListener){
        obj.addEventListener(type, handler);
    }
    else if(obj.attachEvent){
        obj.attachEvent('on'+ type, handler);
    }
    else obj['on'+ type] = handler;
}

function init() {
    var addBtn = document.getElementById('add-button'),
        deleteBtn = document.getElementById('delete-all'),
        stickiesArray = getStickiesArray();
    addEvent(addBtn, 'click', createSticky);
    addEvent(deleteBtn, 'click', deleteAll);
    for (var i = 0; i < stickiesArray.length; i++) {
        var key = stickiesArray[i];
        //将JSON字符串解析为对象
        var value = JSON.parse(localStorage[key]);
        addStickyToDOM(key, value);
    }
}

function getStickiesArray() {
    var stickiesArray = localStorage.getItem('stickiesArray');
    if (!stickiesArray) {
        stickiesArray = [];
        localStorage.setItem('stickiesArray', stickiesArray)
    } else {
        stickiesArray = JSON.parse(stickiesArray);
    }
    return stickiesArray;
}

function createSticky() {
    var currentDate = new Date();
    var key = 'sticky_' + currentDate.getTime(),
        value = document.getElementById('note').value,
        color = document.getElementById('color').value,
        stickiesArray = getStickiesArray();
    if(value === ''){
        return ;
    }
    stickiesArray.push(key);
    var stickyObj = {
        'value': value,
        'color': color
    };
    //将对象转换为JSON字符串
    localStorage.setItem(key, JSON.stringify(stickyObj));
    //更新localStorage
    localStorage.setItem('stickiesArray', JSON.stringify(stickiesArray));
    addStickyToDOM(key, stickyObj);
}

function addStickyToDOM(key, stickyObj) {
    var sticky = document.createElement('li');
    //唯一标识 用来删除
    sticky.setAttribute('id', key);
    sticky.innerText = stickyObj.value;
    sticky.style.backgroundColor = stickyObj.color;
    stickies.appendChild(sticky);
    addEvent(sticky, 'click', deleteSticky);
}

function deleteSticky() {
    var key = this.getAttribute('id');
    var stickiesArray = getStickiesArray();
    //从localStorage中移除对应项
    localStorage.removeItem(key);
    //从stickiesArray移除对应键值
    stickiesArray.splice(stickiesArray.indexOf(key), 1);
    //更新localStorage
    localStorage.setItem('stickiesArray', JSON.stringify(stickiesArray));
    //从DOM移除节点
    removeStickyFromDOM(key);
}

function removeStickyFromDOM(key) {
    var sticky = document.getElementById(key);
    stickies.removeChild(sticky);
}

function deleteAll() {
    localStorage.clear();
    stickies.html = '';
}