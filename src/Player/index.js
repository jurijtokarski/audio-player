import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import styles from './styles.css';
import MainView from './MainView';
import PlaylistView from './PlaylistView';
import Timeline from '../_shared/Timeline';

export default class Player extends PureComponent {
	static get propTypes() {
		return {
			items: PropTypes.arrayOf(PropTypes.shape({
				title: PropTypes.string,
				author: PropTypes.string,
				background: PropTypes.string,
				track: PropTypes.string,
			})).isRequired,
		};
	}

	constructor(props) {
		super(props);
		autoBind(this);

		this._items = props.items;
		this._last = props.items.length - 1;

		this.state = {
			current: 0,
			isMainView: true,
		};

		this._instances = this._initAudioInstances();
	}

	componentDidMount() {
		this._prefetchImages();
	}

	_prefetchImages() {
		this._items.forEach((item) => {
			new Image().src = item.background;
		});
	}

	_initAudioInstances() {
		return this._items.reduce((result, value, index) => ({
			... result,
			[`item_${index}`]: this._initAudioInstance(value.track),
		}), {});
	}

	_initAudioInstance(url) {
		const instance = new Audio(url);
		instance.addEventListener('ended', () => this.handleStartNextItemButtonClick());
		return instance;
	}

	_getCurrentItem() {
		const itemConfig = this._items[this.state.current];
		const itemInstance = this._instances[`item_${this.state.current}`];

		return {
			... itemConfig,
			instance: itemInstance,
		};
	}

	_toggleCurrentTrack() {
		const item = this._getCurrentItem();

		if (item.instance.paused) {
			return item.instance.play();
		}

		return item.instance.pause();
	}

	_toggleMainView() {
		this.setState({
			isMainView: !this.state.isMainView,
		});
	}

	_setItem(index) {
		// Stop current track
		const current = this._getCurrentItem();
		current.instance.currentTime = 0;
		current.instance.pause();

		// Set and start new current track
		this.setState({
			current: index,
		}, () => this._toggleCurrentTrack());
	}

	_getPrevItemIndex() {
		return this.state.current === 0 ? this._last : this.state.current - 1;
	}

	_getNextItemIndex() {
		return this.state.current === this._last ? 0 : this.state.current + 1;
	}

	handleOpenPlaylistButtonClick() {
		this._toggleMainView();
	}

	handleClosePlaylistButtonClick() {
		this._toggleMainView();
	}

	handleStartPrevItemButtonClick() {
		const prevItem = this._getPrevItemIndex();
		this._setItem(prevItem);
	}

	handleStartNextItemButtonClick() {
		const nextItem = this._getNextItemIndex();
		this._setItem(nextItem);
	}

	handleStartItemButtonClick(index) {
		this._setItem(index);
	}

	handlePlayPauseButtonClick() {
		this._toggleCurrentTrack();
	}

	renderView(item) {
		if (this.state.isMainView) {
			return (
				<MainView
					title={item.title}
					author={item.author}
					instance={item.instance}
					onOpenPlaylistButtonClick={this.handleOpenPlaylistButtonClick}
					onStartPrevItemButtonClick={this.handleStartPrevItemButtonClick}
					onStartNextItemButtonClick={this.handleStartNextItemButtonClick}
					onPlayPauseButtonClick={this.handlePlayPauseButtonClick}
				/>
			);
		}

		return (
			<PlaylistView
				items={this._items}
				current={this.state.current}
				instance={item.instance}
				onClosePlaylistButtonClick={this.handleClosePlaylistButtonClick}
				onStartItemButtonClick={this.handleStartItemButtonClick}
			/>
		);
	}

	render() {
		const { isMainView } = this.state;

		const item = this._getCurrentItem();
		const view = this.renderView(item);
		const containerClassNames = `${styles.container} ${isMainView ? styles.mainView : styles.playlistView}`;

		return (
			<div className={styles.root} style={{ background: `url('${item.background}')` }}>
				<div className={containerClassNames}>
					<Timeline isCircle={isMainView} instance={item.instance} />
					<div className={styles.content}>{view}</div>
				</div>
			</div>
		);
	}
}
