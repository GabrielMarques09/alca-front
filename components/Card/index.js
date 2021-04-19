import React from 'react'

function Card({ title, description, children }) {
  return (
    <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
      <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
        {children}
        <div className="mx-5">
          <h4 className="text-2xl font-semibold text-gray-700">{description}</h4>
          <div className="text-gray-500">{title}</div>
        </div>
      </div>
    </div>
  )
}

const CardIcon = ({ children, colorbg }) => {
  return (
    <div className={`p-3 rounded-full ${colorbg} bg-opacity-75`}>
      {children}
    </div>
  )
}

Card.Icon = CardIcon
export default Card
