import './App.scss';

function App() {
  return (
    <div className="trello-maihoangminh-master">
      <nav className='navbar app'>App bar</nav>
      <nav className='narbar board'> Board Bar</nav>
      <div className='board-columns'>
        <div className='column'>
          <header>Brainstorm</header>
          <ul>
            <li>
              <img src='https://cdn.24h.com.vn/upload/1-2022/images/2022-03-01/VPBank-thong-bao-lui-giai-chay-VPBank-Hanoi-Marathon-giai-chay-1646112509-607-width660height598.jpg' alt='image1'/>
              Title: Mai Hoang Minh
            </li>
            <li>Add in here</li>
            <li>Add in here</li>
            <li>Add in here</li>
            <li>Add in here</li>
            <li>Add in here</li>
          </ul>
          <footer>Add another card</footer>
        </div>

        <div className='column'>
          <header>Brainstorm</header>
          <ul>
            <li>
              {/* <img src='https://cdn.24h.com.vn/upload/1-2022/images/2022-03-01/VPBank-thong-bao-lui-giai-chay-VPBank-Hanoi-Marathon-giai-chay-1646112509-607-width660height598.jpg' alt='image1'/> */}
            </li>
            <li>Add in here</li>
            <li>Add in here</li>
            <li>Add in here</li>
            <li>Add in here</li>
            <li>Add in here</li>
          </ul>
          <footer>Add another card</footer>
        </div>
      </div>
    </div>
  );
}

export default App;
