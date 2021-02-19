import React, { Component } from 'react';
import {
  FlatList, View, ActivityIndicator, StyleSheet, RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { fetchNotifications } from '../services/FetchNotificationsService';
import { readNotification } from '../services/ReadNotificationService';
import ListItem from '../components/NotificationsItem';
import { setNotifications, setUnreadNotifications } from '../redux/actions/user';


const styles = StyleSheet.create({
  activityIndicatotor: {
    height: '100%',
    width: '100%',
  }
});

class NotificationsScreen extends Component {
  state={
    refreshing: false,
  }

  async componentDidMount() {
    this.fetchNotifications();
  }

  refresh = () => {
    this.fetchNotifications();
  }

  fetchNotifications=async () => {
    const response = await fetchNotifications(this.props.user);
    this.props.setNotifications(response.Notifications[0]);
    const notifications = response.Notifications[0];
    const unReadNotifications = notifications.filter(element => element.IsRead === false);
    this.props.setUnreadNotifications(unReadNotifications.length);
  }

  // Read Single Notification
  onPress=(i, index) => {
    const item = i;
    if (item.IsActionable === '1') {
      item.NAME = item.EmpName;
      item.ProcessIDFromTable = item.ProcessIdFromTable;
      item.UWLID = item.UwlId;
      item.Process = item.TransactionId;
      if (item.ProcessId === 'ATTENDANCECAN') {
        this.props.navigation.navigate('AttCancelApprovalReject', { item, shouldRefresh: this.shouldRefresh });
      } else if (item.ProcessId === 'LEAVEAPP') {
        this.props.navigation.navigate('LeaveApprovalReject', { item, shouldRefresh: this.shouldRefresh });
      } else if (item.ProcessId === 'ATTENDANCEAPP') {
        this.props.navigation.navigate('AttRegApprovalReject', { item, shouldRefresh: this.shouldRefresh });
      } else if (item.ProcessId === 'LEAVECAN') {
        this.props.navigation.navigate('LeaveCancelApprovalReject', { item, shouldRefresh: this.shouldRefresh });
      } else if (item.ProcessId === 'Sundry Expense') {
        this.props.navigation.navigate('ExpenseApprovalReject', { item, shouldRefresh: this.shouldRefresh });
      }
    }

    readNotification(this.props.user, item.NotificationId)
      .then(response => {
        if (response.SuccessList) {
          const { notifications } = this.props;
          notifications[index].IsRead = true;
          this.props.setNotifications(notifications);
          const unReadNotifications = notifications.filter(element => element.IsRead === false);
          this.props.setUnreadNotifications(unReadNotifications.length);
        }
      });
  }

  shouldRefresh = (data) => {

  }

  render() {
    return (
      <View>
        {
          !this.props.notifications ? <ActivityIndicator style={styles.activityIndicatotor} color={this.props.secondaryColor} size="large" />
            : (
              <View style={{ backgroundColor: '#F9F9F9' }}>
                <FlatList
                  data={this.props.notifications}
                  extraData={this.props}
                  contentContainerStyle={{ paddingBottom: 20 }}
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
                      onPressItem={() => this.onPress(item, index)}
                    />
                  )}
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
  notifications: state.user.notifications,
});


const mapDispatchToProps = dispatch => ({
  setNotifications: notifications => {
    dispatch(setNotifications(notifications));
  },
  setUnreadNotifications: count => {
    dispatch(setUnreadNotifications(count));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationsScreen);
