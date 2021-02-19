/* eslint-disable max-len */
/* eslint-disable no-else-return */
/* eslint-disable no-console */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, PermissionsAndroid, Platform,
} from 'react-native';
import { connect } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { getPunchStatus } from '../services/GetPunchStatus';
import { setPunchStatus, setPunchOut, setPunchOutTime } from '../redux/actions/user';
import { punchOutService } from '../services/PunchOutService';
import getMessage from '../config/GetMessage';
import MessageModal from './MessageModal';

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 2,
    width: 100,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 4,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  point: {
    height: 22, width: 22, borderRadius: 11
  },
  row: {
    flexDirection: 'row',
  }
});

class HomePunchComponent extends Component {
  state={
    loading: false,
    isModalVisible: false,
    modalMessage: '',
    modalType: '',
  };

  onModalHide = () => {
  }

  requestLocationPermission =async () => {
    this.setState({ loading: true });
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: 'Location Access Required',
            message: 'This App needs to Access your location'
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            async (position) => {
              const response = await punchOutService(
                this.props.user,
                position.coords.longitude,
                position.coords.latitude,
                '',
              );
              if (response) {
                if (response.SuccessList) {
                  // this.props.setPunchStatus(false);
                  const responsePunchStatus = await getPunchStatus(this.props.user);
                  if (responsePunchStatus) {
                    this.props.setPunchOutTime(responsePunchStatus.EmployeeDetails[0][0].PunchOutTime);
                    this.props.setPunchOut(true);
                  }
                  this.setState({ loading: false });
                  const msg = getMessage(response.SuccessList.toString(), this.props.messages);
                  if (msg) {
                    this.setState({
                      isModalVisible: true,
                      modalMessage: msg.message,
                      modalType: msg.type
                    });
                  } else if (response.SuccessList) {
                    Alert.alert('', response.SuccessList.toString());
                  } else {
                    Alert.alert('', 'Successfully punched out.');
                  }
                } else {
                  this.setState({ loading: false });
                  const msg = getMessage(response.ErrorList.toString(), this.props.messages);
                  if (msg) {
                    this.setState({
                      isModalVisible: true,
                      modalMessage: msg.message,
                      modalType: msg.type
                    });
                  } else {
                    Alert.alert('Error', 'Something went wrong');
                  }
                }
              }
            }, async (error) => {
              console.log(error);
              const response = await punchOutService(
                this.props.user,
                '',
                '',
                '',
              );
              if (response) {
                if (response.SuccessList) {
                  // this.props.setPunchStatus(false);
                  this.props.setPunchOut(true);
                  this.props.setPunchOutTime(new Date());
                  this.setState({ loading: false });
                  Alert.alert('', 'Successfully punched out.');
                } else {
                  Alert.alert('Error', 'Something went wrong');
                  this.setState({ loading: false });
                }
              }
            },
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 0 }
          );
        } else {
          Alert.alert('Permission Denied');
          this.setState({ loading: false });
        }
      } catch (err) {
        console.log(err);
        this.setState({ loading: false });
      }
    } else {
      try {
        Geolocation.getCurrentPosition(
          async (position) => {
            const response = await punchOutService(
              this.props.user,
              position.coords.longitude,
              position.coords.latitude,
              '',
            );
            if (response) {
              if (response.SuccessList) {
                // this.props.setPunchStatus(false);
                const responsePunchStatus = await getPunchStatus(this.props.user);
                if (responsePunchStatus) {
                  this.props.setPunchOutTime(responsePunchStatus.EmployeeDetails[0][0].PunchOutTime);
                  this.props.setPunchOut(true);
                }
                this.setState({ loading: false });
                const msg = getMessage(response.SuccessList.toString(), this.props.messages);
                if (msg) {
                  this.setState({
                    isModalVisible: true,
                    modalMessage: msg.message,
                    modalType: msg.type
                  });
                } else if (response.SuccessList) {
                  Alert.alert('', response.SuccessList.toString());
                } else {
                  Alert.alert('', 'Successfully punched out.');
                }
              } else {
                this.setState({ loading: false });
                const msg = getMessage(response.ErrorList.toString(), this.props.messages);
                if (msg) {
                  this.setState({
                    isModalVisible: true,
                    modalMessage: msg.message,
                    modalType: msg.type
                  });
                } else {
                  Alert.alert('Error', 'Something went wrong');
                }
              }
            }
          }, async (error) => {
            console.log(error);
            const response = await punchOutService(
              this.props.user,
              '',
              '',
              '',
            );
            if (response) {
              if (response.SuccessList) {
                // this.props.setPunchStatus(false);
                this.props.setPunchOut(true);
                this.props.setPunchOutTime(new Date());
                this.setState({ loading: false });
                Alert.alert('', 'Successfully punched out.');
              } else {
                Alert.alert('Error', 'Something went wrong');
                this.setState({ loading: false });
              }
            }
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 0 }
        );
      } catch (error) {
        this.setState({ loading: false });
      }
    }
  }

  onPress= () => {
    if (!this.props.isPunched) {
      this.props.navigate('PunchIn');
    } else if (!this.props.isPunchOut) {
      Alert.alert(
        'Punch out',
        'Are you sure you want to proceed?',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: async () => {
              // eslint-disable-next-line no-inner-declarations

              await this.requestLocationPermission();
            }
          },
        ],
        { cancelable: false },
      );
    }
  }

  render() {
    if (this.state.loading) {
      return (<ActivityIndicator color={this.props.secondaryColor} size="small" />);
    } else if (this.props.isPunchOut) {
      return null;
    } else if (!this.props.isPunched) {
      return (
        <TouchableOpacity onPress={this.onPress} activeOpacity={0.5}>
          <View style={[styles.container, { borderColor: 'gray' }]}>

            <MessageModal
              isVisible={this.state.isModalVisible}
              message={this.state.modalMessage}
              type={this.state.modalType}
              hideModal={() => this.setState({ isModalVisible: false })}
              onModalHide={() => this.onModalHide()}
            />

            <View style={[styles.point, { backgroundColor: 'gray' }]} />
            <Text style={{ color: 'gray', fontSize: 12 }}>Punch In</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={this.onPress} activeOpacity={0.5}>
        <View style={[styles.container, { borderColor: this.props.primaryColor }]}>

          <MessageModal
            isVisible={this.state.isModalVisible}
            message={this.state.modalMessage}
            type={this.state.modalType}
            hideModal={() => this.setState({ isModalVisible: false })}
            onModalHide={() => this.onModalHide()}
          />
          <Text style={{ color: this.props.primaryColor, fontSize: 12 }}>Punch Out</Text>
          <View style={[styles.point, { backgroundColor: this.props.secondaryColor }]} />
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn,
  isPunched: state.user.isPunched,
  isPunchSkip: state.user.isPunchSkip,
  isPunchOut: state.user.isPunchOut,
  messages: state.messageData.messages,
});

const mapDispatchToProps = dispatch => ({
  setPunchStatus: isPunched => {
    dispatch(setPunchStatus(isPunched));
  },
  setPunchOut: isPunchOut => {
    dispatch(setPunchOut(isPunchOut));
  },
  setPunchOutTime: time => {
    dispatch(setPunchOutTime(time));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePunchComponent);
