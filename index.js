const express = require("express");
const {getDatabase, saveDatabase} = require('./utils');
const bodyParser = require('body-parser');
const request = require('supertest');
const port = 3000;
const app = express();
app.use(bodyParser.json());

require( 'dotenv' ).config( { allowEmptyValues: true } )
const {TESTING_ID, HOST_PORT, HOST_DOMAIN} = process.env;

app.use( function ( req, res, next ) {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token' );
    res.header( 'Access-Control-Allow-Methods', 'GET, PUT, POST, UPDATE, POST' );
    next();
} );

//Methods: GET / POST / PUT / DELETE
/**
 * GET - CITIRE
 * POST - SCRIERE
 * PUT - ACTUALIZARE
 * DELETE - STERGERE
 */

app.get("/invitatii", async (req, res) => {
	const database = await getDatabase();
	return res.status(200).json(database);
});

app.get("/invitatii/:id", async (req, res) => {
	const {id} = req.params;
	const database = await getDatabase();

	if(database[id]) {
		return res.status(200).json(database[id]);
	} else {
		return res.status(404).json({error: "Invitation not found!"});
	}
});


app.post("/invitatii", async (req, res) => {
	const {miri, invitati, mesaj, dataNuntii, acceptat} = req.body;
	const {test} = req.query;

	let database = await getDatabase();
	const id = test ? TESTING_ID : Date.now();
	
	if(test && database[id]) {
		delete database[id];
	}

	const newInvitation = {
		[id]: {
			miri: miri || "",
			invitati: invitati || "",
			mesaj: mesaj || "",
			dataNuntii: dataNuntii || "",
			acceptat: acceptat !== undefined ? acceptat : ""
		}
	}

	const newDatabase = {...database, ...newInvitation};

	await saveDatabase(newDatabase);

	return res.status(200).json(newInvitation);
});


app.put("/invitatii/:id", async (req, res) => {
	const {miri, invitati, mesaj, dataNuntii, acceptat} = req.body;
	const {id} = req.params;

	const database = await getDatabase();


	const foundInvitation = database[id];
	console.log(database)

	if(!foundInvitation) {
		return res.status(404).send("Nu am gasit invitatia!");
	}

	const newInvitation = {
		[id]:  {
			miri: miri || foundInvitation.miri,
			invitati: invitati || foundInvitation.invitati,
			mesaj: mesaj || foundInvitation.mesaj,
			dataNuntii: dataNuntii || foundInvitation.dataNuntii,
			acceptat: acceptat !== undefined ? acceptat : foundInvitation.acceptat
		}
	}
	const newDatabase = {
		...database,
		...newInvitation
		};

	await saveDatabase(newDatabase);

	return res.status(200).json(newInvitation);
});




app.delete("/invitatii/:id", async (req, res) => {
	const {id} = req.params;

	let database = await getDatabase();

	const foundInvitation = database[id];

	if(!foundInvitation) {
		return res.status(404).send("Nu am gasit invitatia!");
	}

	delete database[id];

	await saveDatabase(database);

	return res.status(200).send(id);
});


app.get("/two", (req, res) => {
	res.send("helloTwo!!!");
});

app.listen(HOST_PORT, HOST_DOMAIN, function() {
    console.log("Serverul ruleaza pe http://localhost:3000/");
}).on('error', function(err){
    console.log('on error handler');
    console.log(err);
});