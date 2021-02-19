/* eslint-disable max-len */

import React, { Component } from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Picker } from 'native-base';
import { connect } from 'react-redux';
import { Button } from 'react-native-paper';
import Moment from 'moment';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';

let workcontact = [];
let workpattern = [];
let industry = [];
class App extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    today.setDate(today.getDate());
    const dt = today;
    const hi = Moment(dt).format('DD MMM YYYY');
    this.state = {
      location: 'how',
      second: true,
      loading: false,
      NameHolder: '',
      IdHolder: this.props.navigation.getParam('ID', ''),
      VisibleHolder: this.props.navigation.getParam('Visible', ''),
      data: [],
      page: 1,
      seed: 1,
      error: null,
      isDateTimePickerVisible: false,
      isDateTimePickerVisible1: false,
      refreshing: false,
      spinner: false,
      date1: '00-00-00',
      date3: '00-00-00',
      dataSource: [],
      Fromdate: hi,
      Todate: hi,
      OrganizationName: '',
      Industry: '',
      Role: '',
      AnnualCtc: '',
      WorkContract: '',
      WorkPattern: '',
      Location: '',
      WorkContract1: [],
      WorkPattern1: [],
      Industry1: [],
      IndustryPicker: '0',
      WorkPatternPicker: '0',
      WorkContractPicker: '0',
      StartDate1: '',
      EndDate1: '',
      fromrequired: false,
      torequired: false,
      organisationrequired: false,
      rolerequired: false,
      ctcrequired: false,
      locationrequired: false,
      industryrequired: false,
      contractrequired: false,
      patternrequired: false,
    };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.GetDynamicFieldsData();
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    Moment.locale('en');
    const dt1 = date;
    const hi = Moment(dt1).format('DD MMM YYYY');

    this.setState(
      {
        date1: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        Fromdate: hi,
        fromrequired: false,
      }
    );

    this.hideDateTimePicker();
  };

  showDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible1: true });
  };

  hideDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible1: false });
  };

  handleDatePicked1 = date => {
    Moment.locale('en');
    const dt1 = date;
    const hi1 = Moment(dt1).format('DD MMM YYYY');


    this.setState(
      {
        date3: `${dt1.getFullYear()}-${dt1.getMonth() + 1}-${dt1.getDate()}`,
        Todate: hi1,
        torequired: false,
      }
    );

    this.hideDateTimePicker1();
  };

  validate = () => {
    // alert("this.state.Name1")

    if (this.state.Fromdate == '' || this.state.Todate == '' || this.state.OrganizationName == '' || this.state.Role == '' || this.state.AnnualCtc == '' || this.state.Location == '' || this.state.IndustryPicker == '' || this.state.IndustryPicker == '0' || this.state.WorkContractPicker == '' || this.state.WorkContractPicker == '0' || this.state.WorkPatternPicker == '0' || this.state.WorkPatternPicker == '') {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Please enter all values',
        modalType: 'E',
        loadingApprove: false
      });
      if (this.state.Fromdate == '') { this.setState({ fromrequired: true, }); }
      if (this.state.Todate == '') { this.setState({ torequired: true, }); }
      if (this.state.OrganizationName == '') { this.setState({ organisationrequired: true, }); }
      if (this.state.Role == '') { this.setState({ rolerequired: true, }); }
      if (this.state.AnnualCtc == '') { this.setState({ ctcrequired: true, }); }
      if (this.state.Location == '') { this.setState({ locationrequired: true, }); }
      if (this.state.IndustryPicker == '' || this.state.IndustryPicker == '0') { this.setState({ industryrequired: true, }); }
      if (this.state.WorkContractPicker == '' || this.state.WorkContractPicker == '0') { this.setState({ contractrequired: true, }); }
      if (this.state.WorkPatternPicker == '' || this.state.WorkPatternPicker == '0') { this.setState({ patternrequired: true, }); }
    } else {
      if (this.state.VisibleHolder == 'true') {
        this.add();
      } else {
        this.update();
      }

      this.setState({
        fromrequired: false, torequired: false, organisationrequired: false, rolerequired: false, ctcrequired: false, locationrequired: false, industryrequired: false, contractrequired: false, patternrequired: false
      });
    }
  }


  update = () => {
    Moment.locale('en');
    const dt = this.state.Fromdate;
    const hi = Moment(dt).format('YYYY-MM-DD');
    const dt1 = this.state.Todate;
    const hi1 = Moment(dt1).format('YYYY-MM-DD');

    this.setState(
      {
        StartDate1: hi,
        EndDate1: hi1,

      }, () => {
        this.updateemployment();
      }

    );
  };

  add = () => {
    Moment.locale('en');
    const dt = this.state.Fromdate;
    const hi = Moment(dt).format('YYYY-MM-DD');
    const dt1 = this.state.Todate;
    const hi1 = Moment(dt1).format('YYYY-MM-DD');

    this.setState(
      {
        StartDate1: hi,
        EndDate1: hi1,

      }, () => {
        this.addemployment();
      }

    );
  };


    onValueChange=async (itemValue) => {
      if (itemValue !== '0') {
        this.setState({ IndustryPicker: itemValue, industryrequired: false });
      } else {
        this.setState({ IndustryPicker: '', industryrequired: true });
      }
    }

      onValueChange1=async (itemValue) => {
        if (itemValue !== '0') {
          this.setState({ WorkContractPicker: itemValue, contractrequired: false });
        } else {
          this.setState({ WorkContractPicker: '', contractrequired: true });
        }
      }

          onValueChange2=async (itemValue) => {
            if (itemValue !== '0') {
              this.setState({ WorkPatternPicker: itemValue, patternrequired: false });
            } else {
              this.setState({ WorkPatternPicker: '', patternrequired: true });
            }
          }


          onModalHide = () => {
            if (this.state.modalType === 'S') {
              const { params } = this.props.navigation.state;
              params.callHome();
              this.props.navigation.goBack();
            }
          }

          updateemployment() {
            this.setState(
              {
                spinner: true,
              }
            );

            const myarray = {
              loginDetails:
              {
                LoginEmpID: this.props.user.LoginEmpID,
                LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
              },
              infoTypeData:
              {
                CompanyCode: this.props.user.LoginEmpCompanyCodeNo,
                StartDate: this.state.StartDate1,
                EndDate: this.state.EndDate1,
                EmpId: this.props.user.LoginEmpID,
                Id: this.state.IdHolder,
                OrganizationName: this.state.OrganizationName,
                Industry: this.state.IndustryPicker,
                Role: this.state.Role,
                AnnualCtc: this.state.AnnualCtc,
                WorkContract: this.state.WorkContractPicker,
                WorkPattern: this.state.WorkPatternPicker,
                Location: this.state.Location,
                Action: 'update'
              }
            };

            return fetch(`${this.props.user.baseUrl}/MyProfile/InsertUpdatePrevEmpData`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(myarray),
            })
              .then((response) => response.json())
              .then((responseJson) => {
                if (responseJson) {
                  if (responseJson.SuccessList) {
                    const str = responseJson.SuccessList[0];
                    const res = str.split('#');
                    const msg = getMessage(res[0].toString(), this.props.messages);
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

                this.setState({ spinner: false, },);
              })
              .catch(() => {

              });
          }

          addemployment() {
            this.setState(
              {
                spinner: true,
              }
            );

            const myarray = {
              loginDetails:
              {
                LoginEmpID: this.props.user.LoginEmpID,
                LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
              },
              infoTypeData:
              {
                CompanyCode: this.props.user.LoginEmpCompanyCodeNo,
                StartDate: this.state.StartDate1,
                EndDate: this.state.EndDate1,
                EmpId: this.props.user.LoginEmpID,
                Id: '0',
                OrganizationName: this.state.OrganizationName,
                Industry: this.state.IndustryPicker,
                Role: this.state.Role,
                AnnualCtc: this.state.AnnualCtc,
                WorkContract: this.state.WorkContractPicker,
                WorkPattern: this.state.WorkPatternPicker,
                Location: this.state.Location,
                Action: 'add'
              }
            };

            return fetch(`${this.props.user.baseUrl}/MyProfile/InsertUpdatePrevEmpData`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(myarray),
            })
              .then((response) => response.json())
              .then((responseJson) => {
                if (responseJson) {
                  if (responseJson.SuccessList) {
                    const str = responseJson.SuccessList[0];
                    const res = str.split('#');
                    const msg = getMessage(res[0].toString(), this.props.messages);
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

                this.setState({ spinner: false, },);
              })
              .catch(() => {

              });
          }

          GetDynamicFieldsData() {
            this.setState(
              {
                spinner: false,
              }
            );

            const myarray = {
              loginDetails:
              {
                LoginEmpID: this.props.user.LoginEmpID,
                LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
              },
              dynamicFieldsData:
              {
                Action: '5',
                FieldId: this.state.IdHolder,
                TableName: 'MyProfile_PrevEmpDetails$[0023PrevEmploymentData]',
                EmployeeId: this.props.user.LoginEmpID
              }
            };

            return fetch(`${this.props.user.baseUrl}/CommonFunc/GetDynamicFieldsData`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(myarray),
            })
              .then((response) => response.json())
              .then((responseJson) => {
                if (this.state.VisibleHolder == 'true') {

                } else {
                  var str = responseJson.controlDataValues[0][8].fieldValue;
                  var res = str.split(' - ');
                  const contract = responseJson.controlDataValues[0][6].fieldValue;
                  const contract1 = contract.split(' - ');
                  const pattern = responseJson.controlDataValues[0][7].fieldValue;
                  const pattern1 = pattern.split(' - ');

                  this.setState(
                    {

                      isLoading: false,
                      loading: false,
                      dataSource: responseJson.controlDataValues,
                      Fromdate: responseJson.controlDataValues[0][0].fieldValue,
                      Todate: responseJson.controlDataValues[0][1].fieldValue,
                      OrganizationName: responseJson.controlDataValues[0][2].fieldValue,
                      Industry: res[1],
                      IndustryPicker: res[0],
                      Role: responseJson.controlDataValues[0][3].fieldValue,
                      AnnualCtc: responseJson.controlDataValues[0][4].fieldValue,
                      WorkContract: contract1[1],
                      WorkContractPicker: contract1[0],
                      WorkPattern: pattern1[1],
                      WorkPatternPicker: pattern1[0],
                      Location: responseJson.controlDataValues[0][5].fieldValue,


                    },
                  );
                }

                for (var i = 0; i < responseJson.controlList[0].length; i++) {
                  if (responseJson.controlList[0][i].DBField == 'WorkContract') {
                    var id = responseJson.controlList[0][i].FieldId;
                    workcontact = [];
                    for (var i = 0; i < responseJson.dropdownList[0].length; i++) {
                      if (id == responseJson.dropdownList[0][i].FieldId) {
                        var str = responseJson.dropdownList[0][i].FieldValues;
                        var res = str.split('$');
                        workcontact.push({ ContactValue: res[0], ContactId: res[1] });
                      }
                    }
                  }
                }

                for (var i = 0; i < responseJson.controlList[0].length; i++) {
                  if (responseJson.controlList[0][i].DBField == 'WorkPattern') {
                    var id = responseJson.controlList[0][i].FieldId;
                    workpattern = [];
                    for (var i = 0; i < responseJson.dropdownList[0].length; i++) {
                      if (id == responseJson.dropdownList[0][i].FieldId) {
                        const str1 = responseJson.dropdownList[0][i].FieldValues;
                        const res1 = str1.split('$');
                        workpattern.push({ PatternValue: res1[0], PatternId: res1[1] });
                      }
                    }
                  }
                }

                for (var i = 0; i < responseJson.controlList[0].length; i++) {
                  if (responseJson.controlList[0][i].DBField == 'Industry') {
                    var id = responseJson.controlList[0][i].FieldId;
                    industry = [];
                    for (var i = 0; i < responseJson.dropdownList[0].length; i++) {
                      if (id == responseJson.dropdownList[0][i].FieldId) {
                        const str2 = responseJson.dropdownList[0][i].FieldValues;
                        const res2 = str2.split('$');
                        industry.push({ IndustryValue: res2[0], IndustryId: res2[1] });
                      }
                    }
                  }
                }

                this.setState(
                  {

                    WorkContract1: workcontact,
                    WorkPattern1: workpattern,
                    Industry1: industry,


                  },
                );
              })
              .catch(() => {

              });
          }

          render() {
            const {
              Fromdate, Todate
            } = this.state;
            const { secondaryColor } = this.props;
            return (
              <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>

                <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>
                  <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    date={new Date(Fromdate)}
                  />
                  <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible1}
                    onConfirm={this.handleDatePicked1}
                    onCancel={this.hideDateTimePicker1}
                    date={new Date(Todate)}
                  />
                  <MessageModal
                    isVisible={this.state.isModalVisible}
                    message={this.state.modalMessage}
                    type={this.state.modalType}
                    hideModal={() => this.setState({ isModalVisible: false })}
                    onModalHide={() => this.onModalHide()}
                  />
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <View style={{
                        width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                      }}
                      >

                        <View style={{
                          width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
                        }}
                        >
                          <TouchableOpacity activeOpacity={0.9} onPress={this.showDateTimePicker}>
                            <View style={{
                              width: wp('43%'), backgroundColor: '#fff', height: 55, borderRadius: 5, flexDirection: 'column', justifyContent: 'center'
                            }}
                            >
                              <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>From Date</Text>
                              {this.state.Fromdate === '' ? (
                                <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 14, }}>Select</Text>
                              )
                                : <Text style={{ color: '#000000', marginLeft: 10, fontSize: 14, }}>{this.state.Fromdate}</Text>}

                            </View>
                          </TouchableOpacity>
                          <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            {this.state.fromrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                              : null }
                          </View>
                        </View>


                        <View style={{
                          width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
                        }}
                        >
                          <TouchableOpacity activeOpacity={0.9} onPress={this.showDateTimePicker1}>
                            <View style={{
                              width: wp('43%'), height: 55, borderRadius: 5, flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff'
                            }}
                            >
                              <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>To Date</Text>
                              {this.state.Todate === '' ? (
                                <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 14, }}>Select</Text>
                              )
                                : <Text style={{ color: '#000000', marginLeft: 10, fontSize: 14, }}>{this.state.Todate}</Text>}

                            </View>
                          </TouchableOpacity>
                          <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            {this.state.torequired ? <Text style={styles.requiredMessage}>*Required</Text>
                              : null }
                          </View>
                        </View>

                      </View>
                      <View style={{
                        width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                      }}
                      >
                        <View style={{
                          width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
                        }}
                        >
                          <View style={{
                            width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                          }}
                          >
                            <View style={{
                              width: wp('43%'), marginTop: 13, height: 45, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                            }}
                            >
                              <Text style={{
                                color: secondaryColor, marginTop: 10, marginBottom: 8, height: 50, marginLeft: 10, fontSize: 11,
                              }}
                              >
                                Organization Name

                              </Text>
                              <TextInput
                                style={{
                                  marginLeft: 5, fontSize: 14, width: 150, height: 100, position: 'absolute'
                                }}

                                placeholder="Enter Organization"
                                onChangeText={(text) => this.setState({ OrganizationName: text, organisationrequired: false, })}
                                value={this.state.OrganizationName}
                              />
                            </View>

                          </View>
                          <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            {this.state.organisationrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                              : null }
                          </View>
                        </View>
                        <View style={{
                          width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
                        }}
                        >
                          <View style={{
                            width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                          }}
                          >
                            <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>Industry</Text>
                            <Picker
                              style={{ height: 30}}
                              selectedValue={this.state.IndustryPicker}

                              mode="dropdown"
                              onValueChange={(itemValue) => this.onValueChange(itemValue)}
                            >
                              <Picker.Item label="Select" value="0" />
                              { this.state.Industry1.map((item, key) => (
                                <Picker.Item label={item.IndustryValue} value={item.IndustryId} key={key} />))}

                            </Picker>

                          </View>
                          <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            {this.state.industryrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                              : null }
                          </View>
                        </View>

                      </View>
                      <View style={{
                        width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                      }}
                      >
                        <View style={{
                          width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
                        }}
                        >
                          <View style={{
                            width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                          }}
                          >
                            <View style={{
                              width: wp('43%'), marginTop: 13, height: 45, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                            }}
                            >
                              <Text style={{
                                color: secondaryColor, marginTop: 10, marginBottom: 8, height: 50, marginLeft: 10, fontSize: 11,
                              }}
                              >
                                Role

                              </Text>
                              <TextInput
                                style={{
                                  marginLeft: 5, fontSize: 14, width: 150, height: 100, position: 'absolute'
                                }}

                                placeholder="Enter Role"
                                onChangeText={(text) => this.setState({ Role: text, rolerequired: false, })}
                                value={this.state.Role}
                              />

                            </View>
                          </View>
                          <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            {this.state.rolerequired ? <Text style={styles.requiredMessage}>*Required</Text>
                              : null }
                          </View>
                        </View>
                        <View style={{
                          width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
                        }}
                        >
                          <View style={{
                            width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                          }}
                          >
                            <View style={{
                              width: wp('43%'), marginTop: 13, height: 45, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                            }}
                            >
                              <Text style={{
                                color: secondaryColor, marginTop: 10, marginBottom: 8, height: 50, marginLeft: 10, fontSize: 11,
                              }}
                              >
                                Annual CTC

                              </Text>
                              <TextInput
                                style={{
                                  marginLeft: 5, fontSize: 14, width: 150, height: 100, position: 'absolute'
                                }}

                                placeholder="Enter CTC"
                                onChangeText={(text) => this.setState({ AnnualCtc: text, ctcrequired: false, })}
                                value={this.state.AnnualCtc}
                              />

                            </View>
                          </View>
                          <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            {this.state.ctcrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                              : null }
                          </View>
                        </View>

                      </View>
                      <View style={{
                        width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                      }}
                      >
                        <View style={{
                          width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
                        }}
                        >
                          <View style={{
                            width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                          }}
                          >
                            <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>Work Contract</Text>
                            <Picker
                              style={{ height: 30 }}
                              selectedValue={this.state.WorkContractPicker}
                              mode="dropdown"
                              onValueChange={(itemValue) => this.onValueChange1(itemValue)}
                            >
                              <Picker.Item label="Select" value="0" />
                              { this.state.WorkContract1.map((item, key) => (
                                <Picker.Item label={item.ContactValue} value={item.ContactId} key={key} />))}

                            </Picker>

                          </View>
                          <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            {this.state.contractrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                              : null }
                          </View>
                        </View>
                        <View style={{
                          width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
                        }}
                        >
                          <View style={{
                            width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                          }}
                          >
                            <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>Work Pattern</Text>
                            <Picker
                              style={{ height: 30 }}
                              selectedValue={this.state.WorkPatternPicker}
                              mode="dropdown"
                              onValueChange={(itemValue) => this.onValueChange2(itemValue)}
                            >
                              <Picker.Item label="Select" value="0" />
                              { this.state.WorkPattern1.map((item, key) => (
                                <Picker.Item label={item.PatternValue} value={item.PatternId} key={key} />))}

                            </Picker>

                          </View>
                          <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            {this.state.patternrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                              : null }
                          </View>
                        </View>

                      </View>
                      <View style={{
                        width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                      }}
                      >
                        <View style={{
                          width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
                        }}
                        >
                          <View style={{
                            width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                          }}
                          >
                            <View style={{
                              width: wp('43%'), marginTop: 13, height: 45, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                            }}
                            >
                              <Text style={{
                                color: secondaryColor, marginTop: 10, marginBottom: 8, height: 50, marginLeft: 10, fontSize: 11,
                              }}
                              >
                                Location

                              </Text>
                              <TextInput
                                style={{
                                  marginLeft: 5, fontSize: 14, width: 150, height: 100, position: 'absolute'
                                }}

                                placeholder="Enter Location"
                                onChangeText={(text) => this.setState({ Location: text, locationrequired: false })}
                                value={this.state.Location}
                              />

                            </View>
                          </View>
                          <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            {this.state.locationrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                              : null }
                          </View>
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

                      {this.state.VisibleHolder === 'true' ? (
                        <Button
                          loading={this.state.spinner}
                          disabled={this.state.spinner}
                          contentStyle={{ height: 45, }}
                          icon="arrow-right-bold-box"
                          style={styles.button}
                          color={this.props.primaryColor}
                          labelStyle={{ color: 'white', fontSize: 15, textAlign: 'center' }}
                          mode="contained"
                          uppercase={false}
                          onPress={() => this.validate()}
                        >
                          ADD
                        </Button>
                      ) : (
                        <Button
                          loading={this.state.spinner}
                          disabled={this.state.spinner}
                          contentStyle={{ height: 45 }}
                          icon="arrow-right-bold-box"
                          style={styles.button}
                          color={this.props.primaryColor}
                          labelStyle={{ color: 'white', fontSize: 15, textAlign: 'center' }}
                          mode="contained"
                          uppercase={false}
                          onPress={() => this.validate()}
                        >
                          UPDATE
                        </Button>
                      ) }
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
  requiredMessage: { color: 'red', textAlign: 'right', paddingEnd: 5 }
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
