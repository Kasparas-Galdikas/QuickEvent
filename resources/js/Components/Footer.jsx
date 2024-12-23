import React from 'react';
import '../../css/Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="footer-copyright">
                    &copy; {new Date().getFullYear()} QuickEvent. All rights reserved.
                </p>
                <ul className="footer-links">
                    <li>
                        <a href="/about" className="footer-link">
                            About
                        </a>
                    </li>
                    <li>
                        <a href="/privacy" className="footer-link">
                            Privacy Policy
                        </a>
                    </li>
                    <li>
                        <a href="/help" className="footer-link">
                            Help
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}
