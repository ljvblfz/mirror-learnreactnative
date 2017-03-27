/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';
import codePush from 'react-native-code-push';

export default class CodePush extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: ''
		}
	}

	componentDidMount() {
		codePush.checkForUpdate().then((update) => {
			if (!update) {
				this.setState({message: '已经是最新版本'});
			} else {
				this.setState({message: '有更新'});
			}
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					版本号 1.1
				</Text>
				<Text style={styles.instructions}>
					{this.state.message}
				</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF'
	},
	welcome: {
		fontSize: 30,
		textAlign: 'center',
		margin: 10
	},
	instructions: {
		fontSize: 30,
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5
	}
});

AppRegistry.registerComponent('CodePush', () => codePush(CodePush));
