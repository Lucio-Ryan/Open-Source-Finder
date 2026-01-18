import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Policy } from '@/lib/mongodb/models';

// Force dynamic rendering to access MongoDB at runtime
export const dynamic = 'force-dynamic';

async function getPolicy() {
  try {
    await connectToDatabase();
    const policy = await Policy.findOne({ type: 'refund' });
    if (!policy) return null;
    return {
      id: policy._id.toString(),
      type: policy.type,
      title: policy.title,
      content: policy.content,
      updated_at: policy.updated_at,
      created_at: policy.created_at
    };
  } catch (error) {
    console.error('Error fetching refund policy:', error);
    return null;
  }
}

export const metadata: Metadata = {
  title: 'Refund Policy | Open-Source Finder',
  description: 'Refund Policy for Open-Source Finder - Learn about our refund terms and conditions.',
};

export default async function RefundPage() {
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
              <h1 className="text-3xl font-bold text-white mb-4">Refund Policy</h1>
              <p className="text-muted">Refund policy content is currently being updated.</p>
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
