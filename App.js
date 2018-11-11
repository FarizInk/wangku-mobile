import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Font, AppLoading } from "expo";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import {
  Icon
} from '@shoutem/ui';

import AuthLoadingScreen from './screens/AuthLoadingScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import SearchScreen from './screens/SearchScreen';
import GroupScreen from './screens/GroupScreen';
import AddTransaction from './screens/transactions/AddTransactionScreen';
import DetailTransaction from './screens/transactions/DetailTransactionScreen';
import EditTransaction from './screens/transactions/EditTransactionScreen';

const AuthStackNavigator = createStackNavigator({
  Welcome: WelcomeScreen,
  SignIn: SignInScreen,
  SignUp: SignUpScreen
}, {

});

const AppTabNavigator = createMaterialTopTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({tintColor}) => (
        <Icon name='equalizer' style={{color: tintColor}} size={24} />
      )
    }
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({tintColor}) => (
        <Icon name="user-profile" style={{color: tintColor}} size={24}/>
      )
    }
  },
  Transactions: {
    screen: TransactionsScreen,
    navigationOptions: {
      tabBarLabel: 'Transactions',
      tabBarIcon: ({tintColor}) => (
        <Icon name="receipt" style={{color: tintColor}} size={24}/>
      )
    }
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      tabBarLabel: 'Search',
      tabBarIcon: ({tintColor}) => (
        <Icon name="search" style={{color: tintColor}} size={24}/>
      )
    }
  },
  Group: {
    screen: GroupScreen,
    navigationOptions: {
      tabBarLabel: 'Group',
      tabBarIcon: ({tintColor}) => (
        <Icon name="users" style={{color: tintColor}} size={24}/>
      )
    }
  },
}, {
  initialRouteName: 'Home',
  order: ['Transactions', 'Group', 'Home', 'Search', 'Profile'],
  swipeEnabled: true,
  shifting: false,
  animationEnabled: false,
  tabBarPosition: 'bottom',
  navigationOptions: {
    tabBarVisible: true,
  },
  tabBarOptions: {
    activeTintColor: '#311B92',
    inactiveTintColor: 'grey',
    style: {
      backgroundColor: 'white'
    },
    indicatorStyle: {
      height: 0
    },
    showIcon: true,
    showLabel: false,
  }
});

const AppStackNavigator = createStackNavigator({
  AppTabNavigator: {
    screen: AppTabNavigator,
    navigationOptions: ({ navigation }) => ({
      header: null,
      title: 'Wangku',
    })
  },
  AddTransaction: AddTransaction,
  DetailTransaction: DetailTransaction,
  EditTransaction: EditTransaction,
});

// const AppDrawerNavigator = createDrawerNavigator({
//   Home: AppStackNavigator
// });

const AppNavigator = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Auth: AuthStackNavigator,
  App: AppStackNavigator
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentWillMount() {
    await Font.loadAsync({
      "rubicon-icon-font" : require('@shoutem/ui/fonts/rubicon-icon-font.ttf'),
      "Rubik-Regular" : require('@shoutem/ui/fonts/Rubik-Regular.ttf'),
    });
    this.setState({ loading: false });
  }

 render() {
   if (this.state.loading) {
      return (
        <AppLoading />
      );
    }
    return (
        <AppNavigator />
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
