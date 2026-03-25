import { useEffect, useState } from 'react';
import { ShieldCheckIcon, BellIcon, BarChart3Icon, MapPinIcon, WifiIcon, ZapIcon, ArrowRightIcon, CheckCircleIcon, MenuIcon, XIcon, SparklesIcon, TrendingUpIcon, ShieldIcon, ActivityIcon, SirenIcon, LightbulbIcon, SmartphoneIcon, MonitorIcon, BoxIcon } from 'lucide-react';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { LoginSignupModal } from '../components/LoginSignupModal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'login' | 'signup'>('login');
  const [activeSection, setActiveSection] = useState('home');
  const heroRef = useScrollAnimation();
  const featuresRef = useScrollAnimation();
  const stepsRef = useScrollAnimation();
  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };
  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'how-it-works', 'what-you-get'];
      const scrollPosition = window.scrollY + 150;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const {
            offsetTop,
            offsetHeight
          } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleOpenLoginModal = () => {
    setLoginModalTab('login');
    setLoginModalOpen(true);
  };
  const features = [{
    icon: ShieldCheckIcon,
    title: 'Real-Time Detection',
    description: 'Advanced IoT sensors monitor smoke, heat, and gas levels 24/7, detecting threats before they escalate.',
    gradient: 'from-red-500 to-orange-500',
    delay: 'delay-100'
  }, {
    icon: BellIcon,
    title: 'Instant Alerts',
    description: 'Receive immediate notifications via SMS, email, and mobile app when danger is detected.',
    gradient: 'from-cyan-500 to-blue-500',
    delay: 'delay-200'
  }, {
    icon: BarChart3Icon,
    title: 'Predictive Analytics',
    description: 'AI-powered risk assessment identifies high-risk areas and predicts potential fire incidents.',
    gradient: 'from-purple-500 to-pink-500',
    delay: 'delay-300'
  }, {
    icon: MapPinIcon,
    title: 'Geographic Monitoring',
    description: 'Live map view shows all connected devices and risk zones across your community.',
    gradient: 'from-green-500 to-emerald-500',
    delay: 'delay-400'
  }, {
    icon: WifiIcon,
    title: 'Always Connected',
    description: "Cloud-based system ensures your devices are monitored even when you're away.",
    gradient: 'from-yellow-500 to-orange-500',
    delay: 'delay-500'
  }, {
    icon: ZapIcon,
    title: 'Rapid Response',
    description: 'Automatic alerts to Bureau of Fire Protection for immediate emergency response.',
    gradient: 'from-red-500 to-pink-500',
    delay: 'delay-600'
  }];
  const systemFeatures = [{
    icon: BoxIcon,
    title: 'IoT Fire Sensors',
    description: 'Detect smoke, heat, and gas instantly with advanced multi-sensor technology',
    gradient: 'from-red-500 to-orange-500',
    iconBg: 'bg-gradient-to-br from-red-500 to-orange-500'
  }, {
    icon: SirenIcon,
    title: 'Fire Alarm',
    description: 'Automatically activates to warn building occupants of potential danger',
    gradient: 'from-yellow-500 to-red-500',
    iconBg: 'bg-gradient-to-br from-yellow-500 to-red-500'
  }, {
    icon: LightbulbIcon,
    title: 'Emergency Light',
    description: 'Turns on during fire or power loss to guide safe evacuation routes',
    gradient: 'from-yellow-400 to-orange-400',
    iconBg: 'bg-gradient-to-br from-yellow-400 to-orange-400'
  }, {
    icon: SmartphoneIcon,
    title: 'Smart Response Hub',
    description: 'Automatically sends fire alerts to responders, building managers, or emergency contacts for faster and coordinated action',
    gradient: 'from-cyan-500 to-blue-500',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-500'
  }, {
    icon: MonitorIcon,
    title: 'Admin Dashboard',
    description: 'Enables BFP or administrators to monitor multiple sites for faster response',
    gradient: 'from-purple-500 to-pink-500',
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500'
  }];
  return <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 light:from-slate-50 light:via-white light:to-slate-100 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark light:bg-white/90 light:backdrop-blur-xl border-b border-slate-800/50 light:border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative group">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center ring-2 ring-red-500/30 ring-offset-2 ring-offset-slate-950 light:ring-offset-white overflow-hidden">
                  <img src="/Gemini_Generated_Image_gmlzg8gmlzg8gmlz.png" alt="FIREGUARD3 Logo" className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                </div>
                <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-white light:text-slate-900">
                FIRE<span className="text-gradient-fire">GUARD3</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <button onClick={() => scrollToSection('home')} className={`text-sm xl:text-base transition-colors relative group font-medium ${activeSection === 'home' ? 'text-white light:text-slate-900' : 'text-slate-400 hover:text-white light:hover:text-slate-900'}`}>
                Home
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ${activeSection === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>
              <button onClick={() => scrollToSection('features')} className={`text-sm xl:text-base transition-colors relative group font-medium ${activeSection === 'features' ? 'text-white light:text-slate-900' : 'text-slate-400 hover:text-white light:hover:text-slate-900'}`}>
                Features
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ${activeSection === 'features' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className={`text-sm xl:text-base transition-colors relative group font-medium ${activeSection === 'how-it-works' ? 'text-white light:text-slate-900' : 'text-slate-400 hover:text-white light:hover:text-slate-900'}`}>
                How It Works
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ${activeSection === 'how-it-works' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>
              <button onClick={() => scrollToSection('what-you-get')} className={`text-sm xl:text-base transition-colors relative group font-medium ${activeSection === 'what-you-get' ? 'text-white light:text-slate-900' : 'text-slate-400 hover:text-white light:hover:text-slate-900'}`}>
                Purchase Device
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ${activeSection === 'what-you-get' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>
              <button onClick={handleOpenLoginModal} className="px-4 xl:px-6 py-2 xl:py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm xl:text-base rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all glow-red btn-press focus-ring shadow-lg hover:shadow-red-500/50">
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white light:text-slate-900 p-2 focus-ring rounded-lg hover:bg-slate-800/50 light:hover:bg-slate-100 transition-colors" aria-label="Toggle menu">
                {mobileMenuOpen ? <XIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && <div className="lg:hidden glass-dark light:bg-white/95 border-t border-slate-800 light:border-slate-200 animate-slide-up backdrop-blur-xl">
            <div className="px-4 py-4 space-y-2">
              <button onClick={() => scrollToSection('home')} className={`block w-full text-left transition-colors py-3 px-4 rounded-lg hover:bg-slate-800/50 light:hover:bg-slate-100 font-medium text-base ${activeSection === 'home' ? 'text-white light:text-slate-900 bg-slate-800/30' : 'text-slate-300 light:text-slate-600'}`}>
                Home
              </button>
              <button onClick={() => scrollToSection('features')} className={`block w-full text-left transition-colors py-3 px-4 rounded-lg hover:bg-slate-800/50 light:hover:bg-slate-100 font-medium text-base ${activeSection === 'features' ? 'text-white light:text-slate-900 bg-slate-800/30' : 'text-slate-300 light:text-slate-600'}`}>
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className={`block w-full text-left transition-colors py-3 px-4 rounded-lg hover:bg-slate-800/50 light:hover:bg-slate-100 font-medium text-base ${activeSection === 'how-it-works' ? 'text-white light:text-slate-900 bg-slate-800/30' : 'text-slate-300 light:text-slate-600'}`}>
                How It Works
              </button>
              <button onClick={() => scrollToSection('what-you-get')} className={`block w-full text-left transition-colors py-3 px-4 rounded-lg hover:bg-slate-800/50 light:hover:bg-slate-100 font-medium text-base ${activeSection === 'what-you-get' ? 'text-white light:text-slate-900 bg-slate-800/30' : 'text-slate-300 light:text-slate-600'}`}>
                Purchase Device
              </button>
              <button onClick={() => {
            setMobileMenuOpen(false);
            handleOpenLoginModal();
          }} className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all glow-red btn-press block text-center shadow-lg text-base">
                Login
              </button>
            </div>
          </div>}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-20 sm:pt-28 md:pt-32 lg:pt-40 pb-16 sm:pb-20 md:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30 light:opacity-10">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-red-600 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-orange-600 rounded-full blur-3xl opacity-20 animate-spin-slow"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"></div>
        <div ref={heroRef.ref} className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 ${heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-left space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 glass light:bg-red-50 rounded-full border border-red-500/30 light:border-red-200 animate-bounce-in shadow-lg">
                <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 light:text-red-600 animate-pulse" />
                <span className="text-xs sm:text-sm text-red-400 light:text-red-600 font-semibold">
                  AI-Powered Fire Prevention
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white light:text-slate-900 leading-tight">
                Next-Generation
                <br />
                <span className="text-gradient-fire animate-shimmer bg-clip-text">
                  Fire Prevention
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-300 light:text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                AI-powered IoT sensors protecting homes and communities across
                the Philippines with real-time detection and instant alerts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 sm:pt-4">
                <button onClick={handleOpenLoginModal} className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all glow-red btn-press focus-ring flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:shadow-red-500/50 text-sm sm:text-base">
                  Get Started
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a href="#features" className="px-6 sm:px-8 py-3 sm:py-4 glass light:bg-white light:border-slate-300 border border-slate-700 text-white light:text-slate-900 rounded-xl font-semibold hover:border-cyan-500/50 light:hover:border-cyan-500 transition-all card-lift-sm focus-ring flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base">
                  Learn More
                </a>
              </div>
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 sm:pt-12 mt-8 sm:mt-12 border-t border-slate-800/50 light:border-slate-200">
                <div className="text-center lg:text-left group">
                  <div className="flex items-baseline justify-center lg:justify-start gap-1 mb-1 sm:mb-2">
                    <p className="text-2xl sm:text-4xl md:text-5xl font-bold text-white light:text-slate-900">
                      <AnimatedCounter end={847} suffix="+" />
                    </p>
                    <TrendingUpIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 group-hover:animate-bounce" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 font-medium">
                    Protected Homes
                  </p>
                </div>
                <div className="text-center lg:text-left group">
                  <div className="flex items-baseline justify-center lg:justify-start gap-1 mb-1 sm:mb-2">
                    <p className="text-2xl sm:text-4xl md:text-5xl font-bold text-white light:text-slate-900">
                      <AnimatedCounter end={99.9} suffix="%" />
                    </p>
                    <ShieldIcon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 group-hover:animate-pulse" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 font-medium">
                    Uptime
                  </p>
                </div>
                <div className="text-center lg:text-left group">
                  <div className="flex items-baseline justify-center lg:justify-start gap-1 mb-1 sm:mb-2">
                    <p className="text-2xl sm:text-4xl md:text-5xl font-bold text-white light:text-slate-900">
                      &lt;
                      <AnimatedCounter end={5} />s
                    </p>
                    <ActivityIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 group-hover:animate-spin" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 font-medium">
                    Alert Time
                  </p>
                </div>
              </div>
            </div>
            <div className="relative animate-float mt-8 lg:mt-0">
              <div className="relative z-10">
                <video
                  src="/fireq.mp4"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto drop-shadow-2xl rounded-2xl transform hover:scale-105 transition-transform duration-500"
                  autoPlay
                  muted
                  loop
                  playsInline
                  disablePictureInPicture
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-red-700 blur-3xl opacity-40 light:opacity-20 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 blur-3xl opacity-20 animate-pulse delay-500"></div>
              <div className="hidden sm:block absolute top-1/4 -left-8 w-16 sm:w-20 h-16 sm:h-20 bg-cyan-500/20 rounded-full blur-xl animate-spin-slow"></div>
              <div className="hidden sm:block absolute bottom-1/4 -right-8 w-20 sm:w-24 h-20 sm:h-24 bg-red-500/20 rounded-full blur-xl animate-spin-slow delay-500"></div>
              <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 sm:w-32 h-24 sm:h-32 border-2 border-cyan-500/20 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-600 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div ref={featuresRef.ref} className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 ${featuresRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 glass light:bg-cyan-50 rounded-full mb-4 sm:mb-6 border border-cyan-500/30 light:border-cyan-200">
              <ShieldIcon className="w-4 h-4 text-cyan-400 light:text-cyan-600" />
              <span className="text-xs sm:text-sm text-cyan-400 light:text-cyan-600 font-semibold">
                Comprehensive Protection
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white light:text-slate-900 mb-4 sm:mb-6 px-4">
              Comprehensive Fire{' '}
              <span className="text-gradient-cyan">Protection</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 light:text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
              Advanced technology meets community safety with features designed
              to detect, alert, and prevent fire incidents.
            </p>
          </div>
          {/* Mobile: 2x3 square grid, Desktop: 3 columns */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return <div key={index} className={`group glass light:bg-white light:border-slate-200 rounded-2xl p-2.5 sm:p-6 lg:p-8 border border-slate-700 hover:border-cyan-500/50 light:hover:border-cyan-500 transition-all card-lift animate-slide-up ${feature.delay} relative overflow-hidden aspect-square flex flex-col items-center justify-center text-center`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-2 sm:mb-4 lg:mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <h3 className="text-xs sm:text-xl lg:text-2xl font-bold text-white light:text-slate-900 mb-1 sm:mb-2 lg:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-[10px] sm:text-sm lg:text-base text-slate-400 light:text-slate-600 leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {feature.description}
                    </p>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                </div>;
          })}
          </div>
        </div>
      </section>

      {/* How It Works Section - New Enhanced Version */}
      <section id="how-it-works" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-900/50 light:bg-slate-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-600 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div ref={stepsRef.ref} className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 ${stepsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 glass light:bg-orange-50 rounded-full mb-4 sm:mb-6 border border-orange-500/30 light:border-orange-200">
              <ZapIcon className="w-4 h-4 text-orange-400 light:text-orange-600" />
              <span className="text-xs sm:text-sm text-orange-400 light:text-orange-600 font-semibold">
                Complete Protection System
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white light:text-slate-900 mb-4 sm:mb-6 px-4">
              How It <span className="text-gradient-fire">Works</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 light:text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
              Our integrated fire prevention system combines advanced IoT
              sensors, automated safety features, and real-time monitoring to
              protect your property 24/7.
            </p>
          </div>
          {/* System Features Grid - Mobile: 2x3 with centered Admin Dashboard, Desktop: 3 columns */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 mb-12 justify-items-center">
            {systemFeatures.map((feature, index) => {
            const Icon = feature.icon;
            // Center the Admin Dashboard (last item) on mobile by spanning 2 columns
            const isAdminDashboard = index === systemFeatures.length - 1;
            return <div key={index} className={`group relative glass light:bg-white light:border-slate-200 rounded-2xl p-2.5 sm:p-6 lg:p-8 border border-slate-700 hover:border-orange-500/50 light:hover:border-orange-500 transition-all card-lift animate-slide-up overflow-hidden aspect-square flex flex-col items-center justify-center text-center w-full ${isAdminDashboard ? 'col-span-2 lg:col-span-1 max-w-[50%] lg:max-w-none' : ''} stagger-${index + 1}`}>
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center">
                    {/* Icon */}
                    <div className={`w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-2 sm:mb-5 lg:mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon className="w-5 h-5 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                    {/* Title */}
                    <h3 className="text-xs sm:text-xl lg:text-2xl font-bold text-white light:text-slate-900 mb-1 sm:mb-3 group-hover:text-gradient-fire transition-all truncate w-full px-1">
                      {feature.title}
                    </h3>
                    {/* Description */}
                    <p className="text-[10px] sm:text-sm lg:text-base text-slate-400 light:text-slate-600 leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {feature.description}
                    </p>
                  </div>
                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                </div>;
          })}
          </div>
          {/* System Flow Visualization - Desktop only */}
          <div className="hidden lg:block mt-16 pt-16 border-t border-slate-800/50 light:border-slate-200">
            <div className="flex items-center justify-between relative">
              {/* Connection lines */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-orange-500 to-cyan-500 opacity-30"></div>
              {systemFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return <div key={index} className="relative z-10 flex flex-col items-center">
                    <div className={`w-16 h-16 ${feature.iconBg} rounded-full flex items-center justify-center shadow-xl mb-4 animate-pulse`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-xs text-center text-slate-400 light:text-slate-600 max-w-[100px]">
                      {feature.title}
                    </p>
                  </div>;
            })}
            </div>
          </div>
          {/* CTA */}
          <div className="mt-12 sm:mt-16 text-center">
            <a href="#what-you-get" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 transition-all glow-red btn-press focus-ring shadow-xl">
              Get Complete Protection Now
              <ArrowRightIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section id="what-you-get" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white light:text-slate-900 mb-3 sm:mb-4 px-4">
              What You <span className="text-gradient-fire">Get</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 light:text-slate-600 max-w-2xl mx-auto px-4">
              Premium fire detection system with everything you need for
              complete protection
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="relative animate-float order-2 lg:order-1">
              <div className="relative z-10">
                <video
                  src="/fiya.mp4"
                  className="w-full max-w-xs sm:max-w-sm mx-auto drop-shadow-2xl rounded-2xl"
                  autoPlay
                  muted
                  loop
                  playsInline
                  disablePictureInPicture
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 blur-3xl opacity-20 animate-pulse"></div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="glass light:bg-white light:border-slate-200 rounded-2xl p-6 sm:p-8 border border-slate-700 mb-4 sm:mb-6">
                <div className="mb-4 sm:mb-6">
                  <p className="text-slate-400 light:text-slate-600 text-xs sm:text-sm font-medium mb-2">
                    Complete Package
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-bold text-white light:text-slate-900">
                      ₱1,499
                    </span>
                    <span className="text-sm sm:text-base text-slate-400 light:text-slate-600">
                      one-time
                    </span>
                  </div>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm sm:text-base text-white light:text-slate-900 font-medium">
                        FIREGUARD3 IoT Sensor
                      </p>
                      <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600">
                        Advanced multi-sensor detection system
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm sm:text-base text-white light:text-slate-900 font-medium">
                        24/7 Cloud Monitoring
                      </p>
                      <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600">
                        Real-time alerts and notifications
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm sm:text-base text-white light:text-slate-900 font-medium">
                        Mobile App Access
                      </p>
                      <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600">
                        Monitor from anywhere, anytime
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm sm:text-base text-white light:text-slate-900 font-medium">
                        BFP Integration
                      </p>
                      <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600">
                        Direct connection to fire department
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm sm:text-base text-white light:text-slate-900 font-medium">
                        AI Risk Analytics
                      </p>
                      <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600">
                        Predictive fire prevention insights
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm sm:text-base text-white light:text-slate-900 font-medium">
                        Lifetime Updates
                      </p>
                      <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600">
                        Free software and firmware updates
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <button className="w-full group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all glow-red btn-press focus-ring flex items-center justify-center gap-2 text-sm sm:text-base">
                Purchase Now - ₱1,499
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-dark light:bg-gradient-to-br light:from-red-50 light:to-orange-50 light:border-red-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border-2 border-red-500/30 glow-red text-center card-lift">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white light:text-slate-900 mb-3 sm:mb-4 px-4">
              Ready to Protect Your Home?
            </h2>
            <p className="text-base sm:text-lg text-slate-300 light:text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Join hundreds of families already protected by FIREGUARD3.
              Purchase your device today and experience peace of mind.
            </p>
            <div className="flex justify-center">
              <button className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all glow-red btn-press focus-ring flex items-center justify-center gap-2 text-sm sm:text-base">
                Purchase Device Now
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 light:border-slate-200 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center ring-2 ring-red-500/30 ring-offset-2 ring-offset-slate-950 light:ring-offset-white overflow-hidden">
                  <img src="/Gemini_Generated_Image_gmlzg8gmlzg8gmlz.png" alt="FIREGUARD3" className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-white light:text-slate-900">
                  FIRE<span className="text-gradient-fire">GUARD3</span>
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-400 light:text-slate-600 mb-3 sm:mb-4">
                Next-generation fire prevention powered by AI and IoT
                technology, protecting communities across the Philippines.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse glow-green"></div>
                <span className="text-green-400 light:text-green-600 text-xs sm:text-sm font-medium">
                  System Online
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm sm:text-base text-white light:text-slate-900 font-semibold mb-3 sm:mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="text-sm text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="text-sm text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }} className="text-sm text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#what-you-get" onClick={(e) => { e.preventDefault(); scrollToSection('what-you-get'); }} className="text-sm text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 transition-colors">
                    Purchase Device
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm sm:text-base text-white light:text-slate-900 font-semibold mb-3 sm:mb-4">
                Emergency
              </h4>
              <ul className="space-y-2">
                <li className="text-sm text-slate-400 light:text-slate-600">
                  BFP: 0955-710-7810
                </li>
                <li className="text-sm text-slate-400 light:text-slate-600">
                  Emergency: 911
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 light:border-slate-200 pt-6 sm:pt-8 text-center text-slate-500 light:text-slate-600 text-xs sm:text-sm">
            <p>
              © 2025 FIREGUARD3. All rights reserved. | Bureau of Fire
              Protection Partnership
            </p>
          </div>
        </div>
      </footer>

      {/* Login/Signup Modal */}
      <LoginSignupModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} initialMode={loginModalTab} />
    </div>;
}