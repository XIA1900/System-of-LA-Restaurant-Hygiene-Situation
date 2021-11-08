//import Chart from 'chart.js';

var oracledb = require("oracledb");

var config = {
	user:"zhangyinghuan",
	password:"A1vLfMQxVFbR5yLPLbv9JipB",
	connectString:"oracle.cise.ufl.edu:1521/orcl"                                                                                               
};



function exe(query) {
	var res;
	oracledb.getConnection (config, function(err, connection) {
		if(err) {
			console.error(err.message);
			return;
		}
		connection.execute(query, 
			function(err, result) {
				if(err) {
					console.error(err.message);
					doRelease(connection);
					return;
				}
				res = result.rows;
				console.log(result.metaData);
				console.log(result.rows);
			}
		)
	}
	);
	return res;
};


function doRelease(connection) {
	connection.close(
		function(err) {
			if(err) {
				console.error(err.message);
			}
	});
};



function getResult_t1() {

	const labels = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	const data = {
		labels: labels,
		datasets:[]
	};
	
	const config = {
		type: "bar",
		data: data,
		options: {
    		responsive: true,
    		plugins: {
      			legend: {position: "top"},
      			title: {
        			display: true,
        			text: "Number of hygiene department working activities"
      			}
    		}
  		}
	};

	var ctx = document.getElementById("diagram1").getContext("2d");
	const mychart = new Chart(ctx,config);

	var y2016 = document.getElementById("t1_y2016");
	var y2017 = document.getElementById("t1_y2017");
	var y2018 = document.getElementById("t1_y2018");
	var y2019 = document.getElementById("t1_y2019");
	var y2020 = document.getElementById("t1_y2020");
	var y2021 = document.getElementById("t1_y2021");

	if(y2016.checked==true) {
		alert("2016");
		var query1 = 'select * from owner where'+ ' "OWNER ID"'+ "='OW0275569'";
		var ans = exe(query1);
		const newDataset = {
			label: "2016",
			backgroundColor: "rgb(20,50,20)",
        	borderColor: "rgb(50,50,50)",
        	data: ans,
		};
		mychart.data.datasets.push(newDataset);
		mychart.update();
	}
	alert("finished");
};


function getResult_t2() {
	const labels = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	const data = {
		labels: labels,
		datasets:[]
	};
	
	const config = {
		type: "line",
		data: data,
		options: {
    		responsive: true,
    		plugins: {
      			legend: {position: "top"},
      			title: {
        			display: true,
        			text: "Different Areas' Average Hygiene Scores"
      			}
    		}
  		}
	};

	var ctx = document.getElementById("diagram2").getContext("2d");
	const mychart = new Chart(ctx,config);

	var y2016 = document.getElementById("t2_y2016");
	var y2017 = document.getElementById("t2_y2017");
	var y2018 = document.getElementById("t2_y2018");
	var y2019 = document.getElementById("t2_y2019");
	var y2020 = document.getElementById("t2_y2020");
	var y2021 = document.getElementById("t2_y2021");

	var year="2016";

	if(y2016.checked==true) year = "2016";
	else if(y2017.checked==true) year = "2017";
	else if(y2018.checked==true) year = "2018";
	else if(y2019.checked==true) year = "2019";
	else if(y2020.checked==true) year = "2020";
	else if(y2021.checked==true) year = "2021";
	else {
		alert("please select a year");
		return;
	}
	
	var la = document.getElementById("t2_LA");
	var tr = document.getElementById("t2_TR");
	var gl = document.getElementById("t2_GL");
	var sm = document.getElementById("t2_SM");
	var ig = document.getElementById("t2_IG");
	var others = document.getElementById("t2_OTHERS");



};


function getResult_t3() {

};

function getResult_t4() {

};

function getResult_t5() {
	var y2016 = document.getElementById("t5_y2016");
	var y2017 = document.getElementById("t5_y2017");
	var y2018 = document.getElementById("t5_y2018");
	var y2019 = document.getElementById("t5_y2019");
	var y2020 = document.getElementById("t5_y2020");
	var y2021 = document.getElementById("t5_y2021");
	ß

};