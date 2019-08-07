import {EditorState} from 'draft-js';
import {makeCollapsed, plainBackspace} from '../editAPI/basicAPI/handleState';
import {wrappers, blocks} from '../../editorCore/block/blocks';
import {deleteBlock, deleteFixedBlock, mergeBlock} from '../editAPI/basicAPI/handleBlock';
import {basicSelectionState} from '../editAPI/basicAPI/handleSelect';

function handleBackspace(e, updateEditorState) {
  let sel = e.getSelection();
  // 未折叠折叠即可
  if (!sel.isCollapsed()) {
    e = makeCollapsed(e);
    updateEditorState(e, [e.getSelection().anchorKey]);
    return 'handled';
  }
  // 非零位置退格处理
  if (sel.anchorOffset) {
    e = plainBackspace(e);
    updateEditorState(e, [sel.anchorKey]);
    return 'handled';
  }
  let key = sel.anchorKey;
  let content = e.getCurrentContent();
  let block = content.getBlockForKey(key);
  let blockData = block.getData();
  let wrapper = blockData.get('wrapper');
  // 当前块处在包装且数量固定作用无效
  if (wrapper && wrappers[wrapper]['blockNumFixed']) return 'handled';
  block = content.getBlockBefore(key);
  // 前面无块也无效
  if (!block) return 'handled';
  blockData = block.getData();
  let type = blockData.get('type');
  // 前面不是文本块则删除前块即可
  if (!blocks[type].isTextBlock) {
    content = deleteBlock(content, block.getKey());
    e = EditorState.push(e, content, 'change-block-type');
    e = EditorState.forceSelection(e, sel);
    updateEditorState(e, ['000000']);
    return 'handled';
  }
  wrapper = blockData.get('wrapper');
  // 前块处在固定包装中直接删除前面固定块即可
  if (wrapper && wrappers[wrapper].blockNumFixed) {
    let wrapperStartKey = blockData.get('data').get('wrapperStartKey');
    content = deleteFixedBlock(content, wrapperStartKey);
    e = EditorState.push(e, content, 'delete-character');
    e = EditorState.forceSelection(e, sel);
    updateEditorState(e, ['000000']);
    return 'handled';
  }
  // 其余情况正常融合即可
  content = mergeBlock(content, key);
  e = EditorState.push(e, content, 'change-block-type');
  key = block.getKey();
  const offset = block.getText().length;
  sel = basicSelectionState.merge({
    anchorKey: key,
    focusKey: key,
    anchorOffset: offset,
    focusOffset: offset
  });
  e = EditorState.forceSelection(e, sel);
  updateEditorState(e, [key]);
  return 'handled';
}

export {handleBackspace};
