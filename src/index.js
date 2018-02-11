import React from 'react';
import { render } from 'react-dom';

import Player from './Player';

class Wrapper {
	constructor(options) {
		if (!options.targetId) {
			throw new Error("'target' is not provided");
		}

		if (!options.items) {
			throw new Error("'items' is not provided");
		}

		this._target = options.targetId;
		this._items = options.items;
	}

	render() {
		render(<Player items={this._items} />, document.getElementById(this._target));
	}
}

window.Player = Wrapper;
