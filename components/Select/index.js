import React from 'react'

const Select = ({ name, value, helpText, onChange, label, options = [], initial = {}, errorMessage = '' }) => {
  return (
    <div className="w-full">
      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-last-name">{label}</label>

      <select className="block bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-5" name={name} onChange={onChange} id={'id' + name}>
        {initial && <option value={initial.id}>{initial.label}</option>}
        {options.map(opt => {
          return (
            <option key={opt.id} value={opt.id} selected={value === opt.id}>{opt.label}</option>
          )
        })}
      </select>
      {errorMessage && <p className="text-red-500 text-xs italic mt-2">{errorMessage}</p>}
      {helpText && (
        <p className="text-gray-600 text-xs italic mb-4">{helpText}</p>
      )}
    </div>
  )
}

export default Select
