import React from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import Table from '../../components/Table'
import { useMutation, useQuery } from '../../lib/graphql'
import Link from 'next/link'
import { MdDelete, MdEdit, MdWarning } from 'react-icons/md'
import Alert from '../../components/Alert'
import Button from '../../components/Button'


const DELETE_BRAND = `
  mutation deleteBrand($id: String!) {
    deleteBrand (id: $id)
  }
`
const GET_ALL_BRANDS = `
    query {
      getAllBrands {
        id
        name
        slug
      }
    }
  `


const Index = () => {
  const { data, mutate } = useQuery(GET_ALL_BRANDS)
  const [deleteData, deleteBrand] = useMutation(DELETE_BRAND)
  const remove = id => async () => {
    await deleteBrand({ id })
    mutate()
  }
  return (
    <Layout>
      <Title title="Gerenciar Marcas" />
      <div className="mt-5">
        <Button.Link href="/brands/create">
          Criar marca
        </Button.Link>
      </div>
      <div className="flex flex-col mt-8">
        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {data && data.getAllBrands && data.getAllBrands.length === 0 &&
            <Alert text="Nenhuma marca criada" bgColor="yellow" icon={<MdWarning size={24} />} />
          }
          {data && data.getAllBrands && data.getAllBrands.length > 0 &&
            <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
              <Table>
                <Table.Head>
                  <Table.Th>
                    Marcas
                  </Table.Th>
                  <Table.Th></Table.Th>
                </Table.Head>

                <Table.Body>
                  {data && data.getAllBrands && data.getAllBrands.map(item => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm leading-5 font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm leading-5 text-gray-500">{item.slug}</div>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex">
                            <Link href={`/brands/${item.id}/upload`}>
                              <a title="Upload Logo" className="text-green-600 hover:text-green-900 flex-end">Upload Logo</a>
                            </Link>
                            <Link href={`/brands/${item.id}/edit`}>
                              <a title="Editar" className="text-green-600 hover:text-green-900 flex-end"><MdEdit /></a>
                            </Link>
                            <a href="#" title="Remover" className="text-red-600 hover:text-red-900 flex-end ml-2" onClick={remove(item.id)}><MdDelete /></a>

                          </div>

                        </Table.Td>
                      </Table.Tr>
                    )
                  }
                  )}
                </Table.Body>
              </Table>
            </div>
          }
        </div>
      </div>
    </Layout>
  )
}

export default Index