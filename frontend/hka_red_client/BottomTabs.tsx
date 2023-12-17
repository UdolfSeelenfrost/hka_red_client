import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SearchScreenComponent from "./SearchScreenComponent";
import SubredditSearchScreenComponent from "./SubredditSearchScreenComponent";



function HomeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home!</Text>
        </View>
    );
}



function NotificationScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Notifications!</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen}
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={size} />
                        ),
                    }}
        />
        <Tab.Screen name="Search" component={SubredditSearchScreenComponent}
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
