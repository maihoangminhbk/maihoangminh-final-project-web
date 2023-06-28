import React from 'react'
import { render } from 'react-dom'
import MindMap from 'react-mindmap'
import { map } from './map.js'
import { useParams } from 'react-router-dom'
import { Container } from 'react-bootstrap'

import './MindMap.scss'

export default function TaskMindMap () {
  const { mindmapId } = useParams()
  const { nodes, connections } = map

  return (
    <div className="mindmap">
      <Container className='mindmap-container'>
        {/* <MindMap
          nodes={nodes}
          connections={connections}
        /> */}
      </Container>
    </div>
  )

}
