(function (window) {
  const svg = d3.select("svg#cali-map");
  const controllers = d3.select("svg#controllers");
  controllers.append("svg")
    .attr("id", "brush")
    .attr("x", 700)
    .attr("y", 50)
    .attr("height", 100)
    .attr("width", 100)
    .attr("fill", "#ddd")
  const map = svg.append("g");
  const svgWidth = svg.attr("width");
  const svgHeight = svg.attr("height");

  function drawLegend(legend, legendColorScale) {
    const legendWidth = legend.attr("width");
    const legendHeight = legend.attr("height");
    const legendExtent = d3.extent(legendColorScale.domain());
    const barHeight = 25;

    const pixelScale = d3
      .scaleLinear()
      .domain([0, legendWidth - 40])
      .range([legendExtent[0], legendExtent[1]]);
    const barScale = d3
      .scaleLinear()
      .domain([legendExtent[0], legendExtent[1]])
      .range([0, legendWidth - 40]);
    const barAxis = d3.axisBottom(barScale);
    if (legendColorScale.hasOwnProperty("quantiles")) {
      barAxis.tickValues(legendColorScale.quantiles().concat(legendExtent));
    }
    legend
      .append("g")
      .attr("id", "gini-annotation")
      .attr("transform", "translate(" + 20 + "," + (barHeight + 5) + ")")
      .call(barAxis);
    let bar = legend
      .append("g")
      .attr("id", "gini-legend")
      .attr("transform", "translate(" + 20 + "," + 0 + ")");
    for (let i = 0; i < legendWidth - 40; i++) {
      bar
        .append("rect")
        .attr("x", i)
        .attr("y", 0)
        .attr("width", 1)
        .attr("height", barHeight)
        .style("fill", legendColorScale(pixelScale(i)));
    }
  }

  function drawGINI(map, counties, path, gini, GINIScale) {
    map
      .selectAll(".subunit")
      .data(counties.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", function (d) {
        if (
          d.properties.fullName in gini &&
          !isNaN(gini[d.properties.fullName])
        )
          return GINIScale(gini[d.properties.fullName]);
        else return "#ddd";
      })
      .attr("stroke", "white")
      .attr("translate", [300, 300]);
    showGINI(map, counties, path, gini, GINIScale)
  }

  function showHousing(controllers, layer, housing, map, counties, path, housingScale) {
    //button 1
    controllers
      .append("rect")
      .attr("x", 200)
      .attr("y", 70)
      .attr("height", 50)
      .attr("width", 150)
      .attr("fill", "#ddd")
      .on("click", function (e) {
        layer
          .selectAll("circle")
          .data(housing)
          .join("circle")
          .attr("r", 1)
          .attr("fill", d => housingScale(d["median_house_value"]))
          .attr("opacity", 0.4)
          .attr("cx", d => d.position[0])
          .attr("cy", d => d.position[1]);
        hideGINI(map, counties, path);
        showCircles(layer)
        showBrush()
        // if (layer.selectAll("circle").attr("visibility") === "hidden") {
        //   layer.selectAll("circle").attr("visibility", "");
        // } else {
        //   layer.selectAll("circle").attr("visibility", "hidden");
        // }
      });
    controllers
      .append("text")
      .attr("x", 275)
      .attr("y", 95)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text("Show Median House Value")
      .on("click", function (e) {
        layer
          .selectAll("circle")
          .data(housing)
          .join("circle")
          .attr("r", 1)
          .attr("fill", d => housingScale(d["median_house_value"]))
          .attr("opacity", 0.4)
          .attr("cx", d => d.position[0])
          .attr("cy", d => d.position[1]);
        hideGINI(map, counties, path);
        showCircles(layer)
        showBrush()
        // if (layer.selectAll("circle").attr("visibility") === "hidden") {
        //   layer.selectAll("circle").attr("visibility", "");
        // } else {
        //   layer.selectAll("circle").attr("visibility", "hidden");
        // }
      });
  }

  function showCompany(controllers, layer, data, map, counties, path) {
    controllers
      .append("rect")
      .attr("x", 500)
      .attr("y", 70)
      .attr("height", 50)
      .attr("width", 150)
      .attr("fill", "#ddd")
      .text("Show Tech Company")
      .on("click", function (e) {
        layer
          .selectAll("circle")
          .data(data)
          .join("circle")
          .attr("r", 1)
          .attr("fill", "red")
          .attr("opacity", 0.4)
          .attr("cx", d => d.position[0])
          .attr("cy", d => d.position[1]);
        hideGINI(map, counties, path);
        showCircles(layer)
        hideBrush()
        // if (layer.selectAll("path.contours").attr("visibility") === "hidden") {
        //   layer.selectAll("path.contours").attr("visibility", "");
        // } else {
        //   layer.selectAll("path.contours").attr("visibility", "hidden");
        // }
      });
    controllers
      .append("text")
      .attr("x", 570)
      .attr("y", 95)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text("Show Tech Company")
      .on("click", function (e) {
        layer
          .selectAll("circle")
          .data(data)
          .join("circle")
          .attr("r", 1)
          .attr("fill", "red")
          .attr("opacity", 0.4)
          .attr("cx", d => d.position[0])
          .attr("cy", d => d.position[1]);
        hideGINI(map, counties, path);
        showCircles(layer)
        hideBrush()
        // if (layer.selectAll("path.contours").attr("visibility") === "hidden") {
        //   layer.selectAll("path.contours").attr("visibility", "");
        // } else {
        //   layer.selectAll("path.contours").attr("visibility", "hidden");
        // }
      });
  }

  function giniButton(controllers, layer, drawGINI, map, counties, path, gini, GINIScale) {
    controllers
      .append("rect")
      .attr("x", 700)
      .attr("y", 70)
      .attr("height", 50)
      .attr("width", 150)
      .attr("fill", "#ddd")
      .text("Show GINI")
      .on("click", function (e) {
        drawGINI(map, counties, path, gini, GINIScale);
        hideCircles(layer)
        hideBrush()
        // if (layer.selectAll("path.contours").attr("visibility") === "hidden") {
        //   layer.selectAll("path.contours").attr("visibility", "");
        // } else {
        //   layer.selectAll("path.contours").attr("visibility", "hidden");
        // }
      });
    controllers
      .append("text")
      .attr("x", 770)
      .attr("y", 95)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text("Show GINI")
      .on("click", function (e) {
        drawGINI(map, counties, path, gini, GINIScale);
        hideCircles(layer)
        hideBrush()
        // if (layer.selectAll("path.contours").attr("visibility") === "hidden") {
        //   layer.selectAll("path.contours").attr("visibility", "");
        // } else {
        //   layer.selectAll("path.contours").attr("visibility", "hidden");
        // }
      });
  }

  function hideCircles(layer) {
    layer
      .selectAll("circle")
      .attr("visibility", "hidden")
  }

  function showCircles(layer) {
    layer
      .selectAll("circle")
      .attr("visibility", "visible")
  }

  function hideGINI(map, counties, path) {
    map
      .selectAll(".subunit")
      .data(counties.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "lightblue")
      .attr("stroke", "white")
      .attr("translate", [300, 300]);
    d3.select("#gini-legend").attr("display", "none")
    d3.select("#gini-annotation").attr("display", "none")
  }

  function showGINI(map, counties, path, gini, GINIScale) {
    map
      .selectAll(".subunit")
      .data(counties.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", function (d) {
        if (
          d.properties.fullName in gini &&
          !isNaN(gini[d.properties.fullName])
        )
          return GINIScale(gini[d.properties.fullName]);
        else return "#ddd";
      })
      .attr("stroke", "white")
      .attr("translate", [300, 300]);
    d3.select("#gini-legend").attr("display", "")
    d3.select("#gini-annotation").attr("display", "")
  }

  function showBrush() {
    d3.select("#graph").attr("visibility", "visibile")
  }

  function hideBrush() {
    d3.select("#graph").attr("visibility", "hidden")
  }

  const requestData = async function () {
    const data = await d3.csv("dataset/companies.csv");
    const housing = await d3.csv("dataset/housing.csv");
    const ca = await d3.json("/caCountiesTopoSimple");
    const gini = await d3.json("/gini");
    const GINIColorRange = [
      "#0000ff",
      "#7345ff",
      "#a663ff",
      "#cc7aff",
      "#ff99ff"
    ];
    const GINIScale = d3
      .scaleQuantile()
      .domain(Object.values(gini))
      .range(GINIColorRange);
    const counties = topojson.feature(ca, ca.objects.subunits);
    const projection = d3
      .geoMercator()
      .fitSize([svgWidth, svgHeight], counties);
    const path = d3.geoPath().projection(projection);
    data.forEach((d, i) => {
      d.position = projection([d.Longitude, d.Latitude]);
    });
    housing.forEach((d, i) => {
      d.position = projection([d.longitude, d.latitude]);
    });
    drawGINI(map, counties, path, gini, GINIScale);

    function brushed({
      selection
    }) {
      console.log('brush', selection)
      if (!selection) {
        layer
          .selectAll("circle")
          .data(housing)
          .join("circle")
          .attr("r", 1)
          .attr("fill", d => housingScale(d["median_house_value"]))
          .attr("opacity", 0.4)
          .attr("cx", d => d.position[0])
          .attr("cy", d => d.position[1]);
      } else {
        const [
          [x0, y0],
          [x1, y1]
        ] = selection;
        const start = incomeScale.invert(selection[0][0]);
        const end = incomeScale.invert(selection[1][0]);
        console.log('ssselection', incomeExtent, selection, incomeScale, start, end)
        // const filtered = circles.filter(d => {
        //   console.log('ffffilter', start, end, d["median_income"]);
        //   return d["median_income"] <= end && start <= d["median_income"]
        // })
        layer.selectAll("circle").attr("fill", d => {
          if (d["median_income"] <= end && start <= d["median_income"])
            return "red"
          else
            return housingScale(d["median_house_value"])
        }).attr("d", d => console.log('test'))
        // console.log('fffiltered', filtered)
        //   .style("stroke", "steelblue")
        //   .data();
        // layer
        //   .selectAll("circle")
        //   .data(filtered)
        //   .join("circle")
        //   .attr("r", 1)
        //   .attr("fill", d => housingScale(d["median_house_value"]))
        //   .attr("opacity", 0.4)
        //   .attr("cx", d => {
        //     console.log('cx', d)
        //     return d.position[0]
        //   })
        //   .attr("cy", d => d.position[1]);
      }

    }
    const brush = d3.brush()
      .on("start brush end", brushed);
    const brushSvg = d3.select("#graph")
    brushSvg.call(brush)

    const housingAgeExtent = d3.extent(housing, d => d["housing_median_age"]);
    const housingAgeScale = d3.scaleLinear().domain(d3.extent(housingAgeExtent)).range([100, 0]);
    console.log('scale', housingAgeScale)


    const incomeExtent = d3.extent(housing, d => d["median_income"]);
    const incomeMap = housing.map(d => d["median_income"])
    const incomeScale = d3.scaleLinear().domain(d3.extent(incomeExtent)).range([0, 150]);
    const incomeAxis = d3.axisBottom(incomeScale)
    brushSvg.append("g").attr("transform", `translate(30, 110)`)
      .call(incomeAxis)
    const histogram = d3.histogram().domain(incomeExtent).thresholds(10)
    const counts = histogram(incomeMap)
    const countsExtent = d3.extent(counts, d => d.length)
    console.log('counts', incomeExtent)
    const yScale = d3.scaleLinear().domain(countsExtent)
      .range([100, 0])
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));
    brushSvg.append("g").attr("transform", `translate(30, 5)`)
      .call(yAxis)
    const area = d3.area().x(d => incomeScale(d.x1))
      .y0(yScale(0))
      .y1(d => yScale(d.length))
      .curve(d3.curveNatural);
    brushSvg.append("path").datum(counts)
      .attr("fill", "none")
      .attr("stroke", "lightblue")
      .attr("stroke-width", "2px")
      .attr("opacity", "1")
      .attr("d", area)
      .attr("transform", `translate(30, 5)`);

    function plotZoomed(event) {
      layer.attr("transform", event.transform);
      map.attr("transform", event.transform);
    }
    const plotZoom = d3.zoom().on("zoom", plotZoomed);
    svg.call(plotZoom);
    const layer = svg.append("g");




    // housing
    const housingExtent = d3.extent(housing, d => Number(d['median_house_value']))
    console.log('housing', housingExtent, housing)
    const housingScale = d3.scaleSequential(d3.interpolateViridis).domain(housingExtent);


    showHousing(controllers, layer, housing, map, counties, path, housingScale);

    //company name details
    const companyDetail = controllers
      .append("text")
      .attr("x", 5)
      .attr("y", 150);

    const circles = layer
      .selectAll("circle")
      .data(housing)
      .join("circle")
      .attr("r", 1)
      .attr("fill", d => housingScale(d["median_house_value"]))
      .attr("opacity", 0.4)
      .attr("cx", d => d.position[0])
      .attr("cy", d => d.position[1]);
    //   .on("mouseover", function(e) {
    //     const _this = this;
    //     const datum = d3.select(this).datum();
    //     _this.style = "fill: darkgreen";
    //     companyDetail.text(
    //       `${datum["Company Name"]}: ${datum["Company Description"]}`
    //     );
    //   })
    //   .on("mouseout", function(e) {
    //     const _this = this;
    //     _this.style = "fill: forestgreen";
    //   });

    //button 2
    showCompany(controllers, layer, data, map, counties, path)
    giniButton(controllers, layer, drawGINI, map, counties, path, gini, GINIScale)

    drawLegend(d3.select("#cali-map"), GINIScale)
    hideBrush()
    hideCircles(layer)
    // brushSvg
    //   .selectAll("circle")
    //   .data(housing)
    //   .join("circle")
    //   .attr("r", 1)
    //   .attr("fill", d => housingScale(d["median_house_value"]))
    //   .attr("opacity", 0.4)
    //   .attr("cx", d => housingAgeScale(d["housing_median_age"]))
    //   .attr("cy", d => incomeScale(d["median_income"]));
  };
  requestData();
})(window);