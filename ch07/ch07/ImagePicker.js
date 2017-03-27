import React, {Component} from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	Platform
} from 'react-native';
import {NativeModules} from 'react-native';

export default class ImagePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			avatarSource: null
		};
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this._selectPhotoTapped}>
					<View style={[styles.avatarContainer, styles.avatar]}>
						{this.state.avatarSource === null
							? <Text style={styles.text}>选择图片</Text>
							: <Image style={styles.avatar} source={this.state.avatarSource}/>
}
					</View>
				</TouchableOpacity>
			</View>
		);
	}

	_selectPhotoTapped = () => {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500
		};

		NativeModules.ImagePicker.launchImageLibrary(options, (response) => {
			if (response.didCancel) {
				console.log('取消选择图片');
			} else if (response.error) {
				console.log('选择图片错误: ', response.error);
			} else {
				let source;
				if (Platform.OS === 'ios') {
					source = {
						uri: response.uri.replace('file://', '')
					};
				} else if (Platform.OS === 'android') {
					source = {
						uri: response.uri
					};
				}
				this.setState({avatarSource: source});
			}
		});
	}
}

const styles = StyleSheet.create({
	container: {
		alignSelf: 'center',
		flexDirection: 'row'
	},
	avatarContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: 'lightgray',
		borderWidth: 2
	},
	avatar: {
		width: 200,
		height: 200,
		borderRadius: 100
	},
	text: {
		fontSize: 30
	}
});
