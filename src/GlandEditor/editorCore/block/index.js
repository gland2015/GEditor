import React from 'react';
import {Map} from 'immutable';

import {blocks} from './blocks';
import {Element} from './element';
import {Wrapper} from './wrapper';

const blockRenderMap = Map({
  unstyled: {
    element: Element,
    wrapper: <Wrapper />
  }
});

function blockRendererFn(contentBlock) {
  const type = contentBlock.getData().get('type');
  if (!blocks[type].isTextBlock) {
    return blocks[type].rendererReturnValue;
  }
}

export {blockRenderMap, blockRendererFn};
