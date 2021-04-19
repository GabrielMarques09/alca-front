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

const UPDATE_BRAND = `
    mutation updateBrand($id: String!, $name: String!, $slug: String!) {
      updateBrand (input: {
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
    getBrandById(id: "${router.query.id}"){
      id
      name
      slug
    }
  }
  `)

  const BrandSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Por favor, informe pelo menos um nome com 3 caracteres')
      .required('Por favor informe o nome da marca'),
    slug: Yup.string()
      .min(3, 'Por favor, informe pelo menos um slug para marca')
      .required('Por favor informe um slug')
      .test('is-unique', 'Por favor, utilize outro slug. Este já está em uso.', async (value) => {
        const ret = await fetcher(JSON.stringify({
          query: `
                query{
                  getBrandBySlug(slug:"${value}"){
                    id
                  }
                }
              `
        }))
        if (ret.errors) {
          return true
        }
        if (ret.data.getBrandBySlug.id === id) {
          return true
        }
        return false
      }),
  })


  const [updatedData, updateBrand] = useMutation(UPDATE_BRAND)

  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    onSubmit: async values => {
      const brand = {
        ...values,
        id: router.query.id
      }
      const data = await updateBrand(brand)
      if (data && !data.errors) {
        router.push('/brands')
      }
    },
    validationSchema: BrandSchema
  })

  useEffect(() => {
    if (data && data.getBrandById) {
      form.setFieldValue('name', data.getBrandById.name)
      form.setFieldValue('slug', data.getBrandById.slug)
    }
  }, [data])
  return (
    <Layout>
      <Title title="Editar marca" />
      <div className="flex flex-col mt-8">
        <div className="mb-5">
          <Button.Outline href="/brands">
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
                <Input label="Nome da marca" onChange={form.handleChange} value={form.values.name} name="name" errorMessage={form.errors.name} />
                <Input label="Descrição" onChange={form.handleChange} value={form.values.slug} name="slug" errorMessage={form.errors.slug} />
                <Button type="submit">Editar marca</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Edit
