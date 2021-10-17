import React, { useState } from 'react'
import Link from 'next/link'




const Button = ({ children, type, width, ...props }) => {
  return (
    <>
      <button type={type} className={`p-2  bg-green-400  hover:bg-green-500 rounded text-white ${width}`} {...props}>{children}</button>
    </>
  )
}

const ButtonLink = ({ children, href }) => {
  return (
    <>
      <Link href={href}>
        <a className="p-2 bg-green-400 hover:bg-green-500 rounded text-white">{children}</a>
      </Link>
    </>

  )
}

const ButtonOutline = ({ href, children }) => {
  return (
    <Link href={href}>
      <a className="border border-green-400 text-gray-500  rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:text-white hover:bg-green-500 focus:outline-none focus:shadow-outline">{children}</a>
    </Link>
  )
}

Button.Link = ButtonLink
Button.Outline = ButtonOutline

export default Button
