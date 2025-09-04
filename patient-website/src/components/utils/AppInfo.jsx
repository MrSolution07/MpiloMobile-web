
import React from 'react';

const AppInfo = () => {
  const styles = {
    container: {
      backgroundColor: '#ffffff',
      paddingTop: '80px',
      paddingBottom: '80px',
      position: 'relative',
      overflow: 'hidden',
    },
    gradientBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "#ffffff",
      opacity: 0.05,
    },
    floatingElement: {
      position: 'absolute',
      borderRadius: '50%',
      opacity: 0.2,
      animation: 'float 6s ease-in-out infinite',
    },
    floatingElement1: {
      top: '80px',
      left: '40px',
      width: '128px',
      height: '128px',
      backgroundColor: '#274D60',
    },
    floatingElement2: {
      top: '160px',
      right: '80px',
      width: '96px',
      height: '96px',
      backgroundColor: '#D7261E',
      animationDelay: '-2s',
    },
    floatingElement3: {
      bottom: '80px',
      left: '25%',
      width: '80px',
      height: '80px',
      backgroundColor: '#274D60',
      animationDelay: '-4s',
    },
    innerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px',
      position: 'relative',
      zIndex: 10,
    },
    header: {
      textAlign: 'center',
      marginBottom: '64px',
    },
    iconContainer: {
      width: '64px',
      height: '64px',
      background: 'linear-gradient(to right, #274D60, #D7261E)',
      borderRadius: '50%',
      marginBottom: '24px',
      margin: '0 auto 24px auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
    },
    mainTitle: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '16px',
      lineHeight: 1.1,
    },
    titleIntro: {
      display: 'block',
      color: '#274D60',
    },
    titleMain: {
      color: '#274D60',
    },
    subtitle: {
      fontSize: '20px',
      color: '#4b5563',
      maxWidth: '512px',
      margin: '0 auto',
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '64px',
      alignItems: 'center',
    },
    featuresSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
    },
    featuresGrid: {
      display: 'grid',
      gap: '24px',
    },
    featureCard: {
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
    },
    appIcon: {
      background: 'linear-gradient(135deg, #274D60 0%, #D7261E 100%)',
      borderRadius: '12px',
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      marginBottom: '16px',
    },
    featureTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#274D60',
      marginBottom: '12px',
    },
    featureText: {
      color: '#4b5563',
      lineHeight: 1.6,
    },
    phonesContainer: {
      position: 'relative',
    },
    phonesWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '32px',
    },
    phoneMockup: {
      background: 'linear-gradient(145deg, #f0f0f0, #cacaca)',
      borderRadius: '30px',
      padding: '8px',
      width: '256px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3)',
      animation: 'float 6s ease-in-out infinite',
    },
    phoneMockup2: {
      animationDelay: '-3s',
    },
    phoneScreen: {
      backgroundColor: '#000',
      borderRadius: '22px',
      overflow: 'hidden',
      aspectRatio: '9/19.5',
    },
    loginScreen: {
      height: '100%',
      background: 'linear-gradient(to bottom, #eff6ff, #ffffff)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
    },
    loginHeader: {
      textAlign: 'center',
      marginTop: '32px',
      marginBottom: '32px',
    },
    logoContainer: {
      width: '64px',
      height: '64px',
      background: 'linear-gradient(to right, #274D60, #D7261E)',
      borderRadius: '50%',
      margin: '0 auto 16px auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    welcomeTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '4px',
    },
    welcomeSubtitle: {
      color: '#4b5563',
      fontSize: '14px',
    },
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      flex: 1,
    },
    inputField: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    inputPlaceholder: {
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      marginBottom: '8px',
    },
    inputPlaceholder2: {
      height: '8px',
      backgroundColor: '#f3f4f6',
      borderRadius: '4px',
      width: '75%',
    },
    inputPlaceholder3: {
      width: '50%',
    },
    loginButton: {
      background: 'linear-gradient(to right, #274D60, #D7261E)',
      borderRadius: '8px',
      padding: '12px',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
    },
    buttonPlaceholder: {
      height: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '4px',
      width: '33%',
    },
    homeScreen: {
      height: '100%',
      background: 'linear-gradient(to bottom, #ffffff, #eff6ff)',
      padding: '24px',
    },
    homeHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      marginTop: '16px',
    },
    headerText: {
      height: '12px',
      backgroundColor: '#1f2937',
      borderRadius: '4px',
      width: '80px',
      marginBottom: '4px',
    },
    headerSubtext: {
      height: '8px',
      backgroundColor: '#9ca3af',
      borderRadius: '4px',
      width: '64px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      backgroundColor: '#d1d5db',
      borderRadius: '50%',
    },
    homeGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '24px',
    },
    homeCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    homeIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      marginBottom: '8px',
    },
    homeIcon1: {
      backgroundColor: '#274D60',
    },
    homeIcon2: {
      backgroundColor: '#D7261E',
    },
    homeCardText: {
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      marginBottom: '4px',
    },
    homeCardSubtext: {
      height: '8px',
      backgroundColor: '#f3f4f6',
      borderRadius: '4px',
    },
    homeCardSubtext1: {
      width: '67%',
    },
    homeCardSubtext2: {
      width: '75%',
    },
    homeCardSubtext3: {
      width: '50%',
    },
    homeCardSubtext4: {
      width: '60%',
    },
    homeList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    homeListItem: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    listIcon: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
    },
    listIcon1: {
      backgroundColor: '#274D60',
    },
    listIcon2: {
      backgroundColor: '#D7261E',
    },
    listContent: {
      flex: 1,
    },
    listText: {
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      marginBottom: '4px',
    },
    listSubtext: {
      height: '8px',
      backgroundColor: '#f3f4f6',
      borderRadius: '4px',
    },
    listSubtext1: {
      width: '67%',
    },
    listSubtext2: {
      width: '75%',
    },
  };

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @media (max-width: 1024px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 768px) {
          .main-title {
            font-size: 32px !important;
          }
          .phones-wrapper {
            flex-direction: column !important;
            gap: 16px !important;
          }
        }
      `}</style>
      
      <section style={styles.container}>
        {/* Background Elements */}
        <div style={styles.gradientBg} />
        <div style={{...styles.floatingElement, ...styles.floatingElement1}} />
        <div style={{...styles.floatingElement, ...styles.floatingElement2}} />
        <div style={{...styles.floatingElement, ...styles.floatingElement3}} />
        
        <div style={styles.innerContainer}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.iconContainer}>
              <svg style={{width: '32px', height: '32px'}} fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <h2 className="main-title" style={styles.mainTitle}>
              <span style={styles.titleIntro}>Introducing</span><br />
              <span style={styles.titleMain}>Mpilo Mobile App</span>
            </h2>
            <p style={styles.subtitle}>
              Healthcare at your fingertips. Download now and experience the future of medical care.
            </p>
          </div>

          <div className="main-grid" style={styles.mainGrid}>
            {/* Features Section */}
            <div style={styles.featuresSection}>
              <div style={styles.featuresGrid}>
                <div style={styles.featureCard}>
                  <div style={styles.appIcon}>
                    📱
                  </div>
                  <h4 style={styles.featureTitle}>Healthcare wherever you are</h4>
                  <p style={styles.featureText}>
                    Whether you're in a rural village or a busy city, Mpilo delivers care right to your phone with our mobile clinics and doctor-on-demand service.
                  </p>
                </div>

                <div style={styles.featureCard}>
                  <div style={styles.appIcon}>
                    🏥
                  </div>
                  <h4 style={styles.featureTitle}>From clinic to click - Mpilo brings care closer</h4>
                  <p style={styles.featureText}>
                    Get trusted medical advice, treatment plans, and follow-ups from the comfort of your home.
                  </p>
                </div>

                <div style={styles.featureCard}>
                  <div style={styles.appIcon}>
                    👨‍⚕️
                  </div>
                  <h4 style={styles.featureTitle}>Real Doctors. Real-Time. Real Easy</h4>
                  <p style={styles.featureText}>
                    Mpilo makes seeing a doctor as simple as making a call.
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Mockups */}
            <div style={styles.phonesContainer}>
              <div className="phones-wrapper" style={styles.phonesWrapper}>
                {/* Phone 1 */}
                <div style={styles.phoneMockup}>
                  <div style={styles.phoneScreen}>
                    {/* Mock Login Screen */}
                    <div style={styles.loginScreen}>
                      <div style={styles.loginHeader}>
                        <div style={styles.logoContainer}>
                          <span style={styles.logoText}>M</span>
                        </div>
                        <h3 style={styles.welcomeTitle}>Welcome to Mpilo</h3>
                        <p style={styles.welcomeSubtitle}>Your health, our priority</p>
                      </div>
                      
                      <div style={styles.loginForm}>
                        <div style={styles.inputField}>
                          <div style={styles.inputPlaceholder} />
                          <div style={{...styles.inputPlaceholder2}} />
                        </div>
                        <div style={styles.inputField}>
                          <div style={styles.inputPlaceholder} />
                          <div style={{...styles.inputPlaceholder2, ...styles.inputPlaceholder3}} />
                        </div>
                        <div style={styles.loginButton}>
                          <div style={styles.buttonPlaceholder} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone 2 */}
                <div style={{...styles.phoneMockup, ...styles.phoneMockup2}}>
                  <div style={styles.phoneScreen}>
                    {/* Mock Home Screen */}
                    <div style={styles.homeScreen}>
                      <div style={styles.homeHeader}>
                        <div>
                          <div style={styles.headerText} />
                          <div style={styles.headerSubtext} />
                        </div>
                        <div style={styles.avatar} />
                      </div>
                      
                      <div style={styles.homeGrid}>
                        <div style={styles.homeCard}>
                          <div style={{...styles.homeIcon, ...styles.homeIcon1}} />
                          <div style={styles.homeCardText} />
                          <div style={{...styles.homeCardSubtext, ...styles.homeCardSubtext1}} />
                        </div>
                        <div style={styles.homeCard}>
                          <div style={{...styles.homeIcon, ...styles.homeIcon2}} />
                          <div style={styles.homeCardText} />
                          <div style={{...styles.homeCardSubtext, ...styles.homeCardSubtext2}} />
                        </div>
                        <div style={styles.homeCard}>
                          <div style={{...styles.homeIcon, ...styles.homeIcon1}} />
                          <div style={styles.homeCardText} />
                          <div style={{...styles.homeCardSubtext, ...styles.homeCardSubtext3}} />
                        </div>
                        <div style={styles.homeCard}>
                          <div style={{...styles.homeIcon, ...styles.homeIcon2}} />
                          <div style={styles.homeCardText} />
                          <div style={{...styles.homeCardSubtext, ...styles.homeCardSubtext4}} />
                        </div>
                      </div>
                      
                      <div style={styles.homeList}>
                        <div style={styles.homeListItem}>
                          <div style={{...styles.listIcon, ...styles.listIcon1}} />
                          <div style={styles.listContent}>
                            <div style={styles.listText} />
                            <div style={{...styles.listSubtext, ...styles.listSubtext1}} />
                          </div>
                        </div>
                        <div style={styles.homeListItem}>
                          <div style={{...styles.listIcon, ...styles.listIcon2}} />
                          <div style={styles.listContent}>
                            <div style={styles.listText} />
                            <div style={{...styles.listSubtext, ...styles.listSubtext2}} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppInfo;
