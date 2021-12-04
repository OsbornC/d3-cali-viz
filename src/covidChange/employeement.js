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

    let annotations2 = svg.append("g").attr("id", "annotations2");
    let chartArea2 = svg.append("g").attr("id", "bars2")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //import employeement data
    const requestData2 = async function () {
        const employeeData = await d3.csv("dataset/Employment_rate.csv")
        console.log(employeeData);


        //employeement Y axis
        const percentScale = d3.scaleLinear().domain([0.8, 1]).range([chartHeight, 0]);
        let leftAxis2 = d3.axisLeft(percentScale).tickFormat(d3.format('.0%'));
        let leftGridlines2 = d3.axisLeft(percentScale)
            .tickSize(-chartWidth - 10)
            .tickFormat("")
        annotations2.append("g")
            .attr("class", "y axis")
            .attr("transform", `translate(${margin.left-10},${margin.top})`)
            .call(leftAxis2)
        annotations2.append("g")
            .attr("class", "y gridlines")
            .attr("transform", `translate(${margin.left-10},${margin.top})`)
            .call(leftGridlines2);

        //employeement X axis 
        const years = d3.map(employeeData, d => d.Year)

        let yearScale = d3.scaleBand().domain(years).range([0, chartWidth]).padding(0.1);

        let bottomAxis2 = d3.axisBottom(yearScale)
        let bottomAxisG2 = annotations2.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(${margin.left},${chartHeight+margin.top+10})`)
            .call(bottomAxis2);

        //employeement draw the rectangles
        chartArea2.selectAll('rect.bar').data(employeeData)
            .join('rect').attr('class', 'bar')
            .attr("fill", "#97CBFF")
            .attr("x", d => yearScale(d.Year))
            .attr("y", d => percentScale(d.Employee_rate))
            .attr("height", d => percentScale(0.8) - percentScale(d.Employee_rate))
            .attr("width", yearScale.bandwidth());
    }
    requestData2();
})(window)