import React, { useEffect, useState, useRef, useCallback } from 'react'

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Container as BootstrapContainer, Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import { Dropdown, Form, Button, SplitButton } from 'react-bootstrap'

import { fetchBoardDetails, createWorkplace } from 'actions/APICall'

import './AppBar.scss'

import { getOwnership, getWorkplace } from 'actions/APICall'

import { useAuth } from 'hooks/useAuth'

import minhMaiLogo from 'actions/images/logo.png'
import minhMaiAvatar from 'actions/images/userAvatar.png'
import stylePropObject from 'eslint-plugin-react/lib/rules/style-prop-object'
import { arrayMoveImmutable } from 'array-move'


import CustomToggle from 'components/Common/CustomToggle'
import Notification from 'components/Notification/Notification'

import { toast } from 'react-toastify'

function AppBar() {

  const [workplaceList, setWorkplaceList] = useState([])
  const [boardId, setBoard] = useState()
  const [ownership, setOwnership] = useState()
  const [searchPlaceholder, setSearchPlaceHolder] = useState()

  const [openNewWorkplaceForm, setOpenNewWorkplaceForm] = useState(false)
  const [newWorkplaceTitle, setNewWorkplaceTitle] = useState('')
  const newWorkplaceInputRef = useRef(null)

  const location = useLocation()
  const navigate = useNavigate()

  const { workplaceId } = useParams()

  const { user, deleteUserLocalStorage } = useAuth()

  useEffect(() => {
    getOwnership().then((ownershipList) => {
      setOwnership(ownershipList)
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

  useEffect(() => {
    if (workplaceId) {
      changeWorkplace(workplaceId)
    }
  }, [workplaceId])

  const toogleOpenNewWorkplaceForm = () => {
    setOpenNewWorkplaceForm(!openNewWorkplaceForm)
  }

  const onNewWorkplaceTitleChange = useCallback((e) => setNewWorkplaceTitle(e.target.value), [])


  const changeWorkplace = (workplaceId) => {
    const index = workplaceList.findIndex(workplace => {
      return workplace._id === workplaceId
    })

    const newWorkplaceList = arrayMoveImmutable(workplaceList, index, 0)
    setWorkplaceList(newWorkplaceList)

    navigate(`/workplaces/${workplaceId}`)
    // window.location.reload(false)
    // setTimeout(navigate(0), 1000)
  }

  const logout = async () => {
    await deleteUserLocalStorage()
    navigate('/auth')
  }

  const moveToProfile = () => {
    navigate('/profile')
  }

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: 'block', textAlign: 'left' }}>Card: {item.title}</span>
        <span style={{ display: 'block', textAlign: 'left', fontSize: '10px', color: 'gray' }}>Board: {item.boardName}</span>
      </>
    )
  }

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
  }

  const handleOnSelect = (item) => {
    // the item selected
    navigate(`/workplaces/${workplaceList[0]._id}/boards/${item.boardId}/card/${item._id}`)
  }

  const handleOnFocus = () => {
  }

  const addNewWorkplace = () => {
    if (!newWorkplaceTitle) {
      newWorkplaceInputRef.current.focus()
      return
    }
    const newWorkplaceToAdd = {
      title: newWorkplaceTitle.trim()
    }


    // Call API
    createWorkplace(newWorkplaceToAdd).then(workplace => {
      // const newWorkplaceList = [...workplaceList, workplace]
      // setWorkplaceList(newWorkplaceList)

      setNewWorkplaceTitle('')
      toogleOpenNewWorkplaceForm()
      navigate(0)

    }).catch((error) => {
      setNewWorkplaceTitle('')
      toogleOpenNewWorkplaceForm()
      toast.error(error.message)
    })
  }

  return (
    <>
      <nav className='navbar-app'>
        <BootstrapContainer className='minhmai-trello-container'>
          <Row>
            <Col sm={5} xs={6} className='col-no-padding'>
              <div className='app-actions'>
                { location.pathname !== '/' &&
                <div className='column-dropdown-actions'>
                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" as={CustomToggle}>
                      <div className='item all'><i className='fa fa-th' /></div>
                    </Dropdown.Toggle>


                    <Dropdown.Menu className='workplace-dropdown-menu'>
                      <Dropdown.Header className='workplace-dropdown-header'>
                        <div>
                          {workplaceList[0]? workplaceList[0].title : 'Choose Workplace'}
                        </div>
                      </Dropdown.Header>
                      <Dropdown.Divider />
                      {

                        workplaceList.map((workplace, index) => {
                          if (index === 0) {
                            return (
                              <Dropdown.Item key={workplace._id} className='workplace-dropdown-item'>
                                <Row className='workplace-name-row'>
                                  {workplaceList[0]? workplaceList[0].title : 'Choose Workplace'}
                                </Row>
                                <Row className='workplace-addition-row'>
                                  <div>Current Workplace</div>
                                </Row>
                              </Dropdown.Item>
                            )
                          }

                          return <Dropdown.Item key={workplace._id} onClick={() => changeWorkplace(workplace._id)} className='workplace-dropdown-item'>{workplace.title} </Dropdown.Item>
                        })
                      }
                      { !user.role && !openNewWorkplaceForm &&

                        <div className='add-new-column' onClick={toogleOpenNewWorkplaceForm}>
                          <i className='fa fa-plus icon' />Add another workplace
                        </div>

                      }

                      { openNewWorkplaceForm &&
                        <div className='workplace-enter-new-column'>
                          <Form.Control
                            className='input-enter-new-column'
                            size="sm" type="text"
                            placeholder="Enter column title..."
                            ref={newWorkplaceInputRef}
                            value={newWorkplaceTitle}
                            onChange={onNewWorkplaceTitleChange}
                            onKeyDown={e => (e.key === 'Enter' && addNewWorkplace())}
                          />
                          <Button variant={newWorkplaceTitle ? 'success' : 'error'} size='sm' onClick={addNewWorkplace}>Add Workplace</Button>
                          <span className='cancel-icon' onClick={toogleOpenNewWorkplaceForm}><i className='fa fa-trash icon'></i></span>
                        </div>
                      }
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                }
                {/* <div className='item home'><i className='fa fa-home' /></div> */}
                <div className='item board'>
                  <i className='fa fa-columns' />
                  { !!user.role &&
                    <strong>Boards</strong>
                  }
                  { !user.role &&
                    <strong>Admin</strong>
                  }
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
            <Col sm={5} xs={12} className='right-column col-no-padding d-none d-sm-block'>
              <div className='user-actions'>
                {/* <div className='item quick'><i className='fa fa-plus-square-o' /></div>
                <div className='item news'><i className='fa fa-info-circle' /></div> */}

                <Dropdown>
                  <Dropdown.Toggle id="dropdown-basic" size='sm' as={CustomToggle}>
                    <div className='item notification'><i className='fa fa-bell-o' /></div>
                  </Dropdown.Toggle>
                  <Notification />
                </Dropdown>
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
      <Outlet context={setBoard}/>
    </>
  )
}

export default AppBar