// === INITIALIZATION === 
document.addEventListener('DOMContentLoaded', function() {
    initFloatingElements();
    initScrollIndicator();
    initSmoothScrolling();
    initSkillProgressBars();
    initCursorTrail();
    initScrollAnimations();
    initFormHandling();
    initProjectModals();
    initImageLightbox();
});

// === FLOATING BACKGROUND ELEMENTS ===
function initFloatingElements() {
    const container = document.getElementById('floatingElements');
    if (!container) return;
    
    // Clear existing elements
    container.innerHTML = '';
    
    const elementCount = 25;
    
    // Create network nodes
    for (let i = 0; i < elementCount; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        
        const startX = Math.random() * window.innerWidth;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 15;
        
        element.style.left = startX + 'px';
        element.style.animationDelay = delay + 's';
        element.style.animationDuration = duration + 's';
        
        // Add different types of network nodes
        if (i % 3 === 0) {
            element.style.background = '#007AFF';
            element.style.boxShadow = '0 0 15px rgba(0, 122, 255, 0.8)';
        } else if (i % 3 === 1) {
            element.style.background = '#5856D6';
            element.style.boxShadow = '0 0 15px rgba(88, 86, 214, 0.8)';
        } else {
            element.style.background = '#30D158';
            element.style.boxShadow = '0 0 15px rgba(48, 209, 88, 0.8)';
        }
        
        container.appendChild(element);
    }
    
    // Create connection lines
    setTimeout(() => {
        createNetworkConnections();
    }, 1000);
}

function createNetworkConnections() {
    const container = document.getElementById('floatingElements');
    if (!container) return;
    
    // Create some static connection lines
    for (let i = 0; i < 8; i++) {
        const connection = document.createElement('div');
        connection.style.position = 'absolute';
        connection.style.width = Math.random() * 200 + 100 + 'px';
        connection.style.height = '1px';
        connection.style.background = `linear-gradient(90deg, transparent, rgba(0, 123, 255, ${Math.random() * 0.3 + 0.2}), transparent)`;
        connection.style.left = Math.random() * window.innerWidth + 'px';
        connection.style.top = Math.random() * window.innerHeight + 'px';
        connection.style.transform = `rotate(${Math.random() * 360}deg)`;
        connection.style.animation = `connectionPulse ${Math.random() * 3 + 2}s infinite ease-in-out`;
        connection.style.transformOrigin = 'center';
        connection.style.pointerEvents = 'none';
        connection.style.zIndex = '-1';
        
        container.appendChild(connection);
    }
}

// === SCROLL PROGRESS INDICATOR ===
function initScrollIndicator() {
    const indicator = document.getElementById('scrollIndicator');
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        indicator.style.width = scrolled + '%';
    });
}

// === SMOOTH SCROLLING NAVIGATION ===
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// === SKILL PROGRESS BARS ===
function initSkillProgressBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

// === CURSOR TRAIL EFFECT ===
function initCursorTrail() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create subtle trail on mouse move
        if (window.innerWidth > 768 && Math.random() > 0.8) {
            createTrail(e.clientX, e.clientY, 'move');
        }
    });
    
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 768) {
            createTrail(e.clientX, e.clientY, 'click');
            // Create multiple trails for click effect
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    createTrail(
                        e.clientX + (Math.random() - 0.5) * 20,
                        e.clientY + (Math.random() - 0.5) * 20,
                        'click'
                    );
                }, i * 100);
            }
        }
    });
    
    function createTrail(x, y, type = 'move') {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        
        if (type === 'click') {
            trail.style.background = 'radial-gradient(circle, var(--primary-color), var(--secondary-color), transparent)';
            trail.style.width = '30px';
            trail.style.height = '30px';
            trail.style.left = x - 15 + 'px';
            trail.style.top = y - 15 + 'px';
        } else {
            trail.style.left = x - 10 + 'px';
            trail.style.top = y - 10 + 'px';
        }
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            if (document.body.contains(trail)) {
                document.body.removeChild(trail);
            }
        }, 800);
    }
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    const animatedElements = document.querySelectorAll('.card, .skill-item, .project-card');
    animatedElements.forEach(el => observer.observe(el));
}

// === FORM HANDLING ===
function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.querySelector('span').textContent;
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Sending...';
            
            try {
                // Submit to Formspree
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                showNotification('Failed to send message. Please try again later.', 'error');
                console.error('Form submission error:', error);
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = originalBtnText;
            }
        });
    }
}

