import React from 'react'
import Card from '../components/card'
import Layout from '../components/Layout'
import Title from '../components/Title'
import Link from 'next/link';

import { MdShoppingCart, MdSupervisorAccount, MdShoppingBasket } from 'react-icons/md'
import Table from '../components/Table'
import { useQuery } from '../lib/graphql'

const GET_ME = `
    query {
      panelGetMe {
        id
        name
        email
      }
    }
  `

const GET_ALL_CATEGORIES = `
    query {
      getAllCategories {
        id
        name
        slug
      }
    }
  `

const GET_ALL_PRODUCTS = `
    query {
      getAllProducts {
        id
        name
        slug
        description
      }
    }
  `

const GET_ALL_USERS = `
    query {
      panelGetAllUsers {
        id
        name
        email
      }
    }
  `



const Dashboard = () => {
  const { data } = useQuery(GET_ME)
  const dataCategories = useQuery(GET_ALL_CATEGORIES)
  const dataProducts = useQuery(GET_ALL_PRODUCTS)
  const dataUsers = useQuery(GET_ALL_USERS)


  return (
    <Layout>
      <Title title="Alcashop Painel de Controle" />

      <div className="mt-4">
        <div className="flex flex-wrap -mx-6">
          {dataUsers && dataUsers.data &&
            <Card title="Total de usuários" description={dataUsers.data.panelGetAllUsers.length}>
              <Card.Icon colorbg="bg-indigo-600">
                <MdSupervisorAccount size={32} color="#ffff" />
              </Card.Icon>
            </Card>
          }

          {
            dataCategories && dataCategories.data &&
            <Card title="Total Categorias" description={dataCategories.data.getAllCategories.length}>
              <Card.Icon colorbg="bg-yellow-600">
                <MdShoppingCart size={32} color="#ffff" />
              </Card.Icon>
            </Card>
          }



          {
            dataProducts && dataProducts.data &&
            <Card title="Total de produtos" description={dataProducts.data.getAllProducts.length}>
              <Card.Icon colorbg={"bg-pink-600"}>
                <MdShoppingBasket size={32} color="#ffff" />
              </Card.Icon>
            </Card>
          }
        </div>
      </div>

      <div className="flex flex-col mt-8">
        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div
            className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <Table>
              <Table.Head>
                <Table.Th>
                  Nome
                </Table.Th>
                <Table.Th>
                  Título
                </Table.Th>
                <Table.Th>
                  Status
                </Table.Th>
                <Table.Th>
                  Role
                </Table.Th>
                <Table.Th></Table.Th>
              </Table.Head>

              <Table.Body>
                <Table.Tr>
                  {data &&
                    <Table.Td>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                            alt="" />
                        </div>

                        <div className="ml-4">
                          <div className="text-sm leading-5 font-medium text-gray-900">{data.panelGetMe.name}
                          </div>
                          <div className="text-sm leading-5 text-gray-500">{data.panelGetMe.email}</div>
                        </div>
                      </div>
                    </Table.Td>
                  }
                  <Table.Td>
                    <div className="text-sm leading-5 text-gray-900">Software Engineer</div>
                    <div className="text-sm leading-5 text-gray-500">Web dev</div>
                  </Table.Td>

                  <Table.Td>
                    <span
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                  </Table.Td>

                  <Table.Td>
                    Owner
                  </Table.Td>

                  <Table.Td>
                    {data && data.panelGetMe &&
                      <Link href={`/users/${data.panelGetMe.id}/edit`}>
                        <a className="text-indigo-600 hover:text-indigo-900">Edit</a>
                      </Link>
                    }
                  </Table.Td>
                </Table.Tr>

              </Table.Body>
            </Table>
          </div>
        </div>
      </div>

    </Layout>
  )
}

export default Dashboard