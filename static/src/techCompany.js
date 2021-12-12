(function (window) {
  const svg = d3.select("svg#cali-map");
  const controllers = d3.select("svg#controllers");
  let currentTab = 'GINI';
  controllers.append("svg")
    .attr("id", "brush")
    .attr("x", 700)
    .attr("y", 0)
    .attr("height", 100)
    .attr("width", 100)
    .attr("fill", "#ddd")
  const map = svg.append("g");
  const svgWidth = svg.attr("width");
  const svgHeight = svg.attr("height");



  function drawGINI(map, counties, path, gini, GINIScale) {
    map
      .data(counties.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "county")
      .attr("fill", function (d) {
        if (
          d.properties.fullName in gini &&
          !isNaN(gini[d.properties.fullName])
        )
          return GINIScale(gini[d.properties.fullName]);
        else return "#ddd";
      })
      .attr("stroke", "white")
      .attr("translate", [300, 300])

    showGINI(map, counties, path, gini, GINIScale)
  }

  function hideTooltip() {
    d3.selectAll(".tooltip").attr("visibility", "hidden")
  }

  function showTooltip() {
    d3.selectAll(".tooltip").attr("visibility", "visible")
  }

  function handleHousingClick(layer, housing, map, housingScale, counties, path) {
    currentTab = 'HOUSING'
    layer
      .selectAll("circle.housing")
      .data(housing)
      .join("circle")
      .attr("class", "housing")
      .attr("r", 1)
      .attr("fill", d => housingScale(d["median_house_value"]))
      .attr("opacity", 0.4)
      .attr("cx", d => d.position[0])
      .attr("cy", d => d.position[1]);
    hideGINI(map, counties, path);
    showCircles(layer, 'housing')
    showBrush()
    hideTooltip()
  }

  function showHousing(controllers, layer, housing, map, counties, path, housingScale) {
    //button 1
    controllers
      .append("rect")
      .attr("x", 10)
      .attr("y", 40)
      .attr("height", 50)
      .attr("width", 210)
      .attr("fill", "#ddd")
      .on("click", function (e) {
        handleHousingClick(layer, housing, map, housingScale, counties, path)
      });
    controllers
      .append("text")
      .attr("x", 115)
      .attr("y", 65)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text("Show Median House Value")
      .on("click", function (e) {
        handleHousingClick(layer, housing, map, housingScale, counties, path)
      });
  }

  function handleCompanyClick(layer, data, companyDetail, companyURL, companyAddress, companyCity, map, counties, path) {
    currentTab = 'TECH'
    layer
      .selectAll("circle.company")
      .data(data)
      .join("circle")
      .attr("class", "company")
      .attr("r", 1)
      .attr("fill", "#FF00FF")
      .attr("opacity", 0.4)
      .attr("cx", d => d.position[0])
      .attr("cy", d => d.position[1])
      .on("mouseover", function (e) {
        const _this = this;
        const datum = d3.select(this).datum();
        _this.style = "fill: darkgreen;";
        _this.r = 3
        companyDetail.text(
          `${datum["Company Name"]}`
        );
        companyAddress.text(`Address: ${datum["Address 1"]}`)
        companyURL.text(`Website: ${datum["Website"]}`)
        companyCity.text(`City: ${datum["City"]}`)
        d3.select(this).attr("r", 3)
      })
      .on("mouseout", function (e) {
        const _this = this;
        _this.style = "fill: #FF00FF;";
        d3.select(this).attr("r", 1)
      });
    hideGINI(map, counties, path);
    showCircles(layer, 'company')
    hideBrush()
  }

  function showCompany(controllers, layer, data, map, counties, path) {
    //company name details
    const companyDetail = controllers
      .append("text")
      .attr("class", "tech-company-tooltip")
      .attr("x", 5)
      .attr("y", 150);
    const companyURL = controllers
      .append("text")
      .attr("class", "tech-company-tooltip")
      .attr("x", 5)
      .attr("y", 170);
    const companyAddress = controllers
      .append("text")
      .attr("class", "tech-company-tooltip")
      .attr("x", 5)
      .attr("y", 190);
    const companyCity = controllers
      .append("text")
      .attr("class", "tech-company-tooltip")
      .attr("x", 5)
      .attr("y", 210)
    controllers
      .append("rect")
      .attr("x", 250)
      .attr("y", 40)
      .attr("height", 50)
      .attr("width", 170)
      .attr("fill", "#ddd")
      .text("Show Tech Company")
      .on("click", function (e) {
        handleCompanyClick(layer, data, companyDetail, companyURL, companyAddress, companyCity, map, counties, path)

      });
    controllers
      .append("text")
      .attr("x", 335)
      .attr("y", 65)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text("Show Tech Company")
      .on("click", function (e) {
        handleCompanyClick(layer, data, companyDetail, companyURL, companyAddress, companyCity, map, counties, path)
      });
  }

  function handleGINIClick(layer, drawGINI, map, counties, path, gini, GINIScale, hideBrush, hideTooltip) {
    currentTab = 'GINI'
    drawGINI(map, counties, path, gini, GINIScale);
    hideCircles(layer)
    hideBrush()
    hideTooltip()
  }

  function giniButton(controllers, layer, drawGINI, map, counties, path, gini, GINIScale) {
    controllers
      .append("rect")
      .attr("x", 460)
      .attr("y", 40)
      .attr("height", 50)
      .attr("width", 100)
      .attr("fill", "#ddd")
      .text("Show GINI")
      .on("click", function (e) {
        handleGINIClick(layer, drawGINI, map, counties, path, gini, GINIScale, hideBrush, hideTooltip)
      });
    controllers
      .append("text")
      .attr("x", 505)
      .attr("y", 65)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text("Show GINI")
      .on("click", function (e) {
        handleGINIClick(layer, drawGINI, map, counties, path, gini, GINIScale, hideBrush, hideTooltip)
      });
    const tooltip = svg.append("g").attr("class", "tooltip").attr("visibility", "hidden")
    tooltip.append("rect")
      .attr("fill", "lightgrey")
      .attr("width", 180)
      .attr("height", 50)
      .attr("opacity", 0.8)
    const stateName = tooltip.append("text").attr("class", "state-name").attr("x", 0).attr("y", 20)
    const stateGINI = tooltip.append("text").attr("class", "state-gini").attr("x", 0).attr("y", 40)
    d3.selectAll(".county").on("mouseenter", function () {
      if (currentTab === 'GINI') showTooltip()
      const datum = d3.select(this).datum()
      if (
        datum.properties.fullName in gini &&
        !isNaN(gini[datum.properties.fullName])
      ) {
        const giniIndex = gini[datum.properties.fullName]
        d3.select(".state-name").text(datum.properties.fullName)
        d3.select(".state-gini").text(`GINI: ${giniIndex}`)
      } else {
        d3.select(".state-name").text(datum.properties.fullName)
        d3.select(".state-gini").text("Missing data")
      }
    })
  }

  function hideCircles(layer) {
    layer
      .selectAll("circle")
      .attr("visibility", "hidden")
  }

  function showCircles(layer, className) {
    layer
      .selectAll("circle")
      .attr("visibility", "hidden")
    layer
      .selectAll(`circle.${className}`)
      .attr("visibility", "visible")
  }

  function hideGINI(map, counties, path) {
    map
      .selectAll("path.county")
      .attr("fill", "lightblue")
      .attr("stroke", "white")
      .attr("translate", [300, 300]);
    d3.select("#gini-legend").attr("display", "none")
    d3.select("#gini-annotation").attr("display", "none")
    d3.select(".tooltip").attr("visibility", "hidden")
    hideTooltip()
  }

  function showGINI(map, counties, path, gini, GINIScale) {
    map
      .selectAll("path.county")
      .data(counties.features)
      .join("path")
      .attr("class", "county")
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
    d3.select(".tooltip").attr("visibility", "visible")
    hideTooltip()
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
      if (!selection) {
        layer
          .selectAll("circle.housing")
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
        layer.selectAll("circle.housing").attr("fill", d => {
          if (d["median_income"] <= end && start <= d["median_income"])
            return "green"
          else
            return housingScale(d["median_house_value"])
        }).attr("r", d => {
          if (d["median_income"] <= end && start <= d["median_income"])
            return 2
          else
            return 1
        })
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

    const housingColorRange = [
      "#FFFF00",
      "#FFDF20",
      "#FFBF40",
      "#FF9F60",
      "#FF8080",
      "#FF609F",
      "#FF40BF",
      "#FF20DF",
      "#FF00FF"
    ];

    const housingScale = d3.scaleQuantile().domain(housingExtent).range(housingColorRange);


    showHousing(controllers, layer, housing, map, counties, path, housingScale);



    const circles = layer
      .selectAll("circle")
      .data(housing)
      .join("circle")
      .attr("r", 1)
      .attr("fill", d => housingScale(d["median_house_value"]))
      .attr("opacity", 0.4)
      .attr("cx", d => d.position[0])
      .attr("cy", d => d.position[1]);
    //button 2
    showCompany(controllers, layer, data, map, counties, path)
    giniButton(controllers, layer, drawGINI, map, counties, path, gini, GINIScale)

    drawLegend(d3.select("#legend"), GINIScale)
    hideBrush()
    hideCircles(layer)
  };
  requestData();
})(window);