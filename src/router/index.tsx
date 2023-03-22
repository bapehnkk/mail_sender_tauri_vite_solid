import {Route, Routes} from "@solidjs/router";
import {lazy, Component} from "solid-js";

import HomeScreen from "../screens/Home";
import {Creds} from "../App";
import {FieldOptions} from "../components/FormField";


const SettingsScreen = lazy(() => import("../screens/Settings"));

const AppRoutes: Component<Creds> = (props) => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <HomeScreen
                        getCreds={props.getCreds}
                        setCreds={props.setCreds}
                    />
                }
            />
            <Route path="/settings" element={
                <SettingsScreen
                    getCreds={props.getCreds}
                    setCreds={props.setCreds}
                />
            }/>
        </Routes>
    )
}

export default AppRoutes;
