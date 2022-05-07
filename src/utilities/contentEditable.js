// On key down
export const saveContentAfterPressEnter = (e) => {
  if (e.key === 'Enter') {
    e.target.blur()
  }
}

//  On select all content when select
export const selectAllInlineText = (e) => {
  e.target.focus()
  e.target.select()
}