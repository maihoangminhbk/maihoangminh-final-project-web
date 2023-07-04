export const workplaceData = [
  {
    _id: 0,
    userCreateName: 'Minh Mai ... Test Board day la cai thu nghiem do dai, neeu nhu no ma co dai qua thi se tro nen nhu the nao cac ban hay doabn xem',
    userCreateAvatar: 'https://picsum.photos/70',
    action: 'added',
    userTarget: 'you',
    objectTarget: 'board',
    targetName: 'Test Board day la cai thu nghiem do dai, neeu nhu no ma co dai qua thi se tro nen nhu the nao cac ban hay doabn xem'
  },
  {
    _id: 1,
    userCreateName: 'Minh Mai',
    userCreateAvatar: 'https://picsum.photos/70',
    action: 'added',
    userTarget: 'you',
    objectTarget: 'board',
    targetName: 'Test Board'
  },
  {
    _id: 2,
    userCreateName: 'Minh Mai',
    userCreateAvatar: 'https://picsum.photos/70',
    action: 'create',
    userTarget: 'you',
    objectTarget: 'board',
    targetName: 'Test Board'
  },
  {
    _id: 3,
    userCreateName: 'Minh Mai',
    userCreateAvatar: 'https://picsum.photos/70',
    action: 'added',
    userTarget: 'you',
    objectTarget: 'board',
    targetName: 'Test Board'
  },
  {
    _id: 4,
    userCreateName: 'Minh Mai',
    userCreateAvatar: 'https://picsum.photos/70',
    action: 'removed',
    userTarget: 'you',
    objectTarget: 'board',
    targetName: 'Test Board'
  }
  // {
  //   _id: 5,
  //   userCreateName: 'Minh Mai',
  //   userCreateAvatar: 'https://picsum.photos/70',
  //   action: 'created',
  //   userTarget: 'you',
  //   objectTarget: 'board',
  //   targetName: 'Test Board'
  // },
  // {
  //   _id: 6,
  //   userCreateName: 'Minh Mai',
  //   userCreateAvatar: 'https://picsum.photos/70',
  //   action: 'create',
  //   userTarget: 'you',
  //   objectTarget: 'board',
  //   targetName: 'Test Board'
  // },
  // {
  //   _id: 7,
  //   userCreateName: 'Minh Mai',
  //   userCreateAvatar: 'https://picsum.photos/70',
  //   action: 'removed',
  //   userTarget: 'you',
  //   objectTarget: 'board',
  //   targetName: 'Test Board'
  // },
  // {
  //   _id: 8,
  //   userCreateName: 'Minh Mai',
  //   userCreateAvatar: 'https://picsum.photos/70',
  //   action: 'updated',
  //   userTarget: 'you',
  //   objectTarget: 'card',
  //   targetName: 'Test card'
  // },
  // {
  //   _id: 9,
  //   userCreateName: 'Minh Mai',
  //   userCreateAvatar: 'https://picsum.photos/70',
  //   action: 'removed',
  //   userTarget: 'you',
  //   objectTarget: 'column',
  //   targetName: 'Test Board'
  // }
]

export const personalData = [
  {
    _id: 0,
    userCreateName: 'Minh Mai',
    userCreateAvatar: 'https://picsum.photos/70',
    action: 'added',
    userTarget: null,
    objectTarget: 'board',
    targetName: 'Test Board'
  },
  {
    _id: 1,
    userCreateName: 'Minh Mai',
    userCreateAvatar: 'https://picsum.photos/70',
    action: 'added',
    userTarget: null,
    objectTarget: 'board',
    targetName: 'Test Board'
  },
  {
    _id: 2,
    userCreateName: 'Minh Mai',
    userCreateAvatar: 'https://picsum.photos/70',
    action: 'create',
    userTarget: null,
    objectTarget: 'board',
    targetName: 'Test Board'
  },
  {
    _id: 3,
    userCreateName: 'Minh Mai',
    userCreateAvatar: 'https://picsum.photos/70',
    action: 'added',
    userTarget: null,
    objectTarget: 'board',
    targetName: 'Test Board'
  },
  {
    _id: 4,
    userCreateName: 'Minh Mai',
    userCreateAvatar: 'https://picsum.photos/70',
    action: 'removed',
    userTarget: null,
    objectTarget: 'board',
    targetName: 'Test Board'
  }
  // {
  //   _id: 5,
  //   userCreateName: 'Minh Mai',
  //   userCreateAvatar: 'https://picsum.photos/70',
  //   action: 'created',
  //   userTarget: null,
  //   objectTarget: 'board',
  //   targetName: 'Test Board'
  // },
  // {
  //   _id: 6,
  //   userCreateName: 'Minh Mai',
  //   userCreateAvatar: 'https://picsum.photos/70',
  //   action: 'create',
  //   userTarget: null,
  //   objectTarget: 'board',
  //   targetName: 'Test Board'
  // },
  // {
  //   _id: 7,
  //   userCreateName: 'Minh Mai',
  //   userCreateAvatar: 'https://picsum.photos/70',
  //   action: 'removed',
  //   userTarget: 'you',
  //   objectTarget: 'board',
  //   targetName: 'Test Board'
  // },
  // {
  //   _id: 8,
  //   userCreateName: 'Minh Mai',
  //   userCreateAvatar: 'https://picsum.photos/70',
  //   action: 'updated',
  //   userTarget: null,
  //   objectTarget: 'card',
  //   targetName: 'Test card'
  // },
  // {
  //   _id: 9,
  //   userCreateName: 'Minh Mai',
  //   userCreateAvatar: 'https://picsum.photos/70',
  //   action: 'removed',
  //   userTarget: null,
  //   objectTarget: 'column',
  //   targetName: 'Test Board'
  // }
]


export const grammar = (notification) => {
  // if (notification.userTarget) {
  //   return `${notification.userCreateName} ${notification.action} ${notification.userTarget} at ${notification.objectTarget} ${notification.targetName}`
  // } else {
  //   return `${notification.userCreateName} ${notification.action} ${notification.objectTarget} ${notification.targetName}`
  // }

  switch (notification.notificationType) {
  case 'board':
    return ` ${notification.action} ${notification.objectTargetType} ${notification.objectTargetName} in board ${notification.boardTitle}`
  case 'personal':
    return ` ${notification.action} you at ${notification.objectTargetType} ${notification.objectTargetName}`
  case 'deadline':
    return ` ${notification.action} ${notification.notificationType} at ${notification.objectTargetType} ${notification.objectTargetName} in board ${notification.boardTitle} after 1 day`
  case 'late':
    return ` ${notification.action} deadline ${notification.notificationType} at ${notification.objectTargetType} ${notification.objectTargetName} in board ${notification.boardTitle}`
  default:
    break
  }
}