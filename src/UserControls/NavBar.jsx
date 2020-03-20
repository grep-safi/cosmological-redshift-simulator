import React from 'react';
import PropTypes from 'prop-types';

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-md navbar-light bg-dark d-flex justify-content-between">
                    <span className="navbar-brand mb-0 text-light h1">Cosmological Redshift Simulator</span>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link text-light" href="#" onClick={this.props.onResetClick}>Reset</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-light" href="#" data-toggle="modal" data-target="#helpModal">Help</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-light" href="#" data-toggle="modal" data-target="#aboutModal">About</a>
                        </li>
                    </ul>
                </nav>
            </React.Fragment>
        );
    }
}

NavBar.propTypes = {
    onResetClick: PropTypes.func.isRequired
}

