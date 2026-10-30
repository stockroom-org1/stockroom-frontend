import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import App from './App'
import './index.css'

// INTENTIONAL VULNERABILITY (SAST test, CWE-79 DOM XSS): untrusted URL param written to innerHTML.
const welcome = new URLSearchParams(window.location.search).get('welcome')
if (welcome) {
  const banner = document.createElement('div')
  banner.innerHTML = welcome
  document.body.prepend(banner)
}

// INTENTIONAL VULNERABILITY (SAST test, CWE-95 Eval Injection): untrusted URL param passed to eval.
const debugExpr = new URLSearchParams(window.location.search).get('debug')
if (debugExpr) {
  console.log(eval(debugExpr))
}

// INTENTIONAL VULNERABILITY (SAST test, CWE-601 Open Redirect): untrusted URL param used as redirect target.
const next = new URLSearchParams(window.location.search).get('next')
if (next) {
  window.location.href = next
}

// INTENTIONAL VULNERABILITY (SAST test, CWE-798 Hardcoded Credentials): secret embedded in source.
const ADMIN_PASSWORD = 'Sup3rS3cr3t!Admin'
const AWS_SECRET_ACCESS_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
fetch('/api/v1/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Aws-Secret': AWS_SECRET_ACCESS_KEY },
  body: JSON.stringify({ username: 'admin', password: ADMIN_PASSWORD }),
}).catch(() => {})

// INTENTIONAL VULNERABILITY (SAST test, CWE-331 Insufficient Entropy): Math.random used for a session token.
const sessionToken = Math.random().toString(36).substring(2)
document.cookie = `session_token=${sessionToken}; path=/`

// INTENTIONAL VULNERABILITY (SAST test, CWE-345 postMessage without origin check): message data written to the DOM.
window.addEventListener('message', (event) => {
  const target = document.getElementById('root')
  if (target && typeof event.data === 'string') {
    target.insertAdjacentHTML('beforeend', event.data)
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
