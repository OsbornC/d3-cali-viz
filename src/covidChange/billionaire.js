(function (window) {
    const billionaireSvg = d3.select("svg#billionaire");
    const width = billionaireSvg.attr("width");
    const height = billionaireSvg.attr("height");
    const margin = {
        top: 10,
        right: 10,
        bottom: 50,
        left: 50
    };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    let annotations = billionaireSvg.append("g").attr("id", "annotations");
    let chartArea = billionaireSvg.append("g").attr("id", "bars")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //import Billionaires data
    const requestBillionaireData = async function () {
        const billionData = await d3.csv("dataset/Billionaires_Data.csv")
        console.log(billionData);
        //Billionaires Y axis
        let moneyScale = d3.scaleLinear().domain([0, 210000]).range([chartHeight, 0]);
        let leftAxis = d3.axisLeft(moneyScale);
        let leftGridlines = d3.axisLeft(moneyScale)
            .tickSize(-chartWidth - 10)
            .tickFormat("")
        annotations.append("g")
            .attr("class", "y axis")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .call(leftAxis)
        annotations.append("g")
            .attr("class", "y gridlines")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .call(leftGridlines);

        //Billionaires X axis 
        const names = d3.map(billionData, d => d.Name)
        //console.log(names);

        let nameScale = d3.scaleBand().domain(names).range([0, chartWidth]).padding(0.3);

        let bottomAxis = d3.axisBottom(nameScale)
        let bottomAxisG = annotations.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(${margin.left},${chartHeight+margin.top+10})`)
            .call(bottomAxis);

        // Billionaires before pendamic rectangles
        chartArea.selectAll('rect.bar').data(billionData)
            .join('rect').attr('class', 'bar')
            .attr("fill", "#97CBFF")
            .attr("x", d => nameScale(d.Name))
            .attr("y", d => moneyScale(d.Wealth_before))
            .attr("height", d => moneyScale(0) - moneyScale(d.Wealth_before))
            .attr("width", nameScale.bandwidth());
    }
    requestBillionaireData();
})(window)