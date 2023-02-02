import React, { useEffect, useState } from 'react'

import { useLocation, useNavigate, useParams } from 'react-router-dom'

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
));

function AppBar() {
  const [workplaceList, setWorkplaceList] = useState([])

  const location = useLocation()
  const navigate = useNavigate()

  const { deleteUserLocalStorage } = useAuth()

  useEffect(() => {
    getOwnership().then((ownershipList) => {
      console.log('app bar - useffect - check')
      const workplaceOrder = ownershipList.workplaceOrder

      console.log('app bar - useEffect - workplaceOrder', workplaceOrder)
      console.log('workplaceOrder.length', workplaceOrder.length)

      let workplaces = []

      workplaceOrder.map((value, index) => {
        getWorkplace(value).then((workplace) => {
          workplaces = [...workplaces, workplace]
          console.log('workplaces and length', workplaces, workplaces.length)
          setWorkplaceList(workplaces)
        })
      })

      console.log('day nay')
    }
    )
  }, [])

  const changeWorkplace = (workplaceId) => {
    navigate(`/workplaces/${workplaceId}`)
  }

  const logout = () => {
    deleteUserLocalStorage()
    navigate('/auth')
  }

  return (
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
                    <img src={minhMaiAvatar} />
                  </div>
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
          </Col>
        </Row>
      </BootstrapContainer>
    </nav>
  )
}

export default AppBar