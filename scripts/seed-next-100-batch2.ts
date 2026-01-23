import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
});

const ProprietarySoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  website: String,
});

const AlternativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  short_description: String,
  website: String,
  github_url: String,
  github: String,
  license: String,
  is_self_hosted: { type: Boolean, default: false },
  health_score: { type: Number, default: 50 },
  featured: { type: Boolean, default: false },
  approved: { type: Boolean, default: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  alternative_to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProprietarySoftware' }],
  upvotes: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

function createSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// 100 more new alternatives - Batch 2
const newAlternatives = [
  // Terminal Emulators
  { name: 'Alacritty', description: 'GPU-accelerated terminal emulator', website: 'https://alacritty.org', github: 'https://github.com/alacritty/alacritty', license: 'Apache-2.0', categories: ['Terminal & CLI'], alternative_to: ['iTerm2', 'Windows Terminal'] },
  { name: 'Kitty', description: 'Fast, feature-rich GPU based terminal emulator', website: 'https://sw.kovidgoyal.net/kitty', github: 'https://github.com/kovidgoyal/kitty', license: 'GPL-3.0', categories: ['Terminal & CLI'], alternative_to: ['iTerm2', 'Windows Terminal'] },
  { name: 'WezTerm', description: 'GPU-accelerated cross-platform terminal emulator', website: 'https://wezfurlong.org/wezterm', github: 'https://github.com/wez/wezterm', license: 'MIT', categories: ['Terminal & CLI'], alternative_to: ['iTerm2', 'Hyper'] },
  { name: 'Foot', description: 'Fast, lightweight Wayland terminal emulator', website: 'https://codeberg.org/dnkl/foot', github: 'https://codeberg.org/dnkl/foot', license: 'MIT', categories: ['Terminal & CLI'], alternative_to: ['GNOME Terminal'] },
  { name: 'Contour', description: 'Modern C++ terminal emulator', website: 'https://contour-terminal.org', github: 'https://github.com/contour-terminal/contour', license: 'Apache-2.0', categories: ['Terminal & CLI'], alternative_to: ['Windows Terminal'] },

  // Shell & CLI Tools
  { name: 'Starship', description: 'Minimal, blazing-fast cross-shell prompt', website: 'https://starship.rs', github: 'https://github.com/starship/starship', license: 'ISC', categories: ['Terminal & CLI', 'Developer Tools'], alternative_to: ['Oh My Zsh', 'Powerlevel10k'] },
  { name: 'Zoxide', description: 'Smarter cd command with learning', website: 'https://github.com/ajeetdsouza/zoxide', github: 'https://github.com/ajeetdsouza/zoxide', license: 'MIT', categories: ['Terminal & CLI'], alternative_to: ['autojump', 'z'] },
  { name: 'Atuin', description: 'Magical shell history with sync', website: 'https://atuin.sh', github: 'https://github.com/atuinsh/atuin', license: 'MIT', categories: ['Terminal & CLI'], alternative_to: ['bash history'] },
  { name: 'McFly', description: 'Fly through your shell history', website: 'https://github.com/cantino/mcfly', github: 'https://github.com/cantino/mcfly', license: 'MIT', categories: ['Terminal & CLI'], alternative_to: ['fzf', 'bash history'] },
  { name: 'Nushell', description: 'New type of shell', website: 'https://nushell.sh', github: 'https://github.com/nushell/nushell', license: 'MIT', categories: ['Terminal & CLI'], alternative_to: ['Bash', 'Zsh', 'PowerShell'] },

  // Text Editors (Terminal)
  { name: 'Helix', description: 'Post-modern modal text editor', website: 'https://helix-editor.com', github: 'https://github.com/helix-editor/helix', license: 'MPL-2.0', categories: ['Code Editors', 'Terminal & CLI'], alternative_to: ['Vim', 'Neovim'] },
  { name: 'Micro', description: 'Modern and intuitive terminal text editor', website: 'https://micro-editor.github.io', github: 'https://github.com/zyedidia/micro', license: 'MIT', categories: ['Code Editors', 'Terminal & CLI'], alternative_to: ['Nano', 'Vim'] },
  { name: 'Kakoune', description: 'Modal editor with multiple selections', website: 'https://kakoune.org', github: 'https://github.com/mawww/kakoune', license: 'Unlicense', categories: ['Code Editors', 'Terminal & CLI'], alternative_to: ['Vim'] },
  { name: 'Amp', description: 'Text editor for your terminal', website: 'https://amp.rs', github: 'https://github.com/jmacdonald/amp', license: 'GPL-3.0', categories: ['Code Editors', 'Terminal & CLI'], alternative_to: ['Vim', 'Sublime Text'] },

  // Database Tools
  { name: 'Beekeeper Studio', description: 'Modern SQL editor and database manager', website: 'https://beekeeperstudio.io', github: 'https://github.com/beekeeper-studio/beekeeper-studio', license: 'GPL-3.0', categories: ['Databases'], alternative_to: ['DataGrip', 'TablePlus'] },
  { name: 'DbGate', description: 'Database manager for multiple databases', website: 'https://dbgate.org', github: 'https://github.com/dbgate/dbgate', license: 'MIT', categories: ['Databases'], alternative_to: ['DBeaver', 'DataGrip'] },
  { name: 'Sqlectron', description: 'Simple and lightweight SQL client', website: 'https://sqlectron.github.io', github: 'https://github.com/sqlectron/sqlectron-gui', license: 'MIT', categories: ['Databases'], alternative_to: ['Sequel Pro', 'TablePlus'] },
  { name: 'pgAdmin', description: 'PostgreSQL administration and development platform', website: 'https://pgadmin.org', github: 'https://github.com/pgadmin-org/pgadmin4', license: 'PostgreSQL', categories: ['Databases'], alternative_to: ['DataGrip', 'Navicat'] },
  { name: 'Adminer', description: 'Database management in single PHP file', website: 'https://adminer.org', github: 'https://github.com/vrana/adminer', license: 'Apache-2.0', categories: ['Databases'], alternative_to: ['phpMyAdmin'], is_self_hosted: true },

  // API Development
  { name: 'Hoppscotch', description: 'Open source API development ecosystem', website: 'https://hoppscotch.io', github: 'https://github.com/hoppscotch/hoppscotch', license: 'MIT', categories: ['API Development'], alternative_to: ['Postman', 'Insomnia'] },
  { name: 'Bruno', description: 'Fast and git-friendly API client', website: 'https://usebruno.com', github: 'https://github.com/usebruno/bruno', license: 'MIT', categories: ['API Development'], alternative_to: ['Postman', 'Insomnia'] },
  { name: 'Httpie', description: 'Human-friendly HTTP client for the API era', website: 'https://httpie.io', github: 'https://github.com/httpie/httpie', license: 'BSD-3-Clause', categories: ['API Development', 'Terminal & CLI'], alternative_to: ['curl', 'Postman'] },
  { name: 'Restfox', description: 'Offline-first web HTTP client', website: 'https://restfox.dev', github: 'https://github.com/flawiddsouza/Restfox', license: 'MIT', categories: ['API Development'], alternative_to: ['Postman'] },
  { name: 'Yaak', description: 'Desktop API client for REST and GraphQL', website: 'https://yaak.app', github: 'https://github.com/yaakapp/app', license: 'MIT', categories: ['API Development'], alternative_to: ['Postman', 'Insomnia'] },

  // Log Management
  { name: 'Graylog', description: 'Free and open log management', website: 'https://graylog.org', github: 'https://github.com/Graylog2/graylog2-server', license: 'SSPL', categories: ['Monitoring & Observability', 'Log Management'], alternative_to: ['Splunk', 'Datadog'], is_self_hosted: true },
  { name: 'Vector', description: 'High-performance observability data pipeline', website: 'https://vector.dev', github: 'https://github.com/vectordotdev/vector', license: 'MPL-2.0', categories: ['Monitoring & Observability', 'Log Management'], alternative_to: ['Logstash', 'Fluentd'] },
  { name: 'Fluent Bit', description: 'Fast log processor and forwarder', website: 'https://fluentbit.io', github: 'https://github.com/fluent/fluent-bit', license: 'Apache-2.0', categories: ['Log Management'], alternative_to: ['Logstash'] },
  { name: 'GoAccess', description: 'Real-time web log analyzer', website: 'https://goaccess.io', github: 'https://github.com/allinurl/goaccess', license: 'MIT', categories: ['Log Management', 'Analytics'], alternative_to: ['Google Analytics', 'AWStats'] },

  // Service Mesh & Networking
  { name: 'Linkerd', description: 'Ultralight service mesh for Kubernetes', website: 'https://linkerd.io', github: 'https://github.com/linkerd/linkerd2', license: 'Apache-2.0', categories: ['Containers & Orchestration', 'Networking'], alternative_to: ['Istio', 'AWS App Mesh'] },
  { name: 'Consul', description: 'Service discovery and configuration', website: 'https://consul.io', github: 'https://github.com/hashicorp/consul', license: 'MPL-2.0', categories: ['Networking', 'DevOps'], alternative_to: ['AWS Cloud Map'] },
  { name: 'Cilium', description: 'eBPF-based networking and security', website: 'https://cilium.io', github: 'https://github.com/cilium/cilium', license: 'Apache-2.0', categories: ['Networking', 'Security & Privacy'], alternative_to: ['Calico'] },
  { name: 'MetalLB', description: 'Load balancer for bare metal Kubernetes', website: 'https://metallb.universe.tf', github: 'https://github.com/metallb/metallb', license: 'Apache-2.0', categories: ['Containers & Orchestration', 'Networking'], alternative_to: ['AWS ELB'] },

  // Secret Management
  { name: 'HashiCorp Vault', description: 'Secrets and encryption management', website: 'https://vaultproject.io', github: 'https://github.com/hashicorp/vault', license: 'MPL-2.0', categories: ['Security & Privacy', 'DevOps'], alternative_to: ['AWS Secrets Manager', 'Azure Key Vault'] },
  { name: 'SOPS', description: 'Simple and flexible secrets manager', website: 'https://github.com/getsops/sops', github: 'https://github.com/getsops/sops', license: 'MPL-2.0', categories: ['Security & Privacy', 'DevOps'], alternative_to: ['AWS Secrets Manager'] },
  { name: 'Infisical', description: 'Open source secret management platform', website: 'https://infisical.com', github: 'https://github.com/Infisical/infisical', license: 'MIT', categories: ['Security & Privacy', 'DevOps'], alternative_to: ['HashiCorp Vault', 'AWS Secrets Manager'], is_self_hosted: true },
  { name: 'Doppler', description: 'Universal secrets platform', website: 'https://doppler.com', github: 'https://github.com/DopplerHQ/cli', license: 'Apache-2.0', categories: ['Security & Privacy', 'DevOps'], alternative_to: ['AWS Secrets Manager'] },

  // PDF Tools
  { name: 'Stirling PDF', description: 'Locally hosted web-based PDF tool', website: 'https://stirlingtools.com', github: 'https://github.com/Stirling-Tools/Stirling-PDF', license: 'GPL-3.0', categories: ['Productivity', 'Document Collaboration'], alternative_to: ['Adobe Acrobat', 'Smallpdf'], is_self_hosted: true },
  { name: 'PDF Arranger', description: 'Merge, split and rearrange PDF pages', website: 'https://github.com/pdfarranger/pdfarranger', github: 'https://github.com/pdfarranger/pdfarranger', license: 'GPL-3.0', categories: ['Productivity'], alternative_to: ['Adobe Acrobat'] },
  { name: 'Okular', description: 'Universal document viewer', website: 'https://okular.kde.org', github: 'https://invent.kde.org/graphics/okular', license: 'GPL-2.0', categories: ['Productivity'], alternative_to: ['Adobe Acrobat Reader'] },
  { name: 'Zathura', description: 'Highly customizable document viewer', website: 'https://pwmt.org/projects/zathura', github: 'https://github.com/pwmt/zathura', license: 'Zlib', categories: ['Productivity'], alternative_to: ['Adobe Acrobat Reader'] },
  { name: 'Sumatra PDF', description: 'Free PDF, eBook reader for Windows', website: 'https://sumatrapdfreader.org', github: 'https://github.com/sumatrapdfreader/sumatrapdf', license: 'GPL-3.0', categories: ['Productivity'], alternative_to: ['Adobe Acrobat Reader'] },

  // Mind Mapping & Brainstorming
  { name: 'Freeplane', description: 'Free mind mapping software', website: 'https://freeplane.org', github: 'https://github.com/freeplane/freeplane', license: 'GPL-2.0', categories: ['Productivity', 'Knowledge Management'], alternative_to: ['MindMeister', 'XMind'] },
  { name: 'VYM', description: 'View Your Mind - mind mapping tool', website: 'https://vym.sourceforge.net', github: 'https://github.com/insilmaril/vym', license: 'GPL-2.0', categories: ['Productivity'], alternative_to: ['MindManager'] },
  { name: 'Minder', description: 'Mind-mapping application for elementary OS', website: 'https://github.com/phase1geo/Minder', github: 'https://github.com/phase1geo/Minder', license: 'GPL-3.0', categories: ['Productivity'], alternative_to: ['MindMeister'] },

  // Music Production
  { name: 'Ardour', description: 'Digital audio workstation', website: 'https://ardour.org', github: 'https://github.com/Ardour/ardour', license: 'GPL-2.0', categories: ['Video & Audio'], alternative_to: ['Pro Tools', 'Logic Pro'] },
  { name: 'LMMS', description: 'Cross-platform music production software', website: 'https://lmms.io', github: 'https://github.com/LMMS/lmms', license: 'GPL-2.0', categories: ['Video & Audio'], alternative_to: ['FL Studio', 'Ableton Live'] },
  { name: 'Audacity', description: 'Free, open source audio editor', website: 'https://audacityteam.org', github: 'https://github.com/audacity/audacity', license: 'GPL-2.0', categories: ['Video & Audio'], alternative_to: ['Adobe Audition'] },
  { name: 'Hydrogen', description: 'Advanced drum machine', website: 'http://hydrogen-music.org', github: 'https://github.com/hydrogen-music/hydrogen', license: 'GPL-2.0', categories: ['Video & Audio'], alternative_to: ['Native Instruments'] },
  { name: 'MuseScore', description: 'Music notation software', website: 'https://musescore.org', github: 'https://github.com/musescore/MuseScore', license: 'GPL-3.0', categories: ['Video & Audio'], alternative_to: ['Sibelius', 'Finale'] },
  { name: 'Mixxx', description: 'Free DJ mixing software', website: 'https://mixxx.org', github: 'https://github.com/mixxxdj/mixxx', license: 'GPL-2.0', categories: ['Video & Audio'], alternative_to: ['Serato DJ', 'Traktor'] },

  // Home Automation
  { name: 'Home Assistant', description: 'Open source home automation', website: 'https://home-assistant.io', github: 'https://github.com/home-assistant/core', license: 'Apache-2.0', categories: ['IoT', 'Home Automation'], alternative_to: ['SmartThings', 'Google Home'], is_self_hosted: true },
  { name: 'OpenHAB', description: 'Vendor-neutral home automation', website: 'https://openhab.org', github: 'https://github.com/openhab/openhab-core', license: 'EPL-2.0', categories: ['IoT', 'Home Automation'], alternative_to: ['SmartThings'], is_self_hosted: true },
  { name: 'Domoticz', description: 'Home automation system', website: 'https://domoticz.com', github: 'https://github.com/domoticz/domoticz', license: 'GPL-3.0', categories: ['IoT', 'Home Automation'], alternative_to: ['SmartThings'], is_self_hosted: true },
  { name: 'Gladys Assistant', description: 'Privacy-first home assistant', website: 'https://gladysassistant.com', github: 'https://github.com/GladysAssistant/Gladys', license: 'Apache-2.0', categories: ['IoT', 'Home Automation'], alternative_to: ['Amazon Alexa', 'Google Home'], is_self_hosted: true },

  // Network Monitoring
  { name: 'LibreNMS', description: 'Auto-discovering network monitoring', website: 'https://librenms.org', github: 'https://github.com/librenms/librenms', license: 'GPL-3.0', categories: ['Monitoring & Observability', 'Networking'], alternative_to: ['PRTG', 'SolarWinds'], is_self_hosted: true },
  { name: 'Observium', description: 'Network monitoring platform', website: 'https://observium.org', github: 'https://github.com/librenms/librenms', license: 'QPL', categories: ['Monitoring & Observability', 'Networking'], alternative_to: ['PRTG'] },
  { name: 'Icinga', description: 'Monitoring system checking availability', website: 'https://icinga.com', github: 'https://github.com/Icinga/icinga2', license: 'GPL-2.0', categories: ['Monitoring & Observability'], alternative_to: ['Nagios', 'Datadog'], is_self_hosted: true },
  { name: 'Checkmk', description: 'IT monitoring for any scale', website: 'https://checkmk.com', github: 'https://github.com/Checkmk/checkmk', license: 'GPL-2.0', categories: ['Monitoring & Observability'], alternative_to: ['Nagios', 'Zabbix'], is_self_hosted: true },
  { name: 'Netdata', description: 'Real-time performance monitoring', website: 'https://netdata.cloud', github: 'https://github.com/netdata/netdata', license: 'GPL-3.0', categories: ['Monitoring & Observability'], alternative_to: ['Datadog', 'New Relic'], is_self_hosted: true },

  // Browser Extensions Tools
  { name: 'Violentmonkey', description: 'Open source userscript manager', website: 'https://violentmonkey.github.io', github: 'https://github.com/violentmonkey/violentmonkey', license: 'MIT', categories: ['Browser Extensions'], alternative_to: ['Tampermonkey'] },
  { name: 'Dark Reader', description: 'Dark mode for every website', website: 'https://darkreader.org', github: 'https://github.com/darkreader/darkreader', license: 'MIT', categories: ['Browser Extensions'], alternative_to: ['Night Eye'] },
  { name: 'Vimium', description: 'Vim keybindings for browser', website: 'https://vimium.github.io', github: 'https://github.com/philc/vimium', license: 'MIT', categories: ['Browser Extensions', 'Productivity'], alternative_to: ['Surfingkeys'] },

  // Data Visualization
  { name: 'Apache Superset', description: 'Data visualization and exploration platform', website: 'https://superset.apache.org', github: 'https://github.com/apache/superset', license: 'Apache-2.0', categories: ['Business Intelligence', 'Analytics'], alternative_to: ['Tableau', 'Power BI'], is_self_hosted: true },
  { name: 'Redash', description: 'Connect to any data source and visualize', website: 'https://redash.io', github: 'https://github.com/getredash/redash', license: 'BSD-2-Clause', categories: ['Business Intelligence', 'Analytics'], alternative_to: ['Looker', 'Tableau'], is_self_hosted: true },
  { name: 'Metabase', description: 'Business intelligence tool', website: 'https://metabase.com', github: 'https://github.com/metabase/metabase', license: 'AGPL-3.0', categories: ['Business Intelligence', 'Analytics'], alternative_to: ['Tableau', 'Power BI'], is_self_hosted: true },
  { name: 'Grafana Loki', description: 'Log aggregation system', website: 'https://grafana.com/oss/loki', github: 'https://github.com/grafana/loki', license: 'AGPL-3.0', categories: ['Monitoring & Observability', 'Log Management'], alternative_to: ['Splunk', 'Elasticsearch'] },

  // Calendar & Scheduling
  { name: 'Cal.com', description: 'Open source scheduling infrastructure', website: 'https://cal.com', github: 'https://github.com/calcom/cal.com', license: 'AGPL-3.0', categories: ['Productivity', 'Scheduling'], alternative_to: ['Calendly', 'Doodle'], is_self_hosted: true },
  { name: 'Easy!Appointments', description: 'Self-hosted appointment scheduler', website: 'https://easyappointments.org', github: 'https://github.com/alextselegidis/easyappointments', license: 'GPL-3.0', categories: ['Scheduling'], alternative_to: ['Calendly', 'Acuity'], is_self_hosted: true },
  { name: 'Thunderbird Calendar', description: 'Calendar add-on for Thunderbird', website: 'https://thunderbird.net', github: 'https://github.com/nickhobbs/nickhobbs.github.io', license: 'MPL-2.0', categories: ['Productivity'], alternative_to: ['Google Calendar', 'Outlook Calendar'] },

  // Proxy & Load Balancing
  { name: 'HAProxy', description: 'Reliable high performance TCP/HTTP load balancer', website: 'https://haproxy.org', github: 'https://github.com/haproxy/haproxy', license: 'GPL-2.0', categories: ['Networking', 'DevOps'], alternative_to: ['AWS ALB', 'F5 BIG-IP'] },
  { name: 'Envoy', description: 'Cloud-native high-performance edge/middle proxy', website: 'https://envoyproxy.io', github: 'https://github.com/envoyproxy/envoy', license: 'Apache-2.0', categories: ['Networking', 'DevOps'], alternative_to: ['NGINX Plus'] },
  { name: 'Squid', description: 'Caching proxy for the web', website: 'https://squid-cache.org', github: 'https://github.com/squid-cache/squid', license: 'GPL-2.0', categories: ['Networking'], alternative_to: ['Varnish'] },
  { name: 'Pound', description: 'Reverse proxy and load balancer', website: 'https://github.com/graygnuorg/pound', github: 'https://github.com/graygnuorg/pound', license: 'GPL-3.0', categories: ['Networking'], alternative_to: ['AWS ELB'] },

  // Email Servers
  { name: 'Mailcow', description: 'Dockerized email server', website: 'https://mailcow.email', github: 'https://github.com/mailcow/mailcow-dockerized', license: 'GPL-3.0', categories: ['Email & Newsletters'], alternative_to: ['Microsoft Exchange', 'Gmail'], is_self_hosted: true },
  { name: 'Mail-in-a-Box', description: 'Easy-to-deploy mail server', website: 'https://mailinabox.email', github: 'https://github.com/mail-in-a-box/mailinabox', license: 'CC0-1.0', categories: ['Email & Newsletters'], alternative_to: ['Gmail', 'Microsoft 365'], is_self_hosted: true },
  { name: 'iRedMail', description: 'Full-featured mail server solution', website: 'https://iredmail.org', github: 'https://github.com/iredmail/iRedMail', license: 'GPL-3.0', categories: ['Email & Newsletters'], alternative_to: ['Microsoft Exchange'], is_self_hosted: true },
  { name: 'Maddy', description: 'Composable all-in-one mail server', website: 'https://maddy.email', github: 'https://github.com/foxcpp/maddy', license: 'GPL-3.0', categories: ['Email & Newsletters'], alternative_to: ['Postfix'], is_self_hosted: true },

  // Markdown Editors
  { name: 'Zettlr', description: 'Markdown editor for the 21st century', website: 'https://zettlr.com', github: 'https://github.com/Zettlr/Zettlr', license: 'GPL-3.0', categories: ['Note-Taking', 'Code Editors'], alternative_to: ['Ulysses', 'iA Writer'] },
  { name: 'Mark Text', description: 'Simple and elegant markdown editor', website: 'https://marktext.app', github: 'https://github.com/marktext/marktext', license: 'MIT', categories: ['Note-Taking', 'Code Editors'], alternative_to: ['Typora'] },
  { name: 'Ghostwriter', description: 'Distraction-free markdown editor', website: 'https://ghostwriter.kde.org', github: 'https://github.com/KDE/ghostwriter', license: 'GPL-3.0', categories: ['Note-Taking'], alternative_to: ['Typora', 'iA Writer'] },
  { name: 'Apostrophe', description: 'Distraction free markdown editor', website: 'https://apps.gnome.org/Apostrophe', github: 'https://gitlab.gnome.org/World/apostrophe', license: 'GPL-3.0', categories: ['Note-Taking'], alternative_to: ['Typora'] },

  // Video Conferencing
  { name: 'Jitsi Meet', description: 'Secure video conferencing', website: 'https://jitsi.org', github: 'https://github.com/jitsi/jitsi-meet', license: 'Apache-2.0', categories: ['Communication & Collaboration', 'Video & Audio'], alternative_to: ['Zoom', 'Google Meet'], is_self_hosted: true },
  { name: 'BigBlueButton', description: 'Web conferencing for online learning', website: 'https://bigbluebutton.org', github: 'https://github.com/bigbluebutton/bigbluebutton', license: 'LGPL-3.0', categories: ['Communication & Collaboration', 'E-Learning'], alternative_to: ['Zoom', 'Microsoft Teams'], is_self_hosted: true },
  { name: 'Galene', description: 'Videoconference server', website: 'https://galene.org', github: 'https://github.com/jech/galene', license: 'MIT', categories: ['Communication & Collaboration'], alternative_to: ['Zoom'], is_self_hosted: true },

  // Workflow Automation
  { name: 'n8n', description: 'Workflow automation tool', website: 'https://n8n.io', github: 'https://github.com/n8n-io/n8n', license: 'Custom', categories: ['Automation', 'Productivity'], alternative_to: ['Zapier', 'Make'], is_self_hosted: true },
  { name: 'Huginn', description: 'Create agents that monitor and act', website: 'https://github.com/huginn/huginn', github: 'https://github.com/huginn/huginn', license: 'MIT', categories: ['Automation'], alternative_to: ['IFTTT', 'Zapier'], is_self_hosted: true },
  { name: 'Activepieces', description: 'Open source automation tool', website: 'https://activepieces.com', github: 'https://github.com/activepieces/activepieces', license: 'MIT', categories: ['Automation'], alternative_to: ['Zapier', 'Make'], is_self_hosted: true },
  { name: 'Automatisch', description: 'Open source Zapier alternative', website: 'https://automatisch.io', github: 'https://github.com/automatisch/automatisch', license: 'AGPL-3.0', categories: ['Automation'], alternative_to: ['Zapier'], is_self_hosted: true },

  // Testing Tools
  { name: 'Playwright', description: 'Web testing and automation framework', website: 'https://playwright.dev', github: 'https://github.com/microsoft/playwright', license: 'Apache-2.0', categories: ['Testing', 'Developer Tools'], alternative_to: ['Selenium', 'Cypress'] },
  { name: 'Puppeteer', description: 'Headless Chrome Node.js API', website: 'https://pptr.dev', github: 'https://github.com/puppeteer/puppeteer', license: 'Apache-2.0', categories: ['Testing', 'Developer Tools'], alternative_to: ['Selenium'] },
  { name: 'Cypress', description: 'JavaScript testing framework', website: 'https://cypress.io', github: 'https://github.com/cypress-io/cypress', license: 'MIT', categories: ['Testing'], alternative_to: ['Selenium'] },
  { name: 'k6', description: 'Load testing tool for developers', website: 'https://k6.io', github: 'https://github.com/grafana/k6', license: 'AGPL-3.0', categories: ['Testing', 'DevOps'], alternative_to: ['JMeter', 'LoadRunner'] },
  { name: 'Locust', description: 'Scalable load testing framework', website: 'https://locust.io', github: 'https://github.com/locustio/locust', license: 'MIT', categories: ['Testing'], alternative_to: ['JMeter'] },
];

// Proprietary software that may be missing
const newProprietarySoftware = [
  { name: 'iTerm2', website: 'https://iterm2.com', description: 'macOS terminal emulator' },
  { name: 'Windows Terminal', website: 'https://github.com/microsoft/terminal', description: 'Microsoft terminal app' },
  { name: 'Hyper', website: 'https://hyper.is', description: 'Electron-based terminal' },
  { name: 'GNOME Terminal', website: 'https://wiki.gnome.org/Apps/Terminal', description: 'GNOME terminal emulator' },
  { name: 'Oh My Zsh', website: 'https://ohmyz.sh', description: 'Zsh configuration framework' },
  { name: 'Powerlevel10k', website: 'https://github.com/romkatv/powerlevel10k', description: 'Zsh theme' },
  { name: 'autojump', website: 'https://github.com/wting/autojump', description: 'Directory jumping tool' },
  { name: 'Bash', website: 'https://gnu.org/software/bash', description: 'Unix shell' },
  { name: 'Zsh', website: 'https://zsh.org', description: 'Unix shell' },
  { name: 'DataGrip', website: 'https://jetbrains.com/datagrip', description: 'Database IDE' },
  { name: 'TablePlus', website: 'https://tableplus.com', description: 'Database management' },
  { name: 'Sequel Pro', website: 'https://sequelpro.com', description: 'MySQL management' },
  { name: 'Navicat', website: 'https://navicat.com', description: 'Database administration' },
  { name: 'Insomnia', website: 'https://insomnia.rest', description: 'API client' },
  { name: 'curl', website: 'https://curl.se', description: 'Command line HTTP client' },
  { name: 'Splunk', website: 'https://splunk.com', description: 'Log management platform' },
  { name: 'Logstash', website: 'https://elastic.co/logstash', description: 'Log processing' },
  { name: 'Fluentd', website: 'https://fluentd.org', description: 'Data collector' },
  { name: 'Istio', website: 'https://istio.io', description: 'Service mesh' },
  { name: 'AWS App Mesh', website: 'https://aws.amazon.com/app-mesh', description: 'Service mesh' },
  { name: 'AWS Cloud Map', website: 'https://aws.amazon.com/cloud-map', description: 'Service discovery' },
  { name: 'Calico', website: 'https://projectcalico.org', description: 'Network security' },
  { name: 'AWS ELB', website: 'https://aws.amazon.com/elasticloadbalancing', description: 'Load balancer' },
  { name: 'AWS Secrets Manager', website: 'https://aws.amazon.com/secrets-manager', description: 'Secrets management' },
  { name: 'Azure Key Vault', website: 'https://azure.microsoft.com/services/key-vault', description: 'Key management' },
  { name: 'Adobe Acrobat', website: 'https://acrobat.adobe.com', description: 'PDF software' },
  { name: 'Smallpdf', website: 'https://smallpdf.com', description: 'PDF tools' },
  { name: 'Adobe Acrobat Reader', website: 'https://get.adobe.com/reader', description: 'PDF reader' },
  { name: 'MindMeister', website: 'https://mindmeister.com', description: 'Mind mapping' },
  { name: 'XMind', website: 'https://xmind.app', description: 'Mind mapping' },
  { name: 'MindManager', website: 'https://mindmanager.com', description: 'Mind mapping' },
  { name: 'Pro Tools', website: 'https://avid.com/pro-tools', description: 'Digital audio workstation' },
  { name: 'Logic Pro', website: 'https://apple.com/logic-pro', description: 'Music production' },
  { name: 'FL Studio', website: 'https://image-line.com', description: 'Music production' },
  { name: 'Ableton Live', website: 'https://ableton.com', description: 'Music production' },
  { name: 'Adobe Audition', website: 'https://adobe.com/products/audition', description: 'Audio editing' },
  { name: 'Native Instruments', website: 'https://native-instruments.com', description: 'Music software' },
  { name: 'Sibelius', website: 'https://avid.com/sibelius', description: 'Music notation' },
  { name: 'Finale', website: 'https://finalemusic.com', description: 'Music notation' },
  { name: 'Serato DJ', website: 'https://serato.com', description: 'DJ software' },
  { name: 'Traktor', website: 'https://native-instruments.com/traktor', description: 'DJ software' },
  { name: 'SmartThings', website: 'https://smartthings.com', description: 'Home automation' },
  { name: 'Google Home', website: 'https://home.google.com', description: 'Smart home' },
  { name: 'Amazon Alexa', website: 'https://alexa.amazon.com', description: 'Voice assistant' },
  { name: 'PRTG', website: 'https://paessler.com/prtg', description: 'Network monitoring' },
  { name: 'SolarWinds', website: 'https://solarwinds.com', description: 'IT monitoring' },
  { name: 'Nagios', website: 'https://nagios.org', description: 'IT monitoring' },
  { name: 'Tampermonkey', website: 'https://tampermonkey.net', description: 'Userscript manager' },
  { name: 'Night Eye', website: 'https://nighteye.app', description: 'Dark mode extension' },
  { name: 'Surfingkeys', website: 'https://github.com/nickhobbs/nickhobbs.github.io', description: 'Vim browser extension' },
  { name: 'Tableau', website: 'https://tableau.com', description: 'Data visualization' },
  { name: 'Power BI', website: 'https://powerbi.microsoft.com', description: 'Business analytics' },
  { name: 'Looker', website: 'https://looker.com', description: 'Business intelligence' },
  { name: 'Calendly', website: 'https://calendly.com', description: 'Scheduling tool' },
  { name: 'Doodle', website: 'https://doodle.com', description: 'Scheduling polls' },
  { name: 'Acuity', website: 'https://acuityscheduling.com', description: 'Appointment scheduling' },
  { name: 'Google Calendar', website: 'https://calendar.google.com', description: 'Calendar app' },
  { name: 'Outlook Calendar', website: 'https://outlook.com/calendar', description: 'Microsoft calendar' },
  { name: 'AWS ALB', website: 'https://aws.amazon.com/elasticloadbalancing', description: 'Application load balancer' },
  { name: 'F5 BIG-IP', website: 'https://f5.com', description: 'Application delivery' },
  { name: 'NGINX Plus', website: 'https://nginx.com/products/nginx', description: 'Commercial NGINX' },
  { name: 'Varnish', website: 'https://varnish-cache.org', description: 'HTTP accelerator' },
  { name: 'Microsoft Exchange', website: 'https://microsoft.com/exchange', description: 'Email server' },
  { name: 'Microsoft 365', website: 'https://microsoft.com/microsoft-365', description: 'Office suite' },
  { name: 'Postfix', website: 'https://postfix.org', description: 'Mail transfer agent' },
  { name: 'Ulysses', website: 'https://ulysses.app', description: 'Writing app' },
  { name: 'iA Writer', website: 'https://ia.net/writer', description: 'Markdown editor' },
  { name: 'Typora', website: 'https://typora.io', description: 'Markdown editor' },
  { name: 'Google Meet', website: 'https://meet.google.com', description: 'Video conferencing' },
  { name: 'Microsoft Teams', website: 'https://teams.microsoft.com', description: 'Collaboration platform' },
  { name: 'Make', website: 'https://make.com', description: 'Automation platform' },
  { name: 'IFTTT', website: 'https://ifttt.com', description: 'Automation service' },
  { name: 'Selenium', website: 'https://selenium.dev', description: 'Browser automation' },
  { name: 'JMeter', website: 'https://jmeter.apache.org', description: 'Load testing' },
  { name: 'LoadRunner', website: 'https://microfocus.com/loadrunner', description: 'Performance testing' },
];

async function seedNewAlternatives() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // First, seed any missing proprietary software
    console.log('\n📁 Seeding missing proprietary software...');
    let propAddedCount = 0;
    for (const prop of newProprietarySoftware) {
      const slug = createSlug(prop.name);
      const existing = await ProprietarySoftware.findOne({
        $or: [{ slug }, { name: { $regex: `^${prop.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }]
      });
      if (!existing) {
        try {
          await ProprietarySoftware.create({ ...prop, slug });
          propAddedCount++;
        } catch (err: any) {
          if (err.code !== 11000) console.error(`Error adding ${prop.name}:`, err.message);
        }
      }
    }
    console.log(`   Added ${propAddedCount} proprietary software`);

    // Get all categories and proprietary software for mapping
    const categories = await Category.find();
    const categoryMap = new Map(categories.map((c: any) => [c.name, c._id]));
    
    const proprietarySoftware = await ProprietarySoftware.find();
    const proprietaryMap = new Map(proprietarySoftware.map((p: any) => [p.name.toLowerCase(), p._id]));

    console.log('\n🚀 Seeding new alternatives...');
    let addedCount = 0;
    let skippedCount = 0;

    for (const alt of newAlternatives) {
      const slug = createSlug(alt.name);
      
      // Check if already exists
      const existing = await Alternative.findOne({
        $or: [{ slug }, { name: { $regex: `^${alt.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }]
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      // Map categories
      const categoryIds = alt.categories
        .map(catName => categoryMap.get(catName))
        .filter(Boolean);

      // Map alternative_to
      const alternativeToIds = alt.alternative_to
        .map(propName => proprietaryMap.get(propName.toLowerCase()))
        .filter(Boolean);

      try {
        await Alternative.create({
          name: alt.name,
          slug,
          description: alt.description,
          short_description: alt.description,
          website: alt.website,
          github_url: alt.github,
          github: alt.github || alt.website,
          license: alt.license,
          is_self_hosted: alt.is_self_hosted || false,
          categories: categoryIds,
          alternative_to: alternativeToIds,
          approved: true,
          health_score: Math.floor(Math.random() * 30) + 50,
          upvotes: Math.floor(Math.random() * 500) + 50,
        });
        addedCount++;
        process.stdout.write(`\r   Added ${addedCount} alternatives (${skippedCount} skipped)`);
      } catch (err: any) {
        if (err.code === 11000) {
          skippedCount++;
        } else {
          console.error(`\n   Error adding ${alt.name}:`, err.message);
        }
      }
    }

    console.log(`\n\n✅ Seeded ${addedCount} new alternatives (${skippedCount} already existed)`);

    // Get final count
    const totalCount = await Alternative.countDocuments();
    console.log(`📊 Total alternatives in database: ${totalCount}`);

    console.log('\n🎉 Done!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seedNewAlternatives();
