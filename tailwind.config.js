/** @type {import('tailwindcss').Config} */
const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	plugins: [require('flowbite/plugin')],

	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				primary: {
					50: '#edf2ff',
					100: '#dee8ff',
					200: '#c4d3ff',
					300: '#a0b5ff',
					400: '#7a8cff',
					500: '#4854f9',
					600: '#3e3cef',
					700: '#332fd3',
					800: '#2b29aa',
					900: '#292a86',
					950: '#18184e'
				},
				blue: {
					50: '#edf2ff',
					100: '#dee8ff',
					200: '#c4d3ff',
					300: '#a0b5ff',
					400: '#7a8cff',
					500: '#4854f9',
					600: '#3e3cef',
					700: '#332fd3',
					800: '#2b29aa',
					900: '#292a86',
					950: '#18184e'
				},
				gray: {
					50: '#fafafa',
					100: '#f4f4f5',
					200: '#e4e4e7',
					300: '#d4d4d8',
					400: '#a1a1aa',
					500: '#71717a',
					600: '#52525b',
					700: '#3f3f46',
					800: '#27272a',
					900: '#18181b',
					950: '#09090b'
				},
				green: {
					50: '#e9fff7',
					100: '#cbffea',
					200: '#9bffdb',
					300: '#48f9c4',
					400: '#1cebb4',
					500: '#00d39f',
					600: '#00ac82',
					700: '#008a6c',
					800: '#006d57',
					900: '#005949',
					950: '#00322a'
				}
			}
		}
	}
};

module.exports = config;
