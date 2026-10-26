import Icon from "../Icon";

export default function GridIllustration() {
  return (
    <div className="grid-art">
      <div className="grid-art-scroll">
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <span className="art-plus plus-one" aria-hidden="true">
          +
        </span>
        <span className="art-plus plus-two" aria-hidden="true">
          +
        </span>
        <div className="art-label label-solar">
          <span className="label-dot" /> Production solaire{" "}
          <Icon name="solar" size={15} />
        </div>
        <div className="art-label label-storage">
          <span className="label-dot" /> Stockage intelligent{" "}
          <Icon name="equipment" size={15} />
        </div>
        <div className="art-label label-building">
          <span className="label-dot" /> Bâtiments connectés{" "}
          <Icon name="place" size={15} />
        </div>
        <svg
          className="energy-scene"
          viewBox="0 0 650 570"
          role="img"
          aria-labelledby="grid-title grid-desc"
        >
          <title id="grid-title">Un réseau, toutes les énergies</title>
          <desc id="grid-desc">
            Installation solaire, batterie et bâtiments reliés à un réseau
            électrique intelligent, en vue isométrique.
          </desc>
          <defs>
            <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#f4f8eb" />
              <stop offset="1" stopColor="#c5d6ac" />
            </linearGradient>
            <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#367061" />
              <stop offset="1" stopColor="#102f29" />
            </linearGradient>
            <linearGradient id="tower">
              <stop stopColor="#f8f9ed" />
              <stop offset="1" stopColor="#c1d0b4" />
            </linearGradient>
            <linearGradient id="battery" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#dfff8c" />
              <stop offset="1" stopColor="#8dc94b" />
            </linearGradient>
            <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow
                dx="0"
                dy="18"
                stdDeviation="14"
                floodColor="#1e402e"
                floodOpacity=".15"
              />
            </filter>
            <pattern
              id="windows"
              width="24"
              height="29"
              patternUnits="userSpaceOnUse"
            >
              <rect x="5" y="7" width="10" height="16" rx="1" fill="#4c7766" />
              <rect x="6" y="8" width="3" height="14" fill="#90b59b" />
            </pattern>
          </defs>
          <g filter="url(#shadow)">
            <path
              d="m48 333 284-164 278 161v24L328 519 48 356Z"
              fill="#8fa586"
            />
            <path d="m48 333 284-164 278 161-282 165Z" fill="url(#ground)" />
            <path
              d="m71 333 260-150 254 147-258 150Z"
              fill="none"
              stroke="#fff"
              strokeOpacity=".5"
            />
            <g fill="none" stroke="#9eb591" opacity=".5">
              <path d="m119 291 277 164M183 254l278 164M248 216l278 164M112 370l278-164M178 408l278-164M243 446l278-164" />
            </g>
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path
                d="m183 330 81 47 77-44 100 58M341 333v-64"
                stroke="#8ba581"
                strokeWidth="12"
              />
              <path
                d="m183 330 81 47 77-44 100 58M341 333v-64"
                stroke="#f3ffe0"
                strokeWidth="6"
              />
              <path
                className="energy-flow"
                d="m183 330 81 47 77-44 100 58"
                stroke="#75b941"
                strokeWidth="3"
                strokeDasharray="9 24"
              />
              <path
                className="energy-flow"
                d="M341 333v-64"
                stroke="#75b941"
                strokeWidth="3"
                strokeDasharray="9 24"
              />
            </g>
            <g>
              <path
                d="M109 314v30m124-61v30m-74 28v30m123-92v30"
                stroke="#6b826a"
                strokeWidth="7"
              />
              <path
                d="m84 287 125-73 62 50-125 73Z"
                fill="#e2ead8"
                stroke="#eaf2df"
                strokeWidth="5"
              />
              <path
                d="m84 283 125-73 62 50-125 73Z"
                fill="url(#panel)"
                stroke="#6a9d85"
                strokeWidth="2"
              />
              <g fill="none" stroke="#a4c6a4" strokeWidth="1.4">
                <path d="m108 269 62 50m-37-64 62 50m-37-64 62 50m-37-64 62 50M105 300l125-73m-104 90 125-73" />
              </g>
              <path
                d="m137 341 125-73 36 29-125 73Z"
                fill="url(#panel)"
                stroke="#b5cda7"
                strokeWidth="3"
              />
              <g fill="none" stroke="#9dbd9c">
                <path d="m161 327 36 29m-11-43 36 29m-11-43 36 29m-11-43 36 29m-119 31 125-73" />
              </g>
            </g>
            <g>
              <path d="m329 173 61-35 61 35v141l-61 36-61-36Z" fill="#8da58a" />
              <path d="m329 173 61 35v142l-61-36Z" fill="url(#tower)" />
              <path d="m390 208 61-35v141l-61 36Z" fill="#aec3a5" />
              <path d="m329 173 61-35 61 35-61 35Z" fill="#f2f6e8" />
              <path d="m339 173 51-29 51 29-51 29Z" fill="#c3d2b5" />
              <path d="M341 191v105l37 21V213Z" fill="url(#windows)" />
              <path d="M403 213v115l35-20V193Z" fill="url(#windows)" />
              <path d="m442 265 48-28 48 28v92l-48 28-48-28Z" fill="#a2b99a" />
              <path d="m442 265 48 28v92l-48-28Z" fill="#e8efdd" />
              <path d="m442 265 48-28 48 28-48 28Z" fill="#f5f8ed" />
              <path d="m450 266 40-23 40 23-40 23Z" fill="#759b70" />
              <path d="M450 283v61l31 18v-62Z" fill="url(#windows)" />
              <path d="M501 299v64l27-16v-64Z" fill="url(#windows)" />
            </g>
            <g>
              <path d="m278 235 39-23 48 28v87l-39 23-48-28Z" fill="#537a43" />
              <path d="m278 235 48 28v87l-48-28Z" fill="url(#battery)" />
              <path d="m278 235 39-23 48 28-39 23Z" fill="#edffc4" />
              <path d="m326 263 39-23v87l-39 23Z" fill="#80a85a" />
              <path d="m294 228 15-9 28 16-15 9Z" fill="#a4c980" />
              <path d="m306 268-17 18 14 8-4 19 18-21-14-8Z" fill="#31552e" />
              <path
                d="m336 277 19-11m-19 20 19-11m-19 20 19-11"
                stroke="#c4ed91"
                strokeWidth="3"
              />
            </g>
            <g fill="#426e49">
              <path
                d="M554 341v28M242 400v28M101 366v23"
                stroke="#637e50"
                strokeWidth="4"
              />
              <ellipse cx="554" cy="333" rx="15" ry="24" />
              <ellipse cx="242" cy="395" rx="12" ry="20" />
              <ellipse cx="101" cy="360" rx="11" ry="18" />
            </g>
            <ellipse cx="342" cy="334" rx="13" ry="7" fill="#244f35" />
            <ellipse
              className="network-pulse"
              cx="342"
              cy="332"
              rx="7"
              ry="4"
              fill="#c4f76b"
            />
          </g>
        </svg>
        <div className="art-caption">
          <span className="mini-bolt">
            <Icon size={15} />
          </span>
          <span>
            Une énergie.
            <br />
            <strong>Tout un écosystème.</strong>
          </span>
          <span className="caption-line" />
          <span className="caption-index">01 — 05</span>
        </div>
      </div>
    </div>
  );
}
