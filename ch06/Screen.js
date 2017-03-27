import {Dimensions, PixelRatio} from 'react-native';

export default {
	'width' : Dimensions.get('window').width,
	'height' : Dimensions.get('window').height,
	'pixelRatio' : PixelRatio.get(),
	'resolutionX' : Dimensions.get('window').width * PixelRatio.get(),
	'resolutionY' : Dimensions.get('window').height * PixelRatio.get()
}
