const Filter = ({ newQuery, handleQuery }) => (
  <div>
    Filter shown with <input value={newQuery} onChange={handleQuery} />
  </div>
);

export default Filter;
