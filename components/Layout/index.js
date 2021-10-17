import React, { useState, useEffect } from 'react'
import Menu from '../Menu';

import Link from 'next/link';

import { MdLabel, MdHome } from 'react-icons/md'
import { AiOutlineInbox, AiOutlineMacCommand, AiOutlineUsergroupAdd } from 'react-icons/ai'
import { useQuery } from '../../lib/graphql';
import Button from '../Button';

const GET_ME = `
    query {
      panelGetMe {
        id
        name
        email
      }
    }
  `

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data } = useQuery(GET_ME)

  const close = () => {
    setSidebarOpen(false)
  }

  const open = () => {
    setSidebarOpen(true)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location = '/'
  }



  return (

    <div>
      <div className="flex h-screen bg-gray-200">
        <div onClick={close} className={(sidebarOpen ? 'block' : 'hidden') + " fixed z-20 inset-0 bg-black opacity-50 transition-opacity lg:hidden"}></div>
        <div className={
          "block fixed z-30 inset-y-0 left-0 w-64 transition duration-300 transform bg-gray-900 overflow-y-auto lg:translate-x-0 lg:static lg:inset-0 " + (sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in')
        }>
          <Menu.Brand>
            Alcashop
          </Menu.Brand>

          <Menu.Nav>
            <Menu.Item href="/dashboard" icon={<MdHome size={24} />}>
              Dashboard
            </Menu.Item>
            <Menu.Item href="/categories" icon={<MdLabel size={24} />}>
              Categorias
            </Menu.Item>
            <Menu.Item href="/products" icon={<AiOutlineInbox size={24} />}>
              Produtos
            </Menu.Item>
            <Menu.Item href="/brands" icon={<AiOutlineMacCommand size={24} />}>
              Marcas
            </Menu.Item>
            <Menu.Item href="/users" icon={<AiOutlineUsergroupAdd size={24} />}>
              Usuários
            </Menu.Item>

          </Menu.Nav>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex justify-between items-center py-4 px-6 bg-gray-200 border-b-4 border-green-400">
            <div className="flex items-center">
              <button onClick={open} className="text-gray-500 focus:outline-none lg:hidden">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round"></path>
                </svg>
              </button>

            </div>

            <div className="flex items-center">
              <div x-data="{ notificationOpen: false }" className="relative">
                {data &&
                  <div className="flex mr-2 text-green-400">
                    Bem vindo: <p className="mx-2 font-bold cursor-default">{data.panelGetMe.name}</p>
                  </div>
                }
                <div x-show="notificationOpen" click="notificationOpen = false"
                  className="fixed inset-0 h-full w-full z-10" style={{ display: "none" }}></div>

                <div x-show="notificationOpen"
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-10"
                  style={{ width: "20rem", display: "none" }}>
                  <a href="#"
                    className="flex items-center px-4 py-3 text-gray-600 hover:text-white hover:bg-indigo-600 -mx-2">
                    <img className="h-8 w-8 rounded-full object-cover mx-1"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=334&amp;q=80"
                      alt="avatar" />
                    <p className="text-sm mx-2">
                      <span className="font-bold" href="#">Sara Salah</span> replied on the <span
                        className="font-bold text-indigo-400" href="#">Upload Image</span> artical . 2m
                    </p>
                  </a>
                  <a href="#"
                    className="flex items-center px-4 py-3 text-gray-600 hover:text-white hover:bg-indigo-600 -mx-2">
                    <img className="h-8 w-8 rounded-full object-cover mx-1"
                      src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=634&amp;q=80"
                      alt="avatar" />
                    <p className="text-sm mx-2">
                      <span className="font-bold" href="#">Slick Net</span> start following you . 45m
                    </p>
                  </a>
                  <a href="#"
                    className="flex items-center px-4 py-3 text-gray-600 hover:text-white hover:bg-indigo-600 -mx-2">
                    <img className="h-8 w-8 rounded-full object-cover mx-1"
                      src="https://images.unsplash.com/photo-1450297350677-623de575f31c?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=334&amp;q=80"
                      alt="avatar" />
                    <p className="text-sm mx-2">
                      <span className="font-bold" href="#">Jane Doe</span> Like Your reply on <span
                        className="font-bold text-indigo-400" href="#">Test with TDD</span> artical . 1h
                    </p>
                  </a>
                  <a href="#"
                    className="flex items-center px-4 py-3 text-gray-600 hover:text-white hover:bg-indigo-600 -mx-2">
                    <img className="h-8 w-8 rounded-full object-cover mx-1"
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=398&amp;q=80"
                      alt="avatar" />
                    <p className="text-sm mx-2">
                      <span className="font-bold" href="#">Abigail Bennett</span> start following you . 3h
                    </p>
                  </a>
                </div>
              </div>

              <div className="relative">
                <button onClick={() => setDropdownOpen(old => !old)}
                  className="relative block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none">
                  <img className="h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=296&amp;q=80"
                    alt="Your avatar" />
                </button>

                <div onClick={() => setDropdownOpen(false)} className={dropdownOpen ? " block " : "" + "fixed inset-0 h-full w-full z-10"}
                  style={{ display: "none" }}></div>

                {dropdownOpen && <div
                  className={"absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10"}
                  style={{ display: dropdownOpen ? "block" : "" }}>
                  <Link href="/dashboard">
                    <a
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-400 hover:text-white">Dashboard</a>
                  </Link>
                  <Link href="/products">
                    <a
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-400 hover:text-white">Produtos</a>
                  </Link>
                  <a type='button' onClick={logout}
                    className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-green-400 hover:text-white">Logout</a>
                </div>
                }
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
            <div className="container mx-auto px-6 py-8">
              {children}

            </div>
          </main>
        </div>
      </div>
    </div >
  )
}

export default Layout
