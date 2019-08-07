import {EditorState} from 'draft-js';
import {editorStyleTagId} from './namespace';

function getMetadata(editorState) {
  return editorState
    .getCurrentContent()
    .getFirstBlock()
    .getData()
    .get('metadata');
}

function getCustomStyleMapAndLabel(editorState) {
  const customStyleMap = {};
  const customStyleLabel = {};
  let styleMap = getMetadata(editorState)['styleMap'];
  for (let id in styleMap) {
    customStyleMap[id] = styleMap[id]['style'] || {};
    customStyleMap[id] = styleMap[id]['label'] || id;
  }
  return {customStyleLabel, customStyleMap};
}

function getCustomStyleSheet(editorState) {
  return getMetadata(editorState)['customStyleSheet'];
}

function getEditorStyleOptions(editorState) {
  return getMetadata(editorState)['editorStyleSheet'];
}

function updateStyleSheet(styleSheet) {
  let tag = document.getElementById(editorStyleTagId);
  if (tag) {
    tag.innerHTML = styleSheet;
  } else {
    tag = document.createElement('style');
    tag.id = editorStyleTagId;
    tag.innerHTML = styleSheet;
    document.head.appendChild(tag);
  }
}

function downloadText(content, filename) {
  // 创建隐藏的可下载链接
  var eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  var blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
}

export {
  getMetadata,
  getCustomStyleMapAndLabel,
  getCustomStyleSheet,
  getEditorStyleOptions,
  updateStyleSheet,
  downloadText
};
