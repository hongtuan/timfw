import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'System',
    icon: 'nb-keypad',
    link: '/pages/ui-features',
    children: [
      {
        title: 'admin',
        link: '/pages/rrum',
      }
    ],
  },
  {
    title: 'Develop',
    icon: 'nb-shuffle',
    children: [
      {
        title: 'packageInfo',
        link: '/pages/dev/sysinfo/pkgns',
      },
      {
        title: 'serverInfo',
        link: '/pages/dev/sysinfo/srv',
      },
      {
        title: 'ApiMgr',
        link: '/pages/dev/apimgr',
      },
      {
        title: 'ApiTest',
        link: '/pages/dev/apiwebtester',
      },
    ],
  },
  {
    title: 'Miscellaneous',
    icon: 'nb-shuffle',
    children: [
      {
        title: '404',
        link: '/pages/miscellaneous/404',
      },
    ],
  },
];
