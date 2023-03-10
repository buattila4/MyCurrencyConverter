import { ActivityIndicator, StyleSheet, ScrollView, View, Text } from 'react-native';
import React, {useEffect, useState} from 'react'
import ExchangeRatesTable from './components/ExchangeRatesTable'
import Converter from './components/Converter';

const uri = "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt";

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [tableData, setTableData] = useState();
  const [exchangeRates, setExchangeRates] = useState();

  const getCurrencies = async () => {
    try {
      const responseObject = await fetch(uri);
      const lines = (await responseObject.text()).split('\n');

      const rows = [];
      const exchangeRates = [];

      for(let i = 2; i < lines.length - 1; i++) {
        const columns = lines[i].split('|');

        rows.push(columns);
        exchangeRates.push([columns[3], (columns[4] / columns[2])]);
      }

      const tableData = {
        tableHead: lines[1].split('|'),
        tableData: rows,
      };

      setTableData(tableData);
      setExchangeRates(exchangeRates);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrencies();
  }, []);

  return (
    <View style={styles.container}> 
      <ScrollView>
        { isLoading ? (
          <ActivityIndicator />
        ) : (
          <View>
            <ExchangeRatesTable tableData = {tableData} />
            <Text style={styles.header}>Convert CZK to different currencies:</Text>
            <Converter exchangeRates = {exchangeRates} />
          </View>
        )
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding: 10, paddingTop: 40},
  header: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
});