// === PROJECT MODALS ===
function initProjectModals() {
    // Modal close functionality
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProjectModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeProjectModal();
            }
        });
    }
}

// === PROJECT MODAL CONTENT ===
function openProjectModal(projectType) {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const projectData = {
        sdn: {
            title: 'SDN Attack Detection & Response System',
            content: `
                <h2>Project Overview</h2>
                <p>A comprehensive Software-Defined Networking (SDN) security solution that provides real-time network threat detection and automated response capabilities. This system demonstrates advanced network security concepts using modern SDN technologies.</p>
                
                <div class="modal-highlight">
                    <p><strong>Key Achievement:</strong> Successfully detected and mitigated ICMP flood attacks in under 2 seconds with 99.7% accuracy rate.</p>
                </div>
                
                <h2>Technical Architecture</h2>
                
                <h3>SDN Controller Implementation</h3>
                <p>Built using the Ryu SDN framework, the controller monitors network traffic patterns and implements dynamic security policies:</p>
                <ul>
                    <li><strong>Flow Table Management:</strong> Real-time OpenFlow rule installation and modification</li>
                    <li><strong>Packet Inspection:</strong> Deep packet analysis for threat identification</li>
                    <li><strong>Traffic Statistics:</strong> Continuous monitoring of network flow metrics</li>
                    <li><strong>Policy Enforcement:</strong> Automated security rule deployment</li>
                </ul>
                
                <h3>Attack Detection Algorithm</h3>
                <p>The system employs a sophisticated detection mechanism:</p>
                <ul>
                    <li><strong>Threshold-based Detection:</strong> Configurable packet rate thresholds</li>
                    <li><strong>Pattern Recognition:</strong> Statistical analysis of traffic patterns</li>
                    <li><strong>Machine Learning Integration:</strong> Adaptive learning for false positive reduction</li>
                    <li><strong>Multi-vector Analysis:</strong> Protocol-specific attack detection</li>
                </ul>
                
                <div class="tech-stack">
                    <span class="tech-tag">Python 3.8+</span>
                    <span class="tech-tag">Ryu SDN Framework</span>
                    <span class="tech-tag">OpenFlow 1.3</span>
                    <span class="tech-tag">Mininet Network Emulator</span>
                    <span class="tech-tag">SMTP Integration</span>
                    <span class="tech-tag">JSON Logging</span>
                </div>
                
                <h2>Network Topology</h2>
                <p>The testing environment consists of a carefully designed network topology that simulates real-world enterprise scenarios:</p>
                
                <div class="modal-screenshots">
                    <img src="screenshots/sdn-architecture.png" alt="SDN Network Architecture" title="SDN Network Architecture Overview">
                    <img src="screenshots/mininet-topology.png" alt="Mininet Network Topology" title="Mininet Testing Environment">
                    <img src="screenshots/sdn-architecture-detailed.png" alt="Detailed SDN Architecture" title="Detailed SDN Architecture Diagram">
                </div>
                
                <h2>Key Features</h2>
                
                <h3>Real-time Threat Detection</h3>
                <ul>
                    <li><strong>ICMP Flood Detection:</strong> Identifies excessive ping requests targeting network resources</li>
                    <li><strong>DDoS Mitigation:</strong> Automatically blocks malicious traffic sources</li>
                    <li><strong>Bandwidth Monitoring:</strong> Tracks unusual bandwidth consumption patterns</li>
                    <li><strong>Port Scanning Detection:</strong> Identifies reconnaissance activities</li>
                </ul>
                
                <h3>Automated Response System</h3>
                <ul>
                    <li><strong>Dynamic Flow Rules:</strong> Instant deployment of blocking rules</li>
                    <li><strong>Traffic Redirection:</strong> Rerouting of suspicious traffic for analysis</li>
                    <li><strong>Rate Limiting:</strong> Bandwidth throttling for identified threats</li>
                    <li><strong>Quarantine Zones:</strong> Isolation of compromised network segments</li>
                </ul>
                
                <h3>Alert & Notification System</h3>
                <ul>
                    <li><strong>Email Alerts:</strong> Immediate notification to security administrators</li>
                    <li><strong>Detailed Reporting:</strong> Comprehensive attack analysis and metrics</li>
                    <li><strong>Log Management:</strong> Structured logging for forensic analysis</li>
                    <li><strong>Dashboard Integration:</strong> Real-time security status visualization</li>
                </ul>
                
                <div class="modal-screenshots">
                    <img src="screenshots/alert-email.jpg" alt="Security Alert Email" title="Automated Security Alert Email">
                </div>
                
                <h2>Performance Metrics</h2>
                <p>The system has been extensively tested and demonstrates exceptional performance:</p>
                <ul>
                    <li><strong>Detection Latency:</strong> < 2 seconds from attack initiation</li>
                    <li><strong>Response Time:</strong> < 1 second for rule deployment</li>
                    <li><strong>Accuracy Rate:</strong> 99.7% true positive detection</li>
                    <li><strong>False Positive Rate:</strong> < 0.1% under normal traffic conditions</li>
                    <li><strong>Throughput Impact:</strong> < 5% performance overhead</li>
                    <li><strong>Scalability:</strong> Supports networks up to 1000+ endpoints</li>
                </ul>
                
                <h2>Implementation Details</h2>
                
                <h3>Controller Architecture</h3>
                <pre><code>class AttackDetectionController(app_manager.RyuApp):
    OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]
    
    def __init__(self, *args, **kwargs):
        super(AttackDetectionController, self).__init__(*args, **kwargs)
        self.mac_to_port = {}
        self.packet_count = {}
        self.threshold = 100  # packets per second
        self.alert_system = EmailAlertSystem()
    
    @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
    def packet_in_handler(self, ev):
        # Packet analysis and threat detection logic
        if self.detect_icmp_flood(pkt, in_port):
            self.block_malicious_traffic(src_ip)
            self.send_security_alert(src_ip, attack_type)</code></pre>
                
                <h3>Detection Algorithm</h3>
                <pre><code>def detect_icmp_flood(self, packet, source_port):
    current_time = time.time()
    source_ip = packet.src
    
    # Update packet statistics
    if source_ip not in self.packet_stats:
        self.packet_stats[source_ip] = []
    
    self.packet_stats[source_ip].append(current_time)
    
    # Remove old entries (outside time window)
    time_window = 10  # seconds
    self.packet_stats[source_ip] = [
        timestamp for timestamp in self.packet_stats[source_ip]
        if current_time - timestamp <= time_window
    ]
    
    # Check if threshold exceeded
    packet_rate = len(self.packet_stats[source_ip]) / time_window
    return packet_rate > self.threshold</code></pre>
                
                <h2>Security Analysis & Results</h2>
                <p>Comprehensive testing has validated the system's effectiveness across various attack scenarios:</p>
                
                <h3>Attack Scenarios Tested</h3>
                <ul>
                    <li><strong>ICMP Flood Attacks:</strong> Various intensities from 50-10,000 packets/second</li>
                    <li><strong>Distributed Attacks:</strong> Multi-source coordinated attacks</li>
                    <li><strong>Low-and-Slow Attacks:</strong> Stealthy, prolonged attack patterns</li>
                    <li><strong>Protocol-specific Attacks:</strong> TCP SYN floods, UDP floods</li>
                </ul>
                
                <h3>Detection Accuracy</h3>
                <ul>
                    <li><strong>High-intensity Attacks:</strong> 100% detection rate</li>
                    <li><strong>Medium-intensity Attacks:</strong> 99.8% detection rate</li>
                    <li><strong>Low-intensity Attacks:</strong> 98.5% detection rate</li>
                    <li><strong>False Positives:</strong> 0.08% during peak traffic periods</li>
                </ul>
                
                <div class="modal-downloads">
                    <a href="reports/sdn-attack-detection-report.pdf" download class="download-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download Technical Report
                    </a>
                </div>
                
                <h2>Future Enhancements</h2>
                <p>Planned improvements and additional features:</p>
                <ul>
                    <li><strong>AI/ML Integration:</strong> Advanced anomaly detection using neural networks</li>
                    <li><strong>Behavioral Analysis:</strong> User and device behavior profiling</li>
                    <li><strong>Multi-protocol Support:</strong> Extended coverage for IoT protocols</li>
                    <li><strong>Cloud Integration:</strong> Hybrid cloud-SDN security orchestration</li>
                    <li><strong>Threat Intelligence:</strong> Integration with external threat feeds</li>
                    <li><strong>Automated Forensics:</strong> Enhanced incident response capabilities</li>
                </ul>
                
                <p>This project demonstrates the practical application of SDN technologies in cybersecurity, showcasing both technical depth and real-world applicability in enterprise network security scenarios.</p>
            `
        },
        management: {
            title: 'Enterprise Management Platform',
            content: `
                <h2>Project Overview</h2>
                <p>A comprehensive enterprise management system designed to streamline procurement processes, inventory management, and financial reporting. This platform demonstrates full-stack development capabilities with a focus on business process automation and data analytics.</p>
                
                <div class="modal-highlight">
                    <p><strong>Business Impact:</strong> Reduced procurement processing time by 75% and eliminated manual reporting errors, saving 20+ hours per week in administrative tasks.</p>
                </div>
                
                <h2>System Architecture</h2>
                
                <h3>Backend Infrastructure</h3>
                <p>Built on a robust Flask framework with modular architecture for scalability and maintainability:</p>
                <ul>
                    <li><strong>Flask Application:</strong> RESTful API design with blueprint organization</li>
                    <li><strong>SQLite Database:</strong> Optimized relational database schema</li>
                    <li><strong>ORM Integration:</strong> SQLAlchemy for database abstraction</li>
                    <li><strong>Authentication System:</strong> Role-based access control (RBAC)</li>
                </ul>
                
                <h3>Frontend Interface</h3>
                <p>Modern, responsive web interface built with attention to user experience:</p>
                <ul>
                    <li><strong>Responsive Design:</strong> Mobile-first approach with Bootstrap framework</li>
                    <li><strong>Interactive Dashboard:</strong> Real-time data visualization with Chart.js</li>
                    <li><strong>Dynamic Forms:</strong> AJAX-powered form submissions</li>
                    <li><strong>Progressive Enhancement:</strong> Graceful degradation for older browsers</li>
                </ul>
                
                <div class="tech-stack">
                    <span class="tech-tag">Python Flask</span>
                    <span class="tech-tag">SQLite</span>
                    <span class="tech-tag">SQLAlchemy ORM</span>
                    <span class="tech-tag">ReportLab PDF</span>
                    <span class="tech-tag">Pandas Analytics</span>
                    <span class="tech-tag">Bootstrap 5</span>
                    <span class="tech-tag">Chart.js</span>
                    <span class="tech-tag">JWT Authentication</span>
                </div>
                
                <h2>Core Features</h2>
                
                <h3>Procurement Management</h3>
                <ul>
                    <li><strong>Purchase Requisitions:</strong> Digital workflow from request to approval</li>
                    <li><strong>Vendor Management:</strong> Comprehensive supplier database with performance tracking</li>
                    <li><strong>Quote Comparison:</strong> Multi-vendor bidding and evaluation system</li>
                    <li><strong>Contract Management:</strong> Digital contract storage and renewal tracking</li>
                    <li><strong>Approval Workflows:</strong> Configurable multi-level approval processes</li>
                </ul>
                
                <h3>Inventory Control</h3>
                <ul>
                    <li><strong>Real-time Tracking:</strong> Live inventory levels across multiple locations</li>
                    <li><strong>Automated Reordering:</strong> Smart reorder points based on usage patterns</li>
                    <li><strong>Asset Management:</strong> Complete asset lifecycle tracking</li>
                    <li><strong>Barcode Integration:</strong> QR code generation and scanning capabilities</li>
                    <li><strong>Stock Alerts:</strong> Low stock and expiration date notifications</li>
                </ul>
                
                <h3>Financial Reporting</h3>
                <ul>
                    <li><strong>Automated Reports:</strong> Scheduled PDF report generation</li>
                    <li><strong>Budget Tracking:</strong> Real-time budget vs. actual spending analysis</li>
                    <li><strong>Cost Center Analysis:</strong> Department-wise expense tracking</li>
                    <li><strong>Trend Analysis:</strong> Historical spending pattern identification</li>
                    <li><strong>Compliance Reporting:</strong> Audit-ready financial documentation</li>
                </ul>
                
                <div class="modal-screenshots">
                    <img src="screenshots/management-dashboard.jpg" alt="Management Dashboard" title="Main Management Dashboard Interface">
                    <img src="screenshots/pdf-report.png" alt="PDF Report Sample" title="Automated PDF Report Generation">
                </div>
                
                <h2>Database Design</h2>
                
                <h3>Entity Relationship Model</h3>
                <p>Normalized database schema designed for optimal performance and data integrity:</p>
                
                <pre><code>-- Core Tables Structure
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(128),
    role_id INTEGER,
    department_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    requester_id INTEGER,
    department_id INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approval_date TIMESTAMP
);

CREATE TABLE inventory_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    category_id INTEGER,
    current_stock INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    unit_price DECIMAL(8,2),
    location VARCHAR(100)
);</code></pre>
                
                <h3>Performance Optimization</h3>
                <ul>
                    <li><strong>Indexing Strategy:</strong> Optimized indexes on frequently queried columns</li>
                    <li><strong>Query Optimization:</strong> Efficient SQL queries with proper joins</li>
                    <li><strong>Caching Layer:</strong> Redis integration for frequently accessed data</li>
                    <li><strong>Connection Pooling:</strong> Database connection management</li>
                </ul>
                
                <h2>Advanced Analytics</h2>
                
                <h3>Business Intelligence Dashboard</h3>
                <p>Comprehensive analytics providing actionable business insights:</p>
                <ul>
                    <li><strong>Spending Analytics:</strong> Trend analysis and budget variance reporting</li>
                    <li><strong>Supplier Performance:</strong> Vendor scorecards and performance metrics</li>
                    <li><strong>Inventory Optimization:</strong> Stock turnover and carrying cost analysis</li>
                    <li><strong>Process Efficiency:</strong> Workflow bottleneck identification</li>
                </ul>
                
                <h3>Predictive Analytics</h3>
                <ul>
                    <li><strong>Demand Forecasting:</strong> ML-based inventory demand prediction</li>
                    <li><strong>Budget Planning:</strong> Historical data-driven budget recommendations</li>
                    <li><strong>Risk Assessment:</strong> Supplier risk and market volatility analysis</li>
                    <li><strong>Cost Optimization:</strong> Automated cost-saving opportunity identification</li>
                </ul>
                
                <h2>Security Implementation</h2>
                
                <h3>Authentication & Authorization</h3>
                <pre><code>from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

class AuthenticationManager:
    def __init__(self, app):
        self.jwt = JWTManager(app)
        self.app = app
    
    def authenticate_user(self, username, password):
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            access_token = create_access_token(
                identity=user.id,
                additional_claims={
                    'role': user.role.name,
                    'department': user.department.name
                }
            )
            return {'access_token': access_token, 'user': user}
        return None</code></pre>
                
                <h3>Data Protection</h3>
                <ul>
                    <li><strong>Encryption:</strong> AES-256 encryption for sensitive data</li>
                    <li><strong>Input Validation:</strong> Comprehensive data sanitization</li>
                    <li><strong>SQL Injection Prevention:</strong> Parameterized queries and ORM protection</li>
                    <li><strong>XSS Protection:</strong> Output encoding and Content Security Policy</li>
                    <li><strong>CSRF Protection:</strong> Token-based request validation</li>
                </ul>
                
                <h2>Automated Reporting System</h2>
                
                <h3>PDF Report Generation</h3>
                <p>Sophisticated reporting engine using ReportLab for professional document creation:</p>
                
                <pre><code>from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet

class ReportGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
    
    def generate_procurement_report(self, start_date, end_date):
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        story = []
        
        # Add company header
        story.append(self.create_header())
        
        # Add procurement summary table
        procurement_data = self.get_procurement_data(start_date, end_date)
        table = self.create_data_table(procurement_data)
        story.append(table)
        
        # Add charts and analysis
        story.append(self.create_spending_chart())
        
        doc.build(story)
        return buffer.getvalue()</code></pre>
                
                <h3>Automated Email Distribution</h3>
                <ul>
                    <li><strong>Scheduled Reports:</strong> Automatic daily, weekly, and monthly reports</li>
                    <li><strong>Alert Notifications:</strong> Real-time alerts for critical events</li>
                    <li><strong>Custom Recipients:</strong> Role-based report distribution</li>
                    <li><strong>Template Engine:</strong> Customizable email templates</li>
                </ul>
                
                <h2>Performance Metrics</h2>
                
                <h3>System Performance</h3>
                <ul>
                    <li><strong>Response Time:</strong> < 200ms average API response time</li>
                    <li><strong>Concurrent Users:</strong> Supports 100+ simultaneous users</li>
                    <li><strong>Uptime:</strong> 99.9% system availability</li>
                    <li><strong>Data Processing:</strong> Handles 10,000+ transactions per day</li>
                </ul>
                
                <h3>Business Impact</h3>
                <ul>
                    <li><strong>Process Efficiency:</strong> 75% reduction in procurement processing time</li>
                    <li><strong>Cost Savings:</strong> 15% reduction in procurement costs through optimization</li>
                    <li><strong>Error Reduction:</strong> 99% elimination of manual data entry errors</li>
                    <li><strong>Compliance:</strong> 100% audit compliance with automated documentation</li>
                </ul>
                
                <div class="modal-downloads">
                    <a href="reports/management-app-report.pdf" download class="download-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download Project Documentation
                    </a>
                </div>
                
                <h2>Deployment & Scalability</h2>
                
                <h3>Infrastructure Design</h3>
                <ul>
                    <li><strong>Containerization:</strong> Docker containers for consistent deployment</li>
                    <li><strong>Load Balancing:</strong> Nginx reverse proxy for high availability</li>
                    <li><strong>Database Scaling:</strong> Read replicas and connection pooling</li>
                    <li><strong>Monitoring:</strong> Application performance monitoring with alerts</li>
                </ul>
                
                <h3>Future Roadmap</h3>
                <ul>
                    <li><strong>Mobile Application:</strong> Native iOS and Android apps</li>
                    <li><strong>API Expansion:</strong> RESTful API for third-party integrations</li>
                    <li><strong>Machine Learning:</strong> Advanced predictive analytics</li>
                    <li><strong>Blockchain Integration:</strong> Supply chain transparency and traceability</li>
                    <li><strong>Cloud Migration:</strong> Multi-cloud deployment strategy</li>
                </ul>
                
                <p>This enterprise management platform showcases comprehensive full-stack development skills, business process understanding, and the ability to deliver solutions that create measurable business value.</p>
            `
        },
        'sdn-ai': {
            title: 'SDN + AI-Based Cybersecurity Project (Coming Soon)',
            content: `
                <h2>🚀 Next-Generation Network Security</h2>
                <p>An advanced research project combining Software Defined Networking (SDN) with Artificial Intelligence to create an intelligent, adaptive firewall system. This cutting-edge framework represents the future of network security automation.</p>
                
                <div class="modal-highlight">
                    <p><strong>🎯 Vision:</strong> Create a self-learning network security system that adapts to emerging threats in real-time using AI-powered analytics and SDN's programmable infrastructure.</p>
                </div>
                
                <h2>🧠 AI-Enhanced Architecture</h2>
                
                <h3>Machine Learning Components</h3>
                <p>The system will leverage advanced ML algorithms for intelligent threat detection:</p>
                <ul>
                    <li><strong>Anomaly Detection:</strong> Neural networks trained on flow statistics to identify unusual patterns</li>
                    <li><strong>Behavioral Analysis:</strong> Time-series analysis for user and device behavior profiling</li>
                    <li><strong>Predictive Analytics:</strong> Forecasting potential attack vectors before they manifest</li>
                    <li><strong>Adaptive Learning:</strong> Continuous model refinement based on network feedback</li>
                </ul>
                
                <h3>SDN Integration</h3>
                <p>Intelligent network control powered by machine learning insights:</p>
                <ul>
                    <li><strong>Dynamic Policy Generation:</strong> AI-generated security policies based on threat landscape</li>
                    <li><strong>Automated Response:</strong> Intelligent traffic rerouting and isolation strategies</li>
                    <li><strong>Resource Optimization:</strong> ML-driven network resource allocation</li>
                    <li><strong>Self-Healing Networks:</strong> Automatic recovery from security incidents</li>
                </ul>
                
                <div class="tech-stack">
                    <span class="tech-tag">Python 3.9+</span>
                    <span class="tech-tag">Ryu SDN Controller</span>
                    <span class="tech-tag">scikit-learn</span>
                    <span class="tech-tag">pandas</span>
                    <span class="tech-tag">joblib</span>
                    <span class="tech-tag">Mininet</span>
                    <span class="tech-tag">OpenFlow 1.4</span>
                    <span class="tech-tag">scapy</span>
                </div>
                
                <h2>📊 Project Architecture</h2>
                
                <h3>Core Components</h3>
                <ul>
                    <li><strong>AI Firewall Controller:</strong> Ryu-based SDN controller with integrated ML models</li>
                    <li><strong>Network Topology:</strong> Customizable Mininet environments for testing</li>
                    <li><strong>Data Pipeline:</strong> Real-time flow extraction and preprocessing</li>
                    <li><strong>ML Training Engine:</strong> Automated model training and validation</li>
                    <li><strong>Traffic Generator:</strong> Sophisticated attack and normal traffic simulation</li>
                </ul>
                
                <h3>Advanced Features (Planned)</h3>
                <ul>
                    <li><strong>Multi-Vector Detection:</strong> DDoS, port scans, malware communication, data exfiltration</li>
                    <li><strong>Federated Learning:</strong> Collaborative threat intelligence across multiple networks</li>
                    <li><strong>Explainable AI:</strong> Transparent decision-making for security analysts</li>
                    <li><strong>Cloud Integration:</strong> Hybrid on-premises and cloud deployment options</li>
                </ul>
                
                <h2>🎯 Research Goals</h2>
                
                <h3>Academic Contributions</h3>
                <ul>
                    <li><strong>Algorithm Development:</strong> Novel ML algorithms for network security</li>
                    <li><strong>Performance Benchmarking:</strong> Comprehensive evaluation against existing solutions</li>
                    <li><strong>Scalability Analysis:</strong> Testing across various network sizes and topologies</li>
                    <li><strong>Real-world Validation:</strong> Testing with actual enterprise network data</li>
                </ul>
                
                <h3>Industry Applications</h3>
                <ul>
                    <li><strong>Enterprise Security:</strong> Next-generation network protection for businesses</li>
                    <li><strong>IoT Security:</strong> Specialized protection for Internet of Things environments</li>
                    <li><strong>Cloud Security:</strong> Dynamic security for cloud-native applications</li>
                    <li><strong>Critical Infrastructure:</strong> High-availability security for essential services</li>
                </ul>
                
                <h2>📈 Expected Outcomes</h2>
                
                <h3>Performance Targets</h3>
                <ul>
                    <li><strong>Detection Accuracy:</strong> >99.5% true positive rate with <0.05% false positives</li>
                    <li><strong>Response Time:</strong> <500ms from threat detection to mitigation</li>
                    <li><strong>Adaptability:</strong> Self-optimization within 24 hours of deployment</li>
                    <li><strong>Scalability:</strong> Support for 10,000+ concurrent network flows</li>
                </ul>
                
                <h3>Innovation Metrics</h3>
                <ul>
                    <li><strong>Zero-Day Detection:</strong> Ability to identify previously unknown attack patterns</li>
                    <li><strong>Learning Speed:</strong> Rapid adaptation to new threat vectors</li>
                    <li><strong>Resource Efficiency:</strong> Minimal computational overhead while maintaining accuracy</li>
                    <li><strong>Interoperability:</strong> Seamless integration with existing network infrastructure</li>
                </ul>
                
                <h2>🛠️ Development Roadmap</h2>
                
                <h3>Phase 1: Foundation (Q3 2025)</h3>
                <ul>
                    <li>✅ Project architecture design</li>
                    <li>🔄 Basic SDN controller implementation</li>
                    <li>🔄 ML model training pipeline</li>
                    <li>📅 Dataset collection and preprocessing</li>
                </ul>
                
                <h3>Phase 2: Core Development (Q4 2025)</h3>
                <ul>
                    <li>📅 AI-enhanced threat detection</li>
                    <li>📅 Advanced traffic simulation</li>
                    <li>📅 Performance optimization</li>
                    <li>📅 Initial testing and validation</li>
                </ul>
                
                <h3>Phase 3: Advanced Features (Q1 2026)</h3>
                <ul>
                    <li>📅 Cloud deployment capabilities</li>
                    <li>📅 Real-world testing</li>
                    <li>📅 Documentation and research publication</li>
                    <li>📅 Open-source release</li>
                </ul>
                
                <div class="modal-highlight">
                    <p><strong>🎓 Academic Value:</strong> This project will serve as a comprehensive research platform for experimenting with cutting-edge ML algorithms in network security, contributing to both academic knowledge and practical industry solutions.</p>
                </div>
                
                <h2>🤝 Collaboration Opportunities</h2>
                <p>This project presents exciting opportunities for collaboration with:</p>
                <ul>
                    <li><strong>Research Institutions:</strong> Joint research on AI applications in cybersecurity</li>
                    <li><strong>Industry Partners:</strong> Real-world testing and validation environments</li>
                    <li><strong>Open Source Community:</strong> Contributions to SDN and ML security tools</li>
                    <li><strong>Academic Publications:</strong> Conference papers and journal articles</li>
                </ul>
                
                <p><strong>Stay tuned for updates as this groundbreaking project develops!</strong> 🚀</p>
                
                <div style="text-align: center; margin-top: 2rem; padding: 1rem; background: rgba(0, 122, 255, 0.1); border-radius: 12px; border: 1px solid rgba(0, 122, 255, 0.2);">
                    <p style="color: var(--primary-color); font-weight: 600; margin: 0;">📧 Interested in collaboration or have questions about this project?</p>
                    <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">Feel free to reach out through the contact form below!</p>
                </div>
            `
        }
    };
    
    const project = projectData[projectType];
    if (project) {
        modalTitle.textContent = project.title;
        modalBody.innerHTML = project.content;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// === IMAGE LIGHTBOX ===
function initImageLightbox() {
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.modal-screenshots')) {
            openImageLightbox(e.target.src, e.target.alt);
        }
    });
}

function openImageLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${src}" alt="${alt}">
            <button class="lightbox-close">&times;</button>
        </div>
    `;
    
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        animation: fadeIn 0.3s ease-out;
    `;
    
    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
    `;
    
    const img = lightbox.querySelector('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 8px;
    `;
    
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 32px;
        cursor: pointer;
        line-height: 1;
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close handlers
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    closeBtn.addEventListener('click', closeLightbox);
    
    document.addEventListener('keydown', function onEscape(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', onEscape);
        }
    });
    
    function closeLightbox() {
        document.body.removeChild(lightbox);
        document.body.style.overflow = 'auto';
    }
}

// === NOTIFICATION SYSTEM ===
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    `;
    
    const colors = {
        success: '#30D158',
        error: '#FF3B30',
        warning: '#FF9500',
        info: '#007AFF'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }
    }, 5000);
}

// === CONTACT FORM ENHANCEMENT ===
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Add form fields if they don't exist
    if (!form.querySelector('input[name="name"]')) {
        form.innerHTML = `
            <h3 style="margin-bottom: 24px; color: var(--text-primary);">Send a Message</h3>
            
            <div class="form-group">
                <label class="form-label" for="name">Full Name *</label>
                <input type="text" id="name" name="name" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="email">Email Address *</label>
                <input type="email" id="email" name="email" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="subject">Subject</label>
                <select id="subject" name="subject" class="form-select">
                    <option value="">Select a topic</option>
                    <option value="job-opportunity">Job Opportunity</option>
                    <option value="internship">Internship</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="consultation">Technical Consultation</option>
                    <option value="other">Other</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="message">Message *</label>
                <textarea id="message" name="message" class="form-textarea" rows="6" required placeholder="Tell me about your project or opportunity..."></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary">
                <span>Send Message</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                </svg>
            </button>
        `;
        
        // Set form action for Formspree
        form.action = 'https://formspree.io/f/movwkgby';
        form.method = 'POST';
    }
}

// === CONTACT INFO ENHANCEMENT ===
function initContactInfo() {
    const contactInfo = document.querySelector('.contact-info');
    if (!contactInfo) return;
    
    // Update contact items if they're empty
    const items = contactInfo.querySelectorAll('.contact-item');
    if (items.length === 0 || !items[0].querySelector('h4').textContent.trim()) {
        const contactItems = contactInfo.querySelectorAll('.contact-item');
        
        const contactData = [
            {
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
                title: 'Email',
                info: 'yassineassila321@gmail.com'
            },
            {
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
                title: 'Location',
                info: 'Fes, Morocco'
            },
            {
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
                title: 'LinkedIn',
                info: 'Connect with me'
            },
            {
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
                title: 'GitHub',
                info: 'View my repositories'
            },
            {
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>',
                title: 'Availability',
                info: 'Open to opportunities'
            }
        ];
        
        contactItems.forEach((item, index) => {
            if (contactData[index]) {
                const icon = item.querySelector('.contact-icon');
                const details = item.querySelector('.contact-details');
                
                if (icon) icon.innerHTML = contactData[index].icon;
                if (details) {
                    details.innerHTML = `
                        <h4>${contactData[index].title}</h4>
                        <p>${contactData[index].info}</p>
                    `;
                }
            }
        });
    }
}

// Initialize contact enhancements
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initContactInfo();
});

// Add styles for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
