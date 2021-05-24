import { default as animations } from './mixins/_animations';
import { default as displaysContent } from './mixins/_displaysContent';
import { default as keyboardBindings } from './mixins/_keyboardBindings';
import { default as removesProtocol } from './mixins/_removesProtocol';
import { default as verticalOverflow } from './mixins/_verticalOverflow';

let mixins = {
  ...animations,
  ...displaysContent,
  ...keyboardBindings,
  ...removesProtocol,
  ...verticalOverflow
}

export default mixins;
