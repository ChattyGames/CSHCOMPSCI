/*
  Course data for the whole site (courses page, credential map, home page).
  Source of truth: "Chatfield Computer Science, Cybersecurity, and AI" 2027–28 lineup PDF.
  The "inside" lists add what the course actually does in class. Edit freely.
  acc:    the ACC course a class earns concurrent enrollment credit for (approved as of Nov 2026).
          CNG (networking) courses are not approved yet, so none are listed.

  track:  "cs" | "cyber" | "ai" | "is" (independent study)
  entry:  true for Level 1 entry courses
*/
window.PROGRAM = {
  year: "2027–28",
  tracks: {
    cs:    { name: "Computer Science", short: "CS", color: "teal",   blurb: "Circuits, code, games and the machines underneath them." },
    cyber: { name: "Cybersecurity",    short: "Cyber", color: "pink", blurb: "Networks, Linux and defense, trained in a lab built for breaking things." },
    ai:    { name: "Artificial Intelligence", short: "AI", color: "yellow", blurb: "How AI is made, how to test it, and what it should and shouldn't do." },
    is:    { name: "Independent Study", short: "Grades 11–12", color: "white", blurb: "Go deeper on your own project or in a real IT placement." }
  },
  courses: [
    {
      id: "csf", track: "cs", entry: true,
      name: "Computer Science Foundations",
      tagline: "Build a circuit. Code a robot.",
      tags: ["Level 1", "One semester", "Tech+ prep"],
      acc: null,
      certs: ["CompTIA Tech+"],
      inside: [
        "A fast tour of computer science in short, hands-on units",
        "Electricity basics, then Arduino circuits that blink, beep and react",
        "Binary and logic gates: how everything comes down to 1s and 0s",
        "Operating systems: find your way around Windows and Linux",
        "Your first website in HTML, plus live-coded music in the browser",
        "Take a real computer apart and put it back together"
      ]
    },
    {
      id: "coding1", track: "cs", entry: true,
      name: "Coding 1: Through Game Design",
      tagline: "Build and playtest a game.",
      tags: ["Level 1", "Game development", "PCEP prep"],
      acc: null,
      certs: ["PCEP"],
      inside: [
        "Quest-based units with boss battles and level-ups",
        "Build the web: a choose-your-own-adventure site in HTML",
        "Python, where the real coding starts",
        "Make a game with your own sprites in Construct 3",
        "Finish with a game jam in the language of your choice"
      ]
    },
    {
      id: "coding2", track: "cs", entry: false,
      name: "Coding 2: Through Game Design",
      tagline: "Make a bigger game and refine it.",
      tags: ["Game development", "PCEP prep"],
      acc: { code: "CSC 1026", title: "Game Design and Development" },
      certs: ["PCEP"],
      inside: [
        "Pick your engine and build a bigger, more polished game",
        "Classes and object-oriented programming, for real this time",
        "How graphics hardware and VRAM shape game performance",
        "Python certification prep for students who want it (PCEP, then PCAP)"
      ]
    },
    {
      id: "apcsp", track: "cs", entry: false,
      name: "AP Computer Science Principles",
      tagline: "Explore coding and data. Algebra 1 required.",
      tags: ["AP", "Tech+ and PCEP prep"],
      prereq: "Algebra 1",
      acc: { code: "CSC 1001", title: "Programming & Applied Computing" },
      certs: ["CompTIA Tech+", "PCEP"],
      inside: []
    },
    {
      id: "maint", track: "cs", entry: true,
      name: "Computer Maintenance",
      tagline: "Diagnose and repair PCs.",
      tags: ["Level 1", "One semester", "Tech+"],
      acc: null,
      certs: ["CompTIA Tech+"],
      inside: []
    },
    {
      id: "systems", track: "cs", entry: false,
      name: "Computer Systems",
      tagline: "Work with operating systems and hardware.",
      tags: ["CompTIA A+ and Linux+ prep"],
      acc: { code: "CIS 1024", title: "Intro to Operating Systems" },
      certs: ["CompTIA A+", "CompTIA Linux+"],
      note: "Builds skills for both AP courses (AP Networking and AP Cybersecurity). It is not a prerequisite.",
      inside: []
    },
    {
      id: "apnet", track: "cyber", entry: false,
      name: "AP Networking",
      tagline: "Build a network, follow a packet, fix what broke.",
      tags: ["AP", "Cert prep", "Cisco CCST Networking", "CompTIA Linux+ and Network+ prep"],
      acc: { code: "CIS 2020", title: "Fundamentals of UNIX", shared: true },
      certs: ["Cisco CCST Networking", "CompTIA Linux+", "CompTIA Network+"],
      inside: [
        "Hands-on labs every week on real Cisco switches in Chatty Hackville",
        "Boot camp: binary, hex, and how a network differs from the internet",
        "A growing command-line toolkit on Windows and Linux, added to every week",
        "Follow a packet from your keyboard to a server and back",
        "Career and salary context woven through every unit"
      ]
    },
    {
      id: "apcyber", track: "cyber", entry: false,
      name: "AP Cybersecurity",
      tagline: "Investigate alerts and learn to defend systems.",
      tags: ["AP", "Cert prep", "Cisco CCST Cybersecurity", "CompTIA Security+ prep"],
      acc: { code: "CIS 2020", title: "Fundamentals of UNIX", shared: true },
      certs: ["Cisco CCST Cybersecurity", "CompTIA Security+"],
      inside: [
        "Defend real systems in the isolated Chatty Hackville lab",
        "Linux, hardening and system administration",
        "Investigate alerts and figure out what actually happened"
      ]
    },
    {
      id: "ftai", track: "ai", entry: true,
      name: "Future Technologies: AI",
      tagline: "Build, test, and evaluate generative AI tools.",
      tags: ["Level 1", "AWS AI Practitioner prep", "Generative AI"],
      acc: { code: "CIS 1068", title: "Intro to Generative AI" },
      certs: ["AWS Certified AI Practitioner"],
      inside: [
        "AI literacy for everyone. No coding required",
        "Look inside the machine: how models are trained, and where they go wrong",
        "Put AI claims on trial with tests you design yourself",
        "Spot scams and deepfakes, verify what AI tells you, protect your privacy",
        "Build and break small chatbots, safely, in our own lab",
        "A semester-long investigation that ends with students teaching what they found"
      ]
    },
    {
      id: "datasci", track: "ai", entry: false,
      name: "Data Science",
      tagline: "Analyze and model real-world data.",
      tags: ["Math Department", "One semester"],
      prereq: "Algebra II or Algebra II Honors (C or better)",
      acc: null,
      certs: [],
      inside: []
    },
    {
      id: "philai", track: "ai", entry: false,
      name: "Philosophy & Ethics of AI",
      tagline: "Debate what AI should and shouldn’t do.",
      tags: ["ACC college credit"],
      acc: { code: "PHI 1030", title: "Philosophy of AI" },
      certs: [],
      inside: []
    },
    {
      id: "iscert", track: "is", entry: false,
      name: "CTE Certification",
      tagline: "Build a cloud lab, prototype a VR experience, or go deeper in Python, Linux, and cybersecurity.",
      tags: ["Independent study", "Grades 11–12"],
      acc: null,
      certs: ["AWS Certified Cloud Practitioner", "Unity Certified User: VR Developer", "PCEP", "PCAP", "CompTIA Tech+", "CompTIA A+", "CompTIA Linux+", "CompTIA Network+", "CompTIA Security+", "LPI Linux Essentials", "Adobe (select)"],
      inside: []
    },
    {
      id: "wbl", track: "is", entry: false,
      name: "CTE Work-Based Learning",
      tagline: "Apply your skills in an approved IT placement.",
      tags: ["Independent study", "Grades 11–12"],
      note: "60 internship hours can count for 0.5 high school elective credit.",
      acc: null,
      certs: [],
      inside: []
    }
  ],
  mapNotes: [
    "ACC: approved for concurrent enrollment credit. Students enroll with ACC separately to earn it.",
    "AP: colleges determine credit or placement.",
    "Certification prep is separate from the exam. Confirm access, fees, and vouchers.",
    "A dash means no alignment is listed here."
  ],
  links: {
    registration: "https://chatfield.jeffcopublicschools.org/counseling/course-registration",
    accCatalog: "https://www.arapahoe.edu/sites/default/files/catalog/ay26-27-catalog.pdf",
    credentialList: "https://docs.google.com/spreadsheets/d/1aTDRModbEErqr5jJbi17GFwm5Q8rBh4iybr6HCEXIqY/edit?gid=0"
  }
};
