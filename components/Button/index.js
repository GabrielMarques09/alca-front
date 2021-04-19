import React from 'react'
import Link from 'next/link'

const Button = ({ children, type }) => {
  return (
    <button type={type} className="p-2 bg-blue-500 hover:bg-blue-700 rounded text-white">{children}</button>
  )
}

const ButtonLink = ({ children, href }) => {
  return (
    <Link href={href}>
      <a className="p-2 bg-blue-500 hover:bg-blue-700 rounded text-white">{children}</a>
    </Link>
  )
}

const ButtonOutline = ({ href, children }) => {
  return (
    <Link href={href}>
      <a className="border border-indigo-500 text-indigo-500 rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:text-white hover:bg-indigo-600 focus:outline-none focus:shadow-outline">{children}</a>
    </Link>
  )
}

Button.Link = ButtonLink
Button.Outline = ButtonOutline

export default Button
