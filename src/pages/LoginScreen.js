/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import {
  StyleSheet, Text, StatusBar, Image, Dimensions, Alert, Keyboard, View, ActivityIndicator, Platform
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import { attemptLogin } from '../services/LoginService';
import { getMessagesData } from '../services/MessagesDataService';
import { getTheme } from '../services/GetCustomTheme';
import * as themeActions from '../redux/actions/theme';
import { getLegendConfigData } from '../services/GetLegendConfigData';
import {
  setUser, setLoggedIn, setPunchStatus, setPunchInTime, setPunchOutTime
} from '../redux/actions/user';
import { setPolicyConfig } from '../redux/actions/policyConfig';
import { setLegendActions } from '../redux/actions/legendActions';
import { setMessageData } from '../redux/actions/messageData';
import Modal from '../components/ModalSuccess';
import { getCompanyData } from '../services/GetCompanyData';

import Colors from '../config/Colors';

const displayWidth = Dimensions.get('window').width;
const contantPadding = 30;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingLeft: contantPadding,
    paddingRight: contantPadding,
    paddingTop: contantPadding,
    flexGrow: 1,
    marginTop: 50,
  },
  imgTop: {
    width: displayWidth - 4 * contantPadding,
    height: (displayWidth - 4 * contantPadding) / 4.86,
  },
  imgBottom: {
    bottom: 0,
    position: 'absolute',
    width: displayWidth,
    height: displayWidth / 2.18,
    zIndex: -1,
  },
  textWelcome: {
    fontSize: 34,
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50,
    color: Colors.blackText,
  },
  textInput: {
    width: '100%',
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    height: 45,
    borderRadius: 12,
    zIndex: 5,
    marginTop: 20
  },
  iconEye: {
    position: 'absolute',
    right: 0
  },
  containerInputPassword: {
    flexDirection: 'row',
    alignItems: 'center',
  }

});

class LoginScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    userName: '',
    password: '',
    reqesting: false,
    passwordVisibility: false,
    isModalVisible: false,
    modalMessage: '',
    loading: true,
    companyData: [],
    // selectedValue: null,
    // pickerLabel: 'Select Company'
    companyCode: '',
    fcmToken: '',
  };

  async componentDidMount() {
    const response = await getCompanyData();
    if (response) {
      this.setState({
        loading: false,
        companyData: response.companyData[0],
      });
    }
    const fcmToken = await firebase.messaging().getToken();
    this.setState({
      fcmToken,
    });
  }

  onPressLogin =() => {
    Keyboard.dismiss();
    const { userName, password, companyCode } = this.state;
    if (companyCode) {
      if (userName && password) {
        let code = null;
        let baseUrl = null;
        for (let i = 0; i < this.state.companyData.length; i++) {
          if (Number(companyCode) === this.state.companyData[i].CompanyCode) {
            code = this.state.companyData[i].CompanyCode;
            baseUrl = this.state.companyData[i].APIUrl;
            break;
          }
        }
        if (baseUrl) {
          this.setState({ reqesting: true }, async () => {
            try {
              const payload = {
                loginDetails: {
                  LoginEmpID: userName,
                  Password: password,
                  LoginEmpCompanyCodeNo: code,
                  fcmToken: this.state.fcmToken,
                  deviceOs: Platform.OS === 'android' ? 'Android' : 'iOS',
                  deviceId: DeviceInfo.getDeviceId(),
                  uniqueId: DeviceInfo.getUniqueId(),
                }
              };
              baseUrl = `${baseUrl}/api`;
              const response = await attemptLogin(payload, baseUrl);
              if (response.EmployeeDetails) {
                const employeeDetails = response.EmployeeDetails[0];
                const user = employeeDetails[0];
                user.baseUrl = baseUrl;
                this.props.setUser(user);
                this.props.setLoggedIn(true);
                const responseTheme = await getTheme(this.props.user, baseUrl);
                if (responseTheme) {
                  this.props.setPrimary(responseTheme.CustomTheme[0].PrimaryStartColorCode);
                  this.props.setSecondary(responseTheme.CustomTheme[0].SecondaryStartColorCode);
                  const resLeg = await getLegendConfigData(this.props.user, baseUrl);
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
                    const resMessageData = await getMessagesData(this.props.user, '', baseUrl);
                    if (resMessageData) {
                      this.props.setMessageData(resMessageData.MessagesList[0]);
                      this.props.navigation.navigate('Splash');
                      this.setState({ reqesting: false });
                    } else {
                      Alert.alert('', 'Please try again');
                    }
                  } else {
                    Alert.alert('', 'Please try again');
                  }
                } else {
                  Alert.alert('', 'Please try again');
                }
              } else if (response.ErrorList) {
                const msg = 'Please enter valid user name and password';
                this.setState({
                  isModalVisible: true,
                  modalMessage: msg
                });
                this.setState({ reqesting: false });
              } else {
                const msg = 'Please enter valid user name and password';
                this.setState({
                  isModalVisible: true,
                  modalMessage: msg
                });
                this.setState({ reqesting: false });
              }
            } catch (error) {
              // console.log(error);
              this.setState({ reqesting: false });
            }
          });
        } else {
          const msg = 'Invalid company code';
          this.setState({
            isModalVisible: true,
            modalMessage: msg
          });
          this.setState({ reqesting: false });
        }
      } else {
        const msg = 'Please enter user name and password';
        this.setState({
          isModalVisible: true,
          modalMessage: msg
        });
        this.setState({ reqesting: false });
      }
    } else {
      const msg = 'Please enter company code';
      this.setState({
        isModalVisible: true,
        modalMessage: msg
      });
      this.setState({ reqesting: false });
    }
  }

  togglePasswordVisibility= () => {
    this.setState((prevState) => ({
      passwordVisibility: !prevState.passwordVisibility,
    }));
  }

  // onValueChange = (value) => {
  //   if (value !== '0') {
  //     this.setState({ selectedValue: value });
  //   } else {
  //     this.setState({ selectedValue: '' });
  //   }
  // }

  render() {
    return (
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, }}
        contentContainerStyle={styles.container}
      >
        <StatusBar translucent barStyle="light-content" backgroundColor="white" />
        <Modal
          isVisible={this.state.isModalVisible}
          text={this.state.modalMessage}
          hideModal={() => this.setState({ isModalVisible: false })}
          type="E"
        />
        <Image style={styles.imgTop} source={require('../assets/images/logo.png')} />
        <Text style={styles.textWelcome}>Welcome</Text>

        {
  this.state.loading
    ? <ActivityIndicator size="large" color={this.props.secondaryColor} />
    : (
      <View style={{
        width: '100%', alignItems: 'center', marginBottom: 100
      }}
      >

        {/* <Picker
          mode="dropdown"
          selectedValue={this.state.selectedValue}
          style={{ height: 50, width: '100%' }}
          onValueChange={(itemValue) => this.onValueChange(itemValue)}
        >
          <Picker.Item label={this.state.pickerLabel} value="0" />
          {
          this.state.companyData.map(value => <Picker.Item key={value.CompanyCode} label={value.CompanyName} value={value.APIUrl} />)
        }
        </Picker> */}

        <TextInput
          label="Company Code"
          mode="flat"
          numberOfLines={1}
          keyboardType="number-pad"
          value={this.state.companyCode}
          style={styles.textInput}
          selectionColor={this.props.secondaryColor}
          maxLength={6}
          onChangeText={text => this.setState({ companyCode: text })}
          returnKeyType="next"
          onSubmitEditing={() => { this.userName.focus(); }}
          blurOnSubmit={false}
        />
        <TextInput
          ref={(input) => { this.userName = input; }}
          label="User Name"
          mode="flat"
          numberOfLines={1}
          value={this.state.userName}
          style={styles.textInput}
          selectionColor={this.props.secondaryColor}
          maxLength={10}
          onChangeText={text => this.setState({ userName: text })}
          returnKeyType="next"
          onSubmitEditing={() => { this.Password.focus(); }}
          blurOnSubmit={false}
        />

        <View style={styles.containerInputPassword}>
          <TextInput
            label="Password"
            mode="flat"
            secureTextEntry={!this.state.passwordVisibility}
            numberOfLines={1}
            selectionColor={this.props.secondaryColor}
            style={styles.textInput}
            value={this.state.password}
            ref={(input) => { this.Password = input; }}
            blurOnSubmit
            onSubmitEditing={() => this.onPressLogin()}
            onChangeText={text => this.setState({ password: text })}
          />

          <Icon
            name={this.state.passwordVisibility ? 'md-eye-off' : 'md-eye'}
            style={styles.iconEye}
            size={28}
            color="gray"
            onPress={() => this.togglePasswordVisibility()}
          />
        </View>
        <Button
          uppercase={false}
          onPress={() => this.props.navigation.navigate('ForgotPassword', {
            companyData: this.state.companyData
          })}
        >
          Forgot Password?
        </Button>

        <Button
          loading={this.state.reqesting}
          disabled={this.state.reqesting}
          contentStyle={{ height: 45 }}
          style={styles.button}
          labelStyle={{ color: 'white', fontSize: 18, textAlign: 'center' }}
          mode="contained"
          uppercase={false}
          onPress={() => this.onPressLogin()}
        >
          Login
        </Button>


      </View>
    )
}

        <Image style={styles.imgBottom} source={require('../assets/images/login_bg.png')} />
      </KeyboardAwareScrollView>
    );
  }
}


const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn,
  policyConfig: state.policy.policyConfig,
  legendActions: state.legendActions.legendActions,
  messages: state.messageData.messages,
  punchInTime: state.user.punchInTime,
  punchOutTime: state.user.punchOutTime,
});

const mapDispatchToProps = dispatch => ({
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
  setCalenderLegends: legends => {
    dispatch(themeActions.setCalenderLegends(legends));
  },
  setUser: user => {
    dispatch(setUser(user));
  },
  setLoggedIn: isLoggedIn => {
    dispatch(setLoggedIn(isLoggedIn));
  },
  setPunchStatus: isPunched => {
    dispatch(setPunchStatus(isPunched));
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
  setPunchInTime: time => {
    dispatch(setPunchInTime(time));
  },
  setPunchOutTime: time => {
    dispatch(setPunchOutTime(time));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);
