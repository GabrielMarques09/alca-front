import React from 'react'

const Input = ({ label, onChange, value, name, errorMessage = '' }) => {
  return (
    <div>
      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-last-name">
        {label}
      </label>
      <div className="mb-5">
        <input className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4" id="grid-last-name" name={name} type="text" onChange={onChange} value={value} />
        {errorMessage && <p className="text-red-500 text-xs italic mt-2">{errorMessage}</p>}
      </div>

    </div>
  )
}

export default Input
