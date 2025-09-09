import { Shield, Lock, Heart, Eye, Trash2, Users, Mail, FileText, ArrowRight } from "lucide-react"

const PrivacyPolicyPage = () => {
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: 'rgba(254,248,233,255)'
    },
    heroSection: {
      padding: '4rem 0 6rem 0',
      backgroundColor: 'rgba(254,248,233,255)'
    },
    heroContainer: {
      margin: '0 auto',
      maxWidth: '72rem',
      padding: '0 1rem',
      textAlign: 'center'
    },
    heroTagline: {
      marginBottom: '1.5rem',
      fontSize: '1.125rem',
      fontWeight: '500',
      letterSpacing: '0.025em',
      color: 'rgb(248, 180, 4)'
    },
    heroTitle: {
      marginBottom: '3rem',
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#111827',
      lineHeight: '1.1'
    },
    badgeContainer: {
      marginBottom: '2rem',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '0.75rem'
    },
    badge: {
      borderRadius: '9999px',
      border: '1px solid rgba(248, 180, 4, 0.3)',
      backgroundColor: 'white',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      color: '#374151'
    },
    effectiveDate: {
      fontSize: '1.125rem',
      color: '#6B7280'
    },
    whiteSection: {
      backgroundColor: 'white',
      padding: '5rem 0'
    },
    creamSection: {
      backgroundColor: 'rgba(254,248,233,255)',
      padding: '5rem 0'
    },
    maxWidth5xl: {
      margin: '0 auto',
      maxWidth: '64rem',
      padding: '0 1rem'
    },
    maxWidth6xl: {
      margin: '0 auto',
      maxWidth: '72rem',
      padding: '0 1rem'
    },
    maxWidth7xl: {
      margin: '0 auto',
      maxWidth: '80rem',
      padding: '0 1rem'
    },
    sectionHeader: {
      marginBottom: '4rem',
      textAlign: 'center'
    },
    iconContainer: {
      marginBottom: '1.5rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      padding: '1rem',
      backgroundColor: 'rgba(248, 180, 4, 0.1)'
    },
    sectionTitle: {
      marginBottom: '2rem',
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#111827',
      lineHeight: '1.2'
    },
    sectionSubtitle: {
      fontSize: '1.25rem',
      color: '#6B7280'
    },
    promiseBox: {
      borderRadius: '1rem',
      border: '1px solid rgba(248, 180, 4, 0.2)',
      padding: '2.5rem 3rem',
      backgroundColor: 'rgba(254,248,233,255)'
    },
    promiseText: {
      textAlign: 'center',
      fontSize: '1.25rem',
      lineHeight: '1.75',
      color: '#374151'
    },
    highlight: {
      fontWeight: '600',
      color: 'rgb(248, 180, 4)'
    },
    grid3: {
      display: 'grid',
      gap: '2rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
    },
    grid2: {
      display: 'grid',
      gap: '2rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
    },
    card: {
      borderRadius: '1rem',
      border: '1px solid rgba(248, 180, 4, 0.2)',
      backgroundColor: 'white',
      padding: '2rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    cardIconContainer: {
      marginBottom: '1.5rem',
      display: 'flex',
      height: '3rem',
      width: '3rem',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      backgroundColor: 'rgba(248, 180, 4, 0.1)'
    },
    cardTitle: {
      marginBottom: '1rem',
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    cardText: {
      color: '#6B7280',
      lineHeight: '1.6'
    },
    usageList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    },
    usageItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1.5rem'
    },
    usageIconContainer: {
      display: 'flex',
      height: '3rem',
      width: '3rem',
      flexShrink: '0',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      backgroundColor: 'rgba(248, 180, 4, 0.1)'
    },
    usageTitle: {
      marginBottom: '0.5rem',
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    usageText: {
      fontSize: '1.125rem',
      color: '#6B7280'
    },
    importantBox: {
      marginTop: '2.5rem',
      borderRadius: '0.75rem',
      border: '2px solid rgba(248, 180, 4, 0.3)',
      padding: '1.5rem',
      backgroundColor: 'white'
    },
    importantText: {
      fontSize: '1.125rem',
      fontWeight: '500',
      color: '#1F2937'
    },
    securityCard: {
      borderRadius: '1rem',
      border: '1px solid rgba(248, 180, 4, 0.2)',
      backgroundColor: 'white',
      padding: '2.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    securityIconContainer: {
      marginBottom: '1.5rem',
      display: 'flex',
      height: '4rem',
      width: '4rem',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      backgroundColor: 'rgba(248, 180, 4, 0.1)'
    },
    securityTitle: {
      marginBottom: '1rem',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    securityText: {
      fontSize: '1.125rem',
      lineHeight: '1.75',
      color: '#6B7280'
    },
    fullWidthCard: {
      marginTop: '2rem',
      borderRadius: '1rem',
      border: '1px solid rgba(248, 180, 4, 0.2)',
      backgroundColor: 'white',
      padding: '2.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    restrictedAccessContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1.5rem'
    },
    restrictedIconContainer: {
      display: 'flex',
      height: '4rem',
      width: '4rem',
      flexShrink: '0',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      backgroundColor: 'rgba(248, 180, 4, 0.1)'
    },
    retentionCard: {
      borderRadius: '1rem',
      border: '1px solid rgba(248, 180, 4, 0.2)',
      padding: '2.5rem',
      backgroundColor: 'rgba(254,248,233,255)'
    },
    retentionIconContainer: {
      marginBottom: '1.5rem',
      display: 'flex',
      height: '4rem',
      width: '4rem',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      backgroundColor: 'rgba(248, 180, 4, 0.1)'
    },
    retentionTitle: {
      marginBottom: '1.5rem',
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    retentionText: {
      fontSize: '1.125rem',
      lineHeight: '1.75',
      color: '#374151',
      marginBottom: '1.5rem'
    },
    retentionTextLast: {
      fontSize: '1.125rem',
      lineHeight: '1.75',
      color: '#374151'
    },
    policyChangesContainer: {
      display: 'grid',
      gap: '4rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
    },
    contactCard: {
      borderRadius: '1rem',
      border: '1px solid rgba(248, 180, 4, 0.2)',
      backgroundColor: 'white',
      padding: '2.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    contactIconContainer: {
      marginBottom: '1.5rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      padding: '1rem',
      backgroundColor: 'rgba(248, 180, 4, 0.1)'
    },
    contactTitle: {
      marginBottom: '1.5rem',
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    contactText: {
      fontSize: '1.125rem',
      lineHeight: '1.75',
      color: '#374151',
      marginBottom: '1.5rem'
    },
    emailBox: {
      borderRadius: '0.75rem',
      padding: '1rem',
      backgroundColor: 'rgba(248, 180, 4, 0.1)'
    },
    emailText: {
      fontSize: '1.125rem',
      fontWeight: '500',
      color: '#1F2937'
    },
    emailAddress: {
      color: 'rgb(248, 180, 4)'
    },
    closingBox: {
      borderRadius: '1rem',
      border: '2px solid rgba(248, 180, 4, 0.2)',
      padding: '3rem 4rem',
      backgroundColor: 'rgba(254,248,233,255)'
    },
    closingIconContainer: {
      marginBottom: '2rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      padding: '1rem',
      backgroundColor: 'rgba(248, 180, 4, 0.1)'
    },
    closingText: {
      marginBottom: '2.5rem',
      fontSize: '1.25rem',
      lineHeight: '1.75',
      color: '#374151'
    },
    divider: {
      margin: '0 auto 2rem auto',
      height: '2px',
      width: '6rem',
      backgroundColor: 'rgb(248, 180, 4)'
    },
    quote: {
      fontSize: '1.25rem',
      fontWeight: '500',
      fontStyle: 'italic',
      color: 'rgb(248, 180, 4)'
    }
  }

  return (
    <div style={styles.container}>
      
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <p style={styles.heroTagline}>YOUR PRIVACY MATTERS</p>
          <h1 style={styles.heroTitle}>Privacy Policy</h1>
          <div style={styles.badgeContainer}>
            <span style={styles.badge}>
              End-to-End Encrypted
            </span>
            <span style={styles.badge}>
              No Human Access
            </span>
            <span style={styles.badge}>
              Your Data, Your Control
            </span>
          </div>
          <p style={styles.effectiveDate}>Effective Date: June 15, 2025</p>
        </div>
      </section>

      {/* Introduction */}
      <section style={styles.whiteSection}>
        <div style={styles.maxWidth5xl}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer}>
              <Heart style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
            </div>
            <h2 style={styles.sectionTitle}>Our Promise to You</h2>
          </div>
          <div style={styles.promiseBox}>
            <p style={styles.promiseText}>
              Thank you for trusting us with your thoughts and choosing our digital wellness companion. We value your privacy and are deeply committed to protecting your personal information. This Privacy Policy explains how your data is collected, used, and safeguarded when you interact with our platform — because your <span style={styles.highlight}>privacy is sacred</span>, and we protect it at all costs.
            </p>
          </div>
        </div>
      </section>

      {/* Information We Collect */}
      <section style={styles.creamSection}>
        <div style={styles.maxWidth7xl}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer}>
              <FileText style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
            </div>
            <h2 style={styles.sectionTitle}>Information We Collect</h2>
            <p style={styles.sectionSubtitle}>We collect only what's necessary to provide you with the best possible experience</p>
          </div>
          <div style={styles.grid3}>
            <div style={styles.card}>
              <div style={styles.cardIconContainer}>
                <Mail style={{height: '1.5rem', width: '1.5rem', color: 'rgb(248, 180, 4)'}} />
              </div>
              <h3 style={styles.cardTitle}>Basic Account Details</h3>
              <p style={styles.cardText}>
                Such as your email address, used for login and communication purposes only.
              </p>
            </div>
            <div style={styles.card}>
              <div style={styles.cardIconContainer}>
                <Users style={{height: '1.5rem', width: '1.5rem', color: 'rgb(248, 180, 4)'}} />
              </div>
              <h3 style={styles.cardTitle}>Usage Information</h3>
              <p style={styles.cardText}>
                This includes interaction patterns, feature usage, and conversation inputs to improve response accuracy and personalization.
              </p>
            </div>
            <div style={styles.card}>
              <div style={styles.cardIconContainer}>
                <Shield style={{height: '1.5rem', width: '1.5rem', color: 'rgb(248, 180, 4)'}} />
              </div>
              <h3 style={styles.cardTitle}>Device Data</h3>
              <p style={styles.cardText}>
                Information like device type, browser, and session duration, used to enhance performance and user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Use Information */}
      <section style={styles.whiteSection}>
        <div style={styles.maxWidth6xl}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer}>
              <ArrowRight style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
            </div>
            <h2 style={styles.sectionTitle}>How Your Information Is Used</h2>
          </div>
          <div style={styles.promiseBox}>
            <div style={styles.usageList}>
              <div style={styles.usageItem}>
                <div style={styles.usageIconContainer}>
                  <Heart style={{height: '1.5rem', width: '1.5rem', color: 'rgb(248, 180, 4)'}} />
                </div>
                <div>
                  <h3 style={styles.usageTitle}>Personalize Your Experience</h3>
                  <p style={styles.usageText}>Enhance your mental wellness journey with tailored responses and support</p>
                </div>
              </div>
              <div style={styles.usageItem}>
                <div style={styles.usageIconContainer}>
                  <Shield style={{height: '1.5rem', width: '1.5rem', color: 'rgb(248, 180, 4)'}} />
                </div>
                <div>
                  <h3 style={styles.usageTitle}>Improve System Performance</h3>
                  <p style={styles.usageText}>Enhance learning capabilities and response accuracy over time</p>
                </div>
              </div>
              <div style={styles.usageItem}>
                <div style={styles.usageIconContainer}>
                  <FileText style={{height: '1.5rem', width: '1.5rem', color: 'rgb(248, 180, 4)'}} />
                </div>
                <div>
                  <h3 style={styles.usageTitle}>Ensure Service Reliability</h3>
                  <p style={styles.usageText}>Maintain platform stability and provide technical support when needed</p>
                </div>
              </div>
            </div>
            <div style={styles.importantBox}>
              <p style={styles.importantText}>
                <strong>Important:</strong> All interaction data is end-to-end encrypted and stored securely. This information is never visible to any individual, including our internal team. It is used only to maintain context during your sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Security */}
      <section style={styles.creamSection}>
        <div style={styles.maxWidth6xl}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer}>
              <Lock style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
            </div>
            <h2 style={styles.sectionTitle}>Data Security & Confidentiality</h2>
            <p style={styles.sectionSubtitle}>Your privacy is sacred — here's how we protect it</p>
          </div>
          <div style={styles.grid2}>
            <div style={styles.securityCard}>
              <div style={styles.securityIconContainer}>
                <Shield style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
              </div>
              <h3 style={styles.securityTitle}>Military-Grade Encryption</h3>
              <p style={styles.securityText}>
                All user data is encrypted both in transit and at rest using industry-standard security protocols.
              </p>
            </div>
            <div style={styles.securityCard}>
              <div style={styles.securityIconContainer}>
                <Eye style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
              </div>
              <h3 style={styles.securityTitle}>Zero Human Access</h3>
              <p style={styles.securityText}>
                No human can view or access user messages or session data directly. Your conversations remain completely private.
              </p>
            </div>
          </div>
          <div style={styles.fullWidthCard}>
            <div style={styles.restrictedAccessContainer}>
              <div style={styles.restrictedIconContainer}>
                <Lock style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
              </div>
              <div>
                <h3 style={styles.securityTitle}>Restricted Access</h3>
                <p style={styles.securityText}>
                  Access is strictly restricted and monitored only for essential system maintenance or legal compliance (if ever required by law).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Retention & Children's Privacy */}
      <section style={styles.whiteSection}>
        <div style={styles.maxWidth7xl}>
          <div style={styles.grid2}>
            <div style={styles.retentionCard}>
              <div style={styles.retentionIconContainer}>
                <Trash2 style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
              </div>
              <h3 style={styles.retentionTitle}>Data Retention</h3>
              <p style={styles.retentionText}>
                Your conversation data is stored temporarily to preserve context across sessions, making your experience more personalized and meaningful.
              </p>
              <p style={styles.retentionTextLast}>
                If you choose to delete your data or account, all associated information will be permanently removed from our systems within 30 days.
              </p>
            </div>
            <div style={styles.retentionCard}>
              <div style={styles.retentionIconContainer}>
                <Users style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
              </div>
              <h3 style={styles.retentionTitle}>Children's Privacy</h3>
              <p style={styles.retentionText}>
                Our platform is designed for individuals aged 13 and above. We do not knowingly collect personal information from children under 13.
              </p>
              <p style={styles.retentionTextLast}>
                If we become aware that we have collected information from a child under 13, we will take immediate steps to delete such information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Changes & Contact */}
      <section style={styles.creamSection}>
        <div style={styles.maxWidth6xl}>
          <div style={styles.policyChangesContainer}>
            <div>
              <div style={styles.iconContainer}>
                <FileText style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
              </div>
              <h2 style={styles.sectionTitle}>Changes to This Policy</h2>
              <p style={styles.retentionText}>
                We may update this policy as our services evolve and improve. When we make significant changes, we'll notify you through the platform or via email.
              </p>
              <p style={styles.retentionTextLast}>
                We encourage you to review this policy periodically to stay informed about how we're protecting your information.
              </p>
            </div>
            <div style={styles.contactCard}>
              <div style={styles.contactIconContainer}>
                <Mail style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
              </div>
              <h3 style={styles.contactTitle}>Contact Us</h3>
              <p style={styles.contactText}>
                If you have any questions about this Privacy Policy or how we handle your data, we're here to help.
              </p>
              <div style={styles.emailBox}>
                <p style={styles.emailText}>
                  📧 <span style={styles.emailAddress}>thelumaya@gmail.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Message */}
      <section style={styles.whiteSection}>
        <div style={styles.maxWidth5xl}>
          <div style={styles.closingBox}>
            <div style={styles.closingIconContainer}>
              <Heart style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
            </div>
            <p style={styles.closingText}>
              Your trust means everything to us. We're committed to maintaining the highest standards of privacy and security because everyone deserves a safe space to unpack their mind.
            </p>
            <div style={styles.divider}></div>
            <blockquote style={styles.quote}>
              "Your privacy is sacred, and we protect it at all costs."
            </blockquote>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicyPage