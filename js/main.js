//tool per caricare il proprio json, calcola il range nel dataset e fa vedere dati

//time formatter and parser
var formatDay = d3.timeFormat("%Y_%m_%d"),
    formatTime = d3.timeFormat("%H:%M"),
    formatHour = d3.timeFormat("%H"),
    formatMinute = d3.timeFormat("%M");

var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = 1260 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear().range([0, width]).domain(["00", "23"]),
    y = d3.scaleLinear().range([height, 0]);

var line = d3.line()
    // .curve(d3.curveCatmullRom)
    .x(function(d) {
        return x(d.key);
    })
    .y(function(d) {
        return y(d.value.count);
    });


d3.json("data/Takeout/LocationHistory/LocationHistory_Thesis.min.json", function(error, data) {
    if (error) throw error;

    _.each(data.locations, function(d) {
        d.time = +d.time;
    })

    //return data for July 23, 2016. Shopping day
    // var finalData = data.locations.filter(function(d) {
    //     return d.time >= 1469224800000 && d.time <= 1469311199000;
    // });

    //return data for July 24, 2016. Sunday at Palazzo Lombardia
    // var finalData = data.locations.filter(function(d) {
    //     return d.time >= 1469311200000 && d.time <= 1469397599000;
    // });

    //return data for August 17, 2016. Long train trip back from Perugia to Milan
    // var finalData = data.locations.filter(function(d) {
    //     return d.time >= 1471384800000 && d.time <= 1471471199000;
    // });

    //return data for September 01, 2016. Day in Helsinki
    // var finalData = data.locations.filter(function(d) {
    //     return d.time >= 1472680800000 && d.time <= 1472767199000;
    // });

    //return data for October 01, 2016. Day in the mountains
    // var finalData = data.locations.filter(function(d) {
    //     return d.time >= 1475272800000 && d.time <= 1475359199000;
    // });

    //return data for October 10, 2016. Regular thesis day
    // var finalData = data.locations.filter(function(d) {
    //     return d.time >= 1476050400000 && d.time <= 1476136799000;
    // });

    //return data for November 05, 2016. giri vari per milano
    // var finalData = data.locations.filter(function(d) {
    //     return d.time >= 1478300400000 && d.time <= 1478386799000;
    // });
    
    //return data for November 17, 2016. New York
    // var finalData = data.locations.filter(function(d) {
    //     return d.time >= 1479337200000 && d.time <= 1479423599000;
    // });
    
    //return data for Dicember 12, 2016. tesi normale a Density
    // var finalData = data.locations.filter(function(d) {
    //     return d.time >= 1481497200000 && d.time <= 1481583599000;
    // });

    //return data for Dicember 21, 2016. Going around Milan
    // var finalData = data.locations.filter(function(d) {
    //     return d.time >= 1482274800000 && d.time <= 1482361199000;
    // });

    //return data for Dicember 24, 2016. Birthday
    // var finalData = data.locations.filter(function(d) {
    //     return d.time >= 1482534000000 && d.time <= 1482620399000;
    // });

    //return data for January 04, 2017. Day at home in Milan
    // var finalData = data.locations.filter(function(d) {
    //     return d.time >= 1483484400000 && d.time <= 1483570799000;
    // });
    
    //return data for January 05, 2017. Trip around Milan
    var finalData = data.locations.filter(function(d) {
        return d.time >= 1483570800000 && d.time <= 1483657199000;
    });

    //return data for January 18, 2017. Sara's birthday
    // var finalData = data.locations.filter(function(d) {
    //     return d.time >= 1484694000000 && d.time <= 1484780399000;
    // });
    
    //return data for January 28, 2017. Home and small trip
    // var finalData = data.locations.filter(function(d) {
    //     return d.time >= 1485558000000 && d.time <= 1485644399000;
    // });

    //remap data to prepare it for aggregation
    var dataPoints = finalData.map(function(d) {
        var timestamp = d.time,
            day = formatDay(timestamp),
            time = formatTime(timestamp),
            hour = formatHour(timestamp),
            minute = formatMinute(timestamp);

        return {
            date: day,
            time: time,
            hour: +hour,
            min: +minute,
            timestamp: timestamp,
            type: "line"
        };
    });

    console.log(dataPoints);

    //ready the data for the graph
    var pointsByHour = d3.nest()
        .key(function(d) {
            return d.type;
        })
        .key(function(d) {
            return d.hour;
        })
        .rollup(function(v) {
            return {
                count: +v.length
            };
        })
        .entries(dataPoints);

    console.log(pointsByHour);

    //set max value for y axis
    // y.domain([0, d3.max(pointsByHour[0].values, function(d) {
    //     return d.value.count;
    // })])
    y.domain([0, 210]);

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(24));

    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(22))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("n° of requests");

    var graph = svg.selectAll(".lines")
        .data(pointsByHour)
        .enter().append("g")
        .attr("class", "lines");

    graph.append("path")
        .attr("class", "line")
        .attr("d", function(d) {
            return line(d.values);
        });

    var dots = svg.append("g")
        .selectAll(".dot")
        .data(pointsByHour[0].values)
        .enter();

    dots.append("circle")
        .attr("class", "dot")
        .attr("r", 2.5)
        .attr("cx", function(d) {
            return x(d.key);
        })
        .attr("cy", function(d) {
            return y(d.value.count);
        });

});
