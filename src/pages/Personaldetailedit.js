/* eslint-disable max-len */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';
import { Picker } from 'native-base';
import { connect } from 'react-redux';
import { Button, Card } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spinner: true,
      mstatus: '',
      EmployeeNumber: '',
      FirstName1: this.props.navigation.getParam('FNAME', ''),
      MiddleName1: this.props.navigation.getParam('MNAME', ''),
      LastName1: this.props.navigation.getParam('LNAME', ''),
      Gender1: this.props.navigation.getParam('GEN', ''),
      Maritalstatus1: this.props.navigation.getParam('MARS', ''),
      Nationality1: this.props.navigation.getParam('NATION', ''),
      NameShown1: this.props.navigation.getParam('NAMESH', ''),
      BlodGroup: this.props.navigation.getParam('BG', ''),
      BlodGr: this.props.navigation.getParam('BloodGr', ''),
      birthdate: this.props.navigation.getParam('Birth', ''),
      startdate: this.props.navigation.getParam('Start', ''),
      enddate: this.props.navigation.getParam('End', ''),
      genderid: this.props.navigation.getParam('Genderid', ''),
      nationid: this.props.navigation.getParam('Nationid', ''),
      hello: [],
      dataSource: [],
      PickerValueHolder: '0',
    };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.GetMyProfileData();
  }

  update = () => {
    this.setState({ spinner: true, });
    this.updatepersonal();
  };


onModalHide = () => {
  const { params } = this.props.navigation.state;
  params.callHome();
  this.props.navigation.goBack();
}

updatepersonal() {
  const myarray = {
    loginDetails:
  {
    LoginEmpID: this.props.user.LoginEmpID,
    LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
  },
    infoTypeData:
  {
    CompanyCode: this.props.user.LoginEmpCompanyCodeNo,
    StartDate: this.state.startdate,
    EndDate: this.state.enddate,
    EmpId: this.props.user.LoginEmpID,
    FirstName: this.state.FirstName1,
    MiddleName: this.state.MiddleName1,
    LastName: this.state.LastName1,
    NameShown: this.state.NameShown1,
    BirthDate: this.state.birthdate,
    Gender: this.state.genderid,
    Nationality: this.state.nationid,
    MaritalStatus: this.state.PickerValueHolder,
    BloodGroup: this.state.BlodGroup,
  }
  };

  return fetch(`${this.props.user.baseUrl}/MyProfile/UpdateBasicInfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(myarray),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState(
        {
          isLoading: false,
          loading: false,
          spinner: false,

        },
      );

      if (responseJson) {
        if (responseJson.SuccessList) {
          const msg = getMessage(responseJson.SuccessList.toString(), this.props.messages);
          this.setState({
            isModalVisible: true,
            modalMessage: msg.message,
            modalType: msg.type,
            loadingApprove: false
          });
        } else if (responseJson.ErrorList) {
          const msg = getMessage(responseJson.ErrorList.toString(), this.props.messages);
          this.setState({
            isModalVisible: true,
            modalMessage: msg.message,
            modalType: msg.type,
            loadingApprove: false
          });
        }
      } else {

      }
    })
    .catch(() => {

    });
}

GetMyProfileData() {
  this.setState({ spinner: false, });

  const myarray = {
    loginDetails:
  {
    LoginEmpID: this.props.user.LoginEmpID,
    LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
  }
  };

  return fetch(`${this.props.user.baseUrl}/MyProfile/GetMyProfileData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(myarray),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState(
        {
          isLoading: false,
          loading: false,
          dataSource: responseJson.ProfileData[0]['Marital Status Data'],

        },
      );


      for (let i = 0; i < responseJson.ProfileData[0]['Marital Status Data'].length; i++) {
        if (this.state.Maritalstatus1 === responseJson.ProfileData[0]['Marital Status Data'][i].FAMST) {
          this.setState({ PickerValueHolder: responseJson.ProfileData[0]['Marital Status Data'][i].FAMSTVal, });
        }
      }
    })
    .catch(() => {

    });
}

