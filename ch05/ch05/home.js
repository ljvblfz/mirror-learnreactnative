import React, {Component} from 'react';
import {StyleSheet, Dimensions, TouchableHighlight, Image, AsyncStorage} from 'react-native';
import {
	Container,
	Header,
	InputGroup,
	Icon,
	Input,
	Button,
	Content,
	List,
	ListItem,
	Thumbnail,
	Text
} from 'native-base';
import Swiper from 'react-native-swiper';
import Realm from 'realm';

import Detail from './detail';

const SERVER_URL = 'http://localhost:3000/';
const PRODUCT_API = 'products/';

export default class home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isNetworkValid: false,
			searchText: '',
			advertisements: [
				{
					image: require('./images/advertisement-image-01.jpg')
				}, {
					image: require('./images/advertisement-image-02.jpg')
				}, {
					image: require('./images/advertisement-image-03.jpg')
				}
			],
			products: [],
			realm: new Realm({ // 创建Realm实例
				schema: [
					{
						name: 'Product', // 数据对象的名称
						properties: { // 数据对象的属性
							id: 'int',
							title: 'string',
							subTitle: 'string',
							image: 'string'
						}
					}
				]
			})

		};
	}

	componentDidMount() {
		this._fetchProducts();
	}

	render() {
		return (
			<Container>
				<Header searchBar rounded>
					<InputGroup>
						<Icon name='ios-search-outline'/>
						<Input placeholder='搜索商品' onChangeText={(text) => {
							this.setState({searchText: text});
							console.log('输入的内容是 ' + this.state.searchText);
						}}/>
					</InputGroup>
					<Button transparent onPress={() => {
						Alert.alert('搜索内容 ' + this.state.searchText, null, null);
					}}>
						搜索
					</Button>
				</Header>
				<Content>
					<Swiper loop={true} height={190} autoplay={true}>
						{this.state.advertisements.map((advertisement, index) => {
							return (
								<TouchableHighlight key={index} onPress={() => Alert.alert('你点击了轮播图', null, null)}>
									<Image style={styles.advertisementContent} source={advertisement.image}></Image>
								</TouchableHighlight>
							);
						})}
					</Swiper>
					<List dataArray={this.state.products} renderRow={this._renderRow}></List>
				</Content>
			</Container>
		);
	}

	_renderRow = (product) => {
		// 网络正常时加载网络图片，网络断开时加载本地图片
		const ImageComponent = this.state.isNetworkValid
			? <Thumbnail square size={40} source={{
					uri: SERVER_URL + product.image
				}}/>
			: <Thumbnail square size={40} source={require('./images/product-image-01.jpg')}/>;

		return (
			<ListItem button onPress={() => {
				const {navigator} = this.props;
				if (navigator) {
					navigator.push({
						name: 'detail',
						component: Detail,
						params: {
							product: product,
							productUpdated: this._productUpdated
						}
					});
				}
			}}>
				{ImageComponent}
				<Text>{product.title}</Text>
				<Text note>{product.subTitle}</Text>
			</ListItem>
		);
	}

	_fetchProducts = () => {
		const req = new Request(SERVER_URL + PRODUCT_API, {method: 'GET'});
		console.log('request: ', SERVER_URL + PRODUCT_API);
		fetch(req).then((res) => {
			return res.json(); // 将返回的数据转换成JSON格式
		}).then((result, done) => {
			if (!done) {
				this._saveProducts(result);
				this.setState({isNetworkValid: true, products: result});
			}
		}).catch((err) => { // Promise异常处理
			const products = this._queryProducts();
			console.log('products: ' + JSON.stringify(products));
			this.setState({isNetworkValid: false, products: products});
		});
	}

	_productUpdated = () => {
		this._fetchProducts();
	}

	_saveProducts = (products) => {
		this.state.realm.write(() => { // 使用Realm保存商品数据
			for (const i = 0; i < products.length; i++) {
				const product = products[i];
				this.state.realm.create('Product', {
					id: parseInt(product.id),
					title: product.title,
					subTitle: product.subTitle,
					image: product.image
				});
			}
		});
	}

	_queryProducts = () => { // 使用Realm读取商品数据
		return this.state.realm.objects('Product');
	}
}

const styles = StyleSheet.create({
	advertisementContent: {
		width: Dimensions.get('window').width,
		height: 180
	}
});
