# Developer's Quick Start Guide - New Features

This guide helps developers understand and use the new feature components added to the Konnekt My City app.

---

## 📁 File Structure

All new feature components are located in `/components/`:

```
components/
├── chatbot-assistant.tsx      # AI Chat widget
├── issue-templates.tsx        # Quick report templates
├── impact-stats.tsx           # Community statistics
├── social-share.tsx           # Social media sharing
├── priority-badge.tsx         # Issue priority levels
├── advanced-search.tsx        # Search & filter system
├── leaderboard.tsx            # Gamification & recognition
```

---

## 🤖 ChatbotAssistant

**File:** `components/chatbot-assistant.tsx`

### Basic Usage

```tsx
import { ChatbotAssistant } from "@/components/chatbot-assistant"

export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      {/* Add chatbot to any page */}
      <ChatbotAssistant />
    </div>
  )
}
```

### Features
- Floating chat bubble
- Minimizable window
- Auto-responding bot
- Message history

### Customization

The bot's responses are based on intent matching in `generateBotResponse()`. To add more responses:

```tsx
const generateBotResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes("your-keyword")) {
    return "Your custom response here"
  }
  // ... more conditions
}
```

---

## ⚡ Issue Templates

**File:** `components/issue-templates.tsx`

### Components

#### 1. IssueTemplatesGrid
Displays all templates as cards

```tsx
import { IssueTemplatesGrid } from "@/components/issue-templates"

export default function ReportPage() {
  const handleSelect = (template) => {
    console.log("Selected:", template.title)
  }

  return (
    <IssueTemplatesGrid 
      onSelect={handleSelect}
      showPreview={true}
    />
  )
}
```

**Props:**
- `onSelect?: (template) => void` - Callback when template selected
- `showPreview?: boolean` - Show suggested details

#### 2. IssueTemplatesPicker
Complete card with description

```tsx
import { IssueTemplatesPicker } from "@/components/issue-templates"

export default function ReportPage() {
  return <IssueTemplatesPicker />
}
```

### Adding New Templates

Edit the `issueTemplates` array:

```tsx
export const issueTemplates: IssueTemplate[] = [
  // ... existing templates
  {
    id: "new-type",
    title: "New Issue Type",
    description: "Description here",
    icon: <YourIcon className="w-6 h-6" />,
    color: "from-color-500 to-color-600",
    suggestedDetails: ["Detail 1", "Detail 2", "Detail 3"],
  },
]
```

---

## 📊 Impact Stats

**File:** `components/impact-stats.tsx`

### Components

#### 1. ImpactStats
Displays statistics in grid format

```tsx
import { ImpactStats } from "@/components/impact-stats"

// Default stats
<ImpactStats />

// Compact layout
<ImpactStats variant="compact" />

// Custom stats
const customStats = [
  {
    label: "Custom Stat",
    value: "123",
    change: "+45 this month",
    icon: <Icon />,
    color: "text-blue-600",
  },
]
<ImpactStats stats={customStats} />
```

**Props:**
- `stats?: ImpactStat[]` - Custom statistics
- `variant?: "compact" | "detailed"` - Layout style

#### 2. ImpactShowcase
Complete showcase with statistics and success stories

```tsx
import { ImpactShowcase } from "@/components/impact-stats"

export default function Home() {
  return <ImpactShowcase />
}
```

### Updating Statistics

Edit the `defaultStats` array to show real data from your database:

```tsx
const defaultStats: ImpactStat[] = [
  {
    label: "Issues Reported",
    value: await getIssueCount(), // From DB
    change: `+${await getRecentIssueCount()} this month`,
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-blue-600",
  },
  // ... more stats
]
```

---

## 📢 Social Share

**File:** `components/social-share.tsx`

### Usage

```tsx
import { SocialShare } from "@/components/social-share"

export default function IssuePage() {
  return (
    <SocialShare
      title="Pothole on Main Street"
      description="Large pothole causing traffic hazards"
      url="/issues/123"
      issueId="123"
    />
  )
}
```

### Props
- `title: string` - What to share
- `description?: string` - Optional description
- `url: string` - Link to share
- `issueId?: string` - Optional issue identifier

### Supported Platforms
- X (Twitter)
- Facebook
- WhatsApp
- LinkedIn
- Direct link copy

---

## ⚠️ Priority Badge

**File:** `components/priority-badge.tsx`

### Usage

```tsx
import { PriorityBadge, getPriorityFromIssue } from "@/components/priority-badge"

// Simple badge
<PriorityBadge priority="critical" showIcon={true} />

// Get priority from issue data
const priority = getPriorityFromIssue(
  category="pothole",
  votes=25,
  daysSinceReport=5
)
<PriorityBadge priority={priority} />
```

### Priority Levels
- `critical` - Red badge
- `high` - Orange badge
- `medium` - Yellow badge
- `low` - Green badge

### Helper Function: getPriorityFromIssue

```tsx
function getPriorityFromIssue(
  category?: string,
  votes?: number,
  daysSinceReport?: number
): PriorityLevel
```

Logic:
- If >30 days old → Critical
- If >50 votes → High
- If pothole/power outage → High
- If >20 votes → Medium
- Otherwise → Low

---

## 🔍 Advanced Search

**File:** `components/advanced-search.tsx`

