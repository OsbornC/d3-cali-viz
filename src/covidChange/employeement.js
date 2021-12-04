(function (window) {
    const svg = d3.select("svg#employeement");
    const width = svg.attr("width");
    const height = svg.attr("height");
    const margin = {
        top: 10,
        right: 10,
        bottom: 50,
        left: 50
    };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    let annotations = svg.append("g").attr("id", "annotations");
    let chartArea = svg.append("g").attr("id", "bars")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //import employeement data
    const requestData = async function () {
        const employeeData = await d3.csv("dataset/Employment_rate.csv")
        console.log(employeeData);


        //employeement Y axis
        const percentScale = d3.scaleLinear().domain([0.8, 1]).range([chartHeight, 0]);
        let leftAxis = d3.axisLeft(percentScale).tickFormat(d3.format('.0%'));
        let leftGridlines = d3.axisLeft(percentScale)
            .tickSize(-chartWidth - 10)
            .tickFormat("")
        annotations.append("g")
            .attr("class", "y axis")
            .attr("transform", `translate(${margin.left-10},${margin.top})`)
            .call(leftAxis)
        annotations.append("g")
            .attr("class", "y gridlines")
            .attr("transform", `translate(${margin.left-10},${margin.top})`)
            .call(leftGridlines);

        //employeement X axis 
        const years = d3.map(employeeData, d => d.Year)

        let yearScale = d3.scaleBand().domain(years).range([0, chartWidth]).padding(0.1);

        let bottomAxis = d3.axisBottom(yearScale)
        let bottomAxisG = annotations.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(${margin.left},${chartHeight+margin.top+10})`)
            .call(bottomAxis);

        //employeement draw the rectangles
        chartArea.selectAll('rect.bar').data(employeeData)
            .join('rect').attr('class', 'bar')
            .attr("fill", "#97CBFF")
            .attr("x", d => yearScale(d.Year))
            .attr("y", d => percentScale(0.8))
            .attr("height", d => chartHeight - percentScale(0.8))
            .attr("width", yearScale.bandwidth());

        chartArea.selectAll('rect.bar').data(employeeData)
            .join('rect').attr('class', 'bar')
            .attr("fill", "#97CBFF")
            .transition()
            .duration(2000)
            .attr("x", d => yearScale(d.Year))
            .attr("y", d => percentScale(d.Employee_rate))
            .attr("height", d => percentScale(0.8) - percentScale(d.Employee_rate))
            .attr("width", yearScale.bandwidth())
            .delay(function (d, i) {
                return (i * 100)
            });

        setTimeout(() => {
            chartArea.selectAll('rect.bar').data(employeeData)
                .join('rect').attr('class', 'bar')
                .attr("fill", "#97CBFF")
                .transition()
                .duration(2000)
                .attr("x", d => yearScale(d.Year))
                .attr("y", d => percentScale(d.Employee_rate))
                .attr("height", d => percentScale(0.8) - percentScale(d.Employee_rate))
                .attr("width", yearScale.bandwidth())
                .delay(function (d, i) {
                    return (i * 100)
                });
        }, 3000)

    }
    requestData();
})(window)