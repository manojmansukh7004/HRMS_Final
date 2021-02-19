/* eslint-disable max-len */
/* eslint-disable no-console */

import React, { Component } from 'react';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { connect } from 'react-redux';
import { SearchBar } from 'react-native-elements';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  BackHandler,
  FlatList, Alert, ActivityIndicator
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Communications from 'react-native-communications';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';


let id = [];
let up = [];
let below = [];
class OrgAnalyticsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      NameHolder: '',
      IdHolder: '',
      data: [],
      dataSource1: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      main: false,
      second: true,
      search: '',
      iamgeSource: '',
      iamgeSource1: '',
      spinner: true,
      belowimages: [],
      firstphoto: '',
      uppername: '',
      upperphoto: '',
      upperpost: '',
      upperid: '',
      upperempid: '',
      upperorgunit: '',
      uppermanager: '',
      upperemail: '',
      uppercontact: '',
      middlename: '',
      middlephoto: '',
      middlepost: '',
      midddleid: '',
      middleempid: '',
      middleorgunit: '',
      middlemanager: '',
      middlemail: '',
      middlecontact: '',
      empid: '',
      name1: '',
      post1: '',
      id1: '',
      orgunit1: '',
      manager1: '',
      email1: '',
      contact1: '',
      line: false,
      status: false,
      one: true,
      two: false,
      three: false,

    };
    this.arrayholder = [];
  }


  componentDidMount() {
    this.saveclarification();
    this.saveclarification1();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.setState({
      visible: false,
      main: false,
      second: true,

    });
  };

  recycle = () => {
    this.setState({

      main: true,
      second: false,

    });
  };

  recycle1 = () => {
    this.setState({
      second: true,
      main: false,
    });
  };

  recycle2 = (helo) => {
    this.setState({
      empid: helo,
      spinner: true,
      line: false,
    });
    id = [];
    up = [];
    below = [];
    this.saveclarification3();
  };

  recycle3 = () => {
    this.setState({

      second: false,
      main: false,
    });
  };

  recycle4 = (helo) => {
    this.setState({
      second: true,
      empid: helo,
      spinner: true,
      status: false,
      line: false,
    });
    id = [];
    up = [];
    below = [];
    this.setState(
      {
        uppername: 'Empty',
        upperpost: 'Empty',
        upperid: 'Empty',
        upperorgunit: 'Empty',
        uppermanager: 'Empty',
        uppermail: 'Empty',
        uppercontact: 'Empty',
      }
    );
    this.saveclarification3();
  };

 dialogopen = (name, post, id, orgunit, manager, email, contact) => {
   this.setState({
     visible: true,
     name1: name,
     post1: post,
     id1: id,
     orgunit1: orgunit,
     manager1: manager,
     email1: email,
     contact1: contact,
   });
 };

updateSearch = search => {
  this.setState({ search });
};


