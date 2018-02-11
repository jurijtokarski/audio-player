import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';
import Icon from '../../_shared/Icon/index';

const Playlist = (props) => {
	const {
		items, current, onClosePlaylistButtonClick, onStartItemButtonClick,
	} = props;

	const itemsList = items.map((item, i) => {
		const classNames = `${styles.item} ${(i === current ? styles.current : '')}`;

		return (
			<button
				className={classNames}
				key={`track-${item.track}`}
				onClick={() => onStartItemButtonClick(i)}
			>
				<strong>{item.title}</strong>
				<br />
				{item.author}
			</button>
		);
	});

	return (
		<div className={styles.root}>
			<div>
				<button
					onClick={onClosePlaylistButtonClick}
					className={styles.btnClose}
				>
					<Icon name="close" />
				</button>
			</div>
			<div className={styles.items}>{itemsList}</div>
		</div>
	);
};

Playlist.propTypes = {
	current: PropTypes.number.isRequired,
	onStartItemButtonClick: PropTypes.func.isRequired,
	onClosePlaylistButtonClick: PropTypes.func.isRequired,
	items: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string,
		author: PropTypes.string,
		background: PropTypes.string,
		track: PropTypes.string,
	})).isRequired,
};

export default Playlist;
