import React, { Component } from 'react';
import {
  View,
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
  View as ShoutemView,
  getTheme,
  TextInput,
  DropDownMenu,
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
});

var DismissKeyboard = require('dismissKeyboard');

export default class AddTransactionScreen extends Component {
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

  state = {id: '', amount: '', description: '', token: '', success: '', error: [], oldStatus: '', isLoading: true};

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
        amount: amount,
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
        this.setState({ zstatus: selectedStatus.value })
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

    axios.get('http://wangku.herokuapp.com/api/transaction/user/' + this.state.id, config)
      .then(response => this.setState({
        oldStatus: response.data.data.status,
        amount: response.data.data.amount,
        description: response.data.data.description,
        date: response.data.data.date,
        time: response.data.data.time,
        isLoading: false
      }))
      .catch(error => console.warn(error.response.data));
  }

  componentWillUnmount() {
    const {params} = this.props.navigation.state;
    // console.warn(params.refresh);
    params.getTransactions();
  }

  async componentWillMount() {
    this.setState({isLoading: true});
    await this.getTransactions();
    (this.state.selectedStatus == undefined) ? ((this.state.oldStatus == 'plus') ?  this.setState({ selectedStatus: this.state.status[1] }) : this.setState({ selectedStatus: this.state.status[2] })) : false;
  }

  renderTransaction() {
    let selectedStatus = this.state.selectedStatus || this.state.status[0];
    return (
      <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
        <ShoutemView styleName="vertical h-center content" >
          <DropDownMenu
            styleName="horizontal"
            options={this.state.status}
            selectedOption={selectedStatus ? selectedStatus : this.state.status[0]}
            onOptionSelected={(status) => this.setState({ selectedStatus: status })}
            titleProperty="name"
            valueProperty="status.value"
          />
          <TextInput
            placeholder={'Amount'}
            styleName="textInput"
            keyboardType="numeric"
            value={`${this.state.amount}`}
            onChangeText={ amount => this.setState({ amount }) }
          />
          <TextInput
            placeholder={'Description'}
            styleName="textInput"
            value={this.state.description}
            onChangeText={ description => this.setState({ description }) }
          />
          <Button styleName="secondary register" onPress={this.onButtonPress.bind(this)}>
            <Text>Update</Text>
          </Button>
        </ShoutemView>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return (
      <StyleProvider style={theme}>
          {this.state.isLoading ? (
            <View style={styles.container}>
              <ActivityIndicator
                animating
                size="large"
                style={styles.activityIndicator}
              />
            </View>
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
