import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Platform,
	TextInput,
	Button,
	ScrollView,
	Dimensions,
	ListView,
	Alert,
	TouchableHighlight,
	StatusBar
} from 'react-native';

export default class app extends Component {
	constructor(props) {
		super(props);
		const ds = new ListView.DataSource({ // 创建ListView.DataSource数据源
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.state = {
			currentPage: 0,
			dataSource: ds.cloneWithRows([ // 为数据源传递一个数组
				'商品1',
				'商品2',
				'商品3',
				'商品4',
				'商品5',
				'商品6',
				'商品7',
				'商品8',
				'商品8',
				'商品10'
			])
		};
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar backgroundColor={'blue'} // 设置背景色为蓝色
					barStyle={'default'} // 设置默认样式
					networkActivityIndicatorVisible={true} // 显示正在请求网络的状态
				></StatusBar>
				<View style={styles.searchbar}>
					<TextInput style={styles.input} placeholder='搜索商品'></TextInput>
					<Button
						style={styles.button}
						title='搜索'
						onPress={() => Alert.alert('你点击了搜索按钮', null, null)}></Button>
				</View>
				<View style={styles.advertisement}>
					<ScrollView ref="scrollView" // 可以使用this.refs.scrollView来获取该组件
						horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true}>
						<TouchableHighlight onPress={() => Alert.alert('你点击了轮播图', null, null)}>
							<Text
								style={{
								width: Dimensions.get('window').width,
								height: 180,
								backgroundColor: 'gray'
							}}>广告1</Text>
						</TouchableHighlight>
						<TouchableHighlight onPress={() => Alert.alert('你点击了轮播图', null, null)}>
							<Text
								style={{
								width: Dimensions.get('window').width,
								height: 180,
								backgroundColor: 'orange'
							}}>广告2</Text>
						</TouchableHighlight>
						<TouchableHighlight onPress={() => Alert.alert('你点击了轮播图', null, null)}>
							<Text
								style={{
								width: Dimensions.get('window').width,
								height: 180,
								backgroundColor: 'yellow'
							}}>广告3</Text>
						</TouchableHighlight>
					</ScrollView>
				</View>
				<View style={styles.products}>
					<ListView dataSource={this.state.dataSource} renderRow={this._renderRow}/>
				</View>
			</View>
		);
	}

	componentDidMount() {
		this._startTimer();
	}

	_startTimer() {
		this.interval = setInterval(() => { // 使用setInterval创建定时器
			nextPage = this.state.currentPage + 1;
			if (nextPage >= 3) {
				nextPage = 0;
			}

			this.setState({currentPage: nextPage});

			const offSetX = nextPage * Dimensions.get('window').width;
			this.refs.scrollView.scrollResponderScrollTo({x: offSetX, y: 0, animated: true});
		}, 2000); // 设置定时器的间隔为2s
	}

	_renderRow(rowData, sectionID, rowID) {
		return (
			<TouchableHighlight onPress={() => Alert.alert('你点击了商品列表', null, null)}>
				<View style={styles.row}>
					<Text>{rowData}</Text>
				</View>
			</TouchableHighlight>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	searchbar: {
		marginTop: Platform.OS === 'ios'
			? 20
			: 0,
		height: 40,
		flexDirection: 'row'
	},
	input: {
		flex: 1,
		borderColor: 'gray',
		borderWidth: 1
	},
	button: {
		flex: 1
	},
	advertisement: {
		height: 180
	},
	products: {
		flex: 1
	},
	row: {
		height: 60,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
