
export declare interface TypeItemIF {
    key: string;
    icon: string;
    label: string;
}

export declare interface NavItemIF {
    key: string;
    icon: string;
    label: string;
    typeList?: TypeItemIF[];
}

export const navConfig: NavItemIF[] = [
  {
    key: 'base',
    icon: 'layout',
    label: '基础类型',
    typeList: [
      {
        key: 'table',
        icon: 'table',
        label: '表格'
      },
      {
        key: 'wrapper',
        icon: 'line',
        label: '自定义边框'
      },
      {
        key: 'list',
        icon: 'ordered-list',
        label: '列表'
      },
      // {
      //   key: 'cmd',
      //   icon: 'build',
      //   label: '命令行'
      // },
      {
        key: 'pictureText',
        icon: 'picture',
        label: '图文转换'
      },
      {
        key: 'setting',
        icon: 'setting',
        label: '基础设置'
      }
    ]
  },
  {
    key: 'custom',
    icon: 'tag',
    label: '常用'
  },
  {
    key: 'asciiflow',
    icon: 'scissor',
    label: 'AsciiFlow'
  },
  {
    key: 'materials',
    icon: 'compass',
    label: '素材'
  }
]
