import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import ImagePicker from './ImagePicker';

export default class more extends Component {
	render() {
		return (
			<View style={styles.container}>
				<ImagePicker/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
