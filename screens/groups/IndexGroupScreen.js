import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import {
  Text,
  View,
  Icon,
  Button
} from '@shoutem/ui';
import { createStackNavigator, createDrawerNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import HomeGroupScreen from './HomeGroupScreen';
import TransactionsGroupScreen from './TransactionsGroupScreen';
import AboutGroupScreen from './AboutGroupScreen';
import AddGroupTransactionScreen from './transactions/AddTransactionScreen';
import AddMemberScreen from './members/AddMemberScreen';

const GroupTabNavigator = createMaterialTopTabNavigator({
  Home: {
    screen: HomeGroupScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({tintColor}) => (
        <Icon name="equalizer" style={{color: tintColor}} size={24}/>
      )
    }
  },
  Transactions: {
    screen: TransactionsGroupScreen,
    navigationOptions: {
      tabBarLabel: 'Transactions',
      tabBarIcon: ({tintColor}) => (
        <Icon name="receipt" style={{color: tintColor}} size={24}/>
      )
    }
  },
  About: {
    screen: AboutGroupScreen,
    navigationOptions: {
      tabBarLabel: 'About',
      tabBarIcon: ({tintColor}) => (
        <Icon name="about" style={{color: tintColor}} size={24}/>
      )
    }
  }
}, {
  initialRouteName: 'Home',
  order: ['Home', 'Transactions', 'About'],
  swipeEnabled: true,
  shifting: false,
  animationEnabled: true,
  tabBarPosition: 'top',
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
      height: 2,
      backgroundColor: '#311B92'
    },
    showIcon: true,
    showLabel: false,
  }
});

const GroupStackNavigator = createStackNavigator({
  GroupTabNavigator: {
    screen: GroupTabNavigator,
    navigationOptions: ({ navigation }) => ({
      header: null,
      title: 'Group',
    })
  },
  AddGroupTransactionScreen: AddGroupTransactionScreen,
  AddMemberScreen: AddMemberScreen
});

export default class IndexGroupScreen extends Component {
  static navigationOptions = ({navigation}) => {
      const { params = {} } = navigation.state;
      return {
          title: params.name,
          headerTitleStyle :{color:'#fff'},
          headerStyle: {backgroundColor:'#311B92'},
          headerLeftStyle: {color:'#fff'},
          headerLeft: (
            <Button styleName="clear" onPress={ () => { navigation.goBack() } }>
              <Icon name="back" style={{ color: "white" }} />
            </Button>
          ),
          headerRight: (
            <Button styleName="clear" onPress={ () => { navigation.navigate("AddGroupTransactionScreen",
              { gid: params.id }) } }>
              <Icon name="search" style={{ color: "#FFDE03" }} />
            </Button>
          )
      };
  };

  async componentWillMount() {
    this.setState({
      isLoading: true
    });
    const { params } = await this.props.navigation.state;
    await this.setState({ groupId: params.id })
    await AsyncStorage.setItem('groupId', this.state.groupId.toString())
    setTimeout(() => {this.setState({isLoading: false})}, 2000)
  }

  componentWillUnmount() {
    AsyncStorage.setItem('groupId', null)
  }

  render() {
    return (
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
          <GroupStackNavigator />
        )}
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
