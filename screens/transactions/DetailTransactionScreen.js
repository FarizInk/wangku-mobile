import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  AsyncStorage,
  ToastAndroid,
} from 'react-native';
import {
  Button,
  Text,
  View as ShoutemView,
  getTheme,
  TextInput,
  DropDownMenu,
  Icon,
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';
import axios from 'axios';

let theme = _.merge(getTheme(), {
  'shoutem.ui.View': {
      '.content': {
        backgroundColor: 'white',
        flex: 1,
      },
  }
});

export default class AddTransactionScreen extends Component {
  static navigationOptions = {
    title: 'Detail Transaction',
  }

  state = { id: '', token: '', status: '', amount: '', description: '', date: '', time: '' }

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')
    const { params } = this.props.navigation.state;
    this.setState({ token: apiToken, id: params.id })
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

    axios.get('http://wangku.herokuapp.com/api/transaction/user/' + this.state.id, config)
      .then(response => this.setState({
        status: response.data.data.status,
        amount: response.data.data.amount,
        description: response.data.data.description,
        date: response.data.data.date,
        time: response.data.data.time
      }))
      .catch(error => console.warn(error.response.data));
  }

  async componentWillMount() {
    await this.getTransactions();
  }

  render() {
    return (
      <StyleProvider style={theme}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <ShoutemView styleName="vertical h-start" style={{ marginLeft: 12, marginTop: 12 }}>
            <Text>Status: { this.state.status }</Text>
            <Text>Amount: { this.state.amount }</Text>
            <Text>Description: { this.state.description }</Text>
            <Text>Date: { this.state.date }</Text>
            <Text>Time: { this.state.time }</Text>
            <Button styleName="secondary">
              <Icon name="edit" />
              <Text>EDIT</Text>
            </Button>
          </ShoutemView>
        </View>
      </StyleProvider>
    );
  }

}
