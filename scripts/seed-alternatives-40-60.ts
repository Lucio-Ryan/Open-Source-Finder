import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

// Define schemas inline for the script
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
});

const ProprietarySoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  website: { type: String, required: true },
  icon_url: { type: String, default: null },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
});

const AlternativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  short_description: { type: String, default: null },
  website: { type: String, required: true },
  github: { type: String, required: true },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  license: { type: String, default: 'MIT' },
  is_self_hosted: { type: Boolean, default: true },
  health_score: { type: Number, default: 80 },
  approved: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  alternative_to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProprietarySoftware' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

// Categories to be used
const categoryDefinitions = [
  { name: 'Database', slug: 'database' },
  { name: 'No-Code', slug: 'no-code' },
  { name: 'CRM', slug: 'crm' },
  { name: 'Sales', slug: 'sales' },
  { name: 'Marketing', slug: 'marketing' },
  { name: 'Email Marketing', slug: 'email-marketing' },
  { name: 'Email Delivery', slug: 'email-delivery' },
  { name: 'Payment Processing', slug: 'payment-processing' },
  { name: 'Billing', slug: 'billing' },
  { name: 'Accounting', slug: 'accounting' },
  { name: 'Finance', slug: 'finance' },
  { name: 'Password Manager', slug: 'password-manager' },
  { name: 'Security', slug: 'security' },
  { name: 'Automation', slug: 'automation' },
  { name: 'Workflow', slug: 'workflow' },
  { name: 'Project Management', slug: 'project-management' },
  { name: 'Task Management', slug: 'task-management' },
  { name: 'Collaboration', slug: 'collaboration' },
  { name: 'Open Source', slug: 'open-source' },
  { name: 'Self-Hosted', slug: 'self-hosted' },
  { name: 'Privacy', slug: 'privacy' },
];

// Proprietary software alternatives 40-60 from open_source_alternatives.md
interface AlternativeData {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  website: string;
  github: string;
  is_self_hosted: boolean;
  categoryNames: string[];
}

