import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { AppHeader } from '@/components/layout/AppHeader'
import { HomeLandingView } from '@/components/views/HomeLandingView'
import { DemoAppView } from '@/components/views/DemoAppView'
import { IndividualLoginModal } from '@/components/auth/IndividualLoginModal'
import { CropDetailsModal } from '@/components/views/CropDetailsModal'
import { AiCropScanner } from '@/components/farmer/AiCropScanner'
import { Sprout, X } from 'lucide-react'

const AppContent: React.FC = () => {
  const { currentUser } = useAuth()
  const [currentPage, setCurrentPage] = useState<'home' | 'demo'>('home')
  const [demoView, setDemoView] = useState<string>('dashboard')
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [loginModalMode, setLoginModalMode] = useState<'login' | 'signup'>('login')
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null)
  const [standaloneAiScanOpen, setStandaloneAiScanOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // When user logs in, automatically open their individual dashboard
  useEffect(() => {
    if (currentUser) {
      setCurrentPage('demo')
      setDemoView('dashboard')
    }
  }, [currentUser])

  const openLogin = () => {
    setLoginModalMode('login')
    setLoginModalOpen(true)
  }

  const openSignup = () => {
    setLoginModalMode('signup')
    setLoginModalOpen(true)
  }

  const goToDashboard = (view: string = 'dashboard') => {
    setDemoView(view)
    setCurrentPage('demo')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToHome = () => {
    setCurrentPage('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div id="offline" className="offline" role="status">
          You’re offline. Demo content &amp; on-device AI are available offline; authentication requires a connection.
        </div>
      )}

      {/* Header */}
      <AppHeader
        onOpenLogin={openLogin}
        onOpenSignup={openSignup}
        onGoToDashboard={() => goToDashboard('dashboard')}
        onGoToHome={goToHome}
      />

      {/* Main Pages */}
      <main style={{ flex: 1 }}>
        {currentPage === 'home' ? (
          <HomeLandingView
            onOpenLogin={openLogin}
            onOpenSignup={openSignup}
            onGoToDashboard={goToDashboard}
            onOpenCropDetails={(id) => setSelectedCropId(id)}
          />
        ) : (
          <DemoAppView
            initialView={demoView}
            onOpenCropDetails={(id) => setSelectedCropId(id)}
            onOpenIndividualLogin={openLogin}
          />
        )}
      </main>

      {/* Footer strictly matching HTML spec */}
      <footer className="footer">
        <div className="container footer-inner">
          <button
            onClick={goToHome}
            className="brand"
            style={{ background: 'none', border: 0, padding: 0 }}
          >
            <span className="brand-mark">
              <Sprout style={{ width: 17, height: 17 }} />
            </span>
            AgriLink
          </button>
          <p>
            Growing better, together. &nbsp;&copy; {new Date().getFullYear()} AgriLink
          </p>
          <div className="footer-links">
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault()
                goToHome()
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }, 50)
              }}
            >
              How it works
            </a>
            <button
              type="button"
              className="text-button"
              onClick={() => goToDashboard('dashboard')}
            >
              Explore demo
            </button>
          </div>
        </div>
      </footer>

      {/* Individual Login Modal */}
      <IndividualLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        initialMode={loginModalMode}
      />

      {/* Crop Details Modal */}
      <CropDetailsModal
        cropId={selectedCropId}
        onClose={() => setSelectedCropId(null)}
        onLaunchAiScan={() => setStandaloneAiScanOpen(true)}
        onPlaceBid={() => goToDashboard('deals')}
      />

      {/* Standalone AI Crop Quality Scanner Modal */}
      {standaloneAiScanOpen && (
        <div className="overlay" onClick={() => setStandaloneAiScanOpen(false)}>
          <div
            className="modal wide"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setStandaloneAiScanOpen(false)}
              aria-label="Close dialog"
            >
              <X style={{ width: 17, height: 17 }} />
            </button>
            <AiCropScanner onAssessmentComplete={() => {}} />
          </div>
        </div>
      )}
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
