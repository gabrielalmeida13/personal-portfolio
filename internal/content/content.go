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
	Name      string
	Role      string
	Study     string
	Location  string
	Available string
	Intro     string
}

func Me() Profile {
	return Profile{
		Name:      "Gabriel Almeida",
		Role:      "Researcher · CTF player · Software developer",
		Study:     "BSc Informatics Engineering",
		Location:  "University of Coimbra",
		Available: "Open to research collaboration and internships",
		Intro:     "I work on software reliability — how systems fail, and what makes them fail less. Currently studying how large language models change the shape of that problem.",
	}
}

// SkillGroups is the full stack, grouped the way it is actually used.
func SkillGroups() []SkillGroup {
	return []SkillGroup{
		{Label: "Frontend", Skills: []string{"React", "Next.js", "TypeScript", "Tailwind CSS"}},
		{Label: "Backend", Skills: []string{"Go", "Node.js", "Python", "Ruby on Rails", "Django", "PostgreSQL"}},
		{Label: "Infrastructure", Skills: []string{"Docker", "GitHub Actions", "Linux", "Ollama"}},
		{Label: "Security & research", Skills: []string{"Reverse engineering", "Data analysis", "LLM prompting"}},
		{Label: "Languages", Skills: []string{"C", "C++", "Java"}},
	}
}

// CoreSkills is the short list shown on the collapsed stack card.
func CoreSkills() []string {
	return []string{"Go", "TypeScript", "Python", "PostgreSQL", "Docker"}
}

// Panels returns every panel in display order.
func Panels() []Panel {
	return []Panel{research(), security(), jeknowledge()}
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
		Title:   "Software reliability under LLMs",
		Summary: "An empirical study on whether pairing developers with generated code makes systems fail less. Under review at ISSRE 2026.",
		Kicker:  "University of Coimbra · DEI · CISUC",
		Facts: []Fact{
			{Label: "Period", Value: "Sep 2025 — present"},
			{Label: "Venue", Value: "ISSRE 2026 (under review)"},
			{Label: "Group", Value: "UC / DEI / CISUC"},
		},
		Sections: []Section{
			{
				Heading: "LLM-based software reliability",
				Paragraphs: []string{
					"A large-scale empirical study of how large language models affect software reliability, and of the human-AI collaboration strategies that hold up in practice. The central finding so far: pairing a human developer with LLM-generated code measurably reduces critical system failures.",
					"The study evaluates 1-out-of-2 fault-tolerant configurations using the classical Eckhardt-Lee and Littlewood-Miller reliability models. It measures failure overlap across three algorithmic specifications, 14 distinct models, and four languages — C, C++, Java and Pascal.",
				},
			},
			{
				Heading: "Talentos@DEI scholarship",
				Paragraphs: []string{
					"A research initiation scholarship, January to July 2024, implementing methods to recognise anomalous patterns in complex datasets.",
				},
			},
		},
		Tags: []string{"Software diversity", "Fault tolerance", "Large language models", "Reliability engineering", "Anomaly detection"},
	}
}

func security() Panel {
	return Panel{
		ID:      "security",
		Eyebrow: "Security",
		Title:   "CTF player & challenge author",
		Summary: "Competing internationally and writing the challenges others compete on, at the CISUC cybersecurity laboratory.",
		Kicker:  "CyberSecurity Laboratory · CISUC · University of Coimbra",
		Facts: []Fact{
			{Label: "Period", Value: "Sep 2025 — present"},
			{Label: "Role", Value: "Member & CTF player"},
			{Label: "Scope", Value: "International competitions"},
		},
		Sections: []Section{
			{
				Heading: "Challenge development",
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
			{Label: "Reverse eng.", Percent: 85},
			{Label: "Web", Percent: 78},
			{Label: "Binary expl.", Percent: 70},
			{Label: "Crypto", Percent: 55},
		},
		Tags: []string{"Reverse engineering", "Binary exploitation", "Web security", "Cryptography", "Challenge design"},
	}
}

func jeknowledge() Panel {
	return Panel{
		ID:      "jeknowledge",
		Eyebrow: "Experience",
		Title:   "Junior software developer",
		Summary: "Full-stack work at jeKnowledge, the student-run junior enterprise. Promoted out of the trainee track in under three months.",
		Kicker:  "jeKnowledge · Junior enterprise",
		Facts: []Fact{
			{Label: "Period", Value: "Mar 2025 — Oct 2025"},
			{Label: "Role", Value: "Junior software developer"},
			{Label: "Progression", Value: "Promoted from trainee"},
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
