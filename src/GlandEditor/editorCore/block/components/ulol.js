import React from 'react';
import {getBlock} from '../utils';
import {wrappers} from '../blocks';

const listStyle = {
  ul: [
    {
      listStyle: 'disc'
    },
    {
      listStyle: 'square'
    },
    {
      listStyle: 'circle'
    }
  ],
  ol: [
    {
      listStyle: 'decimal'
    },
    {
      listStyle: 'upper-alpha'
    },
    {
      listStyle: 'lower-alpha'
    },
    {
      listStyle: 'lower-roman'
    },
    {
      listStyle: 'upper-roman'
    }
  ]
};

class Ulol extends React.Component {
  constructor(props) {
    super(props);
    this.left = 20;
  }

  getPack() {
    const Package = [];
    let p;
    let currentLevel, type;
    this.props.wrapperArr.forEach(child => {
      const blockData = getBlock(child).getData();
      const level = blockData.get('data').get('level') || 0;
      type = blockData.get('type');
      if (currentLevel === level) {
        p.push(child);
        return;
      } else if (p) {
        Package.push([p, type, currentLevel]);
      }
      p = [child];
      currentLevel = level;
    });
    Package.push([p, type, currentLevel]);
    return Package;
  }

  render() {
    return (
      <>
        {this.getPack().map(arr => {
          let type = arr[1],
            level = arr[2];
          let key = getBlock(arr[0]).getKey();
          return React.createElement(
            type,
            {
              className: wrappers[type]['className'],
              key,
              style: {marginLeft: this.left * level, ...listStyle[type][level]}
            },
            arr.map(child => <li key={getBlock(child).getKey()}>{child}</li>)
          );
        })}
      </>
    );
  }
}

export {Ulol};
