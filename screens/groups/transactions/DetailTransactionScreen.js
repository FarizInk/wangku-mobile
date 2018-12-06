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
  Icon,
  Title,
  Tile,
  Subtitle,
  ImageBackground,
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
  },
  'shoutem.ui.View': {
    '.card': {
      borderRadius: 5,
      margin: 12,
      height: 200
    },
    '.plus': {
      backgroundColor: "green"
    },
    '.minus': {
      backgroundColor: "red"
    }
  }
});

export default class AddTransactionScreen extends Component {
  static navigationOptions = {
    title: 'Detail Transaction',
  }

  state = { isLoading: true }

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
      .catch(error => console.log(error.response.data));
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

  formatRupiah(angka, prefix){
  	var number_string = angka.replace(/[^,\d]/g, "").toString(),
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

  renderTransaction() {
    return (
      <ViewReact style={{ flex: 1, backgroundColor: 'white' }}>
          <View styleName={ (this.state.status == "plus") ? "vertical h-center v-center card plus" : "vertical h-center v-center card minus" }>
            <Text style={{ color: 'white', fontSize: 25 }}>{ (this.state.status == "plus") ? ("+ Rp " + this.formatRupiah(this.state.amount.toString())) : ("- Rp " + this.formatRupiah(this.state.amount.toString())) }</Text>
            <Text style={{ color: '#eee', fontSize: 16, marginTop: 12 }}>{ this.state.description }</Text>
          </View>
          <View styleName="horizontal h-center" style={{ marginBottom: 15 }}>
            <Text>{ this.state.date + " · " + this.state.time }</Text>
          </View>
          <View styleName="horizontal h-center">
            <Button
              styleName="secondary"
              style={{ backgroundColor: '#311B92', borderWidth: 0 }}
              onPress={() => this.props.navigation.navigate('EditTransaction',
                { id: this.state.id, getTransactions: this.componentWillMount.bind(this) }
              )}
            >
              <Icon name="edit" />
              <Text>EDIT</Text>
            </Button>
            <Button
              styleName="secondary"
              style={{ backgroundColor: '#D32F2F', borderWidth: 0, marginLeft: 12 }}
              onPress={() => this.deleteTransaction()}
            >
              <Icon name="close" />
              <Text>DELETE</Text>
            </Button>
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
