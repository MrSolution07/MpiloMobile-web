import React from 'react';

const LandingPage = () => {
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Welcome to MpiloMobile</h1>
                <p>Your one-stop solution for mobile services</p>
            </header>
            <main style={styles.main}>
                <button style={styles.button}>Get Started</button>
                <button style={styles.button}>Learn More</button>
            </main>
            <footer style={styles.footer}>
                <p>&copy; {new Date().getFullYear()} MpiloMobile. All rights reserved.</p>
            </footer>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '20px',
    },
    header: {
        marginBottom: '20px',
    },
    main: {
        margin: '20px 0',
    },
    button: {
        margin: '10px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#007BFF',
        color: '#fff',
    },
    footer: {
        marginTop: '20px',
        fontSize: '14px',
        color: '#666',
    },
};

export default LandingPage;