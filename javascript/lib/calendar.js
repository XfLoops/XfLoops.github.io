var calendarConfig = {
	"defaultColor":"#eee",
	"highlightColor":{
		"red":30,
		"green":104,
		"blue":35
	},
	"records":[
		{"date":"2015-08-01","contrib":10},
		{"date":"2015-02-02","contrib":4},
		{"date":"2015-07-06","contrib":15},
		{"date":"2015-04-08","contrib":9},
		{"date":"2015-03-10","contrib":20},
		{"date":"2015-06-12","contrib":12}
	]
};

var calendarParams = {
	"data":[],
	"records":[],
	"firstday":"",
	"sparedays":0,
	"calendarDays":0,
	"weeks":0,
	"day":['','M','','W','','F',''],
	"month":['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun','Jul', 'Aug', 'Sep','Oct', 'Nov', 'Dec'],
	"size":{},
	"position":[]
}

var utils = {
	"fmt":new Format(),
}

function Format(){

}

function Calendar(selector){
	this.container = document.querySelector(selector);
	this.init();
	this.appendGrids();

}

Format.prototype.fmtNumber = function(number){
	if(typeof number !== 'number') number = parseInt(number);
	if(number < 10)
		return '0' + number;
	else
		return number;
}

Format.prototype.fmtDate = function (date) {
	var year,month,day,milliSec;
	if(typeof date === 'number' || typeof date === 'string'){
		date = new Date(date);
	}
		year = date.getFullYear(),
		month = this.fmtNumber(date.getMonth() + 1),
		day = this.fmtNumber(date.getDate());
	return year + '-' + month + '-' + day;
}

Calendar.prototype.init = function () {
		var nowaday 		= utils.fmt.fmtDate(new Date());
		var records 		= calendarParams.records 	  = this.sort(calendarConfig.records);
		var	lastYearToday   = this.lastYearToday(nowaday);
		var firstday		= calendarParams.firstday     = this.initFirstday(lastYearToday);
		var	days 			= calendarParams.calendarDays = this.countDays(firstday,nowaday);
		var weeks 		    = calendarParams.weeks 		  = Math.ceil(days / 7);
		calendarParams.size = {
							"width"   : this.container.clientWidth / (weeks + 1.5),
							"height"  : this.container.clientHeight / 8.5,
							"mTParam" : 0.5
						};
		calendarParams.position = this.initPosition();
		calendarParams.data = this.initGridData();
}

//sort by date
Calendar.prototype.sort = function(records){
	records.sort(function(a,b){
		return Date.parse(a.date) - Date.parse(b.date);
	});
	return records;
}

Calendar.prototype.lastYearToday = function(today){
		var lastyear = parseInt(today.substr(0,4)) - 1,
			lastdate = today.substr(4);
		return  utils.fmt.fmtDate(lastyear+ lastdate);
}

Calendar.prototype.initFirstday = function (lastYearToday) {
		var sparedays = calendarParams.sparedays = (new Date(lastYearToday)).getDay();
		var initFirstday = Date.parse(lastYearToday) - sparedays * 86400000;
		return utils.fmt.fmtDate(initFirstday);
}

Calendar.prototype.max = function(records){
	var max = 0;
	records.forEach(function(el){
		if(el.contrib > max)
			max = el.contrib;
	})
	return max;
}

Calendar.prototype.countDays = function(firstday,nowaday){
	if(typeof firstday === 'string'){
		return Math.ceil((Date.parse(nowaday) - Date.parse(firstday)) / 86400000) + 1;
	}
	else if(typeof firstday === 'object'){
		return Math.ceil((nowaday.getTime() - firstday.getTime()) / 86400000) + 1;
	}
	else if(typeof firstday === 'number')
		return Math.ceil((nowaday - firstday) / 86400000) + 1;
}

Calendar.prototype.toNextDay = function(day){
	var nextday = Date.parse(day) + 86400000;
	return utils.fmt.fmtDate(nextday);
}

Calendar.prototype.inWhichMonth = function(day){
		return (new Date(day)).getMonth();
}

Calendar.prototype.initGridData = function(){
	var arr 	= [],
		nextday = calendarParams.firstday,
		days 	= calendarParams.calendarDays,
		records = calendarParams.records;
	var max 	= this.max(records),
		len 	= records.length;

	for(var i = 0; i < days; i++){
		arr[i] = {"date":nextday,"contrib":0,"color":calendarConfig.defaultColor};
		for(var j = 0; j < len; j++){
			if(arr[i].date === records[j].date){
				arr[i].contrib = records[j].contrib,
					arr[i].opacity = records[j].contrib / max;
				break;
			}
		}
		nextday = this.toNextDay(nextday);
	}
	return arr;
}

