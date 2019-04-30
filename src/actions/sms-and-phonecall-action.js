import * as Types from './action-type';

export const SmsAndPhonecallAction = {
    setOpen: (open) => ({
        type:Types.SET_SMS_AND_PHONECALL_OPEN,
        open:open
    })
}