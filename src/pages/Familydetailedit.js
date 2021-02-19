/* eslint-disable max-len */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Picker } from 'native-base';
import Moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';
import { Button } from 'react-native-paper';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MessageModal from '../components/MessageModal';
import getMessage from '../config/GetMessage';

let typeofcontact = [];
let typeofcontact1 = [];

class App extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const todaydate = `${today.getFullYear()}-${parseInt(today.getMonth() + 1)}-${today.getDate()}`;
    this.state = {
      dataSource: [],
      dataSource1: [],
      id: this.props.navigation.getParam('ID', ''),
      Relation1: '',
      Name1: '',
      Gender1: '',
      date: '',
      visible: this.props.navigation.getParam('visible', ''),
      spinner: false,
      name: '',
      PickerValueHolder: '',
      senddate: '',
      Relationholder: '0',
      Relationname: '',
      Genderholder: '0',
      currendate: todaydate,
      startdate: '',
      enddate: '',
      isDateTimePickerVisible: false,
      relationrequired: false,
      namerequired: false,
      genderrequired: false,
      birthrequired: false,
      valueselect: '2020,2,20',
    };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.GetDynamicFieldsData();
  }

  validate = () => {
    // alert("this.state.Name1")

    if (this.state.Name1 == '' || this.state.date == '' || this.state.Relationholder == '' || this.state.Genderholder == '' || this.state.Relationholder == '0' || this.state.Genderholder == '0') {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Please enter all values',
        modalType: 'E',
        loadingApprove: false
      });
      if (this.state.date == '') { this.setState({ birthrequired: true, }); }
      if (this.state.Name1 == '') { this.setState({ namerequired: true, }); }
      if (this.state.Relationholder == '' || this.state.Relationholder == '0') { this.setState({ relationrequired: true, }); }
      if (this.state.Genderholder == '' || this.state.Genderholder == '0') { this.setState({ genderrequired: true, }); }
    } else {
      if (this.state.visible == 'true') {
        this.add();
      } else {
        this.update();
      }

      this.setState({
        namerequired: false, birthrequired: false, relationrequired: false, genderrequired: false
      });
    }
  }


 update = () => {
   this.setState({ spinner: true, });
   const hi = this.state.date;

   const date1 = hi.split(' ');
   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
   for (let j = 0; j < months.length; j++) {
     if (date1[1] == months[j]) {
       date1[1] = months.indexOf(months[j]) + 1;
     }
   }
   if (date1[1] < 10) {
     date1[1] = `0${date1[1]}`;
   }
   const formattedDate = `${date1[2]}-${date1[1]}-${date1[0]}`;

   this.setState({ senddate: formattedDate }, () => {
     this.updatefamily();
   });
 };

add = () => {
  this.setState({ spinner: true, });

  const hi = this.state.date;

  const date1 = hi.split(' ');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let j = 0; j < months.length; j++) {
    if (date1[1] == months[j]) {
      date1[1] = months.indexOf(months[j]) + 1;
    }
  }
  if (date1[1] < 10) {
    date1[1] = `0${date1[1]}`;
  }
  const formattedDate = `${date1[2]}-${date1[1]}-${date1[0]}`;

  this.setState({ senddate: formattedDate, }, () => {
    this.addfamily();
  });
};

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
    TableName: 'MyProfile_FamilyDetails$[0002A_FamilyData]',
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
        const today = new Date();
        today.setDate(today.getDate());
        var dt = today;
        const hi = Moment(dt).format('DD MMM YYYY');
        this.setState(
          { date: hi },
        );
      } else {
        var str = responseJson.controlDataValues[0][5].fieldValue;
        var res = str.split('- ');
        const str1 = responseJson.controlDataValues[0][4].fieldValue;
        const res1 = str1.split(' - ');
        const str2 = responseJson.controlDataValues[0][2].fieldValue;
        const res2 = str2.split(' ');
        const str3 = responseJson.controlDataValues[0][3].fieldValue;
        const res3 = str3.split(' ');
        Moment.locale('en');
        var dt = res2[0];
        const start = Moment(dt).format('YYYY-MM-DD');

        const dt1 = res3[0];
        const end = Moment(dt1).format('YYYY-MM-DD');
        this.setState(
          {
            startdate: start,
            enddate: end,
            Name1: responseJson.controlDataValues[0][0].fieldValue,
            date: responseJson.controlDataValues[0][1].fieldValue,
            idnumber: responseJson.controlDataValues[0][2].fieldValue,
            Relationholder: res[0],
            Relationname: res[1],
            Genderholder: res1[0],

          },

        );
      }
      for (var i = 0; i < responseJson.controlList[0].length; i++) {
        if (responseJson.controlList[0][i].DBField == 'MemberGender') {
          var id = responseJson.controlList[0][i].FieldId;
          typeofcontact = [];

          for (var i = 0; i < responseJson.dropdownList[0].length; i++) {
            if (id == responseJson.dropdownList[0][i].FieldId) {
              var str = responseJson.dropdownList[0][i].FieldValues;
              var res = str.split('$');
              typeofcontact.push({ Gender: res[0], Genderid: res[1] });
            }
          }
        }
      }
      for (var i = 0; i < responseJson.controlList[0].length; i++) {
        if (responseJson.controlList[0][i].DBField == 'MemberRelation') {
          var id = responseJson.controlList[0][i].FieldId;
          typeofcontact1 = [];

          for (var i = 0; i < responseJson.dropdownList[0].length; i++) {
            if (id == responseJson.dropdownList[0][i].FieldId) {
              var str = responseJson.dropdownList[0][i].FieldValues;
              var res = str.split('$');
              typeofcontact1.push({ Relation: res[0], Relationid: res[1] });
            }
          }
        }
      }

      this.setState({ dataSource1: typeofcontact1, dataSource: typeofcontact, spinner: false, },);
    })
    .catch(() => {

    });
}

