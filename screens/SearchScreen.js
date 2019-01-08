import React, { Component } from 'react';
import {
  StyleSheet,
  View as ViewReact,
  ActivityIndicator,
  AsyncStorage,
  TouchableWithoutFeedback
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
    'shoutem.ui.Button': {
      '.btn-custom': {
        marginRight: 20,
      }
    }
  }
});

var DismissKeyboard = require('dismissKeyboard');

export default class SearchScreen extends Component {

  state = { token: '', isLoading: false, datas: [] }

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')

    this.setState({token: apiToken})
  }

  async search() {
    console.log(this.state.token);
    var config = {
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': "Bearer " + this.state.token
      }
    }

    await axios.post('http://wangku.herokuapp.com/api/search/transactions/self', {
      value: this.state.search.toString()
    } ,config)
      .then(response => this.setState({datas: response.data.data}))
      .catch(error => console.log(error.response.data));
    console.log(this.state.datas);
  }

  async componentWillMount() {
    await this.loadApp()
  }

  renderSearch() {
    return (
      <View styleName="vertical">
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
    );
  }

  render() {
    return (
      <StyleProvider style={theme}>
        <ViewReact style={{ flex: 1, backgroundColor: '#E8EAF6' }}>
          <ViewReact style={{ height: 23.7, backgroundColor: '#000' }}>
          </ViewReact>
          <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
          {this.state.isLoading ? (
            <ViewReact style={styles.container}>
              <ActivityIndicator
                animating
                size="large"
                style={styles.activityIndicator}
              />
            </ViewReact>
          ) : this.renderSearch()}
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
