/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  TouchableOpacity, View, Image, StyleSheet, Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';


const styles = StyleSheet.create({
  containerItem: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    margin: 5,
    alignItems: 'center'
  },
  icon: {
    marginLeft: 20,
    padding: 5
  },
  textItem: {
    fontSize: 16,
    marginLeft: 15,
  },
  icDownArrow: {
    height: 12,
    width: 12,
    marginLeft: 40,
    margin: 10,
    marginRight: 40,
  },
  icUpArrow: {
    height: 12,
    width: 12,
    marginLeft: 40,
    marginRight: 40,
    transform: [{ rotate: '180deg' }],
    marginTop: 12
  }
});
class DrawerMenuItem extends Component {
  state={
    isExpanded: false,
  };

  onPress = () => {
    if (this.props.expandable) {
      this.setState(prevState => ({
        isExpanded: !prevState.isExpanded
      }));
    } else {
      this.props.onPress();
    }
  }

  render() {
    const { isExpanded } = this.state;
    return (
      <View>
        <TouchableOpacity style={styles.containerItem} onPress={this.onPress}>
          {
            this.props.family === 'SimpleLineIcon'
              ? <SimpleLineIcon style={styles.icon} name={this.props.icon} size={20} color="black" />
              : this.props.family === 'Feather'
                ? <FeatherIcon style={styles.icon} name={this.props.icon} size={20} color="black" />
                : <Icon style={styles.icon} name={this.props.icon} size={20} color="black" />
          }
          <Text style={[styles.textItem, { flex: 1 }]}>{this.props.title}</Text>
          {
            this.props.expandable ? (
              <Image
                style={isExpanded ? styles.icUpArrow : styles.icDownArrow}
                source={require('../assets/images/ic_arrow_down.png')}
              />
            ) : null
          }
        </TouchableOpacity>

        {
        isExpanded
          ? this.props.renderSublist() : null
      }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
});

export default connect(
  mapStateToProps,
)(DrawerMenuItem);
