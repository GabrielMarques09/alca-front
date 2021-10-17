import React, { useState } from 'react'

import { useMutation, useQuery, fetcher } from '../../lib/graphql'
import { useFormik, FieldArray, FormikProvider } from 'formik'
import { useRouter } from 'next/router'
import { MdWarning, MdDelete } from 'react-icons/md'

import Layout from '../../components/Layout'
import Title from '../../components/Title'
import Button from '../../components/Button'
import Alert from '../../components/Alert'
import Input from '../../components/Input'
import Select from '../../components/Select'

import * as Yup from 'yup'
import Table from '../../components/Table'

const CREATE_PRODUCT = `
    mutation createProduct($name: String!, $slug: String!, $description: String!, $category: String!, $sku: String, $price: Float, $weight: Float, $stock: Int!, $optionNames: [String!], $variations: [VariationInput!]) {
      panelCreateProduct (input: {
        name: $name,
        slug: $slug
        description: $description
        category: $category
        sku: $sku,
        price: $price,
        weight: $weight,
        optionNames: $optionNames,
        variations: $variations,
        stock: $stock
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
    .min(20, 'Por favor, informe pelo menos 20 caractéres para descrição')
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
      sku: '',
      price: 0,
      weight: 0,
      stock: 0,
      optionName1: '',
      optionName2: '',
      variations: []
    },
    onSubmit: async values => {
      const newValues = {
        ...values, price: Number(values.price), weight: Number(values.weight), optionNames: [values.optionName1, values.optionName2], stock: Number(values.stock), variations: values.variations.map(variation => {
          return {
            ...variation,
            price: Number(variation.price),
            weight: Number(variation.weight),
            stock: Number(variation.stock),
          }
        })
      }
      const data = await createProduct(newValues)
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
            <div class="px-3">
              <Input label="Nome do produto" onChange={form.handleChange} value={form.values.name} errorMessage={form.errors.name} name="name" />
              <Input label="Slug" onChange={form.handleChange} value={form.values.slug} errorMessage={form.errors.slug} name="slug" />
              <Input label="Descrição" onChange={form.handleChange} value={form.values.description} errorMessage={form.errors.description} name="description" />
              <Select label="Selecione a categoria" name="category" onChange={form.handleChange} initial={{ id: '', label: 'Selecione' }} value={form.values.category} errorMessage={form.errors.category} options={options} />
              <Input label="SKU do produto" placeholder="Preencha o SKU do produto" onChange={form.handleChange} value={form.values.sku} errorMessage={form.errors.sku} name="sku" />
              <Input label="Preço do produto" placeholder="Preencha o preço do produto" onChange={form.handleChange} value={form.values.price} errorMessage={form.errors.price} name="price" />
              <Input label="Peso do produto (Em Gramas)" placeholder="Preencha o peso do produto" onChange={form.handleChange} value={form.values.weight} errorMessage={form.errors.weight} name="weight" />
              <Input label="Estoque do produto " placeholder="Preencha o estoque do produto" onChange={form.handleChange} value={form.values.stock} errorMessage={form.errors.stock} name="stock" />
              <h3>Variações / grade de produtos </h3>
              <Input label="Variação 1" onChange={form.handleChange} value={form.values.optionName1} errorMessage={form.errors.optionName1} name="optionName1" />
              <Input label="Variação 2" onChange={form.handleChange} value={form.values.optionName2} errorMessage={form.errors.optionName2} name="optionName2" />
              {form.values.optionName1 !== '' && (<>
                <FormikProvider value={form}>
                  <FieldArray name='variations' render={arrayHelpers => {
                    return (
                      <div>
                        <div className="mb-5">
                          <Button type='button' onClick={() => arrayHelpers.push({ optionName1: '', optionName2: '', sku: '', price: 0, weight: 0, stock: 0 })}>Adicionar Variação</Button>
                        </div>
                        <Table>
                          <Table.Head>
                            <Table.Th>
                              {form.values.optionName1}
                            </Table.Th>
                            {form.values.optionName2 !== '' &&
                              <Table.Th>
                                {form.values.optionName2}
                              </Table.Th>
                            }
                            <Table.Th>
                              SKU
                            </Table.Th>
                            <Table.Th>
                              Preço
                            </Table.Th>
                            <Table.Th>
                              Peso
                            </Table.Th>
                            <Table.Th>
                              Estoque
                            </Table.Th>
                            <Table.Th></Table.Th>
                          </Table.Head>
                          <Table.Body>
                            {form.values.variations.map((variation, index) => {
                              return (
                                <Table.Tr key={index}>
                                  <Table.Td><Input label={form.values.optionName1} onChange={form.handleChange} value={form.values.variations[index].optionName1} name={`variations.${index}.optionName1`} /></Table.Td>
                                  {form.values.optionName2 !== '' &&
                                    <Table.Td>
                                      <Input label={form.values.optionName2} onChange={form.handleChange} value={form.values.variations[index].optionName2} name={`variations.${index}.optionName2`} />
                                    </Table.Td>
                                  }
                                  <Table.Td>
                                    <Input label='SKU' onChange={form.handleChange} value={form.values.variations[index].sku} name={`variations.${index}.sku`} />
                                  </Table.Td>
                                  <Table.Td>
                                    <Input label='Preço' onChange={form.handleChange} value={form.values.variations[index].price} name={`variations.${index}.price`} />
                                  </Table.Td>
                                  <Table.Td>
                                    <Input label='Peso' onChange={form.handleChange} value={form.values.variations[index].weight} name={`variations.${index}.weight`} />
                                  </Table.Td>
                                  <Table.Td>
                                    <Input label='Estoque' onChange={form.handleChange} value={form.values.variations[index].stock} name={`variations.${index}.stock`} />
                                  </Table.Td>
                                  <Table.Td>
                                    <Button type='button' className="text-red-600" onClick={() => arrayHelpers.remove(index)}><MdDelete className="text-red" /></Button>
                                  </Table.Td>
                                </Table.Tr>
                              )
                            })}
                          </Table.Body>
                        </Table>
                      </div>
                    )
                  }} />
                </FormikProvider>
              </>)}
              <div className="flex mt-5">
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