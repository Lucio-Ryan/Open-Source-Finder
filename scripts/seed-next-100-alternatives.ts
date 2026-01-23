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

// 100 new alternatives
const newAlternatives = [
  // Programming Languages & Runtimes
  { name: 'Zig', description: 'General-purpose programming language', website: 'https://ziglang.org', github: 'https://github.com/ziglang/zig', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['C', 'C++'] },
  { name: 'Gleam', description: 'Friendly language for building type-safe systems', website: 'https://gleam.run', github: 'https://github.com/gleam-lang/gleam', license: 'Apache-2.0', categories: ['Developer Tools'], alternative_to: ['Elixir', 'Erlang'] },
  { name: 'Crystal', description: 'Programming language with Ruby-like syntax', website: 'https://crystal-lang.org', github: 'https://github.com/crystal-lang/crystal', license: 'Apache-2.0', categories: ['Developer Tools'], alternative_to: ['Ruby'] },
  { name: 'Nim', description: 'Statically typed compiled systems language', website: 'https://nim-lang.org', github: 'https://github.com/nim-lang/Nim', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['Python', 'C'] },
  { name: 'V', description: 'Simple, fast, safe compiled language', website: 'https://vlang.io', github: 'https://github.com/vlang/v', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['Go', 'C'] },
  { name: 'Odin', description: 'Data-oriented programming language', website: 'https://odin-lang.org', github: 'https://github.com/odin-lang/Odin', license: 'BSD-3-Clause', categories: ['Developer Tools'], alternative_to: ['C', 'C++'] },
  
  // File Sync & Backup
  { name: 'Syncthing', description: 'Continuous file synchronization', website: 'https://syncthing.net', github: 'https://github.com/syncthing/syncthing', license: 'MPL-2.0', categories: ['Productivity', 'Backup & Recovery'], alternative_to: ['Dropbox', 'Google Drive'], is_self_hosted: true },
  { name: 'Rclone', description: 'Command-line cloud storage manager', website: 'https://rclone.org', github: 'https://github.com/rclone/rclone', license: 'MIT', categories: ['Backup & Recovery', 'Developer Tools'], alternative_to: ['Dropbox', 'AWS S3'] },
  { name: 'Duplicacy', description: 'Cloud backup tool with deduplication', website: 'https://duplicacy.com', github: 'https://github.com/gilbertchen/duplicacy', license: 'Custom', categories: ['Backup & Recovery'], alternative_to: ['Backblaze', 'CrashPlan'], is_self_hosted: true },
  { name: 'Kopia', description: 'Fast and secure backup tool', website: 'https://kopia.io', github: 'https://github.com/kopia/kopia', license: 'Apache-2.0', categories: ['Backup & Recovery'], alternative_to: ['Backblaze', 'Duplicati'], is_self_hosted: true },

  // Media Servers & Streaming
  { name: 'Navidrome', description: 'Modern music server and streamer', website: 'https://navidrome.org', github: 'https://github.com/navidrome/navidrome', license: 'GPL-3.0', categories: ['Video & Audio'], alternative_to: ['Spotify', 'Apple Music'], is_self_hosted: true },
  { name: 'Funkwhale', description: 'Social platform to enjoy and share music', website: 'https://funkwhale.audio', github: 'https://github.com/funkwhale/funkwhale', license: 'AGPL-3.0', categories: ['Video & Audio', 'Social Media'], alternative_to: ['Spotify', 'SoundCloud'], is_self_hosted: true },
  { name: 'Ampache', description: 'Web based audio/video streaming', website: 'https://ampache.org', github: 'https://github.com/ampache/ampache', license: 'AGPL-3.0', categories: ['Video & Audio'], alternative_to: ['Spotify', 'Plex'], is_self_hosted: true },
  { name: 'Airsonic', description: 'Free web-based media streamer', website: 'https://airsonic.github.io', github: 'https://github.com/airsonic/airsonic', license: 'GPL-3.0', categories: ['Video & Audio'], alternative_to: ['Plex', 'Spotify'], is_self_hosted: true },
  { name: 'Dim', description: 'Self-hosted media manager', website: 'https://github.com/Dusk-Labs/dim', github: 'https://github.com/Dusk-Labs/dim', license: 'GPL-3.0', categories: ['Video & Audio'], alternative_to: ['Plex', 'Emby'], is_self_hosted: true },

  // Search Engines
  { name: 'SearXNG', description: 'Privacy-respecting metasearch engine', website: 'https://docs.searxng.org', github: 'https://github.com/searxng/searxng', license: 'AGPL-3.0', categories: ['Security & Privacy'], alternative_to: ['Google Search', 'Bing'], is_self_hosted: true },
  { name: 'Whoogle', description: 'Self-hosted Google search proxy', website: 'https://github.com/benbusby/whoogle-search', github: 'https://github.com/benbusby/whoogle-search', license: 'MIT', categories: ['Security & Privacy'], alternative_to: ['Google Search'], is_self_hosted: true },
  { name: 'YaCy', description: 'Decentralized web search engine', website: 'https://yacy.net', github: 'https://github.com/yacy/yacy_search_server', license: 'GPL-2.0', categories: ['Security & Privacy'], alternative_to: ['Google Search', 'Bing'], is_self_hosted: true },

  // Communication & Social
  { name: 'Matrix', description: 'Open standard for decentralized communication', website: 'https://matrix.org', github: 'https://github.com/matrix-org/synapse', license: 'Apache-2.0', categories: ['Communication & Collaboration'], alternative_to: ['Slack', 'Discord'], is_self_hosted: true },
  { name: 'XMPP', description: 'Open messaging and presence protocol', website: 'https://xmpp.org', github: 'https://github.com/xsf/xmpp.org', license: 'MIT', categories: ['Communication & Collaboration'], alternative_to: ['WhatsApp', 'Telegram'] },
  { name: 'Matterbridge', description: 'Bridge between chat protocols', website: 'https://github.com/42wim/matterbridge', github: 'https://github.com/42wim/matterbridge', license: 'Apache-2.0', categories: ['Communication & Collaboration'], alternative_to: ['Slack', 'Discord'] },
  { name: 'Mumble', description: 'Low-latency voice chat', website: 'https://mumble.info', github: 'https://github.com/mumble-voip/mumble', license: 'BSD-3-Clause', categories: ['Communication & Collaboration', 'Video & Audio'], alternative_to: ['Discord', 'TeamSpeak'], is_self_hosted: true },
  { name: 'Jami', description: 'Distributed communication platform', website: 'https://jami.net', github: 'https://github.com/savoirfairelinux/jami-project', license: 'GPL-3.0', categories: ['Communication & Collaboration'], alternative_to: ['Skype', 'Zoom'] },

  // Photo Management
  { name: 'LibrePhotos', description: 'Self-hosted photo management', website: 'https://github.com/LibrePhotos/librephotos', github: 'https://github.com/LibrePhotos/librephotos', license: 'MIT', categories: ['Digital Asset Management'], alternative_to: ['Google Photos', 'iCloud Photos'], is_self_hosted: true },
  { name: 'Photoview', description: 'Simple photo gallery for personal servers', website: 'https://photoview.github.io', github: 'https://github.com/photoview/photoview', license: 'AGPL-3.0', categories: ['Digital Asset Management'], alternative_to: ['Google Photos'], is_self_hosted: true },
  { name: 'Piwigo', description: 'Photo gallery software for the web', website: 'https://piwigo.org', github: 'https://github.com/Piwigo/Piwigo', license: 'GPL-2.0', categories: ['Digital Asset Management'], alternative_to: ['Flickr', 'Google Photos'], is_self_hosted: true },
  { name: 'Pigallery2', description: 'Fast directory-first photo gallery', website: 'https://bpatrik.github.io/pigallery2', github: 'https://github.com/bpatrik/pigallery2', license: 'MIT', categories: ['Digital Asset Management'], alternative_to: ['Google Photos'], is_self_hosted: true },

  // Video Editing & Processing
  { name: 'DaVinci Resolve', description: 'Professional video editing software', website: 'https://blackmagicdesign.com/products/davinciresolve', github: '', license: 'Proprietary-Free', categories: ['Video & Audio'], alternative_to: ['Adobe Premiere Pro', 'Final Cut Pro'] },
  { name: 'Flowblade', description: 'Multitrack non-linear video editor', website: 'https://jliljebl.github.io/flowblade', github: 'https://github.com/jliljebl/flowblade', license: 'GPL-3.0', categories: ['Video & Audio'], alternative_to: ['Adobe Premiere Pro'] },
  { name: 'Pitivi', description: 'Free video editor with intuitive interface', website: 'https://pitivi.org', github: 'https://gitlab.gnome.org/GNOME/pitivi', license: 'LGPL-2.1', categories: ['Video & Audio'], alternative_to: ['iMovie'] },
  { name: 'Avidemux', description: 'Free video editor for cutting and encoding', website: 'http://avidemux.sourceforge.net', github: 'https://github.com/mean00/avidemux2', license: 'GPL-2.0', categories: ['Video & Audio'], alternative_to: ['Adobe Premiere Pro'] },

  // Game Development
  { name: 'Stride', description: '3D game engine written in C#', website: 'https://stride3d.net', github: 'https://github.com/stride3d/stride', license: 'MIT', categories: ['3D & Animation', 'Developer Tools'], alternative_to: ['Unity', 'Unreal Engine'] },
  { name: 'Flax Engine', description: 'Multi-platform 3D game engine', website: 'https://flaxengine.com', github: 'https://github.com/FlaxEngine/FlaxEngine', license: 'Custom', categories: ['3D & Animation', 'Developer Tools'], alternative_to: ['Unity', 'Unreal Engine'] },
  { name: 'GDevelop', description: 'Open-source 2D game development', website: 'https://gdevelop.io', github: 'https://github.com/4ian/GDevelop', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['GameMaker', 'Construct'] },
  { name: 'LÖVE', description: '2D game framework for Lua', website: 'https://love2d.org', github: 'https://github.com/love2d/love', license: 'Zlib', categories: ['Developer Tools'], alternative_to: ['Unity', 'GameMaker'] },
  { name: 'Cocos2d-x', description: 'Cross-platform game development framework', website: 'https://cocos.com', github: 'https://github.com/cocos2d/cocos2d-x', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['Unity'] },

  // 3D Modeling & CAD
  { name: 'Blender', description: '3D creation suite', website: 'https://blender.org', github: 'https://github.com/blender/blender', license: 'GPL-3.0', categories: ['3D & Animation', 'Video & Audio'], alternative_to: ['Maya', '3ds Max', 'Cinema 4D'] },
  { name: 'Wings 3D', description: 'Subdivision modeler', website: 'http://wings3d.com', github: 'https://github.com/dgud/wings', license: 'BSD-2-Clause', categories: ['3D & Animation'], alternative_to: ['3ds Max'] },
  { name: 'MakeHuman', description: 'Open source 3D human modeler', website: 'http://makehumancommunity.org', github: 'https://github.com/makehumancommunity/makehuman', license: 'AGPL-3.0', categories: ['3D & Animation'], alternative_to: ['Character Creator'] },
  { name: 'Dust3D', description: 'Quick 3D modeling software', website: 'https://dust3d.org', github: 'https://github.com/huxingyi/dust3d', license: 'MIT', categories: ['3D & Animation'], alternative_to: ['ZBrush'] },

  // Password & Secrets Management
  { name: 'Passbolt', description: 'Team password manager', website: 'https://passbolt.com', github: 'https://github.com/passbolt/passbolt_api', license: 'AGPL-3.0', categories: ['Password Management', 'Security & Privacy'], alternative_to: ['1Password', 'LastPass'], is_self_hosted: true },
  { name: 'Padloc', description: 'Modern password manager', website: 'https://padloc.app', github: 'https://github.com/padloc/padloc', license: 'GPL-3.0', categories: ['Password Management'], alternative_to: ['1Password', 'LastPass'] },
  { name: 'Buttercup', description: 'Cross-platform password manager', website: 'https://buttercup.pw', github: 'https://github.com/buttercup/buttercup-desktop', license: 'GPL-3.0', categories: ['Password Management'], alternative_to: ['1Password', 'LastPass'] },
  { name: 'Psono', description: 'Enterprise password manager', website: 'https://psono.com', github: 'https://github.com/psono/psono-server', license: 'Apache-2.0', categories: ['Password Management', 'Security & Privacy'], alternative_to: ['1Password Teams', 'Dashlane'], is_self_hosted: true },

  // Email Clients
  { name: 'Betterbird', description: 'Fine-tuned Thunderbird fork', website: 'https://betterbird.eu', github: 'https://github.com/nickhobbs/nickhobbs.github.io', license: 'MPL-2.0', categories: ['Email & Newsletters'], alternative_to: ['Outlook', 'Gmail'] },
  { name: 'Claws Mail', description: 'Lightweight email client', website: 'https://claws-mail.org', github: 'https://github.com/nickhobbs/nickhobbs.github.io', license: 'GPL-3.0', categories: ['Email & Newsletters'], alternative_to: ['Outlook'] },
  { name: 'Evolution', description: 'Personal information management application', website: 'https://wiki.gnome.org/Apps/Evolution', github: 'https://gitlab.gnome.org/GNOME/evolution', license: 'LGPL-2.1', categories: ['Email & Newsletters', 'Productivity'], alternative_to: ['Outlook'] },
  { name: 'Geary', description: 'Lightweight email client for GNOME', website: 'https://wiki.gnome.org/Apps/Geary', github: 'https://gitlab.gnome.org/GNOME/geary', license: 'LGPL-2.1', categories: ['Email & Newsletters'], alternative_to: ['Apple Mail', 'Outlook'] },
  { name: 'Nylas Mail', description: 'Extensible email client', website: 'https://github.com/nylas/nylas-mail', github: 'https://github.com/nylas/nylas-mail', license: 'GPL-3.0', categories: ['Email & Newsletters'], alternative_to: ['Outlook', 'Spark'] },

  // Presentation & Documents
  { name: 'Impress.js', description: 'Presentation framework based on CSS3 transforms', website: 'https://impress.js.org', github: 'https://github.com/impress/impress.js', license: 'MIT', categories: ['Productivity', 'Developer Tools'], alternative_to: ['PowerPoint', 'Prezi'] },
  { name: 'Deck.js', description: 'Modern HTML presentation framework', website: 'http://imakewebthings.com/deck.js', github: 'https://github.com/imakewebthings/deck.js', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['PowerPoint'] },
  { name: 'WebSlides', description: 'Create beautiful HTML presentations', website: 'https://webslides.tv', github: 'https://github.com/webslides/WebSlides', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['PowerPoint', 'Google Slides'] },
  { name: 'Spectacle', description: 'React-based presentation library', website: 'https://formidable.com/open-source/spectacle', github: 'https://github.com/FormidableLabs/spectacle', license: 'MIT', categories: ['Developer Tools'], alternative_to: ['PowerPoint'] },

  // File Managers
  { name: 'Thunar', description: 'Modern file manager for Xfce', website: 'https://docs.xfce.org/xfce/thunar/start', github: 'https://gitlab.xfce.org/xfce/thunar', license: 'GPL-2.0', categories: ['Productivity'], alternative_to: ['Windows Explorer', 'Finder'] },
  { name: 'Nemo', description: 'File manager for Cinnamon', website: 'https://github.com/linuxmint/nemo', github: 'https://github.com/linuxmint/nemo', license: 'GPL-2.0', categories: ['Productivity'], alternative_to: ['Windows Explorer', 'Finder'] },
  { name: 'PCManFM', description: 'Extremely fast and lightweight file manager', website: 'https://wiki.lxde.org/en/PCManFM', github: 'https://github.com/lxde/pcmanfm', license: 'GPL-2.0', categories: ['Productivity'], alternative_to: ['Windows Explorer'] },
  { name: 'Double Commander', description: 'Cross-platform dual-pane file manager', website: 'https://doublecmd.sourceforge.io', github: 'https://github.com/doublecmd/doublecmd', license: 'GPL-2.0', categories: ['Productivity'], alternative_to: ['Total Commander'] },
  { name: 'SpaceFM', description: 'Multi-panel tabbed file manager', website: 'https://ignorantguru.github.io/spacefm', github: 'https://github.com/IgnorantGuru/spacefm', license: 'GPL-3.0', categories: ['Productivity'], alternative_to: ['Windows Explorer'] },

  // System Monitoring
  { name: 'Glances', description: 'Cross-platform system monitoring tool', website: 'https://nicolargo.github.io/glances', github: 'https://github.com/nicolargo/glances', license: 'LGPL-3.0', categories: ['Monitoring & Observability'], alternative_to: ['Task Manager', 'Activity Monitor'] },
  { name: 'htop', description: 'Interactive process viewer', website: 'https://htop.dev', github: 'https://github.com/htop-dev/htop', license: 'GPL-2.0', categories: ['Monitoring & Observability', 'Terminal & CLI'], alternative_to: ['Task Manager'] },
  { name: 'btop', description: 'Resource monitor with responsive interface', website: 'https://github.com/aristocratos/btop', github: 'https://github.com/aristocratos/btop', license: 'Apache-2.0', categories: ['Monitoring & Observability', 'Terminal & CLI'], alternative_to: ['Task Manager'] },
  { name: 'Conky', description: 'System monitor for X', website: 'https://github.com/brndnmtthws/conky', github: 'https://github.com/brndnmtthws/conky', license: 'GPL-3.0', categories: ['Monitoring & Observability'], alternative_to: ['Rainmeter'] },
  { name: 'Stacer', description: 'Linux system optimizer and monitoring', website: 'https://oguzhaninan.github.io/Stacer-Web', github: 'https://github.com/oguzhaninan/Stacer', license: 'GPL-3.0', categories: ['Monitoring & Observability'], alternative_to: ['CCleaner'] },

  // DNS & Network Tools
  { name: 'dnscrypt-proxy', description: 'DNS proxy with encryption', website: 'https://dnscrypt.info', github: 'https://github.com/DNSCrypt/dnscrypt-proxy', license: 'ISC', categories: ['Security & Privacy', 'Networking'], alternative_to: ['Cloudflare DNS', 'Google DNS'] },
  { name: 'Unbound', description: 'Validating, recursive DNS resolver', website: 'https://nlnetlabs.nl/projects/unbound', github: 'https://github.com/NLnetLabs/unbound', license: 'BSD-3-Clause', categories: ['Networking', 'Security & Privacy'], alternative_to: ['Google DNS'] },
  { name: 'Knot DNS', description: 'High-performance DNS server', website: 'https://knot-dns.cz', github: 'https://gitlab.nic.cz/knot/knot-dns', license: 'GPL-3.0', categories: ['Networking'], alternative_to: ['BIND', 'AWS Route 53'] },
  { name: 'NSD', description: 'Authoritative DNS name server', website: 'https://nlnetlabs.nl/projects/nsd', github: 'https://github.com/NLnetLabs/nsd', license: 'BSD-3-Clause', categories: ['Networking'], alternative_to: ['BIND'] },

  // VPN & Tunneling
  { name: 'OpenVPN', description: 'Open source VPN solution', website: 'https://openvpn.net', github: 'https://github.com/OpenVPN/openvpn', license: 'GPL-2.0', categories: ['VPN & Networking', 'Security & Privacy'], alternative_to: ['NordVPN', 'ExpressVPN'], is_self_hosted: true },
  { name: 'SoftEther VPN', description: 'Multi-protocol VPN software', website: 'https://softether.org', github: 'https://github.com/SoftEtherVPN/SoftEtherVPN', license: 'Apache-2.0', categories: ['VPN & Networking'], alternative_to: ['Cisco AnyConnect'], is_self_hosted: true },
  { name: 'Algo VPN', description: 'Set up a personal VPN in the cloud', website: 'https://github.com/trailofbits/algo', github: 'https://github.com/trailofbits/algo', license: 'AGPL-3.0', categories: ['VPN & Networking', 'Security & Privacy'], alternative_to: ['NordVPN'] },
  { name: 'Outline VPN', description: 'Easy to use VPN by Jigsaw', website: 'https://getoutline.org', github: 'https://github.com/Jigsaw-Code/outline-server', license: 'Apache-2.0', categories: ['VPN & Networking', 'Security & Privacy'], alternative_to: ['NordVPN', 'ExpressVPN'] },

  // Torrent Clients
  { name: 'Transmission', description: 'Fast, easy, free BitTorrent client', website: 'https://transmissionbt.com', github: 'https://github.com/transmission/transmission', license: 'GPL-2.0', categories: ['File Transfer'], alternative_to: ['uTorrent', 'BitTorrent'] },
  { name: 'Aria2', description: 'Lightweight multi-protocol download utility', website: 'https://aria2.github.io', github: 'https://github.com/aria2/aria2', license: 'GPL-2.0', categories: ['File Transfer', 'Terminal & CLI'], alternative_to: ['Internet Download Manager'] },
  { name: 'Flood', description: 'Modern web UI for torrent clients', website: 'https://flood.js.org', github: 'https://github.com/jesec/flood', license: 'GPL-3.0', categories: ['File Transfer'], alternative_to: ['uTorrent'] },
  { name: 'Rutorrent', description: 'Web front-end for rTorrent', website: 'https://github.com/Novik/ruTorrent', github: 'https://github.com/Novik/ruTorrent', license: 'GPL-3.0', categories: ['File Transfer'], alternative_to: ['uTorrent'], is_self_hosted: true },

  // Screenshot & Recording
  { name: 'Flameshot', description: 'Powerful screenshot software', website: 'https://flameshot.org', github: 'https://github.com/flameshot-org/flameshot', license: 'GPL-3.0', categories: ['Productivity'], alternative_to: ['Snagit', 'Greenshot'] },
  { name: 'Ksnip', description: 'Cross-platform screenshot utility', website: 'https://github.com/ksnip/ksnip', github: 'https://github.com/ksnip/ksnip', license: 'GPL-2.0', categories: ['Productivity'], alternative_to: ['Snagit'] },
  { name: 'Spectacle', description: 'KDE screenshot capture utility', website: 'https://apps.kde.org/spectacle', github: 'https://invent.kde.org/graphics/spectacle', license: 'GPL-2.0', categories: ['Productivity'], alternative_to: ['Snipping Tool'] },
  { name: 'SimpleScreenRecorder', description: 'Feature-rich screen recorder', website: 'https://maartenbaert.be/simplescreenrecorder', github: 'https://github.com/MaartenBaert/ssr', license: 'GPL-3.0', categories: ['Video & Audio'], alternative_to: ['Camtasia', 'ScreenFlow'] },
  { name: 'Peek', description: 'Simple animated GIF recorder', website: 'https://github.com/phw/peek', github: 'https://github.com/phw/peek', license: 'GPL-3.0', categories: ['Video & Audio'], alternative_to: ['LICEcap', 'Gifox'] },

  // Image Editing
  { name: 'RawTherapee', description: 'Raw image processing software', website: 'https://rawtherapee.com', github: 'https://github.com/Beep6581/RawTherapee', license: 'GPL-3.0', categories: ['Photo Editing'], alternative_to: ['Adobe Lightroom'] },
  { name: 'digiKam', description: 'Professional photo management', website: 'https://digikam.org', github: 'https://invent.kde.org/graphics/digikam', license: 'GPL-2.0', categories: ['Photo Editing', 'Digital Asset Management'], alternative_to: ['Adobe Lightroom', 'Google Photos'] },
  { name: 'GIMP', description: 'GNU Image Manipulation Program', website: 'https://gimp.org', github: 'https://gitlab.gnome.org/GNOME/gimp', license: 'GPL-3.0', categories: ['Photo Editing', 'Graphic Design'], alternative_to: ['Adobe Photoshop'] },
  { name: 'Photopea', description: 'Online photo editor', website: 'https://photopea.com', github: '', license: 'Proprietary-Free', categories: ['Photo Editing'], alternative_to: ['Adobe Photoshop'] },
  { name: 'Paint.NET', description: 'Image and photo editing software', website: 'https://getpaint.net', github: '', license: 'Proprietary-Free', categories: ['Photo Editing'], alternative_to: ['Adobe Photoshop'] },

  // Office & Productivity
  { name: 'Cryptpad', description: 'Encrypted collaboration suite', website: 'https://cryptpad.fr', github: 'https://github.com/xwiki-labs/cryptpad', license: 'AGPL-3.0', categories: ['Productivity', 'Document Collaboration'], alternative_to: ['Google Docs', 'Microsoft Office'], is_self_hosted: true },
  { name: 'OnlyOffice', description: 'Office suite for collaborative work', website: 'https://onlyoffice.com', github: 'https://github.com/ONLYOFFICE/DocumentServer', license: 'AGPL-3.0', categories: ['Productivity'], alternative_to: ['Microsoft Office', 'Google Docs'], is_self_hosted: true },
  { name: 'Etherpad', description: 'Real-time collaborative document editor', website: 'https://etherpad.org', github: 'https://github.com/ether/etherpad-lite', license: 'Apache-2.0', categories: ['Document Collaboration'], alternative_to: ['Google Docs'], is_self_hosted: true },
  { name: 'HedgeDoc', description: 'Collaborative markdown editor', website: 'https://hedgedoc.org', github: 'https://github.com/hedgedoc/hedgedoc', license: 'AGPL-3.0', categories: ['Document Collaboration', 'Knowledge Management'], alternative_to: ['HackMD', 'Notion'], is_self_hosted: true },

  // Diagrams & Flowcharts
  { name: 'Drawio', description: 'Diagramming application', website: 'https://draw.io', github: 'https://github.com/jgraph/drawio', license: 'Apache-2.0', categories: ['Prototyping & Wireframing'], alternative_to: ['Lucidchart', 'Microsoft Visio'] },
  { name: 'Mermaid', description: 'Generate diagrams from text', website: 'https://mermaid.js.org', github: 'https://github.com/mermaid-js/mermaid', license: 'MIT', categories: ['Developer Tools', 'Documentation'], alternative_to: ['Lucidchart'] },
  { name: 'PlantUML', description: 'Generate UML diagrams from text', website: 'https://plantuml.com', github: 'https://github.com/plantuml/plantuml', license: 'GPL-3.0', categories: ['Developer Tools', 'Documentation'], alternative_to: ['Visio', 'Lucidchart'] },
  { name: 'Diagrams', description: 'Diagram as code for cloud infrastructure', website: 'https://diagrams.mingrammer.com', github: 'https://github.com/mingrammer/diagrams', license: 'MIT', categories: ['Developer Tools', 'Documentation'], alternative_to: ['Cloudcraft'] },

  // Financial & Budgeting
  { name: 'GnuCash', description: 'Personal and small-business financial accounting', website: 'https://gnucash.org', github: 'https://github.com/Gnucash/gnucash', license: 'GPL-2.0', categories: ['Finance & Accounting'], alternative_to: ['QuickBooks', 'Quicken'] },
  { name: 'HomeBank', description: 'Free personal finance software', website: 'http://homebank.free.fr', github: 'https://github.com/SobuHiro/homebank', license: 'GPL-2.0', categories: ['Finance & Accounting'], alternative_to: ['Mint', 'Quicken'] },
  { name: 'Money Manager Ex', description: 'Easy to use financial management', website: 'https://moneymanagerex.org', github: 'https://github.com/moneymanagerex/moneymanagerex', license: 'GPL-2.0', categories: ['Finance & Accounting'], alternative_to: ['Quicken', 'Mint'] },
  { name: 'Skrooge', description: 'Personal finance manager for KDE', website: 'https://skrooge.org', github: 'https://invent.kde.org/office/skrooge', license: 'GPL-2.0', categories: ['Finance & Accounting'], alternative_to: ['Quicken'] },

  // Feed Readers & Aggregators
  { name: 'Fluent Reader', description: 'Modern desktop RSS reader', website: 'https://hyliu.me/fluent-reader', github: 'https://github.com/yang991178/fluent-reader', license: 'BSD-3-Clause', categories: ['Bookmarks & Reading'], alternative_to: ['Feedly', 'Inoreader'] },
  { name: 'NewsBlur', description: 'Personal news reader', website: 'https://newsblur.com', github: 'https://github.com/samuelclay/NewsBlur', license: 'MIT', categories: ['Bookmarks & Reading'], alternative_to: ['Feedly'], is_self_hosted: true },
  { name: 'CommaFeed', description: 'Google Reader inspired RSS reader', website: 'https://commafeed.com', github: 'https://github.com/Athou/commafeed', license: 'Apache-2.0', categories: ['Bookmarks & Reading'], alternative_to: ['Feedly'], is_self_hosted: true },
  { name: 'Stringer', description: 'Self-hosted anti-social RSS reader', website: 'https://github.com/stringer-rss/stringer', github: 'https://github.com/stringer-rss/stringer', license: 'MIT', categories: ['Bookmarks & Reading'], alternative_to: ['Feedly'], is_self_hosted: true },
];

