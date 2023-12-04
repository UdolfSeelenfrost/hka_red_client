import React, { useState } from "react";
import SearchResultComponent, {
  DataItems,
  initialData,
} from "../SearchResultComponent/SearchResultComponent";
import SearchBarComponent from "../SearchBarComponent/SearchBarComponent";

export const SearchComponent = () => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<DataItems[]>([...initialData]);

  const updateSearch = (searchString: string) => {
    setSearch(searchString);
    const updatedData = [...initialData]
      .filter((e) => e.title.includes(searchString))
      .map((e) => {
        return { id: e.id, title: e.title } as DataItems;
      });
      setFilteredData(updatedData)
  };
  return (
    <>
      <SearchBarComponent updateSearch={updateSearch} search={search} />
      <SearchResultComponent filteredData={filteredData} />
    </>
  );
};
