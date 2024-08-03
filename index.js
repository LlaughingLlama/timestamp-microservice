// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/views/index.html");
});

app.route("/api").get((req, res) => {
	var rDate = req.query.date;
	const unixRegex = /^(\d{13})?$/;
	const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

	if (rDate != null) {
		let date;
		if (unixRegex.test(rDate)) {
			date = new Date(parseInt(rDate));
		} else if (isoDateRegex.test(rDate)) {
			date = new Date(rDate);
		} else {
			res.send({ error: "Invalid Date" });
			return;
		}

		if (isNaN(date.getTime())) {
			res.send({ error: "Invalid Date" });
		} else {
			req.date = date.toUTCString;
			req.time = parseInt(date.getTime().toFixed(0));
			res.send({ unix: req.time, utc: req.date });
		}
	} else {
		req.date = new Date().toUTCString();
		req.time = parseInt(new Date().getTime());
		res.send({ unix: req.time, utc: req.date });
	}
});

app.route("/api/:unix").get((req, res) => {
	const unixRegex = /^(\d{13})?$/;
	if (unixRegex.test(req.params.unix)) {
		date = new Date(parseInt(req.params.unix));
		req.date = date.toUTCString();
		req.time = parseInt(date.getTime().toFixed(0));
		res.send({ unix: req.time, utc: req.date });
	} else {
		res.send({ error: "Invalid Date" });
	}
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
	res.json({ greeting: "hello API" });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
	console.log("Your app is listening on port " + listener.address().port);
});
