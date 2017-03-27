import {ACTION_LIGHT, ACTION_DARK} from '../actions/theme';

export type State = {
	themeState: string
}

const initialState = {
	themeState: 'light'
};

export default function(state : State = initialState, action) : State {
	switch(action.type) {
		case ACTION_LIGHT:
			return {
				...state,
				themeState: 'light'
			};
		case ACTION_DARK:
			return {
				...state,
				themeState: 'dark'
			};
		default:
			return state
	}
}
