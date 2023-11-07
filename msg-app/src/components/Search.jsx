import { useState } from 'react'

const Search = ({ placeholder, data }) => {
  const [filtredData, setfiltredData] = useState([]);

  const handleFilter = (e) => {
    const searchWord = e.target.value
    const newFilter = data.filter((value) => {
      return value.text.toLowerCase().includes(searchWord.toLowerCase());
    });
    setfiltredData(newFilter)
  };

  return (
    <div className='search'>
      <div className='searchInputs'>
        <input className ='searchInput' type="text" placeholder={placeholder} onChange={handleFilter}/>
      </div>
      {filtredData.length !== 0 && (
      <div className='dataResults'>
        {filtredData.map((value, key) => {
          return <div>{value.text}</div>
        })}
      </div>
      )}
    </div>
  )
}

export default Search
