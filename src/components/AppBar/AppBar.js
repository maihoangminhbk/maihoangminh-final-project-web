import React, { useEffect, useState } from 'react'

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Container as BootstrapContainer, Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import { Dropdown, Form, Button, SplitButton } from 'react-bootstrap'

import './AppBar.scss'

import { getOwnership, getWorkplace } from 'actions/APICall'

import { useAuth } from 'hooks/useAuth'

import minhMaiLogo from 'actions/images/logo.png'
import minhMaiAvatar from 'actions/images/avatar.jpg'
import stylePropObject from 'eslint-plugin-react/lib/rules/style-prop-object'

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}
  >
    {children}
  </a>
))

function AppBar() {
  const [workplaceList, setWorkplaceList] = useState([])

  const location = useLocation()
  const navigate = useNavigate()

  const { user, deleteUserLocalStorage } = useAuth()

  useEffect(() => {
    getOwnership().then((ownershipList) => {
      const workplaceOrder = ownershipList.workplaceOrder

      let workplaces = []

      workplaceOrder.map((value, index) => {
        getWorkplace(value.workplaceId).then((workplace) => {
          workplaces = [...workplaces, workplace]
          setWorkplaceList(workplaces)
        })
      })

    }
    )
  }, [])

  const changeWorkplace = (workplaceId) => {
    navigate(`/workplaces/${workplaceId}`)
  }

  const logout = async () => {
    await deleteUserLocalStorage()
    navigate('/auth')
  }

  const moveToProfile = () => {
    navigate('/profile')
  }

  return (
    <>
      <nav className='navbar-app'>
        {console.log('app bar check')}
        <BootstrapContainer className='minhmai-trello-container'>
          <Row>
            <Col sm={5} xs={6} className='col-no-padding'>
              <div className='app-actions'>
                <div className='item all'><i className='' />
                  { location.pathname !== '/' &&
                <div className='column-dropdown-actions'>

                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" as={CustomToggle}>
                      <div className='item all'><i className='fa fa-th' /></div>
                    </Dropdown.Toggle>


                    <Dropdown.Menu>
                      {
                        workplaceList.map((workplace, index) => (
                          <Dropdown.Item key={index} onClick={() => changeWorkplace(workplace._id)} >{workplace.title}</Dropdown.Item>
                        ))
                      }
                    </Dropdown.Menu>
                  </Dropdown>

                </div>
                  }

                </div>
                <div className='item home'><i className='fa fa-home' /></div>
                <div className='item board'>
                  <i className='fa fa-columns' />
                  <strong>Boards</strong>
                </div>
                <div className='item search'>
                  <InputGroup className='group-search'>
                    <FormControl
                      className='input-search'
                      placeholder='Jump to...'
                    />
                    <InputGroup.Text className='input-icon-search'><i className='fa fa-search d-none d-sm-block' /></InputGroup.Text>
                  </InputGroup>
                </div>
              </div>
            </Col>
            <Col sm={2} xs={6} className='col-no-padding d-none d-sm-block'>
              <div className='app-branding text-center'>
                <a href='#' target='blank'>
                  <img src={minhMaiLogo} className='top-logo' alt='MinhMai-logo' />
                  <span className='minhmai-slogan d-none d-md-block'>minhmaidev</span>

                </a>
              </div>

            </Col>
            <Col sm={5} xs={12} className='col-no-padding d-none d-sm-block'>
              <div className='user-actions'>
                <div className='item quick'><i className='fa fa-plus-square-o' /></div>
                <div className='item news'><i className='fa fa-info-circle' /></div>
                <div className='item notification'><i className='fa fa-bell-o' /></div>
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-basic" size='sm' as={CustomToggle}>
                    <div className='item user-avatar' >
                      <img src={user.cover ? user.cover : minhMaiAvatar} />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item id="dropdown-autoclose-true" onClick={() => moveToProfile()}>
                      <div className='item user-avatar user-avatar-dropdown' >
                        <img src={user.cover ? user.cover : minhMaiAvatar} />
                        {user.name}
                      </div>

                    </Dropdown.Item>
                    <Dropdown.ItemText>{user.email}</Dropdown.ItemText>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => logout()} >Log out</Dropdown.Item>


                  </Dropdown.Menu>
                </Dropdown>

              </div>
            </Col>
          </Row>
        </BootstrapContainer>
      </nav>
      <Outlet />
    </>
  )
}

export default AppBar