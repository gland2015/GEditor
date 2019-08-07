import React from 'react';
import {Toolbar} from './toolbar';
import {editorContext} from '../utils/global/editorContext';
import {EditorCore} from '../editorCore';
import {handleEditAction} from './editAPI';

import {keyBindingFn, handleKeyCommand} from './keyboard';
import {
  handleCompositionStart,
  handleCompositionEnd,
  handleBeforeInput,
  handleMouseDown
} from './handle';

// js同时只会有一个函数在执行

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.contextValue = {
      mode: 'dev',
      editor: this,
      toUpdateKeys: null
    };
    this.state = {
      editorState: props.editorState
    };
    this.editorIsFree = true;
    this.startState = null;
    this.startUpdateKeys = [];

    this.editorRef = React.createRef();
    this.editorCoreRef = React.createRef();
    this.handleKeyCommand = handleKeyCommand.bind(this);
    this.keyBindingFn = keyBindingFn.bind(this);
    this.handleCompositionStart = handleCompositionStart.bind(this);
    this.handleCompositionEnd = handleCompositionEnd.bind(this);
    this.handleMouseDown = handleMouseDown.bind(this);

    this.updateEditorState = (editorState, toUpdateKeys = null) => {
      // 输入法事件
      if (this.startState) return;

      this.editorIsFree = false;
      this.contextValue.toUpdateKeys = toUpdateKeys;
      this.setState({editorState}, () => {
        this.editorIsFree = true;
      });
    };

    this.handleEditAction = detail => {
      if (this.editorIsFree) {
        this.editorIsFree = false;
        const {editorState, toUpdateKeys} = handleEditAction(this.state.editorState, detail);
        this.updateEditorState(editorState, toUpdateKeys);
      }
    };

    this.test = e => {
      e.preventDefault();
      console.log('wsel', window.getSelection());
      let s = this.state.editorState;
      let sel = s.getSelection();
      console.log(sel);
    };
  }

  static mode = 'dev';
  get editorState() {
    return this.state.editorState;
  }

  render() {
    return (
      <div
        style={{
          border: '1px solid gray',
          borderRadius: 5
        }}
        ref={r => (this.editorRef = r)}>
        <Toolbar editor={this} customStyleLabel={this.props.customStyleLabel} />
        <div
          style={{
            padding: '1.6%'
          }}
          onMouseDownCapture={handleMouseDown}
          onCutCapture={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onBeforeInputCapture={handleBeforeInput}
          onCompositionStartCapture={this.handleCompositionStart}
          onCompositionEndCapture={this.handleCompositionEnd}>
          <editorContext.Provider value={this.contextValue}>
            <EditorCore
              mode="dev"
              editorCoreRef={r => (this.editorCoreRef = r)}
              editorState={this.state.editorState}
              onChange={this.updateEditorState}
              customStyleMap={this.props.customStyleMap}
              keyBindingFn={this.keyBindingFn}
              handleKeyCommand={this.handleKeyCommand}
              handleBeforeInput={handleBeforeInput}
            />
          </editorContext.Provider>
        </div>
        <div
          onMouseDownCapture={e => {
            e.preventDefault();
            this.editorCoreRef.focus();
          }}
          style={{height: 300, background: 'gray'}}
        />
      </div>
    );
  }
}

export {Editor};
