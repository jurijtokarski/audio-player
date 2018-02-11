import React from 'react';
import { shallow } from 'enzyme';
import { expect, spy } from 'chai';

import Player from './index';

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

const pauseMock = spy('Audio.pause');
const playMock = spy('Audio.play');
const addEventListenerMock = spy('Audio.addEventListener');
const removeEventListenerMock = spy('Audio.removeEventListener');
const imageSetSrcMock = spy('Image.setSrc');

const ImageMock = spy(function () {
	Object.defineProperty(this, 'src', {
		get: imageSetSrcMock,
		set: imageSetSrcMock,
	});
});

const AudioMock = spy(function () {
	this.paused = true;

	this.play = function () {
		this.paused = false;
		playMock();
	};

	this.pause = function () {
		this.paused = true;
		pauseMock();
	};

	this.addEventListener = function () {
		addEventListenerMock();
	};

	this.removeEventListener = function () {
		removeEventListenerMock();
	};
});

describe('Player component', () => {
	const originalAudio = window.Audio;
	const originalImage = window.Image;
	const props = { items };

	const MainMock = () => (<div>Main</div>);
	const PlaylistMock = () => (<div>Playlist</div>);

	before(() => {
		Player.__Rewire__('MainView', MainMock);
		Player.__Rewire__('PlaylistView', PlaylistMock);
		global.Audio = AudioMock;
		global.Image = ImageMock;
	});

	after(() => {
		Player.__ResetDependency__('MainView');
		Player.__ResetDependency__('PlaylistView');
		global.Audio = originalAudio;
		global.Image = originalImage;
	});

	afterEach(() => {
		AudioMock.reset();
		playMock.reset();
		pauseMock.reset();
	});

	it('renders Main view on start', () => {
		const component = shallow(<Player {... props} />);
		const main = component.find(MainMock);

		expect(main).to.have.length(1);
		expect(main.props()).to.have.all.keys([
			'title',
			'author',
			'instance',
			'onStartPrevItemButtonClick',
			'onStartNextItemButtonClick',
			'onPlayPauseButtonClick',
			'onOpenPlaylistButtonClick',
		]);
		expect(main.prop('title')).to.be.equal(items[0].title);
		expect(main.prop('author')).to.be.equal(items[0].author);
		expect(main.prop('instance') instanceof AudioMock).to.be.equal(true);
		expect(main.prop('onStartPrevItemButtonClick')).to.be.a('function');
		expect(main.prop('onStartNextItemButtonClick')).to.be.a('function');
		expect(main.prop('onPlayPauseButtonClick')).to.be.a('function');
		expect(main.prop('onOpenPlaylistButtonClick')).to.be.a('function');

		component.unmount();
	});

	it('set next item on start next item button click', () => {
		const component = shallow(<Player {... props} />);

		let main = component.find(MainMock);

		expect(main.prop('title')).to.be.equal(items[0].title);
		expect(main.prop('author')).to.be.equal(items[0].author);

		main.prop('onStartNextItemButtonClick')();
		component.update();

		main = component.find(MainMock);

		expect(main.prop('title')).to.be.equal(items[1].title);
		expect(main.prop('author')).to.be.equal(items[1].author);

		main.prop('onStartNextItemButtonClick')();
		component.update();

		main = component.find(MainMock);

		expect(main.prop('title')).to.be.equal(items[2].title);
		expect(main.prop('author')).to.be.equal(items[2].author);

		main.prop('onStartNextItemButtonClick')();
		component.update();

		main = component.find(MainMock);

		expect(main.prop('title')).to.be.equal(items[3].title);
		expect(main.prop('author')).to.be.equal(items[3].author);

		component.unmount();
	});

	it('set prev item on start prev item button click', () => {
		const component = shallow(<Player {... props} />);

		let main = component.find(MainMock);

		expect(main.prop('title')).to.be.equal(items[0].title);
		expect(main.prop('author')).to.be.equal(items[0].author);

		main.prop('onStartPrevItemButtonClick')();
		component.update();

		main = component.find(MainMock);

		expect(main.prop('title')).to.be.equal(items[3].title);
		expect(main.prop('author')).to.be.equal(items[3].author);

		main.prop('onStartPrevItemButtonClick')();
		component.update();

		main = component.find(MainMock);

		expect(main.prop('title')).to.be.equal(items[2].title);
		expect(main.prop('author')).to.be.equal(items[2].author);

		main.prop('onStartPrevItemButtonClick')();
		component.update();

		main = component.find(MainMock);

		expect(main.prop('title')).to.be.equal(items[1].title);
		expect(main.prop('author')).to.be.equal(items[1].author);

		component.unmount();
	});

	it('renders Playlist view on callback click', () => {
		const component = shallow(<Player {... props} />);

		let main = component.find(MainMock);
		let playlist = component.find(PlaylistMock);

		expect(main).to.have.length(1);
		expect(playlist).to.have.length(0);

		main.prop('onOpenPlaylistButtonClick')();
		component.update();

		main = component.find(MainMock);
		playlist = component.find(PlaylistMock);

		expect(main).to.have.length(0);

		expect(playlist).to.have.length(1);
		expect(playlist.props()).to.have.all.keys([
			'items',
			'current',
			'instance',
			'onClosePlaylistButtonClick',
			'onStartItemButtonClick',
		]);
		expect(playlist.prop('items')).to.be.equal(items);
		expect(playlist.prop('current')).to.be.equal(0);
		expect(playlist.prop('instance') instanceof AudioMock).to.be.equal(true);
		expect(playlist.prop('onClosePlaylistButtonClick')).to.be.a('function');
		expect(playlist.prop('onStartItemButtonClick')).to.be.a('function');

		component.unmount();
	});

	it('renders Main view on close playlist button click', () => {
		const component = shallow(<Player {... props} />);

		let main = component.find(MainMock);
		let playlist = component.find(PlaylistMock);

		expect(main).to.have.length(1);
		expect(playlist).to.have.length(0);

		main.prop('onOpenPlaylistButtonClick')();
		component.update();

		main = component.find(MainMock);
		playlist = component.find(PlaylistMock);

		expect(main).to.have.length(0);
		expect(playlist).to.have.length(1);

		playlist.prop('onClosePlaylistButtonClick')();
		component.update();

		main = component.find(MainMock);
		playlist = component.find(PlaylistMock);

		expect(main).to.have.length(1);
		expect(playlist).to.have.length(0);

		component.unmount();
	});

	it('set item on start item button click', () => {
		const component = shallow(<Player {... props} />);

		// Enter to playlist mode
		const main = component.find(MainMock);
		main.prop('onOpenPlaylistButtonClick')();
		component.update();

		let playlist = component.find(PlaylistMock);
		expect(playlist.prop('current')).to.be.equal(0);

		playlist.prop('onStartItemButtonClick')(2);
		component.update();

		playlist = component.find(PlaylistMock);

		expect(playlist.prop('current')).to.be.equal(2);

		playlist.prop('onStartItemButtonClick')(1);
		component.update();

		playlist = component.find(PlaylistMock);

		expect(playlist.prop('current')).to.be.equal(1);

		playlist.prop('onStartItemButtonClick')(3);
		component.update();

		playlist = component.find(PlaylistMock);

		expect(playlist.prop('current')).to.be.equal(3);

		component.unmount();
	});

	it('set play/pause mode on play/pause button click', () => {
		const component = shallow(<Player {... props} />);
		const main = component.find(MainMock);
		const callback = main.prop('onPlayPauseButtonClick');

		expect(pauseMock).not.to.have.been.called();
		expect(playMock).not.to.have.been.called();

		callback();

		expect(playMock).to.have.been.called.once.with.exactly();
		expect(pauseMock).not.to.have.been.called();
		playMock.reset();

		callback();

		expect(playMock).not.to.have.been.called();
		expect(pauseMock).to.have.been.called.once.with.exactly();
		pauseMock.reset();

		callback();

		expect(playMock).to.have.been.called.once.with.exactly();
		expect(pauseMock).not.to.have.been.called();

		component.unmount();
	});

	it('initialize audio instances on start', () => {
		const component = shallow(<Player {... props} />);

		expect(AudioMock).to.have.been.called.with.exactly('/tracks/chopin-tarantelle-op43.mp3');
		expect(AudioMock).to.have.been.called.with.exactly('/tracks/chopin-spring.mp3');
		expect(AudioMock).to.have.been.called.with.exactly('/tracks/chopin-mazurka-in-d-major-b4.mp3');
		expect(AudioMock).to.have.been.called.with.exactly('/tracks/chopin-mazurka-in-d-major-b71.mp3');

		component.unmount();
	});

	it('prefetches images on start', () => {
		const component = shallow(<Player {... props} />);

		expect(imageSetSrcMock).to.have.been.called.with.exactly('/images/1.jpg');
		expect(imageSetSrcMock).to.have.been.called.with.exactly('/images/2.jpg');
		expect(imageSetSrcMock).to.have.been.called.with.exactly('/images/3.jpg');
		expect(imageSetSrcMock).to.have.been.called.with.exactly('/images/4.jpg');

		component.unmount();
	});
});
