import React, {Component} from 'react';
import {StyleSheet, View, Text, Button, PermissionsAndroid} from 'react-native';

export default class more extends Component {
	constructor(props) {
		super(props);
		this.state = {
			permission: PermissionsAndroid.PERMISSIONS.CAMERA,
			hasPermission: 'Not Checked'
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>权限状态: {this.state.hasPermission}</Text>
				<Button title='申请摄像头权限' onPress={this._requestCameraPermission}></Button>
			</View>
		);
	}

	_requestCameraPermission = async() => {
		let result = await PermissionsAndroid.request(this.state.permission, {
			title: '权限申请',
			message: '申请摄像头权限'
		});

		this.setState({hasPermission: result});
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		fontSize: 30
	}
});
