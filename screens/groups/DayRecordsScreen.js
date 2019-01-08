import React, { Component } from 'react';
import {
  StyleSheet,
  View as ViewReact,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  ToastAndroid
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


export default class DayRecordsScreen extends Component {
  static navigationOptions = {
    title: 'Day Records',
  }
  state = { transactions: [], token: '', refreshing: false, isLoading: true, page: 1, data: [] }

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')
    const groupId = await AsyncStorage.getItem('groupId')

    this.setState({token: apiToken, groupId: groupId})
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

    await axios.get('http://wangku.herokuapp.com/api/record/day/group/' + this.state.groupId + '?page=' + this.state.page, config)
      .then(response => this.setState({ transactions: [...this.state.transactions, ...response.data.data], isLoading: false, data: response.data.data }))
      .catch(error => console.log(error.response.data));

    console.log(this.state.page);

    if (this.state.data == "") {
      ToastAndroid.show("No More Day Record", ToastAndroid.SHORT);
      this.setState({
        page: "no content"
      });
    }
  }

  async componentWillMount() {
    this.setState({ isLoading: true })
    await this.getTransactions();
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

  loadMore = async() => {
    if (this.state.page != "no content") {
      ToastAndroid.show("Load More Day Record.", ToastAndroid.SHORT);
      await this.setState({
        page: this.state.page + 1
      }, () => this.getTransactions());
    } else {
      console.log("no more transactions");
    }
  }

  renderTransactions() {
    if (this.state.transactions == "") {
      return (
        <Text style={{ textAlign: 'center'}}>You Have No Day Record.</Text>
      );
    } else {
      var savedate = null;
      return (
          <FlatList
            data={this.state.transactions}
            ListFooterComponent={ () =>
              <View>
                {
                  (this.state.data == "") ? (
                    null
                  ) : (<Button styleName="full-width" onPress={ () => this.loadMore() }>
                    <Text>LOAD MORE</Text>
                  </Button>)
                }
              </View>
            }
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) =>
            <View>
              <Row styleName="container">
                <View styleName="vertical space-between content">
                  <Subtitle>{ item.date_human }</Subtitle>
                  <Caption>{ item.created }</Caption>
                </View>
                <View styleName="vertical space-between">
                  <Caption style={{ textAlign: 'right', color: 'green' }}>{ "+ Rp " + this.formatRupiah(item.plus) }</Caption>
                  <Caption style={{ textAlign: 'right', color: 'red' }}>{ "- Rp " + this.formatRupiah(item.minus) }</Caption>
                </View>
              </Row>
            </View>
          }
            />
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
          {this.state.isLoading ? (
            <ViewReact style={styles.container}>
              <ActivityIndicator
                animating
                size="large"
                style={styles.activityIndicator}
              />
            </ViewReact>
          ) : (
              <View styleName="vertical">
                {this.renderTransactions()}
              </View>
          )}
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
