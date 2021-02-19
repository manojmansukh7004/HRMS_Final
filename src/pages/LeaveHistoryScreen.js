/* eslint-disable no-console */
import React, { Component } from 'react';
import {
  FlatList, View, ActivityIndicator, StyleSheet, RefreshControl, Text,
} from 'react-native';
import { connect } from 'react-redux';
import ListItem from '../components/LeaveHistoryItem';
import { getLeaveHistory } from '../services/LeaveHistoryService';


const styles = StyleSheet.create({
  indicator: { height: '100%', width: '100%', justifyContent: 'center' },
  list: { marginBottom: 10, height: '100%' },
  listContainer: { paddingBottom: 20, marginBottom: 30 },
  emptyContainer: {
    justifyContent: 'center', height: '100%', width: '100%', marginTop: 20
  },
  emptyListItem: { alignSelf: 'center', fontSize: 16 }
});

class LeaveHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false
    };
    this.historyData = [];
    this.historyDataRev = [];
  }

  async componentDidMount() {
    this.getHistory();
  }

  getHistory=async () => {
    const response = await getLeaveHistory(this.props.user);
    console.log('attHistory', response);
    if (response) {
      this.historyData = response.LeaveHistory;
      this.historyDataRev = this.historyData.reverse();
      this.setState({ isLoading: false, refreshing: false });
    } else {
      this.setState({ isLoading: false, refreshing: false });
    }
  }

  refresh=() => {
    this.setState({ refreshing: true });
    this.getHistory();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={this.props.secondaryColor} />
        </View>
      );
    }
    return (
      <View>
        <View>
          <FlatList
            data={this.historyDataRev}
            style={styles.list}
            contentContainerStyle={styles.listContainer}
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
              />
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyListItem}>No Records Found....</Text>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn
});

export default connect(
  mapStateToProps,
)(LeaveHistoryScreen);
