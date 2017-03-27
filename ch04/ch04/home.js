import React, {Component} from 'react';
import {StyleSheet, Dimensions, TouchableHighlight, Image} from 'react-native';
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

import Detail from './detail';

export default class home extends Component {
	constructor(props) {
		super(props);
		this.state = {
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
			products: [
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
			]
		};
	}

	render() {
		return (
			<Container>
				<Header searchBar rounded>
					<InputGroup>
						<Icon name='ios-search-outline'/>
						<Input
							placeholder='搜索商品'
							onChangeText={(text) => {
							this.setState({searchText: text});
							console.log('输入的内容是 ' + this.state.searchText);
						}}/>
					</InputGroup>
					<Button
						transparent
						onPress={() => {
						Alert.alert('搜索内容 ' + this.state.searchText, null, null);
					}}>
						搜索
					</Button>
				</Header>
				<Content>
					<Swiper loop={true} height={190} autoplay={true}>
						{this.state.advertisements.map((advertisement, index) => {
							return (
								<TouchableHighlight
									key={index}
									onPress={() => Alert.alert('你点击了轮播图', null, null)}>
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
		return (
			<ListItem
				button
				onPress={() => {
				const {navigator} = this.props;
				if (navigator) {
					navigator.push({
						name: 'detail',
						component: Detail,
						params: {
							productTitle: product.title
						}
					});
				}
			}}>
				<Thumbnail square size={40} source={product.image}/>
				<Text>{product.title}</Text>
				<Text note>{product.subTitle}</Text>
			</ListItem>
		);
	}
}

const styles = StyleSheet.create({
	advertisementContent: {
		width: Dimensions.get('window').width,
		height: 180
	}
});
