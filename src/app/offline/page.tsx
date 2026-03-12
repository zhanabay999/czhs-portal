export default function OfflinePage() {
  return (
    <html lang="kk">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            padding: "2rem",
            backgroundColor: "#f9fafb",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: "#003DA5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#003DA5",
              marginBottom: 8,
            }}
          >
            Интернет байланысы жоқ
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#6b7280",
              marginBottom: 24,
              maxWidth: 400,
            }}
          >
            Қосылымыңызды тексеріп, қайта көріңіз
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 24px",
              backgroundColor: "#003DA5",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Қайта көру
          </button>
        </div>
      </body>
    </html>
  );
}
