import { ImageResponse } from 'next/og';
import { getCategoryBySlug, getAlternativesByCategory } from '@/lib/mongodb/queries';

export const runtime = 'nodejs';
export const alt = 'Open Source Category';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  let name = 'Category';
  let description = 'Open source alternatives';
  let count = 0;

  try {
    const [category, alternatives] = await Promise.all([
      getCategoryBySlug(params.slug),
      getAlternativesByCategory(params.slug),
    ]);
    if (category) {
      name = category.name;
      description = category.description || `Discover open source ${name} alternatives`;
    }
    count = alternatives.length;
  } catch (e) {
    // Use defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
          backgroundColor: '#0D0D0D', padding: '60px',
          backgroundImage: 'radial-gradient(circle at 75% 25%, #1C1C1C 0%, transparent 50%)',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'linear-gradient(rgba(62, 207, 142, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(62, 207, 142, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px', display: 'flex',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '60px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '44px', height: '44px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #3ECF8E 0%, #30A46C 100%)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
              </svg>
            </div>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#666' }}>
              OPEN_SRC<span style={{ color: '#3ECF8E' }}>.ME</span>
            </span>
          </div>

          <div style={{ fontSize: '20px', color: '#3ECF8E', fontWeight: 600, marginBottom: '12px', display: 'flex' }}>
            CATEGORY
          </div>

          <div style={{ fontSize: '56px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px', marginBottom: '20px', display: 'flex' }}>
            {name} Open Source Alternatives
          </div>

          <div style={{ fontSize: '24px', color: '#A0A0A0', lineHeight: 1.4, marginBottom: '30px', maxWidth: '900px', display: 'flex' }}>
            {description.slice(0, 150)}
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', padding: '10px 20px', borderRadius: '999px',
            backgroundColor: 'rgba(62, 207, 142, 0.1)', border: '1px solid rgba(62, 207, 142, 0.3)',
            alignSelf: 'flex-start',
          }}>
            <span style={{ fontSize: '18px', color: '#3ECF8E', fontWeight: 600 }}>{count} alternatives</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
          <span style={{ fontSize: '18px', color: '#666' }}>opensrc.me/categories/{params.slug}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
