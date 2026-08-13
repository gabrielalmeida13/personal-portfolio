// Package content holds the written material for the site.
//
// It lives in Go rather than a CMS because it changes a few times a year and
// benefits from being reviewed in the same pull request as the markup it feeds.
package content

// Panel is one card in the grid. The collapsed card shows Eyebrow, Title and
// Summary; opening it reveals everything else.
type Panel struct {
	ID      string
	Eyebrow string
	Title   string
	Summary string

	// Kicker sits above the title in the opened view when it needs more
	// context than the card had room for.
	Kicker string

	Facts    []Fact
	Sections []Section
	Bars     []Bar
	Tags     []string
}

// Fact is a short labelled value — period, role, venue.
type Fact struct {
	Label string
	Value string
}

// Section is a headed run of prose inside an opened panel. Heading may be
// empty when the prose stands on its own.
type Section struct {
	Heading    string
	Paragraphs []string
}

// Bar is a labelled proficiency reading, drawn as a meter.
type Bar struct {
	Label   string
	Percent int
}

// SkillGroup is one column of the stack panel.
type SkillGroup struct {
	Label  string
	Skills []string
}

// Profile is the identity shown in the masthead.
type Profile struct {
	Name     string
	Role     string
	Study    string
	Location string
	Intro    string
}

func Me() Profile {
	return Profile{
		Name:     "Gabriel Almeida",
		Role:     "Researcher · CTF Player · Software Engineer",
		Study:    "MSc Informatics Engineering",
		Location: "University of Coimbra",
		Intro:    "I work on software reliability — how systems fail, and what makes them fail less. Currently studying how large language models change the shape of that problem.",
	}
}

// SkillGroups is the full stack.
//
// The grouping separates languages from the things built with them: a language
// appears exactly once, under Languages, and never again beside a framework
// that happens to use it. Everything else is grouped by the job it does.
func SkillGroups() []SkillGroup {
	return []SkillGroup{
		{Label: "Languages", Skills: []string{"Go", "Rust", "Python", "TypeScript", "Java", "C", "C++", "SQL"}},
		{Label: "Backend & APIs", Skills: []string{"FastAPI", "Ruby on Rails", "Django", "Node.js", "LangChain"}},
		{Label: "Frontend", Skills: []string{"React", "Next.js", "HTMX", "Tailwind CSS"}},
		{Label: "Data & Storage", Skills: []string{"PostgreSQL", "ChromaDB", "Redis", "Vector Search", "BM25"}},
		{Label: "Infrastructure", Skills: []string{"Docker", "Linux", "GitHub Actions", "Ollama"}},
		{Label: "Security & Research", Skills: []string{"Reverse Engineering", "Binary Exploitation", "Anomaly Detection", "Reliability Modelling"}},
	}
}

// Panels returns every panel in display order. Adding one here is the only
// step needed to put a new card on the page.
func Panels() []Panel {
	return []Panel{research(), security(), chatbot(), jeknowledge(), exchange()}
}

// PanelByID finds a panel for the expand request. The second return reports
// whether the id matched anything, so the handler can 404 unknown ids rather
// than render an empty overlay.
func PanelByID(id string) (Panel, bool) {
	for _, p := range Panels() {
		if p.ID == id {
			return p, true
		}
	}
	return Panel{}, false
}

func research() Panel {
	return Panel{
		ID:      "research",
		Eyebrow: "Research",
		Title:   "Software Reliability under LLMs",
		Summary: "An empirical study on whether pairing developers with generated code makes systems fail less. Under review at ISSRE 2026.",
		Kicker:  "University of Coimbra · DEI · CISUC",
		Facts: []Fact{
			{Label: "Period", Value: "Sep 2025 — present"},
			{Label: "Venue", Value: "ISSRE 2026 (under review)"},
			{Label: "Group", Value: "UC / DEI / CISUC"},
		},
		Sections: []Section{
			{
				Heading: "LLM-Based Software Reliability",
				Paragraphs: []string{
					"A large-scale empirical study of how large language models affect software reliability, and of the human-AI collaboration strategies that hold up in practice. The central finding so far: pairing a human developer with LLM-generated code measurably reduces critical system failures.",
					"The study evaluates 1-out-of-2 fault-tolerant configurations using the classical Eckhardt-Lee and Littlewood-Miller reliability models. It measures failure overlap across three algorithmic specifications, 14 distinct models, and four languages — C, C++, Java and Pascal.",
				},
			},
			{
				Heading: "Talentos@DEI Scholarship",
				Paragraphs: []string{
					"A research initiation scholarship, January to July 2024, implementing methods to recognise anomalous patterns in complex datasets.",
				},
			},
		},
		Tags: []string{"Software Diversity", "Fault Tolerance", "Large Language Models", "Reliability Engineering", "Anomaly Detection"},
	}
}

