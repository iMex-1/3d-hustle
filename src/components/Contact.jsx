import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import '../styles/contact.css';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send to a backend
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <h1>Get In Touch</h1>
                    <p>Have questions? We'd love to hear from you.</p>
                </div>
            </section>

            <section className="contact-content">
                <div className="contact-info">
                    <h2>Contact Information</h2>
                    <p>Reach out to us through any of these channels:</p>

                    <div className="info-cards">
                        <div className="info-card">
                            <div className="info-icon">
                                <FaEnvelope />
                            </div>
                            <h3>Email</h3>
                            <p>support@3dmarketplace.com</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <FaPhone />
                            </div>
                            <h3>Phone</h3>
                            <p>+1 (555) 123-4567</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <FaMapMarkerAlt />
                            </div>
                            <h3>Location</h3>
                            <p>123 Design Street<br />Creative City, CC 12345</p>
                        </div>
                    </div>
                </div>

                <div className="contact-form-container">
                    <h2>Send Us a Message</h2>
                    {submitted ? (
                        <div className="success-message">
                            <FaPaperPlane />
                            <h3>Message Sent!</h3>
                            <p>Thank you for contacting us. We'll get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Subject *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="What is this about?"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Your message..."
                                    rows="6"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-submit">
                                <FaPaperPlane /> Send Message
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Contact;
