import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SearchScreenComponent from "./oldShit/SearchScreenComponent";
import SubredditSearchComponent from "./SubredditSearchComponent";
import HomeScreen from "./HomeComponent";
import NotificationScreen from "./NotificationComponent";


const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator initialRouteName={"Home"}>
        <Tab.Screen name="Home" component={HomeScreen} initialParams={{subredditName: "r/all"}}
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={size} />
                        ),
                    }}
        />
        <Tab.Screen name="Search" component={SubredditSearchComponent}
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="magnify" color={color} size={size} />
                        ),
                    }}
        />
            <Tab.Screen name="Notifications" component={NotificationScreen}
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
            <MyTabs />
        </NavigationContainer>
    );
}
