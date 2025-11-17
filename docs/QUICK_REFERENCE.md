# ⚡ Quick Reference - New Features

## 🚀 Quick Access

| Feature | Location | Link |
|---------|----------|------|
| **View All Features** | Features Page | `/features` |
| **Try Chatbot** | Bottom-right corner | Anywhere |
| **Dashboard** | User Dashboard | `/dashboard` |
| **Report Issue** | Issue Form | `/report` |

---

## 📱 Component Quick Import

```tsx
// All components in one import
import { ChatbotAssistant } from "@/components/chatbot-assistant"
import { IssueTemplatesGrid, IssueTemplatesPicker } from "@/components/issue-templates"
import { ImpactStats, ImpactShowcase } from "@/components/impact-stats"
import { Leaderboard } from "@/components/leaderboard"
import { AdvancedSearch } from "@/components/advanced-search"
import { SocialShare } from "@/components/social-share"
import { PriorityBadge, getPriorityFromIssue } from "@/components/priority-badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
```

---

## 🎯 Feature Quick Guide

### 🤖 Chatbot
```tsx
<ChatbotAssistant />
```
**Available on:** Every page (global)  
**Best for:** Answering user questions instantly

### ⚡ Templates
```tsx
<IssueTemplatesGrid showPreview onSelect={handleSelect} />
// or
<IssueTemplatesPicker />
```
**Best for:** Speeding up issue reporting

### 📊 Impact Stats
```tsx
<ImpactStats variant="compact" />
// or
<ImpactShowcase />
```
**Best for:** Showing community achievements

### 🏆 Leaderboard
```tsx
<Leaderboard variant="reporters" />  // Top reporters
<Leaderboard variant="communities" /> // Top communities  
<Leaderboard variant="officials" />   // Top municipalities
```
**Best for:** Recognition and gamification

### 🔍 Advanced Search
```tsx
<AdvancedSearch isCompact={false} onSearch={handleSearch} />
```
**Best for:** Powerful issue discovery

### 📢 Social Share
```tsx
<SocialShare 
  title="Issue Title"
  description="Issue description"
  url="/issues/123"
/>
```
**Best for:** Amplifying issue awareness

### ⚠️ Priority Badge
```tsx
<PriorityBadge priority="critical" showIcon />
// Calculate automatically
const priority = getPriorityFromIssue("pothole", 50, 15)
```
**Best for:** Visual urgency indicators

---

## 📍 Page Structure

### Home Page (`/`)
- ✅ Features navigation button
- ✅ Features showcase cards
- ✅ Impact statistics
- ✅ Chatbot (global)

### Dashboard (`/dashboard`)
- ✅ Features exploration card
- ✅ Impact statistics widget
- ✅ Recent issues list
- ✅ Chatbot (global)

### Features Page (`/features`)
- ✅ Tabbed interface
- ✅ All features showcased
- ✅ Live demonstrations
- ✅ How-to guides
- ✅ Call-to-action buttons
- ✅ Chatbot (global)

---

## 🎨 Styling

All components use **Tailwind CSS** classes:

```tsx
// Colors
bg-blue-50, bg-green-50, bg-purple-50 // Backgrounds
text-blue-600, text-green-600         // Text
border-blue-200                       // Borders

// Components
Card, Button, Badge, Badge, Input
Select, Tabs, Dialog, AlertDialog
```

---

## 🔑 Key Props

| Component | Key Props | Example |
|-----------|-----------|---------|
| `ChatbotAssistant` | None | `<ChatbotAssistant />` |
| `IssueTemplatesGrid` | `onSelect`, `showPreview` | `<IssueTemplatesGrid onSelect={fn} showPreview />` |
| `ImpactStats` | `stats`, `variant` | `<ImpactStats variant="compact" />` |
| `Leaderboard` | `title`, `variant` | `<Leaderboard variant="reporters" />` |
| `AdvancedSearch` | `onSearch`, `isCompact` | `<AdvancedSearch isCompact onSearch={fn} />` |
| `SocialShare` | `title`, `url` | `<SocialShare title="..." url="..." />` |
| `PriorityBadge` | `priority`, `showIcon` | `<PriorityBadge priority="high" />` |

---

## 📊 Data Types

### Issue Priority
```ts
type PriorityLevel = "critical" | "high" | "medium" | "low"
```

### Leaderboard Entry
```ts
interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  badge?: string
  contribution: string
}
```

### Issue Template
```ts
interface IssueTemplate {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  suggestedDetails: string[]
}
```

### Search Filters
```ts
interface AdvancedSearchFilters {
  query: string
  category: string
  status: string
  priority: string
  dateRange: string
  sortBy: string
}
```

---

## 🎬 Usage Examples

### Add chatbot globally
```tsx
// In app/layout.tsx
import { ChatbotAssistant } from "@/components/chatbot-assistant"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ChatbotAssistant />
      </body>
    </html>
  )
}
```

### Report page with templates
```tsx
import { IssueTemplatesPicker } from "@/components/issue-templates"

export default function ReportPage() {
  return (
    <div>
      <h1>Report an Issue</h1>
      <IssueTemplatesPicker />
      {/* Report form here */}
    </div>
  )
}
```

### Dashboard with all features
```tsx
import { ImpactStats } from "@/components/impact-stats"
import { Leaderboard } from "@/components/leaderboard"
import { AdvancedSearch } from "@/components/advanced-search"

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <ImpactStats variant="compact" />
      <AdvancedSearch isCompact />
      <Leaderboard variant="reporters" />
    </div>
  )
}
```

---

## 🔗 Navigation

```
/              → Home (with features)
/features      → Features showcase (main hub)
/dashboard     → User dashboard (features card + stats)
/issues        → Issues map (search + filters)
/report        → Report issue (templates)
/auth/login    → Login page
/auth/sign-up  → Signup page
```

---

## 🚦 Status

- ✅ All components built
- ✅ TypeScript compiled
- ✅ Production build passed
- ✅ Ready to deploy
- ✅ Chatbot global
- ✅ Features showcased

---

## 📚 Documentation

- **User Guide:** `NEW_FEATURES.md`
- **Developer Guide:** `DEVELOPER_FEATURES_GUIDE.md`
- **Implementation:** `FEATURES_IMPLEMENTATION_COMPLETE.md`

---

## 💡 Pro Tips

1. **Chatbot** can be customized by editing `generateBotResponse()` function
2. **Templates** can be extended by adding to `issueTemplates` array
3. **Leaderboard** data should be connected to real database queries
4. **Search filters** can be customized by editing filter options
5. All components support **dark mode** via `darkMode` CSS class

---

**Everything is ready to go! 🚀**

Start the dev server:
```bash
npm run dev
```

Visit `/features` to see everything!
