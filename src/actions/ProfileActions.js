import * as Types from '../constants/ActionTypes';
import { callApi, fetch } from '../utils/APICaller';
import { Process } from './../reducers/ProcessReducer'

export const ProfileAction = {
    fetchProfiles: (profiles) => {
        return {
            type: Types.FETCH_PROFILES,
            profiles
        }
    },
    fetchMessageForms: (messageForms) => {
        return {
            type: Types.FETCH_PROFILE_MESSAGE_FORMS,
            messageForms
        }
    }
}

export const ProfileRequest = {
    fetchProfiles: () => {
        return async (dispatch) => {
            const res = await callApi('profile', 'GET', null);
            dispatch(ProfileAction.fetchProfiles(res.data));
        };
    },
    fetchMessageForms: () => {
        return async (dispatch) => {
            const res = await fetch(`ProfileMessageForm/GetAll`, 'GET', null);
            dispatch(ProfileAction.fetchMessageForms(res.data));
        }
    },
    createNewProfile: (profile, callback) => {
        return async (dispatch) => {
            const res = await fetch(`Profile/AddProfile`, 'POST', new Process().toProfile(profile));
            callback(res.data);
        }
    }
}