import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'OPEN_SRC.ME - Discover Open Source Alternatives to Proprietary Software';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0D0D0D',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1C1C1C 0%, transparent 50%), radial-gradient(circle at 75% 75%, #181818 0%, transparent 50%)',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(rgba(62, 207, 142, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(62, 207, 142, 0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            display: 'flex',
          }}
        />

        {/* Glow effect behind logo */}
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(62, 207, 142, 0.15) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            zIndex: 10,
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {/* Terminal icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #3ECF8E 0%, #30A46C 100%)',
                boxShadow: '0 0 60px rgba(62, 207, 142, 0.4)',
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
              </svg>
            </div>
            
            {/* Brand name */}
            <div
              style={{
                fontSize: '72px',
                fontWeight: 800,
                letterSpacing: '-2px',
                display: 'flex',
              }}
            >
              <span style={{ color: '#FFFFFF' }}>OPEN_SRC</span>
              <span style={{ color: '#3ECF8E' }}>.ME</span>
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: 500,
              color: '#A0A0A0',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.4,
              display: 'flex',
            }}
          >
            Discover Open Source Alternatives to Proprietary Software
          </div>

          {/* Feature badges */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '24px',
            }}
          >
            {['100+ Tools', 'Self-Hosted', 'Privacy-Focused', 'Free & Open'].map((feature) => (
              <div
                key={feature}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(62, 207, 142, 0.1)',
                  border: '1px solid rgba(62, 207, 142, 0.3)',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#3ECF8E',
                    display: 'flex',
                  }}
                />
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#3ECF8E',
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#3ECF8E',
              display: 'flex',
            }}
          />
          <span
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#666666',
            }}
          >
            opensrc.me
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
