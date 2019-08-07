import React from 'react';
import {getBlock} from '../utils';

class Folder extends React.Component {
  constructor(props) {
    super(props);
    let isOpen = this.data.isOpen;
    if (isOpen === undefined) {
      isOpen = true;
    }
    this.state = {isOpen};
    this.handleClick = this.handleClick.bind(this);
  }

  get data() {
    return getBlock(this.props.childs[0]).getData();
  }

  handleClick() {
    this.setState(
      preState => {
        return {isOpen: !preState.isOpen};
      },
      () => {
        let data = this.data;
        data.isOpen = this.state.isOpen;
      }
    );
  }

  render() {
    const {childs} = this.props;
    return (
      <>
        <div>
          <button onClick={this.handleClick} style={{position: 'absolute', left: -10}}>
            切换
          </button>
          {childs[0]}
        </div>
        <div style={{height: this.state.isOpen ? null : 0, overflow: 'hidden'}}>
          {this.props.childs.slice(1).map(value => {
            let key;
            if (Array.isArray(value)) {
              key = getBlock(value[0]).getKey();
              return <Folder key={key} childs={value} />;
            } else return <>{value}</>;
          })}
        </div>
      </>
    );
  }
}

export {Folder};
