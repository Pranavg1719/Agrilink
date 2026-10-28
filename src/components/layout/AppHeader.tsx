import React, { useState } from 'react'
import { Sprout, Menu, X, ArrowRight, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface AppHeaderProps {
  onOpenLogin: () => void
  onOpenSignup: () => void
  onGoToDashboard: () => void
  onGoToHome: () => void
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenLogin,
  onOpenSignup,
  onGoToDashboard,
  onGoToHome
}) => {
  const { currentUser, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="topbar">
      <div className="container nav">
        {/* Brand */}
        <button
          onClick={onGoToHome}
          className="brand"
          style={{ background: 'none', border: '0', padding: 0 }}
          aria-label="AgriLink home"
        >
          <span className="brand-mark">
            <Sprout style={{ width: 20, height: 20 }} />
          </span>
          AgriLink
        </button>

        {/* Navigation Links */}
        <nav
          className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}
          id="navLinks"
          aria-label="Main navigation"
        >
          <a
            href="#listings"
            onClick={(e) => {
              e.preventDefault()
              setMobileMenuOpen(false)
              onGoToHome()
              setTimeout(() => {
                document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })
              }, 60)
            }}
          >
            Explore crops
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault()
              setMobileMenuOpen(false)
              onGoToHome()
              setTimeout(() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }, 60)
            }}
          >
            How it works
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false)
              onGoToDashboard()
            }}
          >
            Labour &amp; services
          </button>
        </nav>

        {/* Action Controls */}
        <div className="nav-actions" id="navActions">
          {currentUser ? (
            <>
              <button
                type="button"
                className="btn btn-outline"
                onClick={onOpenLogin}
                style={{ fontSize: 12, padding: '0 12px' }}
                title="Switch to another individual portal"
              >
                <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.fullName}
                </span>
                <span style={{ fontSize: 10, background: '#173f2d', color: '#d5eaa7', padding: '2px 5px', borderRadius: 4 }}>
                  {currentUser.role}
                </span>
                <ChevronDown style={{ width: 14, height: 14 }} />
              </button>

              <button
                type="button"
                className="btn btn-primary desktop-login"
                onClick={onGoToDashboard}
              >
                Dashboard
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={logout}
                title="Log out"
              >
                <LogOut style={{ width: 15, height: 15 }} />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-text desktop-login"
                onClick={onOpenLogin}
              >
                Log in
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onOpenSignup}
              >
                Sign up <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="menu-toggle"
          id="menuToggle"
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
        </button>
      </div>
    </header>
  )
}
