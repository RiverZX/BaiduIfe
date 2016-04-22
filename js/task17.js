/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

// 自定义柱状图宽度
function getWidth(width,count) {
  var obj = {};
  obj.width = Math.floor(width/(count*2));
  obj.right = obj.width;
  return obj;
}

/**
 * 渲染图表
 */
function renderChart() {
  var html = "";
  var wrapper = document.getElementsByClassName('aqi-chart-wrap')[0];
  var width = wrapper.clientWidth;
  var type=getTimeNow();
  switch (type) {
    case"day": 
      var count=90;
      break;
    case"week":
      var count=14;
      break;
    case"month":
      var count=3;
      break;
  };
  var obj = getWidth(width,count);
  for(var v in chartData) {
    // 最好将单引分开来书写不容易乱
    html += "<div class='box " +pageState['nowGraTime']+"'"+"style='width:"+obj.width+"px;"+"margin-right:"+obj.right+"px;"+"'"+">";
    html += "<div class='histogram' style='height:" 
    +chartData[v]+"px;background-color:"+getRandomColor()+
    "'title='"+v+":"+chartData[v]+"'></div></div>";
  }
  document.getElementsByClassName('aqi-chart-wrap')[0].innerHTML=html;

}

/**
 *得到当下时间的时间类型
 */
 function getTimeNow() {
  var timetype = document.getElementsByName('gra-time');
  var timenow ="";
  // forEach函数为遍历数组，并对数组中的值调用同一个函数，在此是对timetype中每一个对象进行重复调用后面的函数
  [].forEach.call(timetype,function(v){
    if(v.checked)
      timenow=v.value;
  });
  return timenow;
 }

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  var typeNow = getTimeNow();
  if (typeNow==pageState["nowGreTime"]) {
    return
  }else{
  // 设置对应数据
    initAqiChartData();
  // 调用图表渲染函数
    renderChart();
  }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var cityNow=document.getElementById('city-select').value;
  if (cityNow == pageState["nowSelectCity"]) {
    return;
  } else{
  // 设置对应数据
    initAqiChartData();
  // 调用图表渲染函数
    renderChart();
  };
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var timetype = document.getElementsByName('gra-time');
  [].forEach.call(timetype,function(value) {
    value.addEventListener("click",graTimeChange);
  });
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var select=document.getElementById("city-select");
  var html = "";
  // for in 语句将会将对象的所有属性和值枚举一遍 在此city就是属性名字
  for(var city in aqiSourceData) {
    html+="<option value='"+city+"'>"+city+"</option>";
  }
  select.innerHTML=html;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  select.addEventListener("change",citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var type=getTimeNow();
  var city=document.getElementById("city-select").value;
  pageState["nowGraTime"] = type;
  pageState["nowSelectCity"] = city;
  switch (type) {
    case"day":
      chartData=aqiSourceData[city];
      break;
    case"week":
      chartData={};
      var count=0,total=0,week=1,date,weekDay=0;
      for(var v in aqiSourceData[city]) { 
        date = new Date(v);
        weekDay=date.getDay();
        if (weekDay==6) {
          count++;
          total+=aqiSourceData[city][v];
          count=0;
          total=0;
          weekDay=0;
          week++;
        } else{
          count++;
          weekDay++;
          total+=aqiSourceData[city][v];
        };
      // 累计求平均值
      chartData[week+"week"]=Math.round(total/count);
    }
      break;
    case"month":
      chartData={};
      var count=0;total=0;month=-1;date;
      for(var v in aqiSourceData[city]){
        date=new Date(v);
        if (month==-1) {
          month=date.getMonth()+1;
        } else if(date.getMonth()+1!=month) {
          chartData[month+"月"]=Math.round(total/count);
          month =date.getMonth()+1;
          count=0;
          total=0;
        }
        count++;
        total+=aqiSourceData[city][v];
      }
      chartData[month+"月"]=Math.round(total/count);
      break;
  }
  console.log(JSON.stringify(chartData));
  renderChart();
}

/**
* 获取随机颜色
*/
function getRandomColor(){
    return '#' + (function(h){
        return new Array(7 - h.length).join("0") + h
        }
            )((Math.random() * 0x1000000 << 0).toString(16))
    }

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();