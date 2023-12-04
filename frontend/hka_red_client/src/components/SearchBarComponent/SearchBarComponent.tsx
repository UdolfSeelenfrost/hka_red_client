import React, { useState } from "react";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { SearchBar } from "react-native-elements";

interface SearchBarComponentProps {
  updateSearch: (searchString: string) => void;
  search: string;
}

const SearchBarComponent: React.FC<SearchBarComponentProps> = ({updateSearch, search}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 0 }}>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={updateSearch}
          value={search}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchBarComponent;