/** UI-only mock steps — same data as RemediationTimelineView hardcoded subtasks */
export const MOCK_MANUAL_STEPS = [
  {
    id: 1,
    name: "Emergency network isolation",
    category: "Firewall",
    assignedTeam: "Network Security Team",
    members: [
      { user_id: 1, name: "John Doe" },
      { user_id: 2, name: "Jane Smith" },
    ],
    status: "pending",
    action: "Block all inbound TCP traffic to port 5985 immediately",
    filePath: "/etc/iptables/rules.v4 (or network firewall ACL)",
    command: `# On 192.168.1.53
iptables -I INPUT 1 -p tcp --dport 5985 -j DROP
iptables -I OUTPUT 1 -p tcp --sport 5985 -m state --state ESTABLISHED -j ACCEPT
iptables-save | tee /etc/iptables/rules.v4

# On network firewall (Cisco IOS example)
ip access-list extended BLOCK_STRUTS
  deny tcp any host 192.168.1.53 eq 5985
  permit ip any any`,
    expectedOutput: "Port 5985 shows as 'filtered' from all external sources",
    verificationCheck:
      "nmap -Pn -p 5985 192.168.1.53 # Expected: 5985/tcp filtered wsman\n" +
      "curl --connect-timeout 3 http://192.168.1.53:5985/ && echo STILL_OPEN || echo BLOCKED",
    whereToRunLabel: "192.168.1.53 (SSH as root) AND network firewall console",
    whereToRun: "192.168.1.53 (SSH as root) AND network firewall console",
    tools: ["iptables", "nmap", "curl", "netfilter-persistent"],
    consideration:
      "Port 5985 is the Windows Remote Management (WinRM) default port — confirm what service is actually running here. Apache Struts normally runs on 8080 or 443. The Nessus finding on port 5985 may indicate a non-standard deployment.",
    subTasks: [],
  },
  {
    id: 2,
    name: "Configuration Management",
    category: "Configuration",
    assignedTeam: "DevOps Team",
    members: [{ user_id: 3, name: "Mike Johnson" }],
    status: "pending",
    action: "Update system configuration to disable vulnerable service",
    filePath: "C:\\temp\\cipher_before.txt",
    command: "nmap -sV -p 5985 192.168.1.53",
    expectedOutput:
      "The command completes without error messages. Confirm the change is applied as described in this step.",
    verificationCheck:
      "Check that the change is in place and there are no error messages or warnings.",
    whereToRunLabel: "Terminal / Command Prompt (open the terminal on your system)",
    whereToRun: "Terminal / Command Prompt",
    tools: ["nmap"],
    consideration: "Ensure output path is writable",
    subTasks: [
      {
        description: "Backup current configuration",
        items: [
          "Create backup of existing configuration",
          "Verify backup integrity",
          "Store backup in secure location",
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Patch Apache Struts to latest version",
    category: "Patch",
    assignedTeam: "Application Team",
    members: [
      { user_id: 4, name: "Sarah Williams" },
      { user_id: 5, name: "Tom Brown" },
    ],
    status: "pending",
    action: "Upgrade Apache Struts framework to version 2.5.33 or later to patch CVE-2017-5638",
    filePath: "/opt/application/pom.xml",
    command: `# Backup current application
cp -r /opt/application /opt/application.backup

# Update pom.xml with latest Struts version
sed -i 's/<struts2.version>.*<\\/struts2.version>/<struts2.version>2.5.33<\\/struts2.version>/g' /opt/application/pom.xml

# Rebuild application
cd /opt/application
mvn clean package

# Deploy updated WAR file
cp target/application.war /opt/tomcat/webapps/`,
    expectedOutput:
      "Application successfully rebuilt with Struts 2.5.33. WAR file deployed to Tomcat.",
    verificationCheck:
      'curl http://192.168.1.53:8080/application/ | grep "Struts 2.5.33"\n' +
      "nmap --script http-vuln-cve2017-5638 192.168.1.53 -p 8080",
    whereToRunLabel: "192.168.1.53 (SSH as application user)",
    whereToRun: "192.168.1.53 (SSH as application user)",
    tools: ["maven", "nmap", "curl", "tomcat"],
    consideration:
      "This will require application downtime. Schedule during maintenance window. Ensure all dependencies are compatible with Struts 2.5.33 before upgrading.",
    subTasks: [
      {
        description: "Pre-deployment checks",
        items: [
          "Review application dependencies",
          "Run compatibility tests",
          "Notify stakeholders of maintenance window",
        ],
      },
      {
        description: "Post-deployment verification",
        items: [
          "Run security scan to confirm vulnerability is patched",
          "Verify application functionality",
          "Monitor application logs for errors",
        ],
      },
    ],
  },
];
