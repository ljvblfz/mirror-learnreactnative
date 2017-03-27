import React, {Component} from 'react';
import {TabBarIOS} from 'react-native';

import Home from './home';
import More from './more';

export default class main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 'home'
		}
	}

	render() {
		return (
			<TabBarIOS unselectedTintColor="gray" // 未选中标签的颜色
	tintColor="white" // 选中的标签的颜色
	barTintColor="orange">
				<TabBarIOS.Item title="首页" icon={require('./images/icon-home.png')} // 图标
					selected={this.state.selectedTab === 'home'} onPress={() => {
					this.setState({selectedTab: 'home'});
				}}>
					<Home navigator={this.props.navigator}></Home>
				</TabBarIOS.Item>
				<TabBarIOS.Item systemIcon="more" // 使用React Native系统图标
					badge={2} // 提醒的数量
					selected={this.state.selectedTab === 'more'} onPress={() => {
					this.setState({selectedTab: 'more'});
				}}>
					<More navigator={this.props.navigator}></More>
				</TabBarIOS.Item>
			</TabBarIOS>
		);
	}
}
