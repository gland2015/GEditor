import {EditorState} from 'draft-js';
import {Map} from 'immutable';

import {insertBlock, basicBlockData, isPureTextBlock, setBlockData} from './basicAPI/handleBlock';
import {makeCollapsed} from './basicAPI/handleState';
import {basicSelectionState} from './basicAPI/handleSelect';

function insertTable(editorState, options) {
  editorState = makeCollapsed(editorState);
  const {num, column} = options;
  let content = editorState.getCurrentContent();
  let sel = editorState.getSelection();
  let key = sel.anchorKey;
  // 不是普通的文本块不可插入
  if (!isPureTextBlock(content, key)) {
    return {editorState, toUpdateKeys: ['000000']};
  }
  const toUpdateKeys = [key];
  let blockData = basicBlockData.set('wrapper', 'table').set('type', 'd4');
  content = insertBlock(content, key, blockData, sel.anchorOffset, 1);
  key = content.getKeyAfter(key);
  blockData = blockData.setIn(['data', 'wrapperStartKey'], key);
  let data = Map({
    num,
    column,
    wrapperStartKey: key,
    ...options
  });
  content = setBlockData(content, key, blockData.set('data', data));
  if (num - 1) content = insertBlock(content, key, blockData, sel.anchorOffset, num - 1);
  editorState = EditorState.push(editorState, content, 'insert-characters');
  sel = basicSelectionState.merge({anchorKey: key, focusKey: key});
  editorState = EditorState.forceSelection(editorState, sel);
  return {editorState, toUpdateKeys};
}

export {insertTable};
