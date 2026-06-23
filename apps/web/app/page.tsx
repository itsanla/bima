import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Naxos — App Landing Page',
  description: 'Best landing for your App showcase. Follow other investors, discover companies to believe in.',
};

// ─── Nav Links ───────────────────────────────────────────────────────────────
const navLinks = [
  { label: 'Home',        href: '#top-page'   },
  { label: 'Features',    href: '#features'   },
  { label: 'Screenshots', href: '#screenshots'},
  { label: 'Support',     href: '#support'    },
  { label: 'Blog',        href: '#blog'       },
];

// ─── Features ────────────────────────────────────────────────────────────────
const featuresLeft = [
  { icon: 'icon-basic-gear',         title: 'Custom Shortcuts',   desc: 'Semper a augue suscipit, luctus neque purus ipsum neque dolor primis libero tempus velna culpa expedita.' },
  { icon: 'icon-basic-lock',         title: 'Secure Integration', desc: 'Semper a augue suscipit, luctus neque purus ipsum neque dolor primis libero tempus velna culpa expedita.' },
  { icon: 'icon-basic-message-txt',  title: 'Free Live Chat',     desc: 'Semper a augue suscipit, luctus neque purus ipsum neque dolor primis libero tempus velna culpa expedita.' },
];

const featuresRight = [
  { icon: 'icon-basic-share',          title: 'Social Share',    desc: 'Semper a augue suscipit, luctus neque purus ipsum neque dolor primis libero tempus velna culpa expedita.' },
  { icon: 'icon-basic-sheet-multiple', title: 'Merge Files',     desc: 'Semper a augue suscipit, luctus neque purus ipsum neque dolor primis libero tempus velna culpa expedita.' },
  { icon: 'icon-basic-alarm',          title: 'Action Reminder', desc: 'Semper a augue suscipit, luctus neque purus ipsum neque dolor primis libero tempus velna culpa expedita.' },
];

// ─── How It Works ─────────────────────────────────────────────────────────────
const services = [
  { icon: 'icon-basic-server2', title: 'Your Data in Cloud',  desc: 'Lorem ipsum dolor sit amet, conseda adipiscing elit. Aenean commodo ligula eget dolor massa.', delay: '0' },
  { icon: 'icon-basic-headset', title: '24/7 Support',         desc: 'Lorem ipsum dolor sit amet, conseda adipiscing elit. Aenean commodo ligula eget dolor massa.', delay: '0.3s' },
  { icon: 'icon-software-pen',  title: 'Exclusive Design',     desc: 'Lorem ipsum dolor sit amet, conseda adipiscing elit. Aenean commodo ligula eget dolor massa.', delay: '0.6s' },
];

// ─── Counters ─────────────────────────────────────────────────────────────────
const counters = [
  { icon: 'icon-basic-download',    count: '2,067', label: 'Total Downloads', delay: '0' },
  { icon: 'icon-ecommerce-bag-plus', count: '982',  label: 'Happy Clients',   delay: '0.3s' },
  { icon: 'icon-basic-tablet',       count: '890',  label: 'Active Users',    delay: '0.6s' },
  { icon: 'icon-basic-star',         count: '537',  label: 'App Rates',       delay: '0.9s' },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  { text: 'Fusce euismod eget nulla a tempus. Pellentesque in varius metus. Fusce iaculis cursus ante, vel vestibulum dui sagittis vitae pulvinar consequat tortor.', name: 'Jane Aniston',   company: 'From Globex',  img: '/naxos_assets/client-1.jpg' },
  { text: 'Aenean sit amet est orci. Aenean at nisi eget nulla lobortis commodo. Nam eget lorem in ex aliquam dapibus sed augue auctor purus vitae, venenatis ex.',     name: 'Martin Jack',    company: 'From Hooli',   img: '/naxos_assets/client-2.jpg' },
  { text: 'Suspendisse non velit lacus. Mauris efficitur lorem a justo semper, ut suscipit ligula malesuada. Donec dui nulla laoreet tortor in auctor interdum.',       name: 'David Dowsy',    company: 'From Acme',    img: '/naxos_assets/client-3.jpg' },
  { text: 'Vestibulum lectus massa, volutpat ut tristique nec, volutpat in turpis. In vehicula tempus odio. Nullam enim ligula condimentum est sed urna tristique.',     name: 'Doglas Kosta',   company: 'From Soylent', img: '/naxos_assets/client-4.jpg' },
  { text: 'Nunc accumsan finibus sollicitudin. Integer malesuada purus sapien, sit amet volutpat sem fringilla ut. Proin viverra scelerisque mollis iaculis id magna.',  name: 'Anthony Lee',    company: 'From Initech', img: '/naxos_assets/client-5.jpg' },
  { text: 'Cras et est eu tellus fringilla congue. Nunc efficitur libero ut nunc volutpat porttitor. Aliquam in justo at neque ac massa ultricies, lobortis sem.',       name: 'Jonathon Doe',   company: 'From Umbrella',img: '/naxos_assets/client-6.jpg' },
];

