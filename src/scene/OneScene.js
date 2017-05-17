//LiuZh 2017-05-16
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import MyListView from '../component/MyListView';

//好特么长的API
const ONE_URL = 'http://v3.wufazhuce.com:8000/api/onelist/idlist/?channel=wdj&version=4.0.2&uuid=ffffffff-a90e-706a-63f7-ccf973aae5ee&platform=android';

export default class OneScene extends Component{

	constructor(props){
		super(props);
		this.state = {
			//API的weather字段
			weather: null,
			//存储Data的Id，有数据时是一个数组
			dataId_arr: null,
			//存储某天的list数据,是一个ds能直接给listview使用
			dataOne: null,
		};
	}

//如果有数据，渲染lv数据，如果没有数据，渲染等待页面
	render() {
		return this.state.dataOne? this.renderLv() : this.renderLoadingView();
	}

//渲染等待视图，TODO：实现动画等待==>导入component方式
	renderLoadingView() {
		return (
			<View style={styles.loading}>
				<Text>Loading...(TODO动画)</Text>
			</View>
		);
	}
//渲染listView展示数据
	renderLv() {
		return(
			<MyListView
				navigation={this.props.navigation}
				weather={this.state.weather}
				data={this.state.dataOne}/>
		);
	}

//组件渲染完成回调此生命周期，API获取数据并存储给this.state.data
	componentDidMount() {
		this.fetchDataId();
	}

//获取某一天的list内容
	fetchOne(id) {
		const URL = `http://v3.wufazhuce.com:8000/api/onelist/${id}/0?cchannel=wdj&version=4.0.2&uuid=ffffffff-a90e-706a-63f7-ccf973aae5ee&platform=android`;
		fetch(URL)
		.then((response) => response.json())
		.then((jsonData) => {
			//取content_list数组并将weather插入到数组头部
			let arr = jsonData.data.content_list;
			this.setState({
				dataOne: arr,
				weather: jsonData.data.weather,
			});
		})
		.catch((error) => {
			alert(`fetchOne:${error}`);
		});
	}
//获取首页list的Id数组
	fetchDataId() {
		fetch(ONE_URL)
		.then((response) => response.json())
		.then((jsonData) => {
			this.setState({
				dataId_arr: jsonData.data,
			});
			this.fetchOne(this.state.dataId_arr[0]);
		})
		.catch((error) => {
			alert(`fetchDataId:${error}`);
		});
	}
}

const styles = StyleSheet.create({
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

});
