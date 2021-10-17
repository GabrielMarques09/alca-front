import React from 'react'
import { useRouter } from 'next/router'
import { useUpload, useQuery, fetcher } from '../../../lib/graphql'
import { useFormik } from 'formik'

import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Button from '../../../components/Button'
import Alert from '../../../components/Alert'

let id = ''

const UPLOAD_BRAND_LOGO = `
    mutation uploadBrandLogo($id: String!, $file: Upload!) {
      panelUploadBrandLogo (
        id: $id,
        file: $file
      )
    }
  `

const Upload = () => {
  const router = useRouter()
  const { data } = useQuery(`
  query {
    getBrandById(id:"${router.query.id}"){
      name
      slug
    }
  }
  `)

  const [updatedData, updateBrand] = useUpload(UPLOAD_BRAND_LOGO)

  const form = useFormik({
    initialValues: {
      id: router.query.id,
      file: ''
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
  })



  return (
    <Layout>
      <Title title={`Upload da logo: ${data && data.getBrandById && data.getBrandById.name}`} />
      <div className="flex flex-col mt-8">
        <div className="mb-5">
          <Button.Outline href="/brands">
            Voltar
          </Button.Outline>
        </div>
        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {updatedData && !!updatedData.errors &&
            <Alert text="Ocorreu algum erro no ao inserir a imagem" bgColor="red" />
          }
          <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <form onSubmit={form.handleSubmit}>
              <div className="md:w-1/2 px-3 flex">
                <input type="file" name="file" onChange={evt => {
                  form.setFieldValue('file', evt.currentTarget.files[0])
                }
                } />
                <Button type='submit'>Enviar logo</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Upload
