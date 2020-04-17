
export declare interface TypeItemIF {
    key: string;
    icon: string;
    label: string;
}

export declare interface NavItemIF {
    key: string;
    icon: string;
    label: string;
    typeList: TypeItemIF[];
}

export const navConfig: NavItemIF[] = [
  {
    key: 'baseType',
    icon: 'layout',
    label: '基础类型',
    typeList: [
      {
        key: 'singleLine',
        icon: 'line',
        label: '单行'
      },
      {
        key: 'table',
        icon: 'table',
        label: '表格'
      },
      {
        key: 'list',
        icon: 'ordered-list',
        label: '列表'
      }, {
        key: 'cmd',
        icon: 'build',
        label: '命令行'
      },
      {
        key: 'pictureText',
        icon: 'picture',
        label: '自制图文'
      }
    ]
  },
  {
    key: 'custom',
    icon: 'heart',
    label: '常用',
    typeList: [{
      key: 'singleLine',
      icon: 'line',
      label: '单行'
    }]
  },
  {
    key: 'template',
    icon: 'shop',
    label: '模板库',
    typeList: [{
      key: 'singleLine',
      icon: 'line',
      label: '单行'
    }]
  },
  {
    key: 'materials',
    icon: 'smile',
    label: '素材商店',
    typeList: [{
      key: 'singleLine',
      icon: 'line',
      label: '单行'
    }]
  }

]
