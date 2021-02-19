/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import {
  StyleSheet, View, Image, Dimensions, ActivityIndicator, Text, Linking
} from 'react-native';
import { connect } from 'react-redux';
import { Card, Button } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import firebase, { NotificationOpen } from 'react-native-firebase';
import {
  setPunchStatus, setPunchOut, setSkip, setPunchInTime, setPunchOutTime, setServerTime, setRulesLinks
} from '../redux/actions/user';
import { getPunchStatus } from '../services/GetPunchStatus';
import { getTheme } from '../services/GetCustomTheme';
import * as themeActions from '../redux/actions/theme';
import { getLegendConfigData } from '../services/GetLegendConfigData';
import { getMessagesData } from '../services/MessagesDataService';

import { setPolicyConfig } from '../redux/actions/policyConfig';
import { setLegendActions } from '../redux/actions/legendActions';
import { setMessageData } from '../redux/actions/messageData';

const displayWidth = Dimensions.get('window').width;
const contantPadding = 30;

const styles = StyleSheet.create({
  img: {
    width: displayWidth - 4 * contantPadding,
    height: (displayWidth - 4 * contantPadding) / 4.86,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  card: {
    height: 220,
    elevation: 3,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25
  },
  textCard: {
    fontSize: 15,
    textAlign: 'center'
  },
  button: {
    height: 45,
    borderRadius: 12,
    marginTop: 20
  },
  buttonLabel: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center'
  },
  buttonContent: { height: 45 },
});
class SplashScreen extends Component {
  state = {
    loading: false,
    updateAvailable: false,
  };