Calendar.prototype.initPosition = function () {
	var position = [],
		size 	 = calendarParams.size,
		weeks	 = calendarParams.weeks,
		month	 = calendarParams.month,
		firstday = calendarParams.firstday,
		oneday	 = firstday,
		anotherday,
		counter  = 1;
	for(var i = 1,j = 0; i <= weeks; i++){
		anotherday = new Date(Date.parse(firstday) + i * 7 * 86400000);
		if(this.inWhichMonth(oneday) === this.inWhichMonth(anotherday)){
			++counter;
		}
		else{
			var currMoth = this.inWhichMonth(oneday);
			position[j]  = {"month":month[currMoth],"width":counter * size.width};
			++j;
			counter = 1;
			oneday  = anotherday;
		}
	}
	return position;
}

Calendar.prototype.appendGrids = function(){
	var data = calendarParams.data,
		weeks = calendarParams.weeks,
		size = calendarParams.size;

	for(var i = 1;i <= weeks;i++){
		var week = this.appendSevenDays(i);
			week.style.width = size.width + 'px';
		if(i === 1){
			this.container.appendChild(this.appendMonthLabel());
			this.container.appendChild(this.appendDayLabel());
		}

		this.container.appendChild(week);
	}
}
Calendar.prototype.appendMonthLabel = function () {
	var labelArr = calendarParams.month,span,text = "",textNode,
		size 	 = calendarParams.size,
		firstday = calendarParams.firstday,
		position = calendarParams.position;

		labelWrap = document.createElement('div');
		labelWrap.className = 'month-label-wrap';
		labelWrap.style.marginLeft = size.width + 'px';
		//labelWrap.style.marginBottom = 0.2 * size.height + 'px';

	for(var i = 0;i < position.length;i++){
		span = document.createElement('span');
		span.className = 'month-label-name';
		if(position[i].width > size.width * 2){
			text = position[i].month;
		}
		span.style.width = position[i].width + 'px',
		textNode = document.createTextNode(text);
		span.appendChild(textNode);
		labelWrap.appendChild(span);
	}
	return labelWrap;
}

Calendar.prototype.appendDayLabel = function () {
	var labelArr = calendarParams.day,span,textNode,
		size = calendarParams.size,
		labelWrap = document.createElement('div');
		labelWrap.className = 'day-label-wrap',
		labelWrap.style.width = size.width + 'px';

		for(var i = 0; i < labelArr.length; i++){
			span = document.createElement('span');
			span.className = 'day-label-name',
			span.style.width = size.width + 'px',
			span.style.height = size.height + 'px';
			span.style.lineHeight = size.height + 'px';
			textNode = document.createTextNode(labelArr[i]);
			span.appendChild(textNode);
			labelWrap.appendChild(span);
		}
		return labelWrap;
}

Calendar.prototype.appendSevenDays = function(whichWeek){
	var size = calendarParams.size,
		data = calendarParams.data,
		i,index,
		days = calendarParams.calendarDays,
		sparedays = calendarParams.sparedays,
		div = document.createElement('div');
		div.className = 'week wk' + whichWeek;

	for(i = 0,index = i + (whichWeek - 1) * 7;i < 7 && index < days;i++,index++){
			span = document.createElement('span');
			if(index < sparedays){
				span.className = 'day spareday';
			}
			else{
				span.className = 'day d' + (index - sparedays + 1);
			}
			span.setAttribute('data-date',data[index].date),
			span.setAttribute('data-contrib',data[index].contrib),
			span.style.backgroundColor = data[index].color;
			span.style.width = (size.width - 4) + 'px',
			span.style.height = size.height + 'px';

		if(data[index].opacity){
				span.style.backgroundColor = 'rgba('+ calendarConfig.highlightColor.red +','
													+ calendarConfig.highlightColor.green + ','
													+ calendarConfig.highlightColor.blue +','
													+ data[index].opacity +')';
			}

			span.appendChild(this.addContribTip(span)),
			span.appendChild(this.addTriangle());

			div.appendChild(span);
	}
	return div;
}

Calendar.prototype.addContribTip = function(tag){
	var size =calendarParams.size,
		date = tag.getAttribute('data-date'),
		contrib = tag.getAttribute('data-contrib'),
		text,textNode,
		contribTip = document.createElement('div');
		contribTip.className = 'contrib-tip',
		contribTip.style.left = -(125 - size.width / 2) + 'px';

	if(contrib > 0){
		text = contrib + ' contributions on ' + date;
	}
	else{
		text = 'No contribution on ' + date;
	}
	textNode = document.createTextNode(text);
	contribTip.appendChild(textNode);

	return contribTip;
}

Calendar.prototype.addTriangle = function(){
	var size = calendarParams.size,
	triangle = document.createElement('div');
	triangle.className = 'triangle',
	triangle.style.left = - (12 - size.width / 2) + 'px';
	return triangle;
}

