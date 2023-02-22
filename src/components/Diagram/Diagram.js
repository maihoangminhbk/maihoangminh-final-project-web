import React, { useState, useEffect } from 'react'

import { useParams } from 'react-router-dom'
import * as go from 'gojs'
import { ReactDiagram } from 'gojs-react'

import { fetchBoardDetails } from 'actions/APICall'
import { mapOrder } from 'utilities/sorts'
import { getRandomInt } from 'utilities/getRandom'

import { TaperedLink } from './TaperedLink'

import './Diagram.scss' // contains .diagram-component CSS

// ...

/**
 * Diagram initialization method, which is passed to the ReactDiagram component.
 * This method is responsible for making the diagram and initializing the model and any templates.
 * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
 */
function initDiagram() {
  const $ = go.GraphObject.make
  // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
  const diagram =
    $(go.Diagram,
      {
        // 'undoManager.isEnabled': true, // must be set to allow for model change listening
        // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
        // 'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
        layout: $(go.ForceDirectedLayout),
        model: new go.GraphLinksModel(
          {
            linkKeyProperty: 'key' // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
          })
      })

  const SPREADLINKS = true

  // define a simple Node template
  diagram.nodeTemplate =
    $(go.Node, 'Auto', // the Shape will go around the TextBlock
    //   new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, 'RoundedRectangle',
        { name: 'SHAPE', fill: 'white', strokeWidth: 0, figure: 'RoundedRectangle',
          parameter1: 10,
          portId: '',
          fromLinkable: true,
          fromSpot: (SPREADLINKS ? go.Spot.AllSides : go.Spot.None),
          //   toLinkable: true,
          toSpot: (SPREADLINKS ? go.Spot.AllSides : go.Spot.None),
          cursor: 'pointer' },
        // Shape.fill is bound to Node.data.color
        new go.Binding('fill', 'color')),
        $(go.Picture, { margin: 5, width: 50, height: 50 }, new go.Binding('source')),
      $(go.TextBlock,
        { margin: 12, stroke: 'white', font: 'bold 16px sans-serif', editable: true }, // some room around the text
        new go.Binding('text').makeTwoWay()
      )
    )

  diagram.linkTemplate =
    $(TaperedLink, // subclass of Link, defined below
      go.Link.Bezier,
      (SPREADLINKS ? go.Link.None : go.Link.Orthogonal),
      {
        fromEndSegmentLength: (SPREADLINKS ? 50 : 1),
        toEndSegmentLength: (SPREADLINKS ? 50 : 1)
        // relinkableFrom: true,
        // relinkableTo: true
      },
      $(go.Shape,
        { stroke: null, strokeWidth: 0 },
        new go.Binding('fill', 'color'))
    )

  return diagram
}


/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is dicussed below.
 */
function handleModelChange(changes) {
//   alert('GoJS model changed!')
}

// render function...
function Diagram() {
  const [board, setBoard] = useState({})
  //   const [columns, setColumns] = useState({})
  const [nodeDataArray, setNodeDataArray] = useState([])
  const [linkDataArray, setLinkDataArray] = useState([])
  const [boardIdSaved, setBoardIdSaved] = useState('')
  const { boardId } = useParams()

  useEffect(() => {
    // const boardId = '62d92931b79a7a225262240a'
    // const boardId = localStorage.getItem('boardId')
    setBoardIdSaved(boardId)

    if (boardId) {
      const boardIdJson = boardId

      // const boardIdJson = JSON.parse(boardId)
      getBoardById(boardIdJson)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId])

  const getBoardById = async (boardId) => {

    await fetchBoardDetails(boardId).then(board => {
      setBoard(board)
      //   setColumns(mapOrder(board.columns, board.columnOrder, '_id'))

      const rootNode = { key: board._id, text: board.title, color: 'red', loc: '0 0' }

      let nodeDataArrayNew = [...nodeDataArray, rootNode]
      let linkDataArrayNew = []

      board.columns.map((column) => {
        if (column._destroy) return

        const loc_x_column = getRandomInt(-300, 300)
        const loc_y_column = Math.sqrt(90000 - loc_x_column * loc_x_column) * Math.sign(Math.random() - 0.5)
        console.log(loc_x_column, loc_y_column)
        const columnNode = { key: column._id, text: column.title, color: 'orange', loc: `${loc_x_column} ${loc_y_column}` }
        nodeDataArrayNew = [...nodeDataArrayNew, columnNode]

        const columnLink = { key: board._id + column._id, from: board._id, to: column._id, color: 'red' }
        linkDataArrayNew = [...linkDataArrayNew, columnLink]

        column.cards.map((card) => {
          console.log(card)
          if (card._destroy) return

          const loc_x_card = getRandomInt(loc_x_column - 150, loc_x_column + 150)
          const loc_y_card = Math.sqrt(22500 - (loc_x_card - loc_x_column) * (loc_x_card - loc_x_column)) * Math.sign(Math.random() - 0.5) + loc_y_column
          const cardNode = { key: card._id, text: card.title, color: 'pink', loc: `${loc_x_card} ${loc_y_card}`, source: card.cover }
          nodeDataArrayNew = [...nodeDataArrayNew, cardNode]

          const cardLink = { key: column._id + card._id, from: column._id, to: card._id, color: 'orange' }
          linkDataArrayNew = [...linkDataArrayNew, cardLink]
        })
      })

      setNodeDataArray(nodeDataArrayNew)
      setLinkDataArray(linkDataArrayNew)

      setBoardIdSaved(boardId)

    })
  }

  return (
    <div>
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName='diagram-component'
        nodeDataArray={nodeDataArray}
        linkDataArray={linkDataArray}
        onModelChange={handleModelChange}
      />
    </div>
  )
}

export default Diagram