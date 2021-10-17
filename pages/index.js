import React, { useState, useEffect } from 'react'
import Input from '../components/Input'
import { useFormik } from 'formik'
import Button from '../components/Button'
import { useMutation } from '../lib/graphql'
import { useRouter } from 'next/router'
import Loading from '../components/Loading'

const AUTH = `
    mutation auth($email: String!, $passwd: String!) {
      auth(input: {
        email: $email,
        passwd: $passwd
      }) {
        refreshToken
        accessToken
      }
    }
  `

const Index = () => {
  const router = useRouter();
  const [authData, auth] = useMutation(AUTH);
  const [signInError, setSignInError] = useState(false)
  const [working, setWorking] = useState(false);
  const form = useFormik({
    initialValues: {
      email: '',
      passwd: ''
    },
    onSubmit: async (values) => {
      const data = await auth(values)

      if (data && data.data) {
        localStorage.setItem('refreshToken', data.data.auth.refreshToken)
        localStorage.setItem('accessToken', data.data.auth.accessToken)
        setWorking(true)
        router.push('/dashboard')
      } else {
        setSignInError(true)
      }
    }
  })

  useEffect(() => {
    let timer = setInterval(() => {
      if (localStorage.getItem('refreshToken') && localStorage.getItem('accessToken')) {
        router.push('/dashboard')
        setWorking(true)
      }
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div>
      <div className="bg-gray-900 min-h-screen flex flex-col">
        {working && <Loading />}

        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <h1 className="mb-8 text-3xl text-center">Alcashop Admin</h1>
            <form onSubmit={form.handleSubmit}>
              <Input label="E-mail" placeholder="Ex: test@email.com" name="email" value={form.values.email} onChange={form.handleChange} errorMessage={form.errors.email} />
              <Input label="Senha" name="passwd" type="password" value={form.values.passwd} onChange={form.handleChange} errorMessage={form.errors.passwd} />
              {signInError && <p className="text-red-500 p-2 font-bold">E-mail ou senha inválidos</p>}
              <button type="submit" className="w-full p-2 bg-green-400  hover:bg-green-500 rounded text-white">Entrar</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Index
