import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  AsyncStorage,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
import {
  Button,
  Text,
  View,
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

  state = { id: '', token: '', status: '', amount: '', description: '', date: '', time: '', isLoading: true }

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
        time: response.data.data.time,
        isLoading: false
      }))
      .catch(error => console.warn(error.response.data));
  }

  async componentWillMount() {
    this.setState({isLoading: true});
    await this.getTransactions();
  }

  componentWillUnmount() {
    const {params} = this.props.navigation.state;
    this.setState({isLoading: false});
    // console.warn(params.refresh);
    params.getTransactions();
  }

  renderTransaction() {
    return (
      <ViewReact style={{ flex: 1, backgroundColor: 'white' }}>
        <View styleName="vertical h-start" style={{ marginLeft: 12, marginTop: 12 }}>
          <Text>Status: { this.state.status }</Text>
          <Text>Amount: { this.state.amount }</Text>
          <Text>Description: { this.state.description }</Text>
          <Text>Date: { this.state.date }</Text>
          <Text>Time: { this.state.time }</Text>
          <View styleName="horizontal h-center">
            <Button
              styleName="secondary"
              onPress={() => this.props.navigation.navigate('EditTransaction',
                { id: this.state.id, getTransactions: this.componentWillMount.bind(this) }
              )}
            >
              <Icon name="edit" />
              <Text>EDIT</Text>
            </Button>
            <Button
              onPress={() => this.deleteTransaction()}
            >
              <Icon name="close" />
              <Text>DELETE</Text>
            </Button>
          </View>
        </View>
      </ViewReact>
    );
  }

  deleteTransaction() {
    var config = {
      headers: {
        'Accept': "application/json",
        'Authorization': "Bearer " + this.state.token
      }
    }

    axios.delete('http://wangku.herokuapp.com/api/transaction/user/' + this.state.id, config)
      .then(response => ToastAndroid.show("Successfully delete " + response.data.data.description, ToastAndroid.SHORT))
      .catch(error => console.log(error.response));

    this.props.navigation.goBack();
  }

  render() {
    return (
      <StyleProvider style={theme}>
        {this.state.isLoading ? (
          <ViewReact style={styles.container}>
            <ActivityIndicator
              animating
              size="large"
              style={styles.activityIndicator}
            />
          </ViewReact>
        ) : this.renderTransaction()}
      </StyleProvider>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});