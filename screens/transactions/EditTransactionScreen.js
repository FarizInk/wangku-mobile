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
  Subtitle
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
      '.selectDropdown': {
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
      }
  },
  'shoutem.ui.Button': {
      '.register': {
        marginTop: 35,
        backgroundColor: '#311B92'
      },
  },
  'shoutem.ui.TextInput': {
      '.textInput': {
        backgroundColor: '#fff',
        color: 'black',
        width: 300,
        marginTop: 20,
        borderColor: '#EEEEEE',
        borderWidth: 2,
        borderRadius: 3,
      },
  },
  'shoutem.ui.Subtitle': {
    '.label': {
      marginTop: 20,
      width: 300,
      marginBottom: 10,
    }
  },
});

var DismissKeyboard = require('dismissKeyboard');

export default class EditTransactionScreen extends Component {
  static navigationOptions = {
    title: 'Update Transaction',
  }

  constructor(props){
  super(props);
  this.loadApp()
  this.state = {
    status: [
        {
          name: "Select",
          value: ""
        },
        {
          name: "Plus",
          value: "plus"
        },
        {
          name: "Minus",
          value: "minus"
        },
      ],
    }
  }

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')
    const { params } = this.props.navigation.state;
    this.setState({ token: apiToken, id: params.id })
  }

  async onButtonPress() {
    const { selectedStatus, amount, description, token } = this.state;

    var config = {
        headers: {
          'Accept': "application/json",
          'Content-Type' : "application/json",
          'Authorization' : "Bearer " + token,
        }
    };

    if (this.checkInput(selectedStatus, amount)) {
      await axios.put('http://wangku.herokuapp.com/api/transaction/user/' + this.state.id, {
        status: selectedStatus.value,
        amount: amount.replace(/[^,\d]/g, ""),
        description: description
      }, config)
        .then(response => this.setState({
          success: response.data.data.created
        }))
        .catch(error => this.setState({
          error: error.response.data.errors
        }));

      if (this.state.error !== undefined) {
        (this.state.error['status'] != null) ? ToastAndroid.show(this.state.error['status'][0], ToastAndroid.SHORT) : '';
        (this.state.error['amount'] != null) ? ToastAndroid.show(this.state.error['amount'][0], ToastAndroid.SHORT) : '';
      } else if (this.state.success != null || this.state.success != '' || this.state.success != undefined) {
        ToastAndroid.show('Successfully Update Transaction', ToastAndroid.SHORT);
        this.props.navigation.goBack();
      }

      this.setState({
        success: '',
        error: []
      });

    } else {
      ToastAndroid.show('Status & Amount Cannot Empty.', ToastAndroid.SHORT);
    }
  }

  checkInput(selectedStatus, amount) {
    let successInput = false;

    if (selectedStatus !== undefined && amount !== undefined) {
      if (selectedStatus.value !== '') {
        successInput = true;
      }
    }

    return successInput;
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

    await axios.get('http://wangku.herokuapp.com/api/transaction/user/' + this.state.id, config)
      .then(response => this.setState({
        oldStatus: response.data.data.status,
        amount: response.data.data.amount,
        description: response.data.data.description,
        date: response.data.data.date,
        time: response.data.data.time,
        isLoading: false
      }))
      .catch(error => console.log(error.response.data));
      this.formatRupiah(this.state.amount.toString());

      (this.state.oldStatus == "plus") ? (this.setState({ selectedStatus: this.state.status[1] })) : (this.setState({ selectedStatus: this.state.status[2] }));

  }

  componentWillUnmount() {
    const {params} = this.props.navigation.state;
    // console.warn(params.refresh);
    params.getTransactions();
  }

  async componentWillMount() {
    this.setState({isLoading: true});
    await this.getTransactions();
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
  	hasil = prefix == undefined ? rupiah : (rupiah ? '' + rupiah : '');
    this.setState({ amount: hasil })
  }

  renderTransaction() {
    let selectedStatus = this.state.selectedStatus || this.state.status[0];
    return (
      <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
        <View styleName="vertical h-center content" >
          <Subtitle styleName="label">Status</Subtitle>
          <View styleName="selectDropdown">
            <DropDownMenu
              styleName="horizontal"
              options={this.state.status}
              selectedOption={selectedStatus ? selectedStatus : this.state.status[0]}
              onOptionSelected={(status) => this.setState({ selectedStatus: status })}
              titleProperty="name"
              valueProperty="status.value"
            />
          </View>
          <Subtitle styleName="label">Amount</Subtitle>
          <TextInput
            placeholder={'Transaction amount here...'}
            styleName="textInput"
            keyboardType="numeric"
            value={`${this.state.amount}`}
            onChangeText={ amount => this.formatRupiah(amount) }
          />
          <Subtitle styleName="label">Desciption</Subtitle>
          <TextInput
            placeholder={'Transaction description here...'}
            styleName="textInput"
            value={this.state.description}
            onChangeText={ description => this.setState({ description }) }
          />
          <Button styleName="secondary register" onPress={this.onButtonPress.bind(this)}>
            <Text>Update</Text>
          </Button>
        </View>
      </TouchableWithoutFeedback>
    );
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
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
