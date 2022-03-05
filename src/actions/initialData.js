export const initialData = {
  boards: [
    {
      id: 'board-1',
      columnOrder: ['column-1', 'column-2', 'column-3'],
      columns: [
        {
          id: 'column-1',
          boardId: 'board-1',
          title: 'To do column',
          cardOrder: ['card-1', 'card-5', 'card-2', 'card-3', 'card-4', 'card-11', 'card-12', 'card-13'],
          cards: [
            {
              id: 'card-1',
              boardId: 'board-1',
              columnId: 'column-1',
              title: 'Bong da Viet Nam',
              cover: 'https://cdn.24h.com.vn/upload/1-2022/images/2022-03-01/VPBank-thong-bao-lui-giai-chay-VPBank-Hanoi-Marathon-giai-chay-1646112509-607-width660height598.jpg'
            },
            { id: 'card-2', boardId: 'board-1', columnId: 'column-1', title: 'Title of card 2', cover: null },
            { id: 'card-3', boardId: 'board-1', columnId: 'column-1', title: 'Title of card 3', cover: null },
            { id: 'card-4', boardId: 'board-1', columnId: 'column-1', title: 'Title of card 4', cover: null },
            { id: 'card-5', boardId: 'board-1', columnId: 'column-1', title: 'Title of card 5', cover: null },
            { id: 'card-11', boardId: 'board-1', columnId: 'column-1', title: 'Title of card 11', cover: null },
            { id: 'card-12', boardId: 'board-1', columnId: 'column-1', title: 'Title of card 12', cover: null },
            { id: 'card-13', boardId: 'board-1', columnId: 'column-1', title: 'Title of card 13', cover: null }

          ]
        },

        {
          id: 'column-2',
          boardId: 'board-1',
          title: 'Column 2',
          cardOrder: ['card-6', 'card-7'],
          cards: [
            { id: 'card-6', boardId: 'board-1', columnId: 'column-2', title: 'Title of card 2', cover: null },
            { id: 'card-7', boardId: 'board-1', columnId: 'column-2', title: 'Title of card 3', cover: null }
          ]
        },

        {
          id: 'column-3',
          boardId: 'board-1',
          title: 'Column 3',
          cardOrder: ['card-8', 'card-9', 'card-10'],
          cards: [
            { id: 'card-8', boardId: 'board-1', columnId: 'column-3', title: 'Title of card 2', cover: null },
            { id: 'card-9', boardId: 'board-1', columnId: 'column-3', title: 'Title of card 3', cover: null },
            { id: 'card-10', boardId: 'board-1', columnId: 'column-3', title: 'Title of card 3', cover: null }

          ]
        }

      ]
    }
  ]
}