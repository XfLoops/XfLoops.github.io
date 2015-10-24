$(function() {

/*******************************\
        DRAW CALENDAR
\*******************************/
    /* CONFIGERATION */
    var init = "2014-11-16";
    var curr = new Date();
    var dataFile = "../data.json";
    var months = ['Jan', 'Feb', 'Mar',
        'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec'];

    /* NUMBER FORMAT */
    var numberFormat = function(num){
        if((typeof num === 'number') && num < 10) return '0' + num;
        return num;
    }

    /* DATA PREPARE */
    var today = months[curr.getMonth()] + " " + numberFormat(curr.getDate()) + "," + curr.getFullYear();
    var days = Math.floor((curr.getTime() - Date.parse(init)) / 86400000);
    var weeks = Math.ceil(days / 7);

    var period = days;
    var DATA = [];
    var allTimePosts,currentYearPosts;

    /* PARSE DATA IN DATA.JSON FILE */
    $.getJSON(dataFile,function(json){
        allTimePosts = json.allTimePosts + ' total';
        currentYearPosts = json.currentYearPosts + ' total';
        var dataSet = json.dataSet;

        $('.allTimePosts').text(allTimePosts);
        $('.currentYearPosts').text(currentYearPosts);
        $('.current').text(today);
        $('.header .time').text(days + ' Days');

        DATA = generateDATASET(dataSet,init,period);
        startPainting();
    });

    var startPainting = function(){
        /* START POINT */
        var box = $('<div class="box"/>');
        var container = $('<div class="container"/>').append(box);
        var moth1 = '<div class="month moth1">' + addMothName('Nov','Jun') +'</div>';
        //@todo MOTHNAME IS TO BE MAINTAINED
        var moth2Range = getMothName(curr);
        var moth2 = '<div class="month moth2">' + addMothName('Jun',moth2Range) + '</div>';

        /* ADD WEEKDAY IN MONTH */
        var weekday = '<div class="weekday">' + appendWeekday() + '</div>';

        $('.calendar').append(container);
        $('.calendar .box').prepend(moth1);

        $('.moth1').append(weekday);

        /*  BEGIN TO DRAW GRIDS */
        for(var i = 0; i < weeks; i++){
            if(i === 30){
                box.append(moth2);
                $('.moth2').append(weekday);
            }
            box.append('<div class = "week wk' + i +'"/>');
            appendSevenDays($('.wk' + i),i);
        }

    }

    /* ADD INDEX TO ITEM IN DATASET */
    var addIndex = function(dataset,firstday){
        var firstdayTime = Date.parse(firstday);
        dataset.forEach(function(el){
            var dayTime = Date.parse(el.date);
            el.index = Math.floor((dayTime - firstdayTime) / 86400000);
        })
        return dataset;
    }

    /* GENERATE DATASET FOR ALL DAYS*/
    var generateDATASET = function (dataSet, firstday,days) {
        var day = firstday;
        var data = [];

        dataSet = addIndex(dataSet,firstday);

        for(var i = 0; i < days; i++){
            data[i] = {"flag":3,"date":day};
            day = nextDay(day);
        }

        for(var j = 0; j < dataSet.length; j++){
            data[dataSet[j].index] = dataSet[j];
            //console.log(data[dataSet[j].index]);
        }

        return data;
    }


    /* GET NEXT DAY */
    var nextDay = function(day){
        var dayTime = Date.parse(day);
        var temp = new Date();
        temp.setTime(dayTime + 86400000)

        return temp.getFullYear() + '-' + numberFormat(temp.getMonth() + 1) + '-' + numberFormat(temp.getDate());
    }

    /* WHICH DAY IS THE DAY */
    var whichDay = function (day) {
        var temp = new Date();
        temp.setTime(Date.parse(day));
        return temp.getDay();
    }

    /* ADD CLASS MARK BASED ON FLAG */
    var addMark = function(elem,i){
        if(DATA[i].flag === 0){
            elem.addClass("isNote");
        }
        else if(DATA[i].flag === 1){
            elem.addClass("isWork");
        }
        else if(DATA[i].flag === 2){
            elem.addClass("isRevision");
        }
        else if(DATA[i].flag === 3){
            elem.addClass("isBlank");
        }
    }

    /* APPEND SEVEN DAYS IN A WEEK */
    var appendSevenDays = function(elem,i){
        for(var j = 0; j < 7; j++){
            var index = 7 * i + j;
            if(index === 1){
                elem.append('<span class="initday day d' + index +'" >');
                appendInitdayTip($('.initday'),index)
            }
            else if(index === days){
                elem.append('<span class="today day d' + index +'" >');
                appendTodayTip($('.today'),index);
            }
            else{
                elem.append('<span class="day d' + index +'" >');
            }

            addMark($('.d' + index),index);
            appendTooltip($('.d' + index),index);
        }
    }

    var appendWeekday = function(){
        var elem = "";
        for(var i = 0; i < 7; i++){
            if(i === 1){
                elem += '<span class="dayName">M</span>';
            }
            else if(i === 3){
                elem += '<span class="dayName">W</span>';
            }
            else if(i === 5){
                elem += '<span class="dayName">F</span>';
            }
            else{
                elem += '<span class="dayName"></span>';
            }
        }
        return elem;
    }

    /* ADD MONTH NAME */
    var addMothName = function (start, end) {
        var startIndex = months.indexOf(start);
        var endIndex = months.indexOf(end);
        var subMoth,elem = "";

        if(startIndex < endIndex){
            subMoth = months.slice(startIndex,(endIndex + 1));
        }
        else{
            subMoth = months.slice(startIndex).concat(months.slice(0,(endIndex + 1)));
        }

        for(var i = 0; i < subMoth.length; i++){
            elem += '<span class="mothName mothName' + i + '">'+ subMoth[i] + '</span>'
        }

        return elem;
    }

    /* GET MONTH NAME */
    var getMothName = function(day){
        var curr = new Date();
        var months = ['Jan', 'Feb', 'Mar',
            'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'];

        if(curr.getDate() > 10){
            return months[curr.getMonth()];
        }
        else
            return months[curr.getMonth() - 1];
    }

    /* NOTE TOOLTIP STYLE */
    var appendNoteTip = function(elem,i){

        var publishDate = DATA[i].date;
        var views = DATA[i].views;
        //var comments = DATA[i].comments;
        var flag = DATA[i].flag;
        var siteURL = 'http://xfloops.com';
        var link = siteURL + DATA[i].link;
        var title = DATA[i].title;
        var related = DATA[i].related;
        var relatedLink = siteURL + DATA[i].relatedLink;
        var tags = DATA[i].tags;
        var TAG = "";

        //@TODO add link
        var postTitle = '<div class="post-title"><a href="'+ link +'">'+ title +'</a></div>';
        var relatedPost = '<span class="post-title"><a href="'+ relatedLink +'">'+ related +'</a></span>';

        /* CREATE TAG LINK */
        tags.split(" ").forEach(function(el){
            //@TODO add link
            TAG += '<span><a href="#">'+ el +'</a></span>';
        });
        var postTags = '<div class="post-tags">Tags: '+ TAG +'</div>';


        var activityStatus =
            '<div class="tip-header">Published on '+ publishDate +'<span><a href="http://weibo.com/fanglixie">XfLoops</a></span><span>|</span><span>学习者</span></div> ' +
            postTitle + postTags +
            '<span>Related post: </span>' + relatedPost

        var tringle = $('<span class="tringle"/>');

        elem.append('<div class="activity-tip tip' + i +'"/>');
        $('.tip' + i).append(activityStatus);
        $('.tip' + i).append(tringle);

}

    /* APPEND NO ACTIVITY TOOLTIP */
    var appendNoActivityTip =function(elem,i){
        var publishDate = DATA[i].date;
        var activityStatus = 'No activity on ' + publishDate;
        var tip = $('<div class="activity-tip no-activity-tip">'+ activityStatus +'</div>');
        var tringle = $('<span class="tringle no-activity-tri"/>');

        tip.append(tringle);
        elem.append(tip);
    }

    /* APPEND WORK TIP  */
    var appendWorkTip = function(elem,i){

        var publishDate = DATA[i].date;
        var desc = DATA[i].desc;
        var flag = DATA[i].flag;
        var img = DATA[i].img;
        var src = DATA[i].src;
        var title = DATA[i].title;
        var tags = DATA[i].tags;
        var TAG = "";

        //@TODO add link
        var postTitle = '<div class="post-title"><a href="'+ src +'" target="_blank">'+ title +'</a></div>';
        var descInfo = '<span class="post-title"><a href="'+ src +'" target="_blank">'+ desc +'</a></span>';

        /* CREATE TAG LINK */
        tags.split(" ").forEach(function(el){
            //@TODO add link
            TAG += '<span><a href="#">'+ el +'</a></span>';
        });
        var postTags = '<div class="post-tags">Tags: '+ TAG +'</div>';


        var activityStatus =
            '<div class="tip-header">Published on '+ publishDate +'<span><a href="http://weibo.com/fanglixie">XfLoops</a></span><span>|</span><span>开发者</span></div> ' +
            postTitle + postTags +
            '<span>Description: </span>' + descInfo +
            '<div class="work-img"><img src='+ img +'></div>'


        var tringle = $('<span class="tringle"/>');

        elem.append('<div class="activity-tip tip' + i +'"/>');
        $('.tip' + i).append(activityStatus);
        $('.tip' + i).append(tringle);

    }

    /* APPEND REVISION TIP */
    var appendRevisionTip = function(elem,i){

        var publishDate = DATA[i].date;
        var flag = DATA[i].flag;
        var link = DATA[i].link;
        var platform = DATA[i].platform;
        var title = DATA[i].title;
        var views = DATA[i].views;
        var tags = DATA[i].tags;
        var TAG = "";

        //@TODO add link
        var postTitle = '<div class="post-title"><a href="'+ link +'">'+ title +'</a></div>';
        var platformInfo = '<span class="post-title"><a href="'+ link +'">'+ platform +'</a></span>';

        /* CREATE TAG LINK */
        tags.split(" ").forEach(function(el){
            //@TODO add link
            TAG += '<span><a href="#">'+ el +'</a></span>';
        });
        var postTags = '<div class="post-tags">Tags: '+ TAG +'</div>';

        var viewsAmt = views === "" ? "" : '<span class="views">阅读量: '+ views +'</span>';

        var activityStatus =
            '<div class="tip-header">Published on '+ publishDate +'<span><a href="http://weibo.com/fanglixie">XfLoops</a></span><span>|</span><span>译者</span></div> ' +
            postTitle + postTags +
            '<span>发布平台: </span>' + platformInfo + viewsAmt;

        var tringle = $('<span class="tringle"/>');

        elem.append('<div class="activity-tip tip' + i +'"/>');
        $('.tip' + i).append(activityStatus);
        $('.tip' + i).append(tringle);
    }

    /* APPEND INITDAY TIP */
    var appendInitdayTip = function (elem,i) {
        var publishDate = DATA[i].date;
        var activityStatus = ' First Day Of My Blog ! ' + publishDate;
        var tip = $('<div class="activity-tip no-activity-tip">'+ activityStatus +'</div>');
        var tringle = $('<span class="tringle no-activity-tri"/>');

        tip.append(tringle);
        elem.append(tip);
    }

    /* APPEND TODAY TIP */
    var appendTodayTip = function(elem,i){
        var publishDate = DATA[i-1].date;
        var activityStatus = 'Today is ' + nextDay(publishDate);
        var tip = $('<div class="activity-tip no-activity-tip">'+ activityStatus +'</div>');
        var tringle = $('<span class="tringle no-activity-tri"/>');

        tip.append(tringle);
        elem.append(tip);
    }

    /* APPEND TOOLTIPS  */
    var appendTooltip = function(elem,i){
        if(i > 1){
            if(elem.hasClass("isNote")){
                appendNoteTip(elem,i);
            }
            //NO ACTIVITY
            else if(elem.hasClass("isRevision")){
                appendRevisionTip(elem,i);
            }
            else if(elem.hasClass("isWork")){
                appendWorkTip(elem,i);
            }
            else if(elem.hasClass("isBlank")){
                appendNoActivityTip(elem,i);
            }

        }
    }


});

