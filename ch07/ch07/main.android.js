import React, {Component} from 'react';
import {StyleSheet, View, Text, ViewPagerAndroid} from 'react-native';

import Home from './home';
import More from './more';

export default class main extends React.Component {
	render() {
		return (
			<ViewPagerAndroid style={styles.viewPager} initialPage={0}>
				<View style={styles.pageStyle}>
					<Home navigator={this.props.navigator}></Home>
				</View>
				<View style={styles.pageStyle}>
					<More navigator={this.props.navigator}></More>
				</View>
			</ViewPagerAndroid>
		);
	}
}

const styles = StyleSheet.create({
	viewPager: {
		flex: 1
	}
})
