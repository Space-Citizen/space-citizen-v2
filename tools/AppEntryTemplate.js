// Since "expo-yarn-workspaces postinstall" does not work properly on windows,
// we need to manually create the AppEntry.js file. So we copy this file over the expo
// packages on postInstall.
import "expo/build/Expo.fx";
import { activateKeepAwake } from "expo-keep-awake";
import registerRootComponent from "expo/build/launch/registerRootComponent";

import App from "../src/App";

if (__DEV__) {
  activateKeepAwake();
}

registerRootComponent(App);
