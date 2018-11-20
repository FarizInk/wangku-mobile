import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  AsyncStorage,
  Alert,
  ScrollView,
  ActivityIndicator
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

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')

    this.setState({token: apiToken})
  }

  async getProfile() {
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
        isLoading: false
      }))
      .catch(error => console.warn(error.response.data));
  }

  async componentWillMount() {
    this.setState({ isLoading: true })
    await this.getProfile();
  }

  renderHomeScreen() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <View styleName="vertical h-center">
          <Row styleName="container" style={{ backgroundColor: 'transparent' }}>
            <Image
              style={{ borderWidth: 2, borderColor: 'white', width: 50, height: 50, borderRadius: 99, marginLeft: 20 }}
              source={{ uri: 'http://wangku.herokuapp.com/img/avatar/default.jpg'}}
            />
            <View styleName="vertical space-between content" style={{  }}>
              <Subtitle>{ this.state.name }</Subtitle>
              <Caption>Rp { this.state.balance }</Caption>
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
