import React, { useState } from 'react'
import DatePicker, {registerLocale, setDefaultLocale} from 'react-datepicker'
import vi from 'date-fns/locale/vi'
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'

registerLocale('vi', vi)

function DatePickerCustom(props) {

  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  )

  return (
    <DatePicker
      locale="vi"
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      showTimeSelect
      excludeTimes={[
        setHours(setMinutes(new Date(), 0), 17),
        setHours(setMinutes(new Date(), 30), 18),
        setHours(setMinutes(new Date(), 30), 19),
        setHours(setMinutes(new Date(), 30), 17)
      ]}
      dateFormat="MMMM d, yyyy h:mm aa"
    />
  )
}

export default DatePickerCustom