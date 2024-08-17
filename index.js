require("dotenv").config();

const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

app.use(express.json());

morgan.token("content", (request) => JSON.stringify(request.body));
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :content"
  )
);

app.use(cors());

app.use(express.static("dist"));

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  const date = new Date();

  response.send(
    `<p>Phonebook has info for ${persons.length} people.</p><p>${date}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  Person.find().then((person) => {
    response.json(person);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id.toString();

  Person.findById(id)
    .then((p) => {
      response.json(p);
    })
    .catch(() => {
      return response.status(404).end();
    });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id.toString();

  Person.findByIdAndDelete(id)
    .then((person) => {
      if (person) {
        console.log("Deleted: ", person);
        response.status(204).end();
      } else {
        response.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      response.status(400).send({ error: "Supplied ID is not valid" });
    });
});

const generateId = () => {
  // const maxId =
  //   persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
  // return String(maxId + 1);

  let id = Math.random(1000) * 100;
  id = Math.floor(id).toString();
  return id;
};

app.post("/api/persons", (request, response) => {
  const data = request.body;

  // if (persons.some((existingPerson) => existingPerson.name === person.name)) {
  //   return response.status(400).json({ error: "Name must be unique" });
  // }

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
    .catch((error) => {
      console.log(`Failed to add ${person}, with error: ${error}`);
    });
});

app.put("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const data = request.body;

  // if (!person) {
  //   return response.status(404).json({ error: "Person not found" });
  // }

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

  Person.updateOne({ _id: id }, { $set: person })
    .then(() => {
      response.json(person);
    })
    .catch((error) => {
      console.log(`Failed to update person with error: ${error}`);
    });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
