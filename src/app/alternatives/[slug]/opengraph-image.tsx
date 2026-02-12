import { ImageResponse } from 'next/og';
import { getAlternativeBySlug } from '@/lib/mongodb/queries';

export const runtime = 'nodejs';
export const alt = 'Open Source Alternative';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  let name = 'Open Source Alternative';
  let description = 'Discover open source alternatives';
  let stars = 0;
  let license = '';
  let categories: string[] = [];
  let isSelfHosted = false;

  try {
    const alt = await getAlternativeBySlug(params.slug);
    if (alt) {
      name = alt.name;
      description = (alt.short_description || alt.description || '').replace(/<[^>]*>/g, '').slice(0, 120);
      stars = alt.stars || 0;
      license = alt.license || '';
      categories = alt.categories?.map((c: { name: string }) => c.name).slice(0, 3) || [];
      isSelfHosted = alt.is_self_hosted;
    }
  } catch (e) {
    // Use defaults
  }

  const starsText = stars >= 1000 ? `${(stars / 1000).toFixed(1)}k`.replace('.0k', 'k') : stars.toString();

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0D0D0D',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1C1C1C 0%, transparent 50%)',
          padding: '60px',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'linear-gradient(rgba(62, 207, 142, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(62, 207, 142, 0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            display: 'flex',
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px', right: '-100px',
            width: '400px', height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(62, 207, 142, 0.12) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, zIndex: 10 }}>
          {/* Top: Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '44px', height: '44px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #3ECF8E 0%, #30A46C 100%)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
              </svg>
            </div>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#666' }}>
              OPEN_SRC<span style={{ color: '#3ECF8E' }}>.ME</span>
            </span>
          </div>

          {/* Project name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '80px', height: '80px', borderRadius: '16px',
                backgroundColor: 'rgba(62, 207, 142, 0.1)',
                border: '2px solid rgba(62, 207, 142, 0.3)',
                fontSize: '36px', fontWeight: 800, color: '#3ECF8E',
              }}
            >
              {name.charAt(0)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '52px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px' }}>
                {name.length > 25 ? name.slice(0, 25) + '...' : name}
              </span>
            </div>
          </div>

          {/* Description */}
          <div style={{ fontSize: '24px', color: '#A0A0A0', lineHeight: 1.4, marginBottom: '30px', maxWidth: '900px', display: 'flex' }}>
            {description.length > 120 ? description.slice(0, 117) + '...' : description}
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {stars > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '999px',
                backgroundColor: 'rgba(250, 204, 21, 0.1)', border: '1px solid rgba(250, 204, 21, 0.3)',
              }}>
                <span style={{ fontSize: '16px', color: '#FACC15' }}>★ {starsText} stars</span>
              </div>
            )}
            {license && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '999px',
                backgroundColor: 'rgba(62, 207, 142, 0.1)', border: '1px solid rgba(62, 207, 142, 0.3)',
              }}>
                <span style={{ fontSize: '16px', color: '#3ECF8E' }}>{license}</span>
              </div>
            )}
            {isSelfHosted && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '999px',
                backgroundColor: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.3)',
              }}>
                <span style={{ fontSize: '16px', color: '#60A5FA' }}>Self-Hosted</span>
              </div>
            )}
            {categories.map((cat) => (
              <div key={cat} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '999px',
                backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)',
              }}>
                <span style={{ fontSize: '16px', color: '#A855F7' }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
          <span style={{ fontSize: '18px', color: '#666' }}>opensrc.me/alternatives/{params.slug}</span>
          <span style={{ fontSize: '18px', color: '#3ECF8E' }}>Free &amp; Open Source</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
