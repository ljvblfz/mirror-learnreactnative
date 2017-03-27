import {NativeModules} from 'react-native';

export default {
	'systemName' : NativeModules.DeviceInfo.systemName,
	'systemVersion' : NativeModules.DeviceInfo.systemVersion,
	'defaultLanguage' : NativeModules.DeviceInfo.deviceLocale,
	'appVersion' : NativeModules.DeviceInfo.appVersion
}
