import { Brain, Heart, Shield, Zap, Lock, TrendingUp, Sprout, ArrowRight, Target, MessageCircle } from "lucide-react"
import '../index.css'
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'rgba(254,248,233,255)'
  },
  heroSection: {
    paddingTop: '4rem',
    paddingBottom: '4rem',
    backgroundColor: 'rgba(254,248,233,255)'
  },
  heroContainer: {
    maxWidth: '72rem',
    margin: '0 auto',
    padding: '0 1rem',
    textAlign: 'center'
  },
  heroSubtitle: {
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
    color: '#111827'
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
    paddingTop: '5rem',
    paddingBottom: '5rem'
  },
  sectionContainer: {
    maxWidth: '80rem',
    margin: '0 auto',
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
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: '#111827'
  },
  missionCard: {
    borderRadius: '1rem',
    border: '1px solid rgba(248, 180, 4, 0.2)',
    padding: '2.5rem',
    backgroundColor: 'rgba(254,248,233,255)'
  },
  missionText: {
    textAlign: 'center',
    fontSize: '1.25rem',
    lineHeight: '1.75',
    color: '#374151'
  },
  highlight: {
    fontWeight: '600',
    color: 'rgb(248, 180, 4)'
  },
  creamSection: {
    paddingTop: '5rem',
    paddingBottom: '5rem',
    backgroundColor: 'rgba(254,248,233,255)'
  },
  gridTwoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '4rem',
    alignItems: 'center'
  },
  textContent: {
    marginBottom: '0'
  },
  paragraph: {
    fontSize: '1.25rem',
    lineHeight: '1.75',
    color: '#374151',
    marginBottom: '1.5rem'
  },
  featureCard: {
    borderRadius: '1rem',
    border: '1px solid rgba(248, 180, 4, 0.2)',
    backgroundColor: 'white',
    padding: '2rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  featureIconContainer: {
    display: 'flex',
    height: '3rem',
    width: '3rem',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    backgroundColor: 'rgba(248, 180, 4, 0.1)'
  },
  featureTitle: {
    marginBottom: '0.5rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#111827'
  },
  featureDescription: {
    color: '#6B7280'
  },
  gridThreeCol: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem'
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
  cardTitle: {
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827'
  },
  cardText: {
    fontSize: '1.125rem',
    lineHeight: '1.75',
    color: '#6B7280'
  },
  beliefCard: {
    borderRadius: '1rem',
    border: '2px solid rgba(248, 180, 4, 0.2)',
    padding: '3rem',
    backgroundColor: 'rgba(254,248,233,255)'
  },
  beliefText: {
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
  },
  ctaText: {
    margin: '0 auto 3rem auto',
    maxWidth: '48rem',
    fontSize: '1.25rem',
    color: '#6B7280'
  },
  ctaButton: {
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
  // Responsive styles
  '@media (min-width: 768px)': {
    gridTwoCol: {
      gridTemplateColumns: '1fr 1fr'
    },
    gridThreeCol: {
      gridTemplateColumns: 'repeat(3, 1fr)'
    }
  },
  '@media (min-width: 1024px)': {
    heroSection: {
      paddingTop: '6rem',
      paddingBottom: '6rem'
    },
    heroContainer: {
      padding: '0 2rem'
    },
    heroSubtitle: {
      fontSize: '1.25rem'
    },
    heroTitle: {
      fontSize: '4.5rem'
    },
    sectionContainer: {
      padding: '0 2rem'
    },
    sectionTitle: {
      fontSize: '3rem'
    },
    missionCard: {
      padding: '3rem'
    },
    missionText: {
      fontSize: '1.5rem'
    },
    beliefCard: {
      padding: '4rem'
    },
    beliefText: {
      fontSize: '1.5rem'
    },
    quote: {
      fontSize: '1.5rem'
    },
    ctaText: {
      fontSize: '1.5rem'
    }
  }
};

