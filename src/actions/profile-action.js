import * as Types from './action-type';
import { callApi, fetch } from '../utils/api-caller';
import { Process } from '../reducers/process-reducer'

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
            const res = await fetch('Profile', 'GET', null);
            dispatch(ProfileAction.fetchProfiles(res.data));
        };
    },
    fetchMessageForms: () => {
        return async (dispatch) => {
            const res = await fetch(`ProfileMessageForm`, 'GET', null);
            dispatch(ProfileAction.fetchMessageForms(res.data));
        }
    },
    createNewProfile: (profile, callback) => {
        return async (dispatch) => {
            const res = await fetch(`Profile`, 'POST', new Process().toProfile(profile));
            callback(res.data);
        }
    }
}