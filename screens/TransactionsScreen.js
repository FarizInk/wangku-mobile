import React, { Component } from 'react';
import {
  StyleSheet,
  View as ViewReact,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  RefreshControl,
} from 'react-native';
import {
  Button,
  Text,
  View,
  getTheme,
  Row,
  Subtitle,
  Caption,
  Icon,
  NavigationBar,
  Title,
  Heading
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';
import ActionButton from 'react-native-action-button';
import axios from 'axios';

let theme = _.merge(getTheme(), {
  'shoutem.ui.Row': {
      '.container': {
        borderWidth: 2,
        borderColor: "#EEEEEE",
        borderRadius: 10,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15,
      },
  },
  'shoutem.ui.Text': {
    '.plus': {
      color: 'green'
    },
    '.minus': {
      color: 'red'
    },
  },
  'shoutem.ui.Heading': {
    '.header': {
      marginTop: 35,
      textAlign: 'center',
    }
  },
  'shoutem.ui.Icon': {
    '.plus': {
      color: 'green'
    },
    '.minus': {
      color: 'red'
    },
  }
});


export default class TransactionsScreen extends Component {
  state = { transactions: [], token: '', refreshing: false }

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')

    this.setState({token: apiToken})
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

    axios.get('http://wangku.herokuapp.com/api/transactions/today/user', config)
      .then(response => this.setState({ transactions: response.data.data }))
      .catch(error => console.warn(error.response.data));
  }

  async componentWillMount() {
    await this.getTransactions();
  }

  renderTransactions() {
    return this.state.transactions.map(transaction =>
      <TouchableOpacity
        key={ transaction.id }
        onPress={() => this.props.navigation.navigate('DetailTransaction',
          { id: transaction.id, getTransactions: this._onRefresh.bind(this) }
        )}
      >
        <Row styleName="container">
          <View styleName="vertical space-between content">
            <Subtitle>{ transaction.description }</Subtitle>
            <Caption>{ transaction.created }  ·  { transaction.time }</Caption>
          </View>
          <Button styleName="right-icon"><Icon name={transaction.status + "-button"} styleName={ transaction.status } /><Text styleName={ transaction.status }>{ transaction.amount }</Text></Button>
        </Row>
      </TouchableOpacity>
    );
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
        <ViewReact style={{ flex: 1, backgroundColor: 'white' }}>
          <Heading styleName="header">Wangku - Today</Heading>
          <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          >
            <View styleName="vertical">
              {this.renderTransactions()}
            </View>
          </ScrollView>
          <ActionButton
            buttonColor="rgba(231,76,60,1)"
            verticalOrientation="up"
            onPress={() => this.props.navigation.navigate('AddTransaction',
              { getTransactions: this._onRefresh.bind(this) }
            )}
          />
        </ViewReact>
      </StyleProvider>
    );
  }
}
