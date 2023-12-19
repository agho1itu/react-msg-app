
const Input = ({ value, onChange, type, placeholder, name, id }) => {
  return (
    <input
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      className='input-field'
      name={name}
      id={id}
    />
  )
}

export default Input
