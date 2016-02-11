var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', 'config'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Yeah' });
});

router.get('/api/places/list', function(req, res) {
	var results = new Array();

    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        var query = client.query("SELECT * FROM empresa");

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

router.post('/api/user/auth', function(req, res) {
	var results = new Array();
	var data = {user: req.params.usuario, pass: req.params.senha};
	
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
		
		console.log(data.user);
		console.log(data.pass);
		
        var query = client.query("SELECT u.nome from users u WHERE u.usuario = $1 AND u.senha = $2", [data.user, data.pass]);

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            done();
			if(results.length > 0){
				return res.json({success: true, results[0]});
			} else {
				return res.status(403).json({success: false});
			}
        });
    });
});
module.exports = router;
