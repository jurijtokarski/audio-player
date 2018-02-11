import React from 'react';
import { shallow } from 'enzyme';
import { expect, spy } from 'chai';

import PlaylistView from './index';

const items = [
	{
		title: 'Tarantelle, Op. 43',
		author: 'Frédéric Chopin',
		background: '/images/1.jpg',
		track: '/tracks/chopin-tarantelle-op43.mp3',
	},
	{
		title: "Andantino 'Spring', B. 117",
		author: 'Frédéric Chopin',
		background: '/images/2.jpg',
		track: '/tracks/chopin-spring.mp3',
	},
	{
		title: 'Mazurka in D major, B. 4',
		author: 'Frédéric Chopin',
		background: '/images/3.jpg',
		track: '/tracks/chopin-mazurka-in-d-major-b4.mp3',
	},
	{
		title: 'Mazurka in D major, B. 71',
		author: 'Frédéric Chopin',
		background: '/images/4.jpg',
		track: '/tracks/chopin-mazurka-in-d-major-b71.mp3',
	},
];

describe('PlaylistView component', () => {
	const onClosePlaylistButtonClickMock = spy();
	const onStartItemButtonClickMock = spy();

	const props = {
		items,
		current: 0,
		onClosePlaylistButtonClick: onClosePlaylistButtonClickMock,
		onStartItemButtonClick: onStartItemButtonClickMock,
	};

	const stylesMock = {
		items: 'items',
		item: 'item',
		current: 'current',
		btnClose: 'close',
	};

	before(() => {
		PlaylistView.__Rewire__('styles', stylesMock);
	});

	after(() => {
		PlaylistView.__ResetDependency__('styles');
	});

	it('renders go to main view button', () => {
		const component = shallow(<PlaylistView {... props} />);
		const button = component.find('.close');

		expect(button).to.have.length(1);
		expect(button.prop('onClick')).to.be.equal(onClosePlaylistButtonClickMock);

		component.unmount();
	});

	it('renders items list', () => {
		const component = shallow(<PlaylistView {... props} />);

		expect(component.find('.items')).to.have.length(1);
		expect(component.find('.item')).to.have.length(4);
		expect(component.find('.item').at(0).is('.item.current')).to.be.equal(true);

		component.setProps({
			items: [items[1], items[2], items[0]],
			current: 2,
		});
		expect(component.find('.item')).to.have.length(3);
		expect(component.find('.item').at(2).is('.item.current')).to.be.equal(true);

		component.unmount();
	});

	it('calls onStartItemButtonClick on item click', () => {
		const component = shallow(<PlaylistView {... props} />);
		const items = component.find('.item');

		expect(onStartItemButtonClickMock).not.to.have.been.called();

		items.at(0).simulate('click');
		expect(onStartItemButtonClickMock).to.have.been.called.once.with.exactly(0);

		items.at(2).simulate('click');
		expect(onStartItemButtonClickMock).to.have.been.called.twice.with.exactly(2);

		items.at(1).simulate('click');
		expect(onStartItemButtonClickMock).to.have.been.called.exactly(3).with.exactly(1);

		component.unmount();
	});
});
