import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SubredditSearchComponent from "./SubredditSearchComponent";
import HomeScreen from "./HomeComponent";
import NotificationScreen from "./NotificationComponent";
import DetailComponent from "./DetailComponent";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Back"
        component={MyTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Detail" component={DetailComponent} />
    </Stack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator initialRouteName={"Home"}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ subredditName: "r/askreddit" }}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SubredditSearchComponent}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
