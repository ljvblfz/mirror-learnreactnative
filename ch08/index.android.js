/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry} from 'react-native';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import reducers from './reducers';
import App from './app';

class ch08 extends Component {
	constructor() {
		super();
		this.state = {
			store: createStore(reducers)
		};
	}

	render() {
		return (
			<Provider store={this.state.store}>
				<App></App>
			</Provider>
		);
	}
}

AppRegistry.registerComponent('ch08', () => ch08);
