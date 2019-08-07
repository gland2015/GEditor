import {SelectionState} from 'draft-js';

const basicSelectionState = SelectionState.createEmpty().merge({
  isBackward: false,
  anchorOffset: 0,
  focusOffset: 0,
  hasFocus: false
});

const getForwardSelection = sel => {
  if (sel.getIsBackward()) {
    const newSel = sel.merge({
      isBackward: false,
      focusOffset: sel.getAnchorOffset(),
      focusKey: sel.getAnchorKey(),
      anchorOffset: sel.getFocusOffset(),
      anchorKey: sel.getFocusKey()
    });
    return newSel;
  } else {
    return sel;
  }
};

const reduceCurrentBlocks = (Fn, contentState, selection) => {
  selection = getForwardSelection(selection);
  const focusKey = selection.getFocusKey();
  let key = selection.getAnchorKey();
  let block, data;
  do {
    block = contentState.getBlockForKey(key);
    data = block.getData();
    contentState = Fn(contentState, data, key);
    if (key === focusKey) break;
    key = contentState.getKeyAfter(key);
  } while (key);
  return contentState;
};

// 严格按内联样式区域遍历所选区域
const reduceCurrentStyles = (Fn, contentState, selection) => {
  selection = getForwardSelection(selection);
  const anchorKey = selection.getAnchorKey();
  const anchorOffset = selection.getAnchorOffset();
  const focusKey = selection.getFocusKey();
  const focusOffset = selection.getFocusOffset();
  const filterFn = () => true;
  let currentKey = anchorKey;
  let currentOffset = anchorOffset;
  let currentBlock;
  let newContentState = contentState;
  while (1) {
    currentBlock = contentState.getBlockForKey(currentKey);
    if (currentKey !== focusKey) {
      currentBlock.findStyleRanges(filterFn, (start, end) => {
        if (end > currentOffset) {
          if (start < currentOffset) {
            start = currentKey;
          }
          newContentState = Fn(newContentState, start, end, currentBlock, currentKey);
        }
      });
      currentKey = contentState.getKeyAfter(currentKey);
      currentOffset = 0;
      if (currentKey == null) {
        console.log('error next blockKey not find');
        break;
      }
    } else {
      currentBlock.findStyleRanges(filterFn, (start, end) => {
        if (end > currentOffset && start < focusOffset) {
          if (start < currentOffset) {
            start = currentOffset;
          }
          if (end > focusOffset) {
            end = focusOffset;
          }
          newContentState = Fn(newContentState, start, end, currentBlock, currentKey);
        }
      });
      break;
    }
  }
  return newContentState;
};

export {basicSelectionState, getForwardSelection, reduceCurrentBlocks, reduceCurrentStyles};
