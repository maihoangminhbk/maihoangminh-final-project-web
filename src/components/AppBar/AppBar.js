import React from 'react'
import './AppBar.scss'
import { Container as BootstrapContainer, Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import minhMaiLogo from 'actions/images/logo.png'
import minhMaiAvatar from 'actions/images/avatar.jpg'

function AppBar() {
  return (
    <nav className='navbar-app'>
      <BootstrapContainer className='minhmai-trello-container'>
        <Row>
          <Col sm={5} xs={6} className='col-no-padding'>
            <div className='app-actions'>
              <div className='item all'><i className='fa fa-th' /></div>
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
              <div className='item user-avatar'>
                <img src={minhMaiAvatar} />
              </div>
            </div>
          </Col>
        </Row>
      </BootstrapContainer>
    </nav>
  )
}

export default AppBar