import React, {Component} from 'react';
import {StyleSheet, View, Text, Slider} from 'react-native';

export default class more extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sliderValue: 5
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Slider minimumValue={0} // 最小值
					style={{
					width: 200
				}} step={1} // 步长，在minimumValue和maximumValue之间
					maximumTrackTintColor='red' // Slider滑道右侧的颜色
					minimumTrackTintColor='blue' // Slider滑道左侧的颜色
					maximumValue={10} // 最大值
					value={this.state.sliderValue} // Slider滑块的初始位置
					onValueChange={(value) => this.setState({sliderValue: value})}/>
				<Text>Slider值: {this.state.sliderValue}</Text>
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
