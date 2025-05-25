export default function FilterPanel({ facets, onFilterChange }) {
  const handleFilterChange = (key, value) => {
    onFilterChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <h2>Filters</h2>
      {facets?.length > 0 &&
        Object.entries(facets).map(([key, count]) => (
          <div key={key}>
            <label>
              {key}:
              <input
                type="checkbox"
                onChange={(e) => handleFilterChange(key, e.target.checked)}
              />
              ({count})
            </label>
          </div>
        ))}
    </div>
  );
}
