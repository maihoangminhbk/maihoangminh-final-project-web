import React from 'react'
import './Card.scss'

function Card(props) {
  const { card } = props

  return (
    <div className="card-item">
      {
        card.imageUrl && <img src={card.imageUrl} className='card-cover' alt='image1' onMouseDown={e => e.preventDefault()}/>
      }
      {card.title}

    </div>
  )
}

export default Card