/* @flow */
/* eslint import/no-default-export: off, import/no-nodejs-modules: off */

import { getWebpackConfig } from 'grumbler-scripts/config/webpack.config';

import globals from './globals';

const FILE_NAME = 'ts-zoid-component';
const MODULE_NAME = 'trustedseller';

export const WEBPACK_CONFIG_FRAME = getWebpackConfig({
    filename:   `${ FILE_NAME }.frame.js`,
    modulename: MODULE_NAME,
    minify:     false,
    vars:       {
        ...globals
    }
});

export const WEBPACK_CONFIG_FRAME_MIN = getWebpackConfig({
    filename:   `${ FILE_NAME }.frame.min.js`,
    modulename: MODULE_NAME,
    minify:     true,
    vars:       {
        ...globals,
        __MIN__: true
    }
});


export const WEBPACK_CONFIG_TEST = getWebpackConfig({
    modulename: MODULE_NAME,
    test:       true,
    vars:       {
        ...globals
    }
});

export default [
    WEBPACK_CONFIG_FRAME,
    WEBPACK_CONFIG_FRAME_MIN
];
