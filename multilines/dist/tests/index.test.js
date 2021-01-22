"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require("../"));
describe('multilinestring', () => {
    test('corectly compiles text with first and last line', () => __awaiter(void 0, void 0, void 0, function* () {
        const text = __1.default `First line
      | Random String
      | More random strings
      | Completely random but no weird spaces.
Last line`;
        const equivalent = `First line
Random String
More random strings
Completely random but no weird spaces.
Last line`;
        expect(text).toBe(equivalent);
    }));
    test('corectly removes first and last line when empty', () => __awaiter(void 0, void 0, void 0, function* () {
        const text = __1.default `
      | Random String
      | More random strings
      | Completely random but no weird spaces.
      `;
        const equivalent = `Random String
More random strings
Completely random but no weird spaces.`;
        expect(text).toBe(equivalent);
    }));
    test('correctly renders functions and expressions', () => __awaiter(void 0, void 0, void 0, function* () {
        const text = __1.default `
    | Random String ${5 + 5}
    | More random strings ${(() => 'hey')()}
    | Completely random but no weird spaces.
`;
        const equivalent = `Random String ${5 + 5}
More random strings ${(() => 'hey')()}
Completely random but no weird spaces.`;
        expect(text).toBe(equivalent);
    }));
    test('acknowledges the space after separator', () => __awaiter(void 0, void 0, void 0, function* () {
        const text = __1.default `
    |Random String
    | More random strings
    `;
        const equivalent = `Random String
More random strings`;
        expect(text).toBe(equivalent);
    }));
});
//# sourceMappingURL=index.test.js.map