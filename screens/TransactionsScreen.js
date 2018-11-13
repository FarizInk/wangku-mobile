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
  Heading,
  ImageBackground,
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
      },
  },
  'shoutem.ui.Button' : {
    '.info': {
      padding: 12,
      borderRadius: 99,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 5,
      elevation: 2
    },
    '.minus': {
      backgroundColor: 'red',
    },
    '.plus': {
      backgroundColor: 'green',
    }
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

  componentWillMount() {
    this._onRefresh();
  }

  renderTransactions() {
    if (this.state.transactions == "") {
      return (
        <Text style={{ textAlign: 'center'}}>You Have No Transaction Today.</Text>
      );
    } else {
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
              <Caption>{ transaction.created }</Caption>
            </View>
            <Button styleName={"right-icon info " + transaction.status}><Icon name={transaction.status + "-button"} style={{ color: 'white' }}/></Button>
          </Row>
        </TouchableOpacity>
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
          <ViewReact style={{ height: 23.7, backgroundColor: '#311B92' }}>
          </ViewReact>
          <ViewReact>
            <ImageBackground
              style={{ height: 70, backgroundColor: '#311B92', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.8, elevation: 5 }}
            >
            <NavigationBar
              styleName="clear"
              leftComponent={(
                <Button>
                  <Text style={{ marginLeft: 15, color: '#FFDE03' }}>All</Text>
                </Button>
              )}
              centerComponent={<Title >Wangku - Today</Title>}
              rightComponent={(
                <Button
                  style={{ marginRight: 15, backgroundColor: '#FFDE03', borderRadius: 5 }}
                  onPress={() => this.props.navigation.navigate('AddTransaction',
                    { getTransactions: this._onRefresh.bind(this) }
                  )}
                >
                  <Icon name="plus-button" style={{ color: 'black' }} />
                </Button>
              )}
            />
            </ImageBackground>
          </ViewReact>
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
              {this.renderTransactions()}
            </View>
          </ScrollView>
        </ViewReact>
      </StyleProvider>
    );
  }
}
