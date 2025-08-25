'use client'
import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'

const FiMail = dynamic(() => import('react-icons/fi').then(mod => mod.FiMail))
const FiLock = dynamic(() => import('react-icons/fi').then(mod => mod.FiLock))
const FiUser = dynamic(() => import('react-icons/fi').then(mod => mod.FiUser))
const FiArrowRight = dynamic(() => import('react-icons/fi').then(mod => mod.FiArrowRight))

import '@/styles/globals.css'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { login } = useAuth()  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const success = await login({ email, password, remember })

      if (success) {
        router.push('/')
      } else {
        setError('Login failed. Please check your credentials.')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const initParticles = () => {
      const canvas = document.getElementById('particles') as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      type Particle = {
        x: number
        y: number
        size: number
        speedX: number
        speedY: number
      }

      const particles: Particle[] = []
      const particleCount = window.innerWidth < 768 ? 50 : 100

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
        })
      }

      const connectParticles = () => {
        for (let a = 0; a < particles.length; a++) {
          for (let b = a; b < particles.length; b++) {
            const distance = Math.sqrt(
              Math.pow(particles[a].x - particles[b].x, 2) +
                Math.pow(particles[a].y - particles[b].y, 2)
            )

            if (distance < 100) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(particles[a].x, particles[a].y)
              ctx.lineTo(particles[b].x, particles[b].y)
              ctx.stroke()
            }
          }
        }
      }

      let animationFrameId: number

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        for (const p of particles) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
          ctx.fill()

          p.x += p.speedX
          p.y += p.speedY

          if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
          if (p.y < 0 || p.y > canvas.height) p.speedY *= -1
        }

        connectParticles()
        animationFrameId = requestAnimationFrame(animate)
      }

      animate()

      return () => {
        cancelAnimationFrame(animationFrameId)
      }
    }

    const handleResize = () => {
      initParticles()
    }

    initParticles()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black relative overflow-hidden">
      <canvas
        id="particles"
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-md p-10  mx-4 bg-black bg-opacity-60 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-md">
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 rounded-full bg-indigo-600 bg-opacity-80 flex items-center justify-center mb-5 shadow-lg">
            <FiUser className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-extrabold text-white"> login</h1>
          <p className="text-indigo-300 mt-2 text-sm"> login data email and password Please </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-indigo-300 mb-2"
            >
email            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiMail className="text-indigo-400" />
              </div>
              <input
                type="email"
                style={{borderRadius: '0.75rem'}}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                required
                className="w-full pr-10 pl-4 py-3 rounded-lg bg-gray-800 text-white placeholder-indigo-400 border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

        
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-indigo-300 mb-2"
            >
password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiLock className="text-indigo-400" />
              </div>
              <input
                type="password"
                style={{borderRadius: '0.75rem'}}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pr-10 pl-4 py-3 rounded-lg bg-gray-800 text-white placeholder-indigo-400 border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

        <div className="flex items-center justify-between text-indigo-300 text-sm">
  <label htmlFor="rememberMe" className="flex items-center cursor-pointer select-none">
    <div className="relative">
      <input
        type="checkbox"
        id="rememberMe"
        checked={remember}
        onChange={(e) => setRememberMe(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`w-11 h-6 rounded-full shadow-inner transition-colors duration-300 ${
          remember ? 'bg-indigo-500' : 'bg-gray-500/50'
        }`}
      ></div>
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          remember ? 'translate-x-5' : ''
        }`}
      ></div>
    </div>
    <span className="mr-3">Remember me</span>
  </label>
</div>


          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-3 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black transition ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                 loading...
              </>
            ) : (
              <>
                 login
                <FiArrowRight className="mr-2" />
              </>
            )}
          </button>
        </form>

    

      
        <div className="mt-10 pt-6 border-t border-indigo-700 text-center">
          <p className="text-xs text-indigo-500 select-none">
            © {new Date().getFullYear()}pyramids
          </p>
        </div>
      </div>
    </div>
  )
}
