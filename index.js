const express = require("express");
let people = require("./people");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

morgan.token("requestParams", (req) => JSON.stringify(req.body));
const morganFormat =
  ":method :url :status :res[content-length] - :response-time ms :requestParams";
app.use(morgan(morganFormat));

app.get("/api/people", (req, res) => {
  res.status(200).json(people);
});

app.get("/api/people/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = people.find((person) => person.id === id);
  person ? res.status(200).json(person) : res.status(400).end();
});

app.post("/api/people", (req, res) => {
  const body = req.body;
  console.log("body", body);
  if (!body.name || !body.number) {
    console.log("got here");
    return res
      .status(400)
      .json({ error: "Bad request, number or name missing" });
  }
  if (personFinder(body.name)) {
    return res.status(400).json({ error: `${body.name} already added` });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(100000000 + Math.random() * 900000000),
  };
  people = people.concat(person);
  res.status(201).json(person);
});

app.delete("/api/people/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = people.find((person) => person.id === id);
  if (!person) {
    return res.status(400).end();
  }
  people = people.filter((person) => person.id !== id);
  res.status(204).end();
});

app.get("/api/people/info", (req, res) => {
  res.status(200).send(
    `Phonebook has info for ${people.length} ${
      people.length > 1 ? "people" : "person"
    }
      ${new Date()}
      `
  );
});

app.use((req, res) => {
  res.status(404).json({ error: "Unknown endpoint" });
});

const personFinder = (name) => {
  const person = people.find((person) => person.name === name);
  if (person) {
    return true;
  } else {
    return false;
  }
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
