import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button, Dropdown } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import NotificationItem from './NotificationItem'
import InfiniteScroll from 'react-infinite-scroll-component'

import { getPersonalNotifications, getFollowingNotifications } from 'actions/APICall'

import './Notification.scss'
import { workplaceData, personalData, grammar } from './data'


function Notification () {

  const [followingNotifications, setFollowingNotifications] = useState([])
  const [personalNotifications, setPersonalNotifications] = useState([])

  const [notificationListPage, setNotificationListPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [personalTab, setPersonalTab] = useState(true)
  // const [workplaceLength, setWorkplaceLength] = useState(workplaceData.length)
  // const [personalLength, setPersonalLength] = useState(personalData.length)

  const { workplaceId } = useParams()

  const [dropdownShow, setDropdownShow] = useState(false)

  useEffect(() => {
    setNotificationListPage(1)

    if (personalTab) {
      const page = 1

      getPersonalNotifications(workplaceId, page).then(result => {
        if (result && result.length == 0) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
        setPersonalNotifications(result)

      })
    } else {
      const page = 1

      getFollowingNotifications(workplaceId, page).then(result => {
        if (result && result.length == 0) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
        setFollowingNotifications(result)
      }
      )}
  }, [personalTab, workplaceId])

  const fetchMoreNotificationData = () => {

    if (personalTab) {
      const page = notificationListPage + 1

      getPersonalNotifications(workplaceId, page).then(result => {
        if (result && result.length == 0) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
        const newPersonalNotifications = [
          ...personalNotifications,
          ...result
        ]
        setPersonalNotifications(newPersonalNotifications)
        setNotificationListPage(notificationListPage + 1)

      })
    } else {
      const page = notificationListPage + 1

      getFollowingNotifications(workplaceId, page).then(result => {
        if (result && result.length == 0) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
        const newFollowingNotifications = [
          ...followingNotifications,
          ...result
        ]
        setFollowingNotifications(newFollowingNotifications)
        setNotificationListPage(notificationListPage + 1)
      }
      )}
  }

  const onSelectTab = (key) => {
    if (key === 'personal') {
      setPersonalTab(true)
    } else {
      setPersonalTab(false)
    }

  }

  return (
    <Dropdown.Menu className='notification-menu'>
      <Dropdown.Header className='notification-header'>
        Notification
      </Dropdown.Header>
      {/* <Dropdown.Divider /> */}
      {/* <Dropdown.Item>
        <div>test</div>
      </Dropdown.Item> */}
      <Tabs
        defaultActiveKey="personal"
        id="fill-tab-example"
        className="mb-3 notification-tab"
        fill
        onSelect={(key) => onSelectTab(key)}
      >
        <Tab eventKey="personal" title="Personal">
          <div id="scrollableDiv2" className='scrollableDiv'>
            <InfiniteScroll
              dataLength={personalNotifications.length}
              next={fetchMoreNotificationData}
              hasMore={hasMore}
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
                personalNotifications.map(notification => {
                  return <NotificationItem key={notification._id} data={notification} onDropdownShow={setDropdownShow} />
                })
              }
            </InfiniteScroll>
          </div>
        </Tab>

        <Tab eventKey="workplace" title="Following">
          <div id="scrollableDiv" className='scrollableDiv'>
            <InfiniteScroll
              dataLength={followingNotifications.length}
              next={fetchMoreNotificationData}
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
                followingNotifications.map(notification => {
                  return <NotificationItem key={notification._id} data={notification} onDropdownShow={setDropdownShow} test="test" />
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