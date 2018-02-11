import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';
import Timer from './Timer/index';
import Icon from '../../_shared/Icon/index';

const Main = (props) => {
	const {
		title, instance, author,
		onOpenPlaylistButtonClick, onStartPrevItemButtonClick,
		onStartNextItemButtonClick, onPlayPauseButtonClick,
	} = props;

	return (
		<div className={styles.root}>
			<div className={styles.content}>
				<div className={styles.timer}>
					<Timer instance={instance} />
				</div>
				<div className={styles.title}>{title}</div>
				<div className={styles.author}>{author}</div>
				<button
					className={styles.btnOpenPlaylist}
					onClick={onOpenPlaylistButtonClick}
				>
					<Icon name="playlist" />
				</button>
				<button
					className={styles.btnStartPrevItem}
					onClick={onStartPrevItemButtonClick}
				>
					<Icon name="prev" />
				</button>
				<button
					className={styles.btnStartNextItem}
					onClick={onStartNextItemButtonClick}
				>
					<Icon name="next" />
				</button>
				<button
					className={styles.btnPlayPause}
					onClick={onPlayPauseButtonClick}
				>
					<Icon name="playpause" />
				</button>
			</div>
		</div>
	);
};

Main.propTypes = {
	title: PropTypes.string.isRequired,
	author: PropTypes.string.isRequired,
	instance: PropTypes.instanceOf(Audio).isRequired,
	onOpenPlaylistButtonClick: PropTypes.func.isRequired,
	onStartPrevItemButtonClick: PropTypes.func.isRequired,
	onStartNextItemButtonClick: PropTypes.func.isRequired,
	onPlayPauseButtonClick: PropTypes.func.isRequired,
};

export default Main;
