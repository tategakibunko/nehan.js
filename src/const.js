/**
   some set of usefull constant variables.
   @namespace Nehan.Const
*/
Nehan.Const = {
  /**
     @memberof Nehan.Const
     @type {Array.<string>}
  */
  cssVenderPrefixes:[
    "-moz",
    "-webkit",
    "-o",
    "-ms"
  ],
  /**
     @memberof Nehan.Const
     @type {Array.<string>}
  */
  cssPhysicalBoxDirs:[
    "top",
    "right",
    "bottom",
    "left"
  ],
  /**
     @memberof Nehan.Const
     @type {Array.<string>}
  */
  cssLogicalBoxDirs:[
    "before",
    "end",
    "after",
    "start"
  ],
  /**
     @memberof Nehan.Const
     @type {Array.<string>}
  */
  cssPhysicalBoxCorders:[
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right"
  ],
  /**
     @memberof Nehan.Const
     @type {Array.<string>}
  */
  cssLogicalBoxCorners:[
    "before-start",
    "before-end",
    "after-end",
    "after-start"
  ],
  /**
     @memberof Nehan.Const
     @type {Array.<int>}
  */
  css2dIndex:{
    1:[0, 0],
    2:[0, 1]
  },
  /**
     @memberof Nehan.Const
     @type {Array.<int>}
  */
  css4dIndex:{
    1:[0, 0, 0, 0],
    2:[0, 1, 0, 1],
    3:[0, 1, 2, 1],
    4:[0, 1, 2, 3]
  },
  /**
     @memberof Nehan.Const
     @type {string}
  */
  space:"&nbsp;",
  /**
     @memberof Nehan.Const
     @type {string}
  */
  clearFix:"<div style='clear:both'></div>"
};
