import {applyBlockType} from '../editAPI/textBlock';

function ToDefault(e, updateEditorState) {
  const {editorState, toUpdateKeys} = applyBlockType(e, 'default');
  updateEditorState(editorState, toUpdateKeys);
  return 'handled';
}

function ToHx(e, updateEditorState) {
  const {editorState, toUpdateKeys} = applyBlockType(e, 'hx');
  updateEditorState(editorState, toUpdateKeys);
  return 'handled';
}

function ToH1(e, updateEditorState) {
  const {editorState, toUpdateKeys} = applyBlockType(e, 'h1');
  updateEditorState(editorState, toUpdateKeys);
  return 'handled';
}

function ToH2(e, updateEditorState) {
  const {editorState, toUpdateKeys} = applyBlockType(e, 'h2');
  updateEditorState(editorState, toUpdateKeys);
  return 'handled';
}

function ToH3(e, updateEditorState) {
  const {editorState, toUpdateKeys} = applyBlockType(e, 'h3');
  updateEditorState(editorState, toUpdateKeys);
  return 'handled';
}

function ToH4(e, updateEditorState) {
  const {editorState, toUpdateKeys} = applyBlockType(e, 'h4');
  updateEditorState(editorState, toUpdateKeys);
  return 'handled';
}

function ToH5(e, updateEditorState) {
  const {editorState, toUpdateKeys} = applyBlockType(e, 'h5');
  updateEditorState(editorState, toUpdateKeys);
  return 'handled';
}

function ToH6(e, updateEditorState) {
  const {editorState, toUpdateKeys} = applyBlockType(e, 'h6');
  updateEditorState(editorState, toUpdateKeys);
  return 'handled';
}

export {ToDefault, ToHx, ToH1, ToH2, ToH3, ToH4, ToH5, ToH6};
