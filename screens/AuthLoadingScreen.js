import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';

class AuthLoadingScreen extends Component {

  constructor() {
    super()
    this.loadApp()
  }

  loadApp = async() => {
    const apiToken = await AsyncStorage.getItem('apiToken')

    this.props.navigation.navigate(apiToken ? 'App' : 'Auth')
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }
}
export default AuthLoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
