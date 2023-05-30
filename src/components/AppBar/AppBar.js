import React, { useEffect, useState } from 'react'

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Container as BootstrapContainer, Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import { Dropdown, Form, Button, SplitButton } from 'react-bootstrap'

import { fetchBoardDetails } from 'actions/APICall'

import './AppBar.scss'

import { getOwnership, getWorkplace } from 'actions/APICall'

import { useAuth } from 'hooks/useAuth'

import minhMaiLogo from 'actions/images/logo.png'
import minhMaiAvatar from 'actions/images/avatar.jpg'
import stylePropObject from 'eslint-plugin-react/lib/rules/style-prop-object'
import { arrayMoveImmutable } from 'array-move'

import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import CustomToggle from 'components/Common/CustomToggle'
import Notification from 'components/Notification/Notification'

function AppBar() {
  // const items = [
  //   {
  //     id: 0,
  //     title: 'Cobol',
  //     boardName: 'Current Board'
  //   },
  //   {
  //     id: 1,
  //     title: 'JavaScript',
  //     boardName: 'Current Board'
  //   },
  //   {
  //     id: 2,
  //     title: 'Basic',
  //     boardName: 'Current Board'
  //   },
  //   {
  //     id: 3,
  //     title: 'PHP',
  //     boardName: 'Current Board'
  //   },
  //   {
  //     id: 4,
  //     title: 'Java',
  //     boardName: 'Current Board'
  //   }
  // ]

  const [items, setItems] = useState([])

  const [workplaceList, setWorkplaceList] = useState([])
  const [boardId, setBoard] = useState()
  const [ownership, setOwnership] = useState()
  const [searchPlaceholder, setSearchPlaceHolder] = useState()

  const location = useLocation()
  const navigate = useNavigate()

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
    console.log('board context', boardId)

    if (!boardId) return

    fetchBoardDetails(boardId).then(board => {
      // console.log('board', board)
      // setBoard(board)
      let itemList = []

      board.columns.map(column => {
        column.cards.map(card => {
          const cardWithId = {
            ...card,
            id: card._id,
            boardName: 'Current Board'
          }
          itemList.push(cardWithId)
        })
      })
      setItems(itemList)
    })
  }, [boardId])

  useEffect(() => {
    console.log('appbar items', items)
  }, [items])

  const changeWorkplace = (workplaceId) => {
    console.log('app bar - workplace list', workplaceList)
    const index = workplaceList.findIndex(workplace => {
      return workplace._id === workplaceId
    })

    const newWorkplaceList = arrayMoveImmutable(workplaceList, index, 0)
    setWorkplaceList(newWorkplaceList)

    navigate(`/workplaces/${workplaceId}`)
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
    console.log(string, results)
  }

  const handleOnSelect = (item) => {
    // the item selected
    navigate(`/workplaces/${workplaceList[0]._id}/boards/${item.boardId}/task/${item._id}`)
  }

  const handleOnFocus = () => {
    console.log('Focused')
  }

  return (
    <>
      <nav className='navbar-app'>
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
                        console.log('workplace list', workplaceList)
                      }
                      {

                        workplaceList.map((workplace, index) => {
                          if (index === 0) {
                            return (
                              <>
                                <Dropdown.Item key={workplace._id}>{workplaceList[0]? workplaceList[0].title : 'Choose Workplace'}</Dropdown.Item>
                                <Dropdown.Divider />
                              </>
                            )
                          }

                          return <Dropdown.Item key={workplace._id} onClick={() => changeWorkplace(workplace._id)} >{workplace.title}</Dropdown.Item>


                        })
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
                    {/* <FormControl
                      className='input-search'
                      placeholder='Jump to...'
                    /> */}
                    <div style={{ width: 400 }} className=' custom-search'>
                      <ReactSearchAutocomplete
                        items={items}
                        onSearch={handleOnSearch}
                        // onHover={handleOnHover}
                        onSelect={handleOnSelect}
                        onFocus={handleOnFocus}
                        // autoFocus
                        resultStringKeyName='title'
                        formatResult={formatResult}
                        fuseOptions={ { keys: ['title'] } }
                        className='input-search search'
                        placeholder='Search...'
                      />
                    </div>
                    {/* <InputGroup.Text className='input-icon-search'><i className='fa fa-search d-none d-sm-block' /></InputGroup.Text> */}
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
            <Col sm={5} xs={12} className='right-column col-no-padding d-none d-sm-block'>
              <div className='user-actions'>
                <div className='item quick'><i className='fa fa-plus-square-o' /></div>
                <div className='item news'><i className='fa fa-info-circle' /></div>

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