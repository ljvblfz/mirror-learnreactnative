import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Button,
	Alert
} from 'react-native';

const SERVER_URL = 'http://localhost:3000/';
const PRODUCT_API = 'products/';

export default class detail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			productID: '' + this.props.product.id,
			productTitle: this.props.product.title,
			productSubTitle: this.props.product.subTitle
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this._pressBackButton.bind(this)}>
					<Text style={styles.back}>返回</Text>
				</TouchableOpacity>
				<View style={styles.line}>
					<Text style={styles.text}>ID:</Text>
					<TextInput style={styles.input} value={this.state.productID} onChangeText={(text) => {
						this.setState({productID: text});
					}}></TextInput>
				</View>
				<View style={styles.line}>
					<Text style={styles.text}>title:</Text>
					<TextInput style={styles.input} value={this.state.productTitle} onChangeText={(text) => {
						this.setState({productTitle: text});
					}}></TextInput>
				</View>
				<View style={styles.line}>
					<Text style={styles.text}>subTitle:</Text>
					<TextInput style={styles.input} value={this.state.productSubTitle} onChangeText={(text) => {
						this.setState({productSubTitle: text});
					}}></TextInput>
				</View>
				<View style={styles.line}>
					<Text style={{
						fontSize: 20
					}}>
						image: {this.props.product.image}</Text>
				</View>
				<Button title='保存' onPress={this._updateProduct}></Button>
				<Button title='新建' onPress={this._createProduct}></Button>
				<Button title='删除' onPress={this._deleteProduct}></Button>
			</View>
		);
	}

	_updateProduct = () => {
		const req = new Request(SERVER_URL + PRODUCT_API + this.state.productID, {
			method: 'PUT',
			headers: { // 设置HTTP请求头的数据格式为JSON
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'id': parseInt(this.state.productID),
				'title': this.state.productTitle,
				'subTitle': this.state.productSubTitle,
				'image': this.props.product.image
			})
		});
		fetch(req).then((res) => {
			return res.json();
		}).then((result, done) => {
			if (!done) {
				this.props.productUpdated(); // 通知home组件商品信息更新成功
				Alert.alert('保存成功', null, null);
			} else {
				Alert.alert('保存失败', null, null);
			}
		});
	}

	_createProduct = () => {
		const req = new Request(SERVER_URL + PRODUCT_API, {
			method: 'POST',
			headers: { // 设置HTTP请求头的数据格式为JSON
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'id': parseInt(this.state.productID),
				'title': this.state.productTitle,
				'subTitle': this.state.productSubTitle,
				'image': this.props.product.image
			})
		});
		fetch(req).then((res) => {
			return res.json();
		}).then((result, done) => {
			if (!done) {
				this.props.productUpdated();
				Alert.alert('新建成功', null, null);
			} else {
				Alert.alert('新建失败', null, null);
			}
		});
	}

	_deleteProduct = () => {
		const req = new Request(SERVER_URL + PRODUCT_API + this.state.productID, {method: 'DELETE'});
		fetch(req).then((res) => {
			return res; // 此时返回的数据不是JSON格式，所以不做处理
		}).then((result, done) => {
			if (!done) {
				this.props.productUpdated();
				Alert.alert('删除成功', null, null);
			} else {
				Alert.alert('删除失败', null, null);
			}
		});
	}

	_pressBackButton() {
		const {navigator} = this.props;
		if (navigator) {
			navigator.pop();
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 100
	},
	line: {
		flexDirection: 'row'
	},
	text: {
		width: 100,
		fontSize: 20
	},
	input: {
		flex: 1,
		borderColor: 'gray',
		borderWidth: 2
	},
	back: {
		fontSize: 20,
		color: 'blue'
	}
});
