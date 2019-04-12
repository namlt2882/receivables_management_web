import * as Types from './action-type';

export const ProfileAction = {
    setProfiles: (profiles) => {
        return {
            type: Types.SET_PROFILE_LIST,
            profiles
        }
    },
    setProfile: (profile) => {
        return {
            type: Types.SET_PROFILE,
            profile
        }
    },
    setMessageForms: (messageForms) => {
        return {
            type: Types.SET_MESSAGE_LIST,
            messageForms
        }
    }
}
