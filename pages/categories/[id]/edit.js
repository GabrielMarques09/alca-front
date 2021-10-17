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

const UPDATE_CATEGORY = `
    mutation updateCategory($id: String!, $name: String!, $slug: String!) {
      panelUpdateCategory (input: {
        id: $id,
        name: $name,
        slug: $slug
      }) {
        id
        name
        slug
      }
    }
  `

const Edit = () => {
  const router = useRouter()
  id = router.query.id
  const { data } = useQuery(`
  query {
    getCategoryById(id: "${router.query.id}"){
      id
      name
      slug
    }
  }
  `)

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
        if (ret.data.getCategoryBySlug.id === id) {
          return true
        }
        return false
      }),
  })


  const [updatedData, updateCategory] = useMutation(UPDATE_CATEGORY)

  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    onSubmit: async values => {
      const category = {
        ...values,
        id: router.query.id
      }
      const data = await updateCategory(category)
      if (data && !data.errors) {
        router.push('/categories')
      }
    },
    validationSchema: CategorySchema
  })

  useEffect(() => {
    if (data && data.getCategoryById) {
      form.setFieldValue('name', data.getCategoryById.name)
      form.setFieldValue('slug', data.getCategoryById.slug)
    }
  }, [data])
  return (
    <Layout>
      <Title title="Editar categoria" />
      <div className="flex flex-col mt-8">
        <div className="mb-5">
          <Button.Outline href="/categories">
            Voltar
          </Button.Outline>
        </div>
        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {updatedData && !!updatedData.errors &&
            <Alert text="Ocorreu algum erro no preenchimento" bgColor="red" />
          }
          <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <form onSubmit={form.handleSubmit}>
              <div class="md:w-1/2 px-3">
                <Input label="Nome da categoria" onChange={form.handleChange} value={form.values.name} name="name" errorMessage={form.errors.name} />
                <Input label="Descrição" onChange={form.handleChange} value={form.values.slug} name="slug" errorMessage={form.errors.slug} />
                <Button type="submit">Editar categoria</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Edit
