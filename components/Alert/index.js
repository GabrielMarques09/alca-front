import React from 'react'

function Alert({ icon, bgColor, text }) {
  return (
    <div className={`bg-${bgColor}-200 bg-opacity-50 border-l-4 border-${bgColor}-600 rounded p-4`}>
      <div className="flex">
        <p className={`text-${bgColor}-400 mr-4`}>{icon}</p>
        <p className={`text-${bgColor}-800`}>{text}</p>
      </div>
    </div>
  )
}

export default Alert
