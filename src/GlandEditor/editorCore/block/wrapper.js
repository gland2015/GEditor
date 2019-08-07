import React, {createElement, Fragment} from 'react';

import {editorContext} from '../../utils/global/editorContext';
import {wrapperMap} from './components';
import {Folder} from './components/folder';
import {getBlock} from './utils';

class Wrapper extends React.Component {
  static contextType = editorContext;
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    const {toUpdateKeys, mode, editor} = this.context;
    if (mode !== 'dev') return true;
    if (toUpdateKeys) {
      if (toUpdateKeys.length === 0) return false;
      return true;
    }
    let sel = editor.state.editorState.getSelection();
    if (sel.anchorKey === sel.focusKey) {
      this.context.toUpdateKeys = [sel.anchorKey];
      return true;
    }
    let content = editor.state.editorState.getCurrentContent();
    let start = sel.anchorKey,
      end = sel.focusKey;
    if (sel.isBackward) {
      [start, end] = [end, start];
    }
    let nextKey = start,
      keys = [end];
    do {
      keys.push(nextKey);
      nextKey = content.getKeyAfter(nextKey);
    } while (nextKey && nextKey !== end);
    this.context.toUpdateKeys = keys;
    return true;
  }

  getPack(children) {
    let currentWrapper;
    let wrapperArr = [];
    const result = [];
    const pushArr = _ =>
      result.push(
        createElement(wrapperMap[currentWrapper], {
          wrapperArr,
          key: getBlock(wrapperArr[0]).getKey()
        })
      );
    children.forEach((child, i) => {
      let block = getBlock(child);
      let wrapper = block.getData().get('wrapper');
      if (!wrapper) {
        if (currentWrapper) {
          pushArr();
          wrapperArr = [];
          currentWrapper = undefined;
        }
        result.push(child);
      } else if ((!currentWrapper && (currentWrapper = wrapper)) || currentWrapper === wrapper) {
        wrapperArr.push(child);
      } else {
        pushArr();
        currentWrapper = wrapper;
        wrapperArr = [child];
      }
    });
    if (wrapperArr.length !== 0) pushArr();
    console.log('result', result);
    return result;
  }

  getFold(childrenArr) {
    const list = [];
    let subList = [[list, 1]];

    childrenArr.forEach(child => {
      if (child.props.wrapperArr) {
        subList[0][0].push(child);
        return;
      }
      let data = getBlock(child).getData();
      let type = data.get('type');
      if (type[0] !== 'h') {
        subList[0][0].push(child);
        return;
      }
      let level = parseInt(type[1]);
      if (!level) {
        // 'x'
        subList = [[list, 1]];
        list.push(child);
        return;
      }
      let curLevel = subList[0][1];
      while (level < curLevel) {
        subList.shift();
      }
      let temp = [child];
      subList[0][0].push(temp);
      subList.unshift([temp, level]);
    });
    return list;
  }

  render() {
    let childrenArr = this.getPack(this.props.children);
    console.log('childrenArr', childrenArr);
    if (this.context.canFold) {
      return (
        <>
          {list.map(value => {
            let key;
            if (Array.isArray(value)) {
              key = getBlock(value[0]).getKey();
              return <Folder key={key} childs={value} />;
            } else return value;
          })}
        </>
      );
    }
    return <>{childrenArr}</>;
  }
}

export {Wrapper};
