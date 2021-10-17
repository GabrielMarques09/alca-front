import React from 'react'
import { useRouter } from 'next/router'
import { useUpload, useQuery, fetcher, useMutation } from '../../../lib/graphql'
import { useFormik } from 'formik'
import { MdDelete, MdWarning } from 'react-icons/md'

import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import Button from '../../../components/Button'
import Alert from '../../../components/Alert'

let id = ''

const UPLOAD_PRODUCT_IMAGE = `
    mutation uploadProductImage($id: String!, $file: Upload!) {
      panelUploadProductImage (
        id: $id,
        file: $file
      )
    }
  `
const DELETE_IMAGE = `
  mutation deleteProductImage($id: String!, $url: String!) {
    panelDeleteProductImage (id: $id, url: $url)
  }
`

const Upload = ({ id }) => {

  const { data, mutate } = useQuery(`
  query {
    getProductById(id:"${id}"){
      name
      slug
      images
    }
  }
  `)

  const [updatedData, uploadProductImage] = useUpload(UPLOAD_PRODUCT_IMAGE)
  const [deleteData, deleteImage] = useMutation(DELETE_IMAGE)

  const form = useFormik({
    initialValues: {
      id: id,
      file: ''
    },
    onSubmit: async values => {
      const product = {
        ...values,
        id: id
      }
      const data = await uploadProductImage(product)
      if (data && !data.errors) {
        //router.push('/products')
        mutate()
      }
    },
  })

  const delImage = url => async () => {
    await deleteImage({ id: id, url })
    mutate()
  }



  return (
    <Layout>
      <Title title={`Upload de imagens do produto: ${data && data.getProductById.name}`} />
      <div className="mt-2">
        {data?.getProductById?.images === null || data?.getProductById?.images.lenght === 0 && (<Alert text="Não existe imagens para este produto" bgColor="yellow" icon={<MdWarning size={24} />} />)}
        {
          data?.getProductById?.images &&
          data?.getProductById?.images.map(img => {
            return (
              <div key={img} className="inline-block justify-center m-5 p-5 shadow-xl   border border-gray-500 rounded">
                {console.log('image', data)}
                <img src={img} className="w-32 h-32 mt-5 rounded" />
                <div className="flex justify-end ">
                  <button onClick={delImage(img)} className=" -mt-10 bg-red-500 text-white p-2 rounded transition duration-500 hover:bg-red-700">
                    <MdDelete />
                  </button>
                </div>

              </div>
            )
          })}
      </div>
      <div className="flex flex-col mt-8">
        <div className="mb-5">
          <Button.Outline href="/products">
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
                <Button type='submit'>Enviar imagem</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )

}

const UploadWrapper = () => {
  const router = useRouter()
  if (router.query.id) {
    return <Upload id={router.query.id} />
  }

  return <p>Loading...</p>
}

export default UploadWrapper
