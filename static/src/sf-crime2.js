var color = ['#73B761', '#FD8D3C', '#F3C911', '#FD625E', '#5F6B6D', 'purple', '#95C8F0', 'pink', '#A80000', '#99E472'];
let datas = []
var types = ['HOMICIDE', "RAPE", "ROBBERY", "ASSAULT", "HUMAN TRAFFICKING – SEX ACT", "HUMAN TRAFFICKING – INV SERV", "BURGLARY", "MOTOR VEHICLE THEFT", "ARSON", "LARCENY THEFT"];

types.forEach(function (item, index) {
  $('#types').append('<span><i class="s1" style="background:' + color[index] + '"></i>' + item + '</span>')
})


const requestData = async function () {

  const data = await d3.csv("static/dataset/sf_crime2.csv");

  datas = data;

  var data2017 = [];
  var data2018 = [];
  var data2019 = [];
  setTimeout(function () {
    //console.log(datas)


    console.log(data2017)
    console.log(data2018)
    console.log(data2019)

    $('#all').click();

  }, 1000)

  var data2017 = data.filter((d) => {
    return d['Year'] == '2017' && d['crime_type'] != 'TOTAL'
  })
  var data2018 = data.filter((d) => {
    return d['Year'] == '2018' && d['crime_type'] != 'TOTAL'
  })
  var data2019 = data.filter((d) => {
    return d['Year'] == '2019' && d['crime_type'] != 'TOTAL'
  })
  // console.log(data2017)
  // console.log(data2018)
  // console.log(data2019)


  // chart
  function set(id, data) {
    var width = 200,
      height = 200;


    //SVG
    var svg = d3.select(id)

      .append("svg")
      .attr("width", width)
      .attr("height", height)

    //g
    var g = svg.append("g")
      .attr("transform", "translate(105,100)")


    var pie = d3.pie().value(function (d) {
      return Number(d.Number);
    });

    var path = d3.arc()
      .outerRadius(90)
      .innerRadius(45);

    // var label = d3.arc()
    // 							.outerRadius(150)
    // 							.innerRadius(80);

    console.log(datas)
    var arc = g.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc")




    arc.append("path")
      .attr("d", path)
      //.attr("fill",function(d,i){return color[i];})
      .attr('fill', function (d, i) {
        if (d.data.crime_type == "HOMICIDE")
          return color[0];
        if (d.data.crime_type == "RAPE")
          return color[1];
        if (d.data.crime_type == "ROBBERY")
          return color[2];
        if (d.data.crime_type == "ASSAULT")
          return color[3];
        if (d.data.crime_type == "HUMAN TRAFFICKING – SEX ACT")
          return color[4];
        if (d.data.crime_type == "HUMAN TRAFFICKING – INV SERV")
          return color[5];
        if (d.data.crime_type == "BURGLARY")
          return color[6];
        if (d.data.crime_type == "MOTOR VEHICLE THEFT")
          return color[7];
        if (d.data.crime_type == "ARSON")
          return color[8];
        if (d.data.crime_type == "LARCENY THEFT")
          return color[9];
      })




  }


  $('button').click(function () {
    $(this).addClass('active').siblings().removeClass('active')
    var id = $(this).data('id');

    var data1 = [];
    var data2 = [];
    var data3 = [];

    $('#chart').html('')
    $('#chart2').html('')
    $('#chart3').html('')


    data2017.forEach(function (item, index) {
      if (item.District == id) {
        data1.push(item)
      }
    })
    data2018.forEach(function (item, index) {
      if (item.District == id) {
        data2.push(item)
      }
    })
    data2019.forEach(function (item, index) {
      if (item.District == id) {
        data3.push(item)
      }
    })

    console.log(data1);
    console.log(data2);
    console.log(data3);


    set('#chart', data1);
    set('#chart2', data2);
    set('#chart3', data3);

    $('#num1').html('')
    $('#num2').html('')
    $('#num3').html('')
    data1.forEach(function (item, index) {
      $('#num1').append('<span style="color:' + color[index] + '">' + item.crime_type + ': ' + item.Number + '</span>')
    })
    data2.forEach(function (item, index) {
      $('#num2').append('<span style="color:' + color[index] + '">' + item.crime_type + ': ' + item.Number + '</span>')
    })
    data3.forEach(function (item, index) {
      $('#num3').append('<span style="color:' + color[index] + '">' + item.crime_type + ': ' + item.Number + '</span>')
    })
  })

}
requestData();
//