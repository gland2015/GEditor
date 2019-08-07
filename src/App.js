import React from 'react';
import {GEditor} from './GlandEditor';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{padding: '3% 15%'}}>
        <GEditor />
      </div>
    );
  }
}

export default App;
