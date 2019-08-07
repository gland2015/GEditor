import React from 'react';

class Image extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div contentEditable={false}>
        <img
          style={{width: 300, height: 200}}
          src="https://gland2015.github.io/images/神雕侠侣.jpg"
        />
      </div>
    );
  }
}

export {Image};
