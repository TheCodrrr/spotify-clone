import React from "react";
import './Footer.css'

export default function Footer() {
    return (
        <>
            <div className="footer dff">
                <div className="footer_upper dff footer_child">
                    <div className="footer_upper_elms df">
                        <h4 className="footer_elm_head">Company</h4>
                        <a href="#" className="footer_elm_link">
                            About
                        </a>
                        <a href="#" className="footer_elm_link">
                            Jobs
                        </a>
                        <a href="#" className="footer_elm_link">
                            For the Record
                        </a>
                    </div>
                    <div className="footer_upper_elms df">
                        <h4 className="footer_elm_head">Communities</h4>
                        <a href="#" className="footer_elm_link">
                            For Artists
                        </a>
                        <a href="#" className="footer_elm_link">
                            Developers
                        </a>
                        <a href="#" className="footer_elm_link">
                            Advertising
                        </a>
                        <a href="#" className="footer_elm_link">
                            Investors
                        </a>
                        <a href="#" className="footer_elm_link">
                            Vendors
                        </a>
                    </div>
                    <div className="footer_upper_elms df">
                        <h4 className="footer_elm_head">Useful links</h4>
                        <a href="#" className="footer_elm_link">
                            Support
                        </a>
                        <a href="#" className="footer_elm_link">
                            Free Mobile App
                        </a>
                    </div>
                    <div className="footer_upper_elms df">
                        <h4 className="footer_elm_head">Spotify Plans</h4>
                        <a href="#" className="footer_elm_link">
                            Premium Individual
                        </a>
                        <a href="#" className="footer_elm_link">
                            Premium Duo
                        </a>
                        <a href="#" className="footer_elm_link">
                            Premium Family
                        </a>
                        <a href="#" className="footer_elm_link">
                            Premium Student
                        </a>
                        <a href="#" className="footer_elm_link">
                            Spotify Free
                        </a>
                    </div>
                    <div className="footer_upper_elms footer_upper_elms_icons df-jc">
                        <div className="footer_elms_icon_container dff">
                            <i class="fa-brands fa-instagram"></i>
                        </div>
                        <div className="footer_elms_icon_container dff">
                            <i class="fa-brands fa-twitter"></i>
                        </div>
                        <div className="footer_elms_icon_container dff">
                            <i class="fa-brands fa-facebook"></i>
                        </div>
                    </div>
                </div>
                <span className="footer_divider"></span>
                <div className="footer_lower footer_child df-ai">
                    <div className="footer_lower_child footer_lower_left">
                        <a href="#" className="footer_lower_link">Legal</a>
                        <a href="#" className="footer_lower_link">Safety & Privacy Center</a>
                        <a href="#" className="footer_lower_link">Privacy Policy</a>
                        <a href="#" className="footer_lower_link">Cookies</a>
                        <a href="#" className="footer_lower_link">About Ads</a>
                        <a href="#" className="footer_lower_link">Accessibility</a>
                    </div>
                    <div className="footer_lower_child footer_lower_right dff">
                        © 2025 Spotify AB
                    </div>
                </div>
            </div>
        </>
    )
}