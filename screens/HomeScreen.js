import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  AsyncStorage,
  Alert
} from 'react-native';


export default class HomeScreen extends Component {

  constructor() {
    super()
    this.loadApp()
  }

  state = {name : ''}

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('name')

    this.setState({name: apiToken})
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: 200, height: 200 }}
          source={require('../assets/icon.png')}
        />
        <Text>{this.state.name}</Text>
      </View>
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
