import React from 'react'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Table from '../../../components/Table'
import { useMutation, useQuery } from '../../../lib/graphql'
import { MdHighlightOff, MdWarning } from 'react-icons/md'
import Alert from '../../../components/Alert'
import Button from '../../../components/Button'
import { useRouter } from 'next/router'
import { formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'


const INVALIDATE_USER_SESSION = `
  mutation panelInvalidateUserSession($id: String!) {
    panelInvalidateUserSession (id: $id)
  }
`

const Session = () => {
  const router = useRouter()
  const { data, mutate } = useQuery(`
  query {
    panelGetAllUsersSessions( id: "${router.query.id}") {
      id
      userAgent
      lastUsedAt
      active
    }
  }
`)
  const [deleteData, deleteUser] = useMutation(INVALIDATE_USER_SESSION)
  const remove = id => async () => {
    await deleteUser({ id })
    mutate()
  }
  return (
    <Layout>
      <Title title="Gerenciamento de sessões usuários" />
      <div className="flex flex-col mt-8">
        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {data && data.panelGetAllUsersSessions && data.panelGetAllUsersSessions.length === 0 &&
            <div>
              <Alert text="Usuário não autenticado" bgColor="yellow" icon={<MdWarning size={24} />} />
              <div className="mt-5">
                <Button.Outline href="/users">Voltar</Button.Outline>
              </div>
            </div>
          }
          {data && data.panelGetAllUsersSessions && data.panelGetAllUsersSessions.length > 0 &&
            <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
              <Table>
                <Table.Head>
                  <Table.Th>
                    Sessões
                  </Table.Th>
                  <Table.Th>
                    Usado
                  </Table.Th>
                  <Table.Th></Table.Th>
                </Table.Head>
                <Table.Body>
                  {data && data.panelGetAllUsersSessions && data.panelGetAllUsersSessions.map(item => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm leading-5 text-gray-500 mb-5">{item.id}</div>
                              <div className="text-sm leading-5 font-medium text-gray-900">{item.userAgent}</div>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          {formatDistance(
                            new Date(item.lastUsedAt),
                            new Date(),
                            {
                              locale: ptBR
                            }
                          )} {' '} atrás
                        </Table.Td>
                        <Table.Td>
                          {item.active &&
                            <div className="flex">
                              <a href="#" title="Bloquera acesso" className="text-red-600 hover:text-red-900 flex-end ml-2" onClick={remove(item.id)}><MdHighlightOff /></a>
                            </div>
                          }
                          {!item.active && <span className="text-red-600">Inativo</span>}
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

export default Session