func security() Panel {
	return Panel{
		ID:      "security",
		Eyebrow: "Security",
		Title:   "CTF Player & Challenge Author",
		Summary: "Competing internationally and writing the challenges others compete on, at the CISUC cybersecurity laboratory.",
		Kicker:  "CyberSecurity Laboratory · CISUC · University of Coimbra",
		Facts: []Fact{
			{Label: "Period", Value: "Sep 2025 — present"},
			{Label: "Role", Value: "Member & CTF Player"},
			{Label: "Scope", Value: "International Competitions"},
		},
		Sections: []Section{
			{
				Heading: "Challenge Development",
				Paragraphs: []string{
					"Designing and building technical challenges for academic CTF competitions, aimed at making security legible to students and researchers who do not otherwise touch it.",
				},
			},
			{
				Heading: "Competition",
				Paragraphs: []string{
					"Competing in high-level international security events, mostly in reverse engineering, binary exploitation and web categories.",
				},
			},
			{
				Heading: "Outreach",
				Paragraphs: []string{
					"Running the laboratory's public channels and coordinating promotion for its events and competitions.",
				},
			},
		},
		Bars: []Bar{
			{Label: "Reverse Eng.", Percent: 85},
			{Label: "Web", Percent: 78},
			{Label: "Binary Expl.", Percent: 70},
			{Label: "Crypto", Percent: 55},
		},
		Tags: []string{"Reverse Engineering", "Binary Exploitation", "Web Security", "Cryptography", "Challenge Design"},
	}
}

func chatbot() Panel {
	return Panel{
		ID:      "chatbot",
		Eyebrow: "Development",
		Title:   "RAG Platform for CISUC",
		Summary: "A retrieval-augmented chatbot answering questions from CISUC's institutional knowledge base. AI architecture and scalable systems.",
		Kicker:  "Centre for Informatics and Systems · University of Coimbra",
		Facts: []Fact{
			{Label: "Role", Value: "Developer"},
			{Label: "Focus", Value: "AI Architecture & Scalable Systems"},
			{Label: "Repository", Value: "chatbot-cisuc"},
		},
		Sections: []Section{
			{
				Heading: "Orchestration",
				Paragraphs: []string{
					"Architected and implemented a Retrieval-Augmented Generation platform, building the orchestrator with FastAPI and LangChain. Every request is validated and routed centrally, so the interface never talks to the retrieval layer or the vector store directly and business logic stays in one place.",
					"The language model is pluggable between a locally hosted Ollama instance and a hosted provider, which keeps evaluation runs cheap and deployment flexible.",
				},
			},
			{
				Heading: "Hybrid Retrieval",
				Paragraphs: []string{
					"Retrieval combines lexical search over a BM25 index with semantic search over embeddings in ChromaDB, merged by reciprocal rank fusion before the context is handed to the model. Separating retrieval from generation means an improvement in retrieval quality benefits every supported model without touching the runtime.",
				},
			},
			{
				Heading: "Service Architecture",
				Paragraphs: []string{
					"Four independent services — interface, orchestrator, retrieval API and vector database — behind a reverse proxy, each deployable on its own, alongside a preprocessing pipeline that builds the knowledge base out of band so requests never pay for indexing.",
				},
			},
		},
		Tags: []string{"RAG", "FastAPI", "LangChain", "Ollama", "ChromaDB", "BM25", "Vector Search", "Python"},
	}
}

func jeknowledge() Panel {
	return Panel{
		ID:      "jeknowledge",
		Eyebrow: "Experience",
		Title:   "Junior Software Developer",
		Summary: "Full-stack work at jeKnowledge, the student-run junior enterprise. Promoted out of the trainee track in under three months.",
		Kicker:  "jeKnowledge · Junior Enterprise",
		Facts: []Fact{
			{Label: "Period", Value: "Mar 2025 — Oct 2025"},
			{Label: "Role", Value: "Junior Software Developer"},
			{Label: "Progression", Value: "Promoted from Trainee"},
		},
		Sections: []Section{
			{
				Paragraphs: []string{
					"Built and maintained full-stack products in React and Ruby on Rails inside a student-led team, on real client timelines.",
					"Moved from trainee to junior developer in under three months by shipping features the team's projects depended on.",
				},
			},
		},
		Tags: []string{"React", "Ruby on Rails", "Node.js", "TypeScript", "Agile"},
	}
}

func exchange() Panel {
	return Panel{
		ID:      "exchange",
		Eyebrow: "Exchange",
		Title:   "University of Tartu",
		Summary: "Erasmus+ exchange semester at the Institute of Computer Science, on the MSc in Software Engineering. From August 2026.",
		Kicker:  "Institute of Computer Science · Tartu, Estonia",
		Facts: []Fact{
			{Label: "Period", Value: "Aug 2026 — Feb 2027"},
			{Label: "Programme", Value: "Erasmus+ Exchange Semester"},
			{Label: "Level", Value: "MSc in Software Engineering"},
		},
		Sections: []Section{
			{
				Paragraphs: []string{
					"A six-month exchange at the Institute of Computer Science of the University of Tartu, studying at master's level in software engineering.",
				},
			},
		},
		Tags: []string{"Erasmus+", "Software Engineering", "Estonia"},
	}
}
