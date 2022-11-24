import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';

const checkDevTools = typeof window === 'object'
    && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() :
    f => f;

import {
    useDispatch as useReduxDispatch,
    useSelector as useReduxSelector,
} from 'react-redux';

const initialState = loadState();

export const store = configureStore({
    reducer: {
        auth: authSlice,
    },
    preloadedState: initialState,
    middleware: [thunk],
});

store.subscribe(function() {
    saveState(store.getState());
})

export function loadState() {
    try {
        const serializedData = localStorage.getItem('state')
        if (serializedData === null) {
            return undefined;
        }
        return JSON.parse(serializedData);
    } catch (error) {
        return undefined;
    }
}

export function saveState(state) {
    try {
        let serializedData = JSON.stringify(state);
        localStorage.setItem('state', serializedData);
    } catch (error) {

    }
}

export const useDispatch = () => useReduxDispatch();

export const useSelector = (selector) => useReduxSelector(selector);