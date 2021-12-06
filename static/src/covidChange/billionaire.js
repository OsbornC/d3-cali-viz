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
    let chartArea = billionaireSvg.append("g").attr("id", "billionaireBars")
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

        let nameScale = d3.scaleBand().domain(names).range([0, chartWidth]).padding(0.3);

        let bottomAxis = d3.axisBottom(nameScale)
        let bottomAxisG = annotations.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(${margin.left},${chartHeight+margin.top+10})`)
            .call(bottomAxis);

        function chartAnimation() {
            // Billionaires before pendamic rectangles
            chartArea.selectAll('rect.bar').data(billionData)
                .join('rect').attr('class', 'bar')
                .attr("fill", "#97CBFF")
                .attr("x", d => nameScale(d.Name))
                .attr("y", d => moneyScale(0))
                .attr("height", d => chartHeight - moneyScale(0))
                .attr("width", nameScale.bandwidth());

            chartArea.selectAll('rect.bar').data(billionData)
                .join('rect').attr('class', 'bar')
                .attr("fill", "#97CBFF")
                .transition()
                .duration(2000)
                .attr("x", d => nameScale(d.Name))
                .attr("y", d => moneyScale(d.Wealth_before))
                .attr("height", d => moneyScale(0) - moneyScale(d.Wealth_before))
                .attr("width", nameScale.bandwidth())
                .delay(function (d, i) {
                    return (i * 100)
                });

            setTimeout(() => {
                chartArea.selectAll('rect.bar').data(billionData)
                    .join('rect').attr('class', 'bar')
                    .transition()
                    .duration(2000)
                    .attr("fill", "#8B1B0D")
                    .attr("x", d => nameScale(d.Name))
                    .attr("y", d => moneyScale(d.Wealth_after))
                    .attr("height", d => moneyScale(0) - moneyScale(d.Wealth_after))
                    .attr("width", nameScale.bandwidth())
                    .delay(function (d, i) {
                        return (i * 100)
                    });;
            }, 3000)
        }
        chartAnimation()

        const controllers = d3.select('svg#billionaire');
        controllers.append("rect")
            .attr("x", 300)
            .attr("y", 0)
            .attr("height", 50)
            .attr("width", 50)
            .attr("fill", "#ddd")
            .text("contour")
            .on('click', chartAnimation)
        window.addEventListener("scroll", scrollAnimation);

        function scrollAnimation() {
            const triggerBottom = window.innerHeight / 2;
            const bars = document.querySelector('#billionaireBars');
            if (bars.getBoundingClientRect().top <= triggerBottom) {
                chartAnimation()
            }
        }
    }
    requestBillionaireData();
})(window)