/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';

export default class FlexBox extends Component {
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.view1}></View>
				<View style={styles.view2}></View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	view1: {
		height: 200,
		width: 200,
		backgroundColor: 'red'
	},
	view2: {
		height: 200,
		width: 200,
		backgroundColor: 'green'
	}
});

AppRegistry.registerComponent('FlexBox', () => FlexBox);
