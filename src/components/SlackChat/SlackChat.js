import React, { useEffect, useState } from 'react'
import { getSlackAuth } from 'actions/APICall'

function SlackChat() {
  const [slackUrl, setSlackUrl] = useState()
  useEffect(() => {
    getSlackAuth().then(result => {
      setSlackUrl(result.url)
      console.log('slack URL', slackUrl)
    })
  }, [slackUrl])
  return (
    <a href={slackUrl ? slackUrl : ''} target='_blank' rel="noreferrer">
      <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
    </a>
  )
}

export default SlackChat