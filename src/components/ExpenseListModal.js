/* eslint-disable max-len */
/* eslint-disable radix */
import React, { Component } from 'react';
import {
  StyleSheet, Dimensions, Text, FlatList, TouchableHighlight, ScrollView, View
} from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { Searchbar } from 'react-native-paper';
import expenseList from '../config/SandryExpenseList';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: width - 50,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 5
  },
  input: {
    padding: 0,
    fontSize: 16,
    margin: 0,
    elevation: 0
  },
  searchbar: {
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
    height: 40,
    elevation: 0,
    marginBottom: 20
  },
  list: {
    height: 150,
  }
});


class ExpenseListModal extends Component {
  state={
    query: '',
    listData: expenseList,
  };

  onChangeText = text => {
    this.setState({ query: text });
    if (text.length > 0) {
      const filteredList = expenseList.filter(i => i.text.toLowerCase().includes(text.toLowerCase()));
      this.setState({ listData: filteredList });
    } else {
      this.setState({ listData: expenseList });
    }
  }

  render() {
    return (
      <Modal
        style={styles.modal}
        isVisible={this.props.isVisible}
        onBackdropPress={this.props.hideModal}
        onBackButtonPress={this.props.hideModal}
        onModalShow={this.setTimeout}
        onModalHide={this.onModalHide}
      >


        <View style={styles.container}>
          <ScrollView>
            <Searchbar
              placeholder="Search expense type"
              selectionColor={this.props.secondaryColor}
              inputStyle={styles.input}
              style={styles.searchbar}
              onChangeText={query => this.onChangeText(query)}
              value={this.state.query}
            />
            <FlatList
              data={this.state.listData}
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableHighlight underlayColor={this.props.secondaryColor} onPress={() => this.props.onExpenseItemSelected(item)}>
                  <Text style={styles.text}>{item.text}</Text>
                </TouchableHighlight>
              )}
              keyExtractor={item => item.value}
            />
          </ScrollView>
        </View>


      </Modal>

    );
  }
}

const mapStateToProps = state => ({
  secondaryColor: state.theme.secondaryColor,
});

export default connect(
  mapStateToProps
)(ExpenseListModal);
