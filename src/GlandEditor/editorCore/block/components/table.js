import React from 'react';
import {wrappers} from '../blocks';
import {getBlock} from '../utils';

class Table extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {wrapperArr} = this.props;
    const result = [];
    let subArr = [1];
    let i = 0;
    while (i < wrapperArr.length) {
      const data = getBlock(wrapperArr[i])
        .getData()
        .get('data');
      const num = data.get('num');
      const column = data.get('column');
      subArr = wrapperArr.slice(i, i + num);
      i += num;
      result.push(
        <TableComponent
          key={getBlock(subArr[0]).getKey()}
          num={num}
          column={column}
          wrapperArr={subArr}
        />
      );
    }
    return <>{result}</>;
  }
}

class TableComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {num, column, wrapperArr} = this.props;
    let subArr = [1];
    let table = [];
    let i = 0;
    while (i < wrapperArr.length) {
      subArr = wrapperArr.slice(i, i + column);
      let tds = subArr.map(child => <td key={getBlock(child).getKey()}>{child}</td>);
      table.push(<tr key={getBlock(subArr[0]).getKey()}>{tds}</tr>);
      i += column;
    }
    return (
      <table border="1" className={wrappers['table']['className']}>
        <tbody>{table}</tbody>
      </table>
    );
  }
}

export {Table};
