import * as React from 'react';

import { Popup } from '@progress/kendo-react-popup';

export class MiddlePopup extends React.Component {
    render() {
        return (
            <Popup
                {...this.props}
                anchorAlign={{
                    horizontal: 'right',
                    vertical: 'middle'
                }}
                popupAlign={{
                    horizontal: 'right',
                    vertical: 'top'
                }}
            />
        );
    }
}
