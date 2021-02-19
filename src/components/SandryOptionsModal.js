/* eslint-disable max-len */
/* eslint-disable radix */
import React, { Component } from 'react';
import {
  StyleSheet, Dimensions, Text, FlatList, TouchableHighlight, ScrollView, View
} from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { Searchbar } from 'react-native-paper';

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
  }
});


class SandryOptionsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      listData: this.props.data,
    };
  }


  onChangeText = text => {
    this.setState({ query: text });
    if (text.length > 0) {
      const filteredList = this.props.data.filter(i => i.toLowerCase().includes(text.toLowerCase()));
      this.setState({ listData: filteredList });
    } else {
      this.setState({ listData: this.props.data });
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
            <Text style={styles.text} />
            <Searchbar
              placeholder="Search"
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
                <TouchableHighlight
                  underlayColor={this.props.secondaryColor}
                  onPress={() => {
                    this.props.hideModal();
                    this.props.onItemSelected(item);
                  }}
                >
                  <Text style={styles.text}>{item.FieldValues.split('$')[0]}</Text>
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
)(SandryOptionsModal);
