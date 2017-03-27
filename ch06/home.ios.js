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
	ListView,
	AlertIOS,
	TouchableHighlight,
	StatusBar,
	Image,
	RefreshControl,
	AppState
} from 'react-native';

import Detail from './detail';
import Screen from './Screen';

const circleSize = 8;
const circleMargin = 5;

const ds = new ListView.DataSource({ // 创建ListView.DataSource数据源
	rowHasChanged: (r1, r2) => r1 !== r2
});

export default class home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchText: '',
			currentPage: 0,
			advertisements: [
				{
					image: require('./images/advertisement-image-01.jpg')
				}, {
					image: require('./images/advertisement-image-02.jpg')
				}, {
					image: require('./images/advertisement-image-03.jpg')
				}
			],
			dataSource: ds.cloneWithRows([
				{
					image: require('./images/product-image-01.jpg'),
					title: '商品1',
					subTitle: '描述1'
				}, {
					image: require('./images/product-image-01.jpg'),
					title: '商品2',
					subTitle: '描述2'
				}, {
					image: require('./images/product-image-01.jpg'),
					title: '商品3',
					subTitle: '描述3'
				}, {
					image: require('./images/product-image-01.jpg'),
					title: '商品4',
					subTitle: '描述4'
				}, {
					image: require('./images/product-image-01.jpg'),
					title: '商品5',
					subTitle: '描述5'
				}, {
					image: require('./images/product-image-01.jpg'),
					title: '商品6',
					subTitle: '描述6'
				}, {
					image: require('./images/product-image-01.jpg'),
					title: '商品7',
					subTitle: '描述7'
				}, {
					image: require('./images/product-image-01.jpg'),
					title: '商品8',
					subTitle: '描述8'
				}, {
					image: require('./images/product-image-01.jpg'),
					title: '商品9',
					subTitle: '描述9'
				}, {
					image: require('./images/product-image-01.jpg'),
					title: '商品10',
					subTitle: '描述10'
				}
			]),
			isRefreshing: false,
			currentAppState: AppState.currentState
		};
	}

	render() {
		const advertisementCount = this.state.advertisements.length;

		const indicatorWidth = circleSize * advertisementCount + circleMargin * advertisementCount * 2;
		const left = (Screen.width - indicatorWidth) / 2;

		return (
			<View style={styles.container}>
				<StatusBar backgroundColor={'blue'} // 设置背景色为蓝色
					barStyle={'default'} // 设置默认样式
					networkActivityIndicatorVisible={true} // 显示正在请求网络的状态
				></StatusBar>
				<View style={styles.searchbar}>
					<TextInput style={styles.input} placeholder='搜索商品' value={this.state.searchText} onChangeText={(text) => {
						this.setState({searchText: text});
					}}></TextInput>
					<Button style={styles.button} title='搜索' onPress={() => {
						AlertIOS.prompt('编辑搜索结果', null, (promptValue) => {
							this.setState({searchText: promptValue});
						}, undefined, this.state.searchText);
					}}></Button>
				</View>
				<View style={styles.advertisement}>
					<ScrollView ref="scrollView" // 可以使用this.refs.scrollView来获取该组件
						horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true}>
						{this.state.advertisements.map((advertisement, index) => {
							return (
								<TouchableHighlight key={index} onPress={() => AlertIOS.alert('你点击了轮播图', null, null)}>
									<Image style={styles.advertisementContent} source={advertisement.image}></Image>
								</TouchableHighlight>
							);
						})}
					</ScrollView>
					<View style={[
						styles.indicator, {
							left: left
						}
					]}>
						{this.state.advertisements.map((advertisement, index) => {
							return (<View key={index} style={(index == this.state.currentPage)
								? styles.circleSelected
								: styles.circle}/>);
						})}
					</View>
				</View>
				<View style={styles.products}>
					<ListView dataSource={this.state.dataSource} renderRow={this._renderRow} refreshControl={this._renderRefreshControl()}/>
				</View>
			</View>
		);
	}

	componentDidMount() {
		this._startTimer();
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
		AppState.removeEventListener('change', this._handleAppStateChange);
	}

	_handleAppStateChange = (nextAppState) => {
		if (nextAppState === 'active') {
			if (this.state.currentAppState === 'inactive' || this.state.currentAppState === 'background') {
				this._onRefresh();
			}
		}

		this.setState({currentAppState: nextAppState});
	}

	_startTimer() {
		this.interval = setInterval(() => { // 使用setInterval创建定时器
			nextPage = this.state.currentPage + 1;
			if (nextPage >= 3) {
				nextPage = 0;
			}

			this.setState({currentPage: nextPage});

			const offSetX = nextPage * Screen.width;
			this.refs.scrollView.scrollResponderScrollTo({x: offSetX, y: 0, animated: true});
		}, 2000); // 设置定时器的间隔为2s
	}

	_renderRow = (rowData, sectionID, rowID) => {
		return (
			<TouchableHighlight onPress={() => {
				const {navigator} = this.props;
				if (navigator) {
					navigator.push({
						name: 'detail',
						component: Detail,
						params: {
							productTitle: rowData.title
						}
					});
				}
			}}>
				<View style={styles.row}>
					<Image source={rowData.image} style={styles.productImage}></Image>
					<View style={styles.productText}>
						<Text style={styles.productTitle}>{rowData.title}</Text>
						<Text style={styles.productSubTitle}>{rowData.subTitle}</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
	}

	_renderRefreshControl() {
		return (
			<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this._onRefresh} tintColor={'#FF0000'} title={'正在刷新数据，请稍后...'} titleColor={'#0000FF'}></RefreshControl>
		);
	}

	_onRefresh = () => {
		this.setState({isRefreshing: true});

		setTimeout(() => {
			const products = Array.from(new Array(10)).map((value, index) => ({
				image: require('./images/product-image-01.jpg'),
				title: '新商品' + index,
				subTitle: '新商品描述' + index
			}));
			this.setState({isRefreshing: false, dataSource: ds.cloneWithRows(products)});
		}, 2000);
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
		borderWidth: 2,
		borderRadius: 10
	},
	button: {
		flex: 1
	},
	advertisement: {
		height: 180
	},
	advertisementContent: {
		width: Screen.width,
		height: 180
	},
	indicator: {
		position: 'absolute',
		top: 160,
		flexDirection: 'row'
	},
	circle: {
		width: circleSize,
		height: circleSize,
		borderRadius: circleSize / 2,
		backgroundColor: 'gray',
		marginHorizontal: circleMargin
	},
	circleSelected: {
		width: circleSize,
		height: circleSize,
		borderRadius: circleSize / 2,
		backgroundColor: 'white',
		marginHorizontal: circleMargin
	},
	products: {
		flex: 1
	},
	row: {
		height: 60,
		flexDirection: 'row',
		backgroundColor: 'white'
	},
	productImage: {
		width: 40,
		height: 40,
		marginLeft: 10,
		marginRight: 10,
		alignSelf: 'center'
	},
	productText: {
		flex: 1,
		marginTop: 10,
		marginBottom: 1
	},
	productTitle: {
		flex: 3,
		fontSize: 16
	},
	productSubTitle: {
		flex: 2,
		fontSize: 14,
		color: 'gray'
	}
});
