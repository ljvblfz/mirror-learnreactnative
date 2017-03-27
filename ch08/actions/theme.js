export const ACTION_LIGHT = 'action_light';
export const ACTION_DARK = 'action_dark';

export function setLightTheme() {
	return {type: ACTION_LIGHT};
}

export function setDarkTheme() {
	return {type: ACTION_DARK};
}
