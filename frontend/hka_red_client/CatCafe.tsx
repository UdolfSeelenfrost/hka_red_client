import React, {useState} from 'react';
import {Text, TextInput, View, Image, Button} from 'react-native';

type CatProps = {
    name: String;
}

const Cat = (props: CatProps) => {

    const [isHungry, setIsHungry] = useState(true);
    const [getPettedCount, setPettedCount] = useState(0);

    return (
        <View>
            <Text>
                I am {props.name}, and I am {isHungry ? "hungry" : "full"}.
            </Text>
            <Button
                onPress={() => {
                    setIsHungry(false);
                }}
                disabled={!isHungry}
                title={isHungry ? "Gib mir Milkies" : "Thank You!!!"}
            />
            <Button
                onPress={() => {
                    setPettedCount(getPettedCount + 1);
                }}
                title={"You petted me " + getPettedCount.toString() + " times"}
            />
        </View>
    );
};

const Cafe = () => {
    return (
        <View>
            <Text>Welcome!</Text>
            <Cat name="Sky" />
            <Cat name="Felix"/>
            <Cat name="Lucy"/>
        </View>
    );
};

export default Cafe;