const AboutUsPage = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>About Lumaya | AI Emotional Support That Feels Human</title>
        <meta name="description" content="Learn how Lumaya was created to offer real emotional support through AI. Our mission is to build trust, empathy, and a safe space for honest conversations." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="About Lumaya | AI Emotional Support That Feels Human" />
        <meta property="og:description" content="Discover Lumaya's mission to make emotional wellness more accessible. Our AI companion listens with empathy, offering secure, private support." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thelumaya.com/about" />
        <meta property="og:image" content="https://thelumaya.com/assets/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Lumaya | AI Emotional Support That Feels Human" />
        <meta name="twitter:description" content="Discover how Lumaya uses AI to offer empathetic support, privacy-first conversations, and a judgment-free zone." />
        <meta name="twitter:image" content="https://thelumaya.com/assets/og-image.jpg" />
      </Helmet>

      <div style={styles.container}>
        
        {/* Hero Section */}
        <section style={styles.heroSection}>
          <div style={styles.heroContainer}>
            <p style={styles.heroSubtitle}>ABOUT OUR MISSION</p>
            <h1 style={styles.heroTitle}>About Us</h1>
            <div style={styles.tagContainer}>
              <span style={styles.tag}>Mental Wellness</span>
              <span style={styles.tag}>Accessible Support</span>
              <span style={styles.tag}>Judgment-Free</span>
              <span style={styles.tag}>Privacy First</span>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section style={styles.whiteSection}>
          <div style={styles.sectionContainer}>
            <div style={styles.sectionHeader}>
              <div style={styles.iconContainer}>
                <Heart style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
              </div>
              <h2 style={styles.sectionTitle}>Our Mission</h2>
            </div>
            <div style={styles.missionCard}>
              <p style={styles.missionText}>
                We're a small, passionate team on a mission to make mental wellness more accessible, relatable, and
                judgment-free — especially for those who may not feel ready (or able) to seek traditional therapy. Our
                platform acts as a <span style={styles.highlight}>digital wellness companion</span>,
                designed to bridge the gap between silence and support. It's a space where you can think out loud, reflect
                on your emotions, and get gentle guidance — anytime, anywhere.
              </p>
            </div>
          </div>
        </section>

        {/* Why We Built This Section */}
        <section style={styles.creamSection}>
          <div style={styles.sectionContainer}>
            <div style={{...styles.gridTwoCol, '@media (min-width: 1024px)': {gridTemplateColumns: '1fr 1fr'}}}>
              <div style={styles.textContent}>
                <div style={styles.iconContainer}>
                  <MessageCircle style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
                </div>
                <h2 style={styles.sectionTitle}>Why We Built This</h2>
                <div>
                  <p style={styles.paragraph}>
                    In a world where stress, overthinking, and emotional overwhelm have become daily struggles, many
                    people are turning to tech for relief — but most tools feel robotic, generic, or transactional.
                  </p>
                  <p style={styles.paragraph}>
                    We wanted to change that. So, we created a system that listens better, responds with empathy, and
                    improves the more you engage with it — without ever compromising your privacy.
                  </p>
                </div>
              </div>
              <div style={styles.featureCard}>
                <div>
                  <div style={styles.featureItem}>
                    <div style={styles.featureIconContainer}>
                      <Zap style={{height: '1.5rem', width: '1.5rem', color: 'rgb(248, 180, 4)'}} />
                    </div>
                    <div>
                      <h3 style={styles.featureTitle}>Not Robotic</h3>
                      <p style={styles.featureDescription}>Genuine, empathetic responses that feel human</p>
                    </div>
                  </div>
                  <div style={styles.featureItem}>
                    <div style={styles.featureIconContainer}>
                      <Target style={{height: '1.5rem', width: '1.5rem', color: 'rgb(248, 180, 4)'}} />
                    </div>
                    <div>
                      <h3 style={styles.featureTitle}>Personalized</h3>
                      <p style={styles.featureDescription}>Tailored to your unique needs and journey</p>
                    </div>
                  </div>
                  <div style={{...styles.featureItem, marginBottom: 0}}>
                    <div style={styles.featureIconContainer}>
                      <Lock style={{height: '1.5rem', width: '1.5rem', color: 'rgb(248, 180, 4)'}} />
                    </div>
                    <div>
                      <h3 style={styles.featureTitle}>Private</h3>
                      <p style={styles.featureDescription}>Your data stays completely secure and encrypted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section style={styles.whiteSection}>
          <div style={styles.sectionContainer}>
            <div style={styles.sectionHeader}>
              <div style={styles.iconContainer}>
                <Brain style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
              </div>
              <h2 style={styles.sectionTitle}>How It Works</h2>
            </div>
            <div style={{...styles.gridThreeCol, '@media (min-width: 768px)': {gridTemplateColumns: '1fr 1fr'}}}>
              <div style={{...styles.missionCard, padding: '2.5rem'}}>
                <div style={styles.largeIconContainer}>
                  <Zap style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
                </div>
                <h3 style={styles.cardTitle}>Advanced Understanding</h3>
                <p style={styles.cardText}>
                  Behind the scenes, your companion uses advanced language models trained to understand patterns in how we
                  think and feel.
                </p>
              </div>
              <div style={{...styles.missionCard, padding: '2.5rem'}}>
                <div style={styles.largeIconContainer}>
                  <Shield style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
                </div>
                <h3 style={styles.cardTitle}>Privacy First</h3>
                <p style={styles.cardText}>
                  The more context you give it, the more personal and helpful it becomes — while always keeping your data
                  encrypted and invisible to any human eyes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={styles.creamSection}>
          <div style={styles.sectionContainer}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>What Makes Us Different</h2>
              <p style={{fontSize: '1.25rem', color: '#6B7280'}}>Three pillars that set us apart</p>
            </div>
            <div style={{...styles.gridThreeCol, '@media (min-width: 768px)': {gridTemplateColumns: 'repeat(3, 1fr)'}}}>
              <div style={styles.featureCard}>
                <div style={styles.largeIconContainer}>
                  <Heart style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
                </div>
                <h3 style={styles.cardTitle}>Empathetic Responses</h3>
                <p style={styles.cardText}>
                  Unlike generic tools, our system responds with genuine empathy and understanding, making every
                  interaction feel meaningful.
                </p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.largeIconContainer}>
                  <Shield style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
                </div>
                <h3 style={styles.cardTitle}>Complete Privacy</h3>
                <p style={styles.cardText}>
                  Your conversations are encrypted and never seen by human eyes. Your privacy is sacred, and we protect it
                  at all costs.
                </p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.largeIconContainer}>
                  <TrendingUp style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
                </div>
                <h3 style={styles.cardTitle}>Adaptive Learning</h3>
                <p style={styles.cardText}>
                  The more you engage, the better we understand and support your unique journey towards mental wellness.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Belief Section */}
        <section style={styles.whiteSection}>
          <div style={{...styles.sectionContainer, textAlign: 'center'}}>
            <div style={styles.iconContainer}>
              <Sprout style={{height: '2rem', width: '2rem', color: 'rgb(248, 180, 4)'}} />
            </div>
            <h2 style={styles.sectionTitle}>Our Belief</h2>
            <div style={styles.beliefCard}>
              <p style={styles.beliefText}>
                Everyone deserves a safe space to unpack their mind. Whether you're feeling stuck, burnt out, overwhelmed,
                or just need to vent — we're here to support you in becoming more grounded and self-aware.
              </p>
              <div style={styles.divider}></div>
              <blockquote style={styles.quote}>
                "Thank you for trusting us with your thoughts. We're honored to be a small part of your journey."
              </blockquote>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={styles.creamSection}>
          <div style={{...styles.sectionContainer, textAlign: 'center'}}>
            <h2 style={styles.sectionTitle}>Ready to Start Your Journey?</h2>
            <p style={styles.ctaText}>
              Take the first step towards better mental wellness. Your companion is ready to listen, understand, and
              support you.
            </p>
            <button 
              onClick={() => navigate('/chat')} 
              style={styles.ctaButton}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Start Talking
              <ArrowRight style={{height: '1.25rem', width: '1.25rem'}} />
            </button>
          </div>
        </section>
      </div>
    </>
  )
}

export default AboutUsPage