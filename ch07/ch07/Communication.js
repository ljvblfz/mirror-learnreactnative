import React, {Component} from 'react';
import {StyleSheet, View, Button, Alert, Platform} from 'react-native';
import {NativeModules} from 'react-native';

export default class Communication extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Button title='调用原生组件' onPress={() => {
					if (Platform.OS === 'ios') {
						NativeModules.Communication.presentViewControllerFromReactNative('12345');
					} else if (Platform.OS === 'android') {
						NativeModules.Communication.startActivityFromReactNative('com.ch07.CommunicationActivity1', '12345');
					}
				}}/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		alignSelf: 'center',
		flexDirection: 'row'
	}
});
