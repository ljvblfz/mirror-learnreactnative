import React, {Component} from 'react';
import {StyleSheet, View, Image, Animated, Easing} from 'react-native';

export default class Animation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: parseInt(this.props.width),
			height: parseInt(this.props.height),
			bounceValue: new Animated.Value(0),
			rotateValue: new Animated.Value(0)
		}
	}

	render() {
		return (
			<Animated.View style={[
				styles.animation, {
					width: this.state.width,
					height: this.state.height,
					transform: [
						{
							scale: this.state.bounceValue
						}, {
							rotate: this.state.rotateValue.interpolate({
								inputRange: [
									0, 1
								],
								outputRange: ['0deg', '360deg']
							})
						}
					]
				}
			]}>
				<Image source={require('./images/product-image-01.jpg')} style={{
					width: this.state.width,
					height: this.state.height
				}}></Image>
			</Animated.View>
		);
	}

	componentDidMount() {
		this._startAnimation();
	}

	_startAnimation = () => {
		Animated.parallel([
			Animated.spring(this.state.bounceValue, {toValue: 1}),
			Animated.timing(this.state.rotateValue, {
				toValue: 1,
				duration: 800, // 持续时间，默认为500
				easing: Easing.out(Easing.quad), // 渐变函数
			})
		]).start();
	}
}

const styles = StyleSheet.create({
	animation: {
		backgroundColor: 'red'
	}
});
