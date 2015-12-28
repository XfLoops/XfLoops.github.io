$(function() {
    'use strict';
    /* -------------- *\
           Config
    \* -------------- */
    var siteConfig = {
        "path":"data.json",
        "data":null,
        "domain":null
    };

    /* -------------- *\
           Calendar
    \* -------------- */
    var calendarConfig = {
        "container":{
            "width":$("#calendar-container").width(),
            "height":$("#calendar-container").height()
        },
        "defaultColor":"#eee",
        "highlightColor":"#1E6823"
    };
    var calendarParams = {
        "posts":null,
        "total":null,
        "calendarDays":null,
        "firstday":null,
        "sparedays":null,
        "gridSize":null,
        "LabelPosition":null,
        "lastYearPosts":null,
        "longestStreak":null,
        "currentStreak":null
    };

    /* --------------- *\
            Format
    \* --------------- */
    var utils = {
        "fmt":new Format()
    };

    function Format(){}
    Format.prototype.fmtNumber = function(number){
        if(typeof number !== 'number') number = parseInt(number);
        if(number < 10)
            return '0' + number;
        else
            return number;
    };

    Format.prototype.fmtDate = function (date) {
        var year,month,day;
        if(typeof date === 'number' || typeof date === 'string'){
            date = new Date(date);
        }
        year = date.toString().substr(11,4),
        month = date.toString().substr(4,3),
        day = date.toString().substr(8,2);
        return day + ' ' + month + ' ' + year;
    };

    function Calendar(data){
        calendarParams.posts = data;
        this.container = $("#calendar-container");
        this.init();
        this.caculStreak();
        this.createCalendar();
        this.appendCalendarCaption();
    }

    Calendar.prototype.init = function () {
        this.initFirstday();
        this.caculDays();
        this.initGridSize();
        this.initLabelPosition();
        this.initCalendarData();
    };

    Calendar.prototype.initFirstday = function () {
        var year  = new Date().getFullYear() - 1,
            month = new Date().getMonth() + 1,
            day   = new Date().getDate();
        var lastYearToday = year + '-' + month + '-' + day;
        var sparedays = new Date(lastYearToday).getDay();
        var firstday = Date.parse(lastYearToday) - sparedays * 86400000;
        calendarParams.firstday = new Date(firstday);
        calendarParams.sparedays = sparedays;
    };

    Calendar.prototype.caculDays = function(){
        var firstday = calendarParams.firstday,today = new Date();
        if(!(firstday instanceof Date)){
            firstday = new Date(firstday);
        }
        calendarParams.calendarDays = Math.ceil((today.getTime() - firstday.getTime()) / 86400000);
    };

    Calendar.prototype.initGridSize = function () {
        var weeks = Math.ceil(calendarParams.calendarDays / 7);
        calendarParams.gridSize = {
            "width"   : calendarConfig.container.width / (weeks + 1.5),
            "height"  : calendarConfig.container.height / 8.5
        };
    };

    Calendar.prototype.initLabelPosition = function () {
        var position = [],
            size 	 = calendarParams.gridSize,
            weeks	 = Math.ceil(calendarParams.calendarDays / 7),
            month	 = ['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun','Jul', 'Aug', 'Sep','Oct', 'Nov', 'Dec'],
            firstday = calendarParams.firstday,
            oneday	 = firstday,
            anotherday,
            counter  = 1;
        for(var i = 1,j = 0; i <= weeks; i++){
            anotherday = new Date(firstday.getTime() + i * 7 * 86400000);
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
        calendarParams.LabelPosition = position;
    };

    Calendar.prototype.toNextDay = function(day){
        var nextday = Date.parse(day) + 86400000;
        return utils.fmt.fmtDate(nextday);
    };

    Calendar.prototype.inWhichMonth = function(day){
        return (new Date(day)).getMonth();
    };

    Calendar.prototype.initCalendarData = function(data){
        var arr 	= [],
            posts   = calendarParams.posts,
            firstday = calendarParams.firstday,
            days 	= calendarParams.calendarDays,
            len 	= posts.length;
        var nextday = utils.fmt.fmtDate(firstday);

        for(var i = 0; i < days; i++){
            arr[i] = {"date":nextday,"color":calendarConfig.defaultColor,"value":false};
            for(var j = len - 1; j >= 0; j--){
                if(arr[i].date === posts[j].date){
                    arr[i].title = posts[j].title,
                    arr[i].url = posts[j].url,
                    arr[i].type = posts[j].type,
                    arr[i].tags = posts[j].tags,
                    arr[i].excerpt = posts[j].excerpt,
                    arr[i].color = calendarConfig.highlightColor;
                    arr[i].value = true;
                    break;
                }
            }
            nextday = this.toNextDay(nextday);
        }
        calendarParams.total = arr;
    };

    Calendar.prototype.caculStreak = function(){
            this.caculLastyearPosts();
            this.caculLongestStreak();
            this.caculCurrentStreak();
    };

    Calendar.prototype.caculLastyearPosts = function () {
            var data = calendarParams.total,sparedays = calendarParams.sparedays;
            var len  = data.length,count = 0;
            for(var i = sparedays; i < len; i++){
                if(data[i].value){
                    ++count;
                }
            }
            calendarParams.lastYearPosts = {
                "count":count,
                "start":data[sparedays].date,
                "end":data[len - 1].date
            };
    };

    Calendar.prototype.caculLongestStreak = function () {
        var data = calendarParams.total,sparedays = calendarParams.sparedays;
        var len  = data.length,
            arr  = [],max = 0,idx = 0;
        for(var i = sparedays; i < len; i++){
            if(data[i].value){
                var index = i,
                    count = 0;
                while((index < len) && data[index].value){
                    ++count;
                    ++index;
                }
                arr.push({
                    "count":count,
                    "start":data[i].date,
                    "end":data[index - 1].date
                });
                i = index;
            }
        }
        if(arr){
            arr.forEach(function (item,index) {
                if(item.count >= max){
                    max = item.count;
                    idx = index;
                }
            });
            calendarParams.longestStreak = {
                "count":arr[idx].count,
                "start":arr[idx].start,
                "end":arr[idx].end
            };
        }
        else{
            calendarParams.longestStreak = {
                "count":0,
                "start":data[len - 1].date,
                "end":data[len - 1].date
        }
    };

    Calendar.prototype.caculCurrentStreak = function () {
        var data = calendarParams.total;
        var len  = data.length,
            count = 0, index,idx;
            if(data[len - 1].value || data[len - 2].value){
                var idx = data[len - 1].value ? len - 1 : len - 2;

                for (index = idx; data[index].value; index--) {
                    ++count;
                }
                calendarParams.currentStreak = {
                    "count":count,
                    "start":data[index + 1].date,
                    "end":data[idx].date
                };
            }
            else{
                calendarParams.currentStreak = {
                    "count":0,
                    "start":data[len - 1].date,
                    "end":data[len - 1].date
                };
            }
    };

    Calendar.prototype.createCalendar = function () {
            var data = calendarParams.total,
                weeks = Math.ceil(calendarParams.calendarDays / 7),
                size = calendarParams.gridSize;

            for(var i = 1;i <= weeks;i++){
                var week = this.appendSevenDays(i);
                week.style.width = size.width + 'px';
                if(i === 1){
                    this.container.append(this.appendMonthLabel());
                    this.container.append(this.appendDayLabel());
                }

                this.container.append(week);
        }
    };

    Calendar.prototype.appendSevenDays = function(whichWeek){
        var size = calendarParams.gridSize,
            data = calendarParams.total,
            i,index,
            days = calendarParams.calendarDays,
            sparedays = calendarParams.sparedays,
            div = document.createElement('div');
        div.className = 'week wk' + whichWeek;

        for(i = 0,index = i + (whichWeek - 1) * 7;i < 7 && index < days;i++,index++){
            var span = document.createElement('span');
            if(index < sparedays){
                span.className = 'day spareday';
            }
            else if(index === days -1){
                span.className = 'day today d' + (index - sparedays + 1);
            }
            else{
                span.className = 'day d' + (index - sparedays + 1);
            }

                span.style.backgroundColor = data[index].color;
                span.style.width = (size.width - 4) + 'px',
                span.style.height = (size.width + 4) + 'px';
                span.appendChild(this.addContribTip(span,index)),
                span.appendChild(this.addTriangle());

            div.appendChild(span);
        }
        return div;
    };

    Calendar.prototype.addContribTip = function(tag,index){
        var size =calendarParams.gridSize,
            data = calendarParams.total,
            text,Node,
            contribTip = document.createElement('div');
            contribTip.className = 'contrib-tip tip' + index;

        if(data[index].value){
            //@TODO different type add here.
            if(data[index].type === 'article'){
                $(contribTip).addClass('article');
                Node = this.addArticleTip(index);
                contribTip.style.left = -(150 - size.width / 2) + 'px';
            }
        }
        else{
            contribTip.style.left = -(125 - size.width / 2) + 'px';
            text = 'No contribution on ' + data[index].date;
            Node = document.createTextNode(text);
        }
        $(contribTip).append(Node);
        return contribTip;
    };

    Calendar.prototype.addTriangle = function(){
        var size = calendarParams.gridSize,
            triangle = document.createElement('div');
            triangle.className = 'triangle',
            triangle.style.left = - (12 - size.width / 2) + 'px';
        return triangle;
    };

    Calendar.prototype.addArticleTip = function(index){
        var data = calendarParams.total,domain = siteConfig.domain;
        var date = data[index].date,
            url  = data[index].url,
            title= data[index].title,
            tags = data[index].tags,
            excerpt = data[index].excerpt;
        var titleDiv = '',
            tagSpan = '',
            tagDiv  = '',
            excerptDiv = '',
            dateDiv = '';

        tags.split("-").forEach(function(tagName){
            tagSpan += '<span><a href="'+ domain + '?tag='+ tagName + '">'+ tagName +'</a></span>';
        });

        dateDiv = '<div class="article-date">Published on '+ date +
            '<span><a href="http://weibo.com/fanglixie"><i class="fa fa-weibo"></i></a></span>' +
            '<span><a href="https://github.com/XfLoops"><i class="fa fa-github"></i></a></span>' +
            '<span><a href="mailto:xfloops@gmail.com"><i class="fa fa-envelope-o"></i></a></span>' +
            '<span>|</span>' +
            '<span>XfLoops</span></div> ' ;

        titleDiv = '<div class="article-title"><a href="'+ url +'">'+ title +'</a></div>';
        excerptDiv = '<div class="article-excerpt">'+ excerpt +'<span><a href="' + url + '">[阅读全文]</a></span></div>';
        tagDiv = '<div class="article-tags">标签 <i class="fa fa-tags"></i>: '+ tagSpan +'</div>';

        var articleTip = dateDiv + titleDiv + excerptDiv + tagDiv;
        return articleTip;
    };

    Calendar.prototype.appendDayLabel = function () {
        var labelArr = ['','M','','W','','F',''],span,textNode,
            size = calendarParams.gridSize,
            labelWrap = document.createElement('div');
            labelWrap.className = 'day-label-wrap',
            labelWrap.style.width = size.width + 'px';

        for(var i = 0; i < labelArr.length; i++){
            span = document.createElement('span');
            span.className = 'day-label-name',
            span.style.width = size.width + 'px',
            span.style.height = (size.width + 4) + 'px';
            span.style.lineHeight = (size.width + 4) + 'px';
            textNode = document.createTextNode(labelArr[i]);
            span.appendChild(textNode);
            labelWrap.appendChild(span);
        }
        return labelWrap;
    };
    Calendar.prototype.appendMonthLabel = function () {
        var labelArr = calendarParams.month,span,text = "",textNode,
            size 	 = calendarParams.gridSize,
            firstday = calendarParams.firstday,
            position = calendarParams.LabelPosition;

        var labelWrap = document.createElement('div');
        labelWrap.className = 'month-label-wrap';
        labelWrap.style.marginLeft = size.width + 'px';

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
    };

    Calendar.prototype.appendCalendarCaption = function () {
        var footnote = '<div class="calendar-caption"><i class=""></i> Summery of blog posts,including notes,translations,project demos.<a href="https://github.com/XfLoops/github-calendar">Learn how I made this activity calendar.</a></div>';
        this.container.append(footnote);
        $('.last-year-posts').append(calendarParams.lastYearPosts.count + ' total');
        $('.last-year-posts-time').append(calendarParams.lastYearPosts.start + ' - ' + calendarParams.lastYearPosts.end);
        var longestCount = calendarParams.longestStreak.count,
            currentCount = calendarParams.currentStreak.count;
        if (longestCount > 1) {
            $('.longest-streak').append(longestCount + ' days');
        }
        else {
            $('.longest-streak').append(longestCount + ' day');
        }
        if (currentCount > 1) {
            $('.current-streak').append(currentCount + ' days');
        }
        else {
            $('.current-streak').append(currentCount + ' day');
        }
        $('.longest-streak-time').append(calendarParams.longestStreak.start + ' - ' + calendarParams.longestStreak.end);
        $('.current-streak-time').append(calendarParams.currentStreak.start + ' - ' + calendarParams.currentStreak.end);
    }
    };

    $.getJSON(siteConfig.path, function (data) {
        siteConfig.data = data;
        siteConfig.domain = data.domain;
        new Calendar(data.posts);
    });

})

