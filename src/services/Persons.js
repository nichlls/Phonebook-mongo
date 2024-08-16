import axios from "axios";
const url = "http://localhost:3001/persons";

const get = () => {
  return axios.get(url);
};

const post = (object) => {
  return axios.post(url, object);
};

const deleteID = (id) => {
  return axios.delete(`${url}/${id}`);
};

const update = (idToUpdate, updatedPerson) => {
  return axios.put(`${url}/${idToUpdate}`, updatedPerson);
};

export default { get, post, deleteID, update };