saveclarification=async () => {
  id = [];
  up = [];
  below = [];
  const myarray = {
    loginDetails:
   {
     LoginEmpID: this.props.user.LoginEmpID,
     LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
   }
  };
  return fetch(`${this.props.user.baseUrl}/Orgchart/FetchEmployeePositionData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(myarray),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      for (let i = 0; i < responseJson.EMPPOSDATA.length; i++) {
        if (responseJson.EMPPOSDATA[i].EmpId == this.props.user.LoginEmpID) {
          this.setState(
            {

              empid: responseJson.EMPPOSDATA[i].PosId,
            },
          );
        } else {

        }
      }
      this.setState(
        {
          isLoading: false,
          loading: false,
          belowimages: responseJson.EMPPOSDATA,
          isLoading: false,
          dataSource: responseJson.EMPPOSDATA,
          spinner: false,

        },
        function () {
          this.arrayholder = responseJson.EMPPOSDATA;
          for (var i = 0; i < responseJson.EMPPOSDATA.length; i++) {
            if (responseJson.EMPPOSDATA[i].PosId == this.state.empid) {
              id.push(responseJson.EMPPOSDATA[i]);
            } else {

            }
          }

          this.setState(
            {
              middlename: id[0].$EmployeeName,
              middlepost: id[0].$PostText,
              midddleid: id[0].PosId,
              midddleempid: id[0].EmpId,
              middleorgunit: id[0].POrgUnit,
              middlemanager: id[0].PManager,
              middlemail: id[0].PEMail,
              middlecontact: id[0].PContact,
              middlephoto: id[0].$EmpPhoto,
            }
          );

          for (var i = 0; i < responseJson.EMPPOSDATA.length; i++) {
            if (responseJson.EMPPOSDATA[i].PosId == id[0].L1PosId) {
              up.push(responseJson.EMPPOSDATA[i]);
              this.setState(
                {
                  status: true
                }
              );
              this.setState(
                {
                  uppername: up[0].$EmployeeName,
                  upperpost: up[0].$PostText,
                  upperid: up[0].PosId,
                  upperempid: up[0].EmpId,
                  upperorgunit: up[0].POrgUnit,
                  uppermanager: up[0].PManager,
                  uppermail: up[0].PEMail,
                  uppercontact: up[0].PContact,
                  upperphoto: up[0].$EmpPhoto,
                }
              );
            } else {

            }
          }


          for (var i = 0; i < responseJson.EMPPOSDATA.length; i++) {
            if (responseJson.EMPPOSDATA[i].L1PosId == id[0].PosId) {
              below.push(responseJson.EMPPOSDATA[i]);
              this.setState(
                {
                  line: true,
                }
              );
            } else {

            }
          }
          if (below.length == 1) {
            this.setState({ two: false, one: true, three: false });
          } else if (below.length == 2) {
            this.setState({ two: true, one: false, three: false });
          } else {
            this.setState({ two: false, one: false, three: true });
          }
        }
      );
    })
    .catch(() => {
      this.setState(
        {
          spinner: false,
        }
      );
    });
}

Alerting(number) {
  Alert.alert(
    '',
    `Dial ${number} ?`,
    [
      {
        text: 'Yes',
        onPress: () => {
          Communications.phonecall(number, true);
        }
      },
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
    ],
    { cancelable: false }
  );
}

saveclarification3=async () => {
  const myarray = {
    loginDetails:
   {
     LoginEmpID: this.props.user.LoginEmpID,
     LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
   }
  };

  return fetch(`${this.props.user.baseUrl}/Orgchart/FetchEmployeePositionData`, {
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
          belowimages: responseJson.EMPPOSDATA,
          isLoading: false,
          dataSource: responseJson.EMPPOSDATA,
          spinner: false,

        },
        function () {
          this.arrayholder = responseJson.EMPPOSDATA;
        }
      );

      for (var i = 0; i < responseJson.EMPPOSDATA.length; i++) {
        if (responseJson.EMPPOSDATA[i].PosId == this.state.empid) {
          id.push(responseJson.EMPPOSDATA[i]);
        } else {

        }
      }
      this.setState(
        {
          middlename: id[0].$EmployeeName,
          middlepost: id[0].$PostText,
          midddleid: id[0].PosId,
          midddleempid: id[0].EmpId,
          middleorgunit: id[0].POrgUnit,
          middlemanager: id[0].PManager,
          middlemail: id[0].PEMail,
          middlecontact: id[0].PContact,
          middlephoto: id[0].$EmpPhoto,
        }
      );
     // alert(this.state.midddleid)

      for (var i = 0; i < responseJson.EMPPOSDATA.length; i++) {
        if (responseJson.EMPPOSDATA[i].PosId == id[0].L1PosId) {
          up.push(responseJson.EMPPOSDATA[i]);
          this.setState(
            {
              status: true
            }
          );
          this.setState(
            {
              uppername: up[0].$EmployeeName,
              upperpost: up[0].$PostText,
              upperid: up[0].PosId,
              upperempid: up[0].EmpId,
              upperorgunit: up[0].POrgUnit,
              uppermanager: up[0].PManager,
              uppermail: up[0].PEMail,
              uppercontact: up[0].PContact,
              upperphoto: up[0].$EmpPhoto,
            }
          );
        } else {

        }
      }


      for (var i = 0; i < responseJson.EMPPOSDATA.length; i++) {
        if (responseJson.EMPPOSDATA[i].L1PosId == id[0].PosId) {
          below.push(responseJson.EMPPOSDATA[i]);

          this.setState(
            {
              line: true,
            }
          );
        } else {

        }
      }
      if (below.length == 1) {
        this.setState({ two: false, one: true, three: false });
      } else if (below.length == 2) {
        this.setState({ two: true, one: false, three: false });
      } else {
        this.setState({ two: false, one: false, three: true });
      }
    })
    .catch(() => {
      this.setState(
        {
          spinner: false,
        }
      );
    });
}


search = text => {
  console.log(text);
};

clear = () => {
  this.search.clear();
};

saveclarification1() {
  const myarray = {
    loginDetails:
    {
      LoginEmpID: this.props.user.LoginEmpID,
      LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
    }
  };

  return fetch(`${this.props.user.baseUrl}/Orgchart/FetchEmployeePositionList`, {
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
          dataSource1: responseJson.Table,

        },
      );
    })
    .catch(() => {

    });
}

SearchFilterFunction(text) {
  const newData = this.arrayholder.filter((item) => {
    const itemData = item.$EmployeeName.toString().toUpperCase();
    const textData = text.toUpperCase();
    const itemData11 = item.$PostText.toString().toUpperCase();
    const textData11 = text.toUpperCase();
    return (itemData.indexOf(textData) > -1 || itemData11.indexOf(textData11) > -1);
  });
  this.setState({
    dataSource: newData,
    search: text,
  });
}

secondview() {
  return (


    <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>


      {
      this.state.spinner ? <ActivityIndicator style={styles.activityIndicatotor} color={this.props.secondaryColor} size="large" />
        : (
          <View>
            <View style={{
              width: wp('95%'),
              height: 40,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
            >

              <TouchableOpacity activeOpacity={0.5} onPress={() => this.recycle()}>
                <Image
                  source={require('../assets/images/search.png')}
                  style={styles.ImageStyle1}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={() => this.recycle3()}>

                <Image
                  source={require('../assets/images/navigation.png')}
                  style={styles.ImageStyle2}
                />

              </TouchableOpacity>

            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              { this.state.status ? (
                <View style={{
                  width: wp('100%'),
                  height: 150,
                  marginTop: 5,
                  backgroundColor: '#EFF0F1',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    onLongPress={() => this.dialogopen(this.state.uppername, this.state.upperpost, this.state.upperempid, this.state.upperorgunit, this.state.uppermanager, this.state.uppermail, this.state.uppercontact)}
                    onPress={() => this.recycle4(this.state.upperid)}
                  >
                    <View style={{
                      backgroundColor: 'rgb(228,228,228)', borderRadius: 63, width: 60, alignItems: 'center', justifyContent: 'center', height: 60, borderColor: this.state.uppername === '' ? '#f27420' : '#000', borderWidth: 2,
                    }}
                    >
                      <Image
                        source={{ uri: this.state.upperphoto }}
                        style={styles.ImageStyle3}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.textStyle2}>{this.state.uppername === '' ? 'Vacant' : this.state.uppername}</Text>

                  <Text style={styles.textStyle3}>{this.state.upperpost === '' ? 'Vacant' : this.state.upperpost}</Text>

                  <View
                    style={{
                      marginTop: 5,
                      height: 13,
                      borderLeftWidth: 1,
                      borderLeftColor: '#00000050',
                    }}
                  />
                  <View
                    style={{
                      marginTop: 5,
                      height: 13,
                      borderLeftWidth: 1,
                      borderLeftColor: '#00000050',
                    }}
                  />

                </View>
              ) : (
                <View style={{
                  width: wp('100%'),
                  height: 150,
                  marginTop: 5,
                  backgroundColor: '#EFF0F1',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
                />
              ) }


              <View style={{
                width: wp('100%'),
                height: 110,
                backgroundColor: '#EFF0F1',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              >


                <TouchableOpacity activeOpacity={1} onLongPress={() => this.dialogopen(this.state.middlename, this.state.middlepost, this.state.midddleempid, this.state.middleorgunit, this.state.middlemanager, this.state.middlemail, this.state.middlecontact)}>
                  <View style={{
                    backgroundColor: 'rgb(233,238,245)', borderColor: this.state.middlename === '' ? '#f27420' : '#8f8fea', borderWidth: 2, borderRadius: 63, width: 60, alignItems: 'center', justifyContent: 'center', height: 60,
                  }}
                  >
                    <Image
                      source={{ uri: this.state.middlephoto }}

                      style={styles.ImageStyle4}
                    />
                  </View>
                </TouchableOpacity>

                <Text style={styles.textStyle4}>{this.state.middlename === '' ? 'Vacant' : this.state.middlename}</Text>

                <Text style={styles.textStyle5}>{this.state.middlepost === '' ? 'Vacant' : this.state.middlepost}</Text>

              </View>
              {this.state.line ? (
                <View style={{ width: wp('100%'), height: 40, alignItems: 'center' }}>
                  <View
                    style={{
                      marginTop: 5,
                      height: 13,
                      borderLeftWidth: 1,
                      borderLeftColor: '#00000050',
                    }}
                  />
                  <View
                    style={{
                      marginTop: 5,
                      height: 13,
                      borderLeftWidth: 1,
                      borderLeftColor: '#00000050',
                    }}
                  />


                  {this.state.one ? (
                    null) : (
                      <View style={{ flexDirection: 'row', marginTop: 3 }}>
                        <View
                          style={{
                            width: 15,
                            marginLeft: 5,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                        <View
                          style={{
                            width: 15,
                            marginLeft: 11,
                            borderBottomColor: '#00000050',
                            borderBottomWidth: 1,
                          }}
                        />
                      </View>
                  ) }
                </View>
              ) : null}


              <Dialog

                visible={this.state.visible}
                onTouchOutside={() => {
                  this.setState({ visible: false });
                }}
                width={0.9}
                rounded
                actionsBordered
                dialogTitle={(
                  <View style={{
                    height: 70,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#F7F7F8'
                  }}
                  >

                    <View style={{
                      backgroundColor: '#8f8fea', marginLeft: 15, borderRadius: 63, width: 40, alignItems: 'center', justifyContent: 'center', height: 40
                    }}
                    >
                      <Image
                        source={require('../assets/images/ic_user_inbox.png')}
                        style={styles.ImageStyle6}
                      />
                    </View>

                    <View style={{
                      height: 70,
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                    >

                      <Text style={{ marginLeft: 10, marginTop: 2, fontSize: 20, }}>{this.state.name1 === '' ? 'Vacant' : this.state.name1}</Text>
                      <Text style={{ marginLeft: 10, color: '#00000050' }}>{this.state.post1 === '' ? 'Vacant' : this.state.post1}</Text>
                    </View>

                  </View>
             )}
              >

                <DialogContent style={{
                  backgroundColor: '#fff',
                }}
                >
                  <View style={{
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                    width: wp('100%'),
                    marginTop: 10
                  }}
                  >

                    <View style={{
                      width: wp('100%'),
                      flexDirection: 'column',
                      backgroundColor: '#fff',
                      alignItems: 'center',
                    }}
                    >


                      <View style={{ flexDirection: 'row', alignSelf: 'baseline' }}>

                        <View style={{ width: 90 }}>

                          <Text style={{ color: '#00000050', fontSize: 15, }}>Employee Id</Text>
                        </View>

                        <View style={{ width: wp('69%'), marginLeft: 1 }}>

                          <Text style={{ color: '#000', fontSize: 15, width: ('69%') }}>{this.state.id1 == null ? 'NA' : this.state.id1}</Text>
                        </View>

                      </View>


                      <View style={{
                        flexDirection: 'row', marginTop: 3, width: wp('100%'), alignSelf: 'baseline'
                      }}
                      >

                        <View style={{ width: 90 }}>

                          <Text style={{ color: '#00000050', fontSize: 15, }}>Org Unit</Text>
                        </View>

                        <View style={{ width: wp('69%'), marginLeft: 1 }}>

                          <Text style={{ color: '#000', fontSize: 15, width: ('69%') }}>{this.state.orgunit1 === '' ? 'NA' : this.state.orgunit1}</Text>
                        </View>

                      </View>

                      <View style={{
                        flexDirection: 'row', marginTop: 3, width: wp('100%'), alignSelf: 'baseline'
                      }}
                      >

                        <View style={{ width: 90 }}>

                          <Text style={{ color: '#00000050', fontSize: 15, }}>Manager</Text>
                        </View>

                        <View style={{ width: wp('69%'), marginLeft: 1 }}>

                          <Text style={{ color: '#000', fontSize: 15, width: ('69%') }}>{this.state.manager1 === '' ? 'NA' : this.state.manager1}</Text>
                        </View>

                      </View>


                      <View style={{
                        flexDirection: 'row', marginTop: 3, width: wp('100%'), alignSelf: 'baseline'
                      }}
                      >

                        <View style={{ width: wp('25%') }}>

                          <Text style={{ color: '#00000050', fontSize: 15, }}>EMail</Text>
                        </View>

                        <View style={{ width: wp('69%'), marginLeft: 1 }}>
                          <TouchableOpacity

                            onPress={() => Communications.email([this.state.email1, ''], null, null, '', '')}
                          >
                            <Text style={{ color: '#000', fontSize: 15, width: ('69%') }}>{this.state.email1 == null ? 'NA' : this.state.email1}</Text>
                          </TouchableOpacity>
                        </View>

                      </View>


                      <View style={{
                        flexDirection: 'row', marginTop: 3, width: wp('100%'), alignSelf: 'baseline'
                      }}
                      >

                        <View style={{ width: 90 }}>

                          <Text style={{ color: '#00000050', fontSize: 15, }}>Contact</Text>
                        </View>

                        <View style={{ width: wp('69%'), marginLeft: 1 }}>
                          <TouchableOpacity

                            onPress={() => this.Alerting(this.state.contact1)}
                          >
                            <Text style={{ color: '#000', fontSize: 15, width: ('69%') }}>{this.state.contact1 == null ? 'NA' : this.state.contact1}</Text>
                          </TouchableOpacity>
                        </View>

                      </View>


                    </View>

                  </View>


                </DialogContent>
              </Dialog>
              { this.state.three ? (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}

                  data={below}

                  renderItem={({ item }) => (
                    <View style={{
                      alignItems: 'center', width: wp('33%'), marginRight: 5, marginBottom: 35
                    }}
                    >
                      <Text style={styles.textStyle8}>|</Text>
                      <Text style={styles.textStyle9}>|</Text>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.recycle2(item.PosId)}
                        onLongPress={() => this.dialogopen(item.$EmployeeName, item.$PostText, item.EmpId, item.POrgUnit, item.PManager, item.PEMail, item.PContact)}
                      >
                        <View style={{
                          backgroundColor: 'rgb(228,228,228)', borderRadius: 63, width: 60, alignItems: 'center', justifyContent: 'center', height: 60, borderColor: item.$EmployeeName === '' ? '#f27420' : '#000', borderWidth: 2,
                        }}
                        >

                          <Image
                            source={{ uri: item.$EmpPhoto }}
                            style={styles.ImageStyle5}
                          />
                        </View>
                      </TouchableOpacity>
                      <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.textStyle2}>{item.$EmployeeName === '' ? 'Vacant' : item.$EmployeeName}</Text>

                        <Text style={styles.textStyle21}>{item.$PostText === '' ? 'Vacant' : item.$PostText}</Text>


                      </View>

                    </View>
                  )}

                  keyExtractor={(item, index) => index.toString()}
                />
              ) : null }

              { this.state.two ? (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}

                  data={below}

                  renderItem={({ item }) => (
                    <View style={{ alignItems: 'center', width: wp('50%'), marginBottom: 35 }}>

                      <Text style={styles.textStyle8}>|</Text>
                      <Text style={styles.textStyle9}>|</Text>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.recycle2(item.PosId)}
                        onLongPress={() => this.dialogopen(item.$EmployeeName, item.$PostText, item.EmpId, item.POrgUnit, item.PManager, item.PEMail, item.PContact)}
                      >
                        <View style={{
                          backgroundColor: 'rgb(228,228,228)', borderRadius: 63, width: 60, alignItems: 'center', justifyContent: 'center', height: 60, borderColor: '#000', borderWidth: 2,
                        }}
                        >

                          <Image
                            source={{ uri: item.$EmpPhoto }}
                            style={styles.ImageStyle5}
                          />
                        </View>
                      </TouchableOpacity>
                      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.textStyle2}>{item.$EmployeeName === '' ? 'Vacant' : item.$EmployeeName}</Text>

                        <Text style={styles.textStyle21}>{item.$PostText === '' ? 'Vacant' : item.$PostText}</Text>


                      </View>

                    </View>
                  )}

                  keyExtractor={(item, index) => index.toString()}
                />
              ) : null }
              { this.state.one ? (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}

                  data={below}

                  renderItem={({ item }) => (
                    <View style={{
                      alignItems: 'center', width: wp('100%'), marginRight: 5, marginBottom: 35
                    }}
                    >

                      <Text style={styles.textStyle8}>|</Text>
                      <Text style={styles.textStyle9}>|</Text>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.recycle2(item.PosId)}
                        onLongPress={() => this.dialogopen(item.$EmployeeName, item.$PostText, item.EmpId, item.POrgUnit, item.PManager, item.PEMail, item.PContact)}
                      >
                        <View style={{
                          backgroundColor: 'rgb(228,228,228)', borderRadius: 63, width: 60, alignItems: 'center', justifyContent: 'center', height: 60, borderColor: '#000', borderWidth: 2,
                        }}
                        >

                          <Image
                            source={{ uri: item.$EmpPhoto }}
                            style={styles.ImageStyle5}
                          />
                        </View>
                      </TouchableOpacity>
                      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.textStyle2}>{item.$EmployeeName === '' ? 'Vacant' : item.$EmployeeName}</Text>

                        <Text style={styles.textStyle21}>{item.$PostText === '' ? 'Vacant' : item.$PostText}</Text>


                      </View>

                    </View>
                  )}

                  keyExtractor={(item, index) => index.toString()}
                />
              ) : null }


            </ScrollView>
          </View>
        )
}
    </View>


  );
}

thirdview() {
  return (

    <View style={{ backgroundColor: '#EFF0F1', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: wp('100%'),
        height: 50,
        marginTop: 40,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
      >
        <TouchableOpacity activeOpacity={0.5} onPress={() => this.recycle1()}>

          <Image
            source={require('../assets/images/back.png')}
            style={styles.ImageStyle}
          />
        </TouchableOpacity>
        <SearchBar
          round

          searchIcon={{ size: 24 }}
          inputStyle={{ color: '#000' }}
          containerStyle={{
            backgroundColor: 'transparent', width: wp('80%'), marginTop: 10, borderWidth: 0, shadowColor: 'white', borderBottomColor: 'transparent', borderTopColor: 'transparent'
          }}
          inputContainerStyle={{
            backgroundColor: '#E5E5E5', width: wp('80%'), borderRadius: 5, borderWidth: 0, color: '#000'
          }}
          onChangeText={text => this.SearchFilterFunction(text)}
          onClear={() => this.SearchFilterFunction('')}
          placeholder="Search"
          value={this.state.search}
        />

        <TouchableOpacity activeOpacity={0.5} onPress={() => this.recycle3()}>

          <Image
            source={require('../assets/images/navigation.png')}
            style={styles.ImageStyle8}
          />

        </TouchableOpacity>

      </View>
      <SafeAreaView style={{ backgroundColor: '#EFF0F1' }}>
        <View style={{ marginBottom: 100 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.dataSource}


            renderItem={({ item }) => (

              <View style={{
                width: wp('100%'), backgroundColor: '#EFF0F1', alignItems: 'center', justifyContent: 'center'
              }}
              >

                <TouchableOpacity activeOpacity={0.5} onPress={() => this.recycle4(item.PosId)}>
                  <View style={{
                    width: wp('95%'), height: 50, backgroundColor: '#fff', marginTop: 3, flexDirection: 'row', alignItems: 'center', borderRadius: 5,
                  }}
                  >
                    <View style={{
                      backgroundColor: '#8f8fea', marginLeft: 15, borderRadius: 63, width: 20, alignItems: 'center', justifyContent: 'center', height: 20
                    }}
                    >

                      <Image
                        source={require('../assets/images/ic_user_inbox.png')}
                        style={{ width: 13, height: 13, }}
                      />
                    </View>
                    <View>
                      <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.textStyle6}>{item.$EmployeeName === '' ? 'Vacant' : item.$EmployeeName}</Text>
                      </View>
                      <View style={{ justifyContent: 'center', }}>
                        <Text style={styles.textStyle7}>{item.$PostText}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

              </View>

            )}
            enableEmptySections
            style={{ marginTop: 0 }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </SafeAreaView>
    </View>

  );
}

fourthview() {
  return (


    <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>


      <Spinner
        visible={this.state.spinner}
        textStyle={styles.spinnerTextStyle}
      />

      <View style={{
        width: wp('95%'),
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}
      >


        <TouchableOpacity activeOpacity={0.5} onPress={() => this.recycle()}>

          <Image
            source={require('../assets/images/search.png')}
            style={styles.ImageStyle1}
          />

        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} onPress={() => this.recycle1()}>

          <Image
            source={require('../assets/images/tree.png')}
            style={{ width: 30, height: 30, marginLeft: 20 }}
          />

        </TouchableOpacity>

      </View>

      <FlatList

        showsVerticalScrollIndicator={false}

        data={this.state.dataSource1}

        renderItem={({ item }) => (
          <View style={{
            width: wp('96%'), flexDirection: 'column', justifyContent: 'center', marginTop: 5,
          }}
          >
            <View style={{
              borderRadius: 10,
              width: wp('96%'),

            }}
            >

              <View style={{
                width: wp('96%'),
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgb(249,249,249)',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10
              }}
              >
                <View style={{
                  backgroundColor: '#8f8fea', marginLeft: 10, borderRadius: 63, width: 30, alignItems: 'center', justifyContent: 'center', height: 30
                }}
                >

                  <Image
                    source={require('../assets/images/ic_user_inbox.png')}
                    style={styles.ImageStyle7}
                  />
                </View>
                <View style={{
                  width: wp('100%'),
                  height: 70,
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
                >

                  <Text style={styles.textStyle10}>{item.Employee === '' ? 'Vacant' : item.Employee}</Text>
                  <Text style={styles.textStyle11}>{item.Position}</Text>
                </View>

              </View>


              <View style={{
                flexDirection: 'column',
                backgroundColor: '#fff',
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                justifyContent: 'flex-start',
                paddingLeft: 5,
                paddingTop: 5,
              }}
              >


                <View style={{ flexDirection: 'row', width: wp('90%'), height: 20 }}>

                  <View style={{ flex: 0.27 }}>

                    <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 13, }}>EMPLOYEE ID</Text>
                  </View>

                  <View style={{ flex: 0.72, }}>

                    <Text style={{ color: '#000', fontSize: 13 }}>{item.EmployeeId === null ? 'NA' : item.EmployeeId}</Text>
                  </View>

                </View>


                <View style={{ flexDirection: 'row', width: wp('90%'), height: 20 }}>

                  <View style={{ flex: 0.27 }}>

                    <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 13, }}>ORG UNIT</Text>
                  </View>

                  <View style={{ flex: 0.72, }}>

                    <Text style={{ color: '#000', fontSize: 13 }}>{item.OrgUnit === '' ? 'NA' : item.OrgUnit}</Text>
                  </View>

                </View>

                <View style={{ flexDirection: 'row', width: wp('90%'), height: 20 }}>

                  <View style={{ flex: 0.27 }}>

                    <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 13, }}>MANAGER</Text>
                  </View>

                  <View style={{ flex: 0.72, }}>

                    <Text style={{ color: '#000000', fontSize: 13 }}>{item.Manager === '' ? 'NA' : item.Manager}</Text>
                  </View>

                </View>


                <View style={{ flexDirection: 'row', width: wp('90%'), height: 20 }}>

                  <View style={{ flex: 0.27 }}>

                    <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 13, }}>MAIL</Text>
                  </View>

                  <View style={{ flex: 0.72, }}>
                    <TouchableOpacity

                      onPress={() => Communications.email([item.EMail, ''], null, null, '', '')}
                    >
                      <Text style={{ color: '#000000', fontSize: 13 }}>{item.EMail === null ? 'NA' : item.EMail}</Text>
                    </TouchableOpacity>
                  </View>

                </View>


                <View style={{ flexDirection: 'row', width: wp('90%'), height: 20 }}>

                  <View style={{ flex: 0.27 }}>

                    <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 13, }}>PHONE</Text>
                  </View>

                  <View style={{ flex: 0.72, }}>
                    <TouchableOpacity
                      onPress={() => this.Alerting(item.Contact)}
                    >
                      <Text style={{ color: '#000000', fontSize: 13 }}>{item.Contact === null ? 'NA' : item.Contact}</Text>
                    </TouchableOpacity>
                  </View>

                </View>

              </View>
            </View>


          </View>
        )}

        keyExtractor={(item, index) => index.toString()}
      />

    </View>


  );
}

render() {
  if (this.state.second) {
    return (
      this.secondview()
    );
  } if (this.state.main) {
    return (
      this.thirdview()
    );
  } if (!this.state.second) {
    return (
      this.fourthview()
    );
  }
}
}

const styles = StyleSheet.create({

  ImageStyle: {
    width: 20,
    height: 25,
    marginTop: 10,
    justifyContent: 'center'

  },
  ImageStyle1: {
    width: 20,
    height: 25,

  },
  ImageStyle2: {
    width: 30,
    height: 30,
    borderRadius: 63,
    marginLeft: 20,
    justifyContent: 'center'

  },
  ImageStyle8: {
    width: 30,
    height: 30,
    borderRadius: 63,
    marginLeft: 10,
    marginTop: 10,
    justifyContent: 'center'

  },
  ImageStyle3: {
    width: 50,
    height: 50,
    borderRadius: 60,

  },
  ImageStyle4: {
    width: 50,
    height: 50,
    borderRadius: 60,

  },
  ImageStyle5: {
    width: 50,
    height: 50,
    borderRadius: 60,


  },
  ImageStyle6: {
    width: 30,
    height: 30,


  },
  ImageStyle7: {
    width: 20,
    height: 20,


  },
  textStyle1: {
    color: '#000',
    fontSize: 18,
    marginLeft: 110,
    justifyContent: 'center',


  },
  textStyle: {
    color: '#000',
    fontSize: 18,


  },
  textStyle2: {
    marginTop: 2,
    color: '#00000050',
    fontSize: 15,

    textAlign: 'center',

  },
  textStyle9: {

    color: '#00000050',
    fontSize: 15,


  },
  textStyle8: {

    color: '#00000050',
    fontSize: 15,

    alignItems: 'center',
    alignSelf: 'center',

  },
  textStyle3: {
    marginTop: 2,
    color: '#00000050',
    fontSize: 13,

    height: 18,

  },
  textStyle21: {
    marginTop: 2,
    color: '#00000050',
    fontSize: 11,

    textAlign: 'center',
  },
  textStyle4: {
    marginTop: 2,
    color: '#000',
    fontSize: 18,

  },
  textStyle5: {
    marginTop: 2,
    color: '#000',
    fontSize: 13,
    height: 18,

  },
  textStyle6: {
    color: '#000',
    fontSize: 15,

    marginLeft: 10,


  },
  textStyle7: {
    color: '#00000080',
    fontSize: 12,
    marginLeft: 10,


  },
  textStyle10: {
    color: '#000',
    fontSize: 16,


    marginLeft: 10

  },
  textStyle11: {
    color: '#000',
    fontSize: 12,

    marginLeft: 10
  },
  activityIndicatotor: {
    height: '100%',
    width: '100%',
  }
});

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn
});


export default connect(
  mapStateToProps,
)(OrgAnalyticsScreen);
