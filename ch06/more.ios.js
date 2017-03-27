import React, {Component} from 'react';
import {StyleSheet, View, Text, NetInfo} from 'react-native';

export default class more extends Component {
	constructor(props) {
		super(props);
		this.state = {
			connectionInfo: ''
		}
	}

	componentDidMount() {
		NetInfo.addEventListener('change', this._handleConnectionInfoChange);
		NetInfo.fetch().done((connectionInfo) => {
			this.setState({connectionInfo});
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>当前联网类型: {this.state.connectionInfo}</Text>
			</View>
		);
	}

	componentWillUnmount() {
		NetInfo.removeEventListener('change', this._handleConnectionInfoChange);
	}

	_handleConnectionInfoChange = (connectionInfo) => {
		this.setState({connectionInfo});
	}
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
