import {applyInlineStyle, removeInlineStyle} from './inline';
import {applyBlockType} from './textBlock';
import {insertTable} from './table';

let editorState, payload;

const actionMap = {
  get applyInlineStyle() {
    const {name} = payload;
    return applyInlineStyle(editorState, name);
  },
  get removeInlineStyle() {
    const {name} = payload;
    return removeInlineStyle(editorState, name);
  },
  get insertTable() {
    const {options} = payload;
    return insertTable(editorState, options);
  },
  get applyBlockType() {
    const {name} = payload;
    return applyBlockType(editorState, name)
  }
};

function handleEditAction(EDITORSTATE, PAYLOAD) {
  editorState = EDITORSTATE;
  payload = PAYLOAD;
  let t = new Date().getTime();
  const result = actionMap[PAYLOAD.type];
  console.log('take up time', new Date().getTime() - t);
  if (result) return result;
  else {
    console.log('invalid type');
    return editorState;
  }
}

export {handleEditAction};
