require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const errorHandlers = require("./errorHandlers");
const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

morgan.token("requestParams", (req) => JSON.stringify(req.body));
const morganFormat =
  ":method :url :status :res[content-length] - :response-time ms :requestParams";
app.use(morgan(morganFormat));

app.get("/api/people", (req, res) => {
  Person.find({}).then((people) => {
    res.status(200).json(people);
  });
});

app.get("/api/people/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.status(200).json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
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
  // if (personFinder(body.name)) {
  //   return res.status(400).json({ error: `${body.name} already added` });
  // }
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then((savedPerson) => {
    res.status(201).json(savedPerson);
  });
});

app.delete("/api/people/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((person) => {
      if (person) {
        res.status(204).end();
      } else {
        res.status(400).end();
      }
    })
    .catch((err) => next(err));
});

app.put("/api/people/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
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

app.use(errorHandlers.badRouteHandler);

app.use(errorHandlers.errorHandler);

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
