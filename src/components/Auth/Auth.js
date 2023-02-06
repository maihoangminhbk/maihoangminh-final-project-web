import React, { useState } from 'react'
import { Form, Button, Toast } from 'react-bootstrap'
import { selectAllInlineText } from 'utilities/contentEditable'
import { FaGoogle } from 'react-icons/fa'

import { GoogleLogin } from 'react-google-login'

import './Auth.scss'

import { login, signup, activate } from 'actions/APICall'

import { useAuth } from 'hooks/useAuth'
import { useNavigate } from 'react-router-dom'

import { getOwnership, getWorkplace } from 'actions/APICall'

import { ToastContainer, toast } from 'react-toastify'
import Loading from 'components/Loading/Loading'

// const initialState = { name: '', username: '', password: '', confirmPassword: '' }

const Auth = () => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeToken, setActiveToken] = useState('')
  const [activeCode, setActiveCode] = useState('')

  const [validated, setValidated] = useState(false)

  const [loading, setLoading] = useState(false)

  const { saveUserLocalStorage } = useAuth()
  const navigate = useNavigate()

  // const [formData, setFormData] = useState(initialState)

  const [isSignUp, setIsSignUp] = useState(false)
  const [isActivate, setIsActivate] = useState(false)

  const handleFormNameChange = (e) => setName(e.target.value)
  const handleFormUsernameChange = (e) => setUsername(e.target.value)
  const handleFormPasswordChange = (e) => {
    if (e.target.value.length >= 6) {
      setValidated(true)
    } else {
      setValidated(false)
    }
    setPassword(e.target.value)
  }
  const handleFormActiveCodeChange = (e) => setActiveCode(e.target.value)

  const switchSignUp = () => {
    setIsSignUp(!isSignUp)
    setIsActivate(false)
  }

  const saveLocalStorage = (saveUser) => {
    saveUserLocalStorage(saveUser)
  }


  const handleSubmitForm = async (e) => {
    e.preventDefault()
    setLoading(true)

    console.log('username', username)
    console.log('password', password)

    if (isActivate) {
      const formData = { 'token' : activeToken, 'active_code' : activeCode }
      await activate(formData).catch((error) => {
        toast.error(error.message)
        setLoading(false)
      })
      setIsSignUp(false)
      setIsActivate(false)
      setLoading(false)
      toast.success('Sign up successful')

      return
    }

    if (isSignUp) {
      const formData = { 'name' : name, 'email' : username, 'password' : password }
      await signup(formData)
        .then((returnData) => {
          console.log('auth - handle submit form - return data', returnData)
          setActiveToken(returnData.token)
          setIsActivate(true)
          toast.info('Check your email to get verify code')
        })
        .catch((error) => {
          toast.error(error.message)
          setLoading(false)
        }
        )
    } else {
      const formData = { 'email' : username, 'password' : password }
      await login(formData).then(user => {
        let saveUser = { 'name' : user.name, 'email' : user.email, 'token' : user.token }
        saveLocalStorage(saveUser)
        getOwnership().then((ownershipList) => {
          console.log('auth - handle submit form - check')
          const firstWorkplace = ownershipList.workplaceOrder[0]
          saveUser = { 'name' : user.name, 'email' : user.email, 'token' : user.token, 'workplaceId' : firstWorkplace }
          saveLocalStorage(saveUser)

          navigate(`/workplaces/${firstWorkplace}`)
        })
      }).catch((error) => {
        toast.error(error.message)
        setLoading(false)
      }
      )
    }
    setLoading(false)
  }

  const handleCancel = () => {
    setIsSignUp(true)
    setIsActivate(false)
    setLoading(false)
  }

  const googleSuccess = async (res) => {
    // const result = res?.profileObj;
    // const token = res?.tokenId;


    try {
      // dispatch({ type: AUTH, data: { result, token } });
      console.log('Success')
      console.log(res)
      // history.push('/');
    } catch (error) {
      console.log(error)
    }
  }

  const googleError = () => console.log('Google Sign In was unsuccessful. Try again later')


  return (
    <section className="h-100 gradient-form auth" style={{ backgroundColor: '#eee' }}>
      {
        loading &&
        <Loading />
      }
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center">
                      <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp" style={{ width: '185px' }} alt="logo" />
                      <h4 className="mt-1 mb-5 pb-1">Welcome</h4>
                    </div>
                    <Form validated={validated} onSubmit={handleSubmitForm}>
                      <p>Please enter to your account</p>
                      { !isActivate && isSignUp &&
                        <div className="form-outline mb-4">
                          <Form.Control
                            required
                            className='form-control'
                            size="md"
                            type="text"
                            placeholder="Your name"
                            style={{ border: 0 }}
                            value={name}
                            // spellCheck="false"
                            onClick={selectAllInlineText}
                            onChange={handleFormNameChange}
                          // onBlur={handleFormTitleBlur}
                          // onMouseDown={e => e.preventDefault()}
                          // onKeyDown={saveContentAfterPressEnter}
                          />
                          <Form.Label className="form-label" htmlFor="form2Example11">Your name</Form.Label>
                          <div className="form-notch"><div className="form-notch-leading" style={{ width: '9px' }} /><div className="form-notch-middle" style={{ width: '64.8px' }} /><div className="form-notch-trailing" /></div>
                        </div>
                      }

                      { !isActivate &&
                        <div className="form-outline mb-4">
                          <Form.Control
                            required
                            className='form-control'
                            size="md"
                            type="email"
                            placeholder="Email address"
                            style={{ border: 0 }}
                            value={username}
                            // spellCheck="false"
                            onClick={selectAllInlineText}
                            onChange={handleFormUsernameChange}
                          // onBlur={handleFormTitleBlur}
                          // onMouseDown={e => e.preventDefault()}
                          // onKeyDown={saveContentAfterPressEnter}
                          />
                          <label className="form-label" htmlFor="form2Example11">Username</label>
                          <div className="form-notch"><div className="form-notch-leading" style={{ width: '9px' }} /><div className="form-notch-middle" style={{ width: '64.8px' }} /><div className="form-notch-trailing" /></div>
                        </div>
                      }
                      { !isActivate &&
                      <div className="form-outline mb-4">
                        <Form.Group>
                          <Form.Control
                            required
                            className='form-control'
                            size="md"
                            type="password"
                            style={{ border: 0 }}
                            value={password}
                            // spellCheck="false"
                            onClick={selectAllInlineText}
                            onChange={handleFormPasswordChange}
                            // onBlur={handleFormTitleBlur}
                            // onMouseDown={e => e.preventDefault()}
                            onKeyDown={e => (e.key === 'Enter' && handleSubmitForm)}
                          />
                          <Form.Label className="form-label" htmlFor="form2Example22">Password</Form.Label>
                          <div className="form-notch"><div className="form-notch-leading" style={{ width: '9px' }} /><div className="form-notch-middle" style={{ width: '64.8px' }} /><div className="form-notch-trailing" /></div>
                        </Form.Group>
                      </div>
                      }
                      { !validated &&
                        <div type="valid">At least 6 characters</div>
                      }

                      { isActivate && <div className="form-outline mb-4">
                        <Form.Control
                          required
                          className='form-control'
                          size="md"
                          type="number"
                          placeholder="Active code"
                          style={{ border: 0 }}
                          value={activeCode}
                          // spellCheck="false"
                          onClick={selectAllInlineText}
                          onChange={handleFormActiveCodeChange}
                          // onBlur={handleFormTitleBlur}
                          // onMouseDown={e => e.preventDefault()}
                          // onKeyDown={saveContentAfterPressEnter}
                        />
                        <label className="form-label" htmlFor="form2Example11">Active code</label>
                        <div className="form-notch"><div className="form-notch-leading" style={{ width: '9px' }} /><div className="form-notch-middle" style={{ width: '64.8px' }} /><div className="form-notch-trailing" /></div>
                      </div>
                      }
                      <div className="text-center pt-1 mb-5 pb-1">
                        { isActivate &&
                          <Button className="btn btn-custom-left mb-3" type='submit' size='md' onClick={handleCancel}>Cancel</Button>
                        }
                        <Button className={`btn ${isActivate ? 'btn-custom-right' : 'btn-block'} gradient-custom-2 mb-3`} type='submit' size='md' onClick={null}>{isSignUp? 'Sign up': 'Log in'}</Button>
                        <GoogleLogin
                          clientId="810349711486-vsa36hqu6sfu2re4oc1vgq10830k6k1f.apps.googleusercontent.com"
                          render={(renderProps) => (
                            <Button className="btn  btn-block  gradient-custom-2 mb-3" onClick={renderProps.onClick} disabled={renderProps.disabled} variant="contained">
                              <FaGoogle size={20}/>
                            oogle Log In
                            </Button>
                          )}
                          onSuccess={googleSuccess}
                          onFailure={googleError}
                          cookiePolicy="single_host_origin"
                        />
                        <a className="text-muted mb-3" href="#!">Forgot password?</a>
                      </div>

                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">Do not have an account?</p>
                        {/* <button type="button" className="btn btn-outline-danger">Create new</button> */}
                        <Button className="btn" size='md' onClick={switchSignUp}>{isSignUp? 'Log in': 'Sign up'}</Button>

                      </div>
                    </Form>
                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                  <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h4 className="mb-4">We are more than just a company</h4>
                    <p className="small mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Auth