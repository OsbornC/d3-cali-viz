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
        const billionData = await d3.csv("static/dataset/Billionaires_Data.csv")
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

            chartArea.selectAll("image")
                .data(billionData)
                .join("image")
                .attr("y", d => moneyScale(d.Wealth_before) + 5)
                .attr("x", d => nameScale(d.Name) + 5)
                .attr("width", nameScale.bandwidth() - 10)
                .attr("height", nameScale.bandwidth() - 10)
                .attr("xlink:href", d => `static/img/human_figure/${d.Name}.jpg`)

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
                    })

                chartArea.selectAll("image")
                    .data(billionData)
                    .join("image")
                    .transition()
                    .duration(2000)
                    .attr("y", d => moneyScale(d.Wealth_after) + 5)
                    .attr("x", d => nameScale(d.Name) + 5)
                    .attr("width", nameScale.bandwidth() - 10)
                    .attr("height", nameScale.bandwidth() - 10)
                    .attr("xlink:href", d => `static/img/human_figure/${d.Name}.jpg`)
                    .delay(function (d, i) {
                        return (i * 100)
                    });;
            }, 3000)
        }
        chartAnimation()

        chartArea.selectAll("rect.bar")
            .on("mouseenter", function (e) {
                const _this = this;
                const datum = d3.select(this).datum();
                billionaireInfo.text(`19 Month % Wealth Growth: ${datum["19 Month % Wealth Growth"]}`)
                console.log('hover', datum["19 Month % Wealth Growth"], datum["Industry"], datum["Wealth_before"], datum["Wealth_after"])
                _this.style = "opacity: 0.8;";
            })
            .on("mouseleave", function (e) {
                const _this = this;
                _this.style = "opacity: 1;"
            })

        const controllers = d3.select('svg#controllers2');
        controllers.append("rect")
            .attr("x", 320)
            .attr("y", 55)
            .attr("height", 50)
            .attr("width", 150)
            .attr("fill", "#ddd")
            .text("contour")
            .on('click', chartAnimation)
            .text("Restart Animation")
        controllers
            .append("text")
            .attr("x", 393)
            .attr("y", 80)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text("Restart Animation")
            .on('click', chartAnimation)

        // new lengend
        controllers.append("rect")
            .attr("x", 600)
            .attr("y", 55)
            .attr("height", 10)
            .attr("width", 10)
            .attr("fill", "#97CBFF")
        controllers
            .append("text")
            .attr("x", 685)
            .attr("y", 62)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text("Before Pendamic")

        controllers.append("rect")
            .attr("x", 600)
            .attr("y", 80)
            .attr("height", 10)
            .attr("width", 10)
            .attr("fill", "#8B1B0D")
        controllers
            .append("text")
            .attr("x", 681)
            .attr("y", 87)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text("After Pendamic")

        // annotation
        const billionaireInfo = controllers
            .append("text")
            .attr("class", "billionaire-info")
            .attr("x", 5)
            .attr("y", 15)

        const billionaireInfo2 = controllers
            .append("text")
            .attr("class", "billionaire-info")
            .attr("x", 5)
            .attr("y", 35)


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