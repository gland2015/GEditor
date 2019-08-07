import React, {Fragment} from 'react';

import {editorContext} from '../../utils/global/editorContext';
import {blocks} from './blocks';

class Element extends React.Component {
  static contextType = editorContext;
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let {toUpdateKeys, mode} = this.context;
    if (mode !== 'dev') return true;
    let key;
    if (toUpdateKeys) {
      key = nextProps.children.props.block.getKey();
      if (toUpdateKeys.indexOf(key) === -1) {
        return false;
      }
    }
    console.log('update', key);
    return true;
  }

  render() {
    let {children} = this.props;
    const block = children.props.block;
    const type = block.getData().get('type');
    const blockInfo = blocks[type];
    const isTextBlock = blockInfo.isTextBlock;
    const style = block.getData().get('style');
    // 对于输入法的重要操作
    if (isTextBlock && block.getText().length === 0) {
      children = <div>{children}</div>;
    }
    return React.createElement(
      blockInfo.element || Fragment,
      {
        style: style ? style.toJS() : null,
        className: blockInfo.className,
        contentEditable: isTextBlock ? null : false,
        'data-type': isTextBlock ? 'text' : 'nontext'
      },
      children
    );
  }
}

export {Element};