render() {
  const { secondaryColor } = this.props;
  return (
    <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>

      <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>


        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <MessageModal
              isVisible={this.state.isModalVisible}
              message={this.state.modalMessage}
              type={this.state.modalType}
              hideModal={() => this.setState({ isModalVisible: false })}
              onModalHide={() => this.onModalHide()}
            />
            <View style={{
              width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}
            >
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                  }}
                  >
                    <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 11, }}>First Name</Text>
                    <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 14, }}>{this.state.FirstName1}</Text>

                  </View>
                </Card>
              </View>
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                  }}
                  >
                    <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 11, }}>Middle Name</Text>
                    <Text style={{ marginLeft: 10, color: '#00000050', fontSize: 14, }}>{this.state.MiddleName1}</Text>

                  </View>
                </Card>
              </View>

            </View>
            <View style={{
              width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}
            >
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                  }}
                  >
                    <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 11, }}>Last Name</Text>
                    <Text style={{ marginLeft: 10, color: '#00000050', fontSize: 14, }}>{this.state.LastName1}</Text>

                  </View>
                </Card>
              </View>
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                  }}
                  >
                    <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 11, }}>Name Shown</Text>
                    <Text style={{ marginLeft: 10, color: '#00000050', fontSize: 14, }}>{this.state.NameShown1}</Text>

                  </View>
                </Card>
              </View>

            </View>
            <View style={{
              width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}
            >
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                  }}
                  >
                    <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 11, }}>Birth Date</Text>
                    <Text style={{ marginLeft: 10, color: '#00000050', fontSize: 14, }}>23 Feb 1995</Text>

                  </View>
                </Card>
              </View>
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                  }}
                  >
                    <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 11, }}>Gender</Text>
                    <Text style={{ marginLeft: 10, color: '#00000050', fontSize: 14, }}>{this.state.Gender1}</Text>

                  </View>
                </Card>
              </View>

            </View>
            <View style={{
              width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}
            >
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                  }}
                  >
                    <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 11, }}>Nationality</Text>
                    <Text style={{ marginLeft: 10, color: '#00000050', fontSize: 14, }}>{this.state.Nationality1}</Text>

                  </View>
                </Card>
              </View>
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                  }}
                  >
                    <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 11, }}>Blood Group</Text>
                    <Text style={{ marginLeft: 10, color: '#00000050', fontSize: 14, }}>{this.state.BlodGr}</Text>

                  </View>
                </Card>
              </View>

            </View>
            <View style={{
              width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}
            >
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
              >
                <Card style={styles.cards}>
                  <View style={{
                    width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                  }}
                  >
                    <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>Marital Status</Text>
                    <Picker
                      style={{ height: 30 }}
                      selectedValue={this.state.PickerValueHolder}
                      mode="dropdown"
                      onValueChange={(itemValue) => this.setState({ PickerValueHolder: itemValue })}
                    >

                      { this.state.dataSource.map((item, key) => (
                        <Picker.Item label={item.FAMST} value={item.FAMSTVal} key={key} />))}

                    </Picker>

                  </View>
                </Card>
              </View>
              <View style={{
                width: wp('50%'), height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
              >
                <View style={{
                  width: wp('43%'), height: 55, borderRadius: 5, flexDirection: 'column', justifyContent: 'center',
                }}
                />

              </View>

            </View>

            <Button
              loading={this.state.spinner}
              disabled={this.state.spinner}
              contentStyle={{ height: 45, }}
              icon="arrow-right-bold-box"
              style={styles.button}
              labelStyle={{ color: 'white', fontSize: 15, textAlign: 'center' }}
              mode="contained"
              uppercase={false}
              color={this.props.primaryColor}
              onPress={() => this.update()}
            >
              UPDATE
            </Button>
          </View>
        </ScrollView>
      </View>

    </View>
  );
}
}

const styles = StyleSheet.create({

  ImageStyle1: {
    width: 20,
    height: 25,
    marginLeft: 10,

  },
  textStyle1: {
    color: '#000',
    fontSize: 20,
    justifyContent: 'center',


  },
  button: {
    width: '94%',
    height: 45,
    borderRadius: 12,
    zIndex: 5,
    marginBottom: 60,
    marginTop: 20
  },
  activityIndicator: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cards: {
    elevation: 3,
    borderRadius: 5,

  },


});
const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn,
  messages: state.messageData.messages,
});


export default connect(
  mapStateToProps,
)(App);