  async componentDidMount() {
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      if (notificationOpen) {
        const { data } = notificationOpen.notification;
        console.log('notificationOpen', data);
        data.NAME = data.EmployeeName;
        data.ProcessIDFromTable = data.ProcessIdFromTable;
        data.UWLID = data.UWLId;
        data.EmployeeId = data.EmployeeNo;
        data.Process = data.ProcessId;
        if (data.ProcessId === 'ATTENDANCECAN') {
          this.props.navigation.navigate('AttCancelApprovalReject', { item: data, shouldRefresh: this.shouldRefresh });
        } else if (data.ProcessId === 'LEAVE') {
          this.props.navigation.navigate('LeaveApprovalReject', { item: data, shouldRefresh: this.shouldRefresh });
        } else if (data.ProcessId === 'ATTENDANCEAPP') {
          this.props.navigation.navigate('AttRegApprovalReject', { item: data, shouldRefresh: this.shouldRefresh });
        } else if (data.ProcessId === 'LEAVECAN') {
          this.props.navigation.navigate('LeaveCancelApprovalReject', { item: data, shouldRefresh: this.shouldRefresh });
        } else if (data.ProcessId === 'SUNDRY EXPENSE') {
          this.props.navigation.navigate('ExpenseApprovalReject', { item: data, shouldRefresh: this.shouldRefresh });
        }
      }
    });

    firebase.notifications().getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          const { data } = notificationOpen.notification;
          console.log('notificationOpen', data);
          data.NAME = data.EmployeeName;
          data.ProcessIDFromTable = data.ProcessIdFromTable;
          data.UWLID = data.UWLId;
          data.EmployeeId = data.EmployeeNo;
          data.Process = data.TransactionId;
          if (data.ProcessId === 'ATTENDANCECAN') {
            this.props.navigation.navigate('AttCancelApprovalReject', { item: data, shouldRefresh: this.shouldRefresh });
          } else if (data.ProcessId === 'LEAVE') {
            this.props.navigation.navigate('LeaveApprovalReject', { item: data, shouldRefresh: this.shouldRefresh });
          } else if (data.ProcessId === 'ATTENDANCEAPP') {
            this.props.navigation.navigate('AttRegApprovalReject', { item: data, shouldRefresh: this.shouldRefresh });
          } else if (data.ProcessId === 'LEAVECAN') {
            this.props.navigation.navigate('LeaveCancelApprovalReject', { item: data, shouldRefresh: this.shouldRefresh });
          } else if (data.ProcessId === 'SUNDRY EXPENSE') {
            this.props.navigation.navigate('ExpenseApprovalReject', { item: data, shouldRefresh: this.shouldRefresh });
          }
        }
      });
    const { user, isLoggedIn } = this.props;
    const baseUrl = `${user.baseUrl}`;

    setTimeout(() => {
      if (isLoggedIn && user) {
        this.setState({ loading: true });
        getPunchStatus(user)
          .then(async (response) => {
            if (response.RulesAndPolicies) {
              this.props.setRulesLinks(response.RulesAndPolicies[0]);
            }
            const versionCode = DeviceInfo.getVersion().split('.')[3];
            if (versionCode < Number(response.EmployeeDetails[0][0].androidVersionCode)) {
              this.setState({
                updateAvailable: true,
                loading: false
              });
            } else {
              if (response.EmployeeDetails[0][0].CanMessagesDataRefresh) {
                const responseTheme = await getTheme(this.props.user, baseUrl);
                if (responseTheme) {
                  this.props.setPrimary(responseTheme.CustomTheme[0].PrimaryStartColorCode);
                  this.props.setSecondary(responseTheme.CustomTheme[0].SecondaryStartColorCode);
                  const resLeg = await getLegendConfigData(this.props.user);
                  if (resLeg) {
                    const legData = resLeg.LegentConfigData[0];
                    this.props.setCalenderLegends(legData);
                    this.props.setPolicyConfig(resLeg.PolicyConfigData[0]);
                    this.props.setLegendActions(resLeg.LegendActionsData[0]);
                    for (let i = 0; i < legData.length; i++) {
                      if (legData[i].AttStatus === 'Present') {
                        this.props.setPresentColor(legData[i].LegendColorCode);
                      } else if (legData[i].AttStatus === 'Leave') {
                        this.props.setLeaveColor(legData[i].LegendColorCode);
                      } else if (legData[i].AttStatus === 'Absent') {
                        this.props.setAbsentColor(legData[i].LegendColorCode);
                      } else if (legData[i].AttStatus === 'Holiday') {
                        this.props.setHolidayColor(legData[i].LegendColorCode);
                      } else if (legData[i].AttStatus === 'Weekly Off') {
                        this.props.setWeeklyOffColor(legData[i].LegendColorCode);
                      } else if (legData[i].AttStatus === 'MissingPunches') {
                        this.props.setMissedPunchColor(legData[i].LegendColorCode);
                      }
                    }
                  }
                }
              }
              if (response.EmployeeDetails[0][0].CanLegendDataRefresh) {
                const resMessageData = await getMessagesData(this.props.user, '', baseUrl);
                if (resMessageData) {
                  this.props.setMessageData(resMessageData.MessagesList[0]);
                  this.props.navigation.navigate('Splash');
                  this.setState({ loading: false });
                }
              }
              if (response.EmployeeDetails[0][0].AttMarked === '0') {
                this.props.setPunchStatus(false);
                this.props.setPunchOut(false);
                this.props.setPunchOutTime(null);
                this.props.setPunchInTime(null);
                this.props.setServerTime(response.EmployeeDetails[0][0].ServerDateTime);
                this.props.navigation.navigate('App');
              } else {
                this.props.setSkip(false);
                this.props.setPunchStatus(true);
                this.props.setPunchInTime(response.EmployeeDetails[0][0].PunchInTime);
                this.props.setServerTime(response.EmployeeDetails[0][0].ServerDateTime);
                if (response.EmployeeDetails[0][0].PunchedOut === '1') {
                  this.props.setPunchOut(true);
                  this.props.setPunchOutTime(response.EmployeeDetails[0][0].PunchOutTime);
                }
                this.props.navigation.navigate('App');
              }
              this.setState({ loading: false });
            }
          }).catch(error => {
            this.setState({ loading: false });
          });
      } else {
        this.props.navigation.navigate('Login');
      }
    }, 1000);
  }

  componentWillUnmount() {
    this.notificationOpenedListener();
  }

  shouldRefresh = (data, index) => {

  }

  onPressUpdate = () => {
    Linking.openURL('market://details?id=com.capl.hrms');
  }

  render() {
    if (this.state.updateAvailable) {
      return (
        <View style={styles.container}>
          <Card style={styles.card}>
            <Image style={styles.img} source={require('../assets/images/logo.png')} />

            <Text style={styles.textCard}>An important update is available.</Text>
            <Text style={styles.textCard}>Please update your app to</Text>
            <Text style={styles.textCard}>continue using it.</Text>
            <Button
              contentStyle={styles.buttonContent}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              mode="contained"
              uppercase
              disabled={this.state.reqesting}
              color={this.props.secondaryColor}
              onPress={() => this.onPressUpdate()}
            >
                      Update
            </Button>
          </Card>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Image style={styles.img} source={require('../assets/images/logo.png')} />
        {
            this.state.loading ? <ActivityIndicator color={this.props.secondaryColor} size="large" /> : null
          }

      </View>
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn,
  isPunched: state.user.isPunched,
  isPunchOut: state.user.isPunchOut,
  isPunchSkip: state.user.isPunchSkip,
  punchInTime: state.user.punchInTime,
  punchOutTime: state.user.punchOutTime,
});


const mapDispatchToProps = dispatch => ({
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
  setServerTime: time => {
    dispatch(setServerTime(time));
  },
  setPrimary: color => {
    dispatch(themeActions.setPrimaryColor(color));
  },
  setSecondary: color => {
    dispatch(themeActions.setSecondaryColor(color));
  },
  setPresentColor: color => {
    dispatch(themeActions.setPresentColor(color));
  },
  setAbsentColor: color => {
    dispatch(themeActions.setAbsentColor(color));
  },
  setHolidayColor: color => {
    dispatch(themeActions.setHolidayColor(color));
  },
  setWeeklyOffColor: color => {
    dispatch(themeActions.setWeeklyOffColor(color));
  },
  setLeaveColor: color => {
    dispatch(themeActions.setLeaveColor(color));
  },
  setMissedPunchColor: color => {
    dispatch(themeActions.setMissedPunchColor(color));
  },
  setPolicyConfig: policy => {
    dispatch(setPolicyConfig(policy));
  },
  setLegendActions: actions => {
    dispatch(setLegendActions(actions));
  },
  setMessageData: messages => {
    dispatch(setMessageData(messages));
  },
  setCalenderLegends: legends => {
    dispatch(themeActions.setCalenderLegends(legends));
  },
  setRulesLinks: links => {
    dispatch(setRulesLinks(links));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SplashScreen);
