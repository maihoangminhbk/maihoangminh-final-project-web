import React from 'react'
import { render } from 'react-dom'
import MindMap from 'react-mindmap'
import { map } from './map.js'
import { useParams } from 'react-router-dom'

export default function TaskMindMap () {
  const { mindmapId } = useParams()
  const { nodes, connections } = map

  return (
    <MindMap
      nodes={nodes}
      connections={connections}
    />
  )

}
