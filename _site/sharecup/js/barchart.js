function drawBarChart(data,selectedCancer){
var year=[2006,2007,2008,2009,2010,2011];
var sex=["male","female"];
var color =  d3.scale.category10();

	var barSvgCheck=d3.select("svg");
	if(barSvgCheck.id!=="barchartsvg"){
	    console.log("begin to initiate for bar chart!")
		d3.select("div#selectYear").select("select")
          .property("disabled",true); 	    
             d3.select("div#selectCancerType").select("select")
           	   .property("disabled",false);      		
		     d3.select()
		//DELETE SVG
		d3.select("svg")
		  .remove()
	 	//DELETE currOption
	 	console.log("this goes first!")
	   d3.select("div#currOption").selectAll("div")
	     .remove()	 
  	     
	   d3.select("h3")
	     .text("男女肿瘤患者历年发病数") 
	     .style("color","red")
	     
	}//barSvgCheck

//viewpoint
var container={width:730,height:580},
	margin={top:60,right:40,bottom:40,left:40},
	w=container.width-margin.left-margin.right,
	h=container.height-margin.top-margin.bottom;

//确定x0,x1,y
var x0 = d3.scale.ordinal()
           .rangeRoundBands([0, w], .1)
           .domain(year);   
var x1 = d3.scale.ordinal()
 		   .domain(sex)
 		   .rangeRoundBands([0, x0.rangeBand()]);
 var y = d3.scale.linear()    
    	   .range([h, 0]);

var svg = d3.select("#svgArea").append("svg")
  			.attr("id","barchartsvg")
    		.attr("width", w + margin.left + margin.right)
    		.attr("height", h + margin.top + margin.bottom)
    		.append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	filteredData=filterData();
	function filterData(){
		var tempData=data.filter(function(d){
			return d.cancerType==selectedCancer;
		});
		console.log("tempData="+tempData);
		
		var temp2Data;
		tempData.forEach(function(d){
			d.year2006male=+d.year2006male||0;
			d.year2006female=+d.year2006female||0;
			d.year2007male=+d.year2007male||0;
			d.year2007female=+d.year2007female||0;
			d.year2008male=+d.year2008male||0;
			d.year2008female=+d.year2008female||0;
			d.year2009male=+d.year2009male||0;
			d.year2009female=+d.year2009female||0;
			d.year2010male=+d.year2010male||0;
			d.year2010female=+d.year2010female||0;
			d.year2011male=+d.year2011male||0;
			d.year2011female=+d.year2011female||0;			
			
        temp2Data=[
            {year:year[0],male:d.year2006male,female:d.year2006female},
            {year:year[1],male:d.year2007male,female:d.year2007female},
            {year:year[2],male:d.year2008male,female:d.year2008female},
            {year:year[3],male:d.year2009male,female:d.year2009female},
            {year:year[4],male:d.year2010male,female:d.year2010female},
            {year:year[5],male:d.year2011male,female:d.year2011female},		
		];
		
		temp2Data.forEach(function(d){
			d.sexcount=sex.map(function(name,i){
				if(i==0)
				return {sex:name,count:d.male};
				if(i==1)
				return {sex:name,count:d.female};
			})
		});		
		});	
		return temp2Data;
	}//filterData
	
	maxVal=findmaxVal();
	
	function findmaxVal(){
	    maxValue=0;
	filteredData.forEach(function(d){
	//找出最大值
	    if(d.male>maxValue){
	    	maxValue=d.male;
	    }
	    if(d.female>maxValue){
	    	maxValue=d.female;
	    }				
	});
	//确定yscale		
    return maxValue;
	};//updateYdomain

    y.domain([0,maxVal]);

var xAxis = d3.svg.axis()
    .scale(x0)  
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format("d"));  
   
