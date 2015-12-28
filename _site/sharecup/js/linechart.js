		function drawLineChart(data){
	   
	    var lineSvgCheck=d3.select("svg");
	    if(lineSvgCheck.id!=="linechartsvg"){
	    console.log("begin to initiate for line chart!")
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
	     .text("肿瘤各年发病数") 
	     .style("color","red")
	     
	}//barSvgCheck		
		
		
		//declear variables
	    var year=[2006,2007,2008,2009,2010,2011];
		var selectedCancer;
		var maxValue=1;
		var maxValueBox=[];
				
		var container={width:730,height:580},
		    margin={top:60,right:20,bottom:60,left:50},
		    w=container.width-margin.left-margin.right,
		    h=container.height-margin.top-margin.bottom;
		
		//set x,y domain,range  	
		var xScale=d3.scale.ordinal()   
		             .rangeRoundBands([0, w], 1.)
                     .domain(year); 
		var yScale=d3.scale.linear()    
    	   			 .range([h, 0])
    	   			 .domain([0,maxValue]);
		
		//set xAxis,xGrid,yAxis,yGrid
		var xAxis = d3.svg.axis()
                      .scale(xScale)  
                      .orient("bottom")                     
	    var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left")
					  .ticks(10)	
					  .tickFormat(d3.format("d")) 
        var xGrid = d3.svg.axis()
                      .scale(xScale)
                      .orient("bottom")
                      .ticks(10)
                      .tickSize(-h, 0, 0)
    				  .tickFormat("")               
        var yGrid = d3.svg.axis()
                      .scale(yScale)
                      .orient("left")
                      .ticks(20)
                      .tickSize(-w, 0, 0)
                      .tickFormat("")
			
        var svg=d3.select("#svgArea")
                  .append("svg")
                  .attr("id","barchartsvg")
                  .attr("width",container.width)
                  .attr("height",container.height)
                  .append("g")
                  .attr("transform","translate("+margin.left+","+margin.top+" )")
 
 		//add line chart title
 		svg.append("g")
 		   .attr("id","charttitle")
 		   .append("text")
 		   .attr("x",0.4*w)
 		   .attr("y",-0.5*margin.top)
 		   .text("2006-2011肿瘤发病数")
 
 		//draw xAxis,xGrid,yAxis,yGrid
        svg.append("g")
      		.attr("class", "x axis")
      		.attr("id","xAxis")
      		.attr("transform", "translate(0," + h + ")")
            .call(xAxis)
  		svg.append("g")
      		.attr("class", "y axis")
      		.attr("id","yAxis")
            .call(yAxis)								
  		svg.append("g")         
        	.attr("class", "grid")
        	.attr("id","xGrid")
        	.attr("transform", "translate(0," + h+ ")")
            .call(xGrid)
  		svg.append("g")         
        	.attr("class", "grid")
        	.attr("id","yGrid")
        	.call(yGrid)		
 
 		//add label to xAxis,yAxis
        var labels = svg.append("g")
                        .attr("class","axisLabels")   
                  labels.append("text")
      					.attr("transform", "translate(0," + h + ")")
      					.attr("x", (w-margin.right))
      					.attr("dx", "-0.5em")  
      					.attr("dy", "2.5em")
      					.text("年  份")
  				  labels.append("text")
      					.attr("transform", "rotate(-90)")
      					.attr("y", -margin.left)
      					.attr("dy", "1.1em")
      					.style("text-anchor", "end")
      					.text("发病数");	

		
		function filterData(type){	
        console.log("1:filterData");
		var tempData=data.filter(function(d){
			return d.cancerType==type;
		});
		var temp2Data;
		//reformate the original data
		tempData.forEach(function(d){
			d.year2006=+d.year2006||0;
			d.year2007=+d.year2007||0;
			d.year2008=+d.year2008||0;
			d.year2009=+d.year2009||0;
			d.year2010=+d.year2010||0;
			d.year2011=+d.year2011||0;	
		
        temp2Data=[
			{year:year[0],value:d.year2006},
			{year:year[1],value:d.year2007},
			{year:year[2],value:d.year2008},
			{year:year[3],value:d.year2009},
			{year:year[4],value:d.year2010},
			{year:year[5],value:d.year2011}
		]      
		});//forEach
		return temp2Data;
	}//filterData

		function updateYAxis(dt,type){
		console.log("3:drawAxis")		
		maxVal=d3.max(dt,function(d){ return d.value;});
		
		if(maxVal>maxValue){
			maxValue=maxVal;
			console.log("maxValue="+maxValue);
			yScale.domain([0,maxValue]);
			d3.select("#yAxis")
 			  .transition()
              .call(yAxis)
            d3.select("#yGrid")
              .transition()
              .call(yGrid)
            //redraw the old lines
            maxValueBox.forEach(function(d){
              d3.select("#line"+d.type)
		        .remove();
		      filteredData=filterData(d.type);
		      draw(filteredData,d.type);           
            })//forEach
            
		}//maxVal>maxValue
		maxValueBox.push({type:type,max:maxVal});
		console.log("maxValueBox="+maxValueBox);
	}//updateYAxis
		
		function checkYAxis(type){
			
			maxValueBox=maxValueBox.filter(function(d){
				return d.type!==type;				
			})//filter
			if(maxValueBox.length==0){
				maxValue=1;
				yScale.domain([0,maxValue]);			   
			   d3.select("#yAxis")
 			     .transition()
                 .call(yAxis)
               d3.select("#yGrid")
                 .transition()
                 .call(yGrid)
			}//maxValueBox.length==0
		var temp=d3.max(maxValueBox,function(d){ return d.max;});	
		    if(temp<maxValue){
		    	maxValue=temp;
		    	yScale.domain([0,maxValue]);
			   
			   d3.select("#yAxis")
 			     .transition()
                 .call(yAxis)
               d3.select("#yGrid")
                 .transition()
                 .call(yGrid)

            //redraw the old lines
            maxValueBox.forEach(function(d){
              d3.select("#line"+d.type)
		        .remove();
		      filteredData=filterData(d.type);
		      draw(filteredData,d.type);           
            })//forEach
		    
		    }//temp<maxValue
	}//checkYAxis
			
		function drawLine(dt,type){
		console.log("4:drawLine");
		var line = d3.svg.line()
    	             .x(function(d) { return xScale(d.year); })
    	             .y(function(d) { return yScale(d.value); })
    	             .interpolate("linear");
          	
        var singleLine=svg.append("g")
                          .attr("id","line"+type);
     
        //draw the line of data
  		  singleLine.append("g")
  		     .attr("class","line color"+type)
  		     .attr("id","line_"+type)
  		     .append("path")
             .datum(dt)
             .attr("d", line);
             
        //add circle     
        var circle=singleLine.append("g")
                      .attr("id",type)
                      .attr("class","lineCircles color"+type);
           
           circle.selectAll('circle')
                 .data(dt)
                 .enter()
                 .append("circle")
                 .attr('cx', function(d) {return xScale(d.year)})
                 .attr('cy', function(d) {return yScale(d.value)})
                 .attr('r',0);
                       
        // circle transition
 		var enterDuration = 1000;
 	        circle.selectAll('circle')
                  .transition()
                  .delay(function(d, i) { return i / dt.length * enterDuration; })
                  .attr('r', 5)
                  .each('end',function(d,i){
                     if (i === dt.length-1){
                          addLabel(this,d,type)
                     }
            });
            
			// mouseover
			circle.selectAll('circle')
                  .on('mouseover', function(d){
                d3.select(this)
                  .transition().attr('r', 8)
                    })//mouseover
                  .on('mouseout', function(d,i){
                      if (i !== dt.length-1) {
                          d3.select(this).transition().attr('r', 5)
                      }
                    });  //mouseout         
          
            //add tooltips
            circle.selectAll('circle')
                  .on('mouseover.tooltip', function(d){              
                d3.select("text.tooltipText").remove();//remove the tooltip on the same line
                d3.select('#'+type)
                  .append('text')
                  .text(d.value)
                  .attr('x', xScale(d.year) + 10)
                  .attr('y', yScale(d.value) - 10)
                  .attr('class',"tooltipText color"+type);
                    })//mouseover.tooltip
            .on('mouseout.tooltip', function(d){
                d3.select("text.tooltipText")
                  .transition()
                  .duration(500)
                  .style('opacity',0)
                  .attr('transform','translate(10, -10)')
                  .remove()
                 })//mouseout.tooltip
         } //drawLine       
                    
	  //add a label on the end of line {filteredData,selectedCancer}
	  function addLabel(circle, d, type){
        d3.select(circle)
            .transition()
            .attr('r', 8)       
        d3.select('#'+type).append('text')
            .text(type)
            .attr('text-anchor','middle')
            .style("dominant-baseline","central")
            .attr('x', xScale(d.year))
            .attr('y', yScale(d.value))
            .attr('class','linelabel')
            .style('opacity',0)
            .style('fill','white')
            .style("fonts-size","10px")
            .transition()
            .style('opacity',1)        
          }//addLabel
 
//In optionArea add checkbox list           
var oneList= d3.select("body").select('div#currOption')
               .selectAll("div")   
 			   .data(data).enter()
 			   .append("div") 					 
 			   .attr("class","oneList");	
      			         			              
             oneList.append("div")
                    .attr("class","forcheckboxs")
                    .attr("id",function(d){ return "forcheckboxs"+d.cancerType;})
                    .append("input")
                    .attr("type","checkbox")
                    .attr("value",function(d){ return d.cancerType})
                    .attr("class","checkboxs")
                    .attr("id",function(d){return "checkbox"+d.cancerType;});
                                 
var legendGroup=oneList.append("div")
                       .attr("class","legendGroup")
                    
            legendGroup.append("div")
                       .attr("class",function(d){ return "legendSquare color"+d.cancerType})
         
            legendGroup.append("div")
                       .attr("class","legendName")
                       .text(function(d){ return d.cancerType});

var selAll=d3.select("div#currOption")
                .append("div")
                .attr("class","oneList")  
    selAll.append("div")
          .attr("class","forcheckboxs")
          .append("input")
          .attr("class","checkboxs")
		  .attr("type","checkbox") 
		  .attr("value","selectAll")
     
     selAll.append("div")
           .attr("id","selectAll")
           .text("全选")


		function draw(dt,type){
		console.log("2:drawLine");			
        //first draw axis!
         updateYAxis(dt,type);
	     drawLine(dt,type);						
		}//draw
		
		function drawAllLines(){
		  console.log(" starting :draw all lines")
		  maxValueBox.forEach(function(d){
              d3.select("#line"+d.type)
		        .remove();		  			  
		  })//delete current lines
		  maxValueBox=[];
		  console.log("maxValueBox="+maxValueBox);
		  yScale.domain([0,760]);
			  d3.select("#yAxis")
 			    .transition()
                .call(yAxis)
              d3.select("#yGrid")
                .transition()
                .call(yGrid)
		  data.forEach(function(d){
              d3.select("#forcheckboxs"+d.cancerType)
                .select("input")
                .property("disabled",true)                
		      filteredData=filterData(d.cancerType);
		      drawLine(filteredData,d.cancerType);		  	  
		  	  
		  })//forEach add line one by one
	    
		}//drawAllLines
		
		function deleteAllLines(){
			data.forEach(function(d){			  			    
			  d3.select("#line"+d.cancerType)
			    .remove();
			  d3.select("#forcheckboxs"+d.cancerType)
			    .select("input")
			    .property("disabled",false)  
//				.property("checked",false)
			})//forEach
			  							
			maxValue=1;
		    yScale.domain([0,1]);
			    d3.select("#yAxis")
 			      .transition()
                  .call(yAxis)
                d3.select("#yGrid")
                  .transition()
                  .call(yGrid)			
		}//deleteAllLines
		
		//listen events
  		d3.selectAll(".checkboxs")
		  .on("change",function(){
		      selectedCancer=this.value;		      		  	  
		      
		      if(this.checked){
		      	 if(this.value!=="selectAll"){
		      console.log("start addine a line from here!");
		      filteredData=filterData(selectedCancer);		      
		      draw(filteredData,selectedCancer);
		      console.log("this is the end!");	
		      	 }//this.value!=="selectAll"
				 else{
				 	console.log("start draw all lines!")
				 	drawAllLines();
				 }//draw all lines				 
		      }//if selected
		      
		      else{
		      	if(this.value!=="selectAll"){
		  	  console.log("start delete line from here!");
		  	  d3.select("#line"+selectedCancer)
		        .remove();
		  	  checkYAxis(selectedCancer);		      
		      console.log("maxValueBox="+maxValueBox);
		      console.log("A line has been deleted from chart!");
		      }//this.value!=="selectAll"
		        else{
		        	console.log("deleteAllLines");
		        	deleteAllLines();
		        }
		      	
		      }//if unselected
		      		      
		  });//on change
          
          d3.select("select#selectCancerType")
            .on("change",function(){
            	selectedCancer=this.value;
            	var ts=d3.select("#line"+selectedCancer);
            	if(ts.empty()){
		      filteredData=filterData(selectedCancer);		      
		      draw(filteredData,selectedCancer);            		
            	}
            	else ts.remove();           	
            })//select change
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          


}