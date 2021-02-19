/* eslint-disable max-len */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      EmployeeNumber: '',
      TopPosition: '',
      EmailId: '',
      ReportingManager: '',
      Function1: '',
      SubFunction: '',
      Department1: '',
      DoJ: '',
      spinner: true,

    };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.saveclarification();
  }


  saveclarification() {
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
        this.setState({
          isLoading: false,
          spinner: false,
          dataSource: responseJson.ProfileData[0]['Organization Data'],

        });

        this.setState(
          {
            EmployeeNumber: this.state.dataSource[0]['Employee No'],
            TopPosition: this.state.dataSource[0].Position,
            EmailId: this.state.dataSource[0]['Email Id'],
            ReportingManager: this.state.dataSource[0]['Reporting Manager'],
            Function1: this.state.dataSource[0].Function,
            SubFunction: this.state.dataSource[0]['Sub Function'],
            Department1: this.state.dataSource[0].Department,
            DoJ: this.state.dataSource[0]['Date Of Joining'],

          }
        );
      })
      .catch(() => {

      });
  }


  render() {
    const { secondaryColor } = this.props;
    return (
      <View style={{ alignItems: 'center', backgroundColor: '#FFFFFF', flex: 1 }}>
        {
      this.state.spinner ? <ActivityIndicator style={styles.activityIndicatotor} color={this.props.secondaryColor} size="large" />
        : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center', backgroundColor: '#FFFFFF', flex: 1 }}>

              <View style={{
                width: wp('100%'), height: 130, backgroundColor: '#FFFFFF', alignItems: 'center', flexDirection: 'row',
              }}
              >

                <View style={{
                  width: wp('40%'), height: 130, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <View style={{
                    backgroundColor: 'rgb(233,238,245)', borderColor: '#8f8fea', borderWidth: 2, borderRadius: 60, height: 95, width: 95, alignItems: 'center', justifyContent: 'center'
                  }}
                  >
                    <Image
                      source={require('../assets/images/ic_profile.png')}
                      style={{ width: 55, height: 65 }}
                    />
                  </View>
                </View>

                <View style={{
                  width: wp('50%'), height: 130, justifyContent: 'center', flexDirection: 'column'
                }}
                >
                  <Text style={{ color: secondaryColor, fontSize: 15 }}>Employee No</Text>
                  <Text style={{ color: '#000000', fontSize: 17 }}>{this.state.EmployeeNumber}</Text>
                  <Text style={{ color: secondaryColor, fontSize: 15, marginTop: 10 }}>Position</Text>
                  <Text style={{ color: '#000000', fontSize: 15 }}>{this.state.TopPosition}</Text>
                </View>

              </View>
              <View
                style={{
                  width: wp('80%'),

                  borderBottomColor: '#00000050',
                  borderBottomWidth: 1,
                }}
              />
              <View style={{ width: wp('80%'), marginTop: 10 }}>
                <Text style={{ color: secondaryColor, fontSize: 13 }}>Email Id</Text>
                <Text style={{ color: '#000000', fontSize: 17, }}>{this.state.EmailId}</Text>
                <Text style={{ color: secondaryColor, fontSize: 13, marginTop: 10 }}>Reporting Manager</Text>
                <Text style={{ color: '#000000', fontSize: 17, }}>{this.state.ReportingManager}</Text>
                <Text style={{ color: secondaryColor, fontSize: 13, marginTop: 10 }}>Function</Text>
                <Text style={{ color: '#000000', fontSize: 17, }}>{this.state.Function1}</Text>
                <Text style={{ color: secondaryColor, fontSize: 13, marginTop: 10 }}>Sub Function</Text>
                <Text style={{ color: '#000000', fontSize: 17, }}>{this.state.SubFunction}</Text>
                <Text style={{ color: secondaryColor, fontSize: 13, marginTop: 10 }}>Department</Text>
                <Text style={{ color: '#000000', fontSize: 17, }}>{this.state.Department1}</Text>
                <Text style={{ color: secondaryColor, fontSize: 13, marginTop: 10 }}>Date of Joining</Text>
                <Text style={{ color: '#000000', fontSize: 17, marginBottom: 30 }}>{this.state.DoJ}</Text>
              </View>
            </View>
          </ScrollView>
        )
}
      </View>
    );
  }
}

const styles = StyleSheet.create({

  ImageStyle1: {

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
)(Profile);
