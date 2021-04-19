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

const CREATE_CATEGORY = `
    mutation createCategory($name: String!, $slug: String!) {
      createCategory (input: {
        name: $name,
        slug: $slug
      }) {
        id
        name
        slug
      }
    }
  `

const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe pelo menos um nome com 3 caracteres')
    .required('Por favor informe um nome'),
  slug: Yup.string()
    .min(3, 'Por favor, informe pelo menos um slug para categoria')
    .required('Por favor informe um slug')
    .test('is-unique', 'Por favor, utilize outro slug. Este já está em uso.', async (value) => {
      const ret = await fetcher(JSON.stringify({
        query: `
            query{
              getCategoryBySlug(slug:"${value}"){
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

})

const Index = () => {
  const router = useRouter()
  const [data, createCategory] = useMutation(CREATE_CATEGORY)
  const [error, setError] = useState(null)

  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    validationSchema: CategorySchema,
    onSubmit: async values => {
      const data = await createCategory(values)
      if (data && !data.errors) {
        router.push('/categories')
      }
    }
  })

  return (
    <Layout>
      <Title title="Criar nova categoria" />
      <div className="flex flex-col mt-8">
        <div className="mb-5">
          <Button.Outline href="/categories">
            Voltar
          </Button.Outline>
        </div>

        {data && !!data.errors &&
          <Alert text="Ocorreu algum erro no preenchimento" bgColor="red" />
        }

        <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg p-5">
          <form onSubmit={form.handleSubmit}>
            <div class="md:w-1/2 px-3 mt-5">
              <Input label="Nome da categoria" onChange={form.handleChange} value={form.values.name} name="name" errorMessage={form.errors.name} />
              <Input label="Slug" onChange={form.handleChange} value={form.values.slug} name="slug" errorMessage={form.errors.slug} />
              <Button type="submit">Criar categoria</Button>
            </div>
          </form>
          {error && <Alert text="Favor preencher os campos !" bgColor="yellow" icon={<MdWarning size={24} />} />}
        </div>

      </div>

    </Layout>
  )
}

export default Index