// Define SVG area dimensions
var svgWidth = 690;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`); 



d3.csv("assets/data/data.csv").then (function(stateData) {
  stateData.forEach(function(data) {
    data.age = +data.age
    data.healthcare = +data.healthcare
    data.income = +data.income
    data.obesity = +data.obesity
    data.smokes = +data.smokes
    data.poverty = +data.poverty
    console.log(typeof(data.age));
    
  });
   
    
        

    // create Yscale 
var yScale = d3.scaleLinear()
.domain([
  d3.min(stateData,d=>d.age),
  d3.max(stateData,d=>d.age)
  ])
.range([chartHeight,0])


// scale x to chart width  
var xScale = d3.scaleLinear()
.domain([
    d3.min(stateData,d=>d.smokes),
    d3.max(stateData,d=>d.smokes)
    ])
.range([0, chartWidth])

// create axis and append it 
var yAxis = d3.axisLeft(yScale);
var xAxis = d3.axisBottom(xScale);

chartGroup.append("g")
.attr("transform", `translate(0, ${chartHeight})`)
.call(xAxis);

chartGroup.append("g")
.call(yAxis)


var circle = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.smokes))
    .attr("cy", d => yScale(d.age))
    .attr("r", "10")
    .attr("fill", "lightblue")
    .attr("opacity", "0.8")

var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`State : ${d.abbr}<br>smoking: ${d.smokes}<br>average age: ${d.age}`);
    });
chartGroup.call(toolTip);    
    
var states = chartGroup.selectAll("label")
    .data(stateData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("font-size",9)
    .attr("font-weight","bold")
    .attr("fill", "white")
    .attr("x", d => xScale(d.smokes)-7)
    .attr("y", d => yScale(d.age)+4)
    .on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

      // Create axes labels
      chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Average age")
      .attr("font-weight","bold")

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
      .attr("class", "axisText")
      .text("Smokes")
      .attr("font-weight","bold")
  

    
 })
