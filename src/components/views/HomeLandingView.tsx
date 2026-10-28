import React from 'react'
import { 
  ArrowRight, 
  ArrowUpRight, 
  ShieldCheck, 
  MapPin, 
  Sprout, 
  CircleCheck, 
  FlaskConical, 
  Heart,
  Wheat,
  Handshake,
  UsersRound,
  Truck
} from 'lucide-react'

interface HomeLandingViewProps {
  onOpenSignup: () => void
  onOpenLogin: () => void
  onGoToDashboard: (view?: string) => void
  onOpenCropDetails: (cropId: string) => void
}

export const CROPS_DATA = [
  {
    id: 'wheat',
    name: 'Fresh Wheat',
    location: 'Indore, Madhya Pradesh',
    price: '24',
    quantity: '2,500 kg',
    image: '/crops/wheat.svg',
    description: 'A sample wheat listing showing how a farmer might present their harvest to buyers.'
  },
  {
    id: 'tomatoes',
    name: 'Red Tomatoes',
    location: 'Nashik, Maharashtra',
    price: '32',
    quantity: '800 kg',
    image: '/crops/tomato.svg',
    description: 'A sample tomato listing to help you explore crop details and the bidding journey.'
  },
  {
    id: 'onions',
    name: 'Fresh Onions',
    location: 'Pune, Maharashtra',
    price: '28',
    quantity: '1,200 kg',
    image: '/crops/onion.svg',
    description: 'A sample onion listing for exploring how buyers and farmers connect.'
  }
]

export const HomeLandingView: React.FC<HomeLandingViewProps> = ({
  onOpenSignup,
  onOpenLogin,
  onGoToDashboard,
  onOpenCropDetails
}) => {
  return (
    <div>
      {/* Hero Section */}
      <div className="container hero-wrap">
        <section className="hero" aria-labelledby="heroTitle">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="dot"></span> A better way to grow together
            </div>
            <h1 id="heroTitle">
              From the farm,<br />
              <span>to more possibilities.</span>
            </h1>
            <p>
              A simpler way for farmers, buyers, and agricultural partners to connect. Discover produce, find support, and grow together.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-lime"
                onClick={onOpenSignup}
              >
                Get started <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
              <button
                type="button"
                className="btn btn-light"
                onClick={() => onGoToDashboard('dashboard')}
              >
                Continue as Guest <ArrowUpRight style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <div className="hero-note">
              <ShieldCheck style={{ width: 15, height: 15, color: '#cfe7a1' }} />
              <span>No account needed to explore our demo</span>
            </div>
          </div>
          <div className="hero-caption">
            <MapPin style={{ width: 14, height: 14 }} />
            <span>Rooted in agriculture, built for people</span>
          </div>
        </section>

        {/* Trust Row */}
        <div className="trust-row" aria-label="Platform benefits">
          <div className="trust-item">
            <div className="trust-icon">
              <Wheat style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <strong>Discover produce</strong>
              <span>Explore crops in one place</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon">
              <Handshake style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <strong>Connect directly</strong>
              <span>Better conversations, together</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon">
              <UsersRound style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <strong>Find the right help</strong>
              <span>Labour and partner support</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon">
              <Truck style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <strong>Keep things moving</strong>
              <span>From harvest to delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fresh From The Fields Marketplace Section */}
      <section className="section container" id="listings">
        <div className="section-head">
          <div>
            <div className="section-kicker">A look at the marketplace</div>
            <h2>Fresh from the fields</h2>
            <p>See how farmers and buyers can connect on AgriLink.</p>
          </div>
          <button
            type="button"
            className="link-arrow"
            onClick={() => onGoToDashboard('crops')}
          >
            Explore all crops <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div className="listings-layout">
          <div className="crop-grid" id="homeCrops">
            {CROPS_DATA.map((crop) => (
              <article key={crop.id} className="crop-card">
                <div className="crop-image">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/crops/wheat.svg'
                    }}
                  />
                  <span className="sample-tag">
                    <FlaskConical style={{ width: 12, height: 12 }} /> Sample listing
                  </span>
                </div>
                <div className="crop-body">
                  <div className="crop-title">
                    <h3>{crop.name}</h3>
                    <button
                      type="button"
                      className="heart"
                      aria-label={`Save ${crop.name}`}
                      onClick={() => onOpenCropDetails(crop.id)}
                    >
                      <Heart style={{ width: 18, height: 18 }} />
                    </button>
                  </div>
                  <div className="crop-location">
                    <MapPin style={{ width: 13, height: 13 }} /> {crop.location}
                  </div>
                  <div className="crop-meta">
                    <div>
                      <small>Sample asking price</small>
                      <strong>₹{crop.price}<span> / kg</span></strong>
                    </div>
                    <div className="quantity">
                      <small>Quantity</small>
                      <strong>{crop.quantity}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline card-action"
                    onClick={() => onOpenCropDetails(crop.id)}
                  >
                    View details <ArrowRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="side-panel">
            <div className="icon-box">
              <Sprout style={{ width: 20, height: 20 }} />
            </div>
            <div className="side-copy">
              <h3>Growing is better together.</h3>
              <p>One place for the people, produce, and services that keep agriculture moving.</p>
            </div>
            <ul>
              <li>
                <CircleCheck style={{ width: 15, height: 15, color: '#5d8b61' }} />
                <span>Discover crops and buyers</span>
              </li>
              <li>
                <CircleCheck style={{ width: 15, height: 15, color: '#5d8b61' }} />
                <span>Find workers and services</span>
              </li>
              <li>
                <CircleCheck style={{ width: 15, height: 15, color: '#5d8b61' }} />
                <span>Follow every step of a deal</span>
              </li>
            </ul>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onGoToDashboard('dashboard')}
            >
              Take a look around <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </aside>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section how" id="how-it-works">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-kicker">Simple from the start</div>
              <h2>Made for the way you work</h2>
              <p>From the first listing to the final handover, every step matters.</p>
            </div>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-num">01</div>
              <div>
                <h3>List or discover produce</h3>
                <p>Farmers share what they grow; buyers find crops that fit their needs.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <div>
                <h3>Connect and agree</h3>
                <p>Discuss a bid, arrange an inspection, and confirm the details together.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <div>
                <h3>Get the right support</h3>
                <p>Explore labour, transport, and delivery options for the next step.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bottom-cta container">
        <div className="cta-box">
          <div>
            <h2>There’s room to grow, together.</h2>
            <p>Explore the platform first, or join AgriLink to get started.</p>
          </div>
          <button
            type="button"
            className="btn btn-lime"
            onClick={onOpenLogin}
          >
            Create an account <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </section>
    </div>
  )
}
