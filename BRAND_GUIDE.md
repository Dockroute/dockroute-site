# DockRoute Brand Guide

## Core concept

DockRoute is the harbor pilot for containerized services.

It quietly guides Docker and Docker Compose workloads from a local container to
the correct public DNS destination. The identity balances three qualities:

- Approachable enough for a homelab.
- Reliable enough for a small SaaS company.
- Open and pragmatic like a well-maintained open-source project.

The visual metaphor is not the sea by itself. It is controlled navigation:

```text
Container → Route → DNS waypoint → Destination
```

The site should feel like a clean harbor control room: dark navy surfaces, clear
routes, precise status indicators, and occasional warm coral accents.

## Brand personality

Use these attributes when making design decisions:

- Calm, not corporate.
- Friendly, not childish.
- Technical, not intimidating.
- Nautical, not pirate-themed.
- Modern, not futuristic.
- Open source, not an "AI startup."
- Dependable, not enterprise-heavy.

Avoid generic AI imagery, neon cyberpunk effects, excessive glassmorphism,
glowing circuit lines, clouds, anchors, whales, and Kubernetes wheels.

## Color system

| Token | Color | Primary use |
| --- | --- | --- |
| Deep Navy | `#102A43` | Brand color, headings, and dark backgrounds |
| Harbor Navy | `#163B5C` | Elevated dark surfaces and cards |
| Harbor Teal | `#22A89A` | Routes, links, active states, and primary actions |
| Deep Teal | `#147D76` | Teal hover states and accessible text |
| Warm Coral | `#F26B5B` | Waypoints, highlights, and important actions |
| Deep Coral | `#D95145` | Coral hover and pressed states |
| Off White | `#F7F3E8` | Warm light background and mascot details |
| Mist | `#E8F1F2` | Soft sections, borders, and code highlights |
| Slate | `#61758A` | Secondary text |
| Ink | `#081B2C` | Dark-mode page background |

### Usage ratio

A typical page should roughly follow:

- 65% neutral backgrounds.
- 20% navy surfaces and typography.
- 10% teal.
- 5% coral.

Teal communicates movement, connection, and success. Coral marks destinations,
important moments, and calls to action. Coral should not become the dominant
color.

### Light theme

```css
--background: #f7f3e8;
--surface: #ffffff;
--surface-muted: #e8f1f2;
--foreground: #102a43;
--muted-foreground: #61758a;
--primary: #147d76;
--primary-hover: #10665f;
--accent: #f26b5b;
--accent-hover: #d95145;
--border: #cfdddf;
```

### Dark theme

```css
--background: #081b2c;
--surface: #102a43;
--surface-elevated: #163b5c;
--foreground: #f7f3e8;
--muted-foreground: #a7bbc5;
--primary: #22a89a;
--primary-hover: #39bcae;
--accent: #f26b5b;
--accent-hover: #ff8071;
--border: #294d67;
```

## Typography

Use a clean humanist sans-serif instead of a futuristic or overly geometric
font.

Recommended combination:

- Headings and interface: `Manrope`.
- Code and technical data: `IBM Plex Mono`.

Alternative with fewer dependencies:

- Interface: `Inter`.
- Code: `ui-monospace`.

Headings should be sturdy and compact, with moderate negative letter spacing.
Avoid giant ultra-thin headings.

```css
font-family: 'Manrope', sans-serif;
font-family: 'IBM Plex Mono', monospace;
```

## UI language

### Shapes

- Card radius: `12px–16px`.
- Button radius: `8px–10px`.
- Use pills only for status indicators.
- Keep borders visible but subtle.
- Use consistent two-pixel route lines in diagrams.
- Avoid overly rounded "bubble SaaS" interfaces.

### Buttons

Primary buttons use teal. Coral is reserved for important secondary emphasis.

```text
Primary: Get Started
Secondary: View on GitHub
Coral accent: Try the Demo
```

Do not use coral for destructive actions. Keep conventional red for errors.

### Cards

Cards can resemble compact control panels:

- Small eyebrow or status label.
- Direct title.
- Short explanation.
- Optional route or status indicator.
- Minimal shadow or no shadow.
- Strong border hierarchy.

### Icons

Use simple outline icons with rounded line endings. Lucide fits the identity
well.

Custom diagrams should reuse:

- Teal lines for routes.
- Coral circles for waypoints.
- Navy blocks for containers and destinations.
- Off-white or mist for inactive infrastructure.

## Illustration language

Pip should appear as a helpful guide, not as decoration in every section.

Good uses:

- Hero area.
- Documentation welcome page.
- Empty states.
- 404 page.
- Successful configuration.
- Community and release announcements.

Avoid using Pip inside every card or turning the mascot into an animated
assistant.

Supporting illustrations should have:

- Flat colors.
- Dark, confident outlines.
- A limited palette.
- Slightly handcrafted geometry.
- No photorealism.
- No plastic 3D appearance.
- No complex shadows.
- No fake interface text.

## Layout direction

The homepage should tell a route story:

```text
Docker Compose
      ↓
   DockRoute
      ↓
DNS Provider
      ↓
Your Domain
```

Suggested sequence:

1. Hero explaining the outcome.
2. Small animated or static route diagram.
3. "How it works" in three steps.
4. Supported providers and Docker labels.
5. Configuration example.
6. Homelab and small-team use cases.
7. Open-source and community section.
8. Final call to action.

Use generous whitespace. Technical sections can be denser, but marketing
sections should remain calm.

## Copy tone

All public copy should remain in English.

Use short, direct sentences. Explain outcomes before architecture.

Good examples:

- "DNS records that follow your containers."
- "From Docker labels to live DNS."
- "Built for Compose. Ready for production."
- "Your services know where to go."
- "Simple enough for a homelab. Reliable enough for your SaaS."
- "No Kubernetes required."

Avoid:

- "Revolutionary DNS orchestration."
- "AI-powered infrastructure."
- "Enterprise-grade next-generation platform."
- Excessive nautical jokes and pirate language.

## Asset usage

- `public/brand/dockroute-logo.png`: header, README, and social banners.
- `public/brand/dockroute-icon.png`: favicon, GitHub avatar, and compact
  navigation.
- `public/brand/dockroute-mascot-pip.png`: hero, documentation, and community
  materials.

## Guiding rule

Every page should look like a precise route through a friendly harbor, not like
a generic infrastructure dashboard.
