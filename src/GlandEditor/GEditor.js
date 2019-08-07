import React from 'react';
import {convertToRaw} from 'draft-js';

import {Editor} from './editor';
import {Display} from './display';
import {getContentState, getEditorState} from './editor/editAPI/basicAPI/handleState';
import {getEditorStyleSheet} from './utils/global/editorStyleSheet';
import {
  getCustomStyleMapAndLabel,
  getCustomStyleSheet,
  updateStyleSheet,
  getEditorStyleOptions,
  downloadText
} from './utils/global/handle';

class GEditor extends React.Component {
  constructor(props) {
    super(props);
    this.RenderRef = React.createRef();
  }

  static getContent(contentState, options) {
    return convertToRaw(getContentState(contentState, options));
  }

  static getContentState(contentState, options) {
    return getContentState(contentState, options);
  }

  static getContentDownload(contentState, options) {
    let content = convertToRaw(getContentState(contentState, options));
    return downloadText(content, 'content.js');
  }

  getContent() {
    return convertToRaw(this.RenderRef.editorState.getCurrentContent());
  }

  getContentState() {
    return this.RenderRef.editorState.getCurrentContent();
  }

  getContentDownload() {
    let content = convertToRaw(this.RenderRef.editorState.getCurrentContent());
    return downloadText(content, 'content.js');
  }

  async updateStyleSheet() {
    let editorStyleOptions = getEditorStyleOptions(this.RenderRef.editorState);
    let styleSheet =
      getEditorStyleSheet(editorStyleOptions) +
      ';' +
      getCustomStyleSheet(this.RenderRef.editorState);
    updateStyleSheet(styleSheet);
  }

  componentDidUpdate() {
    this.updateStyleSheet();
  }

  componentDidMount() {
    this.updateStyleSheet();
  }

  render() {
    const date = new Date().getTime();
    const {isEditMode = true, contentState} = this.props;
    const editorState = getEditorState(contentState);
    const {customStyleMap, customStyleLabel} = getCustomStyleMapAndLabel(editorState);
    const Render = isEditMode ? Editor : Display;
    return (
      <Render
        ref={r => (this.RenderRef = r)}
        editorState={editorState}
        customStyleMap={customStyleMap}
        customStyleLabel={customStyleLabel}
        key={date}
      />
    );
  }
}

export {GEditor};
