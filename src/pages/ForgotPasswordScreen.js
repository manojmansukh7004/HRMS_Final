/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  StyleSheet, Text, StatusBar, Image, Dimensions, Alert, Keyboard, Picker
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, Button } from 'react-native-paper';
import Colors from '../config/Colors';
import Modal from '../components/ModalSuccess';
import { forgotPassword } from '../services/ForgotPasswordService';

const displayWidth = Dimensions.get('window').width;
const contantPadding = 30;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingLeft: contantPadding,
    paddingRight: contantPadding,
    paddingTop: contantPadding,
    flexGrow: 1,
  },
  imgTop: {
    width: displayWidth - 4 * contantPadding,
    height: (displayWidth - 4 * contantPadding) / 4.86,
    marginTop: 50
  },
  imgBottom: {
    bottom: 0,
    position: 'absolute',
    width: displayWidth,
    height: displayWidth / 2.18,
  },
  textWelcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50,
    color: Colors.blackText,
  },
  textInput: {
    width: '100%',
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    height: 45,
    borderRadius: 12,
    zIndex: 5,
    marginTop: 20,
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

class ForgotPasswordScreen extends Component {
  // eslint-disable-next-line react/sort-comp
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      loading: false,
      isModalVisible: false,
      modalMessage: '',
      modalType: 'E',
      selectedValue: null,
      // pickerLabel: 'Select Company',
      companyData: this.props.navigation.getParam('companyData'),
      companyCode: '',
    };
  }

  onPressSubmit =async () => {
    Keyboard.dismiss();
    const { companyCode } = this.state;
    if (companyCode) {
      if (this.state.userName.trim()) {
        this.setState({ loading: true });
        let baseUrl = null;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.state.companyData.length; i++) {
          if (Number(companyCode) === this.state.companyData[i].CompanyCode) {
            baseUrl = this.state.companyData[i].APIUrl;
            break;
          }
        }
        if (baseUrl) {
          baseUrl = `${baseUrl}/api`;
          const response = await forgotPassword(this.state.userName, baseUrl);
          if (response) {
            if (response.SuccessList) {
              const msg = 'Password sent successfully to your Email Id.';
              this.setState({
                isModalVisible: true,
                modalMessage: msg,
                modalType: 'S',
                userName: '',
                companyCode: ''
              });
              this.setState({ loading: false });
              // this.props.navigation.goBack();
            } else {
              const msg = 'Invalid user name';
              this.setState({
                isModalVisible: true,
                modalMessage: msg,
                modalType: 'E'
              });
              this.setState({ loading: false });
            }
          } else {
            Alert.alert('Error', 'Something went wrong. Please try agian...');
          }
        } else {
          const msg = 'Invalid company code';
          this.setState({
            isModalVisible: true,
            modalMessage: msg
          });
          this.setState({ loading: false });
        }
      } else {
        const msg = 'Please enter user name';
        this.setState({
          isModalVisible: true,
          modalMessage: msg,
          modalType: 'E'
        });
        this.setState({ loading: false });
      }
    } else {
      const msg = 'Please enter company code';
      this.setState({
        isModalVisible: true,
        modalMessage: msg
      });
      this.setState({ loading: false });
    }
  }

  onModalDismiss = () => {
    if (this.state.modalType === 'S') {
      this.props.navigation.goBack();
    }
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
        style={{ flex: 1, }}
        contentContainerStyle={styles.container}
      >
        <StatusBar translucent barStyle="light-content" backgroundColor="white" />
        <Modal
          isVisible={this.state.isModalVisible}
          text={this.state.modalMessage}
          hideModal={() => this.setState({ isModalVisible: false })}
          type={this.state.modalType}
          onDismiss={() => this.onModalDismiss()}
        />
        <Image style={styles.imgTop} source={require('../assets/images/logo.png')} />
        <Text style={styles.textWelcome}>Forgot Password?</Text>

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
          maxLength={10}
          selectionColor={this.props.secondaryColor}
          onChangeText={text => this.setState({ userName: text })}
          onSubmitEditing={() => this.onPressSubmit()}
        />

        <Button
          loading={this.state.loading}
          disabled={this.state.loading}
          contentStyle={{ height: 45 }}
          style={styles.button}
          labelStyle={{ color: 'white', fontSize: 14, textAlign: 'center' }}
          mode="contained"
          uppercase={false}
          onPress={() => this.onPressSubmit()}
        >
          Submit
        </Button>

        <Button
          contentStyle={{ height: 45 }}
          style={[styles.button]}
          labelStyle={{ color: 'white', fontSize: 14, textAlign: 'center' }}
          mode="contained"
          color="#f27024"
          uppercase={false}
          disabled={this.state.loading}
          onPress={() => this.props.navigation.goBack()}
        >
          Cancel
        </Button>

        <Image style={styles.imgBottom} source={require('../assets/images/login_bg.png')} />
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
});

export default connect(
  mapStateToProps,
)(ForgotPasswordScreen);
