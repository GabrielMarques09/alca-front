import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery, fetcher } from '../../../lib/graphql'
import { useFormik } from 'formik'

import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import Alert from '../../../components/Alert'

import * as Yup from 'yup'

let id = ''

const UPDATE_USER = `
    mutation updateUser($id: String!, $passwd: String!) {
      panelChangeUserPass (input: {
        id: $id,
        passwd: $passwd,
      })
    }
  `

const Edit = () => {
  const router = useRouter()
  id = router.query.id
  const { data } = useQuery(`
    query {
      panelGetUserById(id: "${router.query.id}"){
        id
        name
        email
        role
      }
    }
    `)



  const UserSchema = Yup.object().shape({
    passwd: Yup.string()
      .min(8, 'Por favor, informe pelo menos uma senha com 8 caracteres')
      .required('Por favor informe uma senha')
  })


  const [updatedData, updateUser] = useMutation(UPDATE_USER)

  const form = useFormik({
    initialValues: {
      passwd: '',
    },
    onSubmit: async values => {
      const user = {
        ...values,
        id: router.query.id
      }
      const data = await updateUser(user)
      if (data && !data.errors) {
        router.push('/users')
      }
    },
    validationSchema: UserSchema
  })

  return (
    <Layout>
      {data &&
        <Title title={`Editar senha: ${data.panelGetUserById.name}`} />
      }
      <div className="flex flex-col mt-8">
        <div className="mb-5">
          <Button.Outline href="/users">
            Voltar
          </Button.Outline>
        </div>
        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {updatedData && !!updatedData.errors &&
            <Alert text="Ocorreu algum erro no preenchimento" bgColor="red" />
          }
          <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <form onSubmit={form.handleSubmit}>
              <div className="md:w-1/2 px-3">
                <Input label="Nova senha" type="password" onChange={form.handleChange} value={form.values.passwd} name="passwd" errorMessage={form.errors.passwd} />
                <Button type="submit">Editar senha</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Edit
