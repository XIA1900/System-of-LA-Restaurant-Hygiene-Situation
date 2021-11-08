var oracledb = require("oracledb");

var config = {
	user:"xiayuwei",
	password:"980226ASdf",
	connectString:"oracle.cise.ufl.edu:1521/orcl"                                                                                               
};

oracledb.getConnection (config, function(err, connection) {
	if(err) {
		console.error(err.message);
		return;
	}
	connection.execute("select * from country", 
		function(err, result) {
			if(err) {
				console.error(err.message);
				doRelease(connection);
				return;
			}
			console.log(result.metaData);
			console.log(result.rows);
		});
});

function doRelease(connection) {
	connectin.close(
		function(err) {
			if(err) {
				console.error(err.message);
			}
	});
};







