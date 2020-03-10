const Joi = require("joi");
const express = require("express");
const app = express();
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

//permite a leitura de json
app.use(express.json());

//const collection = db.collection("novoDB");
const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" }
];

mongo.connect(url, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }

  const base = client.db("DB");
  //cria DB
  const collection = base.collection("Tabela");

  app.get("/", (req, res) => {
    collection.find().toArray((err, items) => {
      console.log(items);
      const valor = JSON.stringify(items);
      res.send(`Itens do banco de dados: ${valor}`);
    });
  });

  app.post("/api/courses", (req, res) => {
    const schema = {
      name: Joi.string()
        .min(3)
        .required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error) {
      res.status(400).send(result.error.details[0].message);
      return;
    }

    const course = {
      name: req.body.name
    };
    //courses.push(course);
    base.collection("Tabela").insertOne(course);
    res.send(course);
  });

  app.get("/api/courses/:name", (req, res) => {
      console.log(req);
    collection.findOne({ name: req.params.name }, (err, item) => {
      res.send(item);
    });
  });
});

app.listen(3002, () => console.log("listening on port 3002"));
