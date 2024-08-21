require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

const Person = require("./models/person");

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

morgan.token("content", (request) => JSON.stringify(request.body));
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :content"
  )
);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted ID" });
  }

  next(error);
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  const date = new Date();

  Person.find().then((persons) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people.</p><p>${date}</p>`
    );
  });
});

app.get("/api/persons", (request, response) => {
  Person.find().then((person) => {
    response.json(person);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id.toString();

  Person.findByIdAndDelete(id)
    .then((person) => {
      if (person) {
        response.status(204).end();
      } else {
        response.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

const generateId = () => {
  // const maxId =
  //   persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
  // return String(maxId + 1);

  let id = Math.random(1000) * 100;
  id = Math.floor(id).toString();
  return id;
};

app.post("/api/persons", (request, response, next) => {
  const data = request.body;

  if (!data.name) {
    return response.status(400).json({ error: "Name must be supplied" });
  }

  if (!data.number) {
    return response.status(400).json({ error: "Number must be supplied" });
  }

  const person = new Person({
    name: data.name,
    number: data.number,
  });

  Person.create(person)
    .then(() => {
      response.json(person);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const data = request.body;

  if (!data.name) {
    return response.status(400).json({ error: "Name must be supplied" });
  }

  if (!data.number) {
    return response.status(400).json({ error: "Number must be supplied" });
  }

  const person = {
    name: data.name,
    number: data.number,
  };

  Person.findByIdAndUpdate(id, person)
    .then(() => {
      response.json(person);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
