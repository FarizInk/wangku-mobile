import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  AsyncStorage,
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions
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
  Title,
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';
import axios from 'axios';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph
} from 'react-native-chart-kit'

let theme = _.merge(getTheme(), {

});


export default class HomeScreen extends Component {
  constructor() {
    super()
    this.loadApp()
  }

  state = { token: '', refreshing: false, isLoading: true, dayrecord: [] }

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

    await axios.get('http://wangku.herokuapp.com/api/home', config)
      .then(response => this.setState({
        name: response.data.name,
        balance: response.data.balance,
        photo: response.data.photo,
        total: response.data.transactions,
        today: response.data.today,
        day_income: response.data.day_income,
        day_spending: response.data.day_spending,
        daynow: response.data.daynow,
        dayrecord: response.data.day_record,
        monthnow: response.data.monthnow,
        isLoading: false
      }))
      .catch(error => console.log(error.response.data));
    let balance = this.formatRupiah(this.state.balance);
    this.setState({ balance: balance });
    console.log(this.state.dayrecord);
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
            <View styleName="vertical space-between content">
              <Subtitle>{ this.state.name }</Subtitle>
              <Caption>Rp { this.formatRupiah(this.state.balance.toString()) }</Caption>
            </View>
          </Row>
          <Row style={{ margin: 0, padding: 0, backgroundColor: 'transparent' }}>
            <View styleName="vertical h-center v-center card" style={{ backgroundColor: '#647DEE', marginLeft: 20, marginRight: 10, paddingVertical: 10, borderRadius: 5, marginBottom: 10 }}>
              <Text style={{ color: '#eee' }}>Total</Text>
              <Title style={{ color: '#fff' }}>{ this.state.total }</Title>
              <Subtitle style={{ color: '#fff' }}>Transactions</Subtitle>
            </View>
            <View styleName="vertical h-center v-center card" style={{ backgroundColor: '#7F53AC', marginLeft: 10, marginRight: 20, paddingVertical: 10, borderRadius: 5, marginBottom: 10 }}>
              <Text style={{ color: '#eee' }}>Today</Text>
              <Title style={{ color: '#fff' }}>{ this.state.today }</Title>
              <Subtitle style={{ color: '#fff' }}>Transactions</Subtitle>
            </View>
          </Row>

          <Row style={{ backgroundColor: 'transparent', paddingVertical: 0, paddingHorizontal: 20, marginBottom: 5, marginTop: 10 }}>
            <Subtitle>Today</Subtitle>
            <Text style={{ textAlign: 'right' }}>{ this.state.daynow }</Text>
          </Row>

          <Row style={{ margin: 0, padding: 0, backgroundColor: 'transparent' }}>
            <View styleName="vertical h-center v-center card" style={{ backgroundColor: '#fff', marginLeft: 20, marginRight: 10, paddingVertical: 10, borderRadius: 5, marginBottom: 10 }}>
              <Text style={{ color: '#43A047'}}>Income</Text>
              <Title style={{ color: '#2E7D32'}}>+ Rp { this.formatRupiah(this.state.day_income.toString()) }</Title>
            </View>
            <View styleName="vertical h-center v-center card" style={{ backgroundColor: '#fff', marginLeft: 10, marginRight: 20, paddingVertical: 10, borderRadius: 5, marginBottom: 10 }}>
              <Text style={{ color: '#F44336'}}>Spending</Text>
              <Title style={{ color: '#C62828'}}>- Rp { this.formatRupiah(this.state.day_spending.toString()) }</Title>
            </View>
          </Row>

          <Row style={{ backgroundColor: 'transparent', paddingVertical: 0, paddingHorizontal: 20, marginBottom: 5, marginTop: 10 }}>
            <Button styleName="secondary">
              <Text>Day Records</Text>
            </Button>
            <Text style={{ textAlign: 'right' }}>{ this.state.monthnow }</Text>
          </Row>
          <View>
            <LineChart
              data={{
                labels: [
                  this.state.dayrecord.day4.nameday,
                  this.state.dayrecord.day3.nameday,
                  this.state.dayrecord.day2.nameday,
                  this.state.dayrecord.day1.nameday,
                  this.state.dayrecord.day0.nameday
                ],
                datasets: [{
                  data: [
                    this.state.dayrecord.day4.value,
                    this.state.dayrecord.day3.value,
                    this.state.dayrecord.day2.value,
                    this.state.dayrecord.day1.value,
                    this.state.dayrecord.day0.value
                  ]
                }]
              }}
              width={Dimensions.get('window').width - 40} // from react-native
              height={220}
              chartConfig={{
                backgroundColor: '#311B92',
                backgroundGradientFrom: '#647DEE',
                backgroundGradientTo: '#7F53AC',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>
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
  }
});
