const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const axios = require('axios');
require('dotenv').config();
const fs = require('fs');

const PORT = process.env.PORT ?? 5500;

app.use('/public', express.static('./public/'));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view-engine', 'ejs');

app.get('/', (req, res) => {
	res.render('index.ejs');
});

app.get('/api', (req, res) => {
	res.sendFile('./api/api.json', { root: __dirname });
});

app.get('/capi', (req, res) => {
	res.sendFile('./api/district.json', { root: __dirname });
});

app.get('/docs', (req, res) => {
	res.render('docs.ejs');
});

app.get('/province', (req, res) => {
	res.render('province.ejs');
});

app.get('/district', (req, res) => {
	res.render('district.ejs');
});

app.get('/navigator', (req, res) => {
	res.render('navigator.ejs');
});

app.get('/iapi', (req, res) => {
	res.render('iapi.ejs');
});

app.get('/onlydistrict', (req, res) => {
	res.render('onlydistrict.ejs');
});

app.get('/api/p/:id', (req, res, next) => {
	const id = req.params.id.toString();
	if (req.params.id >= 1 && req.params.id <= 7) {
		res.sendFile(`./api/p${id}.json`, { root: __dirname });
	} else {
		res.json({
			data: "Couldn't find data of province  for this  " + id + ' id',
		});
	}
});

app.get('/api/district/:dname', async (req, res, next) => {
	const dname = req.params.dname.toString().toLowerCase();
	const api = await axios.get('https://nepallocation.herokuapp.com/capi');
	const data = api.data;
	const district = data.filter((i) => {
		return i.districtName === dname;
	});
	if (district.length > 0) {
		res.json({ data: district[0] });
	} else {
		res.json({ data: "Couldn't find data for " + dname });
	}
});

app.get('/api/navigator/:lat/:long', async (req, res, next) => {
	const lat = req.params.lat.toString();
	const long = req.params.long.toString();

	const api = await axios.get('https://nepallocation.herokuapp.com/capi');
	const data = api.data;
	const district = data.filter((i) => {
		return i.position['lat'] === lat && i.position['long'] === long;
	});
	if (district.length > 0) {
		res.json({ data: district[0] });
	} else {
		res.json({
			data:
				"Couldn't find data for lat=" +
				lat +
				' and long=' +
				long +
				' Please provide correct one !',
		});
	}
});

app.use((req, res, next) => {
	res.render('404.ejs');
});

app.listen(PORT, () => {
	console.log(`server is runnning on ${PORT}`);
});
