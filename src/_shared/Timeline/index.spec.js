import React from 'react';
import { shallow } from 'enzyme';
import { expect, spy } from 'chai';

import Timeline from './index';

describe('Timeline component', () => {
	const addEventListenerMock = spy();
	const removeEventListenerMock = spy();
	const setCurrentTimeMock = spy();

	const CircleMock = () => (<div/>);
	const LineMock = () => (<div/>);

	const instanceMock = {
		_currentTime: 0,
		get currentTime() {
			return this._currentTime;
		},
		set currentTime(newTime) {
			setCurrentTimeMock(newTime);
			this._currentTime = newTime;
		},
		duration: 200,
		addEventListener: addEventListenerMock,
		removeEventListener: removeEventListenerMock,
	};

	const props = {
		isCircle: true,
		instance: instanceMock,
	};

	before(() => {
		Timeline.__Rewire__('Circle', CircleMock);
		Timeline.__Rewire__('Line', LineMock);
	});

	beforeEach(() => {
		addEventListenerMock.reset();
		removeEventListenerMock.reset();
	});

	after(() => {
		Timeline.__ResetDependency__('Circle');
		Timeline.__ResetDependency__('Line');
	});

	it('renders circle timeline', () => {
		const component = shallow(<Timeline {... props} />);
		expect(component.find(CircleMock)).to.have.length(1);
		expect(component.find(LineMock)).to.have.length(0);
		expect(component.find(CircleMock).props()).to.have.all.keys(['progress', 'onClickablePathClick']);
		expect(component.find(CircleMock).prop('progress')).to.be.equal(0);
		expect(component.find(CircleMock).prop('onClickablePathClick')).to.be.a('function');
		component.unmount();
	});

	it('renders line timeline', () => {
		const customProps = {
			... props,
			isCircle: false,
		};
		const component = shallow(<Timeline {... customProps} />);
		expect(component.find(CircleMock)).to.have.length(0);
		expect(component.find(LineMock)).to.have.length(1);
		expect(component.find(LineMock).props()).to.have.all.keys(['progress', 'onClickablePathClick']);
		expect(component.find(LineMock).prop('progress')).to.be.equal(0);
		expect(component.find(LineMock).prop('onClickablePathClick')).to.be.a('function');
		component.unmount();
	});

	it('set new current time on clickable path click', () => {
		const component = shallow(<Timeline {... props} />);
		const callback = component.find(CircleMock).prop('onClickablePathClick');
		callback(5);
		expect(setCurrentTimeMock).to.have.been.called.once.with.exactly(10);
		setCurrentTimeMock.reset();
		callback(1);
		expect(setCurrentTimeMock).to.have.been.called.once.with.exactly(2);
		setCurrentTimeMock.reset();
		callback(96);
		expect(setCurrentTimeMock).to.have.been.called.once.with.exactly(192);
		component.unmount();
	});
});
