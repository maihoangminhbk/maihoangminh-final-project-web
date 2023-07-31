import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Table from 'react-bootstrap/Table'
import './User.scss'
import minhMaiAvatar from 'actions/images/userAvatar.png'
import { Container, Row, InputGroup, FormControl, Button, Form, Dropdown, Col } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'

import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'

import { addUserToWorkplace, getUserListInWorkplace, searchUsersInWorkplace } from 'actions/APICall'
import { useAuth } from 'hooks/useAuth'
import { toast } from 'react-toastify'

import CustomToggle from 'components/Common/CustomToggle'
import InfiniteScroll from 'react-infinite-scroll-component'


function User () {
  const [userSearch, setUserSearch] = useState('')
  const [userSearchList, setUserSearchList] = useState([])
  const [userRole, setUserRole] = useState(1)
  const [userSearchName, setUserSearchName] = useState('')
  const [userSearchEmail, setUserSearchEmail] = useState('')
  const [userListPage, setUserListPage] = useState(1)
  const [onSearchEdit, setOnSearchEdit] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toogleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [userList, setUserList] = useState([])

  const { user } = useAuth()
  const { workplaceId } = useParams()


  useEffect(() => {
    getUserListInWorkplace(workplaceId).then((users) => {
      setUserList(users)
    }).catch((error) => {
      toast.error(error.message)
    })
  }, [workplaceId])

  useEffect(() => {
    setUserListPage(1)
    const searchData = {
      keyword: userSearch,
      page: 1
    }
    searchUsersInWorkplace(workplaceId, searchData).then(result => {
      if (result && result.length == 0) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }
      setUserSearchList(result)

    })
  }, [userSearch, workplaceId])

  const fetchMoreWorkplaceData = () => {
    const searchData = {
      keyword: userSearch,
      page: userListPage + 1
    }

    searchUsersInWorkplace(workplaceId, searchData).then(result => {
      if (result && result.length == 0) {
        setHasMore(false)
      } else {
        setHasMore(true)
        const newUserSearchList = [
          ...userSearchList,
          ...result
        ]
        setUserSearchList(newUserSearchList)
        setUserListPage(userListPage + 1)
      }

    })
  }

  // useEffect(() => {
  //   if (userSearch) {
  //     setOnSearchEdit(true)
  //   } else {
  //     setOnSearchEdit(false)
  //   }
  // }, [userSearch])

  const onConfirmModalAction = (type) => {

    if (type === MODAL_ACTION_CONFIRM) {
      addNewUser()

    }
    toogleShowConfirmModal()
  }

  const onUserSearchChange = (e) => {
    setUserSearch(e.target.value)
  }

  const onUserSearchFocus = () => {
    setOnSearchEdit(true)
  }

  const onUserSearchBlur = () => {
    setOnSearchEdit(false)
  }

  const addNewUser = async () => {
    // console.log('email - role', userEmail, userRole)
    const data = {
      email: userSearchEmail,
      role: userRole
    }

    await addUserToWorkplace(workplaceId, data).then(() => {
      toast.success('Add user successfull')
    }
    ).catch((error) => {
      toast.error(error.message)
    }
    )
  }

  const onUserSearchClick = (userName, userEmail) => {
    // console.log('onUserSearchClick email', userEmail)
    setUserSearchName(userName)
    setUserSearchEmail(userEmail)
    toogleShowConfirmModal()
  }

  const onUserRoleChange = () => {
    if (userRole == 0) {
      setUserRole(1)
    } else {
      setUserRole(0)
    }
  }

  const RoleFormCheck = () => (
    <Form.Check type="checkbox" label="Admin" checked={!userRole} onClick={onUserRoleChange}/>
  )

  return (
    <div className='user'>
      <Container className='user-container'>
        <Row className='user-form-row'>
          <Dropdown
            show={onSearchEdit}
            className='user-dropdown'
          >
            <Dropdown.Toggle id="dropdown-basic" size='sm' as={CustomToggle}>
              <div className='item search'>
                <Form.Group>
                  <InputGroup className='group-search'>

                    <FormControl
                      className='input-search'
                      placeholder='Add user to workplace'
                      type='text'
                      value={userSearch}
                      onChange={onUserSearchChange}
                      onKeyDown={e => (e.key === 'Enter' && toogleShowConfirmModal())}
                      onFocus={onUserSearchFocus}
                      onBlur={onUserSearchBlur}
                    />
                    <InputGroup.Text className='input-icon-search' onClick={toogleShowConfirmModal}><i className='fa fa-search d-none d-sm-block' /></InputGroup.Text>

                  </InputGroup>
                  {/* <Form.Check type="checkbox" label="Admin" style={{ color: 'white', fontSize: '15px' }}/> */}

                </Form.Group>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className='board-user-list-menu'>
              {/* <Dropdown.Header className='board-user-list-header'>
                  Workplace Users
              </Dropdown.Header> */}
              {/* <Dropdown.Divider /> */}
              <Container className='user-container'>
                <Row className="user-list-row">
                  <div id="scrollableDiv" className='scrollableDiv'>
                    <InfiniteScroll
                      dataLength={userSearchList.length}
                      next={fetchMoreWorkplaceData}
                      hasMore={hasMore}
                      loader=<Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                      scrollableTarget="scrollableDiv"
                      // height={200}
                      endMessage={
                        <p style={{ textAlign: 'center' }}>
                          <b>Yay! You have seen it all</b>
                        </p>
                      }
                    >
                      {
                        userSearchList && userSearchList.map(user => (
                          <Dropdown.Item key={user._id} className='notification-item' onMouseDown={() => onUserSearchClick(user.name, user.email)}>
                            <Container className='item-container'>
                              <Row>
                                <Col sm={3} className='item-avatar'>
                                  <img className="image-avatar" src={user.cover ? user.cover : minhMaiAvatar} />
                                </Col>
                                <Col sm={9} className='item-content'>

                                  <Row className='content-name'>
                                    {user.name}
                                  </Row>
                                  <Row className='content-email'>
                                    {user.email}
                                  </Row>
                                  <Row className='content-role'>
                                  Add
                                  </Row>

                                </Col>
                              </Row>
                            </Container>


                          </Dropdown.Item>
                        ))
                      }
                    </InfiniteScroll>
                  </div>
                </Row>
              </Container>
            </Dropdown.Menu>
          </Dropdown>

          {/* <Form.Check type="checkbox" label="Admin" className="user-checkbox-role"/> */}

        </Row>
        <Row className='user-table-row'>
          <Table striped hover responsive='sm' size="sm" className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Permission</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>

              { userList.map((user, index) => (
                <tr key={index}>
                  <td>
                    <div className='item user-avatar user-avatar-dropdown' >
                      <img src={user.cover === null ? minhMaiAvatar : user.cover} />
                      { user.name}
                    </div>

                  </td>
                  <td><p className='table-data'>{ user.email }</p></td>
                  <td><p className='table-data badge'>{ user.role === 0 ? 'Admin' : 'User' }</p></td>
                  <td><Button>Edit</Button></td>
                </tr>

              )

              )}

            </tbody>
          </Table>
        </Row>
        <ConfirmModal
          show={showConfirmModal}
          onAction={onConfirmModalAction}
          title="Add user"
          content={`Are you sure you want add user <strong>${userSearchName}</strong> with email <strong>${userSearchEmail}</strong> with permission?`}
          ComponentContent={RoleFormCheck}
        />
      </Container>
    </div>

  )
}

export default User