import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

const getValueFilledWithZeros = (value) => {
	if (value.length === 2) {
		return value;
	}

	if (value.length === 1) {
		return `0${value}`;
	}

	return '00';
};

const getParsedCurrentTime = (currentTime) => {
	if (!currentTime) {
		return '--:--';
	}

	const minutes = getValueFilledWithZeros((Math.floor(currentTime / 60).toFixed(0)));
	const seconds = getValueFilledWithZeros((currentTime - (minutes * 60)).toFixed(0));

	return `${minutes}:${seconds}`;
};

const removeTimeupdateEventListener = (instance) => {
	instance.removeEventListener('timeupdate', () => {
	});
};

export default class Timer extends PureComponent {
	static get propTypes() {
		return {
			instance: PropTypes.instanceOf(Audio).isRequired,
		};
	}

	constructor(props) {
		super(props);
		autoBind(this);

		this.state = {
			currentTime: this.props.instance.currentTime,
		};

		this._isMounted = false;
	}

	componentDidMount() {
		this._isMounted = true;
		this._addTimeupdateEventListener(this.props.instance);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.instance === nextProps.instance) {
			return;
		}

		this.setState({
			currentTime: nextProps.instance.currentTime,
		});

		removeTimeupdateEventListener(this.props.instance);
		this._addTimeupdateEventListener(nextProps.instance);
	}

	componentWillUnmount() {
		this._isMounted = false;
		removeTimeupdateEventListener(this.props.instance);
	}

	_handleTimeUpdate(instance) {
		if (!this._isMounted) {
			return;
		}

		this.setState({
			currentTime: instance.currentTime,
		});
	}

	_addTimeupdateEventListener(instance) {
		instance.addEventListener('timeupdate', () => this._handleTimeUpdate(instance));
	}

	render() {
		const parsedString = getParsedCurrentTime(this.state.currentTime);
		return (<div>{parsedString}</div>);
	}
}
