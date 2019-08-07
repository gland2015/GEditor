import {editorName} from '../../utils/global/namespace';
import {Image} from './components/image';

const blocks = {
  default: {
    element: 'div',
    className: `${editorName}_default`,
    isTextBlock: true
  },
  // 其他文本块
  d1: {
    element: 'div',
    className: `${editorName}_d1`,
    isTextBlock: true
  },
  d2: {
    element: 'div',
    className: `${editorName}_d2`,
    isTextBlock: true
  },
  d3: {
    element: 'div',
    className: `${editorName}_d3`,
    isTextBlock: true
  },
  // 默认用于table
  d4: {
    element: 'div',
    className: `${editorName}_d4`,
    isTextBlock: true
  },
  d5: {
    element: 'div',
    className: `${editorName}_d5`,
    isTextBlock: true
  },
  d6: {
    element: 'div',
    className: `${editorName}_d6`,
    isTextBlock: true
  },
  d7: {
    element: 'div',
    className: `${editorName}_d7`,
    isTextBlock: true
  },
  d8: {
    element: 'div',
    className: `${editorName}_d8`,
    isTextBlock: true
  },
  d9: {
    element: 'div',
    className: `${editorName}_d9`,
    isTextBlock: true
  },
  h1: {
    element: 'h1',
    className: `${editorName}_h1`,
    isTextBlock: true,
    entryToggle: true,
    singleBlock: true
  },
  h2: {
    element: 'h2',
    className: `${editorName}_h2`,
    isTextBlock: true,
    entryToggle: true,
    singleBlock: true
  },
  h3: {
    element: 'h3',
    className: `${editorName}_h3`,
    isTextBlock: true,
    entryToggle: true,
    singleBlock: true
  },
  h4: {
    element: 'h4',
    className: `${editorName}_h4`,
    isTextBlock: true,
    entryToggle: true,
    singleBlock: true
  },
  h5: {
    element: 'h5',
    className: `${editorName}_h5`,
    isTextBlock: true,
    entryToggle: true,
    singleBlock: true
  },
  h6: {
    element: 'h6',
    className: `${editorName}_h6`,
    isTextBlock: true,
    entryToggle: true,
    singleBlock: true
  },
  hx: {
    element: 'div',
    className: `${editorName}_hx`,
    isTextBlock: true,
    entryToggle: true,
    singleBlock: true
  },
  blockquote: {
    element: 'div',
    className: `${editorName}_blockquote`,
    isTextBlock: true,
    entryToggle: true
  },
  image: {
    element: 'div',
    className: null,
    subClassName: `${editorName}_image`,
    isTextBlock: false,
    rendererReturnValue: {
      component: Image,
      editable: false
    }
  }
};

const wrappers = {
  ul: {
    className: `${editorName}_ul`,
    level: true,
    entryToggle: true
  },
  ol: {
    className: `${editorName}_ol`,
    level: true,
    entryToggle: true
  },
  table: {
    className: `${editorName}_table`,
    blockNumFixed: true
  }
};

export {blocks, wrappers};
