import React, { Component } from 'react';
import {
  StyleSheet,
  View as ViewReact,
  ActivityIndicator,
  AsyncStorage,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import {
  Button,
  Text,
  View,
  getTheme,
  Row,
  TextInput,
  Icon,
  NavigationBar,
  Title,
  Subtitle,
  Caption
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';
import axios from 'axios';

let theme = _.merge(getTheme(), {
  'shoutem.ui.Row': {
    '.container': {
      paddingTop: 0,
      paddingBottom: 0,
      marginBottom: 20,
    },
    '.card': {
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
  },
  'shoutem.ui.Button': {
    '.btn-custom': {
      marginRight: 20,
    }
  }
});

var DismissKeyboard = require('dismissKeyboard');

export default class SearchGroupScreen extends Component {
  static navigationOptions = {
    title: 'Search Transactions',
  }
  state = { token: '', isLoading: false, transactions: [] }

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')
    const groupId = await AsyncStorage.getItem('groupId')

    this.setState({token: apiToken, groupId: groupId})
  }

  async search() {
    this.setState({
      isLoading: true
    });
    var config = {
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': "Bearer " + this.state.token
      }
    }

    await axios.post('http://wangku.herokuapp.com/api/search/transactions/' + this.state.groupId, {
      value: this.state.search.toString()
    } ,config)
      .then(response => this.setState({transactions: response.data.data, isLoading: false}))
      .catch(error => console.log(error.response.data));
      console.log(this.state.transactions);
  }

  async componentWillMount() {
    await this.loadApp()
  }

  datanull() {
    this.setState({
      transactions: []
    });
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

  noAction() {
    return null;
  }

  renderTransactions() {
    if (this.state.transactions == "") {
      return (
        <Text style={{ textAlign: 'center'}}>Not Found.</Text>
      );
    } else {
      return this.state.transactions.map(transaction =>
          <Row styleName="card" key={ transaction.id }>
            <View styleName="vertical space-between content">
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('UpdateTransactionGroupScreen',
                  { id: transaction.id, getTransactions: this.noAction.bind(this) }
                )}
              >
                <Subtitle>{ transaction.description }</Subtitle>
              </TouchableOpacity>
              <Caption>{ transaction.created }</Caption>
            </View>
            <View styleName="vertical space-between">
              { (transaction.status == "plus") ? (
                <Caption style={{ textAlign: 'right', color: 'green' }}>{ "+ Rp " + this.formatRupiah(transaction.amount) }</Caption>
              ) : (
                <Caption style={{ textAlign: 'right', color: 'red' }}>{ "- Rp " + this.formatRupiah(transaction.amount) }</Caption>
              ) }
            </View>
          </Row>
      );
    }
  }

  render() {
    return (
      <StyleProvider style={theme}>
        <ViewReact style={{ flex: 1, backgroundColor: '#E8EAF6' }}>
          <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
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
            >
            <View styleName="vertical" style={{ padding: 0 }}>
              <Row styleName="container">
                <View styleName="vertical space-between">
                  <TextInput
                    placeholder={'Search Here...'}
                    value={this.state.search}
                    onChangeText={search => this.setState({ search })}
                  />
                </View>
                <Button styleName="right-icon btn-custom" onPress={this.search.bind(this)}>
                  <Icon name="search" style={{ color: '#311B92' }} />
                </Button>
              </Row>
            </View>
            <View styleName="vertical" style={{ marginBottom: 12 }}>
              {this.renderTransactions()}
            </View>
            </ScrollView>
          )}
        </TouchableWithoutFeedback>
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
