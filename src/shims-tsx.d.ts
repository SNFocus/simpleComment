import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }

  interface Window {
    charRatio: number;
    longerChars: string[];
    siderWidth: number;
    ad_client: string;
    astip_client: string;
    _customComments: any[];
  }

  interface Options {
    key: string;
    label: string;
  }

  interface CommData {
    comment: string;
    payload?: any;
  }

  interface TreeItem{
    key: number;
    scopedSlots: { title: string };
    popVisible: boolean;
    content: string;
    childs?: TreeItem[];
    dataRef?: TreeItem;
  }
}
