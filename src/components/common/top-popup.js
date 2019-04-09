
import * as React from 'react';

import { Popup } from '@progress/kendo-react-popup';

export class TopPopup extends React.Component {
    render() {
        return (
            <Popup
                {...this.props}
                anchorAlign={{
                    horizontal: 'right',
                    vertical: 'top'
                }}
                popupAlign={{
                    horizontal: 'right',
                    vertical: 'bottom'
                }}
            />
        );
    }
}
