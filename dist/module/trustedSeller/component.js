"use strict";

exports.__esModule = true;
exports.TSComponent = void 0;

var _src = require("zoid/src");

var _src2 = require("jsx-pragmatic/src");

/** @jsx node */
let TSComponent = (0, _src.create)({
  tag: 'login-component',
  dimensions: {
    width: '300px',
    height: '300px'
  },
  url: ({
    props
  }) => {
    return {
      demo: './login.htm',
      production: 'https://my-site.com/login',
      test: 'mock://www.my-site.com/base/test/windows/login/index.htm'
    }[props.env];
  },
  props: {
    env: {
      type: 'string',
      default: () => 'production'
    },
    tokenId: {
      type: 'string'
    },
    authToken: {
      type: 'string'
    },
    refSite: {
      type: 'string'
    },
    displayToolTip: {
      type: 'boolean'
    },
    onIconClick: {
      type: 'function'
    }
  },
  defaultContext: __DEFAULT_CONTEXT__,

  prerenderTemplate({
    doc
  }) {
    return (0, _src2.node)("html", null, (0, _src2.node)("head", null, (0, _src2.node)("style", null, `
                        html, body {
                            width:300px;
                            height:300px;
                            overflow: hidden;
                            bottom: 0;
                            position: fixed !important;
                            left: 0 !important;
                            margin: 0 !important;
                            text-align: center;
                        }
                        .zoid-visible {
                            bottom: 0 !important;
                            position: fixed !important;
                            left: 0 !important;
                        }

                        .spinner {
                            height: 40px;
                            width: 40px;
                            bottom:10px;
                            left:30px;
                            position: fixed;
                            transform: translateX(-50%) translateY(-50%);
                            z-index: 10;
                            
                        }

                        .spinner .loader {
                            height: 100%;
                            width: 100%;
                            box-sizing: border-box;
                            border: 3px solid rgba(0, 0, 0, .2);
                            border-top-color: rgba(33, 128, 192, 0.8);
                            border-radius: 100%;
                            animation: rotation .7s infinite linear;

                        }

                        @keyframes rotation {
                            from {
                                transform: rotate(0deg)
                            }
                            to {
                                transform: rotate(359deg)
                            }
                        }
                    `)), (0, _src2.node)("body", null)).render((0, _src2.dom)({
      doc
    }));
  }

});
exports.TSComponent = TSComponent;