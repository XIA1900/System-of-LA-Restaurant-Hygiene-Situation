var express = require('express');
var app = express();
var oracledb = require('oracledb');
let alert = require('alert'); 
const bodyParser = require('body-parser');
const { resourceLimits } = require('worker_threads');
const { connect } = require('http2');

//app.use(express.static(__dirname + '/public'));
app.use('/public', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);

app.get('/welcome.html', function(req, res) {
    res.sendFile( __dirname + "/navigates/welcome.html");
})

app.get('/tuples.html', function(req, res) {
    dbConnect();
    async function dbConnect() {
        let connection;
        try {
            connection = await oracledb.getConnection({
                user          : "",
                password      : "",
                connectString : ""
            });
            var query = "select sum(num_rows) from (select table_name,num_rows from user_tables where user_tables.table_name not in('INVENTORY_OTHERS','VIOLATION_OTHERS'))";
            var result = await connection.execute(query);
            var res = result.rows;
            console.log(res);
            alert("There are "+res+" tuples in our database.");
        }catch (err) {
            console.error(err);
        }finally {
            if(connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
    res.sendFile( __dirname + "/navigates/tuples.html" )
})

app.get('/trend_selection.html', function(req, res) {
    res.sendFile( __dirname + "/navigates/trend_selection.html" );
})

app.get('/index1.html', function (req, res) {
   res.sendFile( __dirname + "/navigates/index1.html" );
})

app.get('/index2.html', function (req, res) {
    res.sendFile( __dirname + "/navigates/index2.html" );
})

app.get('/index3.html', function (req, res) {
    res.sendFile( __dirname + "/navigates/index3.html" );
})

app.get('/index4.html', function (req, res) {
    res.sendFile( __dirname + "/navigates/index4.html" );
})

app.get('/index5.html', function (req, res) {
    res.sendFile( __dirname + "/navigates/index5.html" );
})


var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

app.post("/process_get1", function (req, res, next) {
    var y = new Array(6);
    y[0] = req.body['2016'];
    y[1] = req.body['2017'];
    y[2] = req.body['2018'];
    y[3] = req.body['2019'];
    y[4] = req.body['2020'];
    y[5] = req.body['2021'];

    var counts = new Array(6);

    dbConnect();

    async function dbConnect() {
        let connection;
        try {
            connection = await oracledb.getConnection({
                user          : "zhangyinghuan",
                password      : "A1vLfMQxVFbR5yLPLbv9JipB",
                connectString : "oracle.cise.ufl.edu:1521/orcl"
            });
            for(var i=0; i<6; i++) {
                if(y[i]) {
                    var year = 2016+i;
                    var query = "select count(ACTIVITY_DATE) from INSPECTIONS where ACTIVITY_DATE like '%/%/"+year+"' group by to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy') order by to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy')";
                    var count = await connection.execute(query);
                    counts[i] = count.rows;
                }
                else counts[i] = "";
            }
            res.render(__dirname + "/results/result1.html", {count0:counts[0], count1:counts[1], count2: counts[2], count3:counts[3], count4:counts[4], count5:counts[5]});
        }catch (err) {
            console.error(err);
        }finally {
            if(connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
});


app.post("/process_get2", function (req, res, next) {
    var year = req.body.year;
    var cities = new Array(6);
    var facity = ["LOS ANGELES", "TORRANCE","GLENDALE","SANTA MONICA","INGLEWOOD","OTHERS"];
    cities[0] = req.body['LA'];
    cities[1] = req.body['TR'];
    cities[2] = req.body['GL'];
    cities[3] = req.body['SM'];
    cities[4] = req.body['IG'];
    cities[5] = req.body['OTHERS'];
    var counts = new Array(6);

    dbConnect();

    async function dbConnect() {
        let connection;
        try {
            connection = await oracledb.getConnection({
                user          : "zhangyinghuan",
                password      : "A1vLfMQxVFbR5yLPLbv9JipB",
                connectString : "oracle.cise.ufl.edu:1521/orcl"
            });
            for(var i=0; i<5; i++) {
                if(cities[i]) {
                    var query = "Select avg(SCORE) From INSPECTIONS ip, INVENTORY it Where ip.FACILITY_ID=it.FACILITY_ID and ACTIVITY_DATE like '%/%/"+year+"' and FACILITY_CITY='"+facity[i]+"' Group by FACILITY_CITY, to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy') order by to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy')";
                    var count = await connection.execute(query);
                    counts[i] = count.rows;
                }
                else counts[i] = "";
            }
            //OTHERS:
            if(cities[5]) {
                var query = "Select avg(SCORE) From INSPECTIONS ip, inventory_others it Where ip.FACILITY_ID=it.FACILITY_ID and ACTIVITY_DATE like '%/%/"+year+"' Group by to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy') order by to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy')";
                var count = await connection.execute(query);
                counts[i] = count.rows;
            }
            else counts[5] = "";
            res.render(__dirname + "/results/result2.html", {year:year, count0:counts[0], count1:counts[1], count2: counts[2], count3:counts[3], count4:counts[4], count5:counts[5]});
        }catch (err) {
            console.error(err);
        }finally {
            if(connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
});


app.post("/process_get3", function (req, res, next) {
    var y = new Array(6);
    y[0] = req.body['2016'];
    y[1] = req.body['2017'];
    y[2] = req.body['2018'];
    y[3] = req.body['2019'];
    y[4] = req.body['2020'];
    y[5] = req.body['2021'];

    var counts = new Array(6);
    var code = req.body.code;

    dbConnect();

    async function dbConnect() {
        let connection;
        try {
            connection = await oracledb.getConnection({
                user          : "zhangyinghuan",
                password      : "A1vLfMQxVFbR5yLPLbv9JipB",
                connectString : "oracle.cise.ufl.edu:1521/orcl"
            });
            if(code != "Others" ) {
                for(var i=0; i<6; i++) {
                    if(y[i]) {
                        var yr = 2016+i;
                        var query = "SELECT COUNT(*) FROM INSPECTIONS ip, VIOLATION v WhERE ip.SERIAL_NUMBER = v.SERIAL_NUMBER and ACTIVITY_DATE like '%/%/"+yr+"' and VIOLATION_CODE='"+code+"' Group by VIOLATION_CODE, to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy') order by to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy')"; 
                        var count = await connection.execute(query);
                        counts[i] = count.rows;
                    }
                    else counts[i] = "";
                }
            }
            else {   //code = others
                for(var i=0; i<6; i++) {
                    if(y[i]) {
                        var yr = 2016+i;
                        var query = "SELECT COUNT(*) FROM INSPECTIONS ip, violation_others v WhERE ip.SERIAL_NUMBER = v.SERIAL_NUMBER and ACTIVITY_DATE like '%/%/"+yr+"' Group by to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy') order by to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy')";
                        var count = await connection.execute(query);
                        counts[i] = count.rows;
                    }
                    else counts[i] = "";
                }
                
            }
            res.render(__dirname + "/results/result3.html", {code:code, count0:counts[0], count1:counts[1], count2: counts[2], count3:counts[3], count4:counts[4], count5:counts[5]});
        }catch (err) {
            console.error(err);
        }finally {
            if(connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

});


app.post("/process_get4", function (req, res, next) {
    var y = new Array(6);
    y[0] = req.body['2016'];
    y[1] = req.body['2017'];
    y[2] = req.body['2018'];
    y[3] = req.body['2019'];
    y[4] = req.body['2020'];
    y[5] = req.body['2021'];

    var counts = new Array(6);
    var scale;
    var risk;

    var scales = ["RESTAURANT (0-30) SEATS ", "RESTAURANT (31-60) SEATS ", "RESTAURANT (61-150) SEATS ", "RESTAURANT (151 + ) SEATS ", "FOOD MKT RETAIL (1-1,999 SF) ", "FOOD MKT RETAIL (2,000+ SF) "];
    var risks = ["LOW RISK", "MODERATE RISK", "HIGH RISK"];

    switch(req.body.scale) {
        case 'r1': 
            scale = scales[0];
            break;
        case 'r2':
            scale = scales[1];
            break;
        case 'r3':
            scale = scales[2];
            break;
        case 'r4':
            scale = scales[3];
            break;
        case 'm1':
            scale = scales[4];
            break;
        case 'm2':
            scale = scales[5];
            break;
    }

    switch(req.body.risk) {
        case 'low':
            risk = risks[0];
            break;
        case 'moderate':
            risk = risks[1];
            break;
        case 'high':
            risk = risks[2];
            break;
    }

    dbConnect();

    async function dbConnect() {
        let connection;
        try {
            connection = await oracledb.getConnection({
                user          : "zhangyinghuan",
                password      : "A1vLfMQxVFbR5yLPLbv9JipB",
                connectString : "oracle.cise.ufl.edu:1521/orcl"
            });
            for(var i=0; i<6; i++) {
                if(y[i]) {
                    var yr = 2016+i;
                    var query = "select count(distinct facility_id) from INSPECTIONS ip natural join PROGRAM p natural join PROGRAM_ELEMENT e where PE_DESCRIPTION='"+scale+risk+"' and ACTIVITY_DATE like '%/%/"+yr+"' group by e. PE_DESCRIPTION, to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy') order by to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy')";
                    var count = await connection.execute(query);
                    counts[i] = count.rows;
                }
                else counts[i] = "";
            }
            res.render(__dirname + "/results/result4.html", {scale:scale, risk:risk, count0:counts[0], count1:counts[1], count2: counts[2], count3:counts[3], count4:counts[4], count5:counts[5]});
        }catch (err) {
            console.error(err);
        }finally {
            if(connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

});


app.post("/process_get5", function (req, res, next) {
    var y = new Array(6);
    y[0] = req.body['2016'];
    y[1] = req.body['2017'];
    y[2] = req.body['2018'];
    y[3] = req.body['2019'];
    y[4] = req.body['2020'];
    y[5] = req.body['2021'];

    var counts = new Array(6);

    dbConnect();

    async function dbConnect() {
        let connection;
        try {
            connection = await oracledb.getConnection({
                user          : "zhangyinghuan",
                password      : "A1vLfMQxVFbR5yLPLbv9JipB",
                connectString : "oracle.cise.ufl.edu:1521/orcl"
            });
            for(var i=0; i<6; i++) {
                if(y[i]) {
                    var year = 2016+i;
                    var query = "Select above*100/al From (select count(*) as al, to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy') from inspections where ACTIVITY_DATE like '%/%/"+year+"' group by to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy') order by to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy')) natural join (select count(*) as above, to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy') from inspections where score>90 and ACTIVITY_DATE like '%/%/"+year+"' group by to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy') order by to_char(to_date(ACTIVITY_DATE,'mm-dd-yyyy'),'mm-yyyy'))";
                    var count = await connection.execute(query);
                    counts[i] = count.rows;
                }
                else counts[i] = "";
            }
            res.render(__dirname + "/results/result5.html", {count0:counts[0], count1:counts[1], count2: counts[2], count3:counts[3], count4:counts[4], count5:counts[5]});
        }catch (err) {
            console.error(err);
        }finally {
            if(connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
});
