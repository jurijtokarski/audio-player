import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

const LineTimeline = ({ progress, onClickablePathClick }) => {
	const paths = [];

	paths.push(<path
		key="progress-path"
		d="M0 4 360 4"
		stroke="#fff"
		strokeWidth="3"
		strokeDasharray={`${progress * 3.6}, 360`}
		fill="transparent"
	/>);

	paths.push(<path
		key="full-path"
		d="M0 4 360 4"
		stroke="#fff"
		strokeWidth="1"
		strokeDasharray="360, 360"
		fill="transparent"
	/>);

	for (let i = 0; i < 100; i += 1) {
		paths.push(<path
			className={styles.clickablePath}
			key={`path-${i}`}
			d="M0 4 360 4"
			stroke="transparent"
			strokeWidth="10"
			strokeDasharray="18, 360"
			fill="transparent"
			strokeDashoffset={-i * 3.6}
			onClick={() => onClickablePathClick(i + 1)}
		/>);
	}

	return (
		<svg viewBox="0 0 360 10">
			{paths}
		</svg>
	);
};

LineTimeline.propTypes = {
	progress: PropTypes.number.isRequired,
	onClickablePathClick: PropTypes.func.isRequired,
};

export default LineTimeline;
