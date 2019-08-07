import {EditorState} from 'draft-js';
import {makeCollapsed, insertText} from '../editAPI/basicAPI/handleState';
import {handleBackspace} from './handleBackspace';
import {handleEntry} from './handleEntry';
import {ToDefault, ToHx, ToH1, ToH2, ToH3, ToH4, ToH5, ToH6} from './handleToggle';
import {
  handleDeLevel,
  handleTab,
  handleInsertEndl,
  handleInsertNewLine,
  handleDelete
} from './utils';

function keyBindingFn(e) {
  const keyCode = e.keyCode;
  const key = e.key;
  if (keyCode === 229) return 'disabled';
  if (e.altKey) {
    // 切换操作
    if (keyCode === 87) return 'ToDefault'; // 加w切换为普通块
    if (keyCode === 65) return 'ToHx'; // 加a切换为hx块，x不可用
    if (keyCode === 81) return 'ToH1'; // 加q切换为h1，1不可用
    if (keyCode === 50) return 'ToH2'; // 加2切换为h2
    if (keyCode === 51) return 'ToH3'; // 加3切换为h3
    if (keyCode === 52) return 'ToH4'; // 加4切换为h4
    if (keyCode === 53) return 'ToH5'; // 加5切换为h5
    if (keyCode === 54) return 'ToH6'; // 加5切换为h6
  }
  if (e.shiftKey) {
    if (keyCode === 9) return 'DeLevel'; // 加tab降低data中的level，前提是有
    if (keyCode === 13) return 'InEndl'; // 加entry插入换行符
  }
  if (e.ctrlKey) {
    if (keyCode === 13) return 'InNewLine'; // 加entry不分块插入新行
    if (keyCode === 83) return 'save'; //加s保存
    if (keyCode === 89) return 'redo'; // 加y重做
    if (keyCode === 90) return 'undo'; // 加z撤销
  }

  if (e.ctrlKey || e.altKey) return 'disabled';

  if (keyCode === 8) return 'backspace';
  if (keyCode === 13) return 'entry';
  if (keyCode === 9) return 'tab'; // 制表键tab，插入两个空格或提高level
  if (keyCode === 46) return 'delete'; // 删除整个块

  // 处理单个字符的输入
  if (key && key.length === 1) {
    let editorState = this.state.editorState;
    let sel = editorState.getSelection();
    let keys = key + key;
    if (!sel.isCollapsed()) return keys;
    if (!sel.anchorOffset) return keys;
    if (editorState.getInlineStyleOverride()) return keys;

    // let selection = (window.getSelection || document.getSelection)();
    // if (selection.anchorNode.nodeType !== 3) return keys;
    // 为本次原生渲染开后门
    e.preventDefault = r => 1;
    return key;
  }
  if (passKeyCode[keyCode]) return null;
  return 'disabled';
}

function handleKeyCommand(command) {
  const handler = handlers[command];
  let editorState = this.state.editorState;
  if (handler) return handler(editorState, this.updateEditorState);

  // 普通的插入字符，无需重新渲染
  if (command.length === 1) {
    editorState = insertText(editorState, command);
    this.updateEditorState(editorState, []);
    return 'handled';
  }
  // 需重新渲染
  if (command.length === 2) {
    editorState = makeCollapsed(editorState);
    editorState = insertText(editorState, command[0]);
    this.updateEditorState(editorState, [editorState.getSelection().anchorKey]);
    return 'handled';
  }
  return 'handled';
}

// 允许的长度不为1的key
const passKeyCode = {
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  45: 'Insert',
  114: 'F3',
  122: 'F11'
};

const handlers = {
  ToDefault: ToDefault,
  ToHx: ToHx,
  ToH1: ToH1,
  ToH2: ToH2,
  ToH3: ToH3,
  ToH4: ToH4,
  ToH5: ToH5,
  ToH6: ToH6,
  DeLevel: handleDeLevel,
  InEndl: handleInsertEndl,
  InNewLine: handleInsertNewLine,
  save: 0,
  redo: 0, //n
  undo: 0, //n
  tab: handleTab,
  delete: handleDelete,
  entry: handleEntry,
  backspace: handleBackspace
};

export {keyBindingFn, handleKeyCommand};
