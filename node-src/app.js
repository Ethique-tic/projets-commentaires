var express = require ('express'),
	app	= express (),
	http = require ('http').Server (app),
	path = require ('path'),
	bodyParser = require ('body-parser').urlencoded ({ extended: false }),
	session = require('cookie-session'),
	crypto  = require ("crypto"),
	joi	= require ("joi"),
	logger = require ('morgan'),
	fs = require ("fs");

var prod = (process.env.NODE_ENV || 'production') == 'production';

global.utils = require ("./utils");

// view engine setup
app.set ('views', path.join (__dirname, 'views'));
app.set ('view engine', 'ejs');

app.locals = {
	escapeHtml: function (string) {
		var entityMap = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': '&quot;',
			"'": '&#39;',
			"/": '&#x2F;',
			"\n": '<br>'
		};
		return String(string).replace(/[&<>"'\/]/g, function (s) { return entityMap[s]; });
	}
};

app.use (logger (prod ? 'tiny' : 'dev'));
app.use (bodyParser);
app.use (function (req, res, next) {
	res.header ("Server", "A piece of electronics and software");
	res.header ("X-Powered-By", "Electricity");

	next ();
})
.use ("/static", express.static ('static'))
.use (function (req, res, next) {
	res.setHeader ('Content-Type', 'text/html');
	next ();
})

.get ("/initfrise", function (req, res) {
	res.render ("initfrise", {});
})
.post ("/initfrise", function (req, res) {
	joi.validate (req.body, {
		csv: joi.string ().required (),
		overwrite: joi.boolean ().optional (),
		separator: joi.string ().required ()
	}, function (joiErr) {
		if (joiErr) {
			res.end (JSON.stringify (joiErr));
			return;
		}

		// Parsing CSV (date / titre / infos)
		var lines = req.body.csv.split ("\n").map (l => l.split (req.body.separator).map (c => c.replace ("\r", "")))
			.filter (l => l.length != 1).map (l => ({
				prettydate: l[0], date: new Date (l[0].toLowerCase ().replace (utils.frMonthRegexp, m => utils.frMonthToEn[m])), title: l[1], desc: l[2]
			})).sort ((a, b) => (a.date.getTime () - b.date.getTime ()));

		if (req.body.overwrite) {
			// Saving JSON
			fs.writeFile ("frise.gen.json", JSON.stringify (lines), function (err) {
				if (err) res.end (JSON.stringify (err));
				else res.redirect ("/initfrise");
			});
		}
		else res.header ("Content-type", "application/json").end (JSON.stringify (lines, null, 2));
	});
})
.get ("/", function (req, res) {
	fs.readFile ("frise.json", function (err, json_frise) {
		if (err) res.end ("<h1>Erreur interne</h1><p>Veuillez réessayer plus tard</p><!-- " + JSON.stringify (err, null, 2) + " -->");
		else fs.readFile ("acteurs.json", function (err, json_acteurs) {
			if (err) res.end ("<h1>Erreur interne</h1><p>Veuillez réessayer plus tard</p><!-- " + JSON.stringify (err, null, 2) + " -->");
			else {
				var frise = JSON.parse(json_frise);
				var acteurs = JSON.parse(json_acteurs);

				res.render ("index", {frise: frise, acteurs: acteurs});
			}
		});
	});
});

var port = normalizePort (process.env.PORT || 3000);
app.listen (port, function (err) {
	if (err)
		console.log ("Unable to start HTTP server on port " + port);
	else
		console.log ("HTTP server started on port " + port);
});

function normalizePort(val) {
	var port = parseInt(val, 10);

	// named pipe
	if (isNaN(port))
		return val;

	// port number
	if (port >= 0)
		return port;

	return false;
}

