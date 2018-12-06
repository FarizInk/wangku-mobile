import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  AsyncStorage,
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import {
  Button,
  Text,
  View,
  getTheme,
  Image,
  Lightbox,
  Icon,
  Row,
  Subtitle,
  Caption,
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';
import axios from 'axios';

let theme = _.merge(getTheme(), {

});


export default class HomeScreen extends Component {
  constructor() {
    super()
    this.loadApp()
  }

  state = { token: '', refreshing: false, isLoading: true }

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')

    this.setState({token: apiToken})
  }

  async getHome() {
    await this.loadApp()
    var config = {
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': "Bearer " + this.state.token
      }
    }

    await axios.get('http://wangku.herokuapp.com/api/profile', config)
      .then(response => this.setState({
        name: response.data.data.name,
        balance: response.data.data.balance,
        photo: response.data.meta.photo,
        isLoading: false
      }))
      .catch(error => console.log(error.response.data));
    let balance = this.formatRupiah(this.state.balance);
    this.setState({ balance: balance });
  }

  async componentWillMount() {
    this.setState({ isLoading: true })
    await this.getHome();
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getHome().then(() => {
      this.setState({refreshing: false});
    });
  }

  formatRupiah(angka, prefix){
  	var number_string = angka.toString().replace(/[^,\d]/g, ""),
  	split   		= number_string.split(','),
  	sisa     		= split[0].length % 3,
  	rupiah     		= split[0].substr(0, sisa),
  	ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);

  	// tambahkan titik jika yang di input sudah menjadi angka ribuan
  	if(ribuan){
  		separator = sisa ? '.' : '';
  		rupiah += separator + ribuan.join('.');
  	}

  	rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
  	return prefix == undefined ? rupiah : (rupiah ? '' + rupiah : '');
  }

  renderHomeScreen() {
    let photo = this.state.photo;
    if (this.state.photo == undefined || this.state.photo == null) {
      photo = 'http://wangku.herokuapp.com/img/avatar/default.jpg';
    } else {
      photo = 'http://wangku.herokuapp.com/images/profile/' + this.state.photo;
    }
    return (
      <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }>
        <View styleName="vertical h-center">
          <Row styleName="container" style={{ backgroundColor: 'transparent' }}>
            <Image
              style={{ borderWidth: 2, borderColor: 'white', width: 50, height: 50, borderRadius: 99, marginLeft: 20 }}
              source={{ uri: photo }}
            />
            <View styleName="vertical space-between content" style={{  }}>
              <Subtitle>{ this.state.name }</Subtitle>
              <Caption>Rp { this.formatRupiah(this.state.balance.toString()) }</Caption>
            </View>
          </Row>
        </View>
      </ScrollView>
    );
  }

  render() {
    return (
      <ViewReact style={{ flex: 1, backgroundColor: '#E8EAF6' }}>
        <ViewReact style={{ height: 23.7, backgroundColor: '#000' }}>
        </ViewReact>
        {this.state.isLoading ? (
          <ViewReact style={styles.container}>
            <ActivityIndicator
              animating
              size="large"
              style={styles.activityIndicator}
            />
          </ViewReact>
        ) : this.renderHomeScreen()}
      </ViewReact>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
