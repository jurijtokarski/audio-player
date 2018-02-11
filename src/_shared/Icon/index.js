import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

const Icon = ({ name }) => (
	<svg className={styles.icon}>
		<use xlinkHref={`sprite.svg#${name}`} />
	</svg>
);

Icon.propTypes = {
	name: PropTypes.string.isRequired,
};

export default Icon;
