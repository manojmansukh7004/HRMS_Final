import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Foundation';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    marginLeft: 15
  },
  card: {
    margin: 5,
    borderRadius: 10,
    padding: 5
  }
});

export default props => (
  <Card elevation={2} style={styles.card} onPress={() => props.onPress(props.item)}>
    <View style={styles.container}>
      <Icon name="marker" color={props.item.isSelected ? 'green' : 'gray'} size={28} />
      <Text style={styles.text} numberOfLines={2}>{props.item.description}</Text>
    </View>

  </Card>
);
