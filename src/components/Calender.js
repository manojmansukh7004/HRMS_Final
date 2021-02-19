/* eslint-disable no-empty */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { connect } from 'react-redux';
import MonthView from './MonthView';
import { months, weekDays, nDays } from '../config/Constants';
import { viewAttendence } from '../services/ViewAttendance';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: 350
  },
  activityIndicator: {
    height: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  textMonth: {
    fontSize: 18,
    textAlign: 'center',
    flex: 1
  }
});

class Calender extends Component {
  state = {
    activeDate: new Date(),
    attendence: [],
    loading: true,
    data: [],
  };


  async componentDidMount() {
    this.getAttendence();
  }

   getAttendence = async () => {
     try {
       const response = await viewAttendence(this.props.user, this.state.activeDate.getFullYear(), this.state.activeDate.getMonth() + 1);
       this.props.onData(response.ViewAttendance[0]);
       this.setState({
         attendence: response.ViewAttendance[0],
       }, () => {
         this.generateMatrix();
       });
     } catch (error) {}
   }

   getInnerData =() => 'some inner data'

  changeMonth = n => {
    this.setState({ loading: true }, () => {
      this.setState(() => {
        this.state.activeDate.setMonth(this.state.activeDate.getMonth() + n);
        this.getAttendence();
        return this.state;
      });
    });
  };

  refreshCalender =() => {
    this.setState({ loading: true }, () => {
      this.setState(async () => {
        this.state.activeDate.setMonth(this.state.activeDate.getMonth());
        try {
          const response = await viewAttendence(this.props.user, this.state.activeDate.getFullYear(), this.state.activeDate.getMonth() + 1);
          this.props.onData(response.ViewAttendance[0]);
          this.setState({
            attendence: response.ViewAttendance[0],
          }, () => {
            this.generateMatrix();
          });
        } catch (error) {}
        return this.state;
      });
    });
  }

  generateMatrix() {
    const { attendence } = this.state;
    const matrix = [];
    matrix[0] = weekDays;
    const year = this.state.activeDate.getFullYear();
    const month = this.state.activeDate.getMonth();
    const firstDay = new Date(year, month, 0).getDay();
    let maxDays = nDays[month];
    if (month === 1) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        maxDays += 1;
      }
    }
    let counter = 1;
    for (let row = 1; row < 7; row++) {
      matrix[row] = [];
      for (let col = 0; col < 7; col++) {
        matrix[row][col] = {};
        if (row === 1 && col >= firstDay) {
          const obj = {
            day: counter,
            item: attendence[counter - 1],
          };
          matrix[row][col] = obj;
          counter++;
        } else if (row > 1 && counter <= maxDays) {
          const obj = {
            day: counter,
            item: attendence[counter - 1],
          };
          matrix[row][col] = obj;
          counter++;
        }
      }
    }
    this.setState({ data: matrix, loading: false });
  }


  render() {
    return (
      <View style={styles.container}>

        {
            this.state.loading ? <ActivityIndicator color={this.props.secondaryColor} style={styles.activityIndicator} size="large" />
              : (
                <View>
                  <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.btn} onPress={() => this.changeMonth(-1)}>
                      <Icon name="caretleft" size={14} color="black" />
                    </TouchableOpacity>
                    <Text
                      style={styles.textMonth}
                    >
                      {months[this.state.activeDate.getMonth()]}
                      {' '}
&nbsp;
                      {this.state.activeDate.getFullYear()}
                    </Text>
                    <TouchableOpacity style={styles.btn} onPress={() => this.changeMonth(+1)}>
                      <Icon name="caretright" size={14} color="black" />
                    </TouchableOpacity>
                  </View>

                  <MonthView data={this.state.data} onPress={(item) => this.props.onPressDay(item)} />

                </View>
              )
          }

      </View>
    );
  }
}


const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn,
  isPunched: state.user.isPunched
});

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(Calender);
