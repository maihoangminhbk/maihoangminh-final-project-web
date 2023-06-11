import React, { useEffect, useState } from 'react'
import { getSlackAuth, getSlackWorkspace, getSlackConnections, getWorkplace, getSlackChannels, createSlackConnection } from 'actions/APICall'
import { useParams } from 'react-router-dom'
import { FcCancel } from 'react-icons/fc'
import { RiSlackFill, RiDeleteBin6Fill } from 'react-icons/ri'

import { Container, Row, Col, Form, Button, Table, ToggleButton } from 'react-bootstrap'

import './SlackChat.scss'

import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { toast } from 'react-toastify'

const data = [

]

function SlackChat() {
  const { workplaceId } = useParams()
  const [slackUrl, setSlackUrl] = useState()
  const [reload, setReload] = useState('')
  const [slackWorkspace, setSlackWorkspace] = useState()
  const [slackConnections, setSlackConnections] = useState([])
  const [openNewConnectionForm, setOpenNewConnectionForm] = useState(false)
  const [boardList, setBoardList] = useState([])
  const [channelList, setChannelList] = useState([])
  const [newChannel, setNewChannel] = useState('')
  const [newBoard, setNewBoard] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [onEdit, setOnEdit] = useState(false)
  const [onEditConnectionId, setOnEditConnectionId] = useState()
  const [selectedChannel, setSelectedChannel] = useState()
  const [selectedBoard, setSelectedBoard] = useState()


  useEffect(() => {
    const getSlackAuthData = {
      workplaceId: workplaceId
    }
    getSlackAuth(getSlackAuthData).then(result => {
      setSlackUrl(result.url)
      console.log('slack URL', slackUrl)
    })
  }, [workplaceId, slackUrl])


  useEffect(() => {
    if (workplaceId) {
      console.log('slack chat - workplace Id', workplaceId)
      const data = {
        workplaceId: workplaceId
      }

      getSlackWorkspace(data).then(workspace => {
        setSlackWorkspace(workspace)
      })
    }
  }, [workplaceId])

  useEffect(() => {
    if (workplaceId) {
      const data = {
        workplaceId: workplaceId
      }

      getSlackConnections(data).then(slackConnections => {
        setSlackConnections(slackConnections)
      })
    }
  }, [workplaceId])

  useEffect(() => {
    getWorkplace(workplaceId).then(workplace => {
      setBoardList(workplace.boardOrder)
      console.log('slack chat - board list', workplace.boardOrder)
    }
    )
  }, [workplaceId])

  useEffect(() => {
    if (slackWorkspace) {
      const data = {
        slackWorkspaceId: slackWorkspace._id
      }

      getSlackChannels(data).then(channels => {
        setChannelList(channels)
        console.log('slack chat - board list', channels)
      }
      )
    }
  }, [slackWorkspace])

  const toogleOpenNewConnectionForm = () => {
    setOpenNewConnectionForm(!openNewConnectionForm)
  }

  const onButtonClick = () => {
    let win = window.open(slackUrl,
      'newwindow',
      'width=600,height=500')
    let timer = setInterval(function() {
      if (win.closed) {
        clearInterval(timer)
        alert('success')
        setReload('success')
      }
    }, 1000)
    return false
  }

  const onChannelSellect = (e) => {
    console.log('e.target.value', e.target.value)
    setNewChannel(e.target.value)
  }

  const onBoardSellect = (e) => {
    console.log('e.target.value', e.target.value)
    setNewBoard(e.target.value)
  }

  const onAddConnection = () => {
    console.log('channel', newChannel)
    console.log('board', newBoard)

    if (newChannel && newBoard) {
      toogleShowConfirmModal()
    } else {
      toast.info('Please fill form')
    }
  }

  const toogleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const onConfirmModalAction = (type) => {

    if (type === MODAL_ACTION_CONFIRM) {
      const newConnection = {
        workplaceId: workplaceId,
        slackWorkspaceId: slackWorkspace._id,
        boardId: newBoard,
        slackChannel: newChannel
      }

      // Call API add conneciton
      createSlackConnection(newConnection).then(connections => {
        setSlackConnections(connections)
        toast.success('Add new connection')
      }).catch((error) => {
        toast.error(error.message)
        toogleShowConfirmModal()
      })

    }
    toogleShowConfirmModal()
    toogleOpenNewConnectionForm()
  }

  const toogleEditConnection = () => {
    setOnEdit(!onEdit)
    setOnEditConnectionId(null)
  }

  const onEditButton = (connection) => {
    setOnEdit(true)
    setOnEditConnectionId(connection._id)
    setSelectedChannel(connection.slackChannel)
    setSelectedBoard(connection.boardTitle)
  }

  const onCancelEdit = () => {
    // setOnEdit(false)
    setOnEditConnectionId(null)
  }

  const onDeleteConnection = (connection) => {

  }

  return (
    <div className='slack-chat'>
      <Container className='slack-chat-container'>
        <Row className='add-slack-row'>
          <a href={slackUrl ? slackUrl : ''} target='_blank' rel="noreferrer">
            <img
              alt="Add to Slack"
              height="40"
              width="139"
              src="https://platform.slack-edge.com/img/add_to_slack.png"
              srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
              onClick={onButtonClick}
            />
          </a>
        </Row>
        <Row className='slack-workspace-row'>
          <i className='slack-workspace-content'><RiSlackFill />{ slackWorkspace ? slackWorkspace.title : '' }</i>
        </Row>
        <Row className='slack-edit-button'>
          <ToggleButton
            id="toggle-check"
            type="checkbox"
            variant="secondary"
            checked={!onEdit}
            // value="1"
            onClick={toogleEditConnection}
            size="sm"
          >
          Edit
          </ToggleButton>
        </Row>

        <Row className='slack-connections-row'>
          { console.log('slack chat - slackconnections', slackConnections)}
          {/* { slackConnections ? slackConnections : '' } */}
          <Table striped hover responsive='sm' size="sm" className="connection-table">
            <thead>
              <tr className='head-row'>
                <th className='channel-col'>Slack channel</th>
                <th className='board-col'>Board</th>
                <th className='status-col'>Status</th>
                <th className='action-col'>
                  {/* <Button className="update-button" variant="success" onClick={toogleEditConnection}>Update</Button> */}
                </th>
              </tr>
            </thead>
            <tbody className='body-row'>

              { slackConnections.map((connection, index) => (
                <tr key={connection._id}>
                  {
                    onEdit && onEditConnectionId === connection._id &&
                  <>
                    <td>
                      <p className='table-data'>
                        <Form.Select
                          aria-label="Channel select"
                          value={selectedChannel}
                          onChange={onChannelSellect}
                        >
                          {
                            channelList.map((channel, index) => {
                              return <option key={index} value={channel}>{channel}</option>
                            })
                          }
                        </Form.Select>
                      </p>
                    </td>
                    <td>
                      <p className='table-data'>
                        <Form.Select
                          aria-label="Board select"
                          value={selectedBoard}
                          onChange={onBoardSellect}
                        >
                          {
                            boardList.map((board, index) => {
                              return <option key={index} value={board.boardId}>{board.title}</option>
                            })
                          }
                        </Form.Select>
                      </p>
                    </td>
                    <td><p className='table-data badge'>{ 'Pending' }</p></td>
                    <td>
                      <Button className="update-button" size="sm" variant="success" onClick={onAddConnection}>Update</Button>
                      <Button className="cancel-button" size="sm" variant='secondary' onClick={onCancelEdit}>Cancel</Button>
                    </td>
                  </>
                  }

                  { onEditConnectionId !== connection._id &&
                  <>
                    <td><p className='table-data'>{ '#' + connection.slackChannel }</p></td>
                    <td><p className='table-data'>{ connection.boardTitle }</p></td>
                    <td><p className='table-data badge'>{ 'OK' }</p></td>
                    <td>
                      { onEdit &&
                      <>
                        <Button className='table-data option-button' size="sm" onClick={() => onEditButton(connection)}>Edit</Button>
                        <RiDeleteBin6Fill className='table-data delete-button' onClick={() => onDeleteConnection(connection)} />
                      </>
                      }
                    </td>


                  </>
                  }
                </tr>
              )
              )}
              { openNewConnectionForm &&
                <tr>
                  <td>
                    <p className='table-data'>
                      <Form.Select
                        aria-label="Channel select"
                        value={newChannel}
                        onChange={onChannelSellect}
                      >
                        <option value=''>Sellect channel</option>
                        {
                          channelList.map((channel, index) => {
                            return <option key={index} value={channel}>{channel}</option>
                          })
                        }
                      </Form.Select>
                    </p>
                  </td>
                  <td>
                    <p className='table-data'>
                      <Form.Select
                        aria-label="Board select"
                        value={newBoard}
                        onChange={onBoardSellect}
                      >
                        <option value=''>Sellect board</option>
                        {
                          boardList.map((board, index) => {
                            return <option key={index} value={board.boardId}>{board.title}</option>
                          })
                        }
                      </Form.Select>
                    </p>
                  </td>
                  <td><p className='table-data badge'>{ 'Pending' }</p></td>
                  <td><Button variant="success" size="sm" onClick={onAddConnection}>Add</Button></td>
                </tr>
              }
            </tbody>
          </Table>
        </Row>
        <Row>
          <Row className='slack-add-new-row'>
            { !openNewConnectionForm &&
            <Col className='add-new-connection' onClick={toogleOpenNewConnectionForm}>
              <i className='fa fa-plus icon' />Add another connection
            </Col>
            }

            { openNewConnectionForm &&
            <Col className='add-new-connection' onClick={toogleOpenNewConnectionForm}>
              <FcCancel />  Cancel
            </Col>
            }

          </Row>
        </Row>
        {/* <div>{reload}</div> */}
      </Container>
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Add new connection"
        content={'<strong>Are you sure you want to add new connection </strong>'}
      />
    </div>
  )
}

export default SlackChat