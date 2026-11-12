const API_URL = 'http://localhost:4000/api/v1'

export async function registerUser(email, password, name) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // <-- ВОТ ЭТО ДОЛЖНО БЫТЬ ВЕЗДЕ
    body: JSON.stringify({ email, password, name })
  })
  return res.json()
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // <-- ВОТ ЭТО ДОЛЖНО БЫТЬ ВЕЗДЕ
    body: JSON.stringify({ email, password })
  })
  return res.json()
}

export async function getMe() {
  const res = await fetch(`${API_URL}/me`, {
    credentials: 'include' // <-- ВОТ ЭТО ДОЛЖНО БЫТЬ ВЕЗДЕ
  })
  return res.json()
}

export async function logoutUser() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include' // <-- ВОТ ЭТО ДОЛЖНО БЫТЬ ВЕЗДЕ
  })
  return res.json()
}

export async function updateAvatar(avatar) {
  const res = await fetch(`${API_URL}/me/avatar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // <-- ВОТ ЭТО ДОЛЖНО БЫТЬ ВЕЗДЕ
    body: JSON.stringify({ avatar })
  })
  return res.json()
}

export async function getFavorites() {
  const res = await fetch(`${API_URL}/me/favorites`, { credentials: 'include' })
  return res.json()
}

export async function addFavorite(routeId) {
  const res = await fetch(`${API_URL}/me/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ routeId })
  })
  return res.json()
}

export async function removeFavorite(routeId) {
  const res = await fetch(`${API_URL}/me/favorites`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ routeId })
  })
  return res.json()
}

export async function updateName(name) {
  const res = await fetch(`${API_URL}/me/name`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name })
  })
  return res.json()
}

export async function updatePassword(oldPassword, newPassword) {
  const res = await fetch(`${API_URL}/me/password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ oldPassword, newPassword })
  })
  return res.json()
}

export async function getReviews(routeId) {
  const res = await fetch(`${API_URL}/routes/${routeId}/reviews`, { credentials: 'include' })
  return res.json()
}

export async function addReview(routeId, rating, text) {
  const res = await fetch(`${API_URL}/routes/${routeId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ rating, text })
  })
  return res.json()
}

export async function toggleLike(reviewId) {
  const res = await fetch(`${API_URL}/reviews/${reviewId}/like`, {
    method: 'POST',
    credentials: 'include'
  })
  return res.json()
}

export async function getAllRatings() {
  const res = await fetch(`${API_URL}/routes/ratings`, { credentials: 'include' })
  return res.json()
}

export async function getMyReviews() {
  const res = await fetch(`${API_URL}/me/reviews`, { credentials: 'include' })
  return res.json()
}

export async function getUserFavorites(userId) {
  const res = await fetch(`${API_URL}/users/${userId}/favorites`, { credentials: 'include' })
  return res.json()
}

export async function getUserReviews(userId) {
  const res = await fetch(`${API_URL}/users/${userId}/reviews`, { credentials: 'include' })
  return res.json()
}

export async function deleteReview(reviewId) {
  const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  return res.json()
}