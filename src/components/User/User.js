import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import './User.scss'
import minhMaiAvatar from 'actions/images/avatar.jpg'
import { Container, Row, InputGroup, FormControl, Button, Form } from 'react-bootstrap'
import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'

import { addUserToWorkplace, getUserListInWorkplace } from 'actions/APICall'
import { useAuth } from 'hooks/useAuth'
import { toast } from 'react-toastify'


function User () {
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState(0)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toogleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [userList, setUserList] = useState([])

  const { user } = useAuth()

  useEffect(() => {
    getUserListInWorkplace(user.workplaceId).then((users) => {
      console.log('users', users)
      setUserList(users)
    }).catch((error) => {
      toast.error(error.message)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onConfirmModalAction = (type) => {

    if (type === MODAL_ACTION_CONFIRM) {
      addNewUser()

    }
    toogleShowConfirmModal()
  }

  const onUserEmailChange = (e) => {
    setUserEmail(e.target.value)
  }

  const addNewUser = async () => {
    // console.log('email - role', userEmail, userRole)
    const data = {
      email: userEmail,
      role: userRole
    }

    console.log('data - workplaceId', data, user.workplaceId)

    await addUserToWorkplace(user.workplaceId, data).then(() => {
      toast.success('Add user successfull')
    }
    ).catch((error) => {
      toast.error(error.message)
    }
    )
  }
  return (
    <Container className='user-container'>
      <Row>
        <div className='item search'>
          <Form.Group>
            <InputGroup className='group-search'>

              <FormControl
                className='input-search'
                placeholder='Add user to workplace'
                type='email'
                value={userEmail}
                onChange={onUserEmailChange}
                onKeyDown={e => (e.key === 'Enter' && toogleShowConfirmModal())}
              />
              <InputGroup.Text className='input-icon-search' onClick={toogleShowConfirmModal}><i className='fa fa-search d-none d-sm-block' /></InputGroup.Text>

            </InputGroup>
            <Form.Check type="checkbox" label="Admin" style={{ color: 'white', fontSize: '15px' }}/>

          </Form.Group>
        </div>
      </Row>
      <Row>
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
                <td><p className='table-data badge'>{ user.role === 1 ? 'Admin' : 'User' }</p></td>
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
        content={`Are you sure you want add user <strong>${userEmail}</strong> with <strong>${userRole === 1 ? 'admin' : 'user'}</strong> permission?`}
      />
    </Container>

  )
}

export default User