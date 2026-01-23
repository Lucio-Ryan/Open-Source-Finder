import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const ProprietarySoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: String,
});

const AlternativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: String,
  short_description: String,
  long_description: String,
  alternative_to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProprietarySoftware' }],
});

const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

// Manual mapping for alternatives that we know what they're alternatives to
const manualAlternativeToMappings: { [alternativeName: string]: string[] } = {
  // Communication & Chat
  'Mattermost': ['Slack'],
  'Rocket.Chat': ['Slack'],
  'Zulip': ['Slack'],
  'Element': ['Microsoft Teams', 'Slack'],
  'Revolt': ['Discord'],
  'Jitsi': ['Zoom'],
  'BigBlueButton': ['Zoom'],
  
  // Project Management
  'Focalboard': ['Trello'],
  'Taiga': ['Trello', 'Jira'],
  'Wekan': ['Trello'],
  'OpenProject': ['Asana', 'Monday.com'],
  'Leantime': ['Asana'],
  'Plane': ['Linear', 'Jira'],
  'Huly': ['Linear'],
  
  // Note-taking & Knowledge
  'AppFlowy': ['Notion'],
  'Logseq': ['Notion', 'Roam Research'],
  'Outline': ['Notion', 'Confluence'],
  'AFFiNE': ['Notion'],
  'SiYuan': ['Notion', 'Obsidian'],
  'Trilium Notes': ['Notion', 'Evernote'],
  'Joplin': ['Evernote'],
  'Standard Notes': ['Evernote'],
  'Notesnook': ['Evernote'],
  'Docmost': ['Notion', 'Confluence'],
  
  // Analytics
  'Matomo': ['Google Analytics'],
  'Umami': ['Google Analytics'],
  'Plausible Analytics': ['Google Analytics'],
  'PostHog': ['Google Analytics', 'Mixpanel', 'Amplitude'],
  'Fathom Lite': ['Google Analytics'],
  'Ackee': ['Google Analytics'],
  'Pirsch': ['Google Analytics'],
  'Shynet': ['Google Analytics'],
  'GoatCounter': ['Google Analytics'],
  'Open Web Analytics': ['Google Analytics'],
  
  // Design & Creative
  'GIMP': ['Adobe Photoshop'],
  'Krita': ['Adobe Photoshop'],
  'Darktable': ['Adobe Photoshop', 'Lightroom'],
  'Inkscape': ['Adobe Illustrator'],
  'Shotcut': ['DaVinci Resolve', 'Adobe Premiere Pro'],
  'Kdenlive': ['DaVinci Resolve', 'Adobe Premiere Pro'],
  'OpenShot': ['iMovie'],
  'Olive Video Editor': ['DaVinci Resolve'],
  'Penpot': ['Figma'],
  'Lunacy': ['Figma', 'Sketch'],
  'Akira': ['Figma'],
  'Excalidraw': ['Miro', 'Lucidchart'],
  'tldraw': ['Miro', 'Excalidraw'],
  'draw.io': ['Lucidchart'],
  
  // CMS & Blogging
  'Ghost': ['WordPress', 'Medium'],
  'Strapi': ['WordPress'],
  'Directus': ['WordPress'],
  'Payload CMS': ['WordPress'],
  'KeystoneJS': ['WordPress'],
  'Sanity': ['WordPress'],
  'Tina CMS': ['WordPress'],
  'Decap CMS': ['WordPress'],
  'WriteFreely': ['Medium'],
  'Plume': ['Medium'],
  
  // Code Repository & Version Control
  'GitLab': ['GitHub'],
  'Gitea': ['GitHub'],
  'Forgejo': ['GitHub'],
  'Gogs': ['GitHub'],
  'OneDev': ['GitHub', 'GitLab'],
  'SourceHut': ['GitHub'],
  
  // CI/CD
  'Woodpecker CI': ['Jenkins', 'GitHub Actions'],
  'Drone CI': ['Jenkins', 'GitHub Actions'],
  'Concourse CI': ['Jenkins'],
  'Buildbot': ['Jenkins'],
  'Laminar': ['Jenkins'],
  'Agola': ['GitHub Actions'],
  
  // Database & Storage
  'SurrealDB': ['MongoDB Atlas'],
  'RethinkDB': ['MongoDB Atlas'],
  'CouchDB': ['MongoDB Atlas'],
  'PocketBase': ['Firebase', 'Supabase'],
  'Appwrite': ['Firebase'],
  'Nhost': ['Firebase'],
  'Parse': ['Firebase'],
  'Supabase': ['Firebase'],
  
  // Monitoring & Observability
  'Grafana': ['Datadog'],
  'Prometheus': ['Datadog'],
  'Zabbix': ['Datadog'],
  'Netdata': ['Datadog'],
  'Uptime Kuma': ['Statuspage.io', 'Pingdom'],
  'Healthchecks': ['Statuspage.io'],
  'Gatus': ['Statuspage.io'],
  'Cachet': ['Statuspage.io'],
  'Statping-ng': ['Statuspage.io'],
  'Vigil': ['Statuspage.io'],
  'Jaeger': ['Datadog'],
  'SigNoz': ['Datadog', 'New Relic'],
  'Highlight.io': ['FullStory', 'LogRocket'],
  
  // Authentication & Identity
  'Keycloak': ['Auth0', 'Okta'],
  'Authentik': ['Auth0', 'Okta'],
  'Authelia': ['Auth0'],
  'Casdoor': ['Auth0'],
  'SuperTokens': ['Auth0'],
  'ZITADEL': ['Auth0', 'Okta'],
  'Logto': ['Auth0'],
  'Ory': ['Auth0'],
  'FusionAuth': ['Auth0'],
  'Hanko': ['Magic.link'],
  
  // Email
  'Mailcow': ['Gmail', 'Microsoft 365'],
  'Mail-in-a-Box': ['Gmail'],
  'Mailu': ['Gmail'],
  'Postal': ['SendGrid', 'Mailgun'],
  'Listmonk': ['Mailchimp'],
  'Mautic': ['Mailchimp', 'HubSpot'],
  'Keila': ['Mailchimp'],
  
  // Password Management
  'Bitwarden': ['1Password', 'LastPass'],
  'Vaultwarden': ['1Password', 'LastPass'],
  'KeePassXC': ['1Password', 'LastPass'],
  'Padloc': ['1Password'],
  'Passbolt': ['1Password'],
  
  // File Storage & Sync
  'Nextcloud': ['Google Drive', 'Dropbox'],
  'ownCloud': ['Google Drive', 'Dropbox'],
  'Seafile': ['Dropbox'],
  'Syncthing': ['Dropbox'],
  'FileRun': ['Dropbox'],
  'Filestash': ['Dropbox'],
  
  // CRM & Sales
  'Twenty': ['Salesforce', 'HubSpot'],
  'SuiteCRM': ['Salesforce'],
  'EspoCRM': ['Salesforce'],
  'Krayin CRM': ['Salesforce'],
  'Erxes': ['HubSpot'],
  
  // Customer Support
  'Chatwoot': ['Zendesk', 'Intercom'],
  'Papercups': ['Intercom'],
  'Zammad': ['Zendesk'],
  'FreeScout': ['Help Scout'],
  'Helpy': ['Zendesk'],
  'UVDesk': ['Zendesk'],
  'OTRS': ['Zendesk'],
  
  // Forms & Surveys
  'Typebot': ['Typeform'],
  'Formbricks': ['Typeform'],
  'LimeSurvey': ['SurveyMonkey'],
  'OhMyForm': ['Typeform'],
  'OpnForm': ['Typeform'],
  
  // Scheduling & Calendar
  'Cal.com': ['Calendly'],
  'Calendso': ['Calendly'],
  'Easy Appointments': ['Calendly'],
  
  // Time Tracking
  'Kimai': ['Toggl Track', 'Harvest'],
  'Traggo': ['Toggl Track'],
  'ActivityWatch': ['Toggl Track'],
  'Timetagger': ['Toggl Track'],
  
  // E-commerce
  'Medusa': ['Shopify'],
  'Saleor': ['Shopify'],
  'Vendure': ['Shopify'],
  'Bagisto': ['Shopify'],
  'PrestaShop': ['Shopify'],
  'WooCommerce': ['Shopify'],
  'Solidus': ['Shopify'],
  'Sylius': ['Shopify'],
  'Shuup': ['Shopify'],
  
  // LMS & Education
  'Canvas LMS': ['Teachable', 'Coursera'],
  'Moodle': ['Teachable'],
  'Open edX': ['Coursera', 'Udemy'],
  'Chamilo': ['Teachable'],
  
  // Search
  'Meilisearch': ['Algolia', 'Elasticsearch'],
  'Typesense': ['Algolia'],
  'Sonic': ['Elasticsearch'],
  'Manticore Search': ['Elasticsearch'],
  'ZincSearch': ['Elasticsearch'],
  'Quickwit': ['Elasticsearch'],
  
  // API & Development
  'Hoppscotch': ['Postman'],
  'Insomnia': ['Postman'],
  'Bruno': ['Postman'],
  'Firecamp': ['Postman'],
  'HTTPie': ['Postman'],
  
  // Feature Flags
  'Unleash': ['LaunchDarkly'],
  'Flagsmith': ['LaunchDarkly'],
  'GrowthBook': ['LaunchDarkly'],
  'FeatBit': ['LaunchDarkly'],
  
  // Automation & Integration
  'n8n': ['Zapier', 'Make'],
  'Activepieces': ['Zapier'],
  'Automatisch': ['Zapier'],
  'Windmill': ['Zapier'],
  'Huginn': ['Zapier', 'IFTTT'],
  'Node-RED': ['Zapier'],
  
  // Low-Code / Internal Tools
  'Budibase': ['Retool'],
  'Appsmith': ['Retool'],
  'ToolJet': ['Retool'],
  'Refine': ['Retool'],
  'NocoBase': ['Airtable'],
  'NocoDB': ['Airtable'],
  'Baserow': ['Airtable'],
  'Grist': ['Airtable'],
  'Teable': ['Airtable'],
  
  // Media Server
  'Jellyfin': ['Plex'],
  'Emby': ['Plex'],
  'Navidrome': ['Spotify'],
  'Funkwhale': ['Spotify'],
  'Ampache': ['Spotify'],
  
  // URL Shortener & Links
  'Shlink': ['Bitly'],
  'Kutt': ['Bitly'],
  'YOURLS': ['Bitly'],
  'Dub': ['Bitly'],
  'LinkStack': ['Linktree'],
  'Littlelink': ['Linktree'],
  
  // Bookmarks & Reading
  'Linkwarden': ['Raindrop.io', 'Pocket'],
  'Shiori': ['Pocket'],
  'Wallabag': ['Pocket', 'Instapaper'],
  'Omnivore': ['Pocket'],
  'Readeck': ['Pocket'],
  
  // Whiteboard & Diagrams
  'Excalidraw': ['Miro', 'Lucidchart'],
  'diagrams.net': ['Lucidchart'],
  
  // Finance & Budgeting
  'Firefly III': ['Mint', 'YNAB'],
  'Actual Budget': ['YNAB'],
  'GnuCash': ['QuickBooks'],
  'Akaunting': ['QuickBooks', 'FreshBooks'],
  'InvoicePlane': ['FreshBooks'],
  'Crater': ['FreshBooks'],
  'InvoiceNinja': ['FreshBooks'],
  'SolidInvoice': ['FreshBooks'],
  
  // Home Automation
  'Home Assistant': ['SmartThings', 'Google Home'],
  'OpenHAB': ['SmartThings'],
  'Domoticz': ['SmartThings'],
  
  // RSS & Feed
  'FreshRSS': ['Feedly'],
  'Miniflux': ['Feedly'],
  'Tiny Tiny RSS': ['Feedly'],
  'NewsBlur': ['Feedly'],
  
  // Document Signing
  'DocuSeal': ['DocuSign'],
  'OpenSign': ['DocuSign'],
  
  // Photo Management
  'Immich': ['Google Photos'],
  'PhotoPrism': ['Google Photos'],
  'Photoview': ['Google Photos'],
  'LibrePhotos': ['Google Photos'],
  'Lychee': ['Google Photos'],
  'Pigallery2': ['Google Photos'],
  'Piwigo': ['Google Photos'],
  
  // Comments
  'Giscus': ['Disqus'],
  'Utterances': ['Disqus'],
  'Remark42': ['Disqus'],
  'Commento': ['Disqus'],
  'Cusdis': ['Disqus'],
  'Isso': ['Disqus'],
  
  // Social & Community
  'Mastodon': ['Twitter'],
  'Misskey': ['Twitter'],
  'Pleroma': ['Twitter'],
  'Lemmy': ['Reddit'],
  'Kbin': ['Reddit'],
  'Discourse': ['Facebook Groups'],
  'Forem': ['Medium'],
  'PeerTube': ['YouTube'],
  'Owncast': ['Twitch'],
  
  // Video Editing
  'Blender': ['Maya', 'After Effects'],
  'OpenShot': ['iMovie'],
  'Olive': ['DaVinci Resolve'],
  
  // Audio & Music
  'Ardour': ['Ableton Live', 'Logic Pro'],
  'LMMS': ['FL Studio'],
  'Audacity': ['Audacity'],
  
  // 3D & CAD
  'FreeCAD': ['AutoCAD'],
  'OpenSCAD': ['AutoCAD'],
  'BRL-CAD': ['AutoCAD'],
  
  // Terminals
  'Alacritty': ['iTerm2'],
  'Kitty': ['iTerm2'],
  'WezTerm': ['iTerm2'],
  'Warp': ['iTerm2'],
  'Hyper': ['iTerm2'],
  'Tabby': ['iTerm2'],
  
  // Code Editors
  'Neovim': ['VS Code'],
  'Helix': ['VS Code'],
  'Lapce': ['VS Code'],
  'Zed': ['VS Code'],
  'Pulsar': ['VS Code', 'Atom'],
  'VSCodium': ['VS Code'],
  
  // VPN & Security
  'WireGuard': ['NordVPN', 'ExpressVPN'],
  'OpenVPN': ['NordVPN'],
  'Tailscale': ['NordVPN'],
  'Headscale': ['Tailscale'],
  'Netmaker': ['Tailscale'],
  'Firezone': ['NordVPN'],
  'Pritunl': ['NordVPN'],
  
  // Backup
  'Restic': ['Backblaze'],
  'Borg': ['Backblaze'],
  'Duplicati': ['Backblaze'],
  'Kopia': ['Backblaze'],
  'Duplicacy': ['Backblaze'],
  
  // DNS & Ad Blocking
  'Pi-hole': ['Cloudflare DNS'],
  'AdGuard Home': ['Pi-hole'],
  'Blocky': ['Pi-hole'],
  'Technitium DNS': ['Pi-hole'],
  
  // Reverse Proxy
  'Traefik': ['Nginx'],
  'Caddy': ['Nginx'],
  'HAProxy': ['Nginx'],
  'Nginx Proxy Manager': ['Nginx'],
  
  // Containers & Orchestration
  'Portainer': ['Docker Desktop'],
  'Rancher': ['Kubernetes'],
  'K3s': ['Kubernetes'],
  'MicroK8s': ['Kubernetes'],
  'Nomad': ['Kubernetes'],
  
  // Dashboard & Homepage
  'Homepage': ['Homer'],
  'Homarr': ['Homer'],
  'Dashy': ['Homer'],
  'Heimdall': ['Homer'],
  'Organizr': ['Homer'],
  'Flame': ['Homer'],
  
  // Screenshot & Recording
  'Flameshot': ['Snagit'],
  'ShareX': ['Snagit'],
  'Ksnip': ['Snagit'],
  'Greenshot': ['Snagit'],
  'OBS Studio': ['OBS'],
  
  // API Gateway
  'Kong': ['AWS API Gateway'],
  'Tyk': ['AWS API Gateway'],
  'KrakenD': ['AWS API Gateway'],
  'APISIX': ['AWS API Gateway'],
  'Gravitee': ['AWS API Gateway'],
  
  // Message Queue
  'RabbitMQ': ['Amazon SQS'],
  'NATS': ['Amazon SQS'],
  'ZeroMQ': ['Amazon SQS'],
  'Apache Kafka': ['Amazon SQS'],
  'Redpanda': ['Apache Kafka'],
  
  // Scheduler & Workflow
  'Apache Airflow': ['Prefect'],
  'Dagster': ['Prefect'],
  'Prefect': ['Airflow'],
  'Temporal': ['AWS Step Functions'],
  
  // Serverless
  'OpenFaaS': ['AWS Lambda'],
  'Knative': ['AWS Lambda'],
  'Fission': ['AWS Lambda'],
  'Fn Project': ['AWS Lambda'],
  'OpenWhisk': ['AWS Lambda'],
  
  // Infrastructure as Code
  'Terraform': ['AWS CloudFormation'],
  'Pulumi': ['Terraform'],
  'OpenTofu': ['Terraform'],
  'Crossplane': ['Terraform'],
  
  // Service Mesh
  'Istio': ['AWS App Mesh'],
  'Linkerd': ['Istio'],
  'Consul': ['Istio'],
  'Cilium': ['Istio'],
  
  // Incident Management
  'Grafana OnCall': ['PagerDuty'],
  'Keep': ['PagerDuty'],
  
  // BI & Visualization
  'Apache Superset': ['Tableau', 'Looker'],
  'Metabase': ['Tableau'],
  'Redash': ['Tableau'],
  'Lightdash': ['Looker'],
  
  // Remote Desktop
  'RustDesk': ['TeamViewer', 'AnyDesk'],
  'MeshCentral': ['TeamViewer'],
  'Apache Guacamole': ['TeamViewer'],
  
  // File Transfer
  'PairDrop': ['AirDrop'],
  'OnionShare': ['WeTransfer'],
  'Send': ['WeTransfer'],
  
  // Office Suite
  'LibreOffice': ['Microsoft Office'],
  'ONLYOFFICE': ['Microsoft Office', 'Google Docs'],
  'Collabora Online': ['Google Docs'],
  'CryptPad': ['Google Docs'],
  
  // Spreadsheet
  'EtherCalc': ['Google Sheets'],
  'Luckysheet': ['Google Sheets'],
  'Univer': ['Google Sheets'],
  
  // Presentation
  'Reveal.js': ['PowerPoint'],
  'Slidev': ['PowerPoint'],
  'Marp': ['PowerPoint'],
  
  // Mind Mapping
  'Freeplane': ['MindMeister', 'XMind'],
  
  // Calendar & Contacts
  'Baikal': ['Google Calendar'],
  'Bloben': ['Google Calendar'],
  'Monica': ['Google Contacts'],
  
  // Speed Test
  'LibreSpeed': ['Speedtest.net'],
  'Speedtest Tracker': ['Speedtest.net'],
  
  // Pastebin
  'PrivateBin': ['Pastebin.com'],
  'Hastebin': ['Pastebin.com'],
  'Opengist': ['GitHub Gist'],
  
  // Code Sharing
  'Sandpack': ['CodePen', 'CodeSandbox'],
  
  // SSL & Certificates
  'Certbot': ['Paid SSL'],
  'acme.sh': ['Paid SSL'],
  'Step CA': ['AWS Certificate Manager'],
  
  // Firewall
  'OPNsense': ['pfSense'],
  
  // DNS Server
  'PowerDNS': ['Route53'],
  'CoreDNS': ['Route53'],
  
  // LDAP
  'OpenLDAP': ['Active Directory'],
  'LLDAP': ['Active Directory'],
  'Kanidm': ['Active Directory'],
  
  // Time Series DB
  'TimescaleDB': ['InfluxDB'],
  'QuestDB': ['InfluxDB'],
  'VictoriaMetrics': ['InfluxDB'],
  
  // Graph Database
  'JanusGraph': ['Neo4j'],
  'NebulaGraph': ['Neo4j'],
  'Dgraph': ['Neo4j'],
  
  // Object Storage
  'MinIO': ['AWS S3'],
  'Garage': ['AWS S3'],
  'SeaweedFS': ['AWS S3'],
  
  // Cache
  'Hazelcast': ['Redis'],
  'KeyDB': ['Redis'],
  'Dragonfly': ['Redis'],
  
  // Web Server
  'OpenLiteSpeed': ['Nginx'],
  
  // Tunneling
  'Cloudflare Tunnel': ['ngrok'],
  'Localtunnel': ['ngrok'],
  'Bore': ['ngrok'],
  'Frp': ['ngrok'],
  'Zrok': ['ngrok'],
  
  // Torrent
  'qBittorrent': ['uTorrent'],
  'Transmission': ['uTorrent'],
  'Deluge': ['uTorrent'],
  
  // Download Manager
  'aria2': ['JDownloader'],
  
  // Maps
  'OsmAnd': ['Google Maps'],
  'Organic Maps': ['Google Maps'],
  
  // QR/Barcode
  'QR Code Styling': ['QR Code Generator'],
  'JsBarcode': ['Barcode Generator'],
  
  // Feedback
  'Fider': ['Canny', 'UserVoice'],
  
  // Inventory
  'PartKeepr': ['Inventory Cloud'],
  'InvenTree': ['Inventory Cloud'],
  'Grocy': ['Anylist'],
  
  // Recipe
  'Tandoor Recipes': ['Paprika'],
  'Mealie': ['Paprika'],
  
  // Fleet/GPS
  'Traccar': ['Samsara'],
  
  // Digital Signage
  'Anthias': ['Yodeck'],
  
  // Network Monitoring
  'LibreNMS': ['PRTG', 'SolarWinds'],
  'Observium': ['PRTG'],
  'Nagios Core': ['Datadog'],
  'Icinga': ['Nagios'],
  'Checkmk': ['Datadog'],
  'Ntopng': ['SolarWinds'],
  'NetBox': ['SolarWinds'],
  
  // Resume Builder
  'Reactive Resume': ['Resume.io'],
  'OpenResume': ['Resume.io'],
  
  // Kanban
  'Planka': ['Trello'],
  'Kanboard': ['Trello'],
  
  // AI & ML
  'Ollama': ['OpenAI', 'ChatGPT'],
  'LocalAI': ['OpenAI'],
  'LM Studio': ['OpenAI'],
  'Jan': ['ChatGPT'],
  'GPT4All': ['ChatGPT'],
  'Text Generation WebUI': ['ChatGPT'],
  'Llama.cpp': ['OpenAI'],
  
  // Vector DB
  'Qdrant': ['Pinecone'],
  'Weaviate': ['Pinecone'],
  'Milvus': ['Pinecone'],
  'Chroma': ['Pinecone'],
  'LanceDB': ['Pinecone'],
  
  // Game Engines
  'Godot': ['Unity', 'Unreal Engine'],
  'Bevy': ['Unity'],
  'Defold': ['Unity'],
  'GDevelop': ['Unity'],
  'Cocos2d-x': ['Unity'],
  
  // Grammar
  'LanguageTool': ['Grammarly'],
  
  // Session Replay
  'OpenReplay': ['FullStory', 'LogRocket'],
  'RRWeb': ['FullStory'],
  
  // Additional databases
  'TiDB': ['MySQL', 'CockroachDB'],
  'DuckDB': ['SQLite', 'BigQuery'],
  
  // Code Search
  'Zoekt': ['GitHub Code Search'],
  'Livegrep': ['GitHub Code Search'],
  
  // Social Media Management
  'Mixpost': ['Buffer', 'Hootsuite'],
  
  // Notifications
  'Novu': ['OneSignal', 'Twilio'],
  'Ntfy': ['Pushover', 'Pusher'],
  'Gotify': ['Pushover'],
  
  // AI Image Generation
  'Stable Diffusion WebUI': ['Midjourney', 'DALL-E'],
  'ComfyUI': ['Midjourney'],
  'InvokeAI': ['Midjourney'],
  'Fooocus': ['Midjourney'],
  
  // Music
  'MuseScore': ['Sibelius', 'Finale'],
  
  // VPN/Network
  'Netbird': ['Cloudflare Tunnel', 'ngrok'],
  'Headscale': ['Cloudflare Tunnel', 'Tailscale'],
  
  // Email Clients
  'Thunderbird': ['Outlook', 'Gmail'],
  'Mailspring': ['Outlook'],
  
  // Dashboard
  'Homer': ['Notion', 'Confluence'],
  
  // API Gateway
  'Kong': ['AWS API Gateway'],
  'Tyk': ['AWS API Gateway'],
  'KrakenD': ['AWS API Gateway'],
  
  // Queue
  'BullMQ': ['Amazon SQS', 'RabbitMQ'],
  
  // Scheduler
  'Ofelia': ['AWS CloudWatch Events'],
  'Airflow': ['Prefect Cloud', 'Astronomer'],
  'Temporal': ['AWS Step Functions'],
  
  // Web Server & Performance
  'Varnish': ['Cloudflare', 'Fastly'],
  'GoAccess': ['Google Analytics'],
  'Vector': ['Datadog', 'Splunk'],
  
  // Web Scraping
  'Scrapy': ['Apify', 'Octoparse'],
  'Crawlee': ['Apify'],
  'Playwright': ['Selenium'],
  'Puppeteer': ['Selenium'],
  
  // PDF Generation
  'Gotenberg': ['DocRaptor', 'PDFShift'],
  'WeasyPrint': ['DocRaptor', 'Prince'],
  'wkhtmltopdf': ['PDFShift'],
  
  // Testing
  'Playwright Test': ['Cypress', 'Selenium'],
  'TestCafe': ['Cypress'],
  'Nightwatch.js': ['Cypress'],
  'Vitest': ['Jest'],
  
  // Load Testing
  'k6': ['LoadRunner', 'JMeter'],
  'Locust': ['LoadRunner'],
  'Gatling': ['LoadRunner'],
  'Artillery': ['LoadRunner'],
  
  // API Mocking
  'WireMock': ['Mockoon', 'Postman Mock'],
  'Prism': ['Stoplight'],
  'MockServer': ['Mockoon'],
  
  // API Documentation
  'Apicurio Registry': ['Confluent Schema Registry'],
  'Swagger UI': ['Postman Docs'],
  'Redoc': ['Postman Docs'],
  'Slate': ['ReadMe'],
  
  // Documentation
  'Docusaurus': ['GitBook', 'ReadMe'],
  'MkDocs': ['GitBook'],
  'VuePress': ['GitBook'],
  'Nextra': ['GitBook'],
  
  // UI Development
  'Storybook': ['Chromatic', 'Bit'],
  
  // Browser Extensions
  'Plasmo': ['Chrome Extension API'],
  'WXT': ['Chrome Extension API'],
  
  // Form & Validation
  'React Hook Form': ['Formik'],
  'Zod': ['Yup', 'Joi'],
  'Valibot': ['Yup', 'Joi', 'Ajv'],
  
  // State Management
  'Zustand': ['Redux'],
  'Jotai': ['Redux', 'Recoil'],
  'Valtio': ['Redux'],
  'XState': ['Redux'],
  'Pinia': ['Vuex'],
  
  // CSS Frameworks
  'UnoCSS': ['Tailwind CSS'],
  'Open Props': ['CSS Variables'],
  'PicoCSS': ['Bootstrap'],
  'Bulma': ['Bootstrap'],
  
  // UI Component Libraries
  'shadcn/ui': ['Material UI', 'Chakra UI'],
  'Radix UI': ['Material UI'],
  'Headless UI': ['Material UI'],
  'Ark UI': ['Radix UI'],
  'Mantine': ['Material UI', 'Chakra UI'],
  'Chakra UI': ['Material UI'],
  'DaisyUI': ['Bootstrap'],
  'Park UI': ['Material UI', 'Ant Design'],
  
  // Animation Libraries
  'GSAP': ['Framer Motion'],
  'Motion One': ['Framer Motion'],
  'Anime.js': ['Framer Motion', 'After Effects'],
  'Lottie': ['After Effects'],
  'Auto Animate': ['Framer Motion'],
  
  // Chart Libraries
  'Apache ECharts': ['Highcharts', 'Chart.js'],
  'Recharts': ['Chart.js'],
  'Plotly.js': ['Highcharts'],
  'Nivo': ['Chart.js'],
  'Visx': ['D3.js'],
  'Observable Plot': ['D3.js'],
  
  // Table Libraries
  'TanStack Table': ['AG Grid'],
  'Tabulator': ['AG Grid'],
  'Handsontable': ['Google Sheets', 'Excel'],
  
  // Rich Text Editors
  'Tiptap': ['TinyMCE', 'CKEditor'],
  'Lexical': ['Draft.js'],
  'Quill': ['TinyMCE'],
  'Editor.js': ['Medium Editor'],
  'ProseMirror': ['TinyMCE'],
  
  // Markdown Editors
  'Mark Text': ['Typora'],
  'Zettlr': ['Typora'],
  'massCode': ['Notion', 'Evernote'],
  
  // Git GUIs
  'GitUI': ['GitKraken', 'SourceTree'],
  'Lazygit': ['GitKraken'],
  'Fork': ['GitKraken'],
  'Sourcetree': ['GitKraken'],
  
  // Database GUIs
  'Redis Commander': ['RedisInsight'],
  'Another Redis Desktop Manager': ['RedisInsight'],
  'Mongo Express': ['MongoDB Compass'],
  
  // Storage GUIs
  'MinIO Console': ['AWS S3 Console'],
  'S3 Browser': ['AWS S3 Console'],
  
  // Container GUIs
  'Yacht': ['Rancher', 'Docker Desktop'],
  'K9s': ['Lens', 'Rancher'],
  'Headlamp': ['Lens'],
  
  // Security
  'OWASP ZAP': ['Burp Suite'],
  'Nuclei': ['Burp Suite'],
  
  // Email Testing
  'MailHog': ['Mailtrap'],
  'Mailpit': ['Mailtrap'],
  'Inbucket': ['Mailtrap'],
  
  // Marketing/Waitlist
  'Waitlist': ['LaunchRock'],
  'Affiliatly': ['Impact'],
  'Saleor Gift Cards': ['Shopify Gift Cards'],
  
  // Workflow/Pipeline
  'Prefect': ['Astronomer', 'AWS Step Functions'],
  'Dagster': ['Astronomer', 'Prefect Cloud'],
  'Kestra': ['Astronomer', 'Prefect Cloud'],
  
  // CLI Frameworks
  'Oclif': ['Commander.js'],
  'Ink': ['Blessed'],
  'Bubble Tea': ['Rich', 'ncurses'],
  'Charm': ['ncurses'],
  
  // Browsers
  'Firefox': ['Google Chrome'],
  'Brave': ['Google Chrome'],
  'Ladybird': ['Google Chrome'],
  
  // Mobile Apps
  'NewPipe': ['YouTube'],
  'Aegis Authenticator': ['Google Authenticator', 'Authy'],
};

