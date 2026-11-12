import { useEffect, useMemo, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import './App.css'
import maplibreWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { registerUser, loginUser, getMe, logoutUser, updateAvatar, getFavorites, addFavorite, removeFavorite, updateName, updatePassword, getReviews, addReview, toggleLike, getAllRatings, getMyReviews, getUserFavorites, getUserReviews, deleteReview } from './api'

maplibregl.setWorkerUrl(maplibreWorker)

const routes = [
  {
    id: 'kamchatka',
    name: 'Камчатка: Вулкан Авачинский',
    place: 'Петропавловск-Камчатский',
    region: 'Камчатский край',
    type: 'Горный',
    difficulty: 'Сложный',
    distance: 'Определяется по GPS-треку',
    distanceKm: 0,
    duration: '8 ч',
    durationHours: 8,
    elevation: 'Уточняется по GPS-треку',
    season: 'Июль - Сентябрь',
    coords: [[158.8306, 53.2553]],
    description: 'Маршрут к одному из самых доступных действующих вулканов Камчатки. Подъём на Авачинский вулкан (2741 м) — это незабываемое приключение с видами на океан и другие вулканы.',
    tips: ['Обязательно зарегистрируй маршрут в МЧС.', 'Погода меняется моментально, возьми теплую одежду.', 'Соблюдай технику безопасности на склонах.'],
    packing: ['Трекинговая обувь.', 'Теплая одежда.', 'Запас воды и еды.', 'Аптечка.'],
    image: 'images/kamchatka.jpg'
  },
  {
    id: 'west-caucasus',
    name: 'Западный Кавказ: Плато Лаго-Наки',
    place: 'Лаго-Наки',
    region: 'Адыгея',
    type: 'Горный',
    difficulty: 'Средний',
    distance: 'Определяется по GPS-треку',
    distanceKm: 0,
    duration: '5 ч',
    durationHours: 5,
    elevation: 'Уточняется по GPS-треку',
    season: 'Май - Октябрь',
    coords: [[39.95, 44.10]],
    description: 'Одно из самых живописных мест Адыгеи. Альпийские луга, горные тропы и виды на Кавказские горы. Маршрут отлично подходит для тех, кто хочет увидеть Кавказ без экстремальных нагрузок.',
    tips: ['Проверь прогноз погоды (в горах часто дожди).', 'Возьми дождевик.', 'Не сходи с маркированных троп.'],
    packing: ['Трекинговая обувь.', 'Дождевик.', 'Вода и перекус.', 'Аптечка.'],
    image: 'images/west-caucasus.jpg'
  },
  {
    id: 'khibiny',
    name: 'Хибины: Перевал Кукисвумчорр',
    place: 'Кировск',
    region: 'Мурманская область',
    type: 'Горный',
    difficulty: 'Средний',
    distance: 'Определяется по GPS-треку',
    distanceKm: 0,
    duration: '6 ч',
    durationHours: 6,
    elevation: 'Уточняется по GPS-треку',
    season: 'Июнь - Сентябрь',
    coords: [[33.60, 67.65]],
    description: 'Пеший маршрут по суровым северным горам Хибины. Тундра, скальные массивы и панорамные виды на Мурманскую область. Идеальное место для тех, кто хочет увидеть Северную природу.',
    tips: ['В Хибинах часто меняется погода, возьми ветровку.', 'Возьми средство от комаров.', 'Соблюдай меры безопасности.'],
    packing: ['Трекинговая обувь.', 'Ветровка.', 'Средство от насекомых.', 'Вода и перекус.'],
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=400&q=80'
  },
  {
    id: 'altai-1',
    name: 'Алтай: Тропа к вершинам',
    place: 'Республика Алтай',
    region: 'Алтай',
    type: 'Горный',
    difficulty: 'Сложный',
    distance: 'Определяется по GPS-треку',
    distanceKm: 0,
    duration: '6 ч',
    durationHours: 6,
    elevation: 'Уточняется по GPS-треку',
    season: 'Лето',
    coords: [[86.20, 50.60]],
    description: 'Высокогорный маршрут по диким местам Республики Алтай. Живописные перевалы, горные реки и панорамные виды на Алтайские горы.',
    tips: ['Возьми теплую одежду.', 'Зарегистрируй маршрут в МЧС.', 'Возьми запас еды.'],
    packing: ['Трекинговая обувь.', 'Теплая одежда.', 'Запас воды и еды.', 'Аптечка.'],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80'
  },
  {
    id: 'altai-2',
    name: 'Алтай: Мультинские озёра',
    place: 'Республика Алтай',
    region: 'Алтай',
    type: 'Горный',
    difficulty: 'Сложный',
    distance: 'Определяется по GPS-треку',
    distanceKm: 0,
    duration: '4 дня',
    durationHours: 96,
    elevation: 'Уточняется по GPS-треку',
    season: 'Июль - Август',
    coords: [[86.20, 50.60]],
    description: 'Многодневный поход к каскаду красивейших Мультинских озёр. Горные тропы, чистейшая вода и виды на Алтайские горы.',
    tips: ['Возьми палатку и спальник.', 'Возьми каяк.', 'Зарегистрируй маршрут в МЧС.', 'Возьми запас еды на 4 дня.'],
    packing: ['Трекинговая обувь.', 'Палатка.', 'Спальник.', 'Запас воды и еды.', 'Аптечка.'],
    image: 'images/altai-2.jpg'
  },
  {
    id: 'ladoga',
    name: 'Ладожские шхеры',
    place: 'Карелия',
    region: 'Республика Карелия',
    type: 'Природный',
    difficulty: 'Средний',
    distance: 'Определяется по GPS-треку',
    distanceKm: 0,
    duration: '9 ч',
    durationHours: 3,
    elevation: 'Уточняется по GPS-треку',
    season: 'Лето',
    coords: [[30.30, 61.30]],
    description: 'Маршрут по живописным шхерам Ладожского озера. Скалистые берега, сосновые леса и crystal-clear вода. Идеальное место для спокойного отдыха на природе.',
    tips: ['Возьми средство от комаров.', 'Возьми каяк.', 'Надень удобную обувь для каменистых берегов.', 'Проверь прогноз погоды (на Ладоге ветрено).'],
    packing: ['Трекинговая обувь.', 'Ветровка.', 'Средство от насекомых.', 'Вода и перекус.'],
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&q=80'
  },
  {
    id: 'karelia',
    name: 'Карельские леса',
    place: 'Карелия',
    region: 'Республика Карелия',
    type: 'Природный',
    difficulty: 'Лёгкий',
    distance: 'Определяется по GPS-треку',
    distanceKm: 0,
    duration: '2 ч',
    durationHours: 2,
    elevation: 'Уточняется по GPS-треку',
    season: 'Лето',
    coords: [[32.50, 63.00]],
    description: 'Тихий лесной маршрут по сосновым борам Карелии. Многочисленные озёра, мхи и тишина северной природы.',
    tips: ['Остерегайтесь клещей (обработайте одежду).', 'Возьмите с собой воду.', 'Не сходите с тропы.'],
    packing: ['Удобная обувь.', 'Средство от клещей.', 'Вода и перекус.'],
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80'
  },
  {
    id: 'stolby',
    name: 'Красноярские Столбы',
    place: 'Красноярск',
    region: 'Красноярский край',
    type: 'Природный',
    difficulty: 'Средний',
    distance: 'Определяется по GPS-треку',
    distanceKm: 0,
    duration: '4 ч',
    durationHours: 4,
    elevation: 'Уточняется по GPS-треку',
    season: 'Лето',
    coords: [[92.85, 55.98]],
    description: 'Знаменитый природный парк в сибирской тайге. Маршрут проходит мимо уникальных скальных массивов (Столбов), с потрясающими видами на окрестности и сибирскую природу.',
    tips: ['Надень удобную трекинговую обувь.', 'Возьми запас воды (на маршруте есть родники, но лучше иметь с собой).', 'Не сходи с оборудованных троп, чтобы не повредить природу.', 'Проверь прогноз погоды перед выходом.'],
    packing: ['Трекинговая обувь.', 'Ветровка.', 'Запас воды и перекус.', 'Телефон с GPS.', 'Аптечка.'],
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&q=80'
  },
  {
    id: 'torzhok',
    name: 'Торжок: Древняя Русь',
    place: 'Торжок',
    region: 'Тверская область',
    type: 'Исторический',
    difficulty: 'Лёгкий',
    distance: 'Определяется по GPS-треку',
    distanceKm: 0,
    duration: '1 ч 30 мин',
    durationHours: 1.5,
    elevation: 'Уточняется по GPS-треку',
    season: 'Круглый год',
    coords: [[34.9622, 57.0436]],
    description: 'Пешеходная прогулка по историческому центру Торжка. Вы увидите древний Новоторжский кремль, величественный Борисоглебский монастырь, старинные купеческие усадьбы и знаменитую архитектуру города.',
    tips: ['Удобные кроссовки для прогулки по историческим улицам.', 'Возьмите с собой фотоаппарат (архитектура очень красивая).', 'Загляните в местные кафе, чтобы попробовать пожарские котлеты.'],
    packing: ['Городская одежда по погоде.', 'Бутылка воды.', 'Фотоаппарат.'],
    image: 'tor.jpg'
  },
  {
    id: 'valdai',
    name: 'Большая Валдайская тропа',
    place: 'Валдай',
    region: 'Новгородская область',
    type: 'Природный',
    difficulty: 'Средний',
    distance: 'Определяется по GPS-треку',
    distanceKm: 0,
    duration: '4 ч',
    durationHours: 4,
    elevation: 'Уточняется по GPS-треку',
    season: 'Лето',
    coords: [[33.249497, 57.921691]],
    description: 'Маршрут по живописным местам Валдайского национального парка. Лесные тропы, чистые озёра и нетронутая природа Новгородской области. Отличный вариант для спокойного похода выходного дня.',
    tips: ['Проверь прогноз погоды перед выходом.', 'Возьми запас питьевой воды.', 'Надень удобную трекинговую обувь.', 'Возьми средство от насекомых (особенно летом).'],
    packing: ['Трекинговая обувь.', 'Ветровлагозащитная одежда.', 'Запас воды и перекус.', 'Телефон с GPS и пауэрбанк.', 'Аптечка.'],
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80'
  },
  {
    id: 'tver-city',
    name: 'Тверь: Сквозь века',
    place: 'Тверь',
    region: 'Тверская область',
    type: 'Исторический',
    difficulty: 'Лёгкий',
    distance: 'Определяется по GPS-треку',
    distanceKm: 0,
    duration: '2 ч 30 мин',
    durationHours: 2.5,
    elevation: 'Уточняется по GPS-треку',
    season: 'Круглый год',
    coords: [[35.9180617, 56.8448766]],
    description: 'Пешеходная прогулка по историческому центру Твери. Вы увидите Путевой дворец Екатерины II, прогуляетесь по тенистому Городскому саду, пройдете по пешеходной Трехсвятской улице, увидите памятник Михаилу Кругу, перейдете Волгу по Староволжскому мосту и закончите у Обелиска Победы.',
    tips: ['Удобные кроссовки для прогулки по брусчатке.', 'Возьмите с собой воду.', 'Лучше начинать маршрут с Путевого дворца.', 'На Трехсвятской много кафе, где можно передохнуть.'],
    packing: ['Городская одежда по погоде.', 'Фотоаппарат.', 'Бутылка воды.'],
    image: 'tver.jfif'
  },
  {
    id: 'kurshskaya-kosa',
    name: 'Балтийский берег',
    place: 'Рыбачий',
    region: 'Калининградская область',
    type: 'Природный',
    difficulty: 'Лёгкий',
    distance: 'Определяется по GPS-треку',
    distanceKm: 0,
    duration: '1 ч 30 мин',
    durationHours: 1.5,
    elevation: 'Уточняется по GPS-треку',
    season: 'Лето',
    coords: [[20.847278, 55.156275]],
    description: 'Живописный маршрут от посёлка Рыбачий к берегу Балтийского моря. Песчаные дюны, сосновые леса и свежий морской воздух.',
    tips: ['Возьми с собой воду и перекус.', 'Надень удобную обувь для песка.', 'Проверь прогноз погоды (на побережье ветрено).', 'Не сходи с экотропы, чтобы не повредить дюны.'],
    packing: ['Удобная обувь.', 'Ветровка.', 'Головной убор от солнца.', 'Вода и перекус.', 'Аптечка.'],
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80'
  },
  {
    id: 'baikal',
    name: 'Байкальский берег',
    place: 'Байкал',
    region: 'Иркутская область',
    type: 'Водный',
    difficulty: 'Лёгкий',
    distance: '7 км',
    distanceKm: 7,
    duration: '3 ч',
    durationHours: 3,
    elevation: '90 м',
    season: 'Лето',
    coords: [[104.889445, 51.855586]],
    image: 'images/baikal.jpg',
    description: 'Маршрут проходит по живописному берегу озера Байкал. Вас ждут скалистые мысы, чистейшая вода и панорамные виды на самое глубокое озеро в мире.',
    tips: ['Проверь прогноз погоды перед выходом.', 'Возьми запас питьевой воды.', 'Будь осторожен на каменистых участках.', 'Используй GPS-навигацию.'],
    packing: ['Трекинговая обувь.', 'Ветровлагозащитная одежда.', 'Запас воды и перекус.', 'Телефон с GPS и пауэрбанк.', 'Аптечка.']
  },
  {
    id: 'devichi-kosy',
    name: 'Водопад Девичьи косы',
    place: 'Терскол',
    region: 'Кабардино-Балкария',
    type: 'Горный',
    difficulty: 'Средний',
    distance: 'Определяется по GPS-треку',
    distanceKm: 0,
    duration: '3 ч 50 мин',
    durationHours: 3.83,
    elevation: 'Уточняется по GPS-треку',
    season: 'Лето',
    coords: [[42.51183869112447, 43.25776213963786]],
    description: 'Горный маршрут от посёлка Терскол к водопаду Девичьи косы. Путь проходит по живописному ущелью среди горных склонов.',
    tips: ['Проверь прогноз погоды перед выходом.', 'Используй GPS-навигацию.', 'Будь осторожен на каменистых участках.', 'Возьми запас питьевой воды.'],
    packing: ['Трекинговая обувь.', 'Ветровлагозащитная одежда.', 'Запас воды и перекус.', 'Телефон с GPS и пауэрбанк.', 'Аптечка.'],
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&q=80'
  },
  {
    id: 'chuchkhur',
    name: 'Чучхурские водопады',
    place: 'Домбай',
    region: 'Карачаево-Черкесия',
    type: 'Горный',
    difficulty: 'Средний',
    distance: 'Определяется по GPS-треку',
    distanceKm: 0,
    duration: '4 ч',
    durationHours: 4,
    elevation: 'Уточняется по GPS-треку',
    season: 'Лето',
    coords: [[41.698244, 43.265527]],
    description: 'Маршрут от долины Домбая к живописным Чучхурским водопадам и озеру Чучхур. Путь проходит по горным тропам с набором высоты.',
    tips: ['Проверь прогноз погоды перед выходом.', 'Возьми запас питьевой воды.', 'Будь осторожен на каменистых участках.', 'Используй GPS-навигацию.'],
    packing: ['Трекинговая обувь.', 'Ветровлагозащитная одежда.', 'Запас воды и перекус.', 'Телефон с GPS и пауэрбанк.', 'Аптечка.'],
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&q=80'
  },
]

function makePoints(list) {
  return {
    type: 'FeatureCollection',
    features: list.map((route) => ({
      type: 'Feature',
      properties: { id: route.id },
      geometry: { type: 'Point', coordinates: route.coords[0] },
    })),
  }
}

function makeLines() {
  return {
    type: 'FeatureCollection',
    features: routes
      .filter((route) => !['baikal', 'devichi-kosy', 'chuchkhur', 'kurshskaya-kosa', 'tver-city', 'valdai', 'torzhok', 'stolby', 'ladoga', 'karelia', 'kamchatka', 'west-caucasus', 'khibiny', 'altai-1', 'altai-2'].includes(route.id) && route.coords.length >= 2)
      .map((route) => ({
        type: 'Feature',
        properties: { id: route.id },
        geometry: { type: 'LineString', coordinates: route.coords },
      })),
  }
}

function getLineCoordinates(geometry) {
  if (geometry.type === 'LineString') return geometry.coordinates
  if (geometry.type === 'MultiLineString') return geometry.coordinates.flat()
  return []
}

function parseGpx(gpxText, routeId) {
  const parser = new DOMParser()
  const xml = parser.parseFromString(gpxText, 'application/xml')
  if (xml.querySelector('parsererror')) throw new Error('Ошибка GPX')

  const points = Array.from(xml.querySelectorAll('trkpt, rtept'))
    .map((point) => {
      const lon = Number(point.getAttribute('lon'))
      const lat = Number(point.getAttribute('lat'))
      const elevation = Number(point.querySelector('ele')?.textContent)
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null
      return Number.isFinite(elevation) ? [lon, lat, elevation] : [lon, lat]
    })
    .filter(Boolean)

  let coordinates = points.filter((point, index) => {
    if (index === 0) return true
    const previous = points[index - 1]
    return point[0] !== previous[0] || point[1] !== previous[1] || point[2] !== previous[2]
  })

  // Для Торжка убираем замыкание (если последняя точка совпадает с первой)
  if (routeId === 'torzhok' && coordinates.length > 2) {
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    if (Math.abs(first[0] - last[0]) < 0.0001 && Math.abs(first[1] - last[1]) < 0.0001) {
      coordinates.pop(); // Удаляем последнюю точку
    }
  }

  if (coordinates.length < 2) throw new Error('Мало точек в GPX')

  if (routeId === 'kurshskaya-kosa' && coordinates.length > 60) {
    coordinates = coordinates.slice(30)
  }

  const calculateDistance = (pointA, pointB) => {
    const toRadians = (value) => (value * Math.PI) / 180
    const earthRadius = 6371
    const lat1 = toRadians(pointA[1])
    const lat2 = toRadians(pointB[1])
    const deltaLat = toRadians(pointB[1] - pointA[1])
    const deltaLon = toRadians(pointB[0] - pointA[0])
    const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2
    return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  let totalDistance = 0
  let elevationGain = 0
  const elevations = coordinates.map((point) => point[2]).filter(Number.isFinite)

  for (let i = 1; i < coordinates.length; i++) {
    totalDistance += calculateDistance(coordinates[i - 1], coordinates[i])
    const prevElev = coordinates[i - 1][2]
    const currElev = coordinates[i][2]
    if (Number.isFinite(prevElev) && Number.isFinite(currElev)) {
      const diff = currElev - prevElev
      if (diff > 0) elevationGain += diff
    }
  }

  return {
    type: 'Feature',
    properties: {
      id: routeId,
      distanceKm: Number(totalDistance.toFixed(2)),
      elevationGainM: Math.round(elevationGain),
      maxElevationM: elevations.length ? Math.round(Math.max(...elevations)) : null,
      minElevationM: elevations.length ? Math.round(Math.min(...elevations)) : null,
      pointCount: coordinates.length,
    },
    geometry: { type: 'LineString', coordinates },
  }
}

const topPlaces = [
  { id: 1, slug: 'elbrus', name: 'Эльбрус', region: 'Кабардино-Балкария', category: 'Горы', difficulty: 'Сложный', description: 'Высочайшая вершина России. Ледники, панорамные виды и высокогорные маршруты.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', rating: '4.9', coords: [42.44, 43.35] },
  { id: 2, slug: 'baikal', name: 'Озеро Байкал', region: 'Иркутская область', category: 'Озёра', difficulty: 'Средний', description: 'Величественное озеро, скалистые берега и маршруты Большой Байкальской тропы.', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80', rating: '5.0', coords: [104.89, 51.86], routeId: 'baikal' },
  { id: 3, slug: 'dombay', name: 'Домбай', region: 'Карачаево-Черкесия', category: 'Горы', difficulty: 'Средний', description: 'Горные долины, хвойные леса и впечатляющие виды Кавказского хребта.', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80', rating: '4.9', coords: [41.79, 43.29], routeId: 'chuchkhur' },
  { id: 4, slug: 'kurshskaya-kosa', name: 'Куршская коса', region: 'Калининградская область', category: 'Природа', difficulty: 'Лёгкий', description: 'Песчаные дюны, сосновые леса и Балтийское побережье.', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80', rating: '4.8', coords: [20.95, 55.15], routeId: 'kurshskaya-kosa' },
  { id: 5, slug: 'krasnoyarskie-stolby', name: 'Красноярские Столбы', region: 'Красноярский край', category: 'Скалы', difficulty: 'Средний', description: 'Уникальные скальные массивы среди сибирской тайги.', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', rating: '4.9', coords: [92.85, 55.98] },
  { id: 6, slug: 'ladoga', name: 'Ладожские шхеры', region: 'Карелия', category: 'Озёра', difficulty: 'Лёгкий', description: 'Лабиринты островов, скалистые берега и северная природа.', image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&q=80', rating: '4.8', coords: [30.30, 61.30] },
  { id: 7, slug: 'altai', name: 'Алтай', region: 'Республика Алтай', category: 'Горы', difficulty: 'Сложный', description: 'Высокогорные озёра, ледники, долины и дикие горные ландшафты.', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', rating: '5.0', coords: [86.20, 50.60] },
  { id: 8, slug: 'khibiny', name: 'Хибины', region: 'Мурманская область', category: 'Горы', difficulty: 'Сложный', description: 'Суровые северные горы, тундра и бескрайние панорамы.', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=600&q=80', rating: '4.8', coords: [33.60, 67.65] },
  { id: 9, slug: 'karelian-forests', name: 'Карельские леса', region: 'Карелия', category: 'Леса', difficulty: 'Лёгкий', description: 'Сосновые массивы, озёра и уединённые лесные тропы.', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&q=80', rating: '4.7', coords: [32.50, 63.00] },
  { id: 10, slug: 'western-caucasus', name: 'Западный Кавказ', region: 'Краснодарский край', category: 'Горы', difficulty: 'Средний', description: 'Горные перевалы, альпийские луга и живописные ущелья.', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80', rating: '4.8', coords: [38.00, 44.00] },
]



const survivalGuides = [
  { id: 1, title: 'Встреча с медведем', category: 'Животные', image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&q=80', description: 'Что делать, чтобы избежать встречи, и как действовать, если вы столкнулись с хищником.' },
  { id: 2, title: 'Кровотечение', category: 'Медицина', image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&q=80', description: 'Как наложить жгут и остановить кровь до приезда скорой помощи.' },
  { id: 3, title: 'Как развести огонь', category: 'Костёр', image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&q=80', description: 'Виды костров, способы разжигания без спичек и правила безопасности в лесу.' },
  { id: 4, title: 'Переохлаждение', category: 'Медицина', image: 'https://images.unsplash.com/photo-1478827387698-1527781a4887?w=600&q=80', description: 'Как согреться, если промок и замерз, и что нельзя делать при обморожении.' },
  { id: 5, title: 'Ориентирование на местности', category: 'Навигация', image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80', description: 'Как найти стороны света без компаса и ориентироваться по природным признакам.' },
  { id: 6, title: 'Змеиные укусы', category: 'Животные', image: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=600&q=80', description: 'Первая помощь при укусе змеи и как отличить ядовитую змею от безопасной.' },
  { id: 7, title: 'Переломы и вывихи', category: 'Медицина', image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600&q=80', description: 'Как зафиксировать конечность подручными средствами и не навредить пострадавшему.' },
  { id: 8, title: 'Поиск воды', category: 'Вода', image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&q=80', description: 'Как найти воду в лесу, можно ли пить из ручья и как очистить её без фильтра.' },
  { id: 9, title: 'Сооружение укрытия', category: 'Лагерь', image: 'https://images.unsplash.com/photo-1504280387966-2b1e5a2a0a5b?w=600&q=80', description: 'Как построить шалаш или навес из веток, чтобы пережить холодную ночь.' },
  { id: 10, title: 'Подача сигнала SOS', category: 'Спасение', image: 'https://images.unsplash.com/photo-1580481102401-7c3a7cb76ce4?w=600&q=80', description: 'Как привлечь внимание спасателей (костёр, свист, зеркало, знаки).' },
  { id: 11, title: 'Ожоги и солнечные удары', category: 'Медицина', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600&q=80', description: 'Что делать при ожоге от костра и как помочь при тепловом ударе.' },
  { id: 12, title: 'Лесные пожары', category: 'Безопасность', image: 'https://images.unsplash.com/photo-1602986273543-6f4b03fb0d7e?w=600&q=80', description: 'Как выходить из зоны пожара и что делать, если огонь окружил вас.' },
  { id: 13, title: 'Встреча с волками', category: 'Животные', image: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=600&q=80', description: 'Почему нельзя поворачиваться спиной и как отпугнуть стаю.' },
  { id: 14, title: 'Вязание узлов', category: 'Снаряжение', image: 'https://images.unsplash.com/photo-1520408222757-6f9f95d87d5d?w=600&q=80', description: 'Базовые узлы (прямой, восьмерка, булинь), которые нужны в походе.' },
  { id: 15, title: 'Молния и гроза', category: 'Погода', image: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=600&q=80', description: 'Где прятаться в лесу и поле, если началась гроза (и где нельзя).' },
]

function getDistanceLabel(route, gpsStats) {
  const stats = gpsStats[route.id]
  if (stats && Number.isFinite(stats.distanceKm) && stats.distanceKm > 0) return `${stats.distanceKm} км`
  return route.distance
}

function getElevationLabel(route, gpsStats) {
  const stats = gpsStats[route.id]
  if (stats && Number.isFinite(stats.elevationGainM)) return `${stats.elevationGainM} м`
  return route.elevation
}

function getEffectiveDistanceKm(route, gpsStats) {
  const stats = gpsStats[route.id]
  if (stats && Number.isFinite(stats.distanceKm) && stats.distanceKm > 0) return stats.distanceKm
  return route.distanceKm
}

export default function App() {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)
  const [mapReady, setMapReady] = useState(false)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('Все типы')
  const [difficulty, setDifficulty] = useState('Любая')
  const [season, setSeason] = useState('Любой сезон')
  const [distance, setDistance] = useState('Любая')
  const [duration, setDuration] = useState('Любая')
  const [sort, setSort] = useState('По названию')
  const [selectedRouteId, setSelectedRouteId] = useState(null)
  const [panelOpen, setPanelOpen] = useState(true)
  const [detailsRoute, setDetailsRoute] = useState(null)
  const [topOpen, setTopOpen] = useState(false)
  const [gpsStats, setGpsStats] = useState({})
  const [focusPlace, setFocusPlace] = useState(null)
  const gpsStatsRef = useRef({})
  const [currentUser, setCurrentUser] = useState(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [authError, setAuthError] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [avatarHover, setAvatarHover] = useState(false)
  const [profileTab, setProfileTab] = useState('favorites')
  const [favorites, setFavorites] = useState([])
  const [newName, setNewName] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [settingsMsg, setSettingsMsg] = useState({ text: '', type: '' })
  const [reviews, setReviews] = useState([])
  const [newReviewText, setNewReviewText] = useState('')
  const [newReviewRating, setNewReviewRating] = useState(0)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [avgRating, setAvgRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [allRatings, setAllRatings] = useState({})
  const [myReviews, setMyReviews] = useState([])
  const [viewedUser, setViewedUser] = useState(null)
    const [viewedUserFavorites, setViewedUserFavorites] = useState([])
  const [viewedUserReviews, setViewedUserReviews] = useState([])
  const [survivalOpen, setSurvivalOpen] = useState(false)

  useEffect(() => {
    gpsStatsRef.current = gpsStats
  }, [gpsStats])

  useEffect(() => {
    getMe().then(data => {
      if (data.user) {
        setCurrentUser(data.user)
        
        getFavorites().then(favData => {
          if (favData.favorites) setFavorites(favData.favorites)
        })
        
        getMyReviews().then(revData => {
          if (revData.reviews) setMyReviews(revData.reviews)
        })
      }
    }).catch(() => {})
  }, [])

  const filteredRoutes = useMemo(() => {
    const query = search.trim().toLowerCase()
    return routes.filter((route) => {
      const matchesSearch = !query || `${route.name} ${route.place} ${route.region}`.toLowerCase().includes(query)
      const matchesType = type === 'Все типы' || route.type === type
      const matchesDifficulty = difficulty === 'Любая' || route.difficulty === difficulty
      const matchesSeason = season === 'Любой сезон' || route.season === season
      const effectiveDistanceKm = getEffectiveDistanceKm(route, gpsStats)
      const matchesDistance = distance === 'Любая' || (distance === 'До 5 км' && effectiveDistanceKm > 0 && effectiveDistanceKm <= 5) || (distance === '5–10 км' && effectiveDistanceKm > 5 && effectiveDistanceKm <= 10) || (distance === 'Более 10 км' && effectiveDistanceKm > 10)
      const matchesDuration = duration === 'Любая' || (duration === 'До 3 часов' && route.durationHours > 0 && route.durationHours <= 3) || (duration === '3–5 часов' && route.durationHours > 3 && route.durationHours <= 5) || (duration === 'Более 5 часов' && route.durationHours > 5)
      return matchesSearch && matchesType && matchesDifficulty && matchesSeason && matchesDistance && matchesDuration
    })
  }, [search, type, difficulty, season, distance, duration, gpsStats])

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [90, 55],
      zoom: 3.1,
      attributionControl: true,
    })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.on('load', () => {
      map.addSource('route-points', { type: 'geojson', data: makePoints(routes), cluster: true, clusterMaxZoom: 8, clusterRadius: 48 })
      map.addLayer({ id: 'clusters', type: 'circle', source: 'route-points', filter: ['has', 'point_count'], paint: { 'circle-color': '#246849', 'circle-radius': ['step', ['get', 'point_count'], 19, 5, 24, 10, 29], 'circle-stroke-width': 3, 'circle-stroke-color': '#ffffff' } })
      map.addLayer({ id: 'cluster-count', type: 'symbol', source: 'route-points', filter: ['has', 'point_count'], layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 14, 'text-font': ['Open Sans Bold'] }, paint: { 'text-color': '#ffffff' } })
      map.addLayer({ id: 'unclustered-points', type: 'circle', source: 'route-points', filter: ['!', ['has', 'point_count']], paint: { 'circle-color': '#d64c3e', 'circle-radius': 9, 'circle-stroke-width': 3, 'circle-stroke-color': '#ffffff' } })
      map.addSource('route-lines', { type: 'geojson', data: makeLines() })

      const loadGpsTracks = async () => {
        const source = map.getSource('route-lines')
        if (!source) return
        const features = [...makeLines().features]

        // ... (тут идут все твои загрузки GPX, они остаются без изменений)
        try { const res = await fetch('data/tracks/baikal-trail-lisvyanka-bolshoe-goloustnoe.geojson'); if (res.ok) { const data = await res.json(); features.push(...data.features.filter(f => f.geometry && ['LineString', 'MultiLineString'].includes(f.geometry.type)).map(f => ({ ...f, properties: { ...f.properties, id: 'baikal' } }))) } } catch (e) { console.error(e) }
        try { const res = await fetch('data/tracks/altai.gpx'); if (res.ok) { const text = await res.text(); const parsed = parseGpx(text, 'altai-1'); features.push(parsed); setGpsStats(p => ({ ...p, 'altai-1': parsed.properties })); if (parsed.geometry.coordinates.length > 0) { const startPoint = parsed.geometry.coordinates[0]; const routeObj = routes.find(r => r.id === 'altai-1'); if (routeObj) { routeObj.coords = [[startPoint[0], startPoint[1]]]; map.getSource('route-points').setData(makePoints(routes)) } } } } catch (e) { console.error('Ошибка GPX Алтая 1:', e) }
        try { const res = await fetch('data/tracks/altai-2.gpx'); if (res.ok) { const text = await res.text(); const parsed = parseGpx(text, 'altai-2'); features.push(parsed); setGpsStats(p => ({ ...p, 'altai-2': parsed.properties })); if (parsed.geometry.coordinates.length > 0) { const startPoint = parsed.geometry.coordinates[0]; const routeObj = routes.find(r => r.id === 'altai-2'); if (routeObj) { routeObj.coords = [[startPoint[0], startPoint[1]]]; map.getSource('route-points').setData(makePoints(routes)) } } } } catch (e) { console.error('Ошибка GPX Алтая 2:', e) }
        try { const res = await fetch('data/tracks/kamchatka.gpx'); if (res.ok) { const text = await res.text(); const parsed = parseGpx(text, 'kamchatka'); features.push(parsed); setGpsStats(p => ({ ...p, 'kamchatka': parsed.properties })); if (parsed.geometry.coordinates.length > 0) { const startPoint = parsed.geometry.coordinates[0]; const routeObj = routes.find(r => r.id === 'kamchatka'); if (routeObj) { routeObj.coords = [[startPoint[0], startPoint[1]]]; map.getSource('route-points').setData(makePoints(routes)) } } } } catch (e) { console.error('Ошибка GPX Камчатки:', e) }
        try { const res = await fetch('data/tracks/west-caucasus.gpx'); if (res.ok) { const text = await res.text(); const parsed = parseGpx(text, 'west-caucasus'); features.push(parsed); setGpsStats(p => ({ ...p, 'west-caucasus': parsed.properties })); if (parsed.geometry.coordinates.length > 0) { const startPoint = parsed.geometry.coordinates[0]; const routeObj = routes.find(r => r.id === 'west-caucasus'); if (routeObj) { routeObj.coords = [[startPoint[0], startPoint[1]]]; map.getSource('route-points').setData(makePoints(routes)) } } } } catch (e) { console.error('Ошибка GPX Лаго-Наки:', e) }
        try { const res = await fetch('data/tracks/khibiny.gpx'); if (res.ok) { const text = await res.text(); const parsed = parseGpx(text, 'khibiny'); features.push(parsed); setGpsStats(p => ({ ...p, 'khibiny': parsed.properties })); if (parsed.geometry.coordinates.length > 0) { const startPoint = parsed.geometry.coordinates[0]; const routeObj = routes.find(r => r.id === 'khibiny'); if (routeObj) { routeObj.coords = [[startPoint[0], startPoint[1]]]; map.getSource('route-points').setData(makePoints(routes)) } } } } catch (e) { console.error('Ошибка GPX Хибин:', e) }
        try { const res = await fetch('data/tracks/ladoga.gpx'); if (res.ok) { const text = await res.text(); const parsed = parseGpx(text, 'ladoga'); features.push(parsed); setGpsStats(p => ({ ...p, 'ladoga': parsed.properties })); if (parsed.geometry.coordinates.length > 0) { const startPoint = parsed.geometry.coordinates[0]; const routeObj = routes.find(r => r.id === 'ladoga'); if (routeObj) { routeObj.coords = [[startPoint[0], startPoint[1]]]; map.getSource('route-points').setData(makePoints(routes)) } } } } catch (e) { console.error('Ошибка GPX Ладоги:', e) }
        try { const res = await fetch('data/tracks/karelia.gpx'); if (res.ok) { const text = await res.text(); const parsed = parseGpx(text, 'karelia'); features.push(parsed); setGpsStats(p => ({ ...p, 'karelia': parsed.properties })); if (parsed.geometry.coordinates.length > 0) { const startPoint = parsed.geometry.coordinates[0]; const routeObj = routes.find(r => r.id === 'karelia'); if (routeObj) { routeObj.coords = [[startPoint[0], startPoint[1]]]; map.getSource('route-points').setData(makePoints(routes)) } } } } catch (e) { console.error('Ошибка GPX Карелии:', e) }
        try { const res = await fetch('data/tracks/devichi-kosy-terskol.gpx'); if (res.ok) { const text = await res.text(); const parsed = parseGpx(text, 'devichi-kosy'); features.push(parsed); setGpsStats(p => ({ ...p, 'devichi-kosy': parsed.properties })) } } catch (e) { console.error(e) }
        try { const res = await fetch('data/tracks/valdai.gpx'); if (res.ok) { const text = await res.text(); const parsed = parseGpx(text, 'valdai'); features.push(parsed); setGpsStats(p => ({ ...p, 'valdai': parsed.properties })) } } catch (e) { console.error('Ошибка GPX Валдая:', e) }
        try { const res = await fetch('data/tracks/chuchkhur.gpx'); if (res.ok) { const text = await res.text(); const parsed = parseGpx(text, 'chuchkhur'); features.push(parsed); setGpsStats(p => ({ ...p, 'chuchkhur': parsed.properties })) } } catch (e) { console.error(e) }
        try { const res = await fetch('data/tracks/stolby.gpx'); if (res.ok) { const text = await res.text(); const parsed = parseGpx(text, 'stolby'); features.push(parsed); setGpsStats(p => ({ ...p, 'stolby': parsed.properties })); if (parsed.geometry.coordinates.length > 0) { const startPoint = parsed.geometry.coordinates[0]; const routeObj = routes.find(r => r.id === 'stolby'); if (routeObj) { routeObj.coords = [[startPoint[0], startPoint[1]]]; map.getSource('route-points').setData(makePoints(routes)) } } } } catch (e) { console.error('Ошибка GPX Столбов:', e) }
        try { const res = await fetch('data/tracks/torzhok.gpx'); if (res.ok) { const text = await res.text(); const parsed = parseGpx(text, 'torzhok'); features.push(parsed); setGpsStats(p => ({ ...p, 'torzhok': parsed.properties })); if (parsed.geometry.coordinates.length > 0) { const startPoint = parsed.geometry.coordinates[0]; const routeObj = routes.find(r => r.id === 'torzhok'); if (routeObj) { routeObj.coords = [[startPoint[0], startPoint[1]]]; map.getSource('route-points').setData(makePoints(routes)) } } } } catch (e) { console.error('Ошибка GPX Торжка:', e) }
        try { const res = await fetch('data/tracks/kurshskaya-kosa.gpx'); if (res.ok) { const text = await res.text(); const parsed = parseGpx(text, 'kurshskaya-kosa'); features.push(parsed); setGpsStats(p => ({ ...p, 'kurshskaya-kosa': parsed.properties })) } } catch (e) { console.error('Ошибка GPX Куршской косы:', e) }
        try { const res = await fetch('data/tracks/tver.gpx'); if (res.ok) { const text = await res.text(); const parsed = parseGpx(text, 'tver-city'); features.push(parsed); setGpsStats(p => ({ ...p, 'tver-city': parsed.properties })); if (parsed.geometry.coordinates.length > 0) { const startPoint = parsed.geometry.coordinates[0]; const routeObj = routes.find(r => r.id === 'tver-city'); if (routeObj) { routeObj.coords = [[startPoint[0], startPoint[1]]]; map.getSource('route-points').setData(makePoints(routes)) } } } } catch (e) { console.error('Ошибка GPX Твери:', e) }

        if (map.getSource('route-lines')) {
          map.getSource('route-lines').setData({ type: 'FeatureCollection', features })
        }
      }
      loadGpsTracks()

      map.addLayer({ id: 'route-line', type: 'line', source: 'route-lines', filter: ['==', ['get', 'id'], ''], paint: { 'line-color': '#d64c3e', 'line-width': 5, 'line-opacity': 0.9 }, layout: { 'line-join': 'round', 'line-cap': 'round' } })

      map.on('click', 'clusters', (event) => {
        const features = map.queryRenderedFeatures(event.point, { layers: ['clusters'] })
        if (!features.length) return
        const clusterId = features[0].properties.cluster_id
        map.getSource('route-points').getClusterExpansionZoom(clusterId, (error, zoom) => {
          if (!error) map.easeTo({ center: features[0].geometry.coordinates, zoom })
        })
      })

      map.on('click', 'unclustered-points', (event) => {
        const feature = event.features[0]
        const route = routes.find((item) => item.id === feature.properties.id)
        if (!route) return
        const liveGpsStats = gpsStatsRef.current
        const content = document.createElement('div')
        content.className = 'popup-content'
        
        content.innerHTML = `
          <button class="popup-close-btn" id="close-${route.id}">✕</button>
          <img src="${route.image}" class="popup-image" />
          <div class="popup-body">
            <h3>${route.name}</h3>
            <p class="popup-place">${route.place} · ${route.region}</p>
            <div class="popup-stats">
              <span>↔ ${getDistanceLabel(route, liveGpsStats)}</span>
              <span>◷ ${route.duration}</span>
              <span>↑ ${getElevationLabel(route, liveGpsStats)}</span>
            </div>
            <button class="show-route" id="btn-${route.id}">Показать маршрут</button>
          </div>
        `
        
        setTimeout(() => {
          document.getElementById(`close-${route.id}`)?.addEventListener('click', () => {
            const popup = document.querySelector('.maplibregl-popup')
            if (popup) popup.remove()
          })
        }, 0)

        setTimeout(() => {
          document.getElementById(`btn-${route.id}`)?.addEventListener('click', () => {
            setSelectedRouteId(route.id)
            setDetailsRoute(route)
          })
        }, 0)

        new maplibregl.Popup({ offset: 14, maxWidth: '320px', closeButton: false })
          .setLngLat(feature.geometry.coordinates)
          .setDOMContent(content)
          .addTo(map)
      })

      map.on('click', (event) => {
        const features = map.queryRenderedFeatures(event.point, { layers: ['unclustered-points', 'clusters'] })
        if (!features.length) setSelectedRouteId(null)
      })

      for (const layer of ['clusters', 'unclustered-points']) {
        map.on('mouseenter', layer, () => { map.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', layer, () => { map.getCanvas().style.cursor = '' })
      }
      setMapReady(true)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!focusPlace || !mapReady || !mapRef.current) return
    const map = mapRef.current
    if (focusPlace.routeId) {
      setSelectedRouteId(focusPlace.routeId)
      setDetailsRoute(routes.find((r) => r.id === focusPlace.routeId) || null)
    } else {
      map.flyTo({ center: focusPlace.coords, zoom: 9, duration: 1500 })
    }
    setFocusPlace(null)
  }, [focusPlace, mapReady])

  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const source = mapRef.current.getSource('route-points')
    if (source) source.setData(makePoints(filteredRoutes))
    if (selectedRouteId && !filteredRoutes.some((route) => route.id === selectedRouteId)) setSelectedRouteId(null)
  }, [mapReady, filteredRoutes, selectedRouteId])

  useEffect(() => {
    getAllRatings().then(data => {
      if (data.ratings) {
        const ratingsMap = {}
        data.ratings.forEach(r => {
          ratingsMap[r.route_id] = { avg: Number(r.avg_rating).toFixed(1), count: r.count }
        })
        setAllRatings(ratingsMap)
      }
    })
  }, [])

  useEffect(() => {
    if (detailsRoute) {
      setReviewsLoading(true)
      getReviews(detailsRoute.id).then(data => {
        if (data && data.reviews) {
          setReviews(data.reviews)
          setAvgRating(data.avgRating || 0)
          setReviewCount(data.reviewCount || 0)
        }
        setReviewsLoading(false)
      }).catch(err => {
        console.error("Ошибка загрузки отзывов:", err)
        setReviewsLoading(false)
      })
    }
  }, [detailsRoute])

  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const map = mapRef.current
    map.setFilter('route-line', ['==', ['get', 'id'], selectedRouteId || ''])
    if (!selectedRouteId) return
    const route = routes.find((item) => item.id === selectedRouteId)
    if (!route) return

    const fitTrack = (coordinates) => {
      if (!coordinates || coordinates.length < 2) return
      const bounds = new maplibregl.LngLatBounds()
      coordinates.forEach(([lng, lat]) => bounds.extend([lng, lat]))
      map.fitBounds(bounds, { padding: 90, maxZoom: 14, duration: 800 })
    }

    const loadSelectedTrack = async () => {
      try {
        if (selectedRouteId === 'baikal') {
          const res = await fetch('/data/tracks/baikal-trail-lisvyanka-bolshoe-goloustnoe.geojson')
          if (res.ok) {
            const data = await res.json()
            const coords = data.features.filter(f => f.geometry && ['LineString', 'MultiLineString'].includes(f.geometry.type)).flatMap(f => getLineCoordinates(f.geometry))
            fitTrack(coords)
          }
          return
        }

        if (selectedRouteId === 'kamchatka') { const res = await fetch('/data/tracks/kamchatka.gpx'); if (res.ok) fitTrack(parseGpx(await res.text(), 'kamchatka').geometry.coordinates); return }
        if (selectedRouteId === 'west-caucasus') { const res = await fetch('/data/tracks/west-caucasus.gpx'); if (res.ok) fitTrack(parseGpx(await res.text(), 'west-caucasus').geometry.coordinates); return }
        if (selectedRouteId === 'khibiny') { const res = await fetch('/data/tracks/khibiny.gpx'); if (res.ok) fitTrack(parseGpx(await res.text(), 'khibiny').geometry.coordinates); return }
        if (selectedRouteId === 'altai-1') { const res = await fetch('/data/tracks/altai.gpx'); if (res.ok) fitTrack(parseGpx(await res.text(), 'altai-1').geometry.coordinates); return }
        if (selectedRouteId === 'altai-2') { const res = await fetch('/data/tracks/altai-2.gpx'); if (res.ok) fitTrack(parseGpx(await res.text(), 'altai-2').geometry.coordinates); return }
        if (selectedRouteId === 'stolby') { const res = await fetch('/data/tracks/stolby.gpx'); if (res.ok) fitTrack(parseGpx(await res.text(), 'stolby').geometry.coordinates); return }
        if (selectedRouteId === 'ladoga') { const res = await fetch('/data/tracks/ladoga.gpx'); if (res.ok) fitTrack(parseGpx(await res.text(), 'ladoga').geometry.coordinates); return }
        if (selectedRouteId === 'karelia') { const res = await fetch('/data/tracks/karelia.gpx'); if (res.ok) fitTrack(parseGpx(await res.text(), 'karelia').geometry.coordinates); return }
        if (selectedRouteId === 'torzhok') { const res = await fetch('/data/tracks/torzhok.gpx'); if (res.ok) fitTrack(parseGpx(await res.text(), 'torzhok').geometry.coordinates); return }
        if (selectedRouteId === 'devichi-kosy') { const res = await fetch('/data/tracks/devichi-kosy-terskol.gpx'); if (res.ok) fitTrack(parseGpx(await res.text(), 'devichi-kosy').geometry.coordinates); return }
        if (selectedRouteId === 'chuchkhur') { const res = await fetch('/data/tracks/chuchkhur.gpx'); if (res.ok) fitTrack(parseGpx(await res.text(), 'chuchkhur').geometry.coordinates); return }
        if (selectedRouteId === 'kurshskaya-kosa') { const res = await fetch('/data/tracks/kurshskaya-kosa.gpx'); if (res.ok) { const feature = parseGpx(await res.text(), 'kurshskaya-kosa'); fitTrack(feature.geometry.coordinates) } return }
        if (selectedRouteId === 'tver-city') { const res = await fetch('/data/tracks/tver.gpx'); if (res.ok) { const feature = parseGpx(await res.text(), 'tver-city'); fitTrack(feature.geometry.coordinates) } return }
        if (selectedRouteId === 'valdai') { const res = await fetch('/data/tracks/valdai.gpx'); if (res.ok) fitTrack(parseGpx(await res.text(), 'valdai').geometry.coordinates); return }
      } catch (err) { console.error(err) }
    }
    loadSelectedTrack()
  }, [mapReady, selectedRouteId])

  function resetFilters() {
    setSearch(''); setType('Все типы'); setDifficulty('Любая'); setSeason('Любой сезон'); setDistance('Любая'); setDuration('Любая'); setSort('По названию');
  }

  async function handleAuthSubmit(e) {
    e.preventDefault()
    setAuthError('')
    
    try {
      let result
      if (authMode === 'register') {
        result = await registerUser(email, password, name)
      } else {
        result = await loginUser(email, password)
      }

      if (result.error) {
        setAuthError(result.error)
      } else {
        setCurrentUser(result.user)
        setAuthModalOpen(false)
        setEmail('')
        setPassword('')
        setName('')
      }
    } catch (err) {
      setAuthError('Ошибка соединения с сервером')
    }
  }

  async function toggleFavorite(routeId, e) {
    e.stopPropagation()
    if (!currentUser) {
      setAuthModalOpen(true)
      return
    }

    const isFav = favorites.includes(routeId)
    if (isFav) {
      setFavorites(favorites.filter(id => id !== routeId))
      await removeFavorite(routeId)
    } else {
      setFavorites([...favorites, routeId])
      await addFavorite(routeId)
    }
  }

  async function handleUpdateName(e) {
    e.preventDefault()
    setSettingsMsg({ text: '', type: '' })
    if (!newName.trim()) return

    try {
      const res = await updateName(newName)
      if (res.error) {
        setSettingsMsg({ text: res.error, type: 'error' })
      } else {
        setCurrentUser({ ...currentUser, name: res.name })
        setSettingsMsg({ text: 'Имя успешно изменено!', type: 'success' })
        setNewName('')
      }
    } catch (err) {
      setSettingsMsg({ text: 'Ошибка соединения', type: 'error' })
    }
  }

  async function handleUpdatePassword(e) {
    e.preventDefault()
    setSettingsMsg({ text: '', type: '' })
    if (!oldPassword || !newPassword) return

    try {
      const res = await updatePassword(oldPassword, newPassword)
      if (res.error) {
        setSettingsMsg({ text: res.error, type: 'error' })
      } else {
        setSettingsMsg({ text: 'Пароль успешно изменен!', type: 'success' })
        setOldPassword('')
        setNewPassword('')
      }
    } catch (err) {
      setSettingsMsg({ text: 'Ошибка соединения', type: 'error' })
    }
  }

   async function openUserProfile(userId, userName, userAvatar, userDate, userRole) {
    setProfileOpen(false) // Закрываем свой профиль, если он был открыт
    setViewedUser({ id: userId, name: userName, avatar: userAvatar, date: userDate, role: userRole })
    
    try {
      const favData = await getUserFavorites(userId)
      if (favData.favorites) setViewedUserFavorites(favData.favorites)
      
      const revData = await getUserReviews(userId)
      if (revData.reviews) setViewedUserReviews(revData.reviews)
    } catch (e) { console.log(e) }
  }
  async function handleAddReview(e) {
    e.preventDefault()
    if (!currentUser) {
      setAuthModalOpen(true)
      return
    }
    if (!newReviewText.trim()) return

    const res = await addReview(detailsRoute.id, newReviewRating, newReviewText)
    if (res.message) {
      setNewReviewText('')
      const updated = await getReviews(detailsRoute.id)
      if (updated.reviews) {
        setReviews(updated.reviews)
        setAvgRating(updated.avgRating)
        setReviewCount(updated.reviewCount)
      }
      const myUpdated = await getMyReviews()
      if (myUpdated.reviews) setMyReviews(myUpdated.reviews)
    } else if (res.error) {
      alert(res.error)
    }
  }


  async function handleDeleteReview(reviewId) {
    if (!window.confirm('Вы уверены, что хотите удалить этот отзыв?')) return
    const res = await deleteReview(reviewId)
    if (res.message) {
      setReviews(reviews.filter(rev => rev.id !== reviewId))
      const myUpdated = await getMyReviews()
      if (myUpdated.reviews) setMyReviews(myUpdated.reviews)
    } else if (res.error) {
      alert(res.error)
    }
  }


  async function handleLikeReview(reviewId) {
    if (!currentUser) {
      setAuthModalOpen(true)
      return
    }

    setReviews(reviews.map(rev => {
      if (rev.id === reviewId) {
        return {
          ...rev,
          isLiked: !rev.isLiked,
          likes_count: rev.isLiked ? rev.likes_count - 1 : rev.likes_count + 1
        }
      }
      return rev
    }))

    await toggleLike(reviewId)
  }

  async function handleLogout() {
    await logoutUser()
    setCurrentUser(null)
  }

  return (
    <>
      {topOpen && (
        <main className="top-page">
          <header className="top-page-header">
            <button className="top-back-button" onClick={() => setTopOpen(false)}>← Вернуться к карте</button>
            <div className="top-page-title">
              <span>ВЫБОР ВЕРСТЫ</span>
              <h1>TOP-10 России</h1>
              <p>Десять удивительных мест для пеших путешествий</p>
            </div>
            <div className="top-page-count">
              <strong>10</strong>
              <span>мест для открытия</span>
            </div>
          </header>
          <section className="top-page-content">
            <div className="top-page-intro">
              <div><span>РЕДАКЦИЯ ВЕРСТЫ</span><h2>Лучшие места для приключений</h2></div>
              <p>От горных вершин до лесных троп. Выбирай направление для следующего путешествия.</p>
            </div>
            <div className="top-places-grid">
              {topPlaces.map((place) => (
                <article className="top-place-card" key={place.id} onClick={() => { setFocusPlace(place); setTopOpen(false) }}>
                  <div className="top-place-image">
                    <img src={place.image} alt={place.name} />
                    <span className="top-place-number">#{String(place.id).padStart(2, '0')}</span>
                    <span className="top-place-rating">★ {place.rating}</span>
                  </div>
                  <div className="top-place-info">
                    <span className="top-place-category">{place.category}</span>
                    <h3>{place.name}</h3>
                    <p className="top-place-region">↗ {place.region}</p>
                    <p className="top-place-description">{place.description}</p>
                    <div className="top-place-footer">
                      <span>{place.difficulty}</span>
                      <span>ВЕРСТА / TOP-10</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      )}

      {survivalOpen && (
        <main className="top-page">
          <header className="top-page-header">
            <button className="top-back-button" onClick={() => setSurvivalOpen(false)}>← Вернуться к карте</button>
            <div className="top-page-title">
              <span>БЕЗОПАСНОСТЬ В ПОХОДЕ</span>
              <h1>Школа выживания</h1>
              <p>Инструкции, которые могут спасти жизнь</p>
            </div>
                       <div className="top-page-count">
              <strong>15</strong>
              <span>уроков</span>
            </div>
          </header>
          
          <section className="top-page-content">
            <div className="top-page-intro">
              <div><span>ЗНАЙ, ЧТО ДЕЛАТЬ</span><h2>Экстренные ситуации</h2></div>
              <p>Посмотри короткие видеоуроки перед тем, как отправиться в путь.</p>
            </div>
            
            <div className="top-places-grid">
              {survivalGuides.map((guide) => (
                <article 
                  className="top-place-card" 
                  key={guide.id} 
                  onClick={() => alert('Скоро здесь будет видео!')} // <-- Пока просто заглушка для видео
                >
                  <div className="top-place-image">
                    <img src={guide.image} alt={guide.title} />
                    <span className="top-place-number">#{String(guide.id).padStart(2, '0')}</span>
                  </div>
                  <div className="top-place-info">
                    <span className="top-place-category">{guide.category}</span>
                    <h3>{guide.title}</h3>
                    <p className="top-place-description">{guide.description}</p>
                    <div className="top-place-footer">
                      <span>▶ Смотреть видео</span>
                      <span>ВЕРСТА / SAFETY</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      )}


      <main className="versta-app dark-theme" style={{ display: 'flex' }}>
        <header className="topbar">
          <div className="topbar-inner">
            <div className="brand">
              <img className="brand-logo" src="VERSTA-Photoroom.png" alt="Логотип Верста" />
              <div className="brand-text">
                <h1>ВЕРСТА</h1>
                <p>ВЕРСТАЙ СВОЙ ПУТЬ</p>
              </div>
            </div>

              <button 
                className="top-top-button" 
                onClick={() => setSurvivalOpen(true)}
                style={{ marginRight: '10px' }} 
              >
                🏕 Выживание
              </button>

            <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button className="top-top-button" onClick={() => setTopOpen(true)} style={{ marginRight: 'auto' }}>
                ★ TOP-10
              </button>

              {currentUser ? (
                <div 
                  onClick={() => setProfileOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 12px', borderRadius: '30px', background: '#1a241e', border: '1px solid #2a3a30' }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#34d399', color: '#101713', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', overflow: 'hidden', position: 'relative' }}>
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="Аватар" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      currentUser.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>{currentUser.name}</span>
                </div>
              ) : (
                <button onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }} style={{ background: '#34d399', color: '#101713', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                  Войти
                </button>
              )}
            </div>
          </div>
        </header>

        <section className="map-section">
          <div className="map-area">
            <div ref={mapContainer} className="map-container" />
            <div className="map-legend">
              <strong>Карта маршрутов</strong>
              <span>Нажми на круг с числом, чтобы приблизить карту.</span>
              <span>Нажми на точку, чтобы посмотреть маршрут.</span>
            </div>
          </div>

          <aside className={`route-panel ${panelOpen ? '' : 'route-panel-collapsed'}`}>
            <div className="panel-heading">
              <div>
                <h2>Маршруты</h2>
                <p>Поиск и подбор путешествий</p>
              </div>
              <button className="panel-toggle" onClick={() => setPanelOpen(!panelOpen)}>
                {panelOpen ? '›' : '‹'}
              </button>
            </div>

            {panelOpen && (
              <div className="panel-content">
                <label className="field-label" htmlFor="route-search">Поиск</label>
                <input id="route-search" className="panel-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Маршрут, город или регион" />

                <div className="filter-grid">
                  <div><label className="field-label">Тип</label><select value={type} onChange={(e) => setType(e.target.value)}><option>Все типы</option><option>Природный</option><option>Горный</option><option>Водный</option></select></div>
                  <div><label className="field-label">Сложность</label><select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option>Любая</option><option>Лёгкий</option><option>Средний</option><option>Сложный</option></select></div>
                  <div><label className="field-label">Дистанция</label><select value={distance} onChange={(e) => setDistance(e.target.value)}><option>Любая</option><option>До 5 км</option><option>5–10 км</option><option>Более 10 км</option></select></div>
                  <div><label className="field-label">Время</label><select value={duration} onChange={(e) => setDuration(e.target.value)}><option>Любая</option><option>До 3 часов</option><option>3–5 часов</option><option>Более 5 часов</option></select></div>
                  <div className="full-width"><label className="field-label">Сезон</label><select value={season} onChange={(e) => setSeason(e.target.value)}><option>Любой сезон</option><option>Лето</option><option>Зима</option><option>Весна</option><option>Осень</option></select></div>
                </div>

                <div className="list-heading">
                  <div><h3>Найденные маршруты</h3><span>{filteredRoutes.length} из {routes.length}</span></div>
                  <button className="reset-button" onClick={resetFilters}>Сбросить</button>
                </div>
                <label className="field-label" htmlFor="route-sort">Сортировка</label>
                <select id="route-sort" value={sort} onChange={(e) => setSort(e.target.value)}><option>По названию</option><option>Сначала короткие</option><option>Сначала длинные</option></select>

                <div className="route-list">
                  {filteredRoutes.length === 0 ? (
                    <div className="empty-results"><strong>Ничего не найдено</strong><span>Попробуй изменить поиск или фильтры.</span></div>
                  ) : filteredRoutes.map((route) => (
                    <button 
                      key={route.id} 
                      className={`route-list-card ${selectedRouteId === route.id ? 'route-list-card-active' : ''}`} 
                      onClick={() => { setSelectedRouteId(route.id); setDetailsRoute(null); }}
                    >
                      <img src={route.image} alt={route.name} className="route-card-img" />
                      <div className="route-card-content">
                        <span className="route-card-top">
                          <strong>{route.name}</strong>
                          <span className="route-difficulty">{route.difficulty}</span>
                        </span>
                        <span className="route-place">{route.place} · {route.region}</span>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="route-meta">{getDistanceLabel(route, gpsStats)} · {route.duration}</span>
                            {allRatings[route.id] && (
                              <span style={{ color: '#e6a65d', fontSize: '12px', fontWeight: 'bold' }}>
                                ★ {allRatings[route.id].avg}
                              </span>
                            )}
                          </div>
                          
                          <div 
                            onClick={(e) => toggleFavorite(route.id, e)}
                            style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', zIndex: 2 }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.includes(route.id) ? "#d64c3e" : "none"} stroke={favorites.includes(route.id) ? "#d64c3e" : "#8a9c90"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>

        {detailsRoute && (
          <div className="route-details-overlay" onClick={() => setDetailsRoute(null)}>
            <div className="route-details-clean" onClick={(e) => e.stopPropagation()}>
              <button className="route-close-clean" onClick={() => setDetailsRoute(null)}>✕</button>
              
              <div className="route-hero-image">
                <img src={detailsRoute.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'} alt={detailsRoute.name} />
                <div className="route-hero-gradient"></div>
                
                <div className="route-hero-text">
                  <span className="route-badge">МАРШРУТ ВЕРСТЫ</span>
                  <h2>{detailsRoute.name}</h2>
                  <p>{detailsRoute.place} · {detailsRoute.region}</p>
                  
                  {avgRating > 0 && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: '20px', marginTop: '12px', color: '#e6a65d', fontWeight: 'bold' }}>
                      <span>★ {avgRating}</span>
                      <span style={{ color: '#a1b09a', fontSize: '12px', fontWeight: 'normal' }}>({reviewCount} отзывов)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="route-stats-clean">
                <div className="stat-box"><span className="stat-icon">↔</span><strong>{getDistanceLabel(detailsRoute, gpsStats)}</strong><span>Дистанция</span></div>
                <div className="stat-box"><span className="stat-icon">◷</span><strong>{detailsRoute.duration}</strong><span>Время</span></div>
                <div className="stat-box"><span className="stat-icon">↑</span><strong>{getElevationLabel(detailsRoute, gpsStats)}</strong><span>Набор</span></div>
                <div className="stat-box"><span className="stat-icon">◆</span><strong>{detailsRoute.difficulty}</strong><span>Сложность</span></div>
              </div>

              <div className="route-content-clean" style={{ paddingBottom: '60px' }}>
                <div className="info-block">
                  <h3>Об этом маршруте</h3>
                  <p>{detailsRoute.description || `Маршрут «${detailsRoute.name}» расположен в районе «${detailsRoute.place}».`}</p>
                </div>
                <div className="info-block">
                  <h3>Советы перед походом</h3>
                  <ul className="clean-list">
                    {detailsRoute.tips ? detailsRoute.tips.map((tip, i) => <li key={i}>{tip}</li>) : <li>Проверь прогноз погоды.</li>}
                  </ul>
                </div>
                <div className="info-block">
                  <h3>Что взять с собой</h3>
                  <ul className="clean-list">
                    {detailsRoute.packing ? detailsRoute.packing.map((item, i) => <li key={i}>{item}</li>) : <li>Удобную обувь.</li>}
                  </ul>
                </div>

                <div className="route-season-clean">
                  <span>ЛУЧШЕЕ ВРЕМЯ ДЛЯ ПОХОДА</span>
                  <strong>{detailsRoute.season}</strong>
                </div>
              
                {/* ОТЗЫВЫ */}
                <div className="route-info-section" style={{ borderBottom: 'none', marginTop: '10px' }}>
                  <div className="route-section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: '#fff' }}>Отзывы путешественников</h3>
                  </div>
                  <div style={{ background: '#1a241e', padding: '20px', borderRadius: '16px', border: '1px solid #2a3a30', marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '16px' }}>Оставить отзыв</h4>
                    
                    {currentUser ? (
                      <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#a1b09a', fontSize: '13px' }}>Оценка:</span>
                          {[1, 2, 3, 4, 5].map(star => (
                            <span 
                              key={star} 
                              onClick={() => setNewReviewRating(star)}
                              style={{ cursor: 'pointer', fontSize: '28px', lineHeight: 1, color: star <= newReviewRating ? '#e6a65d' : '#34443a', transition: 'color 0.2s' }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <textarea 
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                          placeholder="Поделитесь впечатлениями..."
                          style={{ width: '100%', minHeight: '60px', maxHeight: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #34443a', background: '#101713', color: '#fff', fontFamily: 'inherit', resize: 'none', outline: 'none', fontSize: '13px' }}
                        />
                        <button type="submit" style={{ alignSelf: 'flex-start', padding: '8px 20px', background: '#34d399', color: '#101713', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                          Отправить
                        </button>
                      </form>
                    ) : (
                      <p style={{ color: '#a1b09a', margin: 0, fontSize: '13px' }}>
                        <span style={{ color: '#4ade80', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setAuthModalOpen(true)}>Войдите</span>, чтобы оставить отзыв.
                      </p>
                    )}
                  </div>

                  {reviewsLoading ? (
                    <p style={{ color: '#a1b09a', fontSize: '13px' }}>Загрузка отзывов...</p>
                  ) : reviews.length === 0 ? (
                    <p style={{ color: '#a1b09a', fontSize: '13px' }}>Пока нет отзывов. Будьте первым!</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {reviews.map(review => (
                        <div key={review.id} style={{ background: '#1a241e', padding: '12px', borderRadius: '12px', border: '1px solid #2a3a30' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <div 
                              onClick={() => openUserProfile(review.user_id, review.user_name, review.user_avatar, review.created_at, review.user_role)}
                              style={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%', background: '#34d399', color: '#101713', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden', cursor: 'pointer' }}
                            >
                              {review.user_avatar ? (
                                <img src={review.user_avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                review.user_name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div 
                              onClick={() => openUserProfile(review.user_id, review.user_name, review.user_avatar, review.created_at)}
                              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              {/* Верхняя строка: Ник и MOD */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <strong style={{ color: '#fff', fontSize: '14px', lineHeight: '1' }}>{review.user_name}</strong>
                                
                                {review.user_role === 'admin' && (
                                  <span style={{ 
                                    background: 'rgba(120, 30, 30, 0.4)',
                                    color: '#e57373',
                                    fontSize: '9px', 
                                    fontWeight: '900', 
                                    padding: '2px 4px', 
                                    borderRadius: '3px',
                                    letterSpacing: '0.5px',
                                    lineHeight: '1'
                                  }}>
                                    MOD
                                  </span>
                                )}
                              </div>
                              
                              {/* Нижняя строка: Дата */}
                              <span style={{ color: '#7a8d7e', fontSize: '11px', marginTop: '3px' }}>
                                {new Date(review.created_at).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                            <div style={{ marginLeft: 'auto', color: '#e6a65d', fontSize: '20px', display: 'flex', gap: '2px' }}>
                              {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: i < review.rating ? '#e6a65d' : '#34443a' }}>★</span>
                              ))}
                            </div>
                          </div>
                          
                          <p style={{ color: '#d1dfd4', fontSize: '14px', lineHeight: '1.5', margin: '0 0 10px 0', textAlign: 'left' }}>
                            {review.text}
                          </p>
                          
                          <button 
                            onClick={() => handleLikeReview(review.id)}
                            style={{ background: 'transparent', border: 'none', padding: 0, color: review.isLiked ? '#d64c3e' : '#7a8d7e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={review.isLiked ? "#d64c3e" : "none"} stroke={review.isLiked ? "#d64c3e" : "#7a8d7e"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            {review.likes_count > 0 ? review.likes_count : ''}
                          </button>

                          {/* Кнопка удаления (только для админа) */}
                          {currentUser && currentUser.role === 'admin' && (
                            <button 
                              onClick={() => handleDeleteReview(review.id)}
                              style={{ 
                                background: 'transparent', border: 'none', 
                                color: '#7a8d7e', cursor: 'pointer', 
                                marginLeft: '12px', fontSize: '13px', fontWeight: '600'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#d64c3e'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#7a8d7e'}
                              title="Удалить отзыв"
                            >
                              🗑 Удалить
                            </button>
                          )}

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {authModalOpen && (
          <div className="route-details-overlay" onClick={() => setAuthModalOpen(false)}>
            <div className="route-details-clean" style={{ maxWidth: '400px', padding: '30px' }} onClick={e => e.stopPropagation()}>
              <button className="route-close-clean" onClick={() => setAuthModalOpen(false)}>✕</button>
              
              <h2 style={{ color: '#fff', marginTop: 0 }}>
                {authMode === 'login' ? 'Вход в Версту' : 'Регистрация'}
              </h2>

              {authError && <p style={{ color: '#d64c3e', fontSize: '14px' }}>{authError}</p>}

              <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {authMode === 'register' && (
                  <div>
                    <label className="field-label" style={{ color: '#a1b09a' }}>Ваше имя</label>
                    <input type="text" className="panel-input" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                )}
                
                <div>
                  <label className="field-label" style={{ color: '#a1b09a' }}>Email</label>
                  <input type="email" className="panel-input" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>

                <div>
                  <label className="field-label" style={{ color: '#a1b09a' }}>Пароль</label>
                  <input type="password" className="panel-input" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>

                <button type="submit" className="top-top-button" style={{ marginTop: '10px', background: '#4ade80', color: '#101713', border: 'none' }}>
                  {authMode === 'login' ? 'Войти' : 'Создать аккаунт'}
                </button>
              </form>

              <p style={{ color: '#a1b09a', marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
                {authMode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
                <span 
                  onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}
                  style={{ color: '#3b82f6', fontWeight: '700', cursor: 'pointer', textDecoration: 'none' }}
                >
                  {authMode === 'login' ? 'Зарегистрироваться' : 'Войти'}
                </span>
              </p>
            </div>
          </div>
        )}

        {profileOpen && currentUser && (
          <div className="route-details-overlay" onClick={() => setProfileOpen(false)}>
            <div 
              style={{
                position: 'relative', width: '100%', maxWidth: '750px', maxHeight: '90vh',
                backgroundColor: '#142119', borderRadius: '24px', border: '1px solid #2a3a30',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7)', overflow: 'hidden',
                display: 'flex', flexDirection: 'column'
              }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setProfileOpen(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100, background: '#d64c3e', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
              >
                ✕
              </button>

              <div style={{ display: 'flex', alignItems: 'center', padding: '32px', borderBottom: '1px solid #2a3a30', position: 'relative' }}>
                <label 
                  onMouseEnter={() => setAvatarHover(true)}
                  onMouseLeave={() => setAvatarHover(false)}
                  style={{ display: 'block', width: '100px', height: '100px', minWidth: '100px', borderRadius: '50%', backgroundColor: '#34d399', color: '#101713', position: 'relative', overflow: 'hidden', cursor: 'pointer', border: '3px solid #4ade80', flexShrink: 0 }}
                >
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '40px' }}>
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="Аватар" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      currentUser.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', color: '#fff', opacity: avatarHover ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: 'none' }}>
                    ✎
                  </div>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = async () => {
                        await updateAvatar(reader.result);
                        setCurrentUser({ ...currentUser, avatar: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>

                <div style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
  <h2 style={{ margin: 0, color: '#4ade80', fontSize: '28px', lineHeight: '1', textAlign: 'left' }}>{currentUser.name}</h2>
  
  {/* Плашка MOD */}
  {currentUser.role === 'admin' && (
    <span style={{ 
      background: 'rgba(120, 30, 30, 0.4)', 
      color: '#e57373',                    
      fontSize: '11px', 
      fontWeight: '900', 
      padding: '4px 8px', 
      borderRadius: '4px',
      letterSpacing: '0.5px'
    }}>
      MOD
    </span>
  )}
</div>
                  <p style={{ margin: '0 0 6px 0', color: '#d1dfd4', fontSize: '13px', textAlign: 'left' }}>{currentUser.email}</p>
                  <span style={{ fontSize: '11px', color: '#7a8d7e', textAlign: 'left' }}>
                    В Версте с {new Date(currentUser.created_at || Date.now()).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                <button 
                  onClick={() => setProfileTab('settings')}
                  title="Настройки"
                  style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: '#8a9c90', cursor: 'pointer', padding: '8px', borderRadius: '50%', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a3a30'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8a9c90'; }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', padding: '0 32px', borderBottom: '1px solid #2a3a30' }}>
                {['favorites', 'stats', 'reviews', 'achievements', 'settings'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setProfileTab(tab)}
                    style={{ background: 'transparent', border: 'none', padding: '16px 12px', color: profileTab === tab ? '#4ade80' : '#8a9c90', fontSize: '15px', fontWeight: '600', cursor: 'pointer', borderBottom: profileTab === tab ? '2px solid #4ade80' : '2px solid transparent', transition: 'all 0.2s' }}
                  >
                    {tab === 'favorites' && 'Избранные'}
                    {tab === 'stats' && 'Статистика'}
                    {tab === 'reviews' && 'Мои отзывы'}
                    {tab === 'achievements' && 'Достижения'}
                    {tab === 'settings' && 'Настройки'}
                  </button>
                ))}
              </div>

              <div style={{ padding: '32px', overflowY: 'auto', maxHeight: '400px', minHeight: '150px' }}>
                {profileTab === 'settings' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <h3 style={{ color: '#fff', margin: '0 0 10px 0' }}>Настройки аккаунта</h3>

                    {settingsMsg.text && (
                      <div style={{ padding: '10px', borderRadius: '8px', background: settingsMsg.type === 'error' ? 'rgba(214, 76, 62, 0.2)' : 'rgba(74, 222, 128, 0.2)', border: `1px solid ${settingsMsg.type === 'error' ? '#d64c3e' : '#4ade80'}`, color: settingsMsg.type === 'error' ? '#d64c3e' : '#4ade80', fontSize: '14px' }}>
                        {settingsMsg.text}
                      </div>
                    )}

                    <form onSubmit={handleUpdateName} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ color: '#a1b09a', fontSize: '13px' }}>Изменить имя</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" placeholder="Новое имя" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #2a3a30', background: '#1a241e', color: '#fff', outline: 'none' }} />
                        <button type="submit" style={{ padding: '10px 20px', background: '#34d399', color: '#101713', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Сохранить</button>
                      </div>
                    </form>

                    <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '20px', borderTop: '1px solid #2a3a30' }}>
                      <label style={{ color: '#a1b09a', fontSize: '13px' }}>Изменить пароль</label>
                      <input type="password" placeholder="Старый пароль" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #2a3a30', background: '#1a241e', color: '#fff', outline: 'none' }} />
                      <input type="password" placeholder="Новый пароль" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #2a3a30', background: '#1a241e', color: '#fff', outline: 'none' }} />
                      <button type="submit" style={{ padding: '10px', background: '#e6a65d', color: '#101713', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginTop: '5px' }}>Сменить пароль</button>
                    </form>

                    <div style={{ paddingTop: '20px', borderTop: '1px solid #2a3a30' }}>
                      <button onClick={() => { handleLogout(); setProfileOpen(false); }} style={{ width: '100%', padding: '12px', background: '#d64c3e', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>Выйти из аккаунта</button>
                    </div>
                  </div>
                )}

                {profileTab === 'favorites' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {favorites.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#a8b8ac', padding: '20px' }}><p>У вас пока нет избранных маршрутов.</p></div>
                    ) : (
                      favorites.map(favId => {
                        const route = routes.find(r => r.id === favId)
                        if (!route) return null
                        return (
                          <div key={route.id} onClick={() => { setProfileOpen(false); setSelectedRouteId(route.id); setDetailsRoute(route); }} style={{ display: 'flex', gap: '12px', background: '#1a241e', border: '1px solid #2a3a30', borderRadius: '12px', padding: '10px', cursor: 'pointer', alignItems: 'center' }}>
                            <img src={route.image} alt={route.name} style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <strong style={{ color: '#fff', fontSize: '15px' }}>{route.name}</strong>
                              <span style={{ color: '#8a9c90', fontSize: '12px' }}>{route.place} · {route.region}</span>
                              <span style={{ color: '#4ade80', fontSize: '13px', marginTop: '4px' }}>{getDistanceLabel(route, gpsStats)} · {route.duration}</span>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}

                                {profileTab === 'stats' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div style={{ backgroundColor: '#1a241e', border: '1px solid #2a3a30', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                      <strong style={{ display: 'block', fontSize: '28px', color: '#4ade80', marginBottom: '8px' }}>{favorites.length}</strong>
                      <span style={{ color: '#8a9c90', fontSize: '13px' }}>В избранном</span>
                    </div>
                    <div style={{ backgroundColor: '#1a241e', border: '1px solid #2a3a30', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                      <strong style={{ display: 'block', fontSize: '28px', color: '#4ade80', marginBottom: '8px' }}>{myReviews.length}</strong>
                      <span style={{ color: '#8a9c90', fontSize: '13px' }}>Отзывов</span>
                    </div>
                    <div style={{ backgroundColor: '#1a241e', border: '1px solid #2a3a30', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                      <strong style={{ display: 'block', fontSize: '28px', color: '#4ade80', marginBottom: '8px' }}>{myReviews.reduce((acc, rev) => acc + (rev.likes_count || 0), 0)}</strong>
                      <span style={{ color: '#8a9c90', fontSize: '13px' }}>Лайков</span>
                    </div>
                  </div>
                )}

                {profileTab === 'reviews' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {myReviews.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#a8b8ac', padding: '20px' }}><p>Вы еще не оставляли отзывов.</p></div>
                    ) : (
                      myReviews.map(review => {
                        const route = routes.find(r => r.id === review.route_id)
                        return (
                          <div key={review.id} style={{ background: '#1a241e', border: '1px solid #2a3a30', borderRadius: '12px', padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <strong style={{ color: '#4ade80', cursor: 'pointer' }} onClick={() => { setProfileOpen(false); setSelectedRouteId(review.route_id); setDetailsRoute(route); }}>
                                {route ? route.name : review.route_id}
                              </strong>
                              <span style={{ color: '#e6a65d' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                            </div>
                            <p style={{ color: '#d1dfd4', fontSize: '14px', margin: '0 0 8px 0' }}>{review.text}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#7a8d7e' }}>
                              <span>{new Date(review.created_at).toLocaleDateString('ru-RU')}</span>
                              <span>❤ {review.likes_count}</span>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}

                {profileTab === 'achievements' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div style={{ backgroundColor: '#1a241e', border: '1px solid #2a3a30', borderRadius: '16px', padding: '20px', textAlign: 'center', opacity: 0.5 }}>
                      <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏅</div>
                      <h4 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '16px' }}>Первооткрыватель</h4>
                      <p style={{ margin: 0, color: '#8a9c90', fontSize: '12px' }}>Сохраните первый маршрут</p>
                    </div>
                    <div style={{ backgroundColor: '#1a241e', border: '1px solid #2a3a30', borderRadius: '16px', padding: '20px', textAlign: 'center', opacity: 0.5 }}>
                      <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏔</div>
                      <h4 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '16px' }}>Покоритель гор</h4>
                      <p style={{ margin: 0, color: '#8a9c90', fontSize: '12px' }}>Сохраните 3 горных маршрута</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {viewedUser && (
          <div className="route-details-overlay" onClick={() => setViewedUser(null)} style={{ zIndex: 10000 }}>
            <button onClick={() => setViewedUser(null)} style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100, background: '#d64c3e', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>
              ✕
            </button>

            <div style={{ position: 'relative', width: '100%', maxWidth: '750px', maxHeight: '90vh', backgroundColor: '#142119', borderRadius: '24px', border: '1px solid #2a3a30', boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '32px', borderBottom: '1px solid #2a3a30' }}>
                <div style={{ display: 'block', width: '100px', height: '100px', minWidth: '100px', borderRadius: '50%', backgroundColor: '#34d399', color: '#101713', position: 'relative', overflow: 'hidden', border: '3px solid #4ade80', flexShrink: 0 }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '40px' }}>
                    {viewedUser.avatar ? (
                      <img src={viewedUser.avatar} alt="Аватар" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      viewedUser.name.charAt(0).toUpperCase()
                    )}
                  </div>
                </div>

                <div style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
  <h2 style={{ margin: 0, color: '#4ade80', fontSize: '28px', lineHeight: '1' }}>{viewedUser.name}</h2>
  
  {/* Плашка MOD для чужого профиля */}
  {viewedUser.role === 'admin' && (
    <span style={{ 
      background: 'rgba(120, 30, 30, 0.4)', 
      color: '#e57373',                    
      fontSize: '11px', 
      fontWeight: '900', 
      padding: '4px 8px', 
      borderRadius: '4px',
      letterSpacing: '0.5px'
    }}>
      MOD
    </span>
  )}
</div>
                  <span style={{ fontSize: '13px', color: '#7a8d7e' }}>
                    В Версте с {new Date(viewedUser.date).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', padding: '0 32px', borderBottom: '1px solid #2a3a30' }}>
                {['favorites', 'stats', 'reviews', 'achievements'].map(tab => (
                  <button key={tab} onClick={() => setProfileTab(tab)} style={{ background: 'transparent', border: 'none', padding: '16px 12px', color: profileTab === tab ? '#4ade80' : '#8a9c90', fontSize: '15px', fontWeight: '600', cursor: 'pointer', borderBottom: profileTab === tab ? '2px solid #4ade80' : '2px solid transparent', transition: 'all 0.2s' }}>
                    {tab === 'favorites' && 'Избранные'}
                    {tab === 'stats' && 'Статистика'}
                    {tab === 'reviews' && 'Мои отзывы'}
                    {tab === 'achievements' && 'Достижения'}
                  </button>
                ))}
              </div>

              <div style={{ padding: '32px', overflowY: 'auto', maxHeight: '400px', minHeight: '150px' }}>
                                {profileTab === 'favorites' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {viewedUserFavorites.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#a8b8ac', padding: '20px' }}>
                        <p>У пользователя пока нет избранных маршрутов.</p>
                      </div>
                    ) : (
                      viewedUserFavorites.map(favId => {
                        const route = routes.find(r => r.id === favId)
                        if (!route) return null
                        return (
                          <div key={route.id} onClick={() => { setViewedUser(null); setSelectedRouteId(route.id); setDetailsRoute(route); }} style={{ display: 'flex', gap: '12px', background: '#1a241e', border: '1px solid #2a3a30', borderRadius: '12px', padding: '10px', cursor: 'pointer', alignItems: 'center' }}>
                            <img src={route.image} alt={route.name} style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <strong style={{ color: '#fff', fontSize: '15px' }}>{route.name}</strong>
                              <span style={{ color: '#8a9c90', fontSize: '12px' }}>{route.place} · {route.region}</span>
                              <span style={{ color: '#4ade80', fontSize: '13px', marginTop: '4px' }}>{getDistanceLabel(route, gpsStats)} · {route.duration}</span>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}

                {profileTab === 'stats' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div style={{ backgroundColor: '#1a241e', border: '1px solid #2a3a30', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                      <strong style={{ display: 'block', fontSize: '28px', color: '#4ade80', marginBottom: '8px' }}>{viewedUserFavorites.length}</strong>
                      <span style={{ color: '#8a9c90', fontSize: '13px' }}>В избранном</span>
                    </div>
                    <div style={{ backgroundColor: '#1a241e', border: '1px solid #2a3a30', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                      <strong style={{ display: 'block', fontSize: '28px', color: '#4ade80', marginBottom: '8px' }}>{viewedUserReviews.length}</strong>
                      <span style={{ color: '#8a9c90', fontSize: '13px' }}>Отзывов</span>
                    </div>
                    <div style={{ backgroundColor: '#1a241e', border: '1px solid #2a3a30', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                      <strong style={{ display: 'block', fontSize: '28px', color: '#4ade80', marginBottom: '8px' }}>{viewedUserReviews.reduce((acc, rev) => acc + (rev.likes_count || 0), 0)}</strong>
                      <span style={{ color: '#8a9c90', fontSize: '13px' }}>Лайков</span>
                    </div>
                  </div>
                )}

                {profileTab === 'reviews' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {viewedUserReviews.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#a8b8ac', padding: '20px' }}>
                        <p>Пользователь еще не оставлял отзывов.</p>
                      </div>
                    ) : (
                      viewedUserReviews.map(review => {
                        const route = routes.find(r => r.id === review.route_id)
                        return (
                          <div key={review.id} style={{ background: '#1a241e', border: '1px solid #2a3a30', borderRadius: '12px', padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <strong style={{ color: '#4ade80', cursor: 'pointer' }} onClick={() => { setViewedUser(null); setSelectedRouteId(review.route_id); setDetailsRoute(route); }}>
                                {route ? route.name : review.route_id}
                              </strong>
                              <span style={{ color: '#e6a65d' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                            </div>
                            <p style={{ color: '#d1dfd4', fontSize: '14px', margin: '0 0 8px 0' }}>{review.text}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#7a8d7e' }}>
                              <span>{new Date(review.created_at).toLocaleDateString('ru-RU')}</span>
                              <span>❤ {review.likes_count}</span>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}



// npm run dev
// Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass