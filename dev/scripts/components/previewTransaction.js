import React from 'react';
import moment from 'moment';

export default class PreviewTransaction extends React.Component {
    render() {
        let classes = "preview-transaction";
        if (this.props.showPreview) {
            classes = classes + ' preview-transaction--show'; 
        }
        return (
            <div className={classes}>
                {this.props.date.length > 0 &&
                    <p>{moment(this.props.date, 'YYYY-MM-DD').format('MMM D')}</p>
                }
                {this.props.amount.length > 0 &&
                    <p>${this.props.amount}</p>
                }
                {this.props.description.length > 0 &&
                    <p>{this.props.description}</p>
                }
                {this.props.category.length > 0 &&
                    <p>#{this.props.category}</p>
                }
            </div>
        )
    }
}