import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import events from './events'
import './TaskCalendar.scss'

const localizer = momentLocalizer(moment)

export default function ReactBigCalendar() {
  const [eventsData, setEventsData] = useState(events)

  const handleSelect = ({ start, end }) => {
    console.log(start)
    console.log(end)
    const title = window.prompt('New Event name')
    if (title)
      setEventsData([
        ...eventsData,
        {
          start,
          end,
          title
        }
      ])
  }
  return (
    <div className="task-calendar">
      <Calendar
        views={['day', 'agenda', 'work_week', 'month']}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={eventsData}
        onSelectEvent={(event) => alert(event.title)}
        onSelectSlot={handleSelect}
      />
    </div>
  )
}