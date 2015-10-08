function drawPieChart(data,selectedYear){
	  //initiate check
	  var pieSvgCheck=d3.select("svg");
	  if(pieSvgCheck.id!=="piechartsvg"){
	  	console.log("begin to initiate for pie chart")
		
		d3.select("div#selectYear").select("select")
          .property("disabled",false); 
	    d3.select("div#selectCancerType").select("select")
          .property("disabled",true); 
				
		//DELETE SVG
		d3.select("svg")
		  .remove()
	 	//DELETE currOption
	    d3.select("div#currOption").selectAll("div")
	      .remove()		  
	    d3.select("h3")
	      .text("主要恶性肿瘤死因构成")	 
	      .style("color","red")
	  }//pieSvgCheck
	 	   
//viewpoint
var container={width:730,height:580},
	margin={top:60,right:40,bottom:40,left:40},
	w=container.width-margin.left-margin.right,
	h=container.height-margin.top-margin.bottom;
			
//set svg
var svg = d3.select("div#svgArea").append("svg")
    .attr("id","piechartsvg")
    .attr("width", container.width)
    .attr("height",container.height)
    .append("g")
    .attr("transform", "translate("+(container.width/2)+"," +(container.height/2+margin.top/2)+ ")");	
//set color
var color = d3.scale.category10(); 
//set radius
var radius = Math.min(w,h) / 2;
//declare an arc generator function
var arc = d3.svg.arc().outerRadius(radius)
    			      .innerRadius(0);	
var arcOver = d3.svg.arc()
                .outerRadius(radius + 20);
//pie
var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.cancerCount; });  
//begin drawing					           			
			var sliceProportion;
			filteredData=filterData();
						
            function filterData(){
                sliceProportion=0;	
            var tempData=data.filter(function(d){
  	            return d.year==selectedYear;  	            
  	        });//data.filter()	
			//parse data
			tempData.forEach(function(d){
				d.cancerCount=+d.cancerCount;
				d.cancerType=d.cancerType||null;
				d.cancerYear=d.year;
				sliceProportion+=d.cancerCount;
			});	//forEach							
			return tempData;
};
            
// select paths, use arc generator to draw
var g = svg.selectAll(".arc")
      	   .data(pie(filteredData))
           .enter().append("g")
           .attr("class", "arc")  

//fill the path with color
 var path=g.append("path")
      	  .attr("d", arc)
          .style("fill", function(d) { return color(d.data.cancerType); })
          .each(function(d) { this._current = d; })// store the initial angles
	      .on("mouseenter", function(d) {            
         var percent = (d.data.cancerCount/sliceProportion)*100;            
            //change arc
             d3.select(this)
               .transition()
               .duration(300)
               .attr("d", arcOver)
               .style("opacity",0.50);
               
            //pietooltips
            d3.select("#pietooltip")
              .style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY + "px")
              .style("opacity", 1)
              .select("#cancer_label")
              .text(d.data.cancerType);
              
            d3.select("#pietooltip")
              .style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY + "px")
              .style("opacity",1) 
              .select("#cancer_label_count")                           
              .text(d.value); 
           
            d3.select("#pietooltip")
              .style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY + "px")
              .style("opacity", 1) 
              .select("#cancer_percentage")                           
              .text(percent.toFixed(1));     	   
                     
            })
  	      .on("mouseleave", function(d) {
            d3.select(this)           
               .transition()
               .duration(300)                             
               .attr("d", arc)
               .style("opacity",1);
            
            d3.select("#pietooltip")
              .style("opacity", 0);
        });	
           
//label at the margin of pie
labels=g.append("text")
        .attr("transform", function(d) {
		 var dist=radius+20;
		 var winkel=(d.startAngle+d.endAngle)/2;
		 var x=dist*Math.sin(winkel);
		 var y=-dist*Math.cos(winkel);
		     return "translate(" + x + "," + y + ")";
})   		
      .style("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text(function(d) { return d.data.cancerType; });
						                        
 	 d3.select("select#selectYear")
       .on("change",function(){
    	 selectedYear=this.value;	
         change();
 	})//.on change

//add pieTitle
 d3.select("svg").append("text")
   .attr("id","pieTitle")
   .text("2006年主要恶性肿瘤死因构成")
   .style("text-anchor","middle")
   .attr("transform","translate("+(container.width/2)+","+ margin.top/2 +")")
   
 var pieLegend=d3.select("div#currOption")
   				 .selectAll("div")
                 .data(filteredData).enter()                
                 .append("div")
                 .attr("class","chartLegend");
     //add legend square            
     pieLegend.append("div")
              .attr("class","LegendSquare")
              .style("background-color",function(d){ 
              	if(d.cancerType!==null)
              	return color(d.cancerType)})
     //add legend name
     pieLegend.append("div")
              .attr("class","LegendName")
			  .text(function(d){ return d.cancerType; })
 
 function change(){
 	updateData=filterData();
        svg.each(function() {
		path = path.data(pie(updateData))
		path.transition().duration(500).attrTween("d", arcTween); 
		labels=labels.data(pie(updateData))
		             .text(function(d) { return d.data.cancerType; })
		             .attr("transform",function(d){
		             	var dist=radius+20;
		 			 	var winkel=(d.startAngle+d.endAngle)/2;
		             	var x=dist*Math.sin(winkel);
		             	var y=-dist*Math.cos(winkel);
		     return "translate(" + x + "," + y + ")";	
		             });
		});	
		d3.select("text#pieTitle")
		  .text(function(){ return selectedYear+"年主要恶性肿瘤死因构成"})
		
		d3.selectAll("div.LegendSquare")
		  .data(updateData)
		  .style("background-color",function(d){ 
              	if(d.cancerType!==null)
              	return color(d.cancerType)})
		console.log("change legend")
		
		d3.selectAll("div.LegendName")
		  .data(updateData)
	      .text(function(d){ return d.cancerType; })		  				
 }//change()
 //# transition.attrTween(name, tween)
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

}//drawPieChart
