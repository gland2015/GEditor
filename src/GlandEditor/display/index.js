import React from 'react';

import {editorContext} from '../utils/global/editorContext';
import {EditorCore} from '../editorCore';

class Display extends React.Component {
  constructor(props) {
    super(props);
    this.contextValue = {mode: 'prod'};
    this.state = {
      editorState: props.editorState
    };
  }

  static mode = 'prod';

  get editorState() {
    return this.state.editorState;
  }

  updateEditorState(editorState) {
    this.setState({editorState});
  }

  render() {
    return (
      <div>
        <editorContext.Provider value={this.contextValue}>
          <EditorCore
            editorState={this.state.editorState}
            onChange={this.updateEditorState}
            customStyleMap={this.props.customStyleMap}
            readOnly={true}
          />
        </editorContext.Provider>
      </div>
    );
  }
}

export {Display};
