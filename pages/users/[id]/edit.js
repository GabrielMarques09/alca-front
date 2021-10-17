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
    mutation updateUser($id: String!, $name: String!, $email: String!, $role: String!) {
      panelUpdateUser (input: {
        id: $id,
        name: $name,
        email: $email,
        role: $role
      }) {
        id
        name
        email
      }
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
    name: Yup.string()
      .min(3, 'Por favor, informe pelo menos um nome com 3 caracteres')
      .required('Por favor informe um nome'),
    email: Yup.string().email()
      .min(3, 'Email inválido')
      .required('Por favor informe um email').test('is-unique', 'Por favor, utilize outro email. Este já está em uso por outro usuário.', async (value) => {
        const ret = await fetcher(JSON.stringify({
          query: `
              query{
                panelGetUserByEmail(email:"${value}"){
                  id
                }
              }
            `
        }))
        if (ret.errors) {
          return true
        }
        if (ret.data.panelGetUserByEmail.id == id) {
          return true
        }
        return false
      })
  })


  const [updatedData, updateUser] = useMutation(UPDATE_USER)

  const form = useFormik({
    initialValues: {
      name: '',
      email: '',
      role: ''
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

  useEffect(() => {
    if (data && data.panelGetUserById) {
      form.setFieldValue('name', data.panelGetUserById.name)
      form.setFieldValue('email', data.panelGetUserById.email)
      form.setFieldValue('role', data.panelGetUserById.role)
    }
  }, [data])
  return (
    <Layout>
      <Title title="Editar usuário" />
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
                <Input label="Nome" onChange={form.handleChange} value={form.values.name} name="name" errorMessage={form.errors.name} />
                <Input label="Email" placeholder="joao@email.com" onChange={form.handleChange} value={form.values.email} name="email" errorMessage={form.errors.email} />
                <Input label="Role" placeholder="Preencha com o role" onChange={form.handleChange} value={form.values.role} name="role" errorMessage={form.errors.role} />
                <Button type="submit">Editar usuário</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Edit
