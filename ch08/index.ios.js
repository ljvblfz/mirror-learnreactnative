/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry} from 'react-native';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';

import reducers from './reducers';
import App from './app';

const logger = store => next => action => {
	console.log('dispatching', action);
	let result = next(action);
	return result;
}
let middlewares = [logger];
let createAppStore = applyMiddleware(...middlewares)(createStore);

class ch08 extends Component {
	constructor() {
		super();
		this.state = {
			store: createAppStore(reducers)
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
