// Package github reads the pinned repositories for a single account through
// GitHub's GraphQL API. Results are cached in memory for an hour, which is the
// same freshness the previous Next.js revalidate window provided.
package github

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"
)

const (
	endpoint = "https://api.github.com/graphql"
	cacheTTL = time.Hour

	pinnedQuery = `query PinnedRepos($login: String!) {
  user(login: $login) {
    pinnedItems(first: 6, types: [REPOSITORY]) {
      nodes {
        ... on Repository {
          name
          description
          url
          stargazerCount
          forkCount
          primaryLanguage { name color }
        }
      }
    }
  }
}`
)

type Repo struct {
	Name        string
	Description string
	URL         string
	Stars       int
	Forks       int
	Language    string
	LanguageHex string
}

type Client struct {
	token    string
	username string
	http     *http.Client

	mu       sync.Mutex
	cached   []Repo
	cachedAt time.Time
}

func New(token, username string) *Client {
	return &Client{
		token:    token,
		username: username,
		http:     &http.Client{Timeout: 8 * time.Second},
	}
}

// PinnedRepos returns the account's pinned repositories, newest cache first.
func (c *Client) PinnedRepos(ctx context.Context) ([]Repo, error) {
	c.mu.Lock()
	if c.cached != nil && time.Since(c.cachedAt) < cacheTTL {
		repos := c.cached
		c.mu.Unlock()
		return repos, nil
	}
	c.mu.Unlock()

	body, err := json.Marshal(map[string]any{
		"query":     pinnedQuery,
		"variables": map[string]string{"login": c.username},
	})
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+c.token)
	req.Header.Set("Content-Type", "application/json")

	res, err := c.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("github: api returned %d", res.StatusCode)
	}

	var payload struct {
		Data struct {
			User struct {
				PinnedItems struct {
					Nodes []struct {
						Name            string `json:"name"`
						Description     string `json:"description"`
						URL             string `json:"url"`
						StargazerCount  int    `json:"stargazerCount"`
						ForkCount       int    `json:"forkCount"`
						PrimaryLanguage *struct {
							Name  string `json:"name"`
							Color string `json:"color"`
						} `json:"primaryLanguage"`
					} `json:"nodes"`
				} `json:"pinnedItems"`
			} `json:"user"`
		} `json:"data"`
		Errors []struct {
			Message string `json:"message"`
		} `json:"errors"`
	}
	if err := json.NewDecoder(res.Body).Decode(&payload); err != nil {
		return nil, err
	}
	if len(payload.Errors) > 0 {
		return nil, fmt.Errorf("github: %s", payload.Errors[0].Message)
	}

	nodes := payload.Data.User.PinnedItems.Nodes
	repos := make([]Repo, 0, len(nodes))
	for _, n := range nodes {
		r := Repo{
			Name:        n.Name,
			Description: n.Description,
			URL:         n.URL,
			Stars:       n.StargazerCount,
			Forks:       n.ForkCount,
		}
		if n.PrimaryLanguage != nil {
			r.Language = n.PrimaryLanguage.Name
			r.LanguageHex = n.PrimaryLanguage.Color
		}
		repos = append(repos, r)
	}

	c.mu.Lock()
	c.cached, c.cachedAt = repos, time.Now()
	c.mu.Unlock()

	return repos, nil
}
