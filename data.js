/* ============================================================
   PORTFOLIO CONTENT ? profile, experience, skills.
   Projects and the "Now" status live in content.json and are
   managed from the hidden admin page (admin.html).
   ============================================================ */

window.PORTFOLIO = {
  profile: {
    name: "Yassine Aassila",
    initials: "YA",
    role: "Level 2 IT Support & Infrastructure Professional",
    typing: [
      "Network & Systems Engineer",
      "Cybersecurity Enthusiast",
      "SDN Researcher",
      "Level 2 IT Support Technician"
    ],
    summary:
      "I keep public-sector infrastructure running across Morocco — Windows Server, networking, CCTV and telephony — and I build security tools in my spare time, from SDN attack detection to AI-assisted network defence.",
    available: true,
    availableText: "Open to international opportunities",
    location: "Fès, Morocco · open to relocation",
    email: "yassineassila321@gmail.com",
    phone: "+212 6-88-53-22-98",
    github: "Y-assila",
    linkedin: "https://www.linkedin.com/in/yassine-aassila/",
    cv: { en: "cv-en.pdf", fr: "cv-fr.pdf" },
    formspree: "https://formspree.io/f/movwkgby",
    languages: [
      { name: "Arabic", level: "Native" },
      { name: "French", level: "Professional" },
      { name: "English", level: "B1–B2" }
    ]
  },

  stats: [
    { value: 80, suffix: "+", label: "Servers maintained" },
    { value: 50, suffix: "+", label: "Cities covered" },
    { value: 99, suffix: "%+", label: "System uptime" },
    { value: 3, suffix: "–6", label: "Interventions / day" }
  ],

  about: {
    paragraphs: [
      "I'm a Level 2 IT Support Technician at DATA PROCESS, providing advanced support to public-sector organisations across Morocco. I graduated from OFPPT El Adarissa in Digital Infrastructure (Network & Systems), and my final project combined SDN security with a web-based management tool.",
      "Day to day I troubleshoot production servers, switches and security systems, document what I learn, and turn it into prevention. After hours I build — Python, Flask and SDN labs — because shipping small projects is the fastest way I know to learn."
    ],
    facts: [
      { label: "Education", value: "OFPPT Technician Certificate — Network & Systems (2025)" },
      { label: "Certifications", value: "CCNA coursework · Network Security" },
      { label: "Next goal", value: "Engineering / Master's degree + international role" }
    ]
  },

  /* ---------- Experience & education ---------- */
  experience: [
    {
      org: "DATA PROCESS",
      role: "IT Support Technician — Level 2 (Field Operations)",
      period: "Jul 2025 – Present",
      place: "Morocco",
      current: true,
      summary:
        "Advanced L2 support for public-sector sites (ABHS, Prefectures, ONP, DGI, TGR, CNOPS and ministerial sites).",
      areas: [
        { title: "Windows Server & enterprise systems", points: [
          "Production troubleshooting of Windows Server environments",
          "Active Directory (users, groups, domain auth, AD-DNS dependencies)",
          "Exchange: mail flow, Autodiscover, management console, registry-level fixes",
          "Backup (DPM/DBM) failure analysis and WSUS update troubleshooting" ] },
        { title: "Networking — HP / Aruba", points: [
          "VLANs, access/trunk ports, IP addressing in production",
          "Console, SSH/Telnet and TFTP config backup/restore",
          "Running-config vs startup-config management" ] },
        { title: "Security & surveillance", points: [
          "Hikvision IP cameras and NVRs — install and troubleshooting",
          "Hardware vs PoE vs network fault diagnosis (SADP, iVMS-4200)" ] },
        { title: "Telephony — LG PABX", points: [
          "LG SOHO / ARIA installation and maintenance",
          "Extensions, call routing, trunk and line troubleshooting" ] }
      ],
      tags: ["Active Directory", "Exchange", "WSUS", "Aruba", "Hikvision", "LG PABX"]
    },
    {
      org: "Université Privée de Fès (UPF)",
      role: "IT & Network Infrastructure Intern",
      period: "Apr – May 2025",
      place: "Fès, Morocco",
      summary:
        "Web development, network infrastructure and security work, including the SDN attack-detection project.",
      areas: [
        { title: "Software development", points: [
          "Flask + SQLite app with role-based access and PDF/Excel reporting",
          "Dashboards with matplotlib and seaborn; Windows packaging with PyInstaller" ] },
        { title: "Network security", points: [
          "VLAN and VPN configuration, Wireshark packet analysis",
          "SDN-based attack detection, security policy and hardening" ] }
      ],
      tags: ["Flask", "SDN", "Wireshark", "VPN"]
    },
    {
      org: "OFPPT — El Adarissa",
      role: "Technician in Digital Infrastructure (Network & Systems)",
      period: "2023 – 2025",
      place: "Fès, Morocco",
      education: true,
      summary:
        "CCNA coursework, network security and SDN specialisation; final project on SDN security.",
      areas: [],
      tags: ["CCNA", "Network Security", "SDN"]
    }
  ],

  skills: [
    { group: "Networking", icon: "network",
      items: ["Cisco IOS", "OSPF", "RIP", "VLAN", "VPN", "NAT", "ACL", "HP / Aruba", "Wireshark", "SDN / OpenFlow"] },
    { group: "Systems", icon: "server",
      items: ["Windows Server", "Active Directory", "DNS / DHCP", "GPO", "Exchange", "WSUS", "Linux", "Bash", "VMware", "Hyper-V"] },
    { group: "Security", icon: "shield",
      items: ["Firewalls", "ACL hardening", "DoS / DDoS mitigation", "Threat detection", "CCTV / Hikvision", "Security policies"] },
    { group: "Development", icon: "code",
      items: ["Python", "Flask", "SQLite", "Pandas", "ReportLab", "JavaScript", "Google Apps Script", "PyInstaller"] },
    { group: "Cloud", icon: "cloud",
      items: ["Microsoft Azure", "Virtual machines", "Virtual networks", "NSG / firewall", "Access management"] },
    { group: "Tools", icon: "tool",
      items: ["Mininet", "Ryu", "Packet Tracer", "PowerShell", "SSH / Telnet", "TFTP", "AnyDesk", "TeamViewer"] }
  ]
};
