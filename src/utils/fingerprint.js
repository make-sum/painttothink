/**
 * Stealth Device Fingerprinting Module
 * 
 * Collects browser fingerprint data for fraud investigation.
 * Designed to be undetectable by privacy tools.
 * 
 * ⚠️ CRITICAL FOR AI AGENTS:
 * This module should NEVER block app initialization or cause errors.
 * All functions are wrapped in try/catch. If fingerprinting fails,
 * the app continues normally. Errors are silently ignored in production.
 * 
 * Features:
 * - Canvas fingerprinting
 * - WebGL fingerprinting  
 * - Audio fingerprinting
 * - Font detection
 * - Screen/display metrics
 * - Navigator properties
 * - Timezone/locale detection
 * - Hardware concurrency
 * - Touch/pointer support
 * 
 * Usage:
 *   import { initFingerprinting } from './utils/fingerprint'
 *   initFingerprinting() // Non-blocking, delayed execution
 */

// Generate stable visitor ID from fingerprint components
async function generateVisitorId(components) {
  const data = JSON.stringify(components);
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
}

// Canvas fingerprint (unique per browser/device)
function getCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 50;
    
    // Text rendering varies by browser/OS
    ctx.textBaseline = 'alphabetic';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('paint.toth.ink', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('legal services', 4, 37);
    
    // Add unique elements
    ctx.strokeStyle = '#f0f';
    ctx.arc(50, 25, 20, 0, Math.PI * 2, true);
    ctx.stroke();
    
    return canvas.toDataURL();
  } catch (e) {
    return null;
  }
}

// WebGL fingerprint (GPU-specific)
function getWebGLFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return null;
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null,
      version: gl.getParameter(gl.VERSION),
      shadingVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      extensions: gl.getSupportedExtensions()?.slice(0, 20),
    };
  } catch (e) {
    return null;
  }
}

// Audio fingerprint (audio stack-specific)
// Uses AnalyserNode instead of deprecated ScriptProcessorNode
function getAudioFingerprint() {
  return new Promise((resolve) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        resolve(null);
        return;
      }
      
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const analyser = context.createAnalyser();
      const gain = context.createGain();
      
      // Configure analyser
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(10000, context.currentTime);
      
      // Mute output
      gain.gain.setValueAtTime(0, context.currentTime);
      
      oscillator.connect(analyser);
      analyser.connect(gain);
      gain.connect(context.destination);
      
      oscillator.start(0);
      
      // Sample after brief delay
      setTimeout(() => {
        analyser.getByteFrequencyData(dataArray);
        
        // Generate fingerprint from frequency data
        let fingerprint = 0;
        for (let i = 0; i < bufferLength; i++) {
          fingerprint += dataArray[i];
        }
        
        oscillator.stop();
        context.close().catch(() => {});
        resolve(fingerprint.toString());
      }, 50);
    } catch (e) {
      resolve(null);
    }
  });
}

// Installed fonts detection
function getFontFingerprint() {
  const testFonts = [
    'Arial', 'Arial Black', 'Calibri', 'Cambria', 'Comic Sans MS',
    'Courier New', 'Georgia', 'Helvetica', 'Impact', 'Lucida Console',
    'Palatino Linotype', 'Tahoma', 'Times New Roman', 'Trebuchet MS',
    'Verdana', 'Consolas', 'Monaco', 'Menlo', 'Ubuntu', 'Roboto'
  ];
  
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testString = 'mmmmmmmmmmlli';
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = '72px monospace';
  
  const baseWidths = {};
  baseFonts.forEach(font => {
    ctx.font = `72px ${font}`;
    baseWidths[font] = ctx.measureText(testString).width;
  });
  
  const detected = [];
  testFonts.forEach(font => {
    for (const baseFont of baseFonts) {
      ctx.font = `72px '${font}', ${baseFont}`;
      const width = ctx.measureText(testString).width;
      if (width !== baseWidths[baseFont]) {
        detected.push(font);
        break;
      }
    }
  });
  
  return detected;
}

// Screen and display metrics
function getScreenFingerprint() {
  return {
    width: screen.width,
    height: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
    devicePixelRatio: window.devicePixelRatio,
    orientation: screen.orientation?.type,
  };
}

// Navigator properties
function getNavigatorFingerprint() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages?.slice(0, 5),
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency,
    maxTouchPoints: navigator.maxTouchPoints,
    deviceMemory: navigator.deviceMemory,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    pdfViewerEnabled: navigator.pdfViewerEnabled,
    webdriver: navigator.webdriver,
    connection: navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
    } : null,
  };
}

