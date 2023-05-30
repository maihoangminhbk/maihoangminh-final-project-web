import React, { useEffect, useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import NotificationItem from './NotificationItem'
import InfiniteScroll from 'react-infinite-scroll-component'


import './Notification.scss'
import { workplaceData, personalData, grammar } from './data'


function Notification () {

  const [workplaceDataInput, setWorkplaceDataInput] = useState(workplaceData)
  const [personalDataInput, setPersonalDataInput] = useState(workplaceData)
  const [workplaceLength, setWorkplaceLength] = useState(workplaceData.length)
  const [personalLength, setPersonalLength] = useState(personalData.length)


  const fetchMoreWorkplaceData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {

      const newWorkplaceData = [
        ...workplaceDataInput,
        workplaceDataInput
      ]

      setWorkplaceDataInput(newWorkplaceData)
      setWorkplaceLength(newWorkplaceData.length)
    }, 1500)
  }

  const fetchMorePersonalData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {

      const newPersonalData = [
        ...personalDataInput,
        personalDataInput
      ]

      setPersonalDataInput(newPersonalData)
      setPersonalLength(newPersonalData.length)
    }, 1500)
  }

  return (
    <Dropdown.Menu className='notification-menu'>
      <Dropdown.Header className='notification-header'>
        Notification
      </Dropdown.Header>
      {/* <Dropdown.Divider /> */}
      <Dropdown.ItemText
        className='notification-mark-seen'>
        <Button>Mark seen</Button>
      </Dropdown.ItemText>
      <Tabs
        defaultActiveKey="workplace"
        id="fill-tab-example"
        className="mb-3 notification-tab"
        fill
      >
        <Tab eventKey="workplace" title="Workplace">
          <div id="scrollableDiv" style={{ height: 400, overflow: 'auto' }}>
            <InfiniteScroll
              dataLength={workplaceLength}
              next={fetchMoreWorkplaceData}
              hasMore={true}
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
                workplaceDataInput.map(notification => {
                  return <NotificationItem key={notification._id} data={notification} />
                })
              }
            </InfiniteScroll>
          </div>


        </Tab>
        <Tab eventKey="personal" title="Personal">
          <div id="scrollableDiv2" style={{ height: 400, overflow: 'auto' }}>
            <InfiniteScroll
              dataLength={personalLength}
              next={fetchMorePersonalData}
              hasMore={true}
              loader=<Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              scrollableTarget="scrollableDiv2"
              // height={200}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
            >
              {
                personalDataInput.map(notification => {
                  return <NotificationItem key={notification._id} data={notification} />
                })
              }
            </InfiniteScroll>
          </div>
        </Tab>
      </Tabs>
    </Dropdown.Menu>
  )
}

export default Notification