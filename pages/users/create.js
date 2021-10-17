import React, { useState } from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { useMutation, useQuery, fetcher } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Table from '../../components/Table'
import Button from '../../components/Button'
import Alert from '../../components/Alert'
import { MdWarning } from 'react-icons/md'
import Input from '../../components/Input'
import * as Yup from 'yup'

const CREATE_USER = `
    mutation createUser($name: String!, $email: String!, $passwd: String!, $role: String!) {
      panelCreateUser (input: {
        name: $name,
        email: $email,
        passwd: $passwd,
        role: $role
      }) {
        id
        name
        email
      }
    }
  `

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe pelo menos um nome com 3 caracteres')
    .required('Por favor informe um nome'),
  email: Yup.string().email()
    .min(3, 'Email inválido')
    .required('Por favor informe um email')
    .test('is-unique', 'Por favor, utilize outro email. Este já está em uso por outro usuário.', async (value) => {
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
      return false
    }),
  passwd: Yup.string()
    .min(8, 'Por favor, informe pelo menos 8 caracteres para senha')
    .required('Por favor informe a senha')


})

const Index = () => {
  const router = useRouter()
  const [data, createUser] = useMutation(CREATE_USER)
  const [error, setError] = useState(null)

  const form = useFormik({
    initialValues: {
      name: '',
      email: '',
      passwd: '',
      role: '',
    },
    validationSchema: UserSchema,
    onSubmit: async values => {
      const data = await createUser(values)
      if (data && !data.errors) {
        router.push('/users')
      }
    }
  })

  return (
    <Layout>
      <Title title="Criar novo usuário" />
      <div className="flex flex-col mt-8">
        <div className="mb-5">
          <Button.Outline href="/users">
            Voltar
          </Button.Outline>
        </div>

        {data && !!data.errors &&
          <Alert text="Ocorreu algum erro no preenchimento" bgColor="red" />
        }

        <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg p-5">
          <form onSubmit={form.handleSubmit}>
            <div class="md:w-1/2 px-3 mt-5">
              <Input label="Nome" onChange={form.handleChange} value={form.values.name} name="name" errorMessage={form.errors.name} />
              <Input label="Email" placeholder="joao@email.com" onChange={form.handleChange} value={form.values.email} name="email" errorMessage={form.errors.email} />
              <Input label="Senha" placeholder="Preencha a senha" type="password" onChange={form.handleChange} value={form.values.passwd} name="passwd" errorMessage={form.errors.passwd} />
              <Input label="Role" placeholder="Preencha com o role" onChange={form.handleChange} value={form.values.role} name="role" errorMessage={form.errors.role} />
              <Button type="submit">Criar usuário</Button>
            </div>
          </form>
          {error && <Alert text="Favor preencher os campos !" bgColor="yellow" icon={<MdWarning size={24} />} />}
        </div>

      </div>

    </Layout>
  )
}

export default Index