async function updateAllAlternativesTo() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Get all proprietary software
    console.log('\n📁 Fetching proprietary software...');
    const allProprietarySoftware = await ProprietarySoftware.find().lean();
    console.log(`   Found ${allProprietarySoftware.length} proprietary software`);

    // Create a mapping from name (lowercase) to ObjectId
    const proprietaryMap = new Map<string, mongoose.Types.ObjectId>();
    for (const prop of allProprietarySoftware) {
      proprietaryMap.set(prop.name.toLowerCase(), prop._id);
      const slug = prop.slug.replace(/-/g, ' ');
      proprietaryMap.set(slug, prop._id);
      const simplified = prop.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      proprietaryMap.set(simplified, prop._id);
    }

    // Get all alternatives
    console.log('\n📁 Fetching all alternatives...');
    const allAlternatives = await Alternative.find().lean();
    console.log(`   Found ${allAlternatives.length} alternatives`);

    // Update alternatives
    console.log('\n🔄 Updating alternatives with alternative_to values...');
    let updatedCount = 0;
    let noMappingCount = 0;
    let alreadyHasCount = 0;

    for (const alt of allAlternatives) {
      // Check if we have a manual mapping for this alternative
      const mappings = manualAlternativeToMappings[alt.name];
      
      if (mappings && mappings.length > 0) {
        // Get ObjectIds for all mapped proprietary software
        const propIds: mongoose.Types.ObjectId[] = [];
        for (const propName of mappings) {
          const propId = proprietaryMap.get(propName.toLowerCase());
          if (propId) {
            propIds.push(propId);
          }
        }
        
        if (propIds.length > 0) {
          // Check if already has the same alternative_to
          const currentIds = (alt.alternative_to || []).map(id => id.toString());
          const newIds = propIds.map(id => id.toString());
          const isSame = currentIds.length === newIds.length && 
                         currentIds.every(id => newIds.includes(id));
          
          if (!isSame) {
            await Alternative.updateOne(
              { _id: alt._id },
              { $set: { alternative_to: propIds } }
            );
            updatedCount++;
            process.stdout.write(`\r   Updated ${updatedCount} alternatives`);
          } else {
            alreadyHasCount++;
          }
        } else {
          noMappingCount++;
        }
      } else if (!alt.alternative_to || alt.alternative_to.length === 0) {
        noMappingCount++;
      } else {
        alreadyHasCount++;
      }
    }

    console.log(`\n\n📊 Results:`);
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Already correct: ${alreadyHasCount}`);
    console.log(`   No mapping found: ${noMappingCount}`);

    // Show which alternatives still don't have mappings
    console.log('\n📋 Alternatives without alternative_to mappings:');
    const withoutMapping = await Alternative.find({ 
      $or: [
        { alternative_to: { $exists: false } },
        { alternative_to: { $size: 0 } }
      ]
    }).select('name').lean();
    
    console.log(`   Found ${withoutMapping.length} without mappings:`);
    withoutMapping.forEach(a => console.log(`   - ${a.name}`));

    console.log('\n🎉 Done!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

updateAllAlternativesTo();
