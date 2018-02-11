import React from 'react';
import { shallow } from 'enzyme';
import { expect, spy } from 'chai';

import Timer from './index';

describe('Timer component', () => {
	const addEventListenerMock = spy();
	const removeEventListenerMock = spy();

	const instanceMock = {
		currentTime: 0,
		addEventListener: addEventListenerMock,
		removeEventListener: removeEventListenerMock,
	};

	const props = {
		instance: instanceMock,
	};

	beforeEach(() => {
		addEventListenerMock.reset();
		removeEventListenerMock.reset();
	});

	it('renders timer string properly', () => {
		const component = shallow(<Timer {... props} />);

		expect(component.text()).to.equal('--:--');

		component.setProps({
			instance: {
				... instanceMock,
				currentTime: 59,
			},
		});

		expect(component.text()).to.equal('00:59');

		component.setProps({
			instance: {
				... instanceMock,
				currentTime: 60,
			},
		});

		expect(component.text()).to.equal('01:00');

		component.setProps({
			instance: {
				... instanceMock,
				currentTime: 61,
			},
		});

		expect(component.text()).to.equal('01:01');

		component.setProps({
			instance: {
				... instanceMock,
				currentTime: 123,
			},
		});

		expect(component.text()).to.equal('02:03');

		component.unmount();
	});

	it('adds and removes event listener', () => {
		const component = shallow(<Timer {... props} />);

		expect(addEventListenerMock).to.have.been.called.exactly(1);
		expect(removeEventListenerMock).not.to.have.been.called();

		addEventListenerMock.reset();

		component.setProps({
			instance: {
				... instanceMock,
				currentTime: 123,
			},
		});

		expect(removeEventListenerMock).to.have.been.called.exactly(1);
		expect(addEventListenerMock).to.have.been.called.exactly(1);

		component.unmount();
	});
});
