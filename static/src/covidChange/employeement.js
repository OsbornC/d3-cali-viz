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

        const lineGen = d3.line()
            .x(d => yearScale(d.Year) + yearScale.bandwidth() / 2)
            .y(d => percentScale(d.Employee_rate))
            .curve(d3.curveMonotoneX)

        const path = chartArea.append("path")
            .datum(employeeData)
            .attr("fill", "none")
            .attr("stroke", "#97CBFF")
            .attr("stroke-width", 2)
            .attr("d", lineGen)

        function startAnimation() {
            const transitionPath = d3
                .transition()
                .duration(3000);
            chartArea.select("path")
                .attr("stroke-dasharray", path.node().getTotalLength())
                .attr("stroke-dashoffset", path.node().getTotalLength())
                .transition(transitionPath)
                .attr("stroke-dashoffset", 0);
            chartArea.selectAll("circle")
                .data(employeeData)
                .join("circle")
                .attr("r", 5)
                .attr("fill", "#97CB00")
                .attr("cx", d => yearScale(d.Year) + yearScale.bandwidth() / 2)
                .attr("cy", d => percentScale(d.Employee_rate))
                .attr("visibility", "hidden")
            setTimeout(() => {
                chartArea.selectAll("circle")
                    .attr("visibility", "visible")
            }, 3000)
        }

        startAnimation()
        const controllers = d3.select('svg#controllers3');
        controllers.append("rect")
            .attr("x", 320)
            .attr("y", 55)
            .attr("height", 50)
            .attr("width", 150)
            .attr("fill", "#ddd")
            .text("contour")
            .on('click', startAnimation)
            .text("Restart Animation")
        controllers
            .append("text")
            .attr("x", 393)
            .attr("y", 80)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text("Restart Animation")
            .on('click', startAnimation)

        window.addEventListener("scroll", scrollAnimation);

        function scrollAnimation() {
            const triggerBottom = window.innerHeight / 2;
            const a = document.querySelector('#bars');
            if (a.getBoundingClientRect().top <= triggerBottom) {
                startAnimation()
            }
        }
    }
    requestData();
})(window)