const alternativesData: Record<string, AlternativeData[]> = {
  'airtable': [
    {
      name: 'NocoDB',
      slug: 'nocodb-airtable',
      short_description: 'Open-source Airtable alternative',
      description: 'NocoDB turns any database into a smart spreadsheet with a beautiful interface. It provides a no-code platform for building databases with powerful features.',
      website: 'https://nocodb.com/',
      github: 'https://github.com/nocodb/nocodb',
      is_self_hosted: true,
      categoryNames: ['Database', 'No-Code', 'Self-Hosted']
    },
    {
      name: 'Baserow',
      slug: 'baserow',
      short_description: 'Open-source no-code database',
      description: 'A powerful and easy-to-use tool for building databases and applications without writing code. Baserow is user-friendly and fully open-source.',
      website: 'https://baserow.io/',
      github: 'https://github.com/baserow/baserow',
      is_self_hosted: true,
      categoryNames: ['Database', 'No-Code', 'Self-Hosted']
    },
    {
      name: 'Mathesar',
      slug: 'mathesar',
      short_description: 'Intuitive database interface',
      description: 'Mathesar provides a spreadsheet-like interface for PostgreSQL databases, making it easy to work with data without SQL knowledge.',
      website: 'https://mathesar.org/',
      github: 'https://github.com/centerofci/mathesar',
      is_self_hosted: true,
      categoryNames: ['Database', 'No-Code', 'Self-Hosted']
    }
  ],
  'salesforce': [
    {
      name: 'SuiteCRM',
      slug: 'suitecrm',
      short_description: 'Open-source customer relationship management',
      description: 'SuiteCRM is a fully-featured, enterprise-ready CRM solution with sales automation, marketing campaigns, and customer support capabilities.',
      website: 'https://suitecrm.com/',
      github: 'https://github.com/salesagility/SuiteCRM',
      is_self_hosted: true,
      categoryNames: ['CRM', 'Sales', 'Self-Hosted']
    },
    {
      name: 'Odoo',
      slug: 'odoo',
      short_description: 'Open-source business applications',
      description: 'A comprehensive suite of business apps that includes CRM, e-commerce, accounting, inventory, and more in a single integrated platform.',
      website: 'https://www.odoo.com/',
      github: 'https://github.com/odoo/odoo',
      is_self_hosted: true,
      categoryNames: ['CRM', 'Sales', 'Self-Hosted']
    },
    {
      name: 'EspoCRM',
      slug: 'espocrm',
      short_description: 'Open-source CRM software',
      description: 'EspoCRM is a web-based CRM system that helps you organize and manage your customer relationships with a user-friendly interface.',
      website: 'https://www.espocrm.com/',
      github: 'https://github.com/espocrm/espocrm',
      is_self_hosted: true,
      categoryNames: ['CRM', 'Sales', 'Self-Hosted']
    }
  ],
  'hubspot': [
    {
      name: 'Mautic',
      slug: 'mautic',
      short_description: 'Open-source marketing automation',
      description: 'Mautic provides powerful marketing automation features including email campaigns, landing pages, forms, and lead nurturing.',
      website: 'https://www.mautic.org/',
      github: 'https://github.com/mautic/mautic',
      is_self_hosted: true,
      categoryNames: ['Marketing', 'CRM', 'Self-Hosted']
    },
    {
      name: 'ERPNext',
      slug: 'erpnext',
      short_description: 'Open-source ERP for everyone',
      description: 'A comprehensive business management tool that includes CRM, inventory, accounting, and project management in one platform.',
      website: 'https://erpnext.com/',
      github: 'https://github.com/frappe/erpnext',
      is_self_hosted: true,
      categoryNames: ['CRM', 'Sales', 'Self-Hosted']
    },
    {
      name: 'Corteza',
      slug: 'corteza',
      short_description: 'Open-source low-code platform',
      description: 'Corteza is a powerful low-code platform for building CRM, business apps, and workflows with extensive customization options.',
      website: 'https://cortezaproject.org/',
      github: 'https://github.com/cortezaproject/corteza',
      is_self_hosted: true,
      categoryNames: ['CRM', 'No-Code', 'Self-Hosted']
    }
  ],
  'pipedrive': [
    {
      name: 'Monica',
      slug: 'monica',
      short_description: 'Open-source personal CRM',
      description: 'Monica is a personal CRM that helps you organize and document your interactions with friends, family, and business contacts.',
      website: 'https://www.monicahq.com/',
      github: 'https://github.com/monicahq/monica',
      is_self_hosted: true,
      categoryNames: ['CRM', 'Sales', 'Self-Hosted']
    },
    {
      name: 'Twenty',
      slug: 'twenty',
      short_description: 'Modern open-source CRM',
      description: 'Twenty is a modern, open-source CRM designed to be simple, customizable, and powerful for managing sales pipelines.',
      website: 'https://twenty.com/',
      github: 'https://github.com/twentyhq/twenty',
      is_self_hosted: true,
      categoryNames: ['CRM', 'Sales', 'Self-Hosted']
    },
    {
      name: 'Krayin',
      slug: 'krayin',
      short_description: 'Open-source Laravel CRM',
      description: 'A free and open-source Laravel CRM solution with features for lead management, contact management, and sales automation.',
      website: 'https://krayincrm.com/',
      github: 'https://github.com/krayin/laravel-crm',
      is_self_hosted: true,
      categoryNames: ['CRM', 'Sales', 'Self-Hosted']
    }
  ],
  'mailchimp': [
    {
      name: 'Listmonk',
      slug: 'listmonk',
      short_description: 'Self-hosted newsletter and mailing list manager',
      description: 'Listmonk is a high-performance, self-hosted newsletter and mailing list manager with a modern interface and powerful features.',
      website: 'https://listmonk.app/',
      github: 'https://github.com/knadh/listmonk',
      is_self_hosted: true,
      categoryNames: ['Email Marketing', 'Marketing', 'Self-Hosted']
    },
    {
      name: 'Mailtrain',
      slug: 'mailtrain',
      short_description: 'Self-hosted newsletter application',
      description: 'A powerful and easy-to-use tool for managing your email marketing campaigns with support for automation and segmentation.',
      website: 'https://mailtrain.org/',
      github: 'https://github.com/Mailtrain-org/mailtrain',
      is_self_hosted: true,
      categoryNames: ['Email Marketing', 'Marketing', 'Self-Hosted']
    },
    {
      name: 'Keila',
      slug: 'keila',
      short_description: 'Open-source email newsletter tool',
      description: 'Keila is a reliable and easy-to-use email newsletter tool that you can host on your own server.',
      website: 'https://www.keila.io/',
      github: 'https://github.com/pentacent/keila',
      is_self_hosted: true,
      categoryNames: ['Email Marketing', 'Marketing', 'Self-Hosted']
    }
  ],
  'convertkit': [
    {
      name: 'Ghost',
      slug: 'ghost',
      short_description: 'Open-source platform for professional publishing',
      description: 'Ghost is a powerful platform for creating and managing newsletters, blogs, and memberships with built-in email marketing features.',
      website: 'https://ghost.org/',
      github: 'https://github.com/TryGhost/Ghost',
      is_self_hosted: true,
      categoryNames: ['Email Marketing', 'Marketing', 'Self-Hosted']
    },
    {
      name: 'Mautic',
      slug: 'mautic-convertkit',
      short_description: 'Open-source marketing automation',
      description: 'Mautic provides email marketing automation with advanced segmentation, personalization, and campaign management features.',
      website: 'https://www.mautic.org/',
      github: 'https://github.com/mautic/mautic',
      is_self_hosted: true,
      categoryNames: ['Email Marketing', 'Marketing', 'Self-Hosted']
    },
    {
      name: 'Listmonk',
      slug: 'listmonk-convertkit',
      short_description: 'Self-hosted newsletter and mailing list manager',
      description: 'A high-performance newsletter manager perfect for creators and businesses looking for self-hosted email marketing.',
      website: 'https://listmonk.app/',
      github: 'https://github.com/knadh/listmonk',
      is_self_hosted: true,
      categoryNames: ['Email Marketing', 'Marketing', 'Self-Hosted']
    }
  ],
  'sendgrid': [
    {
      name: 'Postal',
      slug: 'postal',
      short_description: 'Open-source mail delivery platform',
      description: 'Postal is a fully-featured mail server for use by websites and applications. It provides SMTP and HTTP API for sending emails.',
      website: 'https://postal.atech.media/',
      github: 'https://github.com/postalserver/postal',
      is_self_hosted: true,
      categoryNames: ['Email Delivery', 'Marketing', 'Self-Hosted']
    },
    {
      name: 'Maddy',
      slug: 'maddy',
      short_description: 'Composable all-in-one mail server',
      description: 'Maddy is a modern, all-in-one mail server that implements SMTP, IMAP, and other email protocols with security in mind.',
      website: 'https://maddy.email/',
      github: 'https://github.com/foxcpp/maddy',
      is_self_hosted: true,
      categoryNames: ['Email Delivery', 'Self-Hosted', 'Open Source']
    },
    {
      name: 'Mailu',
      slug: 'mailu',
      short_description: 'Simple yet full-featured mail server',
      description: 'Mailu is a simple yet full-featured mail server as a set of Docker images with easy configuration and management.',
      website: 'https://mailu.io/',
      github: 'https://github.com/Mailu/Mailu',
      is_self_hosted: true,
      categoryNames: ['Email Delivery', 'Self-Hosted', 'Open Source']
    }
  ],
  'stripe': [
    {
      name: 'Kill Bill',
      slug: 'kill-bill',
      short_description: 'Open-source subscription billing and payments',
      description: 'Kill Bill is a flexible, open-source subscription billing and payment platform with support for complex billing scenarios.',
      website: 'https://killbill.io/',
      github: 'https://github.com/killbill/killbill',
      is_self_hosted: true,
      categoryNames: ['Payment Processing', 'Billing', 'Self-Hosted']
    },
    {
      name: 'Lago',
      slug: 'lago',
      short_description: 'Open-source metering and usage-based billing',
      description: 'A tool that helps you manage your usage-based billing and subscriptions with flexible pricing models and metering.',
      website: 'https://www.getlago.com/',
      github: 'https://github.com/getlago/lago',
      is_self_hosted: true,
      categoryNames: ['Payment Processing', 'Billing', 'Self-Hosted']
    },
    {
      name: 'Chargebee',
      slug: 'chargebee-oss',
      short_description: 'Open-source billing solution',
      description: 'An open-source solution for managing recurring billing, subscriptions, and revenue operations.',
      website: 'https://www.chargebee.com/',
      github: 'https://github.com/chargebee',
      is_self_hosted: false,
      categoryNames: ['Payment Processing', 'Billing', 'Open Source']
    }
  ],
  'quickbooks': [
    {
      name: 'GnuCash',
      slug: 'gnucash',
      short_description: 'Open-source accounting software',
      description: 'GnuCash is a free, open-source accounting application for personal and small business use with double-entry bookkeeping.',
      website: 'https://www.gnucash.org/',
      github: 'https://github.com/Gnucash/gnucash',
      is_self_hosted: true,
      categoryNames: ['Accounting', 'Finance', 'Open Source']
    },
    {
      name: 'Akaunting',
      slug: 'akaunting',
      short_description: 'Open-source online accounting software',
      description: 'A comprehensive and easy-to-use tool for managing your finances, invoices, and expenses with a modern interface.',
      website: 'https://akaunting.com/',
      github: 'https://github.com/akaunting/akaunting',
      is_self_hosted: true,
      categoryNames: ['Accounting', 'Finance', 'Self-Hosted']
    },
    {
      name: 'Firefly III',
      slug: 'firefly-iii',
      short_description: 'Personal finance manager',
      description: 'Firefly III is a self-hosted financial manager that helps you keep track of your expenses and income.',
      website: 'https://www.firefly-iii.org/',
      github: 'https://github.com/firefly-iii/firefly-iii',
      is_self_hosted: true,
      categoryNames: ['Accounting', 'Finance', 'Self-Hosted']
    }
  ],
  'xero': [
    {
      name: 'Akaunting',
      slug: 'akaunting-xero',
      short_description: 'Open-source online accounting software',
      description: 'A comprehensive accounting solution for small businesses with invoicing, expense tracking, and financial reporting.',
      website: 'https://akaunting.com/',
      github: 'https://github.com/akaunting/akaunting',
      is_self_hosted: true,
      categoryNames: ['Accounting', 'Finance', 'Self-Hosted']
    },
    {
      name: 'FrontAccounting',
      slug: 'frontaccounting',
      short_description: 'Web-based accounting system',
      description: 'FrontAccounting is a professional web-based accounting system for small to medium businesses.',
      website: 'https://frontaccounting.com/',
      github: 'https://github.com/FrontAccountingERP/FA',
      is_self_hosted: true,
      categoryNames: ['Accounting', 'Finance', 'Self-Hosted']
    },
    {
      name: 'Manager',
      slug: 'manager',
      short_description: 'Free accounting software',
      description: 'A powerful and easy-to-use accounting tool for small businesses with comprehensive financial management features.',
      website: 'https://www.manager.io/',
      github: 'https://github.com/Manager-io',
      is_self_hosted: true,
      categoryNames: ['Accounting', 'Finance', 'Open Source']
    }
  ],
  '1password': [
    {
      name: 'Bitwarden',
      slug: 'bitwarden',
      short_description: 'Open-source password manager',
      description: 'Bitwarden is a secure, open-source password manager that stores your sensitive information with end-to-end encryption.',
      website: 'https://bitwarden.com/',
      github: 'https://github.com/bitwarden/server',
      is_self_hosted: true,
      categoryNames: ['Password Manager', 'Security', 'Self-Hosted']
    },
    {
      name: 'KeePassXC',
      slug: 'keepassxc',
      short_description: 'Open-source password manager',
      description: 'A powerful and secure tool for managing your passwords locally on your device with cross-platform support.',
      website: 'https://keepassxc.org/',
      github: 'https://github.com/keepassxreboot/keepassxc',
      is_self_hosted: true,
      categoryNames: ['Password Manager', 'Security', 'Open Source']
    },
    {
      name: 'Vaultwarden',
      slug: 'vaultwarden',
      short_description: 'Lightweight Bitwarden server',
      description: 'An unofficial Bitwarden-compatible server implementation written in Rust for self-hosting with minimal resources.',
      website: 'https://github.com/dani-garcia/vaultwarden',
      github: 'https://github.com/dani-garcia/vaultwarden',
      is_self_hosted: true,
      categoryNames: ['Password Manager', 'Security', 'Self-Hosted']
    }
  ],
  'lastpass': [
    {
      name: 'Bitwarden',
      slug: 'bitwarden-lastpass',
      short_description: 'Open-source password manager',
      description: 'Bitwarden provides secure password storage with end-to-end encryption and cross-platform sync.',
      website: 'https://bitwarden.com/',
      github: 'https://github.com/bitwarden/server',
      is_self_hosted: true,
      categoryNames: ['Password Manager', 'Security', 'Self-Hosted']
    },
    {
      name: 'Passbolt',
      slug: 'passbolt',
      short_description: 'Open-source password manager for teams',
      description: 'A secure and collaborative tool for managing your team\'s passwords with granular access control.',
      website: 'https://www.passbolt.com/',
      github: 'https://github.com/passbolt/passbolt_api',
      is_self_hosted: true,
      categoryNames: ['Password Manager', 'Security', 'Self-Hosted']
    },
    {
      name: 'Padloc',
      slug: 'padloc',
      short_description: 'Modern password manager',
      description: 'A simple and secure password manager with a modern interface and strong encryption.',
      website: 'https://padloc.app/',
      github: 'https://github.com/padloc/padloc',
      is_self_hosted: true,
      categoryNames: ['Password Manager', 'Security', 'Self-Hosted']
    }
  ],
  'dashlane': [
    {
      name: 'Bitwarden',
      slug: 'bitwarden-dashlane',
      short_description: 'Open-source password manager',
      description: 'A trusted open-source password management solution with robust security and multi-platform support.',
      website: 'https://bitwarden.com/',
      github: 'https://github.com/bitwarden/server',
      is_self_hosted: true,
      categoryNames: ['Password Manager', 'Security', 'Self-Hosted']
    },
    {
      name: 'KeePass',
      slug: 'keepass',
      short_description: 'Open-source password manager',
      description: 'A powerful and secure tool for managing your passwords locally with strong encryption algorithms.',
      website: 'https://keepass.info/',
      github: 'https://github.com/keepassxreboot/keepassxc',
      is_self_hosted: true,
      categoryNames: ['Password Manager', 'Security', 'Open Source']
    },
    {
      name: 'Psono',
      slug: 'psono',
      short_description: 'Open-source password manager',
      description: 'A secure password manager for teams and individuals with client-side encryption and self-hosting options.',
      website: 'https://psono.com/',
      github: 'https://github.com/psono/psono-server',
      is_self_hosted: true,
      categoryNames: ['Password Manager', 'Security', 'Self-Hosted']
    }
  ],
  'n8n': [
    {
      name: 'Node-RED',
      slug: 'node-red',
      short_description: 'Low-code programming for event-driven applications',
      description: 'Node-RED is a flow-based programming tool for wiring together hardware devices, APIs, and online services.',
      website: 'https://nodered.org/',
      github: 'https://github.com/node-red/node-red',
      is_self_hosted: true,
      categoryNames: ['Automation', 'Workflow', 'Self-Hosted']
    },
    {
      name: 'Huginn',
      slug: 'huginn',
      short_description: 'Open-source system for building agents',
      description: 'A tool that allows you to build agents that can perform tasks for you online automatically.',
      website: 'https://github.com/huginn/huginn',
      github: 'https://github.com/huginn/huginn',
      is_self_hosted: true,
      categoryNames: ['Automation', 'Workflow', 'Self-Hosted']
    },
    {
      name: 'Activepieces',
      slug: 'activepieces',
      short_description: 'Open-source no-code business automation',
      description: 'An open-source alternative to Zapier for automating business processes without coding.',
      website: 'https://www.activepieces.com/',
      github: 'https://github.com/activepieces/activepieces',
      is_self_hosted: true,
      categoryNames: ['Automation', 'Workflow', 'Self-Hosted']
    }
  ],
  'zapier': [
    {
      name: 'n8n',
      slug: 'n8n-zapier',
      short_description: 'Open-source workflow automation tool',
      description: 'n8n is an extendable workflow automation tool that allows you to connect anything to everything with a node-based approach.',
      website: 'https://n8n.io/',
      github: 'https://github.com/n8n-io/n8n',
      is_self_hosted: true,
      categoryNames: ['Automation', 'Workflow', 'Self-Hosted']
    },
    {
      name: 'Activepieces',
      slug: 'activepieces-zapier',
      short_description: 'Open-source no-code business automation',
      description: 'A powerful and easy-to-use tool for building and running workflows to automate your business processes.',
      website: 'https://www.activepieces.com/',
      github: 'https://github.com/activepieces/activepieces',
      is_self_hosted: true,
      categoryNames: ['Automation', 'Workflow', 'Self-Hosted']
    },
    {
      name: 'Windmill',
      slug: 'windmill',
      short_description: 'Open-source developer platform for APIs',
      description: 'Windmill is an open-source developer platform for building workflows and internal tools with scripts and APIs.',
      website: 'https://www.windmill.dev/',
      github: 'https://github.com/windmill-labs/windmill',
      is_self_hosted: true,
      categoryNames: ['Automation', 'Workflow', 'Self-Hosted']
    }
  ],
  'make': [
    {
      name: 'n8n',
      slug: 'n8n-make',
      short_description: 'Open-source workflow automation tool',
      description: 'A powerful and easy-to-use tool for wiring together hardware devices, APIs, and online services with visual workflows.',
      website: 'https://n8n.io/',
      github: 'https://github.com/n8n-io/n8n',
      is_self_hosted: true,
      categoryNames: ['Automation', 'Workflow', 'Self-Hosted']
    },
    {
      name: 'Node-RED',
      slug: 'node-red-make',
      short_description: 'Low-code programming for event-driven applications',
      description: 'A flow-based development tool for visual programming with a browser-based editor.',
      website: 'https://nodered.org/',
      github: 'https://github.com/node-red/node-red',
      is_self_hosted: true,
      categoryNames: ['Automation', 'Workflow', 'Self-Hosted']
    },
    {
      name: 'Windmill',
      slug: 'windmill-make',
      short_description: 'Open-source developer platform',
      description: 'Build internal tools and workflows with scripts and APIs in a developer-friendly environment.',
      website: 'https://www.windmill.dev/',
      github: 'https://github.com/windmill-labs/windmill',
      is_self_hosted: true,
      categoryNames: ['Automation', 'Workflow', 'Self-Hosted']
    }
  ],
  'asana': [
    {
      name: 'Plane',
      slug: 'plane-asana',
      short_description: 'Open-source project management tool',
      description: 'Plane is a simple, powerful project management tool that helps teams track issues, manage sprints, and collaborate.',
      website: 'https://plane.so/',
      github: 'https://github.com/makeplane/plane',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Task Management', 'Self-Hosted']
    },
    {
      name: 'Vikunja',
      slug: 'vikunja-asana',
      short_description: 'Open-source to-do list for teams',
      description: 'A feature-rich task management tool that supports kanban boards, lists, and team collaboration.',
      website: 'https://vikunja.io/',
      github: 'https://github.com/go-vikunja/vikunja',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Task Management', 'Self-Hosted']
    },
    {
      name: 'Taiga',
      slug: 'taiga-asana',
      short_description: 'Open-source project management platform',
      description: 'An agile project management platform designed for teams using Scrum or Kanban methodologies.',
      website: 'https://taiga.io/',
      github: 'https://github.com/taigaio/taiga-back',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Task Management', 'Self-Hosted']
    }
  ],
  'monday': [
    {
      name: 'Plane',
      slug: 'plane-monday',
      short_description: 'Open-source project management tool',
      description: 'A flexible project management platform that adapts to your team\'s workflow with customizable views and features.',
      website: 'https://plane.so/',
      github: 'https://github.com/makeplane/plane',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Collaboration', 'Self-Hosted']
    },
    {
      name: 'Focalboard',
      slug: 'focalboard-monday',
      short_description: 'Open-source alternative to Trello, Notion, and Asana',
      description: 'A project management tool that helps you organize tasks with kanban boards, tables, and calendars.',
      website: 'https://www.focalboard.com/',
      github: 'https://github.com/mattermost/focalboard',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Collaboration', 'Self-Hosted']
    },
    {
      name: 'Planka',
      slug: 'planka',
      short_description: 'Open-source kanban board',
      description: 'A real-time kanban board for workgroups built with React and Redux.',
      website: 'https://planka.app/',
      github: 'https://github.com/plankanban/planka',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Collaboration', 'Self-Hosted']
    }
  ],
  'trello': [
    {
      name: 'Wekan',
      slug: 'wekan',
      short_description: 'Open-source kanban board',
      description: 'Wekan is an open-source and collaborative kanban board application with a simple and intuitive interface.',
      website: 'https://wekan.github.io/',
      github: 'https://github.com/wekan/wekan',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Task Management', 'Self-Hosted']
    },
    {
      name: 'Planka',
      slug: 'planka-trello',
      short_description: 'Open-source kanban board for teams',
      description: 'A simple and easy-to-use tool for managing your tasks and projects with kanban boards.',
      website: 'https://planka.app/',
      github: 'https://github.com/plankanban/planka',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Task Management', 'Self-Hosted']
    },
    {
      name: 'Focalboard',
      slug: 'focalboard-trello',
      short_description: 'Open-source alternative to Trello',
      description: 'An open-source project management tool with kanban boards, table views, and calendar views.',
      website: 'https://www.focalboard.com/',
      github: 'https://github.com/mattermost/focalboard',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Task Management', 'Self-Hosted']
    }
  ],
  'clickup': [
    {
      name: 'Plane',
      slug: 'plane-clickup',
      short_description: 'Open-source project management tool',
      description: 'A comprehensive project management solution with all the features you need to manage your projects effectively.',
      website: 'https://plane.so/',
      github: 'https://github.com/makeplane/plane',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Task Management', 'Self-Hosted']
    },
    {
      name: 'AppFlowy',
      slug: 'appflowy-clickup',
      short_description: 'Open-source alternative to Notion',
      description: 'A collaborative workspace that gives you control over your data and allows for extensive customization.',
      website: 'https://www.appflowy.io/',
      github: 'https://github.com/AppFlowy-IO/AppFlowy',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Collaboration', 'Self-Hosted']
    },
    {
      name: 'OpenProject',
      slug: 'openproject-clickup',
      short_description: 'Open-source project management software',
      description: 'A comprehensive tool for project planning, scheduling, and collaboration with support for multiple methodologies.',
      website: 'https://www.openproject.org/',
      github: 'https://github.com/opf/openproject',
      is_self_hosted: true,
      categoryNames: ['Project Management', 'Collaboration', 'Self-Hosted']
    }
  ]
};

