(function (window) {
    const requestData = async function () {
        const crimeData = await d3.csv('static/dataset/sf_crime.csv');
        var margin3 = {
                top: 80,
                right: 180,
                bottom: 200,
                left: 100
            },
            width3 = 960 - margin3.left - margin3.right,
            height3 = 600 - margin3.top - margin3.bottom;

        // Get every column value
        var data = crimeData.filter(function (d) {
            return (d["District"] != "all")
        })
        var elements = Object.keys(crimeData[0])
            .filter(function (d) {
                return (d != "District");
            });
        var selection = elements[0];

        var svg3 = d3.select("#crime")
            .attr("width", width3 + margin3.left + margin3.right)
            .attr("height", height3 + margin3.top + margin3.bottom)
            .append("g")
            .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");
        var max_y = 0
        for (i = 0; i < data.length; i++) {
            elements.forEach(d => {
                if (max_y < data[i][d]) {
                    max_y = data[i][d]
                }
            })
        };
        var yScale = d3.scaleLinear()
            .domain([0, parseInt(max_y) + 3000])
            .range([height3, 0]);
        var xScale = d3.scaleBand()
            .domain(data.map(function (d) {
                return d.District;
            }))
            .range([0, width3]);

        var xAxis = d3.axisBottom(xScale);

        var yAxis = d3.axisLeft(yScale)

        svg3.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height3 + ")")
            .call(xAxis)
            .selectAll("text")
            .style("font-size", "8px")
            .style("text-anchor", "middle")
        //.attr("dx", "-.8em")
        svg3.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .selectAll("text")
            .style("font-size", "8px")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
        svg3.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("dx", width3 / 2)
            .attr("dy", -height3 + 700)
            .style("font-size", "15px")
            .text("District");

        svg3.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("dx", -150)
            .attr("dy", height3 / 2 - 230)
            .attr("transform", "rotate(-90)")
            .text("Number of crimes");
        svg3.selectAll("rectangle")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "rectangle")
            .attr("width", (width3 / data.length) - 5)
            .attr("height", function (d) {
                console.log(max_y)
                return height3 - yScale(d[selection]);
            })
            .attr("x", function (d, i) {
                return (width3 / data.length) * i;
            })
            .attr("y", function (d) {
                return yScale(+d[selection]);
            })
            .append("title")
            .text(function (d) {
                return d.District + " : " + d[selection];
            });

        //dropdown box
        var selector = d3.select("#drop")
            .append("select")
            .attr("id", "dropdown")
            .on("change", function (d) {
                selection = document.getElementById("dropdown");
                console.log
                yScale.domain([0, parseInt(max_y) + 3000]);

                yAxis.scale(yScale);

                d3.selectAll(".rectangle")
                    .transition()
                    .attr("height", function (d) {
                        return height3 - yScale(+d[selection.value]);
                    })
                    .attr("x", function (d, i) {
                        return (width3 / data.length) * i;
                    })
                    .attr("y", function (d) {
                        return yScale(+d[selection.value]);
                    })
                    //.ease("linear")
                    .select("title")
                    .text(function (d) {
                        return d.District + " : " + d[selection.value];
                    });

                d3.selectAll("g.yScale.axis")
                    .transition()
                    .call(yAxis);

            });

        selector.selectAll("option")
            .data(elements)
            .enter().append("option")
            .attr("value", function (d) {
                return d;
            })
            .text(function (d) {
                return d;
            })
    }
    requestData()
})(window)