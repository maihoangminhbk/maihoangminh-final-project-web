import React, { useState, useEffect } from 'react'
import './App.scss'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// custom component
import AppBar from 'components/AppBar/AppBar'
import BoardBar from 'components/BoardBar/BoardBar'
import BoardContent from 'components/BoardContent/BoardContent'
import Auth from 'components/Auth/Auth'

function App() {

  const [user, setUser ] = useState('')

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')))
  }, [])

  return (
    <BrowserRouter>
      <div className="trello-maihoangminh-master">
        <AppBar />
        <Routes>
          <Route path="/" element={<Navigate to="/workplaces" />} />
          <Route path="/workplaces" element={!user ? <Navigate to="/auth" /> : <BoardBar />} />
          {/* <Route path="/posts/search" exact component={Home} />
          <Route path="/posts/:id" exact component={PostDetails} />
          <Route path={['/creators/:name', '/tags/:name']} component={CreatorOrTag} /> */}
          {/* <Route path="/auth" element={() => (!user ? <Auth /> : <Navigate to="/workplaces" />)} /> */}
          <Route path="/auth" element={!user ? <Auth setUser={setUser}/> : <Navigate to="/workplaces" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )

//   <BrowserRouter>
//   <Routes>
//     <Route path="/" element={<App />}>
//       <Route index element={<Home />} />
//       <Route path="teams" element={<Teams />}>
//         <Route path=":teamId" element={<Team />} />
//         <Route path="new" element={<NewTeamForm />} />
//         <Route index element={<LeagueStandings />} />
//       </Route>
//     </Route>
//   </Routes>
// </BrowserRouter>

  // return (
  //   <div className="trello-maihoangminh-master">
  //     <AppBar />
  //     <Auth />
  //     {/* <BoardBar /> */}
  //     {/* <BoardContent /> */}
  //   </div>


  // )
}

export default App
