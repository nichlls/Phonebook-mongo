import { useEffect, useState } from "react";
import PersonService from "./services/Persons";

import Filter from "./components/Filter";
import AddPerson from "./components/AddPerson";
import ShowPersons from "./components/ShowPersons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newQuery, setNewQuery] = useState("");
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  const errorTypes = {
    0: "error",
    1: "successful",
  };

  useEffect(() => {
    PersonService.get().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();

    if (checkIfExists(newName)) {
      const existingNameObject = persons.find(
        (person) => person.name === newName
      );

      // check if new number is the same
      if (newNumber === existingNameObject.number) {
        alert(`${newName} is already added to phonebook`);
        setNewName("");
        setNewNumber("");
        return;
      }

      if (
        window.confirm(
          `${existingNameObject.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedNameObject = { ...existingNameObject, number: newNumber };

        PersonService.update(updatedNameObject.id, updatedNameObject)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingNameObject.id ? person : response.data
              )
            );
            setNotification(`Updated ${updatedNameObject.name}`);
            setNotificationType(errorTypes[1]);
            setTimeout(() => {
              setNotification(null);
              setNotificationType(null);
            }, 5000);
          })
          .catch(() => {
            setNotification(`Failed to update ${updatedNameObject.name}`);
            setNotificationType(errorTypes[0]);
            setTimeout(() => {
              setNotification(null);
              setNotificationType(null);
            }, 5000);
          });
        setNewName("");
        setNewNumber("");
        return;
      }
    } else {
      const nameObject = {
        name: newName,
        number: newNumber,
        id: (persons.length + 1).toString(),
      };

      PersonService.post(nameObject)
        .then((response) => {
          // update display
          setPersons(persons.concat(response.data));
          setNotification(`Added ${nameObject.name}`);
          setNotificationType(errorTypes[1]);
          setTimeout(() => {
            setNotification(null);
            setNotificationType(null);
          }, 5000);
          setNewName("");
          setNewNumber("");
        })
        .catch(() => {
          setNotification(`Failed to add ${nameObject.name}`);
          setNotificationType(errorTypes[0]);
          setTimeout(() => {
            setNotification(null);
            setNotificationType(null);
          }, 5000);
          setNewName("");
          setNewNumber("");
        });
    }
  };

  const checkIfExists = (value) => {
    if (persons.some((person) => person.name === value)) {
      return true;
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleQuery = (event) => {
    setNewQuery(event.target.value);
  };

  const deleteEntry = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      PersonService.deleteID(id)
        .then(() => {
          // update display
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          alert("Error sir: ", error);
        });
    }
  };

  const showPersons =
    newQuery !== ""
      ? persons.filter((person) =>
          person.name.toLowerCase().includes(newQuery.toLowerCase())
        )
      : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification type={notificationType} message={notification} />
      <div>
        <Filter newQuery={newQuery} handleQuery={handleQuery} />
      </div>
      <div>
        <h2>Add a new</h2>
      </div>
      <AddPerson
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <ShowPersons persons={showPersons} deleteEntry={deleteEntry} />
    </div>
  );
};

export default App;