// ─── Overview ─────────────────────────────────────────────────────────────────
const overviewBoxes = [
  { icon: 'icon-basic-compass', title: 'Easy to Use',     desc: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur' },
  { icon: 'icon-basic-helm',    title: 'Monitor & Manage',desc: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur' },
  { icon: 'icon-basic-link',    title: 'Stay Connected',  desc: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur' },
];

const checklistItems = [
  'Ut fringilla est at nunc suscipit dictum. Nulla facilisi. Phasellus dignissim nibh eget imperdiet venenatis.',
  'Nullam egestas tincidunt lectus, sagittis eros vestibulum in. Vestibulum finibus iaculis sagittis. Suspendisse viverra luctus.',
  'Suspendisse at volutpat magna, vitae mattis metus. Integer posuere eu erat at pharetra. Aliquam ut pharetra diam.',
  'Donec luctus, sem vel molestie efficitur, metus libero mollis neque, sed scelerisque arcu nisl eu lectus.',
  'Fusce neque magna, fringilla ac vulputate at, venenatis a eros. Donec accumsan commodo tortor sed fringilla.',
];

// ─── Screenshots ──────────────────────────────────────────────────────────────
const screenshots = Array.from({ length: 8 }, (_, i) => `/naxos_assets/screenshot-${i + 1}.jpg`);

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const faqs = [
  { q: 'Can I see Naxos in action before purchasing it?',     open: true },
  { q: "I've got older Mac. Is Naxos compatible with it?",    open: false },
  { q: 'What are the requirements for using Naxos?',          open: false },
  { q: 'How does Naxos handle my privacy?',                   open: false },
  { q: 'What is Naxos privacy policy?',                       open: false },
];

const faqAnswer = 'Nam erat orci, dictum eu iaculis a, scelerisque commodo risus. Mauris eu egestas ipsum. In hac habitasse platea dictumst. Duis in consequat est. Sed feugiat, ante in finibus ullamcorper, felis sem porta orci, sed pretium nibh nunc a tellus.';

// ─── Blog ─────────────────────────────────────────────────────────────────────
const posts = [
  { img: '/naxos_assets/post-1.jpg', category: 'Photography', author: 'Matthew Johns',   date: 'January 14, 2024',   title: 'Assorted Color Buildings and Sea in Riomaggiore' },
  { img: '/naxos_assets/post-2.jpg', category: 'Lifestyle',   author: 'Alex Wesly',      date: 'December 30, 2023',  title: 'Aerial Photography of Snowy Mountain Ranges' },
  { img: '/naxos_assets/post-3.jpg', category: 'Development', author: 'Richard Jackson', date: 'February 12, 2022',  title: 'Forest Highway With Green Leaves' },
];

// ─── Clients ──────────────────────────────────────────────────────────────────
const clients = Array.from({ length: 8 }, (_, i) => ({ img: `/naxos_assets/company-${i + 1}.png`, alt: `Client ${i + 1}` }));

// ─── Footer Links ─────────────────────────────────────────────────────────────
const usefulLinks  = ['Support', 'Privacy Policy', 'Terms & Conditions', 'Affiliate Program', 'Careers'];
const productLinks = ['FAQ', 'Reviews', 'Features', 'Feedback', 'API'];

// =============================================================================
export default function NaxosPage() {
  return (
    <div>
      {/* Page loader (hidden) */}
      <div className="page-loader" style={{ display: 'none' }}>
        <div className="progress" />
      </div>

      {/* ── Header / Navbar ─────────────────────────────────────── */}
      <header id="top-page" className="header">
        <div id="mainNav" className="main-menu-area animated">
          <div className="container">
            <div className="align-items-center row">
              {/* Logo */}
              <div className="col-12 col-lg-2 d-flex justify-content-between align-items-center col">
                <div className="logo">
                  <a className="navbar-brand navbar-brand1" href="/">
                    <Image src="/naxos_assets/logo-white.png" alt="Naxos" width={120} height={40} priority />
                  </a>
                  <a className="navbar-brand navbar-brand2" href="/">
                    <Image src="/naxos_assets/logo.png" alt="Naxos" width={120} height={40} priority />
                  </a>
                </div>
                {/* Hamburger */}
                <div className="menu-bar d-lg-none" role="button" tabIndex={0} aria-label="Open menu">
                  <span /><span /><span />
                </div>
              </div>

              {/* Menu */}
              <div className="op-mobile-menu col-lg-10 p-0 d-lg-flex align-items-center justify-content-end">
                <div className="m-menu-header d-flex justify-content-between align-items-center d-lg-none">
                  <a href="/" className="logo">
                    <Image src="/naxos_assets/logo.png" alt="Naxos" width={100} height={35} />
                  </a>
                  <span className="close-button" role="button" tabIndex={0} aria-label="Close menu" />
                </div>
                <ul className="nav-menu d-lg-flex flex-wrap list-unstyled justify-content-center">
                  {navLinks.map((link) => (
                    <li key={link.href} className="nav-item">
                      <a className="nav-link js-scroll-trigger" href={link.href}>
                        <span>{link.label}</span>
                      </a>
                    </li>
                  ))}
                  <li className="nav-item search-option">
                    <a className="nav-link" href="#" aria-label="Search">
                      <i className="fas fa-search" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      <div className="search-wrapper">
        <form role="search" method="get" className="search-form" action="#">
          <input type="search" name="s" id="search-input" placeholder="Search Keyword" className="searchbox-input" autoComplete="off" required />
          <span>Input your search keywords and press Enter.</span>
        </form>
        <div className="search-wrapper-close">
          <span className="search-close-btn" role="button" tabIndex={0} aria-label="Close search" />
        </div>
      </div>

      {/* ── Hero / Banner ───────────────────────────────────────── */}
      <section id="home" className="banner video-bg bottom-oval">
        <div className="video-bg">
          <iframe
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Naxos Hero Video"
            width="100%"
            height="100%"
            src="/naxos_assets/mqEeWiRwv0k.html"
            id="widget2"
          />
        </div>
        <div className="container">
          <div className="align-items-center row">
            <div className="col-12 col-lg-6 offset-lg-3 col">
              <div className="banner-text text-center">
                <h1 className="wow fadeInUp" data-wow-offset="10" data-wow-duration="1s" data-wow-delay="0s">
                  Made for better
                </h1>
                <p className="wow fadeInUp" data-wow-offset="10" data-wow-duration="1s" data-wow-delay="0.3s">
                  Best landing for your App showcase. Follow other investors, discover companies to believe in.
                </p>
                <div className="button-store wow fadeInUp" data-wow-offset="10" data-wow-duration="1s" data-wow-delay="0.6s">
                  <a href="#" className="d-inline-flex align-items-center m-2 m-sm-0 me-sm-3" aria-label="Get on Google Play">
                    <Image src="/naxos_assets/google-play.png" alt="Google Play" width={150} height={50} />
                  </a>
                  <a href="#" className="d-inline-flex align-items-center m-2 m-sm-0" aria-label="Download on App Store">
                    <Image src="/naxos_assets/app-store.png" alt="App Store" width={150} height={50} />
                  </a>
                </div>
              </div>
              <div className="empty-30" />
            </div>
          </div>
        </div>
        <div className="banner-image-center w-100 wow fadeInUp" data-wow-offset="10" data-wow-duration="1s" data-wow-delay="0.3s">
          <Image src="/naxos_assets/video-welcome.png" alt="App Preview" width={1200} height={600} style={{ width: '100%', height: 'auto' }} />
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section id="features" className="bg-grey">
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-12 col-md-10 col-lg-6 col">
              <div className="section-title text-center">
                <h3>Awesome Features</h3>
                <p>Sed laoreet diam sagittis tempus convallis. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center row">
            {/* Left features */}
            <div className="col-12 col-md-6 col-lg-4 col">
              <ul className="features-item">
                {featuresLeft.map((f) => (
                  <li key={f.title}>
                    <div className="feature-box d-flex box-left">
                      <div className="box-icon"><div className={`icon ${f.icon}`} /></div>
                      <div className="box-text align-self-center align-self-md-start">
                        <h4>{f.title}</h4>
                        <p>{f.desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Center image */}
            <div className="col-12 col-lg-4 d-none d-lg-block col">
              <div className="features-thumb text-center">
                <Image src="/naxos_assets/awesome-features.png" alt="Features" width={300} height={500} style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            </div>
            {/* Right features */}
            <div className="col-12 col-md-6 col-lg-4 col">
              <ul className="features-item">
                {featuresRight.map((f) => (
                  <li key={f.title}>
                    <div className="feature-box d-flex">
                      <div className="box-icon"><div className={`icon ${f.icon}`} /></div>
                      <div className="box-text align-self-center align-self-md-start">
                        <h4>{f.title}</h4>
                        <p>{f.desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section id="services">
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-12 col-md-10 col-lg-6 col">
              <div className="section-title text-center">
                <h3>How It Works?</h3>
                <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo justo. Nullam dictum felis eu pede mollis pretium.</p>
              </div>
            </div>
          </div>
          <div className="row">
            {services.map((s) => (
              <div key={s.title} className="col-12 col-lg-4 res-margin wow fadeInUp col" data-wow-offset="10" data-wow-duration="1s" data-wow-delay={s.delay}>
                <div className="service-single">
                  <div className={`icon ${s.icon}`} />
                  <h5>{s.title}</h5>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Parallax Video ──────────────────────────────────────── */}
      <section
        id="parallax-video"
        className="parallax"
        data-image="/images/parallax/video.jpg"
        style={{ backgroundImage: 'url("/images/parallax/video.jpg")' }}
      >
        <div className="overlay" />
        <div className="container">
          <div className="row">
            <div className="video-btn wow fadeInUp" data-wow-offset="10" data-wow-duration="1s" data-wow-delay="0s">
              <a href="#" data-rel="lightcase" className="play-btn" aria-label="Watch video">
                <i className="fas fa-play" />
              </a>
              <span className="video-text">Watch This Video</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section id="testimonials">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-6 col">
              <div className="section-title text-center">
                <h3>Client Reviews</h3>
                <p>Donec purus est, tincidunt eu sodales quis, vehicula quis enim. Morbi dapibus, tellus a gravida faucibus, elit ipsum.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 testimonial-carousel col">
              <div className="block-text row">
                <div className="col-12 col-lg-8 offset-lg-2">
                  {/* Static display — show all cards in a grid without JS slider */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {testimonials.map((t, i) => (
                      <div key={i} className="single-box" style={{ padding: '24px', background: '#f8f9fa', borderRadius: '12px' }}>
                        <p>
                          <i className="fas fa-quote-left" /> {t.text} <i className="fas fa-quote-right" />
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                          <Image src={t.img} alt={t.name} width={50} height={50} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{t.name}</h3>
                            <span style={{ fontSize: '12px', color: '#888' }}>{t.company}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Overview ────────────────────────────────────────────── */}
      <section id="overview" className="bg-grey">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-6 offset-lg-1 order-lg-last res-margin col">
              <div className="section-title text-center text-lg-start">
                <h3>Track Time From Anywhere</h3>
                <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>
              </div>
              <div className="overview-item">
                {overviewBoxes.map((box) => (
                  <div key={box.title} className="overview-box d-flex flex-wrap">
                    <div className={`icon ${box.icon}`} />
                    <div className="content">
                      <h6 className="font-weight-bold mb-2 mt-0">{box.title}</h6>
                      <p>{box.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-5 order-lg-first text-sm-center col">
              <Image src="/naxos_assets/track-time.png" alt="Track Time" width={400} height={500} style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          </div>

          <div className="empty-100" />

          <div className="row">
            <div className="col-12 col-lg-6 res-margin col">
              <div className="section-title text-center text-lg-start">
                <h3>Built For Your Daily Schedule</h3>
                <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>
              </div>
              <ul className="overview-list">
                {checklistItems.map((item, i) => (
                  <li key={i}>
                    <p><i className="fa-li fas fa-check" /> {item}</p>
                  </li>
                ))}
              </ul>
              <p className="text-center text-lg-start">
                <a href="#" className="btn">Learn More</a>
              </p>
            </div>
            <div className="col-12 col-lg-5 offset-lg-1 text-sm-center col">
              <Image src="/naxos_assets/daily-schedule.png" alt="Daily Schedule" width={400} height={480} style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Counters ────────────────────────────────────────────── */}
      <section
        id="counters"
        className="parallax"
        data-image="/images/parallax/counters.jpg"
        style={{ backgroundImage: 'url("/images/parallax/counters.jpg")' }}
      >
        <div className="overlay" />
        <div className="container">
          <div className="row">
            {counters.map((c) => (
              <div key={c.label} className="col-12 col-md-6 col-lg-3 col">
                <div className="counter wow fadeInUp" data-wow-offset="10" data-wow-duration="1s" data-wow-delay={c.delay}>
                  <div className={`icon ${c.icon}`} />
                  <div className="counter-content res-margin">
                    <h5><span className="number-count">{c.count}</span></h5>
                    <p>{c.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── App Screenshots ─────────────────────────────────────── */}
      <section id="screenshots" className="bg-grey">
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-12 col-md-10 col-lg-6 col">
              <div className="section-title text-center">
                <h3>App Screenshots</h3>
                <p>Morbi velit leo, sodales in purus eu, pretium accumsan nunc. Praesent eu diam ut ante consequat euismod.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col">
              <div className="screenshot-slider" style={{ overflowX: 'auto', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '20px', width: 'max-content' }}>
                  {screenshots.map((src, i) => (
                    <a key={i} href={src} style={{ flexShrink: 0 }}>
                      <Image src={src} alt={`Screenshot ${i + 1}`} width={220} height={400} style={{ borderRadius: '12px', display: 'block' }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section id="support">
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-12 col-md-10 col-lg-6 col">
              <div className="section-title text-center">
                <h3>Frequently Asked Questions</h3>
                <p>Cras fringilla, lectus sed ullamcorper fringilla. Massa ex accumsan odio, quis iaculis justo magna quis tortor.</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-lg-10 offset-lg-1 col">
              <div className="accordion accordion-flush">
                {faqs.map((faq, i) => (
                  <div key={i} className="accordion-item">
                    <h5 className="accordion-header">
                      <button type="button" aria-expanded={faq.open} className={`accordion-button${faq.open ? '' : ' collapsed'}`}>
                        {faq.q}
                      </button>
                    </h5>
                    <div className={`accordion-collapse collapse${faq.open ? ' show' : ''}`}>
                      <div className="accordion-body">
                        <p>{faqAnswer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="empty-30" />
          <div className="row">
            <div className="col-12 col">
              <p className="text-center mb-0">
                Still have a question? <a href="#"><strong>Ask your question here</strong></a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Subscribe ───────────────────────────────────────────── */}
      <section
        id="subscribe"
        className="parallax"
        data-image="/images/parallax/subscribe.jpg"
        style={{ backgroundImage: 'url("/images/parallax/subscribe.jpg")' }}
      >
        <div className="overlay" />
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-12 col-md-10 col-lg-6 col">
              <div className="section-title text-center white">
                <h3 className="text-white">Subscribe To Newsletter</h3>
                <p>Vivamus ornare feugiat orci eu faucibus. Phasellus nulla arcu, pharetra nec laoreet in, scelerisque a lectus.</p>
              </div>
            </div>
          </div>
          <div className="justify-content-center row">
            <div className="col-12 col-md-10 col-lg-6 col">
              <form id="subscribe-form">
                <div className="input-group mb-3">
                  <input type="email" name="email" className="form-control field-subscribe" placeholder="Enter Your Email Address" />
                </div>
                <button type="submit" className="btn w-100">Subscribe</button>
              </form>
              <div className="empty-30" />
              <p className="text-center mb-0">
                We don&apos;t share your personal information with anyone or company. Check out our{' '}
                <a href="#"><strong>Privacy Policy</strong></a> for more information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog ────────────────────────────────────────────────── */}
      <section id="blog">
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-12 col-md-10 col-lg-6 col">
              <div className="section-title text-center">
                <h3>Latest Blog Posts</h3>
                <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere ipsum dolor sit amet, consectetur elit.</p>
              </div>
            </div>
          </div>
          <div className="blog-home row">
            {posts.map((post) => (
              <div key={post.title} className="col-12 col-lg-4 res-margin col">
                <div className="blog-col">
                  <p>
                    <a href="/blog-post">
                      <Image src={post.img} className="blog-img" alt={post.title} width={400} height={250} style={{ width: '100%', height: 'auto' }} />
                    </a>
                    <span className="blog-category">{post.category}</span>
                  </p>
                  <div className="blog-wrapper">
                    <div className="blog-text">
                      <p className="blog-about">
                        <span>{post.author}</span><span>{post.date}</span>
                      </p>
                      <h4><a href="/blog-post">{post.title}</a></h4>
                      <p>
                        Quisque dui at erat auctor pulvinar nisl felis, gravida et aliquam vitae, aliquet quis nibh.
                        <a href="/blog-post" className="btn-read-more">Read More</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clients ─────────────────────────────────────────────── */}
      <section id="clients" className="section-box bg-grey">
        <div className="container">
          <div className="row justify-content-center align-items-center" style={{ gap: '30px', flexWrap: 'wrap' }}>
            {clients.map((c) => (
              <div key={c.alt} style={{ flex: '0 0 auto' }}>
                <a href="#">
                  <Image src={c.img} alt={c.alt} width={120} height={60} style={{ maxWidth: '120px', height: 'auto', filter: 'grayscale(1)', opacity: 0.7 }} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer>
        <div className="footer-widgets">
          <div className="container">
            <div className="row">
              {/* Brand */}
              <div className="col-12 col-md-6 col-lg-3 res-margin col">
                <div className="widget">
                  <p className="footer-logo">
                    <Image src="/naxos_assets/logo-white.png" alt="Naxos" width={120} height={40} />
                  </p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis non, fugit totam vel laboriosam vitae.</p>
                  <div className="footer-social">
                    {[['fa-twitter', 'Twitter'], ['fa-facebook-f', 'Facebook'], ['fa-instagram', 'Instagram'], ['fa-dribbble', 'Dribbble'], ['fa-pinterest', 'Pinterest']].map(([cls, label]) => (
                      <a key={label} href="#" title={label} aria-label={label}>
                        <i className={`fab ${cls} fa-fw`} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              {/* Useful Links */}
              <div className="col-12 col-md-6 col-lg-2 offset-lg-1 res-margin col">
                <div className="widget">
                  <h6>Useful Links</h6>
                  <ul className="footer-menu">
                    {usefulLinks.map((l) => <li key={l}><a href="#">{l}</a></li>)}
                  </ul>
                </div>
              </div>
              {/* Product Help */}
              <div className="col-12 col-md-6 col-lg-3 res-margin col">
                <div className="widget">
                  <h6>Product Help</h6>
                  <ul className="footer-menu">
                    {productLinks.map((l) => <li key={l}><a href="#">{l}</a></li>)}
                  </ul>
                </div>
              </div>
              {/* Download */}
              <div className="col-12 col-md-6 col-lg-3 col">
                <div className="widget">
                  <h6>Download</h6>
                  <div className="button-store">
                    <a href="#" className="custom-btn d-inline-flex align-items-center m-2 m-sm-0 mb-sm-3">
                      <i className="fab fa-google-play" />
                      <p>Available on<span>Google Play</span></p>
                    </a>
                    <a href="#" className="custom-btn d-inline-flex align-items-center m-2 m-sm-0">
                      <i className="fab fa-apple" />
                      <p>Download on<span>App Store</span></p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            <div className="row">
              <div className="col-12 col">
                <p className="copyright text-center">
                  Copyright &copy; 2024 <a href="#" target="_blank" rel="noreferrer">Naxos</a>. All Rights Reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Back to Top ─────────────────────────────────────────── */}
      <a href="#top-page" className="to-top" aria-label="Back to top">
        <div className="icon icon-arrows-up" />
      </a>
    </div>
  );
}
