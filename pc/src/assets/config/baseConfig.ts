
export const navKeys = {
  CUSTOM: 'CUSTOM',
  TEMPLATES: 'TEMPLATES',
  MATERIALS: 'MATERIALS',
  BASETYPE: 'BASETYPE'
}

export const navConfig: object = {
  [navKeys.CUSTOM]: {
    icon: 'heart',
    label: '常用'
  },
  [navKeys.TEMPLATES]: {
    icon: 'shop',
    label: '模板库'
  },
  [navKeys.MATERIALS]: {
    icon: 'smile',
    label: '素材商店'
  },
  [navKeys.BASETYPE]: {
    icon: 'layout',
    label: '基础类型'
  }
}

export declare interface TypeItem {
    key: string;
    icon: string;
    label: string;
}

export declare interface BaseTypes {
    singleLine: TypeItem;
    table: TypeItem;
    list: TypeItem;
    pictureText: TypeItem;
    func: TypeItem;
    file: TypeItem;
}

export const baseTypes = {
  singleLine: {
    key: 'singleLine',
    icon: 'line',
    label: '单行'
  },
  table: {
    key: 'table',
    icon: 'table',
    label: '表格'
  },
  list: {
    key: 'list',
    icon: 'ordered-list',
    label: '列表'
  },
  pictureText: {
    key: 'pictureText',
    icon: 'picture',
    label: '图文'
  },
  func: {
    key: 'func',
    icon: 'calculator',
    label: '函数'
  },
  file: {
    key: 'file',
    icon: 'file',
    label: '文件头'
  }
}
