/* eslint-disable max-len */
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import {
  Text, View, TouchableOpacity, StyleSheet, ScrollView, Alert, StatusBar,
} from 'react-native';
import { Image, Avatar, Divider } from 'react-native-elements';
import { DrawerActions } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import Item from './DrawerMenuItem';
import { logout } from '../services/Logout';
import {
  setUser, setLoggedIn, setSkip, setPunchOut, setPunchStatus, setPunchInTime, setPunchOutTime, setNotifications, setDashboardData,
  setUnreadNotifications, setPendingTasks, setCompletedTasks,
} from '../redux/actions/user';
import { punchOutService } from '../services/PunchOutService';

const styles = StyleSheet.create({
  container: {
  },
  containerItem: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    margin: 5,
    alignItems: 'center'
  },
  textName: {
    fontSize: 14,
    color: 'white',
  },
  textEmpId: {
    fontSize: 20,
    color: 'white',
  },
  textDesignation: {
    fontSize: 16,
    color: 'white',
  },
  containerExpandedList: {
    flexDirection: 'column',
    marginLeft: 10
  },
  itemExpanded: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 60,
  },
  textExpanded: {
    fontSize: 14,
  },
  profilePic: {
    backgroundColor: 'white',
    borderRadius: 50,
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnClose: {
    position: 'absolute',
    left: 0.0,
    marginStart: 10
  },
  icClose: {
    margin: 5,
    padding: 5
  }
});

class SideDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buildId: DeviceInfo.getVersion(),
    };
  }

  navigateToScreen = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  }

  punchOut=async () => {
    const response = await punchOutService();
    if (response && response.SuccessList) {
      Alert.alert('', 'Punch out success');
    }
  }

  logout = () => {
    Alert.alert(
      'Are you sure?',
      'Do you want to log out?',
      [
        {
          text: 'Cancel',
          onPress: () => {
          },
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: async () => {
            const response = await logout(this.props.user);
            if (response) {
              this.props.setUser({});
              this.props.setLoggedIn(false);
              this.props.setPunchStatus(false);
              this.props.setSkip(false);
              this.props.setPunchOut(false);
              this.props.setPunchOutTime(null);
              this.props.setPunchInTime(null);
              this.props.setNotifications([]);
              this.props.setPendingTasks([]);
              this.props.setCompletedTasks([]);
              this.props.setUnreadNotifications(0);
              this.props.setDashboardData(null);
              this.props.navigation.navigate('Splash');
            }
          }
        },
      ],
      { cancelable: false },
    );
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={{ backgroundColor: this.props.primaryColor, }}>
          <TouchableOpacity style={styles.btnClose} onPress={() => this.props.navigation.dispatch(DrawerActions.closeDrawer())}>
            <Icon name="ios-arrow-round-back" color="white" style={styles.icClose} size={34} />
          </TouchableOpacity>
          <View style={{
            flexDirection: 'row', margin: 20, alignItems: 'center', marginTop: 50
          }}
          >
            <View style={styles.profilePic}>
              {/* <Icon name="md-person" size={60} color={this.props.secondaryColor} /> */}
              <Avatar
                size={100}
                avatarStyle={{ padding: 10, }}
                imageProps={{ resizeMode: 'stretch', }}
                rounded
                source={{
                  uri:
                    this.props.user.AppPath,
                }}
              />
            </View>

            <View style={{ marginLeft: 20, flexShrink: 1 }}>
              {/* <Text style={styles.textEmpId}>{this.props.user.LoginEmpID}</Text> */}
              <Text style={styles.textEmpId}>{this.props.user.LoginEmpName}</Text>
              <Text style={styles.textName}>{this.props.user.EmpPosition}</Text>

              {/* <Text style={styles.textName}>{this.props.user.LoginEmpName}</Text>
              <Text style={styles.textName}>{this.props.user.EmpEMailId}</Text> */}
            </View>
          </View>

          <Text style={{
            fontSize: 12, textAlign: 'right', color: 'white', paddingEnd: 10, paddingBottom: 10
          }}
          >
            {this.state.buildId}
          </Text>
        </View>

        {/* <Item
          title="Update Profile"
          icon="pencil"
          onPress={() => this.navigateToScreen('')}
          family="SimpleLineIcon"
        /> */}
        {/* <View style={{ marginTop: 40 }} /> */}
        <Item
          title="Home"
          icon="home"
          family="SimpleLineIcon"
          onPress={() => this.navigateToScreen('Home')}
        />
        <Item
          title="My Profile"
          icon="user"
          family="SimpleLineIcon"
          onPress={() => this.navigateToScreen('MyProfile')}
        />

        <Item
          title="My Activity"
          icon="activity"
          onPress={() => this.navigateToScreen('')}
          expandable
          family="Feather"
          renderSublist={() => (
            <View style={styles.containerExpandedList}>
              {/* <TouchableOpacity style={styles.itemExpanded} onPress={() => this.navigateToScreen('Requisition')}>
                <Text style={styles.textExpanded}>Requisition</Text>
              </TouchableOpacity> */}
              <TouchableOpacity style={styles.itemExpanded} onPress={() => this.navigateToScreen('MyCalender')}>
                <Text style={styles.textExpanded}>My Calendar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.itemExpanded} onPress={() => this.navigateToScreen('SandryExpenseList')}>
                <Text style={styles.textExpanded}>Sundry Expense</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <Item
          title="Org Chart"
          icon="people"
          onPress={() => this.navigateToScreen('OrgChart')}
          family="SimpleLineIcon"
        />
        <Item
          title="Logout"
          icon="power"
          onPress={() => this.logout()}
          family="SimpleLineIcon"
        />
      </ScrollView>
    );
  }
}


const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn,
  isPunched: state.user.isPunched
});

const mapDispatchToProps = dispatch => ({
  setUser: user => {
    dispatch(setUser(user));
  },
  setLoggedIn: isLoggedIn => {
    dispatch(setLoggedIn(isLoggedIn));
  },
  setPunchStatus: isPunched => {
    dispatch(setPunchStatus(isPunched));
  },
  setSkip: skip => {
    dispatch(setSkip(skip));
  },
  setPunchOut: isPunchOut => {
    dispatch(setPunchOut(isPunchOut));
  },
  setPunchInTime: time => {
    dispatch(setPunchInTime(time));
  },
  setPunchOutTime: time => {
    dispatch(setPunchOutTime(time));
  },
  setNotifications: notifications => {
    dispatch(setNotifications(notifications));
  },
  setDashboardData: dashBoardData => {
    dispatch(setDashboardData(dashBoardData));
  },
  setUnreadNotifications: count => {
    dispatch(setUnreadNotifications(count));
  },
  setCompletedTasks: tasks => {
    dispatch(setCompletedTasks(tasks));
  },
  setPendingTasks: tasks => {
    dispatch(setPendingTasks(tasks));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SideDrawer);
