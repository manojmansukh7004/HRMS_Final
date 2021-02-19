
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      BankName1: '',
      AccNo: '',
      AccType1: '',
      BankAdd1: '',
      Ifsccode: '',
      Bankbranch: '',
      spinner: true,

    };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.saveclarification();
  }


     recycle1 = () => {
       this.props.navigation.goBack();
     };

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
           this.setState(
             {
               isLoading: false,
               spinner: false,
               dataSource: responseJson.ProfileData[0]['Bank Data'],

             },

           );


           this.setState(
             {
               BankName1: this.state.dataSource[0].BankName,
               AccNo: this.state.dataSource[0].AccNumber,
               AccType1: this.state.dataSource[0].AccType,
               BankAdd1: this.state.dataSource[0].BankAdd,
               Ifsccode: this.state.dataSource[0].IfscCode,
               Bankbranch: this.state.dataSource[0].BankBranch,

             }
           );
         })

         .catch(() => {

         });
     }

     render() {
       const { secondaryColor } = this.props;
       return (
         <View style={{
           width: wp('100%'), height: hp('100%'), alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF0F1',
         }}
         >

           {
      this.state.spinner ? <ActivityIndicator style={styles.activityIndicatotor} color={this.props.secondaryColor} size="large" />
        : (

          <View style={{ flex: 1, }}>

            <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 25 }}>

              <View style={{ width: wp('40%'), justifyContent: 'center', marginLeft: 20 }}>
                <Text style={{ fontSize: 11, color: secondaryColor }}>Account Type</Text>
                <Text style={styles.textStyle3}>{this.state.AccType1}</Text>
              </View>


              <View style={{ width: wp('50%'), justifyContent: 'center', }}>
                <Text style={{ fontSize: 11, color: secondaryColor }}>Account Number</Text>
                <Text style={styles.textStyle3}>{this.state.AccNo}</Text>
              </View>

            </View>


            <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 20 }}>

              <View style={{ width: wp('100%'), justifyContent: 'center', marginLeft: 20 }}>
                <Text style={{ fontSize: 11, color: secondaryColor }}>Bank</Text>
                <Text style={styles.textStyle3}>{this.state.BankName1}</Text>
              </View>


            </View>


            <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 20 }}>

              <View style={{ width: wp('90%'), justifyContent: 'center', marginLeft: 20 }}>
                <Text style={{ fontSize: 11, color: secondaryColor }}>Bank Address</Text>
                <Text style={styles.textStyle3}>
                  {this.state.BankAdd1}
                  {' '}
                </Text>
              </View>


            </View>


            <View style={{ width: wp('100%'), flexDirection: 'row', marginTop: 20, }}>

              <View style={{ width: wp('50%'), marginLeft: 20 }}>
                <Text style={{ fontSize: 11, color: secondaryColor }}>IFSC Code</Text>
                <Text style={styles.textStyle3}>
                  {this.state.Ifsccode}
                  {' '}
                </Text>
              </View>


              <View style={{ width: wp('50%'), }}>
                <Text style={{ fontSize: 11, color: secondaryColor }}>Branch Name</Text>
                <Text style={styles.textStyle3}>
                  {this.state.Bankbranch}
                  {' '}
                </Text>
              </View>

            </View>


          </View>

        )
}

         </View>


       );
     }
}

const styles = StyleSheet.create({
  ImageStyle: {
    width: 25,
    height: 30,
    marginLeft: 7,


  },
  textStyle1: {
    color: '#000',
    fontSize: 18,
    marginLeft: 10,


  },
  textStyle2: {

    fontSize: 11,


  },
  textStyle3: {
    color: '#000',
    fontSize: 14,

  },
  activityIndicatotor: {
    height: '100%',
    width: '100%',
  },

});
const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn
});


export default connect(
  mapStateToProps,
)(App);
