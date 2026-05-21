import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DiseaseCard = () => (
  <View style={styles.card}>
    <Text>Disease Card</Text>
  </View>
);

const styles = StyleSheet.create({ card: { padding: 16, borderRadius: 8, backgroundColor: '#fff', margin: 8 } });

export default DiseaseCard;
