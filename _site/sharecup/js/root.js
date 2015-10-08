function DataVisualization(){

var visInfo=["主要恶性肿瘤死因构成","肿瘤各年发病数","男女肿瘤患者历年发病数","肿瘤发病与年龄的关系","发病率最高的10种肿瘤"];
			var chartType=["饼图","折线图","直方图","盒形图","雷达图"];
			var year=[2006,2007,2008,2009,2010,2011];
			var cancerTypeArray=[];
			var selectedYear=2006;
			var selectedCancer="C15";
			//draw selectList
			d3.select("select#selectVisInfo").selectAll("option")
			  .data(visInfo)
			  .enter()
			  .append("option")
			  .attr("class","options")
			  .attr("id",function(d,i){return "selectVisInfo"+i})
			  .attr("value",function(d,i){ return "visInfo_"+i;})
			  .text(function(d){ return d;})
			
			d3.select("select#selectChartType").selectAll("option")
			  .data(chartType)
			  .enter()
			  .append("option")
			  .attr("class","options")
			  .attr("id",function(d,i){ return "selectChartType"+i})
			  .attr("value",function(d,i){ return "chartType_"+i;})
			  .text(function(d){ return d;})			
			
			d3.select("select#selectYear").selectAll("option")
			  .data(year)
			  .enter()
			  .append("option")
			  .attr("class","options selectYear")
			  .attr("value",function(d,i){ return d;})
			  .text(function(d){ return d;})			
			
			d3.csv("data/barchart.csv",function(error,data){
            d3.select("select#selectCancerType").selectAll("option") 			
			  .data(data)
			  .enter()
			  .append("option")
			  .attr("class","options selectCancerType")
			  .attr("value",function(d,i){ return d.cancerType;})
			  .text(function(d){ return d.cancerType+":"+d.chname;})		    
		 });//d3.csv

            d3.csv("data/piechart.csv",function(error,data){
            	console.log("This is the first time to draw chart!")
            	drawPieChart(data,selectedYear);
            })//piechart.csv
         
         //Interactive Area
         d3.selectAll("select.selectChartType")
           .on("change",function(){
           	     var ThisValue=this.value;
           	     var i=this.selectedIndex;
           	               	     
           	     console.log("ThisValue="+ThisValue);
           	     
           	   if(ThisValue==="visInfo_0"||ThisValue==="chartType_0"){ 
           	   	  
           	   	 if(ThisValue==="visInfo_0"){
           	     d3.select("option#selectChartType"+i)
 				    .attr("selected","selected")           	   	  	
           	   	 }
           	   	 else{
 				  d3.select("option#selectVisInfo"+i)
 				    .attr("selected","selected")           	   	  	           	   	 
           	   	 };
           	   	  
           	   	  d3.csv("data/piechart.csv",function(error,data){
            	     console.log("Begin to draw pie chart!")
            	     drawPieChart(data,selectedYear);
            	  })//piechart.csv           	   	  
           	   }//piechart 
           	   
           	   else if(ThisValue==="visInfo_1"||ThisValue==="chartType_1"){
           	   	 if(ThisValue==="visInfo_1"){
           	     d3.select("option#selectChartType"+i)
 				    .attr("selected","selected")           	   	  	
           	   	  }else{
 				  d3.select("option#selectVisInfo"+i)
 				    .attr("selected","selected")           	   	  	           	   	 
           	   	  }           	   	
           	   	  
           	   	  d3.select("div#selectYear").select("select")
           	   	    .property("disabled",true);
           	   	  d3.select("div#selectCancerType").select("select")
           	   	    .property("disabled",false);           	   	    
           	   	    
           	      d3.csv("data/linechart.csv",function(error,data){           	     
            	     drawLineChart(data); 					 
           	      })//csv
           	      
           	   }//linechart
           	   
           	   else if(ThisValue==="visInfo_2"||ThisValue==="chartType_2"){
           	   	 if(ThisValue==="visInfo_2"){
           	     d3.select("option#selectChartType"+i)
 				    .attr("selected","selected")           	   	  	
           	   	  }else{
 				  d3.select("option#selectVisInfo"+i)
 				    .attr("selected","selected")           	   	  	           	   	 
           	   	  }           	   	
          	      
           	      d3.csv("data/barchart.csv",function(error,data){
            	     console.log("Begin to draw bar chart!")           	    
            	     drawBarChart(data,selectedCancer);
           	      })//csv         	   	  
           	   }//barchart
           	   
           	   else if(ThisValue==="visInfo_3"||ThisValue==="chartType_3"){         	   	
            	 if(ThisValue==="visInfo_3"){
           	     d3.select("option#selectChartType"+i)
 				    .attr("selected","selected")           	   	  	
           	   	  }else{
 				  d3.select("option#selectVisInfo"+i)
 				    .attr("selected","selected")           	   	  	           	   	 
           	   	  } 
           	   	  
           	      d3.csv("data/boxchart.csv",function(error,data){
            	     console.log("Begin to draw box chart!")           	    
            	     drawBoxChart(data);
           	      })//csv  
           	          	   
           	   }//boxchart
           	   else if(ThisValue==="visInfo_4"||ThisValue==="chartType_4"){
           	   	 if(ThisValue==="visInfo_4"){
           	     d3.select("option#selectChartType"+i)
 				    .attr("selected","selected")           	   	  	
           	   	  }else{
 				  d3.select("option#selectVisInfo"+i)
 				    .attr("selected","selected")           	   	  	           	   	 
           	   	  }           	   	
           	      d3.csv("data/radarchart.csv",function(error,data){
            	     console.log("Begin to draw radar chart!")           	    
            	     drawRadarChart(data);
           	      })//csv            	   	    

           	   }//radarchart

           });//on change

}