var yGrid = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)
    .tickSize(-w, 0, 0)
    .tickFormat("")  

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      
svg.append("g")         
      .attr("class", "grid")
      .call(yGrid); 

  var  _year= svg.selectAll(".cancerYear")
      .data(filteredData)
      .enter().append("g")
      .attr("class", "cancerYear")
      .attr("transform", function(d) { return "translate(" + x0(d.year) + ",0)"; }); 

      _year.selectAll("rect")
      .data(function(d){return d.sexcount})
      .enter()
      .append("rect")
      .attr("width", x1.rangeBand()) 
      .attr("x",function(d){return x1(d.sex);}) 
      .attr("y", function(d) { return y(d.count); }) 
      .attr("height", function(d) { return h - y(d.count); })
      .style("fill", function(d) { return color(d.sex); })
      .on("mouseover", function(d) { 
                d3.select(this).transition().duration(50).style("opacity", 0.5);
                d3.select("#bartooltip")
              	  .style("left", d3.event.pageX + "px")
                  .style("top", d3.event.pageY + "px")
                  .style("opacity", 1)
                  .select("#cancerTypeBar")
                  .text(selectedCancer);
            
                d3.select("#bartooltip")
             	  .style("left", d3.event.pageX + "px")
              	  .style("top", d3.event.pageY + "px")
                  .style("opacity",1) 
                  .select("#sexBar")                           
                  .text(function(){
                  	   if(d.sex=="male") return "男性";
                  	   if(d.sex=="female") return "女性";
                  })
           
                d3.select("#bartooltip")
                  .style("left", d3.event.pageX + "px")
                  .style("top", d3.event.pageY + "px")
                  .style("opacity", 1) 
                  .select("#cancerCountBar")                           
                  .text(d.count);
          
            })
       .on("mouseout", function(d) {
                d3.select(this).transition().duration(50).style("opacity", 1);
                d3.select("#bartooltip")
                  .style("opacity", 0);
            });

_year.selectAll(".pointlabels")
     .data(function(d){return d.sexcount;})
     .enter()
     .append("g")
     .attr("class","pointlabels")
     .append("text")
     .attr("x",function(d){return x1(d.sex)+x1.rangeBand()/2;})
     .attr("y",function(d){return y(d.count);})
     .text(function(d){ return d.count;})
     .attr("text-anchor", "middle")
     .attr("dy", "-0.3em");

	  var barLegend=d3.select("div#currOption")
						.selectAll("div")
						.data(sex).enter()
						.append("div")
						.attr("class","chartLegend")
     //add legend square            
    	  barLegend.append("div")
              			.attr("class","LegendSquare")
             		    .style("background-color",function(d){return color(d)})              	
     //add legend name
     	  barLegend.append("div")
              			.attr("class","LegendName")
			  			.text(function(d){ 
			  			if(d=="male")
      						return "男性";
      		  			if(d=="female")
      						return "女性";
		   }) 

	//add bar chart title
	d3.select("svg").append("text")
   	  .attr("id","barTitle")
      .text("C15食管癌男女患者历年发病数")
      .style("text-anchor","middle")
      .attr("transform","translate("+(container.width/2)+",20)")


var labels = svg.append("g")
       .attr("class","labels")
     
  labels.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".85em")
      .style("text-anchor", "end")
      .text("发病数"); 
  
  labels.append("text")
      .attr("transform", "translate(0," + h + ")")
      .attr("x", (w-margin.right))
      .attr("dx", "-0.5em")  
      .attr("dy", "1.5em")
      .text("年 份");
   

  d3.select("select#selectCancerType")
    .on("change",function(d){
      key=this.selectedIndex;
	  selectedCancer=data[key].cancerType;
	  selectedChname=data[key].chname;
	 d3.select("text#barTitle")
        .text(function(){ return selectedCancer+selectedChname+"男女患者历年发病数"}); 
	  change();
	  	  
    });

function change(){
	  filteredData=filterData();
	  maxVal=findmaxVal();  
	  redraw();

}//change

function redraw(){	 
	y.domain([0,maxVal]);		 
	yAxis = d3.svg.axis()
               .scale(y)
               .orient("left")
               .tickFormat(d3.format("d")); 

    yGrid = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)
    .tickSize(-w, 0, 0)
    .tickFormat("")

	d3.select(".y")
	  .transition()
	  .call(yAxis);
	  	
	d3.select(".grid")
	  .transition()
	  .call(yGrid);

_year= svg.selectAll(".cancerYear")
      .data(filteredData);
 
_year.selectAll("rect")
      .data(function(d){return d.sexcount})
 	  .transition().duration(500)
      .attr("x",function(d){return x1(d.sex);}) 
      .attr("y", function(d) { return y(d.count); }) 
      .attr("height", function(d) { return h - y(d.count); })

_year.selectAll(".pointlabels").select("text")
     .data(function(d){return d.sexcount;})    
     .attr("y",function(d){return y(d.count);})
     .text(function(d){ return d.count;})

   pointlabels.selectAll(".pointlabels").select("text")
   	    .data(function(d){return d.sexcount})
   	    .transition()
	    .text(function(d) { return d.count; })
	    .attr("transform", function(d) { 
                return "translate(" + x1(d.sex) + "," + y(d.count) + ")"; });


}//redraw

}//drawBarChart