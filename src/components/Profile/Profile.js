import React, { useState } from 'react'
import { Col, Container, Image, Row, Form, Button } from 'react-bootstrap'
import { useAuth } from 'hooks/useAuth'
import './Profile.scss'

function Profile() {
  const { user } = useAuth()
  const [isEdit, setIsEdit] = useState(false)

  
  return (
    <Container>
      <Row className='mt-5' >
        <Col md='3'>
          <Image src={`${user.cover}`} roundedCircle className='profile-image'/>
        </Col>
        <Col md='5'>
          <Form className="profile-form">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder={user.email} disabled/>
              <Form.Text>
                * We will never share your email with anyone else
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="switch" label="Edit Profile" checked={isEdit} onChange={() => setIsEdit(!isEdit)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" disabled={!isEdit}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" disabled={!isEdit}/>
            </Form.Group>
            <Button variant="primary" type="submit">
        Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile