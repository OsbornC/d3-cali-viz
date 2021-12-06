(function (window) {
    const svg = d3.select('svg#cali-map');
    const controllers = d3.select('svg#controllers');
    const map = svg.append("g");
    const svgWidth = svg.attr("width");
    const svgHeight = svg.attr("height");
    const requestData = async function () {
        const data = await d3.csv("dataset/companies.csv");
        const ca = await d3.json("/caCountiesTopoSimple");
        const gini = await d3.json("/gini")
        const counties = topojson.feature(ca, ca.objects.subunits)
        const projection = d3.geoMercator().fitSize([svgWidth, svgHeight], counties);
        const path = d3.geoPath().projection(projection);
        data.forEach((d, i) => {
            d.position = projection([d.Longitude, d.Latitude])
        })
        const GINIColorRange = ["#0000ff", "#7345ff", "#a663ff", "#cc7aff", "#ff99ff"];
        const GINIScale = d3.scaleQuantile()
            .domain(Object.values(gini))
            .range(GINIColorRange);

        map.selectAll(".subunit")
            .data(counties.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", function (d) {
                if ((d.properties.fullName in gini) && !(isNaN(gini[d.properties.fullName])))
                    return GINIScale(gini[d.properties.fullName])
                else
                    return '#ddd'
            })
            .attr("stroke", "white")
            .attr("translate", [300, 300]);

        function plotZoomed(event) {
            layer.attr("transform", event.transform)
            map.attr("transform", event.transform)
        }
        const plotZoom = d3.zoom().on("zoom", plotZoomed)
        svg.call(plotZoom)
        const contours = d3.contourDensity()
            .x(d => d.position[0])
            .y(d => d.position[1])
            .size([svgWidth, svgHeight])
            .bandwidth(11)
            .thresholds(50)(data)
        const extent = d3.extent(contours, d => d.value)
        const colorScale = d3.scaleSequential(d3.interpolateViridis).domain(extent)
        const layer = svg.append("g");
        controllers.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", 50)
            .attr("width", 50)
            .attr("fill", "#ddd")
            .text("contour")
            .on('click', function (e) {
                if (layer.selectAll("circle").attr("visibility") === 'hidden') {
                    layer.selectAll("circle")
                        .attr("visibility", "")
                } else {
                    layer.selectAll("circle")
                        .attr("visibility", "hidden")
                }
            })
        controllers.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text("data")

        const companyDetail = controllers.append("text")
            .attr("x", 10)
            .attr("y", 20);

        layer.selectAll("circle").data(data)
            .join("circle")
            .attr("r", 1)
            .attr("fill", "forestgreen")
            .attr("opacity", 0.4)
            .attr("cx", d => d.position[0])
            .attr("cy", d => d.position[1])
            .on("mouseover", function (e) {
                const _this = this
                const datum = d3.select(this).datum()
                _this.style = "fill: darkgreen"
                companyDetail.text(`${datum["Company Name"]}: ${datum["Company Description"]}`)
            })
            .on("mouseout", function (e) {
                const _this = this
                _this.style = "fill: forestgreen"
            })

        layer.selectAll("path.contours")
            .data(contours)
            .join("path")
            .attr("class", "contours")
            .attr("fill", d => {
                return colorScale(d.value)
            })
            .attr("d", d3.geoPath())

        controllers.append("rect")
            .attr("x", 100)
            .attr("y", 0)
            .attr("height", 50)
            .attr("width", 50)
            .attr("fill", "#ddd")
            .text("contour")
            .on('click', function (e) {
                if (layer.selectAll("path.contours").attr("visibility") === 'hidden') {
                    layer.selectAll("path.contours")
                        .attr("visibility", "")
                } else {
                    layer.selectAll("path.contours")
                        .attr("visibility", "hidden")
                }
            })
        controllers.append("text")
            .attr("x", 100)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text("contour")

    }
    requestData();
})(window)