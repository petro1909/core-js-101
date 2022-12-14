/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function getArea() {
    return this.height * this.width;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class BaseSelector {
  constructor(type, value) {
    this.arr = [];
    this.selectorMap = new Map([
      ['element', []],
      ['id', []],
      ['class', []],
      ['attr', []],
      ['pseudoClass', []],
      ['pseudoElement', []],
      ['combine', []],
    ]);
    this.selectorPush(type, value);
  }

  element(value) {
    this.checkOrder('element');
    this.checkSingle('element');
    this.selectorPush('element', value);
    return this;
  }

  id(value) {
    this.checkOrder('id');
    this.checkSingle('id');
    this.selectorPush('id', `#${value}`);
    return this;
  }

  class(value) {
    this.checkOrder('class');
    this.selectorPush('class', `.${value}`);
    return this;
  }

  attr(value) {
    this.checkOrder('attr');
    this.selectorPush('attr', `[${value}]`);
    return this;
  }

  pseudoClass(value) {
    this.checkOrder('pseudoClass');
    this.selectorPush('pseudoClass', `:${value}`);
    return this;
  }

  pseudoElement(value) {
    this.checkOrder('pseudoElement');
    this.checkSingle('pseudoElement');
    this.selectorPush('pseudoElement', `::${value}`);
    return this;
  }

  stringify() {
    return this.arr.join('');
  }

  checkSingle(type) {
    const typeArray = this.selectorMap.get(type);
    if (typeArray.length > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector" if element, id or pseudo-element occurs twice or more times');
    }
  }

  selectorPush(type, value) {
    const typeArray = this.selectorMap.get(type);
    typeArray.push(value);
    this.selectorMap.set(type, typeArray);
    this.arr.push(value);
  }

  checkOrder(type) {
    const selectorOrderArray = Array.from(this.selectorMap.keys());
    const typeIndex = selectorOrderArray.indexOf(type);
    for (let i = typeIndex + 1; i < selectorOrderArray.length - 1; i += 1) {
      const typeArr = this.selectorMap.get(selectorOrderArray[i]);
      if (typeArr.length > 0) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    }
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new BaseSelector('element', value);
  },

  id(value) {
    return new BaseSelector('id', `#${value}`);
  },

  class(value) {
    return new BaseSelector('class', `.${value}`);
  },

  attr(value) {
    return new BaseSelector('attr', `[${value}]`);
  },

  pseudoClass(value) {
    return new BaseSelector('pseudoClass', `:${value}`);
  },

  pseudoElement(value) {
    return new BaseSelector('pseudoElement', `::${value}`);
  },

  combine(selector1, combinator, selector2) {
    return new BaseSelector('combine', `${selector1.stringify()} ${combinator} ${selector2.stringify()}`);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
