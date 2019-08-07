import {EditorState} from 'draft-js';
import {Map} from 'immutable';

import {setBlockData, getSameBlockData, reduceBlockByTypes} from './basicAPI/handleBlock';
import {reduceCurrentBlocks} from './basicAPI/handleSelect';
import {blocks} from '../../editorCore/block/blocks';

// 只改变type和style
function applyBlockType(editorState, TYPE = 'default') {
  let selection = editorState.getSelection();
  let content = editorState.getCurrentContent();
  const style = getSameBlockData(content, TYPE).get('style');
  const toUpdateKeys = [];
  const fn = (content, data, key) => {
    const type = data.get('type');
    if (type !== TYPE && blocks[type].isTextBlock) {
      data = data.set('type', TYPE).set('style', style);
      content = setBlockData(content, key, data);
      toUpdateKeys.push(key);
    }
    return content;
  };
  content = reduceCurrentBlocks(fn, content, selection);
  editorState = EditorState.push(editorState, content, 'change-block-data');
  editorState = EditorState.forceSelection(editorState, selection);
  return {editorState, toUpdateKeys};
}

// 只改变块的style, style可为map, obj(添加), 空（清空）
// 相同类型的文本块保持一致的变化
function applyBlockStyle(editorState, style) {
  let selection = editorState.getSelection();
  let content = editorState.getCurrentContent();
  const toUpdateKeys = [];
  const types = [];
  const fn = (content, data, key) => {
    let type = data.get('type');
    if (blocks[type].isTextBlock && types.indexOf(type) === -1) types.push(type);
    return content;
  };
  reduceCurrentBlocks(fn, content, selection);
  if (style && style.constructor !== Map) {
    style = Map(style);
  }
  const Fn = (content, data, key) => {
    let theStyle = data.get('style');
    if (style) theStyle = theStyle.merge(style);
    else theStyle = Map({});
    data = data.set('style', style);
    toUpdateKeys.push(key);
    return setBlockData(content, key, data);
  };
  content = reduceBlockByTypes(Fn, content, types);
  editorState = EditorState.push(editorState, content, 'change-block-data');
  editorState = EditorState.forceSelection(editorState, selection);
  return {editorState, toUpdateKeys};
}
// wrapper: string ul, ol
function setBlockWrapper(editorState, wrapper) {}

export {applyBlockType, applyBlockStyle};
