const ShowPersons = ({ persons, deleteEntry }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.name}>
          <p>
            {person.name} {person.number}
            <button onClick={() => deleteEntry(person.name, person.id)}>
              delete
            </button>
          </p>
        </div>
      ))}
    </div>
  );
};

export default ShowPersons;
