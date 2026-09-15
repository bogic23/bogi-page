<template>
  <section id="qr-generator" v-parallax="{ speed: 0.03 }" class="py-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-10 mx-auto">
          <div class="text-center mb-5">
            <h2 v-reveal="{ transform: 'translateY(30px)' }" class="display-6 fw-bold mb-3">
              <i class="bi bi-qr-code me-2 text-primary" />
              Live QR Code Generator
            </h2>
            <div v-reveal="{ delay: 100, transform: 'scaleX(0)' }" class="divider mx-auto" />
            <p v-reveal="{ transform: 'translateY(20px)', delay: 200 }" class="lead text-muted">
              Generate and scan QR codes in real-time. Enter text, URLs, or data to create QR codes instantly.
            </p>
          </div>

          <AppCard class="qr-generator-card">
            <div class="row g-4">
              <div class="col-lg-6">
                <div v-reveal="{ transform: 'translateX(-30px)' }" class="generator-section">
                  <h4 class="mb-4">
                    <i class="bi bi-upc-scan me-2 text-primary" />
                    Generate QR Code
                  </h4>
                  
                  <div class="mb-4">
                    <label for="qrInput" class="form-label">Content to Encode</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-barcode" /></span>
                      <textarea
                        id="qrInput"
                        v-model="qrContent"
                        class="form-control"
                        rows="4"
                        placeholder="Enter text, URL, email, phone, WiFi config, etc."
                        @input="generateQRCode"
                      />
                    </div>
                  </div>

                  <div class="row g-3 mb-4">
                    <div class="col-md-6">
                      <label for="qrSize" class="form-label">Size (px)</label>
                      <input
                        id="qrSize"
                        v-model="qrSize"
                        type="range"
                        class="form-range"
                        min="100"
                        max="500"
                        step="50"
                        @input="generateQRCode"
                      >
                      <small class="text-muted">{{ qrSize }}px</small>
                    </div>
                    <div class="col-md-6">
                      <label for="errorCorrection" class="form-label">Error Correction</label>
                      <select
                        id="errorCorrection"
                        v-model="errorCorrectionLevel"
                        class="form-select"
                        @change="generateQRCode"
                      >
                        <option value="L">
                          Low (L) - ~7% recovery
                        </option>
                        <option value="M">
                          Medium (M) - ~15% recovery
                        </option>
                        <option value="Q">
                          Quartile (Q) - ~25% recovery
                        </option>
                        <option value="H">
                          High (H) - ~30% recovery
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="row g-3 mb-4">
                    <div class="col-md-6">
                      <label for="fgColor" class="form-label">Foreground Color</label>
                      <input
                        id="fgColor"
                        v-model="foregroundColor"
                        type="color"
                        class="form-control form-control-color"
                        @change="generateQRCode"
                      >
                    </div>
                    <div class="col-md-6">
                      <label for="bgColor" class="form-label">Background Color</label>
                      <input
                        id="bgColor"
                        v-model="backgroundColor"
                        type="color"
                        class="form-control form-control-color"
                        @change="generateQRCode"
                      >
                    </div>
                  </div>

                  <div class="d-flex gap-2 flex-wrap mb-4">
                    <button
                      v-ripple="{ color: 'rgba(255,255,255,0.3)' }"
                      v-magnetic="{ strength: 0.15 }"
                      class="btn btn-primary"
                      :disabled="!qrCodeDataUrl"
                      @click="downloadQRCode"
                    >
                      <i class="bi bi-download me-2" />
                      Download PNG
                    </button>
                    <button
                      v-ripple
                      v-magnetic="{ strength: 0.15 }"
                      class="btn btn-outline-secondary"
                      :disabled="!qrCodeDataUrl"
                      @click="copyToClipboard"
                    >
                      <i class="bi bi-clipboard me-2" />
                      Copy Image
                    </button>
                    <button
                      v-ripple
                      v-magnetic="{ strength: 0.15 }"
                      class="btn btn-outline-secondary"
                      @click="clearContent"
                    >
                      <i class="bi bi-x-circle me-2" />
                      Clear
                    </button>
                  </div>

                  <div v-if="copySuccess" class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="bi bi-check-circle me-2" />
                    QR Code copied to clipboard!
                    <button
                      type="button"
                      class="btn-close"
                      aria-label="Close"
                      @click="copySuccess = false"
                    />
                  </div>
                </div>
              </div>

              <div class="col-lg-6">
                <div v-reveal="{ transform: 'translateX(30px)' }" class="preview-section">
                  <h4 class="mb-4">
                    <i class="bi bi-eye me-2 text-primary" />
                    Preview
                  </h4>
                  
                  <div class="qr-preview d-flex justify-content-center align-items-center">
                    <div v-if="qrCodeDataUrl" class="qr-code-container">
                      <img
                        :src="qrCodeDataUrl"
                        :alt="'QR Code: ' + qrContent.substring(0, 50)"
                        class="qr-code-image"
                      >
                    </div>
                    <div v-else class="qr-placeholder">
                      <i class="bi bi-qr-code-scan display-1 text-muted" />
                      <p class="text-muted mt-3">
                        Enter content to generate QR code
                      </p>
                    </div>
                  </div>

                  <div class="mt-4 p-3 bg-light rounded">
                    <h6 class="mb-2">
                      Quick Templates
                    </h6>
                    <div class="d-flex flex-wrap gap-2">
                      <button
                        v-for="template in templates"
                        :key="template.label"
                        v-ripple
                        v-magnetic="{ strength: 0.1 }"
                        class="btn btn-sm btn-outline-primary"
                        @click="useTemplate(template)"
                      >
                        {{ template.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr class="my-4">

            <div class="row g-4">
              <div class="col-lg-6">
                <div v-reveal="{ transform: 'translateX(-30px)', delay: 100 }" class="scanner-section">
                  <h4 class="mb-4">
                    <i class="bi bi-camera-video me-2 text-primary" />
                    Scan QR Code (jsqr)
                  </h4>
                  
                  <div class="scanner-controls mb-3">
                    <button
                      v-ripple
                      v-magnetic="{ strength: 0.15 }"
                      class="btn btn-primary"
                      :disabled="scanning"
                      @click="startScanner"
                    >
                      <i class="bi bi-camera me-2" />
                      Start Camera
                    </button>
                    <button
                      v-ripple
                      v-magnetic="{ strength: 0.15 }"
                      class="btn btn-outline-danger ms-2"
                      :disabled="!scanning"
                      @click="stopScanner"
                    >
                      <i class="bi bi-stop-circle me-2" />
                      Stop Camera
                    </button>
                  </div>

                  <div ref="scannerContainer" class="scanner-container">
                    <video
                      v-show="scanning"
                      ref="videoElement"
                      class="scanner-video"
                      playsinline
                      muted
                    />
                    <canvas ref="canvasElement" class="scanner-canvas d-none" />
                    <div v-show="!scanning" class="scanner-placeholder d-flex flex-column align-items-center justify-content-center">
                      <i class="bi bi-camera-video display-1 text-muted" />
                      <p class="text-muted mt-3">
                        Click "Start Camera" to scan QR codes
                      </p>
                    </div>
                  </div>

                  <div v-if="scanResult" class="alert alert-success mt-3" role="alert">
                    <h6 class="mb-2">
                      <i class="bi bi-check-circle me-2" />
                      QR Code Detected!
                    </h6>
                    <div class="scan-result-content">
                      <code class="d-block p-2 bg-light rounded">{{ scanResult }}</code>
                      <div class="d-flex gap-2 mt-2">
                        <button
                          v-ripple
                          class="btn btn-sm btn-primary"
                          @click="useScannedContent"
                        >
                          <i class="bi bi-arrow-up-left me-1" />
                          Use in Generator
                        </button>
                        <button
                          v-ripple
                          class="btn btn-sm btn-outline-secondary"
                          @click="copyScanResult"
                        >
                          <i class="bi bi-clipboard me-1" />
                          Copy
                        </button>
                        <a
                          v-if="isUrl(scanResult)"
                          v-ripple
                          :href="scanResult"
                          target="_blank"
                          class="btn btn-sm btn-outline-primary"
                        >
                          <i class="bi bi-box-arrow-up-right me-1" />
                          Open Link
                        </a>
                      </div>
                    </div>
                  </div>

                  <div v-if="scanError" class="alert alert-danger mt-3" role="alert">
                    <i class="bi bi-exclamation-triangle me-2" />
                    {{ scanError }}
                  </div>
                </div>
              </div>

              <div class="col-lg-6">
                <div v-reveal="{ transform: 'translateX(30px)', delay: 100 }" class="file-scanner-section">
                  <h4 class="mb-4">
                    <i class="bi bi-file-image me-2 text-primary" />
                    Scan from Image File
                  </h4>
                  
                  <div
                    ref="dropZoneRef" 
                    class="drop-zone"
                    :class="{ 'drag-over': isDragOver }"
                    @dragover.prevent="onDragOver"
                    @dragleave.prevent="onDragLeave"
                    @drop.prevent="onFileDrop"
                    @click="fileInput.click()"
                  >
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      class="d-none"
                      @change="onFileSelect"
                    >
                    <i class="bi bi-cloud-upload display-1 text-primary" />
                    <p class="mt-3 mb-1">
                      Drag & drop an image or click to browse
                    </p>
                    <small class="text-muted">Supports PNG, JPG, WebP</small>
                  </div>

                  <div v-if="fileScanResult" class="alert alert-success mt-3" role="alert">
                    <h6 class="mb-2">
                      <i class="bi bi-check-circle me-2" />
                      QR Code Found in Image!
                    </h6>
                    <div class="scan-result-content">
                      <code class="d-block p-2 bg-light rounded">{{ fileScanResult }}</code>
                      <div class="d-flex gap-2 mt-2">
                        <button
                          v-ripple
                          class="btn btn-sm btn-primary"
                          @click="useFileScannedContent"
                        >
                          <i class="bi bi-arrow-up-left me-1" />
                          Use in Generator
                        </button>
                        <button
                          v-ripple
                          class="btn btn-sm btn-outline-secondary"
                          @click="copyFileScanResult"
                        >
                          <i class="bi bi-clipboard me-1" />
                          Copy
                        </button>
                        <a
                          v-if="isUrl(fileScanResult)"
                          v-ripple
                          :href="fileScanResult"
                          target="_blank"
                          class="btn btn-sm btn-outline-primary"
                        >
                          <i class="bi bi-box-arrow-up-right me-1" />
                          Open Link
                        </a>
                      </div>
                    </div>
                  </div>

                  <div v-if="fileScanError" class="alert alert-warning mt-3" role="alert">
                    <i class="bi bi-exclamation-triangle me-2" />
                    {{ fileScanError }}
                  </div>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import QRCode from 'qrcode'
import jsQR from 'jsqr'
import AppCard from '../common/AppCard.vue'

const qrContent = ref('')
const qrSize = ref(256)
const errorCorrectionLevel = ref('M')
const foregroundColor = ref('#000000')
const backgroundColor = ref('#ffffff')
const qrCodeDataUrl = ref('')
const copySuccess = ref(false)

const scanning = ref(false)
const videoElement = ref(null)
const canvasElement = ref(null)
const scannerContainer = ref(null)
const scanResult = ref('')
const scanError = ref('')

const isDragOver = ref(false)
const fileInput = ref(null)
const dropZoneRef = ref(null)
const fileScanResult = ref('')
const fileScanError = ref('')

const templates = [
  { label: 'Website URL', value: 'https://example.com' },
  { label: 'Email', value: 'mailto:user@example.com?subject=Hello&body=Message' },
  { label: 'Phone', value: 'tel:+1234567890' },
  { label: 'SMS', value: 'sms:+1234567890?body=Hello' },
  { label: 'WiFi', value: 'WIFI:T:WPA;S:MyNetwork;P:password123;;' },
  { label: 'vCard', value: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nORG:Company\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD' },
  { label: 'Location', value: 'geo:37.7749,-122.4194' },
  { label: 'Calendar', value: 'BEGIN:VEVENT\nDTSTART:20241201T100000Z\nDTEND:20241201T110000Z\nSUMMARY:Meeting\nDESCRIPTION:Team meeting\nEND:VEVENT' }
]

let animationFrameId = null
let stream = null

const generateQRCode = async () => {
  if (!qrContent.value.trim()) {
    qrCodeDataUrl.value = ''
    return
  }

  try {
    qrCodeDataUrl.value = await QRCode.toDataURL(qrContent.value, {
      width: qrSize.value,
      margin: 2,
      color: {
        dark: foregroundColor.value,
        light: backgroundColor.value
      },
      errorCorrectionLevel: errorCorrectionLevel.value
    })
  } catch (error) {
    console.error('QR Code generation failed:', error)
    qrCodeDataUrl.value = ''
  }
}

const downloadQRCode = () => {
  if (!qrCodeDataUrl.value) return
  
  const link = document.createElement('a')
  link.href = qrCodeDataUrl.value
  link.download = `qr-code-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const copyToClipboard = async () => {
  if (!qrCodeDataUrl.value) return
  
  try {
    const response = await fetch(qrCodeDataUrl.value)
    const blob = await response.blob()
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    copySuccess.value = true
    setTimeout(() => copySuccess.value = false, 3000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const clearContent = () => {
  qrContent.value = ''
  qrCodeDataUrl.value = ''
}

const useTemplate = (template) => {
  qrContent.value = template.value
  generateQRCode()
}

const startScanner = async () => {
  scanError.value = ''
  scanResult.value = ''
  
  try {
    scanning.value = true
    await nextTick()
    
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })
    
    if (videoElement.value) {
      videoElement.value.srcObject = stream
      await videoElement.value.play()
      scanLoop()
    } else {
      throw new Error('Video element not found')
    }
  } catch (error) {
    scanError.value = 'Camera access denied or not available: ' + error.message
    console.error('Camera error:', error)
    scanning.value = false
  }
}

const stopScanner = () => {
  scanning.value = false
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }
  
  if (videoElement.value) {
    videoElement.value.srcObject = null
  }
}

const scanLoop = () => {
  if (!scanning.value || !videoElement.value || !canvasElement.value) return
  
  const video = videoElement.value
  const canvas = canvasElement.value
  
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
      location: true
    })
    
    if (code) {
      scanResult.value = code.data
      stopScanner()
    }
  }
  
  if (scanning.value) {
    animationFrameId = requestAnimationFrame(scanLoop)
  }
}

const useScannedContent = () => {
  if (scanResult.value) {
    qrContent.value = scanResult.value
    generateQRCode()
    scanResult.value = ''
  }
}

const copyScanResult = async () => {
  if (!scanResult.value) return
  
  try {
    await navigator.clipboard.writeText(scanResult.value)
    scanResult.value = ''
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const onDragOver = (e) => {
  e.preventDefault()
  isDragOver.value = true
}

const onDragLeave = (e) => {
  e.preventDefault()
  isDragOver.value = false
}

const onFileDrop = (e) => {
  e.preventDefault()
  isDragOver.value = false
  
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    scanImageFile(file)
  }
}

const onFileSelect = (e) => {
  const file = e.target.files[0]
  if (file && file.type.startsWith('image/')) {
    scanImageFile(file)
  }
  e.target.value = ''
}

const scanImageFile = async (file) => {
  fileScanError.value = ''
  fileScanResult.value = ''
  
  try {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })
    
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    
    const context = canvas.getContext('2d')
    context.drawImage(img, 0, 0)
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
      location: true
    })
    
    URL.revokeObjectURL(img.src)
    
    if (code) {
      fileScanResult.value = code.data
    } else {
      fileScanError.value = 'No QR code found in the image. Try a clearer image or different angle.'
    }
  } catch (error) {
    fileScanError.value = 'Failed to process image: ' + error.message
    console.error('File scan error:', error)
  }
}

const useFileScannedContent = () => {
  if (fileScanResult.value) {
    qrContent.value = fileScanResult.value
    generateQRCode()
    fileScanResult.value = ''
  }
}

const copyFileScanResult = async () => {
  if (!fileScanResult.value) return
  
  try {
    await navigator.clipboard.writeText(fileScanResult.value)
    fileScanResult.value = ''
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const isUrl = (str) => {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

watch(() => qrContent.value, () => {
  generateQRCode()
})

onMounted(() => {
  generateQRCode()
})

onUnmounted(() => {
  stopScanner()
})
</script>

<style scoped>
.divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  border-radius: 2px;
  margin: 20px auto;
  transform-origin: left;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.divider.revealed {
  transform: scaleX(1);
}

.qr-generator-card {
  border-top: 4px solid var(--color-primary);
}

.generator-section,
.preview-section,
.scanner-section,
.file-scanner-section {
  padding: 0.5rem 0;
}

.qr-preview {
  min-height: 300px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 2rem;
}

.qr-code-container {
  display: inline-block;
  padding: 1rem;
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.qr-code-image {
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.qr-placeholder {
  text-align: center;
  color: var(--color-muted);
}

.qr-placeholder p {
  margin: 0;
}

.form-control-color {
  height: 48px;
  padding: 0.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.form-control-color::-webkit-color-swatch-wrapper {
  padding: 0;
}

.form-control-color::-webkit-color-swatch {
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.form-range::-webkit-slider-thumb {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
}

.form-range::-moz-range-thumb {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  border: none;
}

.scanner-container {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  background: #000;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: rotateY(180deg);
}

.scanner-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.scanner-placeholder {
  width: 100%;
  height: 100%;
  color: var(--color-muted);
}

.scan-result-content code {
  font-size: 0.875rem;
  word-break: break-all;
  max-height: 150px;
  overflow-y: auto;
}

.drop-zone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--color-surface);
}

.drop-zone:hover,
.drop-zone.drag-over {
  border-color: var(--color-primary);
  background: rgba(14, 165, 233, 0.05);
}

.drop-zone i {
  transition: transform 0.3s ease;
}

.drop-zone:hover i,
.drop-zone.drag-over i {
  transform: translateY(-4px);
}

@media (max-width: 991.98px) {
  .qr-preview {
    min-height: 250px;
  }
  
  .scanner-container {
    aspect-ratio: 16/9;
  }
}

@media (prefers-reduced-motion: reduce) {
  .form-control-color,
  .form-range,
  .btn,
  .drop-zone,
  .drop-zone i {
    transition-duration: 0.01ms !important;
  }
}
</style>