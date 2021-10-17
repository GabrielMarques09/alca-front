import React from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import Table from '../../components/Table'
import { useMutation, useQuery } from '../../lib/graphql'
import Link from 'next/link'
import { MdDelete, MdEdit, MdWarning, MdComputer, MdPictureAsPdf } from 'react-icons/md'
import Alert from '../../components/Alert'
import Button from '../../components/Button'
import userPDF from '../../components/Reports/users'


const DELETE_USER = `
  mutation deleteUser($id: String!) {
    panelDeleteUser (id: $id)
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


const Index = () => {
  const { data, mutate } = useQuery(GET_ALL_USERS)
  const [deleteData, deleteUser] = useMutation(DELETE_USER)
  const remove = id => async () => {
    await deleteUser({ id })
    mutate()
  }
  return (
    <Layout>
      <Title title="Gerenciar Usuários" />
      <div className="flex items-center mt-5">
        <div>
          <Button.Link href="/users/create">
            Criar Usuários
          </Button.Link>
        </div>
        <div className="flex items-center justify-center ml-2">
          <Button onClick={(e) => userPDF(data.panelGetAllUsers)}>
            <div className="flex">
              <MdPictureAsPdf size="24" className="mr-2" />
              Gerar PDF
            </div>
          </Button>
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {data && data.panelGetAllUsers && data.panelGetAllUsers.length === 0 &&
            <Alert text="Nenhum usuário criado" bgColor="yellow" icon={<MdWarning size={24} />} />
          }
          {data && data.panelGetAllUsers && data.panelGetAllUsers.length > 0 &&
            <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
              <Table>
                <Table.Head>
                  <Table.Th>
                    Usuários
                  </Table.Th>
                  <Table.Th></Table.Th>
                </Table.Head>

                <Table.Body>

                  {data && data.panelGetAllUsers && data.panelGetAllUsers.map(item => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm leading-5 font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm leading-5 text-gray-500 mb-5">{item.email}</div>
                              <Link href={`/users/${item.id}/passwd`}>
                                <a title="Editar senha" className="border-2 border-indigo-400 rounded p-2 text-blue-600 hover:text-green-900 flex-end">Alterar senha</a>
                              </Link>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex">
                            <Link href={`/users/${item.id}/sessions`}>
                              <a title="Sessões" className="text-blue-600 hover:text-green-900 flex-end"><MdComputer /></a>
                            </Link>
                            <Link href={`/users/${item.id}/edit`}>
                              <a title="Editar" className="text-green-600 hover:text-green-900 flex-end ml-2"><MdEdit /></a>
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
    </Layout >
  )
}

export default Index