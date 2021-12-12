function drawLegend(legend, legendColorScale) {
  const legendWidth = legend.attr("width");
  const legendHeight = legend.attr("height");
  const legendExtent = d3.extent(legendColorScale.domain());
  const barHeight = 20;

  const pixelScale = d3.scaleLinear()
                       .domain([100, legendWidth - 200])
                       .range([legendExtent[0], legendExtent[1]]);
  const barScale = d3.scaleLinear()
                     .domain([legendExtent[0], legendExtent[1]])
                     .range([100, legendWidth - 200]);

  const barAxis = d3.axisBottom(barScale);

  if (legendColorScale.hasOwnProperty("quantiles")) {
    barAxis.tickValues(legendColorScale.quantiles().concat(legendExtent));
  }
  legend
    .append("g")
    .attr("transform", "translate(" + 20 + "," + (barHeight + 5) + ")")
    .call(barAxis);

  let bar = legend
    .append("g")
    .attr("transform", "translate(" + 20 + "," + 0 + ")");
  for (let i = 100; i < legendWidth - 200; i++) {
    bar
      .append("rect")
      .attr("x", i)
      .attr("y", 0)
      .attr("width", 1)
      .attr("height", barHeight)
      .style("fill", legendColorScale(pixelScale(i)));
  }
}
