export {Toolbar};

import React from 'react';

import {Grid1} from './grid1';
import {Grid2} from './grid2';
import {Grid3} from './grid3';
import {Grid4} from './grid4';
import {Grid5} from './grid5';

class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.edit = props.editor.handleEditAction;

    this.applyBlue=(e) => {
      e.preventDefault();
      this.edit({
        type: 'applyInlineStyle',
        name: 'color:blue;font-weight:initial;'
      })
    }
    this.applyRed=(e) => {
      e.preventDefault();
      this.edit({
        type: 'applyInlineStyle',
        name: 'color:red;font-weight:bold;'
      })
    }
    this.applyH1 = (e) => {
      e.preventDefault();
      this.edit({
        type: 'applyBlockType',
        name: 'h1'
      })
    }
    this.insertTable=(e) => {
      e.preventDefault();
      this.edit({
        type: 'insertTable',
        options: {
          num: 4,
          column: 2,
        }
      })
    }
  }

  render() {
    return (
      <>
      <div style={{position: 'fixed',top:0}}>
        {/**测试按钮 */}
        <button onMouseDown={this.applyBlue}>变蓝</button>
        <button onMouseDown={this.applyRed}>变红粗</button>
        <button onMouseDown={this.applyH1}>变为h1块</button>
        <button onMouseDown={this.insertTable}>插入表格</button>
      </div>
      <div style={style['container']}>
        <div style={style['support']} />
        <div style={style['main']}>
          <Grid1 />
          <Grid2 />
          <Grid3 />
          <Grid4 />
          <Grid5 />
        </div>
      </div>
      </>
    );
  }
}

const style = {
  container: {
    borderBottom: '1px solid gray',
    position: 'relative'
  },
  support: {
    width: '100%',
    paddingTop: '6%'
  },
  main: {
    boxSizing: 'border-box',
    height: '100%',
    width: '100%',
    padding: 3,
    display: 'grid',
    gridTemplate: '100% / 25% 25% 20% 15% 15%',
    position: 'absolute',
    top: 0,
    left: 0
  }
};
