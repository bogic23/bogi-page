
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const CLIENT_ID = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID
const FOLDER_ID = import.meta.env.VITE_GOOGLE_DRIVE_SCORES_FOLDER_ID

const SCOPES = 'https://www.googleapis.com/auth/drive.file'

let tokenClient = null
let accessToken = null

const loadGapi = () => {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google API'))
    document.head.appendChild(script)
  })
}

const loadGis = () => {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
    document.head.appendChild(script)
  })
}

export const initGoogleDrive = async () => {
  await loadGapi()
  await loadGis()

  await new Promise((resolve, reject) => {
    window.gapi.load('client', async () => {
      try {
        await window.gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        })
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  })

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response) => {
      if (response.access_token) {
        accessToken = response.access_token
      }
    },
  })
}

export const getAccessToken = async () => {
  if (accessToken) {
    return accessToken
  }

  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('Token client not initialized'))
      return
    }

    tokenClient.callback = (response) => {
      if (response.access_token) {
        accessToken = response.access_token
        resolve(accessToken)
      } else if (response.error) {
        reject(new Error(response.error))
      }
    }
    tokenClient.requestAccessToken({ prompt: 'consent' })
  })
}

export const uploadPdfToDrive = async (file, metadata = {}) => {
  await getAccessToken()

  const formData = new FormData()
  formData.append('metadata', new Blob([JSON.stringify({
    name: metadata.name || file.name,
    parents: [FOLDER_ID],
    description: metadata.description || '',
    mimeType: 'application/pdf'
  })], { type: 'application/json' }))
  formData.append('file', file)

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,createdTime,modifiedTime,size',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Upload failed')
  }

  return response.json()
}

export const listScoresFromDrive = async () => {
  await getAccessToken()

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType='application/pdf'+and+trashed=false&fields=files(id,name,webViewLink,webContentLink,createdTime,modifiedTime,size)&orderBy=createdTime desc`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to list files')
  }

  const data = await response.json()
  return data.files || []
}

export const deleteScoreFromDrive = async (fileId) => {
  await getAccessToken()

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Delete failed')
  }

  return true
}

export const isGoogleDriveReady = () => {
  return !!accessToken
}

export const revokeAccessToken = () => {
  if (accessToken) {
    fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
      method: 'POST',
    }).catch(() => {})
    accessToken = null
  }
}