updatefamily() {
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
   MemberRelation: this.state.Relationholder,
   MemberName: this.state.Name1,
   MemberGender: this.state.Genderholder,
   MemberDob: this.state.date,
   Action: 'update'
 }
  };

  return fetch(`${this.props.user.baseUrl}/MyProfile/InsertUpdateFamilyData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(myarray),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      var str = responseJson.SuccessList[0];
      var res = str.split('#');
      if (responseJson) {
        if (responseJson.SuccessList) {
          var str = responseJson.SuccessList[0];
          var res = str.split('#');
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

      // alert(JSON.stringify(res[0]))
      this.setState({ spinner: false, },);
    })
    .catch(() => {
      this.setState({ spinner: false, },);
      // ToastAndroid.show("Updated1", ToastAndroid.SHORT);
    });
}

addfamily() {
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
    Id: '0',
    MemberRelation: this.state.Relationholder,
    MemberName: this.state.Name1,
    MemberGender: this.state.Genderholder,
    MemberDob: this.state.date,
    Action: 'add'
  }
  };

  return fetch(`${this.props.user.baseUrl}/MyProfile/InsertUpdateFamilyData`, {
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

showDateTimePicker = () => {
  this.setState({ isDateTimePickerVisible: true });
};

hideDateTimePicker = () => {
  this.setState({ isDateTimePickerVisible: false });
};

handleDatePicked = date => {
  Moment.locale('en');
  const dt = date;
  const hi = Moment(dt).format('DD MMM YYYY');
  this.setState({ birthrequired: false, });
  this.setState({ date: hi, });

  this.hideDateTimePicker();
};

onModalHide = () => {
  if (this.state.modalType === 'S') {
    const { params } = this.props.navigation.state;
    params.callHome();
    this.props.navigation.goBack();
  }
}

  onValueChange=async (itemValue) => {
    if (itemValue !== '0') {
      this.setState({ Relationholder: itemValue, relationrequired: false });
    } else {
      this.setState({ Relationholder: '', relationrequired: true });
    }
  }

      onValueChange1=async (itemValue) => {
        if (itemValue !== '0') {
          this.setState({ Genderholder: itemValue, genderrequired: false });
        } else {
          this.setState({ Genderholder: '', genderrequired: true });
        }
      }

      render() {
        const {
          date,
        } = this.state;
        const { secondaryColor } = this.props;
        return (
          <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>

            <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                date={new Date(date)}
                onCancel={this.hideDateTimePicker}
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
                      {this.state.visible === 'true' ? (
                        <View style={{
                          width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                        }}
                        >
                          <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>Relation</Text>
                          <Picker
                            style={{ height: 30}}
                            selectedValue={this.state.Relationholder}
                            mode="dropdown"
                            onValueChange={(itemValue) => this.onValueChange(itemValue)}
                          >
                            <Picker.Item label="Select" value="0" />
                            { this.state.dataSource1.map((item, key) => (
                              <Picker.Item label={item.Relation} value={item.Relationid} key={key} />))}

                          </Picker>

                        </View>
                      ) : (
                        <View style={{
                          width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                        }}
                        >
                          <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 11, }}>Relation</Text>
                          <Text style={{ color: '#00000050', marginLeft: 10, fontSize: 14, }}>{this.state.Relationname}</Text>

                        </View>
                      ) }
                      <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        {this.state.relationrequired ? <Text style={styles.requiredMessage}>*Required</Text>
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
                          width: wp('43%'), marginTop: 13, height: 45, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center',
                        }}
                        >
                          <Text style={{
                            color: secondaryColor, marginLeft: 10, marginTop: 10, marginBottom: 8, height: 50, fontSize: 11,
                          }}
                          >
                            Name

                          </Text>

                          <TextInput
                            style={{
                              marginLeft: 5, fontSize: 14, width: 150, height: 100, position: 'absolute'
                            }}

                            placeholder="Enter Name"
                            onChangeText={(text) => this.setState({ Name1: text, namerequired: false, })}
                            value={this.state.Name1}
                          />

                        </View>
                      </View>
                      <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        {this.state.namerequired ? <Text style={styles.requiredMessage}>*Required</Text>
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
                        <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>Gender</Text>
                        <Picker
                          style={{ height: 30 }}
                          selectedValue={this.state.Genderholder}
                          mode="dropdown"
                          onValueChange={(itemValue) => this.onValueChange1(itemValue)}
                        >
                          <Picker.Item label="Select" value="0" />
                          { this.state.dataSource.map((item, key) => (
                            <Picker.Item label={item.Gender} value={item.Genderid} key={key} />))}

                        </Picker>

                      </View>
                      <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        {this.state.genderrequired ? <Text style={styles.requiredMessage}>*Required</Text>
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

                        <TouchableOpacity activeOpacity={0.9} onPress={this.showDateTimePicker}>

                          <View style={{
                            width: wp('43%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                          }}
                          >
                            <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>Birth Date</Text>
                            {this.state.date === '' ? (
                              <Text style={{ marginLeft: 10, fontSize: 14, color: '#00000050' }}>Select</Text>)
                              : <Text style={{ marginLeft: 10, fontSize: 14, }}>{this.state.date}</Text>}

                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={{ width: wp('43%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        {this.state.birthrequired ? <Text style={styles.requiredMessage}>*Required</Text>
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
