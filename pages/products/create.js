import React, { useState } from 'react'

import { useMutation, useQuery, fetcher } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { MdWarning } from 'react-icons/md'

import Layout from '../../components/Layout'
import Title from '../../components/Title'
import Button from '../../components/Button'
import Alert from '../../components/Alert'
import Input from '../../components/Input'
import Select from '../../components/Select'

import * as Yup from 'yup'

const CREATE_PRODUCT = `
    mutation createProduct($name: String!, $slug: String!, $description: String!, $category: String!) {
      createProduct (input: {
        name: $name,
        slug: $slug
        description: $description
        category: $category
      }) {
        id
        name
        slug
        description
        category
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

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe pelo menos um nome com 3 caracteres')
    .required('Por favor informe um nome'),
  description: Yup.string()
    .min(30, 'Por favor, informe pelo menos 20 caractéres para descrição')
    .required('Por favor informe a descrição'),
  category: Yup.string()
    .min(30, 'Por favor informe a categoria')
    .required('Por favor informe a categoria'),
  slug: Yup.string()
    .min(3, 'Por favor, informe pelo menos um slug para categoria')
    .required('Por favor informe um slug')
    .test('is-unique', 'Por favor, utilize outro slug. Este já está em uso.',
      async (value) => {
        const ret = await fetcher(JSON.stringify({
          query: `
              query{
                getProductBySlug(slug:"${value}"){
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
  const [data, createProduct] = useMutation(CREATE_PRODUCT)
  const { data: categories, mutate } = useQuery(GET_ALL_CATEGORIES)
  const [error, setError] = useState(null)

  const form = useFormik({
    initialValues: {
      name: '',
      slug: '',
      description: '',
      category: '',
    },
    onSubmit: async values => {
      const data = await createProduct(values)
      if (data && !data.errors) {
        router.push('/products')
      }
    },
    validationSchema: ProductSchema
  })

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
      <Title title="Criar novo produto" />
      <div className="flex flex-col mt-8">
        <div className="mb-5">
          <Button.Outline href="/products">
            Voltar
          </Button.Outline>
        </div>

        {error && <Alert text="Favor preencher os campos !" bgColor="yellow" icon={<MdWarning size={24} />} />}
        <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg p-5">
          <form onSubmit={form.handleSubmit}>
            {data && !!data.errors &&
              <Alert text="Ocorreu algum erro no preenchimento" bgColor="red" />
            }
            <div class="md:w-1/2 px-3">
              <Input label="Nome do produto" onChange={form.handleChange} value={form.values.name} errorMessage={form.errors.name} name="name" />
              <Input label="Slug" onChange={form.handleChange} value={form.values.slug} errorMessage={form.errors.slug} name="slug" />
              <Input label="Descrição" onChange={form.handleChange} value={form.values.description} errorMessage={form.errors.description} name="description" />
              <Select label="Selecione a categoria" name="category" onChange={form.handleChange} initial={{ id: '', label: 'Selecione' }} value={form.values.category} errorMessage={form.errors.category} options={options} />
              <div className="flex justify-end">
                <Button type="submit">Criar produto</Button>
              </div>

            </div>
          </form>

        </div>

      </div>

    </Layout>
  )
}

export default Index