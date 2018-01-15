import React from 'react';

export default class Header extends React.Component {
    openModal(e) {
        e.preventDefault();
        const modal = document.querySelector('.about-modal');
        modal.style.top = '50%';
    }

    closeModal(e) {
        e.preventDefault();
        const modal = document.querySelector('.about-modal');
        modal.style.top = '-100%';
    }

    render() {
        return (
            <header className="header">
                <div className="wrapper header-content">
                    <h1 className="logo">Froogle</h1>
                    <a href="#" onClick={this.openModal} className="about-this-page"><i className="fas fa-info-circle" title="About this page"></i></a>
                </div>
                <div className="about-modal">
                    <a href="#" className="about-modal__close" onClick={this.closeModal}>Close</a>
                    <h2>Froogle is currently in alpha.</h2>
                    <p>Please do not store any important information here - You will likely lose access to it.</p>
                    <p>
                        You're logged into Froogle anonymously - This temporary account is associated with this device only. It's not currently possible to access your Froogle data from other devices (coming soon!.
                    </p>
                    <p>
                        Happy Froogling! 💸 💸 💸
                    </p>
                    <p>
                        Built with <i class="fas fa-heart" title="Love"></i> by <a href="http://dylanon.com">Dylan On</a>.
                    </p>
                </div>
            </header>
        )
    }
}