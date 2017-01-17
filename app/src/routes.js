export default [
  {
    path: '',
    redirect: '/start'
  },
  {
    path: '/start',
    name: 'start',
    component: require('components/Start')
  },
  {
    path: '/prize/list',
    name: 'prize-list',
    component: require('components/prize/List')
  },
  {
    path: '/prize/add',
    name: 'prize-add',
    component: require('components/prize/Add')
  },
  {
    path: '/player/list',
    name: 'player-list',
    component: require('components/player/List')
  },
  {
    path: '/player/add',
    name: 'player-add',
    component: require('components/player/Add')
  },
  {
    path: '/prize/overview',
    name: 'prize-overview',
    component: require('components/prize/Overview')
  },
  {
    path: '/prize/run',
    name: 'prize-run',
    component: require('components/prize/Run')
  }
]
