/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, Button} from 'react-native';

import {connect} from 'react-redux';

import reducers from './reducers';
import {setLightTheme, setDarkTheme} from './actions/theme';

class app extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.theme}>
					当前主题: {this.props.theme.themeState}
				</Text>
				<Button title='设置light主题' onPress={this.props.onLightThemeClick}></Button>
				<Button title='设置dark主题' onPress={this.props.onDarkThemeClick}></Button>
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
	theme: {
		fontSize: 30,
		textAlign: 'center',
		margin: 10
	}
});

const mapStateToProps = (state) => {
	return {theme: state.theme}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onLightThemeClick: () => dispatch(setLightTheme()),
		onDarkThemeClick: () => dispatch(setDarkTheme())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(app);
