import {EditorState} from 'draft-js';
import {Map} from 'immutable';

import {blocks, wrappers} from '../../editorCore/block/blocks';
import {basicSelectionState} from '../editAPI/basicAPI/handleSelect';
import {splitBlock, setBlockData} from '../editAPI/basicAPI/handleBlock';
import {makeCollapsed} from '../editAPI/basicAPI/handleState';
import {applyBlockType} from '../editAPI/textBlock';

function _handleEntry(editorState) {
  const toUpdateKeys = [];
  let sel = editorState.getSelection();
  if (!sel.isCollapsed()) {
    editorState = makeCollapsed(editorState);
    sel = editorState.getSelection();
  }
  let key = sel.anchorKey;
  toUpdateKeys.push(sel.anchorKey);
  let content = editorState.getCurrentContent();
  let block = content.getBlockForKey(key);
  let blockData = block.getData();
  let type = blockData.get('type');
  let wrapper = blockData.get('wrapper');
  if (wrapper) {
    wrapper = wrappers[wrapper];
    // 无效entry
    if (wrapper['blockNumFixed']) return;
    // 0处且符合要求退出包装
    if (wrapper['entryToggle'] && !sel.anchorOffset) {
      content = setBlockData(content, key, blockData.set('wrapper', null)).set('data', Map({}));
      editorState = EditorState.push(editorState, content, 'change-block-data');
      return {editorState, toUpdateKeys};
    }
  }
  if (!sel.anchorOffset && blocks[type]['entryToggle']) {
    editorState = applyBlockType(editorState, 'default').editorState;
    return {editorState, toUpdateKeys};
  }
  content = splitBlock(content, key, '', sel.anchorOffset);
  key = content.getKeyAfter(key);
  editorState = EditorState.push(editorState, content, 'change-block-data');
  sel = basicSelectionState.merge({
    anchorKey: key,
    focusKey: key
  });
  editorState = EditorState.forceSelection(editorState, sel);
  if (blocks[type]['singleBlock']) {
    editorState = applyBlockType(editorState, 'default').editorState;
  }
  return {editorState, toUpdateKeys};
}

function handleEntry(e, updateEditorState) {
  const {editorState, toUpdateKeys} = _handleEntry(e);
  if (editorState) updateEditorState(editorState, toUpdateKeys);
  return 'handled';
}

export {handleEntry};
