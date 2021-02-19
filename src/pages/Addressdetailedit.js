/* eslint-disable max-len */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Picker } from 'native-base';
import { connect } from 'react-redux';
import { Button, Card } from 'react-native-paper';
import Moment from 'moment';
import { SearchBar } from 'react-native-elements';
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MessageModal from '../components/MessageModal';
import getMessage from '../config/GetMessage';

let typeofcontact = [];
let typeofcontact1 = [];
let typeofcontact2 = [];
class App extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const todaydate = `${today.getFullYear()}-${parseInt(today.getMonth() + 1)}-${today.getDate()}`;

    this.state = {
      dataSource: [],
      dataSource1: [],
      dataSource2: [],
      second: true,
      loading: false,
      id: this.props.navigation.getParam('ID', ''),
      visible: this.props.navigation.getParam('visible', ''),
      addresstype: '',
      address: '',
      city: '',
      pincode: '',
      state: 'Select',
      country: 'Select',
      startdate: '',
      enddate: '',
      addressholder: '0',
      stateholder: '',
      countryholder: '',
      currendate: todaydate,
      fromdate: '',
      expirydate: '',
      addressrequired: false,
      pinrequired: false,
      cityrequired: false,
      countryrequired: false,
      staterequired: false,
      addresstyperequired: false,
      hideModal: true,
      isVisible: false,
      isVisible1: false,
    };
    this.arrayholder = [];
    this.arrayholder1 = [];
  }

  componentDidMount() {
    this.GetDynamicFieldsData();
  }

  GetDynamicFieldsData() {
    const myarray = {
      loginDetails:
  {
    LoginEmpID: this.props.user.LoginEmpID,
    LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
  },
      dynamicFieldsData:
  {
    Action: '5',
    FieldId: this.state.id,
    TableName: 'MyProfile_AddressDetails$[0003AddressData]',
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
        if (this.state.visible == 'true') {

        } else {
          var str = responseJson.controlDataValues[0][5].fieldValue;
          var res = str.split(' - ');
          const str1 = responseJson.controlDataValues[0][6].fieldValue;
          const res1 = str1.split(' - ');
          const str2 = responseJson.controlDataValues[0][3].fieldValue;
          const res2 = str2.split(' ');
          const str3 = responseJson.controlDataValues[0][4].fieldValue;
          const res3 = str3.split(' ');
          const str4 = responseJson.controlDataValues[0][7].fieldValue;
          const res4 = str4.split(' - ');
          Moment.locale('en');
          const dt = res2[0];
          const start = Moment(dt).format('YYYY-MM-DD');
          const dt1 = res3[0];
          const end = Moment(dt1).format('YYYY-MM-DD');
          this.setState(
            {
              startdate: start,
              enddate: end,
              addresstype: res[1],
              address: responseJson.controlDataValues[0][2].fieldValue,
              city: responseJson.controlDataValues[0][0].fieldValue,
              stateholder: res1[0],
              countryholder: res4[0],
              addressholder: res[0],
              pincode: responseJson.controlDataValues[0][1].fieldValue,
              state: res1[1],
              country: res4[1],
            },

          );
        }

        for (var i = 0; i < responseJson.controlList[0].length; i++) {
          if (responseJson.controlList[0][i].DBField == 'CountryCode') {
            var id = responseJson.controlList[0][i].FieldId;
            typeofcontact = [];
            for (var i = 0; i < responseJson.dropdownList[0].length; i++) {
              if (id == responseJson.dropdownList[0][i].FieldId) {
                var str = responseJson.dropdownList[0][i].FieldValues;
                var res = str.split('$');
                typeofcontact.push({ Country: res[0], Countryid: res[1] });
              }
            }
          }
        }
        for (var i = 0; i < responseJson.controlList[0].length; i++) {
          if (responseJson.controlList[0][i].DBField == 'StateId') {
            var id = responseJson.controlList[0][i].FieldId;
            typeofcontact1 = [];
            // alert(JSON.stringify(id));
            for (var i = 0; i < responseJson.dropdownList[0].length; i++) {
              if (id == responseJson.dropdownList[0][i].FieldId) {
                var str = responseJson.dropdownList[0][i].FieldValues;
                var res = str.split('$');
                typeofcontact1.push({ STATE: res[0], STATEID: res[1] });
              }
            }
          }
        }
        for (var i = 0; i < responseJson.controlList[0].length; i++) {
          if (responseJson.controlList[0][i].DBField == 'AddressId') {
            var id = responseJson.controlList[0][i].FieldId;
            typeofcontact2 = [];
            for (var i = 0; i < responseJson.dropdownList[0].length; i++) {
              if (id == responseJson.dropdownList[0][i].FieldId) {
                var str = responseJson.dropdownList[0][i].FieldValues;
                var res = str.split('$');
                typeofcontact2.push({ Address: res[0], addresstype: res[1] });
              }
            }
          }
        }
        // alert(JSON.stringify(typeofcontact1));
        this.setState({
          dataSource1: typeofcontact1, dataSource2: typeofcontact2, dataSource: typeofcontact, spinner: false,
        }, function () {
          this.arrayholder = typeofcontact1;
          this.arrayholder1 = typeofcontact;
        });
      })
      .catch(() => {

      });
  }

  validate = () => {
    if (this.state.address == '' || this.state.city == '' || this.state.pincode == '' || this.state.addressholder == '' || this.state.addressholder == '0' || this.state.state == 'Select' || this.state.stateholder == '' || this.state.countryholder == '0' || this.state.countryholder == '') {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Please enter all values',
        modalType: 'E',
        loadingApprove: false
      });
      if (this.state.address == '') { this.setState({ addressrequired: true, }); }
      if (this.state.city == '') { this.setState({ cityrequired: true, }); }
      if (this.state.pincode == '') { this.setState({ pinrequired: true, }); }
      if (this.state.addressholder == '' || this.state.addressholder == '0') { this.setState({ addresstyperequired: true, }); }
      if (this.state.stateholder == '' || this.state.stateholder == '0') { this.setState({ staterequired: true, }); }
      if (this.state.countryholder == '' || this.state.countryholder == '0') { this.setState({ countryrequired: true, }); }
    } else {
      if (this.state.visible == 'true') {
        this.addaddress();
      } else {
        this.updateaddress();
      }

      this.setState({
        pinrequired: false, addressrequired: false, cityrequired: false, addresstyperequired: false, staterequired: false, countryrequired: false
      });
    }
  }

  updateaddress() {
    this.setState({ spinner: true, },);
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
   Id: this.state.id,
   AddressType: this.state.addressholder,
   Address: this.state.address,
   City: this.state.city,
   PinCode: this.state.pincode,
   State: this.state.stateholder,
   Country: this.state.countryholder,
   Action: 'update'
 }
    };

    return fetch(`${this.props.user.baseUrl}/MyProfile/InsertUpdateAddressData`, {
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
        this.setState({ spinner: false, },);
      });
  }

  addaddress() {
    this.setState({ spinner: true, },);
    const myarray = {
      loginDetails:
  {
    LoginEmpID: this.props.user.LoginEmpID,
    LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
  },
      infoTypeData:
  {
    CompanyCode: this.props.user.LoginEmpCompanyCodeNo,
    StartDate: this.state.currendate,
    EndDate: '9999-12-31',
    EmpId: this.props.user.LoginEmpID,
    Id: this.state.id,
    AddressType: this.state.addressholder,
    Address: this.state.address,
    City: this.state.city,
    PinCode: this.state.pincode,
    State: this.state.stateholder,
    Country: this.state.countryholder,
    Action: 'add'
  }
    };

    return fetch(`${this.props.user.baseUrl}/MyProfile/InsertUpdateAddressData`, {
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
        this.setState({ spinner: false, },);
      });
  }

 onModalHide = () => {
   if (this.state.modalType === 'S') {
     const { params } = this.props.navigation.state;
     params.callHome();
     this.props.navigation.goBack();
   }
 }

   onModalHide1 = () => {
     this.setState({ isVisible: false });
   }

     onValueChange=async (itemValue) => {
       if (itemValue !== '0') {
         this.setState({ addressholder: itemValue, addresstyperequired: false });
       } else {
         this.setState({ addressholder: '', addresstyperequired: true });
       }
     }

      onValueChange1=async (state, stateid) => {
        this.setState({
          stateholder: stateid, staterequired: false, state, isVisible: false
        });
      }

     onValueChange2=async (country, countryid) => {
       this.setState({
         countryholder: countryid, countryrequired: false, country, isVisible1: false
       });
     }

    clear = () => {
      this.search.clear();
    };

    SearchFilterFunction(text) {
      const newData = this.arrayholder.filter((item) => {
        const itemData = item.STATE.toString().toUpperCase();
        const textData = text.toUpperCase();

        return (itemData.indexOf(textData) > -1);
      });
      this.setState({
        dataSource1: newData,
        search: text,
      });
    }

    clear1 = () => {
      this.search1.clear();
    };

    SearchFilterFunction1(text) {
      const newData = this.arrayholder1.filter((item) => {
        const itemData = item.Country.toString().toUpperCase();
        const textData = text.toUpperCase();

        return (itemData.indexOf(textData) > -1);
      });
      this.setState({
        dataSource: newData,
        search1: text,
      });
    }

    render() {
      const { secondaryColor } = this.props;

      return (
        <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>
          <MessageModal
            isVisible={this.state.isModalVisible}
            message={this.state.modalMessage}
            type={this.state.modalType}
            hideModal={() => this.setState({ isModalVisible: false })}
            onModalHide={() => this.onModalHide()}
          />
          <Modal
            style={styles.modal}
            isVisible={this.state.isVisible}
            onBackButtonPress={() => this.setState({ isVisible: false })}
            onBackdropPress={() => this.setState({ isVisible: false })}
          >

            <View style={styles.container}>

              <View style={{ alignItems: 'center' }}>
                <SearchBar
                  round

                  searchIcon={{ size: 24 }}
                  inputStyle={{ color: '#000' }}
                  containerStyle={{
                    backgroundColor: 'transparent', width: wp('85%'), borderWidth: 0, shadowColor: 'white', borderBottomColor: 'transparent', borderTopColor: 'transparent'
                  }}
                  inputContainerStyle={{
                    backgroundColor: '#E5E5E5', width: wp('80%'), borderRadius: 5, borderWidth: 0, color: '#000'
                  }}
                  onChangeText={text => this.SearchFilterFunction(text)}
                  onClear={() => this.SearchFilterFunction('')}
                  placeholder="Search"
                  value={this.state.search}
                />
              </View>
              <View style={{ width: '85%', height: hp('40%') }}>
                <FlatList
                  showsVerticalScrollIndicator={false}

                  data={this.state.dataSource1}

                  renderItem={({ item }) => (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => this.onValueChange1(item.STATE, item.STATEID)}
                    >
                      <Text style={{ color: '#000', fontSize: 18, marginTop: 5 }}>{item.STATE}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.value}
                />

              </View>
            </View>

          </Modal>
          <Modal
            style={styles.modal}
            isVisible={this.state.isVisible1}
            onBackButtonPress={() => this.setState({ isVisible1: false })}
            onBackdropPress={() => this.setState({ isVisible1: false })}
          >

            <View style={styles.container}>

              <View style={{ alignItems: 'center' }}>
                <SearchBar
                  round

                  searchIcon={{ size: 24 }}
                  inputStyle={{ color: '#000' }}
                  containerStyle={{
                    backgroundColor: 'transparent', width: wp('85%'), borderWidth: 0, shadowColor: 'white', borderBottomColor: 'transparent', borderTopColor: 'transparent'
                  }}
                  inputContainerStyle={{
                    backgroundColor: '#E5E5E5', width: wp('80%'), borderRadius: 5, borderWidth: 0, color: '#000'
                  }}
                  onChangeText={text => this.SearchFilterFunction1(text)}
                  onClear={() => this.SearchFilterFunction1('')}
                  placeholder="Search"
                  value={this.state.search1}
                />
              </View>
              <View style={{ width: '85%', height: hp('40%') }}>
                <FlatList
                  showsVerticalScrollIndicator={false}

                  data={this.state.dataSource}

                  renderItem={({ item }) => (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => this.onValueChange2(item.Country, item.Countryid)}
                    >
                      <Text style={{ color: '#000', fontSize: 18, marginTop: 5 }}>{item.Country}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.value}
                />

              </View>
            </View>

          </Modal>
          <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>

                <View style={{
                  width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'column', alignItems: 'center'
                }}
                >
                  <Card style={styles.cards}>
                    <View style={{
                      width: wp('94%'), height: 60, flexDirection: 'column', alignItems: 'center'
                    }}
                    >
                      {this.state.visible === 'true' ? (

                        <View style={{
                          width: wp('94%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                        }}
                        >
                          <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>Address Type</Text>
                          <Picker
                            style={{ height: 30 }}
                            selectedValue={this.state.addressholder}
                            mode="dropdown"
                            onValueChange={(itemValue) => this.onValueChange(itemValue)}
                          >
                            <Picker.Item label="Select" value="0" />
                            { this.state.dataSource2.map((item, key) => (
                              <Picker.Item label={item.Address} value={item.addresstype} key={key} />))}

                          </Picker>
                        </View>
                      )
                        : (
                          <View style={{
                            width: wp('90%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                          }}
                          >
                            <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 11, }}>Address Type</Text>
                            <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 14, }}>{this.state.addresstype}</Text>
                          </View>
                        )}

                    </View>
                  </Card>
                  <View style={{ width: wp('94%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    {this.state.addresstyperequired ? <Text style={styles.requiredMessage}>*Required</Text>
                      : null }
                  </View>
                </View>
                <View style={{
                  width: wp('100%'), height: 60, marginTop: 24, flexDirection: 'column', alignItems: 'center'
                }}
                >
                  <Card style={styles.cards}>
                    <View style={{
                      width: wp('94%'), height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                    }}
                    >
                      <View style={{
                        width: wp('94%'), borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column',
                      }}
                      >
                        <Text style={{
                          color: secondaryColor, marginLeft: 10, marginTop: 10, fontSize: 11
                        }}
                        >
                          Address

                        </Text>
                        <TextInput
                          style={{ marginLeft: 5, fontSize: 14, height: 50 }}
                          placeholder="Enter Address"
                          multiline
                          onChangeText={(text) => this.setState({ address: text, addressrequired: false })}
                          value={this.state.address}
                        />

                      </View>

                    </View>
                  </Card>
                  <View style={{ width: wp('94%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    {this.state.addressrequired ? (
                      <Text style={{
                        color: 'red', textAlign: 'right', paddingEnd: 5, marginTop: 5
                      }}
                      >
                        *Required

                      </Text>
                    )
                      : null }
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
                    <Card style={styles.cards}>
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
                            City

                          </Text>
                          <TextInput
                            style={{
                              marginLeft: 5, fontSize: 14, width: 150, height: 100, position: 'absolute'
                            }}

                            placeholder="Enter City"
                            onChangeText={(text) => this.setState({ city: text, cityrequired: false })}
                            value={this.state.city}
                          />

                        </View>
                      </View>
                    </Card>
                    <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                      {this.state.cityrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                        : null }
                    </View>
                  </View>
                  <View style={{
                    width: wp('50%'), height: 60, flexDirection: 'column', alignItems: 'center'
                  }}
                  >
                    <Card style={styles.cards}>
                      <View style={{
                        width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                      }}
                      >
                        <View style={{
                          width: wp('43%'), marginTop: 13, height: 45, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                        }}
                        >
                          <Text style={{
                            color: secondaryColor, marginTop: 10, marginBottom: 8, height: 50, marginLeft: 10, fontSize: 11,
                          }}
                          >
                            Pin Code

                          </Text>
                          <TextInput
                            style={{
                              marginLeft: 5, fontSize: 14, width: 150, height: 100, position: 'absolute'
                            }}
                            keyboardType="numeric"
                            placeholder="Enter Pincode"
                            maxLength={6}
                            onChangeText={(text) => this.setState({ pincode: text, pinrequired: false })}
                            value={this.state.pincode}
                          />

                        </View>
                      </View>
                    </Card>
                    <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                      {this.state.pinrequired ? <Text style={styles.requiredMessage}>*Required</Text>
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
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.setState({ isVisible: true })}
                      >
                        <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>State</Text>
                        <Text style={{
                          color: '#000', marginLeft: 10, height: 20, fontSize: 14,
                        }}
                        >
                          {this.state.state}

                        </Text>
                      </TouchableOpacity>


                    </View>
                    <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                      {this.state.staterequired ? <Text style={styles.requiredMessage}>*Required</Text>
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
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.setState({ isVisible1: true })}
                      >
                        <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>Country</Text>
                        <Text style={{
                          color: '#000', marginLeft: 10, height: 20, fontSize: 14,
                        }}
                        >
                          {this.state.country}

                        </Text>
                      </TouchableOpacity>

                    </View>
                    <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                      {this.state.countryrequired ? <Text style={styles.requiredMessage}>*Required</Text>
                        : null }
                    </View>
                  </View>

                </View>
                {this.state.visible === 'true' ? (
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
  container: {
    width: wp('89%'),
    height: hp('50%'),
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',

  },
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
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
