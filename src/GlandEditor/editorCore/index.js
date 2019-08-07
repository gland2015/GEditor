import React from 'react';
import {Editor, EditorState} from 'draft-js';

import {editorCoreClassName} from '../utils/global/namespace';
import {customStyleFn} from './inline';
import {blockRenderMap, blockRendererFn} from './block';

class EditorCore extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.mode === 'dev') {
      const {editorCoreRef, ...restProps} = this.props;
      return (
        <div className={editorCoreClassName}>
          <Editor
            ref={editorCoreRef}
            customStyleFn={customStyleFn}
            blockRenderMap={blockRenderMap}
            blockRendererFn={blockRendererFn}
            {...restProps}
          />
        </div>
      );
    } else {
      const {...restProps} = this.props;
      return (
        <div className={editorCoreClassName}>
          <Editor
            customStyleFn={customStyleFn}
            blockRenderMap={blockRenderMap}
            blockRendererFn={blockRendererFn}
            {...restProps}
          />
        </div>
      );
    }
  }
}

export {EditorCore};
