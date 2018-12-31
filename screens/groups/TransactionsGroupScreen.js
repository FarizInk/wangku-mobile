import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  AsyncStorage,
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
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
  'shoutem.ui.Row': {
      '.container': {
        borderRadius: 3,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 2
      }
  }
});


export default class TransactionsGroupScreen extends Component {
  state = { transactions: [], token: '', groupId: '', refreshing: false, isLoading: true }

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')
    const groupId = await AsyncStorage.getItem('groupId')

    this.setState({ token: apiToken, groupId: groupId })
  }

  async getTransactions() {
    await this.loadApp()
    var config = {
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': "Bearer " + this.state.token
      }
    }

    axios.get('http://wangku.herokuapp.com/api/transactions/today/group/' + this.state.groupId, config)
      .then(response => this.setState({ today: response.data.data }))
      .catch(error => console.log(error.response.data));

    axios.get('http://wangku.herokuapp.com/api/transactions/group/' + this.state.groupId, config)
      .then(response => this.setState({ transactions: response.data.data, isLoading: false }))
      .catch(error => console.log(error.response.data));
  }

  async componentWillMount() {
    this.setState({ isLoading: true })
    await this.getTransactions();
  }

  formatRupiah(angka, prefix){
  	var number_string = angka.toString(),
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

  renderDate(date) {
    if (date != savedate) {
      savedate = date;
      return (
        <Row style={{ backgroundColor: 'transparent', paddingVertical: 0, paddingHorizontal: 20, marginBottom: 5 }}>
          <Text>{ savedate }</Text>
        </Row>
      )
    } else {
      return null
    }
  }

  renderTransactions() {
    var savedate = null;
    return this.state.transactions.map(transaction =>
      <View key={ transaction.id }>
        {
          (savedate != transaction.date_human) ? (
            <Row style={{ backgroundColor: 'transparent', paddingVertical: 0, paddingHorizontal: 20, marginVertical: 5 }}>
              <Text>{ savedate = transaction.date_human }</Text>
            </Row>
          ) : null
        }
        <Row styleName="container">
          <View styleName="vertical space-between content">
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('DetailTransaction',
                { id: transaction.id, getTransactions: this._onRefresh.bind(this) }
              )}
            >
              <Subtitle>{ transaction.description }</Subtitle>
            </TouchableOpacity>
            <Row styleName="small" style={{ height: 30, paddingLeft: 0, marginBottom: 0 }}>
              {
                (transaction.photo == null) ? (<Image styleName="small-avatar" style={{ marginRight: 4 }} source={{ uri: 'http://wangku.herokuapp.com/img/avatar/default.jpg' }} />) : (<Image styleName="small-avatar" style={{ marginRight: 4 }} source={{ uri: 'http://wangku.herokuapp.com/images/profile/' + transaction.photo }} />)
              }
            <Text>{ transaction.name }</Text>
            </Row>
          </View>
          <View styleName="vertical space-between content">
            { (transaction.status == "plus") ? (
              <Caption style={{ textAlign: 'right', color: 'green' }}>{ "+ Rp " + this.formatRupiah(transaction.amount) }</Caption>
            ) : (
              <Caption style={{ textAlign: 'right', color: 'red' }}>{ "- Rp " + this.formatRupiah(transaction.amount) }</Caption>
            ) }
            <Caption style={{ textAlign: 'right' }}>{ transaction.created }</Caption>
          </View>
        </Row>
      </View>
    );
  }

  renderToday() {
    if (this.state.today == "" || this.state.today == undefined) {
      return (
        <Text style={{ textAlign: 'center'}}>You Have No Transaction Today.</Text>
      );
    } else {
      return this.state.today.map(data =>
        <Row styleName="container" key={ data.id }>
          <View styleName="vertical space-between content">
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('DetailTransaction',
                { id: data.id, getTransactions: this._onRefresh.bind(this) }
              )}
            >
              <Subtitle>{ data.description }</Subtitle>
            </TouchableOpacity>
            <Row styleName="small" style={{ height: 30, paddingLeft: 0, marginBottom: 0 }}>
              {
                (data.photo == null) ? (<Image styleName="small-avatar" style={{ marginRight: 4 }} source={{ uri: 'http://wangku.herokuapp.com/img/avatar/default.jpg' }} />) : (<Image styleName="small-avatar" style={{ marginRight: 4 }} source={{ uri: 'http://wangku.herokuapp.com/images/profile/' + data.photo }} />)
              }
            <Text>{ data.name }</Text>
            </Row>
          </View>
          <View styleName="vertical space-between content">
            { (data.status == "plus") ? (
              <Caption style={{ textAlign: 'right', color: 'green' }}>{ "+ Rp " + this.formatRupiah(data.amount) }</Caption>
            ) : (
              <Caption style={{ textAlign: 'right', color: 'red' }}>{ "- Rp " + this.formatRupiah(data.amount) }</Caption>
            ) }
            <Caption style={{ textAlign: 'right' }}>{ data.created }</Caption>
          </View>
        </Row>
      );
    }
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getTransactions().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
    return (
      <StyleProvider style={theme}>
        <ViewReact style={{ flex: 1, backgroundColor: '#E8EAF6' }}>
          {this.state.isLoading ? (
            <ViewReact style={styles.container}>
              <ActivityIndicator
                animating
                size="large"
                style={styles.activityIndicator}
              />
            </ViewReact>
          ) : (
            <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            >
              <View styleName="vertical" style={{ marginTop: 12, marginBottom: 12 }}>
                <Row style={{ backgroundColor: 'transparent', paddingVertical: 0, paddingHorizontal: 20, marginBottom: 5 }}>
                  <Text>Today</Text>
                  <Button
                    onPress={() => this.props.navigation.navigate('AddGroupTransactionScreen',
                      { getTransactions: this._onRefresh.bind(this) }
                    )}
                    >
                    <Icon name="plus-button" />
                    <Text style={{ fontWeight: 'normal' }}>Transaction</Text>
                  </Button>
                </Row>
                {this.renderToday()}
                {this.renderTransactions()}
              </View>
            </ScrollView>
          )}
        </ViewReact>
      </StyleProvider>
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
