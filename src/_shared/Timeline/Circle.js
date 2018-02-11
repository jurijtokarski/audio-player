import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

const CircleTimeline = ({ progress, onClickablePathClick }) => {
	const paths = [];

	paths.push(<path
		key="progress-path"
		d="M180 20.845 a 159.155 159.155 0 0 1 0 318.31 a 159.155 159.155 0 0 1 0 -318.31"
		fill="none"
		stroke="#fff"
		strokeWidth="3"
		strokeDasharray={`${progress * 10}, 1000`}
	/>);

	paths.push(<path
		key="full-circle-path"
		d="M180 20.845 a 159.155 159.155 0 0 1 0 318.31 a 159.155 159.155 0 0 1 0 -318.31"
		fill="none"
		stroke="#fff"
		strokeWidth="1"
		strokeDasharray="1000, 1000"
	/>);

	for (let i = 0; i < 100; i += 1) {
		paths.push(<path
			className={styles.clickablePath}
			key={`path-${i}`}
			d="M180 20.845 a 159.155 159.155 0 0 1 0 318.31 a 159.155 159.155 0 0 1 0 -318.31"
			fill="none"
			stroke="transparent"
			strokeDashoffset={-i * 10}
			strokeWidth="20"
			strokeDasharray="10, 1000"
			onClick={() => onClickablePathClick(i + 1)}
		/>);
	}

	return (
		<svg viewBox="0 0 360 360">
			{paths}
		</svg>
	);
};

CircleTimeline.propTypes = {
	progress: PropTypes.number.isRequired,
	onClickablePathClick: PropTypes.func.isRequired,
};

export default CircleTimeline;
