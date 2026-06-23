export interface Artwork {
  id: number
  title: string
  artist: string
  year: string
  medium: string
  dimensions: string
  price: number
  description: string
  image: string
}

export const artworks: Artwork[] = [
  {
    id: 1,
    title: "The Opium Dream",
    artist: "Eleanor Blackwood",
    year: "1887",
    medium: "Oil on canvas",
    dimensions: "48 × 36 in",
    price: 4800,
    description:
      "A haunting vision of a reclining figure draped in crimson silks, surrounded by swirling poppies and shadowy phantoms. The interplay of candlelight and deep indigo evokes the liminal space between waking and reverie.",
    image: "https://picsum.photos/seed/opium/600/800",
  },
  {
    id: 2,
    title: "The Last Gaslight",
    artist: "Sebastian Thorne",
    year: "1892",
    medium: "Oil on panel",
    dimensions: "30 × 24 in",
    price: 3600,
    description:
      "A fog-bound London street at dusk, where a single gaslamp casts a warm amber glow upon cobblestones slick with rain. A lone figure with an umbrella fades into the mist, capturing the melancholy of a dying era.",
    image: "https://picsum.photos/seed/gaslight/600/800",
  },
  {
    id: 3,
    title: "Botanical Study No. 7",
    artist: "Clara Whitby",
    year: "1884",
    medium: "Watercolour and gouache",
    dimensions: "22 × 16 in",
    price: 2200,
    description:
      "Meticulously rendered fronds of fern and foxglove, arranged against a cream ground. The delicate washes of verdigris and rose reveal the artist's deep reverence for the hidden geometries of the natural world.",
    image: "https://picsum.photos/seed/botanical/600/800",
  },
  {
    id: 4,
    title: "Medusa in Marble",
    artist: "Eleanor Blackwood",
    year: "1889",
    medium: "Charcoal and chalk on paper",
    dimensions: "36 × 28 in",
    price: 3100,
    description:
      "A study of the Gorgon's severed head, rendered with a Pre-Raphaelite sensibility. Serpents writhe amidst cascading curls, their scales suggested through rapid hatchwork. The eyes hold the tragic knowledge of petrification.",
    image: "https://picsum.photos/seed/medusa/600/800",
  },
  {
    id: 5,
    title: "The Séance Chamber",
    artist: "Sebastian Thorne",
    year: "1895",
    medium: "Oil on canvas",
    dimensions: "54 × 40 in",
    price: 6200,
    description:
      "A dimly lit parlour where a medium in white lace communes with the spirit world. Ethereal wisps of ectoplasm coil about the candelabra, and the faces of the mourners are half-lost in shadow. The clock has stopped at midnight.",
    image: "https://picsum.photos/seed/seance/600/800",
  },
  {
    id: 6,
    title: "Foxglove & Ivy",
    artist: "Clara Whitby",
    year: "1883",
    medium: "Watercolour on vellum",
    dimensions: "18 × 12 in",
    price: 1800,
    description:
      "A close study of foxglove bells intertwined with ivy tendrils, painted with botanical precision. The translucent petals catch the light, and tiny dewdrops cling to each leaf tip as though the plant has just been touched by morning mist.",
    image: "https://picsum.photos/seed/foxglove/600/800",
  },
  {
    id: 7,
    title: "Portrait of a Forgotten Countess",
    artist: "Eleanor Blackwood",
    year: "1891",
    medium: "Oil on canvas",
    dimensions: "42 × 34 in",
    price: 5500,
    description:
      "A full-length portrait of a noblewoman in a velvet gown of deep aubergine, standing before a faded tapestry. Her expression is one of cool detachment, yet a single tear glistens on her cheek — a secret the artist refused to explain.",
    image: "https://picsum.photos/seed/countess/600/800",
  },
  {
    id: 8,
    title: "Nightfall on the Thames",
    artist: "Sebastian Thorne",
    year: "1893",
    medium: "Oil on panel",
    dimensions: "28 × 20 in",
    price: 3400,
    description:
      "The Thames at twilight, with the silhouette of Tower Bridge emerging from a sulphur-coloured sky. Barges drift like ghosts upon the铅-grey water, and the distant glow of the city seems a world away from the solitary rower in the foreground.",
    image: "https://picsum.photos/seed/thames/600/800",
  },
]

export const artists = Array.from(new Set(artworks.map((a) => a.artist)))
