"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _ = require("..");

var _default = inputHandler => {
  const {
    stdin,
    setRawMode
  } = (0, _react.useContext)(_.StdinContext);
  (0, _react.useEffect)(() => {
    setRawMode(true);
    return () => {
      setRawMode(false);
    };
  }, [setRawMode]);
  (0, _react.useEffect)(() => {
    const handleData = data => {
      let input = String(data);
      const key = {
        upArrow: input === '\u001B[A',
        downArrow: input === '\u001B[B',
        leftArrow: input === '\u001B[D',
        rightArrow: input === '\u001B[C',
        return: input === '\r',
        escape: input === '\u001B',
        ctrl: false,
        shift: false,
        meta: false
      }; // Copied from `keypress` module

      if (input <= '\u001A' && !key.return) {
        input = String.fromCharCode(input.charCodeAt(0) + 'a'.charCodeAt(0) - 1);
        key.ctrl = true;
      }

      if (input[0] === '\u001B') {
        input = input.slice(1);
        key.meta = true;
      }

      const isLatinUppercase = input >= 'A' && input <= 'Z';
      const isCyrillicUppercase = input >= 'А' && input <= 'Я';

      if (input.length === 1 && (isLatinUppercase || isCyrillicUppercase)) {
        key.shift = true;
      }

      inputHandler(input, key);
    };

    stdin.on('data', handleData);
    return () => {
      stdin.off('data', handleData);
    };
  }, [stdin, inputHandler]);
};

exports.default = _default;