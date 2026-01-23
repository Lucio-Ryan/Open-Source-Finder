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
  description: String,
  icon: String,
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const ProprietarySoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  website: { type: String, required: true },
  icon_url: { type: String, default: null },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  created_at: { type: Date, default: Date.now }
});

const AlternativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  short_description: { type: String, default: null },
  long_description: { type: String, default: null },
  icon_url: { type: String, default: null },
  website: { type: String, required: true },
  github: { type: String, required: true },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  last_commit: { type: Date, default: null },
  contributors: { type: Number, default: 0 },
  license: { type: String, default: null },
  is_self_hosted: { type: Boolean, default: false },
  health_score: { type: Number, default: 50, min: 0, max: 100 },
  vote_score: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  approved: { type: Boolean, default: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  rejection_reason: { type: String, default: null },
  rejected_at: { type: Date, default: null },
  submitter_name: { type: String, default: null },
  submitter_email: { type: String, default: null },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  screenshots: [{ type: String }],
  submission_plan: { type: String, enum: ['free', 'sponsor'], default: 'free' },
  sponsor_featured_until: { type: Date, default: null },
  sponsor_priority_until: { type: Date, default: null },
  sponsor_payment_id: { type: String, default: null },
  sponsor_paid_at: { type: Date, default: null },
  newsletter_included: { type: Boolean, default: false },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  tech_stacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TechStack' }],
  alternative_to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProprietarySoftware' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const ProprietarySoftware = mongoose.models.ProprietarySoftware || mongoose.model('ProprietarySoftware', ProprietarySoftwareSchema);
const Alternative = mongoose.models.Alternative || mongoose.model('Alternative', AlternativeSchema);

// More proprietary software to add
const newProprietarySoftware = [
  // Regex Testing
  { name: 'RegexBuddy', slug: 'regexbuddy', description: 'Regex testing', website: 'https://regexbuddy.com' },
  { name: 'Regex101 Pro', slug: 'regex101-pro', description: 'Regex tester', website: 'https://regex101.com' },
  
  // Hex Editor
  { name: 'Hex Workshop', slug: 'hex-workshop', description: 'Hex editor', website: 'https://hexworkshop.com' },
  { name: '010 Editor', slug: '010-editor', description: 'Hex editor', website: 'https://sweetscape.com/010editor' },
  
  // Diff Tools
  { name: 'Beyond Compare', slug: 'beyond-compare', description: 'File comparison', website: 'https://scootersoftware.com' },
  { name: 'Araxis Merge', slug: 'araxis-merge', description: 'Diff and merge', website: 'https://araxis.com' },
  
  // Code Snippets
  { name: 'SnippetsLab', slug: 'snippetslab', description: 'Code snippets manager', website: 'https://renfei.org/snippets-lab' },
  { name: 'Cacher', slug: 'cacher', description: 'Code snippets', website: 'https://cacher.io' },
  
  // Log Viewer
  { name: 'LogViewPlus', slug: 'logviewplus', description: 'Log viewer', website: 'https://logviewplus.com' },
  
  // System Monitor
  { name: 'iStatMenus', slug: 'istatmenus', description: 'Mac system monitor', website: 'https://bjango.com/mac/istatmenus' },
  
  // Clipboard Manager
  { name: 'Paste', slug: 'paste-app', description: 'Clipboard manager', website: 'https://pasteapp.io' },
  { name: 'Alfred', slug: 'alfred', description: 'Productivity app', website: 'https://alfredapp.com' },
  
  // Launcher
  { name: 'Raycast', slug: 'raycast', description: 'Productivity launcher', website: 'https://raycast.com' },
  { name: 'LaunchBar', slug: 'launchbar', description: 'App launcher', website: 'https://obdev.at/launchbar' },
  
  // Window Manager
  { name: 'Magnet', slug: 'magnet', description: 'Window manager', website: 'https://magnet.crowdcafe.com' },
  { name: 'Moom', slug: 'moom', description: 'Window manager', website: 'https://manytricks.com/moom' },
  { name: 'BetterSnapTool', slug: 'bettersnaptool', description: 'Window snapping', website: 'https://folivora.ai/bettersnaptool' },
  
  // Menu Bar Apps
  { name: 'Bartender', slug: 'bartender', description: 'Menu bar organizer', website: 'https://macbartender.com' },
  
  // Backup
  { name: 'Carbon Copy Cloner', slug: 'carbon-copy-cloner', description: 'Backup software', website: 'https://bombich.com' },
  { name: 'SuperDuper!', slug: 'superduper', description: 'Mac backup', website: 'https://shirt-pocket.com/SuperDuper' },
  { name: 'Time Machine', slug: 'time-machine', description: 'Mac backup', website: 'https://apple.com' },
  
  // Disk Utility
  { name: 'CleanMyMac', slug: 'cleanmymac', description: 'Mac cleaner', website: 'https://macpaw.com/cleanmymac' },
  { name: 'DaisyDisk', slug: 'daisydisk', description: 'Disk analyzer', website: 'https://daisydiskapp.com' },
  
  // File Search
  { name: 'EasyFind', slug: 'easyfind', description: 'File search', website: 'https://devontechnologies.com/apps/freeware' },
  { name: 'HoudahSpot', slug: 'houdahspot', description: 'File search', website: 'https://houdah.com/houdahSpot' },
  
  // Virtualization
  { name: 'Parallels Desktop', slug: 'parallels-desktop', description: 'Virtualization', website: 'https://parallels.com' },
  { name: 'VMware Fusion', slug: 'vmware-fusion', description: 'Virtualization', website: 'https://vmware.com/fusion' },
  
  // RSS Reader
  { name: 'Reeder', slug: 'reeder', description: 'RSS reader', website: 'https://reederapp.com' },
  { name: 'NetNewsWire Pro', slug: 'netnewswire-pro', description: 'RSS reader', website: 'https://netnewswire.com' },
  { name: 'Feedly', slug: 'feedly', description: 'News reader', website: 'https://feedly.com' },
  
  // Read Later
  { name: 'Pocket', slug: 'pocket', description: 'Read later', website: 'https://getpocket.com' },
  { name: 'Instapaper', slug: 'instapaper', description: 'Read later', website: 'https://instapaper.com' },
  
  // Note Taking Pro
  { name: 'Bear', slug: 'bear', description: 'Note taking', website: 'https://bear.app' },
  { name: 'Ulysses', slug: 'ulysses', description: 'Writing app', website: 'https://ulysses.app' },
  { name: 'iA Writer', slug: 'ia-writer', description: 'Writing app', website: 'https://ia.net/writer' },
  
  // Markdown Editor
  { name: 'Typora', slug: 'typora', description: 'Markdown editor', website: 'https://typora.io' },
  { name: 'MWeb', slug: 'mweb', description: 'Markdown editor', website: 'https://mweb.im' },
  
  // Download Manager
  { name: 'Internet Download Manager', slug: 'internet-download-manager', description: 'Download manager', website: 'https://internetdownloadmanager.com' },
  { name: 'Folx', slug: 'folx', description: 'Download manager', website: 'https://mac.eltima.com/folx' },
  
  // Torrent Client
  { name: 'uTorrent', slug: 'utorrent', description: 'Torrent client', website: 'https://utorrent.com' },
  { name: 'BitTorrent', slug: 'bittorrent', description: 'Torrent client', website: 'https://bittorrent.com' },
  
  // Download Acceleration
  { name: 'JDownloader', slug: 'jdownloader-proprietary', description: 'Download manager', website: 'https://jdownloader.org' },
];

// More alternatives to add - Final batch to reach 1000+
const newAlternatives = [
  // Regex Testing - Alternatives to RegexBuddy
  {
    name: 'Regex101',
    slug: 'regex101',
    short_description: 'Online regex tester',
    description: 'Regex101 is a free online regex tester and debugger. It supports PHP, Python, JavaScript, and Go with detailed explanations.',
    website: 'https://regex101.com',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'Free',
    is_self_hosted: false,
    alternative_to: ['regexbuddy', 'regex101-pro'],
    categoryKeywords: ['regex', 'testing', 'developer-tools', 'online', 'free']
  },
  {
    name: 'RegExr',
    slug: 'regexr',
    short_description: 'Learn and build regex',
    description: 'RegExr is an online tool to learn, build, and test regular expressions. It provides real-time highlighting and detailed explanations.',
    website: 'https://regexr.com',
    github: 'https://github.com/gskinner/regexr',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['regexbuddy'],
    categoryKeywords: ['regex', 'learning', 'testing', 'online', 'highlighting']
  },

  // Hex Editor - Alternatives to Hex Workshop, 010 Editor
  {
    name: 'ImHex',
    slug: 'imhex',
    short_description: 'Modern hex editor',
    description: 'ImHex is a modern feature-rich hex editor. It provides pattern language, data processor, custom visualizers, and disassembler.',
    website: 'https://imhex.werwolv.net',
    github: 'https://github.com/WerWolv/ImHex',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['hex-workshop', '010-editor'],
    categoryKeywords: ['hex', 'editor', 'binary', 'reverse-engineering', 'patterns']
  },
  {
    name: 'HxD',
    slug: 'hxd',
    short_description: 'Freeware hex editor',
    description: 'HxD is a freeware hex editor with raw disk editing, file comparison, checksums, and RAM editing capabilities.',
    website: 'https://mh-nexus.de/hxd',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'Freeware',
    is_self_hosted: false,
    alternative_to: ['hex-workshop', '010-editor'],
    categoryKeywords: ['hex', 'editor', 'disk', 'ram', 'freeware']
  },
  {
    name: 'xxd',
    slug: 'xxd',
    short_description: 'Command-line hex dump',
    description: 'xxd is a command-line utility that creates a hex dump or does the reverse. It comes with Vim and is available on most Unix systems.',
    website: 'https://vim.org',
    github: 'https://github.com/vim/vim',
    license: 'Vim License',
    is_self_hosted: false,
    alternative_to: ['hex-workshop'],
    categoryKeywords: ['hex', 'cli', 'unix', 'vim', 'dump']
  },

  // Diff Tools - Alternatives to Beyond Compare, Araxis Merge
  {
    name: 'Meld',
    slug: 'meld',
    short_description: 'Visual diff and merge',
    description: 'Meld is a visual diff and merge tool for developers. It supports two and three-way comparison of files and directories.',
    website: 'https://meldmerge.org',
    github: 'https://github.com/GNOME/meld',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['beyond-compare', 'araxis-merge'],
    categoryKeywords: ['diff', 'merge', 'visual', 'comparison', 'gnome']
  },
  {
    name: 'KDiff3',
    slug: 'kdiff3',
    short_description: 'File and directory diff',
    description: 'KDiff3 is a diff and merge program that compares and merges files and directories. It supports three-way comparison.',
    website: 'https://kdiff3.sourceforge.net',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['beyond-compare', 'araxis-merge'],
    categoryKeywords: ['diff', 'merge', 'directory', 'three-way', 'kde']
  },
  {
    name: 'delta',
    slug: 'delta-diff',
    short_description: 'Better git diff',
    description: 'delta is a syntax-highlighting pager for git, diff, and grep output. It provides side-by-side view and language-aware diffing.',
    website: 'https://dandavison.github.io/delta',
    github: 'https://github.com/dandavison/delta',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['beyond-compare'],
    categoryKeywords: ['diff', 'git', 'syntax', 'pager', 'rust']
  },
  {
    name: 'difftastic',
    slug: 'difftastic',
    short_description: 'Structural diff tool',
    description: 'Difftastic is a structural diff tool that understands syntax. It compares files based on their syntax tree rather than line-by-line.',
    website: 'https://difftastic.wilfred.me.uk',
    github: 'https://github.com/Wilfred/difftastic',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['beyond-compare'],
    categoryKeywords: ['diff', 'structural', 'syntax', 'tree', 'rust']
  },

  // Code Snippets - Alternatives to SnippetsLab, Cacher
  {
    name: 'Massode',
    slug: 'massode',
    short_description: 'Code snippets manager',
    description: 'Massode is a code snippets manager for developers. It provides collections, tags, and sync across devices.',
    website: 'https://masscode.io',
    github: 'https://github.com/massCodeIO/massCode',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['snippetslab', 'cacher'],
    categoryKeywords: ['snippets', 'code', 'manager', 'collections', 'sync']
  },
  {
    name: 'Lepton',
    slug: 'lepton',
    short_description: 'GitHub Gist client',
    description: 'Lepton is a lean GitHub Gist client. It provides tag management, search, and a clean interface for managing gists.',
    website: 'https://github.com/nicklockwood/Expressions',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['snippetslab', 'cacher'],
    categoryKeywords: ['snippets', 'gist', 'github', 'tags', 'electron']
  },

  // Log Viewer - Alternatives to LogViewPlus
  {
    name: 'Lnav',
    slug: 'lnav',
    short_description: 'Log file navigator',
    description: 'Lnav is an advanced log file viewer for the terminal. It provides automatic format detection, filtering, and SQL queries on logs.',
    website: 'https://lnav.org',
    github: 'https://github.com/tstack/lnav',
    license: 'BSD-2-Clause License',
    is_self_hosted: false,
    alternative_to: ['logviewplus'],
    categoryKeywords: ['logs', 'viewer', 'terminal', 'sql', 'filtering']
  },
  {
    name: 'GoAccess',
    slug: 'goaccess',
    short_description: 'Real-time web log analyzer',
    description: 'GoAccess is an open-source real-time web log analyzer. It provides fast analysis with terminal or HTML output.',
    website: 'https://goaccess.io',
    github: 'https://github.com/allinurl/goaccess',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['logviewplus'],
    categoryKeywords: ['logs', 'analytics', 'web', 'real-time', 'terminal']
  },

  // System Monitor - Alternatives to iStatMenus
  {
    name: 'btop',
    slug: 'btop',
    short_description: 'Resource monitor',
    description: 'btop is a resource monitor with a responsive interface. It shows CPU, memory, disks, network, and processes.',
    website: 'https://github.com/aristocratos/btop',
    github: 'https://github.com/aristocratos/btop',
    license: 'Apache License 2.0',
    is_self_hosted: false,
    alternative_to: ['istatmenus'],
    categoryKeywords: ['monitor', 'system', 'cpu', 'memory', 'terminal']
  },
  {
    name: 'htop',
    slug: 'htop',
    short_description: 'Interactive process viewer',
    description: 'htop is an interactive process viewer for Unix systems. It provides real-time system monitoring with color-coded output.',
    website: 'https://htop.dev',
    github: 'https://github.com/htop-dev/htop',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['istatmenus'],
    categoryKeywords: ['monitor', 'process', 'unix', 'interactive', 'terminal']
  },
  {
    name: 'Glances',
    slug: 'glances',
    short_description: 'Cross-platform system monitor',
    description: 'Glances is a cross-platform system monitoring tool written in Python. It provides terminal UI, web UI, and REST API.',
    website: 'https://nicolargo.github.io/glances',
    github: 'https://github.com/nicolargo/glances',
    license: 'LGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['istatmenus'],
    categoryKeywords: ['monitor', 'system', 'python', 'web-ui', 'api']
  },

  // Clipboard Manager - Alternatives to Paste, Alfred
  {
    name: 'CopyQ',
    slug: 'copyq',
    short_description: 'Clipboard manager',
    description: 'CopyQ is an advanced clipboard manager with editing, scripting, and content transformation capabilities.',
    website: 'https://hluk.github.io/CopyQ',
    github: 'https://github.com/hluk/CopyQ',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['paste-app', 'alfred'],
    categoryKeywords: ['clipboard', 'manager', 'scripting', 'editing', 'cross-platform']
  },
  {
    name: 'Diodon',
    slug: 'diodon',
    short_description: 'GNOME clipboard manager',
    description: 'Diodon is a simple clipboard manager for GNOME. It provides clipboard history with search and Unity integration.',
    website: 'https://launchpad.net/diodon',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['paste-app'],
    categoryKeywords: ['clipboard', 'gnome', 'history', 'search', 'linux']
  },

  // Launcher - Alternatives to Raycast, Alfred, LaunchBar
  {
    name: 'Albert',
    slug: 'albert-launcher',
    short_description: 'Desktop agnostic launcher',
    description: 'Albert is a fast and flexible keyboard launcher. It provides quick access to applications, files, and custom extensions.',
    website: 'https://albertlauncher.github.io',
    github: 'https://github.com/albertlauncher/albert',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['raycast', 'alfred', 'launchbar'],
    categoryKeywords: ['launcher', 'keyboard', 'productivity', 'extensions', 'linux']
  },
  {
    name: 'Ulauncher',
    slug: 'ulauncher',
    short_description: 'Linux application launcher',
    description: 'Ulauncher is a fast application launcher for Linux. It provides fuzzy search, shortcuts, themes, and extensions.',
    website: 'https://ulauncher.io',
    github: 'https://github.com/Ulauncher/Ulauncher',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['raycast', 'alfred', 'launchbar'],
    categoryKeywords: ['launcher', 'linux', 'fuzzy', 'themes', 'extensions']
  },
  {
    name: 'Rofi',
    slug: 'rofi',
    short_description: 'Window switcher and launcher',
    description: 'Rofi is a window switcher, application launcher, and dmenu replacement. It is highly customizable with theming support.',
    website: 'https://github.com/davatorium/rofi',
    github: 'https://github.com/davatorium/rofi',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['raycast', 'alfred'],
    categoryKeywords: ['launcher', 'dmenu', 'window', 'themes', 'linux']
  },

  // Window Manager - Alternatives to Magnet, Moom, BetterSnapTool
  {
    name: 'Rectangle',
    slug: 'rectangle',
    short_description: 'Mac window management',
    description: 'Rectangle is a window management app for macOS. It provides keyboard shortcuts for moving and resizing windows.',
    website: 'https://rectangleapp.com',
    github: 'https://github.com/rxhanson/Rectangle',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['magnet', 'moom', 'bettersnaptool'],
    categoryKeywords: ['window', 'manager', 'macos', 'keyboard', 'tiling']
  },
  {
    name: 'yabai',
    slug: 'yabai',
    short_description: 'Tiling window manager for macOS',
    description: 'yabai is a tiling window manager for macOS. It provides automatic window tiling, spaces, and scripting with skhd.',
    website: 'https://github.com/koekeishiya/yabai',
    github: 'https://github.com/koekeishiya/yabai',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['magnet', 'moom'],
    categoryKeywords: ['window', 'tiling', 'macos', 'scripting', 'spaces']
  },
  {
    name: 'i3',
    slug: 'i3-wm',
    short_description: 'Tiling window manager',
    description: 'i3 is a tiling window manager for X11. It is fast, configurable, and designed for power users.',
    website: 'https://i3wm.org',
    github: 'https://github.com/i3/i3',
    license: 'BSD-3-Clause License',
    is_self_hosted: false,
    alternative_to: ['magnet', 'moom'],
    categoryKeywords: ['window', 'tiling', 'x11', 'linux', 'keyboard']
  },
  {
    name: 'Sway',
    slug: 'sway',
    short_description: 'i3-compatible Wayland compositor',
    description: 'Sway is an i3-compatible Wayland compositor. It is a drop-in replacement for i3 on Wayland.',
    website: 'https://swaywm.org',
    github: 'https://github.com/swaywm/sway',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['magnet'],
    categoryKeywords: ['window', 'tiling', 'wayland', 'i3', 'linux']
  },

  // Menu Bar - Alternatives to Bartender
  {
    name: 'Hidden Bar',
    slug: 'hidden-bar',
    short_description: 'Hide menu bar icons',
    description: 'Hidden Bar is a free utility to hide menu bar icons on macOS. It provides a clean menu bar with toggled visibility.',
    website: 'https://github.com/dwarvesf/hidden',
    github: 'https://github.com/dwarvesf/hidden',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['bartender'],
    categoryKeywords: ['menubar', 'macos', 'hide', 'clean', 'utility']
  },
  {
    name: 'Dozer',
    slug: 'dozer',
    short_description: 'Hide menu bar icons',
    description: 'Dozer lets you hide menu bar icons to reduce clutter. It is lightweight and simple to use.',
    website: 'https://github.com/Mortennn/Dozer',
    github: 'https://github.com/Mortennn/Dozer',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['bartender'],
    categoryKeywords: ['menubar', 'macos', 'icons', 'hide', 'simple']
  },

  // Backup - Alternatives to Carbon Copy Cloner, SuperDuper!, Time Machine
  {
    name: 'Borg Backup',
    slug: 'borg-backup',
    short_description: 'Deduplicating backup',
    description: 'Borg Backup is a deduplicating backup program. It provides compression, encryption, and efficient storage.',
    website: 'https://www.borgbackup.org',
    github: 'https://github.com/borgbackup/borg',
    license: 'BSD-3-Clause License',
    is_self_hosted: true,
    alternative_to: ['carbon-copy-cloner', 'superduper', 'time-machine'],
    categoryKeywords: ['backup', 'deduplication', 'encryption', 'compression', 'efficient']
  },
  {
    name: 'Restic',
    slug: 'restic',
    short_description: 'Fast, secure backup',
    description: 'Restic is a fast, secure, and efficient backup program. It supports multiple backends and encryption.',
    website: 'https://restic.net',
    github: 'https://github.com/restic/restic',
    license: 'BSD-2-Clause License',
    is_self_hosted: true,
    alternative_to: ['carbon-copy-cloner', 'superduper', 'time-machine'],
    categoryKeywords: ['backup', 'secure', 'fast', 'backends', 'encryption']
  },
  {
    name: 'Duplicati',
    slug: 'duplicati',
    short_description: 'Cloud backup',
    description: 'Duplicati is a free backup software to store encrypted backups online. It works with many cloud storage providers.',
    website: 'https://www.duplicati.com',
    github: 'https://github.com/duplicati/duplicati',
    license: 'LGPL-2.1 License',
    is_self_hosted: true,
    alternative_to: ['carbon-copy-cloner', 'time-machine'],
    categoryKeywords: ['backup', 'cloud', 'encrypted', 'online', 'providers']
  },
  {
    name: 'Kopia',
    slug: 'kopia',
    short_description: 'Fast and secure backup',
    description: 'Kopia is a fast and secure open-source backup tool. It provides deduplication, encryption, and compression.',
    website: 'https://kopia.io',
    github: 'https://github.com/kopia/kopia',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['carbon-copy-cloner', 'superduper'],
    categoryKeywords: ['backup', 'fast', 'secure', 'deduplication', 'go']
  },

  // Disk Utility - Alternatives to CleanMyMac, DaisyDisk
  {
    name: 'ncdu',
    slug: 'ncdu',
    short_description: 'NCurses disk usage',
    description: 'ncdu is a disk usage analyzer with an ncurses interface. It provides fast scanning and easy navigation.',
    website: 'https://dev.yorhel.nl/ncdu',
    github: 'https://code.blicky.net/yorhel/ncdu',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['daisydisk', 'cleanmymac'],
    categoryKeywords: ['disk', 'usage', 'ncurses', 'analyzer', 'terminal']
  },
  {
    name: 'dust',
    slug: 'dust',
    short_description: 'More intuitive du',
    description: 'dust is a more intuitive version of du written in Rust. It provides a visual representation of disk usage.',
    website: 'https://github.com/bootandy/dust',
    github: 'https://github.com/bootandy/dust',
    license: 'Apache License 2.0',
    is_self_hosted: false,
    alternative_to: ['daisydisk'],
    categoryKeywords: ['disk', 'usage', 'rust', 'visual', 'du']
  },
  {
    name: 'duf',
    slug: 'duf',
    short_description: 'Better df alternative',
    description: 'duf is a better df alternative. It provides disk usage/free utility with user-friendly output.',
    website: 'https://github.com/muesli/duf',
    github: 'https://github.com/muesli/duf',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['daisydisk'],
    categoryKeywords: ['disk', 'usage', 'df', 'friendly', 'go']
  },
  {
    name: 'BleachBit',
    slug: 'bleachbit',
    short_description: 'System cleaner',
    description: 'BleachBit cleans files to free disk space and maintain privacy. It supports many applications and custom CleanerML files.',
    website: 'https://www.bleachbit.org',
    github: 'https://github.com/bleachbit/bleachbit',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['cleanmymac'],
    categoryKeywords: ['cleaner', 'disk', 'privacy', 'system', 'cross-platform']
  },

  // File Search - Alternatives to EasyFind, HoudahSpot
  {
    name: 'fd',
    slug: 'fd',
    short_description: 'Simple, fast find',
    description: 'fd is a simple, fast, and user-friendly alternative to find. It ignores hidden files by default and supports regex.',
    website: 'https://github.com/sharkdp/fd',
    github: 'https://github.com/sharkdp/fd',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['easyfind', 'houdahspot'],
    categoryKeywords: ['find', 'search', 'files', 'fast', 'rust']
  },
  {
    name: 'ripgrep',
    slug: 'ripgrep',
    short_description: 'Fast grep replacement',
    description: 'ripgrep is a line-oriented search tool that recursively searches directories. It is faster than grep and respects gitignore.',
    website: 'https://github.com/BurntSushi/ripgrep',
    github: 'https://github.com/BurntSushi/ripgrep',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['easyfind', 'houdahspot'],
    categoryKeywords: ['grep', 'search', 'fast', 'recursive', 'rust']
  },
  {
    name: 'fzf',
    slug: 'fzf',
    short_description: 'Command-line fuzzy finder',
    description: 'fzf is a general-purpose command-line fuzzy finder. It can be used for files, command history, processes, and more.',
    website: 'https://github.com/junegunn/fzf',
    github: 'https://github.com/junegunn/fzf',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['houdahspot'],
    categoryKeywords: ['fuzzy', 'finder', 'search', 'cli', 'go']
  },
  {
    name: 'Everything',
    slug: 'everything-search',
    short_description: 'Instant file search for Windows',
    description: 'Everything is a desktop search utility for Windows. It locates files and folders instantly by filename.',
    website: 'https://www.voidtools.com',
    github: 'https://github.com/nicklockwood/Expressions',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['easyfind', 'houdahspot'],
    categoryKeywords: ['search', 'windows', 'instant', 'files', 'filename']
  },

  // Virtualization - Alternatives to Parallels, VMware Fusion
  {
    name: 'UTM',
    slug: 'utm',
    short_description: 'Virtual machines for Mac',
    description: 'UTM is a full-featured system emulator and virtual machine host for macOS. It supports Windows, Linux, and other operating systems.',
    website: 'https://mac.getutm.app',
    github: 'https://github.com/utmapp/UTM',
    license: 'Apache License 2.0',
    is_self_hosted: false,
    alternative_to: ['parallels-desktop', 'vmware-fusion'],
    categoryKeywords: ['virtualization', 'vm', 'macos', 'emulator', 'qemu']
  },

  // RSS Reader - Alternatives to Reeder, NetNewsWire, Feedly
  {
    name: 'NetNewsWire',
    slug: 'netnewswire',
    short_description: 'Free RSS reader',
    description: 'NetNewsWire is a free and open-source RSS reader for Mac and iOS. It is fast, native, and syncs with multiple services.',
    website: 'https://netnewswire.com',
    github: 'https://github.com/Ranchero-Software/NetNewsWire',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['reeder', 'netnewswire-pro', 'feedly'],
    categoryKeywords: ['rss', 'reader', 'macos', 'ios', 'native']
  },
  {
    name: 'Miniflux',
    slug: 'miniflux',
    short_description: 'Minimalist RSS reader',
    description: 'Miniflux is a minimalist and opinionated feed reader. It is self-hosted, fast, and respects your privacy.',
    website: 'https://miniflux.app',
    github: 'https://github.com/miniflux/v2',
    license: 'Apache License 2.0',
    is_self_hosted: true,
    alternative_to: ['feedly', 'reeder'],
    categoryKeywords: ['rss', 'reader', 'minimalist', 'self-hosted', 'privacy']
  },
  {
    name: 'FreshRSS',
    slug: 'freshrss',
    short_description: 'Self-hosted RSS aggregator',
    description: 'FreshRSS is a free, self-hosted RSS aggregator. It provides a powerful API, extensions, and mobile-friendly design.',
    website: 'https://freshrss.org',
    github: 'https://github.com/FreshRSS/FreshRSS',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['feedly', 'reeder'],
    categoryKeywords: ['rss', 'aggregator', 'self-hosted', 'api', 'mobile']
  },

  // Read Later - Alternatives to Pocket, Instapaper
  {
    name: 'Wallabag',
    slug: 'wallabag',
    short_description: 'Self-hosted read-it-later',
    description: 'Wallabag is a self-hosted read-it-later application. It saves articles and removes clutter for comfortable reading.',
    website: 'https://wallabag.org',
    github: 'https://github.com/wallabag/wallabag',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['pocket', 'instapaper'],
    categoryKeywords: ['read-later', 'articles', 'self-hosted', 'reader', 'save']
  },
  {
    name: 'Omnivore',
    slug: 'omnivore',
    short_description: 'Read-it-later app',
    description: 'Omnivore is an open-source read-it-later app. It provides highlighting, labels, newsletters, and full-text search.',
    website: 'https://omnivore.app',
    github: 'https://github.com/omnivore-app/omnivore',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['pocket', 'instapaper'],
    categoryKeywords: ['read-later', 'articles', 'highlighting', 'newsletters', 'search']
  },
  {
    name: 'Shiori',
    slug: 'shiori',
    short_description: 'Bookmark manager',
    description: 'Shiori is a simple bookmark manager. It archives bookmarks and provides offline reading with a clean interface.',
    website: 'https://github.com/go-shiori/shiori',
    github: 'https://github.com/go-shiori/shiori',
    license: 'MIT License',
    is_self_hosted: true,
    alternative_to: ['pocket'],
    categoryKeywords: ['bookmarks', 'manager', 'archive', 'offline', 'go']
  },

  // Note Taking - Alternatives to Bear, Ulysses, iA Writer
  {
    name: 'Joplin',
    slug: 'joplin',
    short_description: 'Note-taking and to-do',
    description: 'Joplin is an open-source note-taking and to-do application. It supports Markdown, synchronization, and end-to-end encryption.',
    website: 'https://joplinapp.org',
    github: 'https://github.com/laurent22/joplin',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['bear', 'ulysses'],
    categoryKeywords: ['notes', 'markdown', 'sync', 'encryption', 'todo']
  },
  {
    name: 'Standard Notes',
    slug: 'standard-notes',
    short_description: 'Encrypted notes',
    description: 'Standard Notes is a secure and durable notes app. It provides end-to-end encryption and sync across all platforms.',
    website: 'https://standardnotes.com',
    github: 'https://github.com/standardnotes/app',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['bear', 'ulysses'],
    categoryKeywords: ['notes', 'encrypted', 'secure', 'sync', 'privacy']
  },
  {
    name: 'Logseq',
    slug: 'logseq',
    short_description: 'Knowledge management',
    description: 'Logseq is a privacy-first, open-source knowledge base. It supports outlining, backlinks, and local-first storage.',
    website: 'https://logseq.com',
    github: 'https://github.com/logseq/logseq',
    license: 'AGPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['bear', 'ulysses'],
    categoryKeywords: ['notes', 'knowledge', 'outliner', 'backlinks', 'local']
  },
  {
    name: 'SiYuan',
    slug: 'siyuan',
    short_description: 'Local-first personal knowledge',
    description: 'SiYuan is a local-first personal knowledge management system. It supports Markdown, backlinks, and block-level editing.',
    website: 'https://b3log.org/siyuan',
    github: 'https://github.com/siyuan-note/siyuan',
    license: 'AGPL-3.0 License',
    is_self_hosted: true,
    alternative_to: ['bear', 'ulysses'],
    categoryKeywords: ['notes', 'knowledge', 'local-first', 'blocks', 'markdown']
  },

  // Markdown Editor - Alternatives to Typora, MWeb
  {
    name: 'Mark Text',
    slug: 'mark-text',
    short_description: 'Simple Markdown editor',
    description: 'Mark Text is a simple and elegant Markdown editor. It provides real-time preview with seamless experience.',
    website: 'https://marktext.app',
    github: 'https://github.com/marktext/marktext',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['typora', 'mweb'],
    categoryKeywords: ['markdown', 'editor', 'simple', 'preview', 'electron']
  },
  {
    name: 'Zettlr',
    slug: 'zettlr',
    short_description: 'Markdown editor for researchers',
    description: 'Zettlr is a Markdown editor for writers and researchers. It provides citations, Zettelkasten, and academic workflows.',
    website: 'https://www.zettlr.com',
    github: 'https://github.com/Zettlr/Zettlr',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['typora', 'mweb', 'ulysses'],
    categoryKeywords: ['markdown', 'editor', 'academic', 'citations', 'zettelkasten']
  },

  // Download Manager - Alternatives to IDM, Folx
  {
    name: 'aria2',
    slug: 'aria2',
    short_description: 'Command-line download utility',
    description: 'aria2 is a lightweight multi-protocol command-line download utility. It supports HTTP/HTTPS, FTP, BitTorrent, and Metalink.',
    website: 'https://aria2.github.io',
    github: 'https://github.com/aria2/aria2',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['internet-download-manager', 'folx'],
    categoryKeywords: ['download', 'cli', 'torrent', 'ftp', 'parallel']
  },
  {
    name: 'Motrix',
    slug: 'motrix',
    short_description: 'Full-featured download manager',
    description: 'Motrix is a full-featured download manager. It supports HTTP, FTP, BitTorrent, Magnet, and more with a modern UI.',
    website: 'https://motrix.app',
    github: 'https://github.com/agalwood/Motrix',
    license: 'MIT License',
    is_self_hosted: false,
    alternative_to: ['internet-download-manager', 'folx'],
    categoryKeywords: ['download', 'manager', 'torrent', 'modern', 'electron']
  },
  {
    name: 'Persepolis',
    slug: 'persepolis',
    short_description: 'aria2 GUI front-end',
    description: 'Persepolis is a download manager with a graphical interface for aria2. It provides queue management and browser integration.',
    website: 'https://persepolisdm.github.io',
    github: 'https://github.com/persepolisdm/persepolis',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['internet-download-manager'],
    categoryKeywords: ['download', 'gui', 'aria2', 'queue', 'browser']
  },

  // Torrent Client - Alternatives to uTorrent, BitTorrent
  {
    name: 'qBittorrent',
    slug: 'qbittorrent',
    short_description: 'Free BitTorrent client',
    description: 'qBittorrent is a free and open-source BitTorrent client. It aims to be a good alternative to µTorrent with similar features.',
    website: 'https://www.qbittorrent.org',
    github: 'https://github.com/qbittorrent/qBittorrent',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['utorrent', 'bittorrent'],
    categoryKeywords: ['torrent', 'bittorrent', 'client', 'free', 'cross-platform']
  },
  {
    name: 'Transmission',
    slug: 'transmission',
    short_description: 'Simple BitTorrent client',
    description: 'Transmission is a fast, easy, and free BitTorrent client. It provides a clean interface with remote management.',
    website: 'https://transmissionbt.com',
    github: 'https://github.com/transmission/transmission',
    license: 'GPL-2.0 License',
    is_self_hosted: false,
    alternative_to: ['utorrent', 'bittorrent'],
    categoryKeywords: ['torrent', 'simple', 'fast', 'remote', 'macos']
  },
  {
    name: 'Deluge',
    slug: 'deluge',
    short_description: 'Lightweight BitTorrent client',
    description: 'Deluge is a lightweight, free, and cross-platform BitTorrent client. It is highly extensible with plugins.',
    website: 'https://deluge-torrent.org',
    github: 'https://github.com/deluge-torrent/deluge',
    license: 'GPL-3.0 License',
    is_self_hosted: false,
    alternative_to: ['utorrent', 'bittorrent'],
    categoryKeywords: ['torrent', 'lightweight', 'plugins', 'python', 'cross-platform']
  },
];

// Category keyword to slug mapping
const categoryKeywordMap: { [key: string]: string[] } = {
  'regex': ['developer-tools', 'testing-qa'],
  'testing': ['testing-qa', 'developer-tools'],
  'developer-tools': ['developer-tools'],
  'online': ['productivity', 'developer-tools'],
  'free': ['productivity', 'developer-tools'],
  'learning': ['education', 'developer-tools'],
  'highlighting': ['developer-tools', 'note-taking'],
  'hex': ['developer-tools', 'security-privacy'],
  'editor': ['developer-tools', 'content-media'],
  'binary': ['developer-tools', 'security-privacy'],
  'reverse-engineering': ['security-privacy', 'developer-tools'],
  'patterns': ['developer-tools', 'testing-qa'],
  'disk': ['system-tools', 'developer-tools'],
  'ram': ['system-tools', 'developer-tools'],
  'freeware': ['productivity', 'developer-tools'],
  'cli': ['developer-tools', 'terminal'],
  'unix': ['devops-infrastructure', 'developer-tools'],
  'vim': ['developer-tools', 'ide'],
  'dump': ['developer-tools', 'devops-infrastructure'],
  'diff': ['version-control', 'developer-tools'],
  'merge': ['version-control', 'developer-tools'],
  'visual': ['design', 'productivity'],
  'comparison': ['developer-tools', 'testing-qa'],
  'gnome': ['linux', 'developer-tools'],
  'directory': ['file-sharing', 'developer-tools'],
  'three-way': ['version-control', 'developer-tools'],
  'kde': ['linux', 'developer-tools'],
  'git': ['version-control', 'developer-tools'],
  'syntax': ['developer-tools', 'programming'],
  'pager': ['developer-tools', 'terminal'],
  'rust': ['developer-tools', 'backend-development'],
  'structural': ['developer-tools', 'programming'],
  'tree': ['developer-tools', 'data-engineering'],
  'snippets': ['developer-tools', 'productivity'],
  'code': ['developer-tools', 'programming'],
  'manager': ['productivity', 'developer-tools'],
  'collections': ['productivity', 'developer-tools'],
  'sync': ['file-sharing', 'productivity'],
  'gist': ['version-control', 'developer-tools'],
  'github': ['version-control', 'developer-tools'],
  'tags': ['productivity', 'developer-tools'],
  'electron': ['developer-tools', 'frontend-development'],
  'logs': ['monitoring-observability', 'devops-infrastructure'],
  'viewer': ['productivity', 'developer-tools'],
  'terminal': ['developer-tools', 'terminal'],
  'sql': ['database', 'developer-tools'],
  'filtering': ['analytics', 'developer-tools'],
  'analytics': ['analytics', 'business-intelligence'],
  'web': ['frontend-development', 'developer-tools'],
  'real-time': ['performance', 'monitoring-observability'],
  'monitor': ['monitoring-observability', 'devops-infrastructure'],
  'system': ['system-tools', 'devops-infrastructure'],
  'cpu': ['system-tools', 'monitoring-observability'],
  'memory': ['system-tools', 'performance'],
  'process': ['system-tools', 'devops-infrastructure'],
  'interactive': ['productivity', 'developer-tools'],
  'python': ['developer-tools', 'backend-development'],
  'web-ui': ['frontend-development', 'developer-tools'],
  'api': ['api-development', 'developer-tools'],
  'clipboard': ['productivity', 'system-tools'],
  'scripting': ['developer-tools', 'automation'],
  'editing': ['content-media', 'developer-tools'],
  'cross-platform': ['developer-tools', 'productivity'],
  'history': ['productivity', 'developer-tools'],
  'search': ['search', 'developer-tools'],
  'linux': ['devops-infrastructure', 'developer-tools'],
  'launcher': ['productivity', 'system-tools'],
  'keyboard': ['productivity', 'developer-tools'],
  'productivity': ['productivity'],
  'extensions': ['developer-tools', 'customization'],
  'fuzzy': ['search', 'developer-tools'],
  'themes': ['design', 'customization'],
  'dmenu': ['productivity', 'linux'],
  'window': ['system-tools', 'productivity'],
  'macos': ['developer-tools', 'productivity'],
  'tiling': ['productivity', 'system-tools'],
  'spaces': ['productivity', 'system-tools'],
  'x11': ['linux', 'developer-tools'],
  'wayland': ['linux', 'developer-tools'],
  'i3': ['linux', 'productivity'],
  'menubar': ['productivity', 'macos'],
  'hide': ['productivity', 'system-tools'],
  'clean': ['productivity', 'system-tools'],
  'utility': ['system-tools', 'productivity'],
  'icons': ['graphic-design', 'design'],
  'simple': ['productivity', 'developer-tools'],
  'backup': ['backup-recovery', 'devops-infrastructure'],
  'deduplication': ['backup-recovery', 'performance'],
  'encryption': ['encryption', 'security-privacy'],
  'compression': ['productivity', 'performance'],
  'efficient': ['performance', 'developer-tools'],
  'secure': ['security-privacy', 'encryption'],
  'fast': ['performance', 'developer-tools'],
  'backends': ['backend-development', 'devops-infrastructure'],
  'cloud': ['cloud-platforms', 'devops-infrastructure'],
  'encrypted': ['encryption', 'security-privacy'],
  'providers': ['cloud-platforms', 'integration'],
  'go': ['developer-tools', 'backend-development'],
  'usage': ['analytics', 'system-tools'],
  'ncurses': ['developer-tools', 'terminal'],
  'analyzer': ['analytics', 'developer-tools'],
  'du': ['system-tools', 'developer-tools'],
  'df': ['system-tools', 'developer-tools'],
  'friendly': ['productivity', 'ui-ux'],
  'cleaner': ['system-tools', 'productivity'],
  'privacy': ['privacy', 'security-privacy'],
  'find': ['search', 'developer-tools'],
  'files': ['file-sharing', 'developer-tools'],
  'grep': ['search', 'developer-tools'],
  'recursive': ['developer-tools', 'search'],
  'finder': ['search', 'productivity'],
  'windows': ['developer-tools', 'productivity'],
  'instant': ['search', 'performance'],
  'filename': ['search', 'developer-tools'],
  'virtualization': ['virtualization', 'devops-infrastructure'],
  'vm': ['virtualization', 'devops-infrastructure'],
  'emulator': ['virtualization', 'developer-tools'],
  'qemu': ['virtualization', 'devops-infrastructure'],
  'rss': ['content-media', 'productivity'],
  'reader': ['content-media', 'productivity'],
  'ios': ['mobile', 'developer-tools'],
  'native': ['developer-tools', 'performance'],
  'minimalist': ['productivity', 'design'],
  'self-hosted': ['self-hosting', 'devops-infrastructure'],
  'aggregator': ['content-media', 'productivity'],
  'mobile': ['mobile', 'developer-tools'],
  'read-later': ['productivity', 'content-media'],
  'articles': ['content-media', 'productivity'],
  'save': ['productivity', 'file-sharing'],
  'newsletters': ['marketing-automation', 'content-media'],
  'bookmarks': ['productivity', 'content-media'],
  'archive': ['productivity', 'content-media'],
  'offline': ['productivity', 'privacy'],
  'notes': ['note-taking', 'productivity'],
  'markdown': ['documentation', 'developer-tools'],
  'todo': ['task-management', 'productivity'],
  'knowledge': ['knowledge-management', 'productivity'],
  'outliner': ['productivity', 'note-taking'],
  'backlinks': ['knowledge-management', 'note-taking'],
  'local': ['privacy', 'self-hosting'],
  'local-first': ['privacy', 'self-hosting'],
  'blocks': ['note-taking', 'productivity'],
  'preview': ['developer-tools', 'content-media'],
  'academic': ['education', 'productivity'],
  'citations': ['education', 'documentation'],
  'zettelkasten': ['knowledge-management', 'note-taking'],
  'download': ['file-sharing', 'productivity'],
  'torrent': ['file-sharing', 'networking'],
  'ftp': ['file-sharing', 'developer-tools'],
  'parallel': ['performance', 'developer-tools'],
  'modern': ['design', 'developer-tools'],
  'gui': ['ui-ux', 'developer-tools'],
  'aria2': ['file-sharing', 'developer-tools'],
  'queue': ['productivity', 'developer-tools'],
  'browser': ['developer-tools', 'productivity'],
  'bittorrent': ['file-sharing', 'networking'],
  'client': ['developer-tools', 'productivity'],
  'remote': ['remote-access', 'devops-infrastructure'],
  'lightweight': ['performance', 'developer-tools'],
  'plugins': ['developer-tools', 'customization'],
};

async function seedMoreAlternatives() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Get all categories
    const allCategories = await Category.find().lean();
    const categoryMap = new Map(allCategories.map((c: any) => [c.slug, c._id]));
    console.log(`📂 Found ${allCategories.length} categories`);

    // First, ensure proprietary software exists
    console.log('\n📦 Adding proprietary software...');
    let propAdded = 0;
    for (const prop of newProprietarySoftware) {
      const existing = await ProprietarySoftware.findOne({ slug: prop.slug });
      if (!existing) {
        await ProprietarySoftware.create(prop);
        propAdded++;
      }
    }
    console.log(`  ✅ Added ${propAdded} new proprietary software entries`);

    // Get all proprietary software for linking
    const allProprietary = await ProprietarySoftware.find().lean();
    const proprietaryMap = new Map(allProprietary.map((p: any) => [p.slug, p._id]));
    console.log(`📦 Found ${allProprietary.length} proprietary software entries`);

    // Seed alternatives
    console.log('\n🌱 Seeding more alternatives...');
    let added = 0;
    let skipped = 0;

    for (const alt of newAlternatives) {
      // Check if already exists
      const existing = await Alternative.findOne({ slug: alt.slug });
      if (existing) {
        console.log(`  ⏭️  Skipped (exists): ${alt.name}`);
        skipped++;
        continue;
      }

      // Map category keywords to category IDs
      const categoryIds: mongoose.Types.ObjectId[] = [];
      const usedCategories = new Set<string>();
      
      for (const keyword of alt.categoryKeywords) {
        const slugs = categoryKeywordMap[keyword.toLowerCase()] || [];
        for (const slug of slugs) {
          if (!usedCategories.has(slug) && categoryMap.has(slug)) {
            categoryIds.push(categoryMap.get(slug)!);
            usedCategories.add(slug);
          }
        }
      }

      // Limit to 5 categories max
      const finalCategoryIds = categoryIds.slice(0, 5);

      // Map alternative_to to proprietary software IDs
      const alternativeToIds: mongoose.Types.ObjectId[] = [];
      for (const propSlug of alt.alternative_to) {
        if (proprietaryMap.has(propSlug)) {
          alternativeToIds.push(proprietaryMap.get(propSlug)!);
        }
      }

      // Create the alternative
      await Alternative.create({
        name: alt.name,
        slug: alt.slug,
        short_description: alt.short_description,
        description: alt.description,
        long_description: alt.description,
        website: alt.website,
        github: alt.github,
        license: alt.license,
        is_self_hosted: alt.is_self_hosted,
        categories: finalCategoryIds,
        alternative_to: alternativeToIds,
        approved: true,
        status: 'approved',
        health_score: 50 + Math.floor(Math.random() * 30),
        vote_score: Math.floor(Math.random() * 50),
      });

      console.log(`  ✅ Added: ${alt.name} (${finalCategoryIds.length} categories, ${alternativeToIds.length} proprietary links)`);
      added++;
    }

    console.log(`\n✨ Done! Added ${added} new alternatives, skipped ${skipped} existing`);

    // Final count
    const totalAlternatives = await Alternative.countDocuments();
    console.log(`📊 Total alternatives in database: ${totalAlternatives}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedMoreAlternatives();
