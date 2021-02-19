import React, { Component } from 'react';
import {
  FlatList, View, ActivityIndicator, StyleSheet, RefreshControl, Text,
} from 'react-native';
import { connect } from 'react-redux';
import { Searchbar } from 'react-native-paper';
import { getPendingTasks } from '../services/InboxPendingTasksService';
import { getCompletedTasks } from '../services/InboxCompletedTasksService';
import ListItem from '../components/PendingTasksItem';
import { setCompletedTasks, setPendingTasks } from '../redux/actions/user';


const styles = StyleSheet.create({
  contianer: {

  },
  activityIndicatotor: {
    height: '100%',
    width: '100%',
  }
});

class PendingTasksScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      tasks: this.props.pendingTasks,
      refreshing: false,
      query: '',
    };
  }


  async componentDidMount() {
    this.getTasks();
  }

  getTasks =async () => {
    const response = await getPendingTasks(this.props.user);
    this.setState({
      tasks: response.TODOProfile[0],
      loading: false,
      refreshing: false,
    });
    this.props.setPendingTasks(response.TODOProfile[0]);
    // eslint-disable-next-line prefer-destructuring
    this.tasks = response.TODOProfile[0];
  }

  onPress = (item, index) => {
    // console.log(item);
    if (item.ProcessId === 'ATTENDANCECAN') {
      this.props.navigation.navigate('AttCancelApprovalReject', { item, shouldRefresh: this.shouldRefresh, index });
    } else if (item.ProcessId === 'Leave') {
      this.props.navigation.navigate('LeaveApprovalReject', { item, shouldRefresh: this.shouldRefresh, index });
    } else if (item.ProcessId === 'Attendance') {
      this.props.navigation.navigate('AttRegApprovalReject', { item, shouldRefresh: this.shouldRefresh, index });
    } else if (item.ProcessId === 'LEAVECAN') {
      this.props.navigation.navigate('LeaveCancelApprovalReject', { item, shouldRefresh: this.shouldRefresh, index });
    } else if (item.ProcessId === 'Sundry Expense') {
      this.props.navigation.navigate('ExpenseApprovalReject', { item, shouldRefresh: this.shouldRefresh, index });
    }
  }

  shouldRefresh =async (data, index) => {
    if (data && data.refresh) {
      const { tasks } = this.state;
      tasks.splice(index, 1);
      this.setState({
        tasks
      });
      const response = await getCompletedTasks(this.props.user);
      this.props.setCompletedTasks(response.CompletedTasks[0]);
    }
  }

  refresh= () => {
    this.setState({ refreshing: true, query: '' });
    this.getTasks();
  }

  onChangeText = text => {
    this.setState({ query: text });
    if (text.length > 0) {
      const tasks = this.tasks.filter(i => i.ProcessText.toLowerCase().includes(text.toLowerCase())
      || i.NAME.toLowerCase().includes(text.toLowerCase())
      || i.BEGDA.toLowerCase().includes(text.toLowerCase())
      || i.ENDDA.toLowerCase().includes(text.toLowerCase())
      || i.IDATE.toLowerCase().includes(text.toLowerCase()));
      this.setState({ tasks });
    } else {
      this.setState({ tasks: this.props.pendingTasks });
    }
  }

  render() {
    return (
      <View>
        {
          this.state.loading ? <ActivityIndicator style={styles.activityIndicatotor} color={this.props.secondaryColor} size="large" />
            : (
              <View style={{ marginBottom: 28 }}>
                <View>
                  <Searchbar
                    placeholder="Search"
                    selectionColor={this.props.secondaryColor}
                    inputStyle={
                      {
                        padding: 0,
                        fontSize: 16,
                        margin: 0,
                        alignSelf: 'center',
                        elevation: 0
                      }
                    }
                    style={{
                      margin: 10,
                      borderRadius: 4,
                      backgroundColor: '#E5E5E5',
                      height: 40,
                      elevation: 0,
                      marginTop: 20
                    }}
                    onChangeText={query => this.onChangeText(query)}
                    value={this.state.query}
                  />
                </View>
                <FlatList
                  data={this.state.tasks}
                  style={{ marginBottom: 70 }}
                  contentContainerStyle={{ paddingBottom: 40, marginBottom: 70 }}
                  refreshControl={(
                    <RefreshControl
                      colors={[this.props.secondaryColor]}
                      refreshing={this.state.refreshing}
                      onRefresh={() => this.refresh()}
                    />
                  )}

                  renderItem={({ item, index }) => (
                    <ListItem
                      item={item}
                      index={index}
                      onPressItem={i => this.onPress(i, index)}
                      attendenceType={item.AttendenceType}
                      processText={item.ProcessText}
                      date={item.ProcessText}
                    />
                  )}
                  ListEmptyComponent={() => <Text style={{ margin: 10 }}>No tasks found.</Text>}
                  keyExtractor={item => item.id}
                />
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
  pendingTasks: state.user.pendingTasks,
  completedTasks: state.user.completedTasks,
});


const mapDispatchToProps = dispatch => ({
  setCompletedTasks: tasks => {
    dispatch(setCompletedTasks(tasks));
  },
  setPendingTasks: tasks => {
    dispatch(setPendingTasks(tasks));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingTasksScreen);
