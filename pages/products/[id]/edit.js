import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery, fetcher } from '../../../lib/graphql'
import { useFormik } from 'formik'

import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import Select from '../../../components/Select'
import Alert from '../../../components/Alert'

import * as Yup from 'yup'

let id = ''

const UPDATE_PRODUCT = `
    mutation updateProduct($id: String!, $name: String!, $slug: String!, $description: String!, $category: String!) {
      panelUpdateProduct (input: {
        id: $id,
        name: $name,
        slug: $slug,
        description: $description
        category: $category
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
    getProductById(id: "${router.query.id}"){
      id
      name
      slug
      category
      description
    }
  }
  `)

  const GET_ALL_CATEGORIES = `
    query {
      getAllCategories {
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
    description: Yup.string().min(20, 'Por favor informe pelo menos 20 caractéres para descrição ').required('Informe a descrição'),
    category: Yup.string().required('Informe a categoria'),
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

  const [updatedData, updateProduct] = useMutation(UPDATE_PRODUCT)
  const { data: categories, mutate } = useQuery(GET_ALL_CATEGORIES)

  const form = useFormik({
    initialValues: {
      name: '',
      slug: '',
      description: ''
    },
    onSubmit: async values => {
      const product = {
        ...values,
        id: router.query.id
      }
      const data = await updateProduct(product)
      if (data && !data.errors) {
        router.push('/products')
      }
    },
    validationSchema: CategorySchema
  })

  useEffect(() => {
    if (data && data.getProductById) {
      form.setFieldValue('name', data.getProductById.name)
      form.setFieldValue('slug', data.getProductById.slug)
      form.setFieldValue('description', data.getProductById.description)
      form.setFieldValue('category', data.getProductById.category)
    }
  }, [data])

  let options = []
  if (categories &&
    categories.getAllCategories) {
    options = categories.getAllCategories.map(item => {
      return {
        id: item.id,
        label: item.name
      }
    })
  }

  return (
    <Layout>
      <Title title="Editar produto" />
      <div className="flex flex-col mt-8">
        <div className="mb-5">
          <Button.Outline href="/products">
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
                <Input label="Nome do producto" onChange={form.handleChange} value={form.values.name} name="name" errorMessage={form.errors.name} />
                <Input label="Slug" onChange={form.handleChange} value={form.values.slug} name="slug" errorMessage={form.errors.slug} />
                <Input label="Descrição" onChange={form.handleChange} value={form.values.description} name="description" errorMessage={form.errors.description} />
                <Select label="Selecione a categoria" name="category" onChange={form.handleChange} initial={{ id: '', label: 'Selecione...' }} value={form.values.category} options={options} key={form.values.category} errorMessage={form.errors.category} />
                <Button type="submit">Editar produto</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Edit