### Usage

```tsx
import { AdvancedSearch } from "@/components/advanced-search"

export default function IssuesPage() {
  const handleSearch = (filters) => {
    console.log("Search with filters:", filters)
    // Implement search logic
  }

  return (
    <AdvancedSearch 
      onSearch={handleSearch}
      isCompact={false}
    />
  )
}
```

### Props
- `onSearch?: (filters) => void` - Callback with filter data
- `isCompact?: boolean` - Compact mode (click to expand)

### Filter Object

```tsx
interface AdvancedSearchFilters {
  query: string          // Text search
  category: string       // Issue category
  status: string         // Issue status
  priority: string       // Priority level
  dateRange: string      // Days: "7", "30", "90", "365", "all"
  sortBy: string         // "recent", "oldest", "votes", "priority", "comments"
}
```

---

## 🏆 Leaderboard

**File:** `components/leaderboard.tsx`

### Usage

```tsx
import { Leaderboard } from "@/components/leaderboard"

// Default leaderboard
<Leaderboard />

// Custom title
<Leaderboard title="Top Contributors" />

// Different variant
<Leaderboard variant="communities" />
<Leaderboard variant="officials" />
```

### Props
- `title?: string` - Custom title
- `variant?: "reporters" | "communities" | "officials"`

### Variants
1. **reporters** - Top individual reporters
2. **communities** - Most active community groups
3. **officials** - Most responsive municipalities

### Data Structure

```tsx
interface LeaderboardEntry {
  rank: number
  name: string
  avatar?: string
  score: number
  badge?: string
  contribution: string
}
```

### Updating Data

Replace the hardcoded arrays with database queries:

```tsx
const reportersData = await getTopReporters()
const communitiesData = await getTopCommunities()
const officialsData = await getTopOfficials()
```

---

## 🔗 Integration Points

### 1. In App Layout (`app/layout.tsx`)
Already added! Chatbot appears on all pages:
```tsx
import { ChatbotAssistant } from "@/components/chatbot-assistant"

// In the body:
<ChatbotAssistant />
```

### 2. In Dashboard (`app/dashboard/page.tsx`)
Features showcase card and impact stats already integrated.

### 3. In Home Page (`app/page.tsx`)
Features section and impact stats already added.

### 4. In Features Page (`app/features/page.tsx`)
Complete showcase of all features with tabs.

---

## 🚀 Adding Features to New Pages

### Example: Add all features to a custom page

```tsx
"use client"

import { ChatbotAssistant } from "@/components/chatbot-assistant"
import { AdvancedSearch } from "@/components/advanced-search"
import { PriorityBadge } from "@/components/priority-badge"
import { SocialShare } from "@/components/social-share"
import { ImpactStats } from "@/components/impact-stats"
import { Leaderboard } from "@/components/leaderboard"

export default function CustomPage() {
  return (
    <div>
      <h1>My Custom Page</h1>
      
      {/* Search */}
      <AdvancedSearch isCompact={true} />
      
      {/* Issue card example */}
      <div>
        <h2>Sample Issue</h2>
        <PriorityBadge priority="high" />
        <SocialShare 
          title="Sample Issue" 
          url="/issues/1"
        />
      </div>
      
      {/* Stats */}
      <ImpactStats variant="compact" />
      
      {/* Leaderboard */}
      <Leaderboard />
      
      {/* Chatbot on every page */}
      <ChatbotAssistant />
    </div>
  )
}
```

---

## 📝 Component Props Summary

| Component | Key Props | Optional Props |
|-----------|-----------|-----------------|
| ChatbotAssistant | None | - |
| IssueTemplatesGrid | - | onSelect, showPreview |
| ImpactStats | - | stats, variant |
| SocialShare | title, url | description, issueId |
| PriorityBadge | priority | showIcon |
| AdvancedSearch | - | onSearch, isCompact |
| Leaderboard | - | title, variant |

---

## 🎨 Styling

All components use:
- **Tailwind CSS** - Utility classes
- **shadcn/ui** - Pre-styled components
- **Custom gradients** - Using theme colors

### Custom Styling
To customize colors, edit the gradient values:

```tsx
// Example: Change priority badge colors
const config = {
  critical: {
    className: "bg-red-100 text-red-800 hover:bg-red-200 border-red-300",
    // ...
  },
}
```

---

## 🧪 Testing Components

### In Development
```bash
npm run dev
```

Visit `/features` page to see all components in action with interactive tabs.

### Component Isolation
Import and test components individually in your own test pages.

---

## 📚 Resources

- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **Lucide Icons**: https://lucide.dev
- **Next.js**: https://nextjs.org

---

## 🐛 Troubleshooting

### Chatbot not showing
- Check `/app/layout.tsx` imports ChatbotAssistant
- Verify component is added to body

### Templates not rendering
- Import from correct path: `@/components/issue-templates`
- Check issueTemplates array is exported

### Stats showing dummy data
- Replace defaultStats with database queries
- Ensure server components for DB access

### Social share not working
- Check URL props are correct
- Verify social links are not blocked by content policy

---

## 📞 Support

For issues with these components:
1. Check the component file comments
2. Review the example usage in `/app/features/page.tsx`
3. Test in isolation first
4. Check browser console for errors

Happy coding! 🚀
