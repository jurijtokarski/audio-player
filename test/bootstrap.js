import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import jsdom from "jsdom-global";
import chai from "chai";
import chaiSpies from "chai-spies";
import mockery from "mockery";
import { addPath } from "app-module-path";

process.env.NODE_ENV = "test";

addPath(__dirname);

jsdom();

chai.use(chaiSpies);

Enzyme.configure({
	adapter: new Adapter()
});

global.Audio = {};
global.Image = {};

mockery.enable({
	warnOnReplace: false,
	warnOnUnregistered: false,
});
