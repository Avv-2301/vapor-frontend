const paths = {
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  left: "m14 6-6 6 6 6",
  right: "m9 6 6 6-6 6",
  down: "m6 9 6 6 6-6",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  monitor: "M3 3h18v13H3zM8 21h8m-4-5v5",
  laptop: "M5 3h14v13H5zM2 20h20l-3-4H5z",
  gamepad:
    "M7 7h10a4 4 0 0 1 4 3l2 8c.5 3-2 4-4 2l-3-3H8l-3 3c-2 2-4.5 1-4-2l2-8a4 4 0 0 1 4-3ZM5 11h6m-3-3v6m8-3h.01m3 3h.01",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M10 21h4",
  cart: "M3 4h2l2.2 11h11.5l2-8H6m2 12a1 1 0 1 0 0 .1M17 19a1 1 0 1 0 0 .1",
  bag: "M5 8h14l1 13H4L5 8Zm4 0a3 3 0 0 1 6 0",
  qr: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zm4 0h3m-3 4h3v3h-3m-4 0h1",
  trash: "M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6",
  bookmark: "M6 3h12v18l-6-4-6 4z",
  tag: "M20 13 13 20 3 10V3h7l10 10ZM7 7h.01",
  chat: "M3 3h18v14H9l-6 4zM7 8h10M7 12h7",
  mail: "M3 5h18v14H3zM3 5l9 7 9-7",
  send: "m3 3 19 9-19 9 4-9-4-9Zm4 9h15",
  close: "m6 6 12 12M6 18 18 6",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z",
  trophy: "M8 21h8m-4-4v4M7 4h10v6a5 5 0 0 1-10 0V4Zm0 2H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4",
  location: "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  inventory: "M4 4h16v16H4zM8 8h8m-8 4h8m-8 4h5",
  fingerprint: "M12 11a2 2 0 0 0-2 2c0 4-1 6-2 8m4-13a5 5 0 0 0-5 5c0 3-.5 5-1 6m6-11a5 5 0 0 1 5 5c0 3-.5 5-1.5 7M12 3a10 10 0 0 0-10 10m10-6a6 6 0 0 1 6 6m-6 0c0 2-.2 4-.7 6m5.7-4c-.2 1.5-.6 3-1.2 4.3M22 13a10 10 0 0 0-10-10",
  badge: "M12 3 15 5l4 .5.5 4L22 13l-2.5 3.5-.5 4-4 .5-3 2-3-2-4-.5-.5-4L2 13l2.5-3.5.5-4L9 5l3-2Zm-3 10 2 2 4-4",
  bolt: "m13 2-9 12h7l-1 8 10-13h-7l1-7Z",
  medal: "M12 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm-3 0-2 8 5-3 5 3-2-8",
  camera: "M3 7h4l2-3h6l2 3h4v13H3zM12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  video: "M3 6h13v12H3zM16 10l5-3v10l-5-3z",
  book: "M4 4h6a4 4 0 0 1 4 4v12a4 4 0 0 0-4-4H4zM20 4h-2a4 4 0 0 0-4 4v12a4 4 0 0 1 4-4h2z",
  printer: "M6 8V3h12v5M6 17H4V9h16v8h-2m-12-3h12v7H6zM17 11h.01",
  store: "M3 10h18l-2-7H5l-2 7Zm2 0v11h14V10M9 21v-7h6v7M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0",
  flag: "M5 22V4m0 0c6-4 8 4 14 0v11c-6 4-8-4-14 0",
  wallet: "M4 6.5A2.5 2.5 0 0 1 6.5 4H20v16H6.5A2.5 2.5 0 0 1 4 17.5v-11ZM4 7h13m3 4h-5a2 2 0 0 0 0 4h5m-5-2h.01",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6m-6 4h6m-6 4h3",
  shield: "M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Zm-3-11 2 2 4-4",
  hourglass: "M5 3h14M5 21h14M7 3c0 5 5 5 5 9s-5 4-5 9m10-18c0 5-5 5-5 9s5 4 5 9",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4m-4 4v2",
  edit: "m12 20 9-9-4-4-9 9-1 5 5-1ZM15 8l4 4M4 20h4",
  card: "M3 5h18v14H3zM3 10h18m-14 5h4",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  eyeOff: "m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A11 11 0 0 1 12 5c6.4 0 10 7 10 7a14 14 0 0 1-4 4.7M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a10 10 0 0 0 4.2-.9",
  play: "m8 4 12 8-12 8z",
  gift: "M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9C2 9 4 0 9 4l3 5Zm0 0c10 0 8-9 3-5l-3 5Z",
  token: "m12 2 9 5v10l-9 5-9-5V7zM8 9l4-2 4 2v6l-4 2-4-2z",
  profile: "M3 4h18v16H3zM7 8h4v4H7zM14 8h4m-4 4h4M7 16h11",
  smile:
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM8 9h.01M16 9h.01M7 14c3 5 7 5 10 0",
  broadcast: "M3 6h18v15H3zM8 2l4 4 4-4m-6 8 5 3-5 3z",
  globe:
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM2 12h20M12 2c6 6 6 14 0 20-6-6-6-14 0-20Z",
  target:
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0ZM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
  rocket:
    "M14 4l7-2-2 7-8 8-4-4 7-9ZM7 13l-4-1 3-5 5 1m0 9 1 4 5-3-1-5M3 21l4-1-3-3-1 4Zm13-14h.01",
  swords:
    "m3 2 3 1 12 12-3 3L3 6 3 2Zm-1 15 5 5m-3-3 5-5M21 2l-3 1-6 6m5 8 3 3m-1 2 3-5M9 12l-3 3",
  castle: "M3 21V9h4V4h3v5h4V4h3v5h4v12H3ZM9 21v-6h6v6M3 9V4m18 5V4",
  sparkles:
    "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7ZM20 2v4m-2-2h4M3 18v4m-2-2h4",
  skull:
    "M6 16a9 9 0 1 1 12 0v5H6v-5ZM8 10a2 2 0 1 0 0 .1M16 10a2 2 0 1 0 0 .1M10 21v-3m4 3v-3m-3-3 1-2 1 2",
  group:
    "M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM7 21v-4a5 5 0 0 1 10 0v4M3 12a2 2 0 1 0 0-4m18 4a2 2 0 1 1 0-4M1 20v-3c0-2 2-3 4-3m18 6v-3c0-2-2-3-4-3",
  check: "m5 12 4 4L19 6",
  menu: "M3 6h18M3 12h18M3 18h18",
  folder: "M3 6h7l2 2h9v11H3zM3 10h18",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v3m0 14v3m10-10h-3M5 12H2m17.07-7.07-2.12 2.12M7.05 16.95l-2.12 2.12m14.14 0-2.12-2.12M7.05 7.05 4.93 4.93",
  info: "M12 11v6m0-10h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
  cloud: "M7 18a4 4 0 0 1-.4-8A6 6 0 0 1 18 8a5 5 0 0 1 0 10H7Z",
  clock:
    "M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm0-16v6l4 2",
  library: "M4 4h16v16H4zM8 8h8m-8 4h8m-8 4h5",
  download: "M12 3v12m-5-5 5 5 5-5M3 15v6h18v-6",
  checkCircle:
    "M22 11.1V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
};
export default function Icon({ name, size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.gamepad} />
    </svg>
  );
}
