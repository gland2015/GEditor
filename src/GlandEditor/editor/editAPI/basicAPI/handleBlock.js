import {Modifier} from 'draft-js';
import {Map} from 'immutable';

import {blocks, wrappers} from '../../../editorCore/block/blocks';
import {basicSelectionState} from './handleSelect';

const basicBlockData = Map({type: 'default', wrapper: null, style: Map({}), data: Map({})});

function getWrapperStartKey(block) {
  return block
    .getData()
    .get('data')
    .get('wrapperStartKey');
}

// 即无包装的文本块
function isPureTextBlock(content, key) {
  const blockData = content.getBlockForKey(key).getData();
  const wrapper = blockData.get('wrapper');
  const type = blockData.get('type');
  if (wrapper || !blocks[type].isTextBlock) {
    return false;
  }
  return true;
}

// 返回靠前的相同类型块的块数据，tarKey即不能参考的块，可无
function getSameBlockData(contentState, type, tarKey) {
  let block = contentState.getFirstBlock();
  let key, data, blockData;
  while (block) {
    data = block.getData();
    key = block.getKey();
    if (data.get('type') === type && tarKey !== key) {
      blockData = data;
      break;
    }
    block = contentState.getBlockAfter(key);
  }
  if (!blockData) {
    blockData = basicBlockData.set('type', type);
  }
  return blockData;
}

// 可以是数组以删除多个
function deleteBlock(contentState, key) {
  // 勿删第一个块
  let blockMap = contentState.getBlockMap();
  if (typeof key === 'string') {
    blockMap = blockMap.delete(key);
  } else {
    key.forEach(k => blockMap.delete(key));
  }
  return contentState.set('blockMap', blockMap);
}

// 删除固定包装的块
function deleteFixedBlock(contentState, startKey) {
  let blockMap = contentState.getBlockMap();
  let block;
  let key = startKey;
  while (key) {
    block = contentState.getBlockForKey(key);
    if (
      block
        .getData()
        .get('data')
        .get('wrapperStartKey') === startKey
    ) {
      blockMap = blockMap.delete(key);
      key = contentState.getKeyAfter(key);
      continue;
    } else break;
  }
  return contentState.set('blockMap', blockMap);
}

// 融合进前一个块，只保留文本和内联样式
function mergeBlock(contentState, key) {
  let beforeBlock = contentState.getBlockBefore(key);
  if (!beforeBlock) return contentState;
  let beforeKey = beforeBlock.getKey();
  let sel = basicSelectionState.merge({
    anchorKey: beforeKey,
    focusKey: key,
    anchorOffset: beforeBlock.getText().length
  });
  contentState = Modifier.removeRange(contentState, sel, 'forward');
  return contentState;
}

function setBlockData(contentState, key, blockData) {
  let sel = basicSelectionState.merge({anchorKey: key, focusKey: key});
  return Modifier.setBlockData(contentState, sel, blockData);
}

// 默认复制块数据，默认offset在块最后
function splitBlock(contentState, key, blockData, offset) {
  if (!blockData) {
    blockData = contentState.getBlockForKey(key).getData();
  }
  if (offset === undefined) {
    offset = contentState.getBlockForKey(key).getText().length;
  }
  let sel = basicSelectionState.merge({
    anchorKey: key,
    focusKey: key,
    anchorOffset: offset,
    focusOffset: offset
  });
  contentState = Modifier.splitBlock(contentState, sel);
  key = contentState.getKeyAfter(key);
  return setBlockData(contentState, key, blockData);
}

// 后面四个参数可无，最后一个是指新加块衍生出的后一个块的数据
function insertBlock(contentState, key, blockData, offset, num = 1, blockDataLast) {
  contentState = splitBlock(contentState, key, blockData, offset);
  let block = contentState.getBlockAfter(key);
  key = block.getKey();
  if (block.getText().length || !contentState.getBlockAfter(key)) {
    contentState = splitBlock(contentState, key, blockData, 0);
    blockDataLast = blockDataLast || contentState.getBlockBefore(key).getData();
    contentState = setBlockData(contentState, contentState.getKeyAfter(key), blockDataLast);
  }
  while (num > 1) {
    contentState = splitBlock(contentState, key, blockData, 0);
    key = contentState.getKeyAfter(key);
    num--;
  }
  return contentState;
}

// 不要求文本块
function reduceBlockByTypes(fn, contentState, types = []) {
  let block = contentState.getFirstBlock();
  let key, data;
  if (!Array.isArray(types)) types = [types];
  while (block) {
    key = block.getKey();
    data = block.getData();
    if (types.indexOf(data.get('type')) !== -1) {
      contentState = fn(contentState, data, key);
    }
    block = contentState.getBlockAfter(key);
  }
  return contentState;
}

export {
  basicBlockData,
  getWrapperStartKey,
  isPureTextBlock,
  getSameBlockData,
  deleteBlock,
  mergeBlock,
  setBlockData,
  splitBlock,
  insertBlock,
  reduceBlockByTypes,
  deleteFixedBlock
};
