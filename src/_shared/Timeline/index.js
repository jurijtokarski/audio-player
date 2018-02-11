import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import styles from './styles.css';
import Circle from './Circle';
import Line from './Line';

const getPercentageCurrentTime = (currentTime, duration) => {
	const _duration = duration || 1; // fix for NaN value
	return Math.round((currentTime / _duration) * 100);
};

const removeTimeudpateListener = (instance) => {
	instance.removeEventListener('timeupdate', () => {});
};

export default class Timeline extends PureComponent {
	static get propTypes() {
		return {
			isCircle: PropTypes.bool.isRequired,
			instance: PropTypes.instanceOf(Audio).isRequired,
		};
	}

	constructor(props) {
		super(props);
		autoBind(this);

		const { instance } = this.props;

		this.state = {
			currentPercentage: getPercentageCurrentTime(instance.currentTime, instance.duration),
		};

		this._isMounted = false;
	}

	componentDidMount() {
		this._isMounted = true;
		this._addTimeudpateListener(this.props.instance);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.instance === nextProps.instance) {
			return;
		}

		const { instance: nextInstance } = nextProps;

		this.setState({
			currentPercentage: getPercentageCurrentTime(nextInstance.currentTime, nextInstance.duration),
		});

		removeTimeudpateListener(this.props.instance);
		this._addTimeudpateListener(nextInstance);
	}

	componentWillUnmount() {
		this._isMounted = false;
		removeTimeudpateListener(this.props.instance);
	}

	_getNewCurrentTime(percent) {
		return Math.ceil(((percent / 100) * this.props.instance.duration));
	}

	_handleTimeUpdate(instance) {
		if (!this._isMounted) {
			return;
		}

		this.setState({
			currentPercentage: getPercentageCurrentTime(instance.currentTime, instance.duration),
		});
	}

	handleClickablePathClick(percent) {
		this.props.instance.currentTime = this._getNewCurrentTime(percent);
	}

	_addTimeudpateListener(instance) {
		instance.addEventListener('timeupdate', () => this._handleTimeUpdate(instance));
	}

	render() {
		const { isCircle } = this.props;

		const timelineProps = {
			progress: this.state.currentPercentage,
			onClickablePathClick: this.handleClickablePathClick,
		};

		const view = isCircle ? <Circle {... timelineProps} /> : <Line {... timelineProps} />;

		return (
			<div className={styles.root}>
				{view}
			</div>
		);
	}
}
