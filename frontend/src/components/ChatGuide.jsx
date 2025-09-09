import { Brain, Heart, Shield, Zap, Lock, TrendingUp, Sprout, ArrowRight, Target, MessageCircle, Compass, User, Settings, Eye, Lightbulb, CheckCircle } from "lucide-react"
import '../index.css'
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const ChatGuidePage = () => {
  const navigate = useNavigate();
  
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: 'rgba(254,248,233,255)'
    },
    heroSection: {
      padding: '4rem 0',
      '@media (min-width: 1024px)': {
        padding: '6rem 0'
      }
    },
    heroContainer: {
      margin: '0 auto',
      maxWidth: '72rem',
      padding: '0 1rem',
      textAlign: 'center',
      '@media (min-width: 640px)': {
        padding: '0 1.5rem'
      },
      '@media (min-width: 1024px)': {
        padding: '0 2rem'
      }
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
    icon: {
      height: '2rem',
      width: '2rem',
      color: 'rgb(248, 180, 4)'
    },
    subtitle: {
      marginBottom: '1.5rem',
      fontSize: '1.125rem',
      fontWeight: '500',
      letterSpacing: '0.025em',
      color: 'rgb(248, 180, 4)'
    },
    title: {
      marginBottom: '2rem',
      fontSize: '3rem',
      fontWeight: '700',
      color: '#111827',
      lineHeight: '1.1'
    },
    titleLg: {
      fontSize: '4.5rem'
    },
    heroDescription: {
      margin: '0 auto 3rem auto',
      maxWidth: '56rem',
      fontSize: '1.25rem',
      color: '#4B5563',
      lineHeight: '1.6'
    },
    tagContainer: {
      marginBottom: '2rem',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '0.75rem'
    },
    tag: {
      borderRadius: '9999px',
      border: '1px solid rgba(248, 180, 4, 0.3)',
      backgroundColor: 'white',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      color: '#374151'
    },
    whiteSection: {
      backgroundColor: 'white',
      padding: '5rem 0'
    },
    creamSection: {
      padding: '5rem 0',
      backgroundColor: 'rgba(254,248,233,255)'
    },
    sectionContainer: {
      margin: '0 auto',
      maxWidth: '60rem',
      padding: '0 1rem'
    },
    sectionContainerWide: {
      margin: '0 auto',
      maxWidth: '80rem',
      padding: '0 1rem'
    },
    welcomeCard: {
      borderRadius: '1rem',
      border: '1px solid rgba(248, 180, 4, 0.2)',
      padding: '2.5rem',
      backgroundColor: 'rgba(254,248,233,255)',
      textAlign: 'center'
    },
    welcomeTitle: {
      marginBottom: '2rem',
      fontSize: '2.25rem',
      fontWeight: '700',
      color: '#111827'
    },
    welcomeText: {
      fontSize: '1.25rem',
      lineHeight: '1.75',
      color: '#374151'
    },
    highlight: {
      fontWeight: '600',
      color: 'rgb(248, 180, 4)'
    },
    gridTwoColumns: {
      display: 'grid',
      gap: '4rem',
      alignItems: 'center',
      gridTemplateColumns: '1fr'
    },
    gridTwoEqual: {
      display: 'grid',
      gap: '2rem',
      gridTemplateColumns: '1fr'
    },
    gridThreeColumns: {
      display: 'grid',
      gap: '2rem',
      gridTemplateColumns: '1fr'
    },
    sectionTitle: {
      marginBottom: '2rem',
      fontSize: '2.25rem',
      fontWeight: '700',
      color: '#111827'
    },
    bodyText: {
      fontSize: '1.25rem',
      lineHeight: '1.75',
      color: '#374151',
      marginBottom: '1.5rem'
    },
    tipBox: {
      borderRadius: '0.5rem',
      border: '1px solid rgba(248, 180, 4, 0.2)',
      padding: '1.5rem',
      backgroundColor: 'rgba(248, 180, 4, 0.05)'
    },
    tipText: {
      fontSize: '1.125rem',
      fontWeight: '500',
      color: '#1F2937'
    },
    card: {
      borderRadius: '1rem',
      border: '1px solid rgba(248, 180, 4, 0.2)',
      backgroundColor: 'white',
      padding: '2rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    cardCream: {
      backgroundColor: 'rgba(254,248,233,255)'
    },
    cardTitle: {
      marginBottom: '1.5rem',
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#111827'
    },
    checklistItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      marginBottom: '1rem'
    },
    smallIconContainer: {
      display: 'flex',
      height: '2rem',
      width: '2rem',
      flexShrink: '0',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      backgroundColor: 'rgba(248, 180, 4, 0.1)'
    },
    smallIcon: {
      height: '1rem',
      width: '1rem',
      color: 'rgb(248, 180, 4)'
    },
    largeIconContainer: {
      marginBottom: '2rem',
      display: 'flex',
      height: '4rem',
      width: '4rem',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      backgroundColor: 'rgba(248, 180, 4, 0.1)'
    },
    largeIcon: {
      height: '2rem',
      width: '2rem',
      color: 'rgb(248, 180, 4)'
    },
    mediumIconContainer: {
      marginBottom: '1.5rem',
      display: 'flex',
      height: '3rem',
      width: '3rem',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      backgroundColor: 'rgba(248, 180, 4, 0.1)'
    },
    mediumIcon: {
      height: '1.5rem',
      width: '1.5rem',
      color: 'rgb(248, 180, 4)'
    },
    bulletList: {
      listStyle: 'none',
      padding: '0',
      margin: '0'
    },
    bulletItem: {
      color: '#374151',
      marginBottom: '0.75rem'
    },
    tipCard: {
      borderRadius: '1rem',
      border: '1px solid rgba(248, 180, 4, 0.2)',
      backgroundColor: 'white',
      padding: '2rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    tipCardTitle: {
      marginBottom: '1rem',
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#111827'
    },
    tipCardText: {
      color: '#4B5563'
    },
    centerCard: {
      borderRadius: '1rem',
      border: '2px solid rgba(248, 180, 4, 0.2)',
      padding: '3rem',
      backgroundColor: 'rgba(254,248,233,255)',
      textAlign: 'center'
    },
    divider: {
      margin: '2rem auto',
      height: '2px',
      width: '6rem',
      backgroundColor: 'rgb(248, 180, 4)'
    },
    centerText: {
      fontSize: '1.125rem',
      fontWeight: '500',
      color: '#4B5563'
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      borderRadius: '9999px',
      padding: '1rem 2rem',
      fontSize: '1.125rem',
      fontWeight: '500',
      color: 'white',
      backgroundColor: 'rgb(248, 180, 4)',
      border: 'none',
      cursor: 'pointer',
      transition: 'opacity 0.2s'
    },
    buttonIcon: {
      height: '1.25rem',
      width: '1.25rem'
    }
  };

  // Add responsive styles
  const mediaQueryStyles = `
    @media (min-width: 768px) {
      .grid-md-2 { grid-template-columns: repeat(2, 1fr); }
      .grid-md-3 { grid-template-columns: repeat(3, 1fr); }
    }
    @media (min-width: 1024px) {
      .grid-lg-2 { grid-template-columns: repeat(2, 1fr); }
      .title-lg { font-size: 4.5rem !important; }
      .subtitle-lg { font-size: 1.25rem !important; }
      .hero-desc-lg { font-size: 1.5rem !important; }
      .section-title-lg { font-size: 3rem !important; }
      .welcome-title-lg { font-size: 3rem !important; }
      .welcome-text-lg { font-size: 1.5rem !important; }
      .center-card-lg { padding: 4rem !important; }
      .hero-lg { padding: 6rem 0 !important; }
    }
  `;

  return (
    <>
      <style>{mediaQueryStyles}</style>
      <Helmet>
        <title>Chat Guide | How to Talk with Lumaya for Supportive Conversations</title>
        <meta 
          name="description" 
          content="New to Lumaya? This guide shows you how to start conversations, get emotional support, and use features like memory and privacy controls for a better experience." 
        />
        <meta property="og:title" content="Chat Guide | How to Talk with Lumaya for Supportive Conversations" />
        <meta property="og:description" content="New to Lumaya? This guide shows you how to start conversations, get emotional support, and use features like memory and privacy controls for a better experience." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thelumaya.com/chat-guide" />
        <meta property="og:image" content="https://thelumaya.com/images/chat-guide-cover.png" />
        <link rel="canonical" href="https://thelumaya.com/chat-guide" />
      </Helmet>

      <div style={styles.container}>
        
        {/* Hero Section */}
        <section className="hero-lg" style={{...styles.creamSection}}>
          <div style={{...styles.heroContainer, padding: '0 1rem'}}>
            <div style={styles.iconContainer}>
              <Compass style={styles.icon} />
            </div>
            <p className="subtitle-lg" style={styles.subtitle}>YOUR WELLNESS JOURNEY STARTS HERE</p>
            <h1 className="title-lg" style={styles.title}>Chat Guide</h1>
            <p className="hero-desc-lg" style={styles.heroDescription}>
              Getting the Most Out of Your Wellness Companion
            </p>
            <div style={styles.tagContainer}>
              <span style={styles.tag}>Safe Space</span>
              <span style={styles.tag}>Your Pace</span>
              <span style={styles.tag}>Personalized</span>
              <span style={styles.tag}>Always Private</span>
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        <section style={styles.whiteSection}>
          <div style={styles.sectionContainer}>
            <div style={styles.welcomeCard}>
              <div style={styles.iconContainer}>
                <Heart style={styles.icon} />
              </div>
              <h2 className="welcome-title-lg" style={styles.welcomeTitle}>Welcome!</h2>
              <p className="welcome-text-lg" style={styles.welcomeText}>
                This space is designed to support your <span style={styles.highlight}>mental clarity</span>, 
                <span style={styles.highlight}> emotional wellness</span>, and 
                <span style={styles.highlight}> daily reflections</span> — all in a safe and private environment.
              </p>
            </div>
          </div>
        </section>

        {/* Step 1: Start with You */}
        <section style={styles.creamSection}>
          <div style={styles.sectionContainerWide}>
            <div className="grid-lg-2" style={styles.gridTwoColumns}>
              <div>
                <div style={styles.iconContainer}>
                  <User style={styles.icon} />
                </div>
                <h2 className="section-title-lg" style={styles.sectionTitle}>1. Start with You</h2>
                <div style={{marginBottom: '1.5rem'}}>
                  <p style={styles.bodyText}>
                    In the beginning, your digital companion is learning about you — your tone, your preferences, and the kinds of thoughts or emotions you're sharing.
                  </p>
                  <div style={styles.tipBox}>
                    <p style={styles.tipText}>
                      💡 The more relevant and honest information you share, the more helpful and personalized the responses will be.
                    </p>
                  </div>
                </div>
              </div>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Feel free to talk about:</h3>
                <div>
                  <div style={styles.checklistItem}>
                    <div style={styles.smallIconContainer}>
                      <CheckCircle style={styles.smallIcon} />
                    </div>
                    <p style={{color: '#374151'}}>What's on your mind today</p>
                  </div>
                  <div style={styles.checklistItem}>
                    <div style={styles.smallIconContainer}>
                      <CheckCircle style={styles.smallIcon} />
                    </div>
                    <p style={{color: '#374151'}}>Your past experiences, emotions, or patterns</p>
                  </div>
                  <div style={styles.checklistItem}>
                    <div style={styles.smallIconContainer}>
                      <CheckCircle style={styles.smallIcon} />
                    </div>
                    <p style={{color: '#374151'}}>Specific situations, stressors, or goals</p>
                  </div>
                  <div style={styles.checklistItem}>
                    <div style={styles.smallIconContainer}>
                      <CheckCircle style={styles.smallIcon} />
                    </div>
                    <p style={{color: '#374151'}}>What kind of support you expect (comfort, perspective, motivation, etc.)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps 2 & 3 */}
        <section style={styles.whiteSection}>
          <div style={{...styles.sectionContainer, maxWidth: '72rem'}}>
            <div className="grid-md-2" style={styles.gridTwoEqual}>
              <div style={{...styles.card, ...styles.cardCream}}>
                <div style={styles.largeIconContainer}>
                  <Settings style={styles.largeIcon} />
                </div>
                <h3 style={styles.cardTitle}>2. You're in Control</h3>
                <p style={styles.bodyText}>
                  There's no script. You can:
                </p>
                <ul style={styles.bulletList}>
                  <li style={styles.bulletItem}>• Share a thought, rant, or question</li>
                  <li style={styles.bulletItem}>• Ask for tools (breathing exercises, journaling prompts, mindset shifts)</li>
                  <li style={styles.bulletItem}>• Check in daily or occasionally — your pace is up to you</li>
                </ul>
              </div>
              <div style={{...styles.card, ...styles.cardCream}}>
                <div style={styles.largeIconContainer}>
                  <Shield style={styles.largeIcon} />
                </div>
                <h3 style={styles.cardTitle}>3. No Judgment. Ever.</h3>
                <p style={styles.bodyText}>
                  This space is private, secure, and non-judgmental. Whatever you share stays encrypted and cannot be viewed by anyone — not even us. It's here only to help the system remember context and make future interactions smoother.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Helpful Tips Section */}
        <section style={styles.creamSection}>
          <div style={styles.sectionContainerWide}>
            <div style={{marginBottom: '4rem', textAlign: 'center'}}>
              <div style={styles.iconContainer}>
                <Lightbulb style={styles.icon} />
              </div>
              <h2 className="section-title-lg" style={{...styles.sectionTitle, marginBottom: '1.5rem'}}>4. Helpful Tips</h2>
            </div>
            <div className="grid-md-3" style={styles.gridThreeColumns}>
              <div style={styles.tipCard}>
                <div style={styles.mediumIconContainer}>
                  <Target style={styles.mediumIcon} />
                </div>
                <h3 style={styles.tipCardTitle}>Be Specific</h3>
                <p style={styles.tipCardText}>
                  Try "I feel drained when I wake up" vs. "I'm tired" — specificity helps create better, more targeted responses.
                </p>
              </div>
              <div style={styles.tipCard}>
                <div style={styles.mediumIconContainer}>
                  <TrendingUp style={styles.mediumIcon} />
                </div>
                <h3 style={styles.tipCardTitle}>Reflect on Patterns</h3>
                <p style={styles.tipCardText}>
                  Share what helps or hurts in your daily routine — patterns create insights for better support.
                </p>
              </div>
              <div style={styles.tipCard}>
                <div style={styles.mediumIconContainer}>
                  <MessageCircle style={styles.mediumIcon} />
                </div>
                <h3 style={styles.tipCardTitle}>Use It Your Way</h3>
                <p style={styles.tipCardText}>
                  Think of it like a journal, sounding board, or wellness check-in — whatever feels right for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Always Optional Section */}
        <section style={styles.whiteSection}>
          <div style={{...styles.sectionContainer, textAlign: 'center'}}>
            <div style={styles.iconContainer}>
              <Eye style={styles.icon} />
            </div>
            <h2 className="section-title-lg" style={{...styles.sectionTitle, marginBottom: '3rem'}}>5. Always Optional</h2>
            <div className="center-card-lg" style={styles.centerCard}>
              <p style={{...styles.bodyText, marginBottom: '2rem', fontSize: '1.25rem'}}>
                Share as much or as little as you're comfortable with. You can stop, pause, or delete your data any time.
              </p>
              <div style={styles.divider}></div>
              <p style={styles.centerText}>
                Your comfort and privacy always come first.
              </p>
            </div>
          </div>
        </section>

        {/* Ready to Begin Section */}
        <section style={styles.creamSection}>
          <div style={{...styles.sectionContainer, textAlign: 'center'}}>
            <div style={styles.iconContainer}>
              <Sprout style={styles.icon} />
            </div>
            <h2 className="section-title-lg" style={{...styles.sectionTitle, marginBottom: '2rem'}}>🧘 Ready to Begin?</h2>
            <p style={{...styles.heroDescription, marginBottom: '3rem'}}>
              Just say hi, or tell it something you've been thinking about lately.
            </p>
            <button 
              onClick={() => navigate('/chat')} 
              style={styles.button}
              onMouseOver={(e) => e.target.style.opacity = '0.9'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Start Your Journey
              <ArrowRight style={styles.buttonIcon} />
            </button>
          </div>
        </section>
      </div>
    </>
  )
}

export default ChatGuidePage