// Timezone and locale
function getTimezoneFingerprint() {
  const date = new Date();
  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: date.getTimezoneOffset(),
    dateFormat: new Intl.DateTimeFormat(navigator.language).format(date),
    locale: navigator.language,
  };
}

// Touch and pointer support
function getTouchFingerprint() {
  return {
    touchSupport: 'ontouchstart' in window,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    pointerType: window.PointerEvent ? 'pointer' : 'touch',
  };
}

// Storage support
function getStorageFingerprint() {
  let localStorageAvailable = false;
  let sessionStorageAvailable = false;
  let indexedDBAvailable = false;
  
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    localStorageAvailable = true;
  } catch (e) {}
  
  try {
    sessionStorage.setItem('test', 'test');
    sessionStorage.removeItem('test');
    sessionStorageAvailable = true;
  } catch (e) {}
  
  try {
    indexedDBAvailable = !!window.indexedDB;
  } catch (e) {}
  
  return {
    localStorage: localStorageAvailable,
    sessionStorage: sessionStorageAvailable,
    indexedDB: indexedDBAvailable,
    cookies: navigator.cookieEnabled,
  };
}

// Main fingerprint collection function
// ⚠️ Each component is wrapped in try/catch - one failure doesn't break others
export async function collectFingerprint() {
  try {
    // Add natural delay to avoid detection
    await new Promise(r => setTimeout(r, Math.random() * 300 + 100));
    
    // Collect each component safely
    let audioFp = null;
    try { audioFp = await getAudioFingerprint(); } catch {}
    
    const components = {
      canvas: null,
      webgl: null,
      audio: audioFp,
      fonts: null,
      screen: null,
      navigator: null,
      timezone: null,
      touch: null,
      storage: null,
    };
    
    // Each try/catch prevents one failure from blocking others
    try { components.canvas = getCanvasFingerprint(); } catch {}
    try { components.webgl = getWebGLFingerprint(); } catch {}
    try { components.fonts = getFontFingerprint(); } catch {}
    try { components.screen = getScreenFingerprint(); } catch {}
    try { components.navigator = getNavigatorFingerprint(); } catch {}
    try { components.timezone = getTimezoneFingerprint(); } catch {}
    try { components.touch = getTouchFingerprint(); } catch {}
    try { components.storage = getStorageFingerprint(); } catch {}
    
    const visitorId = await generateVisitorId(components);
    
    // Calculate confidence based on signal quality
    let confidence = 0;
    if (components.canvas) confidence += 0.2;
    if (components.webgl?.renderer) confidence += 0.2;
    if (components.audio) confidence += 0.15;
    if (components.fonts?.length > 5) confidence += 0.15;
    if (components.navigator?.userAgent) confidence += 0.1;
    if (components.screen?.width) confidence += 0.1;
    if (components.timezone?.timezone) confidence += 0.1;
    
    // Session ID with fallback
    let sessionId = null;
    try {
      sessionId = sessionStorage.getItem('_sid');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem('_sid', sessionId);
      }
    } catch {
      sessionId = crypto.randomUUID();
    }
    
    return {
      visitorId,
      components,
      confidence,
      sessionId,
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
    };
  } catch (e) {
    // Return minimal fingerprint on total failure
    return {
      visitorId: crypto.randomUUID(),
      components: {},
      confidence: 0,
      sessionId: crypto.randomUUID(),
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
      error: true,
    };
  }
}

// Send fingerprint to API (stealth mode)
// ⚠️ Non-blocking - errors here should NEVER break the app
export async function sendFingerprint(endpoint = '/api/fingerprint') {
  try {
    const fp = await collectFingerprint();
    const body = JSON.stringify(fp);
    
    // Use sendBeacon for reliability (doesn't block navigation)
    // Must use Blob to set Content-Type properly
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      // Fallback to fetch with keepalive
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {}); // Silently ignore fetch errors
    }
    
    return fp.visitorId;
  } catch (e) {
    // Fingerprinting errors should NEVER break the app
    // Silent fail - log only in dev
    if (import.meta.env.DEV) console.error('FP error:', e);
    return null;
  }
}

// Auto-collect on page load (delayed and stealthy)
// ⚠️ This should NEVER block app initialization
export function initFingerprinting() {
  try {
    // Wait for page to be fully loaded, then delay randomly
    const collect = () => {
      setTimeout(() => {
        sendFingerprint().catch(() => {}); // Ignore all errors
      }, Math.random() * 2000 + 1000);
    };
    
    if (document.readyState === 'complete') {
      collect();
    } else {
      window.addEventListener('load', collect);
    }
  } catch (e) {
    // Silent fail - fingerprinting should never break the app
  }
}

export default {
  collectFingerprint,
  sendFingerprint,
  initFingerprinting,
};