// Proprietary software that may be missing
const newProprietarySoftware = [
  { name: 'C', website: 'https://en.wikipedia.org/wiki/C_(programming_language)', description: 'General-purpose programming language' },
  { name: 'C++', website: 'https://isocpp.org', description: 'General-purpose programming language' },
  { name: 'Elixir', website: 'https://elixir-lang.org', description: 'Dynamic, functional language' },
  { name: 'Erlang', website: 'https://erlang.org', description: 'Programming language for concurrent systems' },
  { name: 'Ruby', website: 'https://ruby-lang.org', description: 'Dynamic programming language' },
  { name: 'Python', website: 'https://python.org', description: 'High-level programming language' },
  { name: 'Go', website: 'https://go.dev', description: 'Statically typed compiled language' },
  { name: 'Google Drive', website: 'https://drive.google.com', description: 'Cloud storage service' },
  { name: 'Backblaze', website: 'https://backblaze.com', description: 'Cloud backup service' },
  { name: 'CrashPlan', website: 'https://crashplan.com', description: 'Backup and recovery service' },
  { name: 'Apple Music', website: 'https://apple.com/music', description: 'Music streaming service' },
  { name: 'SoundCloud', website: 'https://soundcloud.com', description: 'Music sharing platform' },
  { name: 'Plex', website: 'https://plex.tv', description: 'Media server and streaming' },
  { name: 'Google Search', website: 'https://google.com', description: 'Web search engine' },
  { name: 'Bing', website: 'https://bing.com', description: 'Web search engine' },
  { name: 'WhatsApp', website: 'https://whatsapp.com', description: 'Messaging application' },
  { name: 'Telegram', website: 'https://telegram.org', description: 'Cloud-based messaging' },
  { name: 'Skype', website: 'https://skype.com', description: 'Video calling and messaging' },
  { name: 'TeamSpeak', website: 'https://teamspeak.com', description: 'Voice communication software' },
  { name: 'iCloud Photos', website: 'https://icloud.com/photos', description: 'Apple photo storage' },
  { name: 'Flickr', website: 'https://flickr.com', description: 'Photo sharing platform' },
  { name: 'Final Cut Pro', website: 'https://apple.com/final-cut-pro', description: 'Video editing software' },
  { name: 'iMovie', website: 'https://apple.com/imovie', description: 'Video editing software' },
  { name: 'Unity', website: 'https://unity.com', description: 'Game development platform' },
  { name: 'Unreal Engine', website: 'https://unrealengine.com', description: 'Game engine' },
  { name: 'GameMaker', website: 'https://gamemaker.io', description: '2D game development' },
  { name: 'Construct', website: 'https://construct.net', description: 'Game creation tool' },
  { name: 'Maya', website: 'https://autodesk.com/maya', description: '3D modeling software' },
  { name: '3ds Max', website: 'https://autodesk.com/3ds-max', description: '3D modeling software' },
  { name: 'Cinema 4D', website: 'https://maxon.net/cinema-4d', description: '3D modeling software' },
  { name: 'Character Creator', website: 'https://reallusion.com/character-creator', description: '3D character design' },
  { name: 'ZBrush', website: 'https://pixologic.com', description: 'Digital sculpting tool' },
  { name: '1Password', website: 'https://1password.com', description: 'Password manager' },
  { name: 'LastPass', website: 'https://lastpass.com', description: 'Password manager' },
  { name: '1Password Teams', website: 'https://1password.com/teams', description: 'Team password manager' },
  { name: 'Dashlane', website: 'https://dashlane.com', description: 'Password manager' },
  { name: 'Spark', website: 'https://sparkmailapp.com', description: 'Email client' },
  { name: 'Apple Mail', website: 'https://apple.com/mail', description: 'Email client' },
  { name: 'Prezi', website: 'https://prezi.com', description: 'Presentation software' },
  { name: 'Google Slides', website: 'https://docs.google.com/presentation', description: 'Presentation software' },
  { name: 'Windows Explorer', website: 'https://microsoft.com', description: 'File manager' },
  { name: 'Finder', website: 'https://apple.com', description: 'macOS file manager' },
  { name: 'Total Commander', website: 'https://ghisler.com', description: 'File manager' },
  { name: 'Activity Monitor', website: 'https://apple.com', description: 'macOS system monitor' },
  { name: 'Rainmeter', website: 'https://rainmeter.net', description: 'Desktop customization' },
  { name: 'CCleaner', website: 'https://ccleaner.com', description: 'System optimization' },
  { name: 'Google DNS', website: 'https://developers.google.com/speed/public-dns', description: 'Public DNS service' },
  { name: 'BIND', website: 'https://isc.org/bind', description: 'DNS server software' },
  { name: 'AWS Route 53', website: 'https://aws.amazon.com/route53', description: 'DNS web service' },
  { name: 'NordVPN', website: 'https://nordvpn.com', description: 'VPN service' },
  { name: 'ExpressVPN', website: 'https://expressvpn.com', description: 'VPN service' },
  { name: 'Cisco AnyConnect', website: 'https://cisco.com/anyconnect', description: 'VPN client' },
  { name: 'uTorrent', website: 'https://utorrent.com', description: 'BitTorrent client' },
  { name: 'BitTorrent', website: 'https://bittorrent.com', description: 'File sharing protocol client' },
  { name: 'Internet Download Manager', website: 'https://internetdownloadmanager.com', description: 'Download manager' },
  { name: 'Snagit', website: 'https://techsmith.com/snagit', description: 'Screen capture software' },
  { name: 'Greenshot', website: 'https://getgreenshot.org', description: 'Screenshot tool' },
  { name: 'Snipping Tool', website: 'https://microsoft.com', description: 'Windows screenshot tool' },
  { name: 'Camtasia', website: 'https://techsmith.com/camtasia', description: 'Screen recording software' },
  { name: 'ScreenFlow', website: 'https://telestream.net/screenflow', description: 'Screen recording software' },
  { name: 'LICEcap', website: 'https://cockos.com/licecap', description: 'GIF screen capture' },
  { name: 'Gifox', website: 'https://gifox.io', description: 'GIF recording app' },
  { name: 'Microsoft Visio', website: 'https://microsoft.com/visio', description: 'Diagramming software' },
  { name: 'Cloudcraft', website: 'https://cloudcraft.co', description: 'Cloud architecture diagrams' },
  { name: 'QuickBooks', website: 'https://quickbooks.intuit.com', description: 'Accounting software' },
  { name: 'Quicken', website: 'https://quicken.com', description: 'Personal finance software' },
  { name: 'Mint', website: 'https://mint.intuit.com', description: 'Personal finance management' },
  { name: 'Feedly', website: 'https://feedly.com', description: 'RSS reader' },
  { name: 'Inoreader', website: 'https://inoreader.com', description: 'RSS reader' },
  { name: 'HackMD', website: 'https://hackmd.io', description: 'Collaborative markdown notes' },
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
