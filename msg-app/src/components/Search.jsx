import { useState } from 'react'
import search from './assets/search.svg';
import close from './assets/close.svg'

const Search = ({ placeholder, data }) => {
  const [filtredData, setfiltredData] = useState([]);
  const [wordEntered, setWordEntered] = useState('');

  const handleFilter = (e) => {
    const searchWord = e.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.sender.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === '') {
      setfiltredData([])
    } else {
      setfiltredData(newFilter)
    }
  };

  const clearInput = () => {
    setfiltredData([]);
    setWordEntered('')
  }

  return (
    <div className='search'>
      <div className='searchInputs'>

        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />

        <div className='searchIcon'>
          {filtredData.length === 0 ? <img src={search} alt='Search'/> : <img src={close} alt='Close' id='clearBtn' onClick={clearInput}/>}
        </div>

      </div>

      {filtredData.length !== 0 && (
        <div className='dataResults'>
          {filtredData.map((value, key) => {
            return <p>{value.sender}</p>
          })}
        </div>
      )}
    </div>
  )
}

export default Search