async function seedAlternatives() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // First, ensure all categories exist
    console.log('\n📁 Creating categories...');
    const categoryMap: Record<string, mongoose.Types.ObjectId> = {};
    
    for (const catDef of categoryDefinitions) {
      const category = await Category.findOneAndUpdate(
        { slug: catDef.slug },
        { name: catDef.name, slug: catDef.slug },
        { upsert: true, new: true }
      );
      categoryMap[catDef.name] = category._id;
      console.log(`   ✅ Category: ${catDef.name}`);
    }

    // Get proprietary software (40-60)
    const proprietaryList = [
      'airtable', 'salesforce', 'hubspot', 'pipedrive', 'mailchimp',
      'convertkit', 'sendgrid', 'stripe', 'quickbooks', 'xero',
      '1password', 'lastpass', 'dashlane', 'n8n', 'zapier',
      'make', 'asana', 'monday', 'trello', 'clickup'
    ];

    for (const propSlug of proprietaryList) {
      const proprietary = await ProprietarySoftware.findOne({ slug: propSlug });
      
      if (!proprietary) {
        console.log(`\n⚠️  Proprietary software not found: ${propSlug}`);
        continue;
      }

      console.log(`\n🔍 Adding alternatives for ${proprietary.name}...`);
      
      const altsToAdd = alternativesData[propSlug] || [];
      
      for (const altData of altsToAdd) {
        try {
          // Get category IDs for this alternative
          const categoryIds = altData.categoryNames
            .map(name => categoryMap[name])
            .filter(id => id !== undefined);

          const alt = await Alternative.findOneAndUpdate(
            { slug: altData.slug },
            { 
              name: altData.name,
              slug: altData.slug,
              description: altData.description,
              short_description: altData.short_description,
              website: altData.website,
              github: altData.github,
              is_self_hosted: altData.is_self_hosted,
              categories: categoryIds,
              approved: true,
              $addToSet: { alternative_to: proprietary._id },
              updated_at: new Date() 
            },
            { upsert: true, new: true }
          );
          console.log(`   ✅ Added/Updated: ${alt.name} (${altData.categoryNames.join(', ')})`);
        } catch (err: any) {
          console.error(`   ❌ Error adding ${altData.name}:`, err.message);
        }
      }
    }

    console.log('\n🎉 Finished adding alternatives for proprietary software 40-60!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedAlternatives();
