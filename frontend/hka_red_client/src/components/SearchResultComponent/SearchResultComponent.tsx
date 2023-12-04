import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  Button,
} from "react-native";

export interface DataItems {
  id: string;
  title: string;
}

export let initialData: DataItems[] = [
  { id: "1", title: "First item" },
  { id: "2", title: "Second item" },
  { id: "3", title: "Third item" },
  { id: "4", title: "Fourth item" },
  { id: "5", title: "Fifth item" },
  { id: "6", title: "Sixth item" },
  { id: "7", title: "Seventh item" },
  { id: "8", title: "Eighth item" },
  { id: "9", title: "Ninth item" },
  { id: "10", title: "Tenth item" },
  { id: "11", title: "Eleventh item" },
  { id: "12", title: "Twelfth item" },
  { id: "13", title: "Thirteenth item" },
  { id: "14", title: "Fourteenth item" },
  { id: "15", title: "Fifteenth item" },
  { id: "16", title: "Sixteenth item" },
  { id: "17", title: "Seventeenth item" },
  { id: "18", title: "Eighteenth item" },
  { id: "19", title: "Nineteenth item" },
  { id: "20", title: "Twentieth item" },
];

interface SearchResultProps {
  filteredData: DataItems[];
}

const SearchResultComponent : React.FC<SearchResultProps> = ({filteredData}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredData}
        extraData={filteredData}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.border}>
            <Button title={item.title}></Button>
          </View>
        )}
      />
    </View>
  );
};
export default SearchResultComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    alignSelf: "stretch",
  },
  border: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
  },
});
