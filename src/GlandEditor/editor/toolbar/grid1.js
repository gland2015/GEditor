import React from 'react';

export {Grid1};

class Grid1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'inline'
    };
  }

  render() {
    return (
      <div style={style['container']}>
        <Toggle />
      </div>
    );
  }
}

function Toggle(props) {
  return (
    <div style={toggle['contanier']}>
      <div />
    </div>
  );
}

const style = {
  container: {
    borderRight: '1px solid rgba(100, 100, 100, 0.2)',
    marginRight: '3px',
    display: 'grid',
    gridTemplate: '50% 50% / repeat(9, 11.11%)',
    gridTemplateAreas: `"a a b b b c c d e" 
                        "a a f g h i j k l"`
  }
};

const toggle = {
  contanier: {
    gridArea: 'a',
    placeSelf: 'center'
  }
};
