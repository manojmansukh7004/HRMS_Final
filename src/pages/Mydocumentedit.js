
import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Picker } from 'native-base';
import { connect } from 'react-redux';
import { Button, Card } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';
import Documentitem from '../components/Documentitem';

let typeofcontact = [];
class App extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    today.setDate(today.getDate() - 1);

    this.state = {
      dataSource: [],
      dataSource1: [],
      dataSource2: [],
      spinner: false,
      infotype: '',
      infoholder: '0',
      singleFile: '',
      file: [],
      inforequired: false,
    };
    this.arrayholder = [];
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
    FieldId: '0',
    TableName: 'MyProfile_MyDocuments$ESS_PROFILE_tbl_Documents',
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
        for (var i = 0; i < responseJson.controlList[0].length; i++) {
          if (responseJson.controlList[0][i].DBField == 'InfoType') {
            const id = responseJson.controlList[0][i].FieldId;
            typeofcontact = [];
            for (var i = 0; i < responseJson.dropdownList[0].length; i++) {
              if (id == responseJson.dropdownList[0][i].FieldId) {
                const str = responseJson.dropdownList[0][i].FieldValues;
                const res = str.split('$');
                typeofcontact.push({ info: res[0], infoid: res[1] });
              }
            }
          }
        }

        // alert(JSON.stringify(typeofcontact1));
        this.setState({ dataSource: typeofcontact, spinner: false, },);
      })
      .catch(() => {

      });
  }

  validate = () => {
    // alert("this.state.Name1")

    if (this.state.file.length <= 0 && this.state.infoholder == '' || this.state.infoholder == '0') {
      this.setState({ inforequired: true, });
      this.setState({
        isModalVisible: true,
        modalMessage: 'Please select file and regularization type ',
        modalType: 'E',
        loadingApprove: false
      });
    } else if (this.state.infoholder == '' || this.state.infoholder == '0') {
      this.setState({ inforequired: true, });
      this.setState({
        isModalVisible: true,
        modalMessage: 'Please select regularization type',
        modalType: 'E',
        loadingApprove: false
      });
    } else if (this.state.file.length <= 0) {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Please select file',
        modalType: 'E',
        loadingApprove: false
      });
    } else {
      this.setState({ inforequired: false, });
      // alert(this.state.file.length.toString())
      this.updatedocument();
    }
  }

  updatedocument() {
    this.setState({ spinner: true, },);

    const fdata = new FormData();

    for (let a = 0; a < this.state.file.length; a++) {
      fdata.append('file', this.state.file[a]);
    }

    fdata.append('InfoType', this.state.infoholder);
    fdata.append('EmpId', this.props.user.LoginEmpID);
    fdata.append('loginEmpCompanyCodeNo', this.props.user.LoginEmpCompanyCodeNo);

    return fetch(`${this.props.user.baseUrl}/MyProfile/InsertUpdateMyDocuments`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data;'
      },
      body: fdata,
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

 async selectOneFile() {
   try {
     const res = await DocumentPicker.pick({
       type: [DocumentPicker.types.allFiles],

     });

     const files = this.state.file;
     files.push({ uri: res.uri, type: res.type, name: res.name });
     this.setState({ file: files });
     // alert(JSON.stringify(files))
   } catch (err) {
     // Handling any exception (If any)
     if (DocumentPicker.isCancel(err)) {

     } else {
       throw err;
     }
   }
 }

       onValueChange=async (itemValue) => {
         if (itemValue !== '0') {
           this.setState({ infoholder: itemValue, inforequired: false });
         } else {
           this.setState({ infoholder: '', inforequired: true });
         }
       }

    removeFile = index => {
      const { file } = this.state;
      file.splice(index, 1);
      this.setState({ file });
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
          <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>

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
                        width: wp('94%'), height: 55, borderRadius: 5, backgroundColor: '#fff', flexDirection: 'column', justifyContent: 'center'
                      }}
                      >
                        <Text style={{ color: secondaryColor, marginLeft: 10, fontSize: 11, }}>Regularization Type</Text>
                        <Picker
                          style={{ height: 30 }}
                          selectedValue={this.state.infoholder}
                          mode="dropdown"
                          onValueChange={(itemValue) => this.onValueChange(itemValue)}
                        >
                          <Picker.Item label="Select" value="0" />
                          { this.state.dataSource.map((item, key) => (
                            <Picker.Item label={item.info} value={item.infoid} key={key} />))}

                        </Picker>
                      </View>


                    </View>
                  </Card>
                  <View style={{ width: wp('94%'), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    {this.state.inforequired ? <Text style={styles.requiredMessage}>*Required</Text>
                      : null }
                  </View>
                </View>
                <View style={{
                  width: wp('94%'), height: 60, marginTop: 20, flexDirection: 'row',
                }}
                >
                  <TouchableOpacity onPress={() => this.selectOneFile()}>
                    <Image style={{ height: 50, width: 50 }} source={require('../assets/images/ic_attachment.png')} />
                  </TouchableOpacity>
                  <FlatList
                    data={this.state.file}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center' }}
                    style={{ flex: 1 }}
                    renderItem={({ item, index }) => (
                      <Documentitem item={item} onPress={() => this.removeFile(index)} />
                    )}
                  />
                </View>


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
    marginTop: 60
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
