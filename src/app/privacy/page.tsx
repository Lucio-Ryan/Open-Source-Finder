import { Metadata } from 'next';

async function getPolicy() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/policies/privacy`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch policy');
    return await response.json();
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return null;
  }
}

export const metadata: Metadata = {
  title: 'Privacy Policy | Open-Source Finder',
  description: 'Privacy Policy for Open-Source Finder - Learn how we collect, use, and protect your information.',
};

export default async function PrivacyPage() {
  const policy = await getPolicy();

  return (
    <div className="min-h-screen bg-dark py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-lighter rounded-xl border border-border p-8">
          {policy ? (
            <div 
              className="prose prose-invert prose-headings:text-white prose-p:text-muted prose-li:text-muted prose-strong:text-white max-w-none"
              dangerouslySetInnerHTML={{ __html: policy.content }}
            />
          ) : (
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-white mb-4">Privacy Policy</h1>
              <p className="text-muted">Privacy policy content is currently being updated.</p>
            </div>
          )}
          <div className="mt-8 pt-8 border-t border-border text-sm text-muted">
            {policy?.updated_at && (
              <p>Last updated: {new Date(policy.updated_at).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
