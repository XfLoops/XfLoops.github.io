function drawBoxChart(data){
	var boxSvgCheck=d3.select("svg");
	if(boxSvgCheck.id!=="boxchartsvg"){
	    console.log("begin to initiate for bax chart!")
		d3.select("div#selectYear").select("select")
          .property("disabled",true);
        d3.select("div#selectCancerType").select("select")
          .property("disabled",true);		
		//DELETE SVG
		d3.select("svg")
		  .remove()
	 	//DELETE currOption
	   d3.select("div#currOption").selectAll("div")
	     .remove()	 	     
	   d3.select("h3")
	     .text("肿瘤发病与年龄的关系") 
	     .style("color","red")
	     
	}//boxSvgCheck	
	
var margin = {top: 60, right: 40, bottom: 40, left: 40},
    w = 730 - margin.left - margin.right,
    h = 580 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;
			
var x = d3.time.scale()
    .range([0, w]);

var y = d3.scale.linear()
    .range([h, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%Y"))
    .ticks(6);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
	
var svg = d3.select("div#svgArea").append("svg")
   			.attr("id","boxchartsvg")
    		.attr("width", w + margin.left + margin.right)
    		.attr("height", h + margin.top + margin.bottom)
    		.append("g")
    		.attr("transform", "translate(" +margin.left+ "," +margin.top+ ")");

  var maxVal = -1000;
  var minVal = 1000;
  data.forEach(function(d) {
    d.year = parseDate(d.year);
    d.Q1 = +d.Q1||null;
    d.Q3 = +d.Q3||null;
    d.max = +d.max||null;
    d.min = +d.min||null;
    d.median=+d.median||null;
    if (d.max > maxVal) 
    	maxVal = d.max;
    if (d.min < minVal)
    	minVal = d.min;
  });

  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain([minVal,maxVal]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis)

svg.append("text")
      .attr("class", "label")
      .attr("x", w)
      .attr("y", h-6)
      .style("text-anchor", "end")
      .text("年份")

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
  
  svg.append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y",8)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("年龄")

//画竖线
  svg.selectAll("line.ext")
	  .data(data)
	  .enter().append("svg:line")
	  .attr("class", "ext")
	  .attr("x1", function(d) { return x(d.year)})
	  .attr("x2", function(d) { return x(d.year)})		    
	  .attr("y1", function(d) { return y(d.min);})
	  .attr("y2", function(d) { return y(d.max);});

//画最小
  svg.selectAll("line.ext1")
	  .data(data)
	  .enter().append("svg:line")
	  .attr("class", "ext1")
	  .attr("x1", function(d) { return x(d.year)+8})
	  .attr("x2", function(d) { return x(d.year)-8})		    
	  .attr("y1", function(d) { return y(d.min);})
	  .attr("y2", function(d) { return y(d.min);})

//画最大
  svg.selectAll("line.ext2")
	  .data(data)
	  .enter().append("svg:line")
	  .attr("class", "ext2")
	  .attr("x1", function(d) { return x(d.year)+8})
	  .attr("x2", function(d) { return x(d.year)-8})		    
	  .attr("y1", function(d) { return y(d.max);})
	  .attr("y2", function(d) { return y(d.max); });

//画长方形
  svg.selectAll("rect")
     .data(data)
     .enter().append("svg:rect") 
     .attr("x", function(d) { return x(d.year)-14; })
     .attr("y", function(d) { return y(Math.max(d.Q1, d.Q3));})		  
     .attr("height", function(d) { 
         return y(Math.min(d.Q1, d.Q3))-y(Math.max(d.Q1, d.Q3));})
     .attr("width",28)
     .attr("fill","#fff")
     .style("stroke-width","1.5px")
     .style("stroke","#000")
     .on("mouseover",function(){d3.select(this).transition().duration(50).style("fill", "#bcbd22");})
     .on("mouseout", function() { d3.select(this).transition().duration(50).style("fill", "#fff")});
                             
  //画中位线
  svg.selectAll("line.ext3")
	  .data(data)
	  .enter().append("svg:line")
	  .attr("class", "ext3")
	  .attr("x1", function(d) { return x(d.year)+14})
	  .attr("x2", function(d) { return x(d.year)-14})		    
	  .attr("y1", function(d) { return y(d.median);})
	  .attr("y2", function(d) { return y(d.median);});

//给min加标签
svg.selectAll(".minmarks")
   .data(data)
   .enter().append("svg:text")
   .attr("class","marks minmarks")
   .style("text-anchor","start")
   .attr("x",function(d) { return x(d.year)+15})
   .attr("y",function(d) { return y(d.min)+3; })
   .text(function(d){return d.min;});
   
//给max加标签
svg.selectAll(".maxmarks")
   .data(data)
   .enter().append("svg:text")
   .attr("class","marks maxmarks")
   .style("text-anchor","start")
   .attr("x",function(d) { return x(d.year)+15})
   .attr("y",function(d) { return y(d.max)+3; })
   .text(function(d){return d.max;});

////给Q1加标签
svg.selectAll(".q1marks")
   .data(data)
   .enter().append("svg:text")
   .attr("class","marks q1marks")
   .style("text-anchor","start")
   .attr("x",function(d) { return x(d.year)+15; })
   .attr("y",function(d) { return y(d.Q1)+3;})
   .text(function(d){return d.Q1;});
//给Median加标签
svg.selectAll(".medianmarks")
   .data(data)
   .enter().append("svg:text")
   .attr("class","marks medianmarks")
   .style("text-anchor","start")
   .attr("x",function(d) { return x(d.year)+15})
   .attr("y",function(d) { return y(d.median);})
   .text(function(d){return d.median;});

////给Q3加标签
svg.selectAll(".q3marks")
   .data(data)
   .enter().append("svg:text")
   .attr("class","marks q3marks")
   .style("text-anchor","start")
   .attr("x",function(d) { return x(d.year)+15})
   .attr("y",function(d) { return y(d.Q3)+3; })
   .text(function(d){return d.Q3;});

//表格标题
var title = d3.select("svg").append("g")
      .attr("transform", "translate(" +margin.left+ "," +margin.top+ ")")
      .attr("class","title")
     
    title.append("text")
      .attr("x", (w / 2))             
      .attr("y", -30 )
      .attr("text-anchor", "middle")  
      .style("font-size","18px") 
      .text("2006-2011肿瘤发病与年龄的关系");
     
}