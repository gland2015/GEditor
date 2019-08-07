import {editorCoreClassName} from './namespace';

const defaultStyleSheetOptions = {
  selection: {
    background: 'blue',
    color: 'white'
  },
  other: ''
};

function getEditorStyleSheet(options) {
  const o = Object.assign({}, defaultStyleSheetOptions, options);
  const editorStyleSheet = `
  .${editorCoreClassName} *::selection{
    background: ${o.selection.background};
    color: ${o.selection.color};
    min-width: 1000px
  }
  h1{
    padding-bottom: 30px;
  }
  ${o.other}
  `;
  return editorStyleSheet;
}

export {getEditorStyleSheet};
