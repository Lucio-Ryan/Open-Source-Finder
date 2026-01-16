import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { connectToDatabase } from '../src/lib/mongodb/connection';

import { Policy, User } from '../src/lib/mongodb/models';

const policies = [
  {
    type: 'privacy',
    title: 'Privacy Policy',
    content: `<h1>Privacy Policy</h1>
<h2>Effective date</h2>
<p>January 16, 2026</p>

<h2>Introduction</h2>
<p>This Privacy Policy explains how Open-Source Finder ("we", "us", "our") collects, uses, discloses, and protects information when you visit or use our website and services.</p>

<h2>Information We Collect</h2>
<ul>
<li><strong>Account Information:</strong> Name, email address, username, password and other data you provide when creating an account or signing up for newsletters or notifications.</li>
<li><strong>User Submissions:</strong> Project submissions, comments, discussion posts, votes, profile details, and any files or links you upload.</li>
<li><strong>Contact and Support:</strong> Messages, feedback, and communications you send to us.</li>
<li><strong>Technical & Usage Data:</strong> IP address, browser type and version, device identifiers, operating system, pages visited, referrer, timestamps, and other analytics data collected automatically.</li>
<li><strong>Cookies & Similar Technologies:</strong> Cookies, local storage, pixel tags and similar tools used to remember preferences and analyze usage.</li>
<li><strong>Third-Party Data:</strong> Information from third-party services you connect or authenticate with.</li>
</ul>

<h2>How We Use Your Information</h2>
<ul>
<li><strong>Provide Services:</strong> To operate, maintain, and improve the site, features, and user accounts.</li>
<li><strong>Communications:</strong> To send account-related notices, newsletters, updates, and responses to inquiries.</li>
<li><strong>Personalization & UX:</strong> To personalize content, remember preferences, and improve user experience.</li>
<li><strong>Analytics & Improvement:</strong> To analyze site usage, trends, and performance.</li>
<li><strong>Security & Fraud Prevention:</strong> To detect and prevent abuse, spam, and security incidents.</li>
<li><strong>Legal Compliance:</strong> To comply with legal obligations or enforce our terms of service.</li>
</ul>

<h2>Sharing & Disclosure</h2>
<ul>
<li><strong>Service Providers:</strong> We share data with trusted third-party service providers who perform services on our behalf.</li>
<li><strong>Legal Requirements:</strong> We may disclose information to comply with legal processes.</li>
<li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or sale of assets, data may be transferred.</li>
<li><strong>Public Content:</strong> Content you post publicly may be viewable by others and indexed by search engines.</li>
</ul>

<h2>Data Retention</h2>
<p>We retain account and service-related data as long as needed to provide services, comply with legal obligations, resolve disputes, and enforce agreements.</p>

<h2>Your Rights and Choices</h2>
<ul>
<li><strong>Access & Portability:</strong> You may request access to your personal data.</li>
<li><strong>Correction:</strong> You may request correction of inaccurate or incomplete information.</li>
<li><strong>Deletion:</strong> You may request deletion of your account and personal data.</li>
<li><strong>Opt-Out:</strong> You can unsubscribe from marketing emails via links in those emails.</li>
</ul>

<h2>Security</h2>
<p>We use technical and organizational measures to protect your information. However, no internet transmission or electronic storage is 100% secure.</p>

<h2>Children</h2>
<p>The service is not intended for children under 13. We do not knowingly collect personal information from children.</p>

<h2>Contact</h2>
<p>For questions or requests, please contact us at <a href="mailto:opensourcefinder@gmail.com">opensourcefinder@gmail.com</a></p>`,
  },
  {
    type: 'terms',
    title: 'Terms of Service',
    content: `<h1>Terms of Service</h1>
<h2>Effective date</h2>
<p>January 16, 2026</p>

<h2>Introduction</h2>
<p>These Terms of Service ("Terms") govern your access to and use of Open-Source Finder (the "Site"). By accessing or using the Site, you agree to these Terms.</p>

<h2>Eligibility</h2>
<ul>
<li><strong>Minimum Age:</strong> You must be at least 13 years old to use the Site.</li>
<li><strong>Authority:</strong> By using the Site you represent that you have the legal right to enter this agreement.</li>
</ul>

<h2>Accounts</h2>
<ul>
<li><strong>Account Registration:</strong> Some features require an account. You agree to provide accurate information and keep credentials secure.</li>
<li><strong>Account Responsibility:</strong> You are responsible for activity under your account.</li>
<li><strong>Termination:</strong> We may suspend or terminate accounts that violate these Terms.</li>
</ul>

<h2>User Content</h2>
<ul>
<li><strong>License to Us:</strong> By posting User Content you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, publish, and display it.</li>
<li><strong>Responsibility:</strong> You are solely responsible for User Content you provide.</li>
<li><strong>Public Content:</strong> Content posted publicly may be viewable by others.</li>
</ul>

<h2>Prohibited Conduct</h2>
<p>Do not use the Site to:</p>
<ul>
<li>Violate laws, infringe rights, or post illegal content.</li>
<li>Impersonate others, harass, threaten, or defame.</li>
<li>Post malware, spam, or malicious code.</li>
<li>Scrape, replicate, or misuse Site data.</li>
<li>Circumvent security or interfere with Site functionality.</li>
</ul>

<h2>Intellectual Property</h2>
<ul>
<li><strong>Site Content:</strong> The Site and its original content are owned by us or our licensors.</li>
<li><strong>User Content Ownership:</strong> You retain ownership of your User Content but grant the license described above.</li>
</ul>

<h2>Disclaimers</h2>
<p>The Site is provided "as is" and "as available." We disclaim all warranties to the fullest extent permitted by law.</p>

<h2>Limitation of Liability</h2>
<p>To the maximum extent permitted by law, our liability is limited to direct damages. We are not liable for indirect, incidental, or consequential damages.</p>

<h2>Contact</h2>
<p>For questions regarding these Terms, contact us at <a href="mailto:opensourcefinder@gmail.com">opensourcefinder@gmail.com</a></p>`,
  },
  {
    type: 'refund',
    title: 'Refund Policy',
    content: `<h1>Refund Policy</h1>
<h2>Effective date</h2>
<p>January 16, 2026</p>

<h2>Scope</h2>
<p>This Refund Policy applies to any paid products or services offered on Open-Source Finder. Most features are free; this policy only applies where a fee is charged.</p>

<h2>General Refund Rule</h2>
<p>Refunds are issued only as described here or where required by applicable law.</p>

<h2>One-time Purchases</h2>
<ul>
<li><strong>Eligibility:</strong> Refund requests must be submitted within 14 days of purchase.</li>
<li><strong>Condition:</strong> You must demonstrate that the product or service failed to perform as described.</li>
<li><strong>Exceptions:</strong> Digital goods accessed after purchase may be non-refundable.</li>
</ul>

<h2>Subscriptions</h2>
<ul>
<li><strong>Billing:</strong> Subscriptions renew automatically until cancelled.</li>
<li><strong>Cancellations:</strong> You can cancel future renewals from your account settings.</li>
<li><strong>Prorated Refunds:</strong> Only granted when explicitly stated.</li>
</ul>

<h2>Refund Process</h2>
<ul>
<li><strong>How to Request:</strong> Email requests to <a href="mailto:opensourcefinder@gmail.com">opensourcefinder@gmail.com</a> with your order details.</li>
<li><strong>Response Time:</strong> We acknowledge requests within 5–7 business days.</li>
<li><strong>Method:</strong> Approved refunds will be issued to the original payment method.</li>
</ul>

<h2>Contact</h2>
<p>For refunds or questions, contact us at <a href="mailto:opensourcefinder@gmail.com">opensourcefinder@gmail.com</a></p>`,
  },
];

async function seedPolicies() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToDatabase();

    console.log('Seeding policies...');
    

    // Find or create the admin user for updated_by
    let adminUser = await User.findOne({ email: 'opensourcefinder@gmail.com' });
    if (!adminUser) {
      adminUser = await User.create({
        email: 'opensourcefinder@gmail.com',
        password: 'changeme',
        name: 'OpenSourceFinder Admin',
        role: 'admin',
        email_verified: true,
      });
      console.log('✓ Created admin user opensourcefinder@gmail.com');
    }

    for (const policyData of policies) {
      const existing = await Policy.findOne({ type: policyData.type });
      if (existing) {
        await Policy.updateOne(
          { type: policyData.type },
          { $set: { title: policyData.title, content: policyData.content, updated_by: adminUser._id } }
        );
        console.log(`✓ Updated ${policyData.type} policy`);
      } else {
        await Policy.create({ ...policyData, updated_by: adminUser._id });
        console.log(`✓ Created ${policyData.type} policy`);
      }
    }

    console.log('\n✓ Policy seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding policies:', error);
    process.exit(1);
  }
}

seedPolicies();
