import {EditorState} from 'draft-js';
import {setBlockData, insertBlock, deleteBlock} from '../editAPI/basicAPI/handleBlock';
import {basicSelectionState} from '../editAPI/basicAPI/handleSelect';
import {makeCollapsed} from '../editAPI/basicAPI/handleState';
import {wrappers, blocks} from '../../editorCore/block/blocks';
import {insertText} from '../editAPI/basicAPI/handleState';

// 减小level
function handleDeLevel(e, updateEditorState) {
  let sel = e.getSelection();
  if (!sel.isCollapsed()) return 'handled';
  let key = sel.anchorKey;
  let content = e.getCurrentContent();
  let blockData = content.getBlockForKey(key);
  let wrapper = blockData.get('wrapper');
  if (!wrapper) return 'handled';
  if (!wrappers[wrapper].level) return 'handled';
  let level = blockData.get('data').get('level') || 0;
  if (level <= 0) return 'handled';
  level--;
  blockData = blockData.setIn(['data', 'level'], level);
  content = setBlockData(content, key, blockData);
  e = EditorState.push(e, content, 'change-block-data');
  updateEditorState(e, [key]);
  return 'handled';
}

// 折叠的前提下提高level或插入两个空格
function handleTab(e, updateEditorState) {
  let sel = e.getSelection();
  if (!sel.isCollapsed()) return 'handled';
  let key = sel.anchorKey;
  let content = e.getCurrentContent();
  let blockData = content.getBlockForKey(key);
  let wrapper = blockData.get('wrapper');
  if (wrapper && wrappers[wrapper].level) {
    let level = blockData.get('data').get('level') || 0;
    if (level > 6) return 'handled';
    level++;
    blockData = blockData.setIn(['data', 'level'], level);
    content = setBlockData(content, key, blockData);
    e = EditorState.push(e, content, 'change-block-data');
  } else {
    e = insertText(e, '  ');
  }
  updateEditorState(e, [key]);
  return 'handled';
}

// 插入换行符
function handleInsertEndl(e, updateEditorState) {
  e = makeCollapsed(e);
  e = insertText(e, '\n');
  let key = e.getSelection().anchorKey;
  updateEditorState(e, [key]);
  return 'handled';
}

function handleInsertNewLine(e, updateEditorState) {
  let sel = e.getSelection();
  let key = sel.anchorKey;
  if (sel.focusKey !== key) return 'handled';
  let content = e.getCurrentContent();
  let blockData = content.getBlockForKey(key).getData();
  let wrapper = blockData.get('wrapper');
  if (wrapper && wrappers[wrapper].blockNumFixed) return 'handled';
  content = insertBlock(content, key);
  key = content.getKeyAfter(key);
  sel = basicSelectionState.merge({anchorKey: key, focusKey: key});
  e = EditorState.push(e, content, 'insert-fragment');
  e = EditorState.forceSelection(e, sel);
  updateEditorState(e, [key]);
  return 'handled';
}

function handleDelete(editorState, updateEditorState) {
  let sel = editorState.getSelection();
  if (!sel.isCollapsed()) {
    editorState = makeCollapsed(editorState);
    sel = editorState.getSelection();
    updateEditorState(editorState, [sel.anchorKey]);
  }
  let content = editorState.getCurrentContent();
  let key = sel.anchorKey;
  let block = content.getFirstBlock();
  // 第一个块不可删
  if (block.getKey() === key) return 'handled';
  block = content.getBlockForKey(key);
  let wrapper = block.getData().get('wrapper');
  // 数量固定包装块里不可删
  if (wrapper && wrappers[wrapper].blockNumFixed) return 'handled';
  block = content.getBlockBefore(key);
  let type = block.getData().get('type');
  let lastKey = content.getLastBlock().getKey();
  // 最后面的单独的文本块不可删
  if (lastKey === key) {
    let wrapper = block.getData().get('wrapper');
    if (!blocks[type].isTextBlock || wrappers[wrapper].blockNumFixed) return 'handled';
  }
  // 寻找光标位置
  while (block) {
    type = block.getData().get('type');
    if (blocks[type].isTextBlock) break;
    block = content.getBlockBefore(block.getKey());
  }
  content = deleteBlock(content, key);
  key = block.getKey();
  let offset = block.getText().length;
  sel = sel.merge({
    anchorKey: key,
    anchorOffset: offset,
    focusKey: key,
    focusOffset: offset
  });
  editorState = EditorState.push(editorState, content, 'delete-character');
  editorState = EditorState.forceSelection(editorState, sel);
  updateEditorState(editorState, ['000000']);
  return 'handled';
}

export {handleDeLevel, handleTab, handleInsertEndl, handleInsertNewLine, handleDelete};
