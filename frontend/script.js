/**
 * DevFlow – Frontend JavaScript
 * ================================
 * Handles routing, API calls, rendering, and all UI interactions.
 * Architecture: Simple SPA with hash-based routing. No framework required.
 */

"use strict";

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

const API_BASE = "http://localhost:5000";

// ─────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────

const routes = {
  "dashboard":  renderDashboard,
  "tasks":      renderTasks,
  "task-detail":renderTaskDetail,
  "code":       renderCode,
  "learning":   renderLearning,
};

function navigate(page, params = {}) {
  window.location.hash = page;
  window._routeParams = params;
  renderPage(page);
  // Update nav active state
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.page === page);
  });
}

function renderPage(page) {
  const content = document.getElementById("page-content");
  if (!content) return;
  content.innerHTML = `<div style="display:flex;justify-content:center;padding:60px"><div class="spinner"></div></div>`;
  const fn = routes[page] || renderDashboard;
  fn(content);
}

// ─────────────────────────────────────────────
// API HELPERS
// ─────────────────────────────────────────────

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    // Return mock data if backend is offline — keeps demo working
    console.warn(`API offline, using fallback for ${endpoint}`);
    return getFallbackData(endpoint);
  }
}

function getFallbackData(endpoint) {
  // Minimal local fallback so the UI works without the backend running
  if (endpoint.includes("/dashboard-summary")) return FALLBACK.summary;
  if (endpoint.includes("/tasks"))             return FALLBACK.tasks;
  if (endpoint.includes("/progress"))          return FALLBACK.progress;
  return { success: true };
}

// ─────────────────────────────────────────────
// FALLBACK DATA (mirrors backend mock data)
// ─────────────────────────────────────────────

const FALLBACK = {
  summary: {
    success: true,
    summary: {
      stats: { tasks_completed:48, tasks_in_progress:7, tasks_overdue:2, focus_score:87, commits_this_week:23, prs_merged:5 },
      sprint: { name:"Sprint 14", progress:75, monthly_goal:60, test_coverage:90, days_remaining:3 },
      weekly_output: [
        {day:"Mon",tasks:9},{day:"Tue",tasks:12},{day:"Wed",tasks:7},
        {day:"Thu",tasks:11},{day:"Fri",tasks:14},{day:"Sat",tasks:4},{day:"Sun",tasks:2}
      ],
      recent_tasks: [
        {id:1,title:"Fix auth token refresh bug",priority:"high",status:"in_progress",deadline:"2025-04-22",tags:["bug","auth"]},
        {id:2,title:"Implement pagination API",priority:"high",status:"pending",deadline:"2025-04-24",tags:["api"]},
        {id:3,title:"Review PR #312 – data layer",priority:"medium",status:"pending",deadline:"2025-04-22",tags:["review"]},
        {id:6,title:"Set up CI/CD pipeline",priority:"high",status:"overdue",deadline:"2025-04-18",tags:["devops"]},
      ],
      user: { name:"Meera Singh", streak:28, level:14, xp:3420, xp_to_next:4000 }
    }
  },
  tasks: {
    success: true,
    count: 6,
    tasks: [
      {id:1,title:"Fix auth token refresh bug",description:"JWT refresh fails after ~12h. Users get logged out unexpectedly.",priority:"high",status:"in_progress",deadline:"2025-04-22",tags:["bug","auth","backend"],assignee:"Aditya K.",created_at:"2025-04-18",comments:[{author:"Priya S.",text:"Reproduced locally.",time:"2h ago"}],activity:[{event:"Task created",time:"4 days ago"},{event:"Status → In Progress",time:"1h ago"}]},
      {id:2,title:"Implement cursor-based pagination",description:"Switch to cursor-based pagination for the main feed endpoint.",priority:"high",status:"pending",deadline:"2025-04-24",tags:["api","performance"],assignee:"Aditya K.",created_at:"2025-04-20",comments:[],activity:[{event:"Task created",time:"2 days ago"}]},
      {id:3,title:"Review PR #312 – data layer",description:"Check for N+1 queries and proper connection pooling.",priority:"medium",status:"pending",deadline:"2025-04-22",tags:["review","database"],assignee:"Aditya K.",created_at:"2025-04-21",comments:[{author:"Rahul M.",text:"All tests pass.",time:"3h ago"}],activity:[{event:"Task created",time:"1 day ago"}]},
      {id:4,title:"Update OpenAPI documentation",description:"All v2 endpoints need updated Swagger/OpenAPI specs.",priority:"low",status:"completed",deadline:"2025-04-20",tags:["docs","api"],assignee:"Aditya K.",created_at:"2025-04-15",comments:[],activity:[{event:"Task created",time:"7 days ago"},{event:"Status → Completed",time:"2 days ago"}]},
      {id:5,title:"Write unit tests for parser",description:"Achieve 90%+ coverage for the token parser module.",priority:"medium",status:"completed",deadline:"2025-04-19",tags:["testing","auth"],assignee:"Aditya K.",created_at:"2025-04-14",comments:[],activity:[{event:"Task created",time:"8 days ago"}]},
      {id:6,title:"Set up CI/CD pipeline",description:"Automate testing, linting, and deployment on every PR merge.",priority:"high",status:"overdue",deadline:"2025-04-18",tags:["devops","ci-cd"],assignee:"Aditya K.",created_at:"2025-04-10",comments:[],activity:[{event:"Task created",time:"12 days ago"},{event:"Deadline passed",time:"4 days ago"}]},
    ]
  },
  progress: {
    success: true,
    data: {
      user: { name:"Meera Singh", streak:28, level:14, xp:3420, xp_to_next:4000 },
      skills: [
        {name:"TypeScript",level:88,color:"#4f6ef7"},{name:"React",level:74,color:"#a78bfa"},
        {name:"Node.js",level:65,color:"#4f6ef7"},{name:"PostgreSQL",level:52,color:"#22c55e"},
        {name:"Docker",level:38,color:"#f59e0b"},{name:"Rust",level:18,color:"#ef4444"},
      ],
      courses: [
        {title:"Advanced TypeScript Patterns",progress:88,category:"Language",hours_spent:22,total_hours:25},
        {title:"System Design Fundamentals",progress:60,category:"Architecture",hours_spent:15,total_hours:25},
        {title:"Rust for Backend Developers",progress:18,category:"Language",hours_spent:4,total_hours:30},
        {title:"PostgreSQL Deep Dive",progress:52,category:"Database",hours_spent:13,total_hours:20},
        {title:"Docker & Kubernetes Essentials",progress:38,category:"DevOps",hours_spent:9,total_hours:18},
      ],
      achievements: [
        {title:"Speed Coder",description:"50 tasks in one week",icon:"🚀",earned:true},
        {title:"On Fire",description:"28-day learning streak",icon:"🔥",earned:true},
        {title:"TypeScript Pro",description:"80%+ proficiency",icon:"🏆",earned:true},
        {title:"Merge Master",description:"Merge 25 PRs",icon:"🔀",earned:false},
        {title:"Test Champion",description:"95% test coverage",icon:"✅",earned:false},
      ],
      stats: { tasks_completed:48, commits_this_week:23, prs_merged:5 }
    }
  }
};

// ─────────────────────────────────────────────
// RENDER: DASHBOARD
// ─────────────────────────────────────────────

async function renderDashboard(el) {
  const data = await apiFetch("/dashboard-summary");
  const s = data.summary;

  el.innerHTML = `
  <div class="page">
    <div class="page-header">
      <div>
        <div class="page-title">Good morning, ${s.user.name.split(" ")[0]} 👋</div>
        <div class="page-sub">Wednesday, April 22 · ${s.stats.tasks_in_progress} tasks in progress · Streak: ${s.user.streak} days 🔥</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" onclick="navigate('tasks')">View All Tasks</button>
        <button class="btn btn-primary btn-sm" onclick="openAddTaskModal()">+ New Task</button>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid-4" style="margin-bottom:20px">
      ${statCard("Tasks Completed", s.stats.tasks_completed, "↑ 12% this week", "delta-up", "#22c55e")}
      ${statCard("In Progress", s.stats.tasks_in_progress, "3 high priority", "delta-neu", "#4f6ef7")}
      ${statCard("Overdue", s.stats.tasks_overdue, "↑ from 0 last week", "delta-dn", "#ef4444")}
      ${statCard("Focus Score", s.stats.focus_score, "↑ 5pts from Mon", "delta-up", "#a78bfa")}
    </div>

    <div class="grid-2" style="margin-bottom:20px">
      <!-- Weekly Bar Chart -->
      <div class="card">
        <div class="card-header">
          <div><div class="card-title">Weekly Output</div><div class="card-sub">Tasks completed per day</div></div>
          <span class="tag tag-blue">${s.weekly_output.reduce((a,d)=>a+d.tasks,0)} total</span>
        </div>
        <div style="display:flex;align-items:flex-end;gap:8px;height:100px;padding-top:8px">
          ${s.weekly_output.map((d,i) => {
            const max = Math.max(...s.weekly_output.map(x=>x.tasks));
            const h = Math.round((d.tasks/max)*90);
            const isToday = i === 2;
            return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
              <div style="font-size:10px;color:var(--text-muted)">${d.tasks}</div>
              <div style="height:${h}px;width:100%;background:${isToday?'var(--accent)':'var(--bg-overlay)'};border-radius:4px 4px 0 0;border:1px solid ${isToday?'var(--accent)':'var(--border)'};transition:height .4s"></div>
              <div style="font-size:10px;color:${isToday?'var(--accent)':'var(--text-muted)'};font-weight:${isToday?600:400}">${d.day}</div>
            </div>`;
          }).join("")}
        </div>
      </div>

      <!-- Sprint Progress -->
      <div class="card">
        <div class="card-header">
          <div><div class="card-title">Sprint Progress</div><div class="card-sub">${s.sprint.name} · ${s.sprint.days_remaining} days left</div></div>
        </div>
        <div style="display:flex;justify-content:space-around;align-items:center;padding:8px 0">
          ${ringChart(s.sprint.progress, "Sprint", "#4f6ef7")}
          ${ringChart(s.sprint.monthly_goal, "Monthly", "#a78bfa")}
          ${ringChart(s.sprint.test_coverage, "Coverage", "#22c55e")}
        </div>
      </div>
    </div>

    <!-- Recent Tasks -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Recent Tasks</div>
        <button class="btn btn-ghost btn-sm" onclick="navigate('tasks')">View all →</button>
      </div>
      ${s.recent_tasks.map(t => taskRowHTML(t, true)).join("")}
    </div>
  </div>`;
}

function statCard(label, value, delta, deltaClass, color) {
  return `<div class="stat-card">
    <div class="stat-label">${label}</div>
    <div class="stat-value" style="color:${color}">${value}</div>
    <div class="stat-delta ${deltaClass}">${delta}</div>
  </div>`;
}

function ringChart(pct, label, color) {
  const r = 28, c = 2*Math.PI*r;
  const offset = c - (pct/100)*c;
  return `<div style="text-align:center">
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r="${r}" fill="none" stroke="var(--bg-overlay)" stroke-width="6"/>
      <circle cx="36" cy="36" r="${r}" fill="none" stroke="${color}" stroke-width="6"
        stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"
        stroke-linecap="round" transform="rotate(-90 36 36)"/>
      <text x="36" y="32" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text-primary)" font-family="DM Sans,sans-serif">${pct}%</text>
      <text x="36" y="46" text-anchor="middle" font-size="9" fill="var(--text-muted)" font-family="DM Sans,sans-serif">${label}</text>
    </svg>
  </div>`;
}

// ─────────────────────────────────────────────
// RENDER: TASKS
// ─────────────────────────────────────────────

async function renderTasks(el) {
  const data = await apiFetch("/tasks");
  const tasks = data.tasks || [];
  let filter = "all";

  function render() {
    const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter || t.priority === filter);
    el.innerHTML = `
    <div class="page">
      <div class="page-header">
        <div>
          <div class="page-title">Task Planner</div>
          <div class="page-sub">${tasks.length} tasks total · ${tasks.filter(t=>t.status==='completed').length} completed</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary btn-sm" onclick="openAddTaskModal()">+ New Task</button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div style="display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap">
        ${["all","pending","in_progress","completed","overdue","high","medium","low"].map(f => `
          <button class="btn btn-sm ${filter===f?'btn-primary':'btn-secondary'}" onclick="window._taskFilter='${f}';navigate('tasks')">${f.replace("_"," ")}</button>
        `).join("")}
      </div>

      <!-- Stats Row -->
      <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap">
        <div class="tag tag-amber tag-dot">Pending: ${tasks.filter(t=>t.status==='pending').length}</div>
        <div class="tag tag-blue tag-dot">In Progress: ${tasks.filter(t=>t.status==='in_progress').length}</div>
        <div class="tag tag-green tag-dot">Completed: ${tasks.filter(t=>t.status==='completed').length}</div>
        <div class="tag tag-red tag-dot">Overdue: ${tasks.filter(t=>t.status==='overdue').length}</div>
      </div>

      <!-- Task List -->
      <div>
        ${filtered.length ? filtered.map(t => taskRowHTML(t)).join("") : '<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">No tasks match this filter.</div></div>'}
      </div>
    </div>`;
  }

  // Check for saved filter
  if (window._taskFilter) { filter = window._taskFilter; }
  render();
}

function taskRowHTML(t, compact=false) {
  const statusColors = { pending:"amber", in_progress:"blue", completed:"green", overdue:"red" };
  const priorityColors = { high:"red", medium:"amber", low:"green" };
  return `<div class="task-row${t.status==='completed'?' completed':''}" onclick="navigate('task-detail',{id:${t.id}});window._taskId=${t.id}">
    <div class="task-check${t.status==='completed'?' done':''}">${t.status==='completed'?'<svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" fill="none" stroke="white" stroke-width="1.5"/></svg>':''}</div>
    <div class="task-body">
      <div class="task-title-text">${t.title}</div>
      <div class="task-meta-row">
        <span class="tag tag-${priorityColors[t.priority]}" style="font-size:10px">${t.priority}</span>
        <span class="tag tag-${statusColors[t.status]}" style="font-size:10px">${t.status.replace("_"," ")}</span>
        ${!compact ? (t.tags||[]).slice(0,2).map(tg=>`<span class="tag tag-muted" style="font-size:10px">${tg}</span>`).join("") : ""}
      </div>
    </div>
    ${t.deadline ? `<div class="task-deadline">📅 ${t.deadline}</div>` : ""}
  </div>`;
}

// ─────────────────────────────────────────────
// RENDER: TASK DETAIL
// ─────────────────────────────────────────────

async function renderTaskDetail(el) {
  const id = window._taskId || 1;
  const data = await apiFetch(`/tasks/${id}`);
  const t = data.task || FALLBACK.tasks.tasks.find(x=>x.id===id) || FALLBACK.tasks.tasks[0];

  const statusColors = { pending:"amber", in_progress:"blue", completed:"green", overdue:"red" };
  const priorityColors = { high:"red", medium:"amber", low:"green" };

  el.innerHTML = `
  <div class="page">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
      <button class="btn btn-secondary btn-sm" onclick="navigate('tasks')">← Back</button>
      <div class="page-title" style="font-size:16px">Task Detail</div>
    </div>

    <div class="grid-2" style="align-items:start;gap:20px">
      <!-- Left: Main Info -->
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px">
            <div style="font-size:16px;font-weight:600;line-height:1.4">${t.title}</div>
            <span class="tag tag-${statusColors[t.status]}">${t.status.replace("_"," ")}</span>
          </div>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;margin-bottom:16px">${t.description || "No description provided."}</p>
          <div class="divider"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            ${metaItem("Priority", `<span class="tag tag-${priorityColors[t.priority]}">${t.priority}</span>`)}
            ${metaItem("Deadline", t.deadline || "—")}
            ${metaItem("Assignee", t.assignee || "Unassigned")}
            ${metaItem("Created", t.created_at || "—")}
          </div>
          ${(t.tags||[]).length ? `<div style="margin-top:14px;display:flex;gap:6px;flex-wrap:wrap">${t.tags.map(tg=>`<span class="tag tag-muted">${tg}</span>`).join("")}</div>` : ""}
        </div>

        <!-- Status Updater -->
        <div class="card">
          <div class="card-title" style="margin-bottom:12px">Update Status</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${["pending","in_progress","completed","overdue"].map(s => `
              <button class="btn btn-sm ${t.status===s?'btn-primary':'btn-secondary'}" onclick="updateStatus(${t.id},'${s}')">${s.replace("_"," ")}</button>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Right: Comments + Activity -->
      <div style="display:flex;flex-direction:column;gap:16px">
        <!-- Comments -->
        <div class="card">
          <div class="card-title" style="margin-bottom:14px">Comments (${(t.comments||[]).length})</div>
          ${(t.comments||[]).length ? t.comments.map(c => `
            <div style="display:flex;gap:10px;margin-bottom:12px">
              <div class="avatar sm">${c.author.split(" ").map(w=>w[0]).join("")}</div>
              <div style="flex:1">
                <div style="font-size:12px;font-weight:600">${c.author} <span style="color:var(--text-muted);font-weight:400">${c.time}</span></div>
                <div style="font-size:13px;color:var(--text-secondary);margin-top:3px">${c.text}</div>
              </div>
            </div>
          `).join("") : '<div style="color:var(--text-muted);font-size:13px;margin-bottom:12px">No comments yet.</div>'}
          <div class="divider"></div>
          <div style="display:flex;gap:8px;margin-top:12px">
            <input class="form-input" placeholder="Add a comment..." id="comment-input" style="flex:1"/>
            <button class="btn btn-primary btn-sm" onclick="addComment()">Post</button>
          </div>
        </div>

        <!-- Activity Timeline -->
        <div class="card">
          <div class="card-title" style="margin-bottom:14px">Activity</div>
          ${(t.activity||[]).map((a,i) => `
            <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:${i<t.activity.length-1?'12px':'0'}">
              <div style="width:1px;background:var(--border);height:100%;flex-shrink:0;position:relative;margin-top:6px">
                <div style="width:7px;height:7px;border-radius:50%;background:var(--accent);position:absolute;left:-3px;top:0"></div>
              </div>
              <div style="padding-left:10px">
                <div style="font-size:13px">${a.event}</div>
                <div style="font-size:11px;color:var(--text-muted)">${a.time}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  </div>`;
}

function metaItem(label, value) {
  return `<div><div style="font-size:11px;color:var(--text-muted);margin-bottom:3px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">${label}</div><div style="font-size:13px">${value}</div></div>`;
}

async function updateStatus(id, status) {
  const data = await apiFetch(`/tasks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
  if (data.success || data.task) {
    showToast(`Status updated to "${status.replace("_"," ")}"`, "success");
    renderTaskDetail(document.getElementById("page-content"));
  }
}

function addComment() {
  const input = document.getElementById("comment-input");
  if (!input?.value.trim()) return;
  showToast("Comment added!", "success");
  input.value = "";
}

// ─────────────────────────────────────────────
// RENDER: CODE WORKSPACE
// ─────────────────────────────────────────────

function renderCode(el) {
  const files = {
    "auth.ts": `import jwt from 'jsonwebtoken'
import { db } from './db'

// Refresh access token using stored refresh token
export async function refreshAccessToken(
  refreshToken: string
): Promise<string | null> {
  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET!
    ) as JwtPayload

    const user = await db.users.findById(payload.userId)
    if (!user) return null

    return jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )
  } catch {
    return null
  }
}`,
    "api.ts": `import express from 'express'
import { refreshAccessToken } from './auth'

const router = express.Router()

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return res.status(400).json({ error: 'Missing token' })
  }

  const newToken = await refreshAccessToken(refreshToken)
  if (!newToken) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  res.json({ accessToken: newToken })
})

export default router`,
    "db.ts": `import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
})

export const db = {
  users: {
    findById: (id: string) =>
      pool.query('SELECT * FROM users WHERE id=$1', [id])
        .then(r => r.rows[0] ?? null)
  }
}`,
  };

  let activeFile = "auth.ts";
  let runCount = 0;

  function highlight(code) {
    return code
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/(\/\/.*)/g,`<span style="color:#4e5168;font-style:italic">$1</span>`)
      .replace(/\b(import|export|from|const|let|async|await|function|return|if|try|catch|as)\b/g,`<span style="color:#a78bfa">$1</span>`)
      .replace(/\b(string|number|boolean|null|undefined|Promise|void)\b/g,`<span style="color:#f472b6">$1</span>`)
      .replace(/'([^']*)'/g,`<span style="color:#34d399">'$1'</span>`)
      .replace(/\b(\w+)\s*\(/g,(m,fn)=>`<span style="color:#60a5fa">${fn}</span>(`)
      .replace(/\b(\d+)\b/g,`<span style="color:#fb923c">$1</span>`);
  }

  function buildEditor() {
    const code = files[activeFile];
    const lines = code.split("\n");
    return lines.map((l,i)=>
      `<div style="display:flex;gap:0"><span style="color:#2d3148;min-width:28px;text-align:right;padding-right:16px;user-select:none">${i+1}</span><span>${highlight(l)||"&nbsp;"}</span></div>`
    ).join("");
  }

  function getConsoleOutput() {
    runCount++;
    const isError = runCount % 4 === 0;
    if (isError) return [
      {c:"#60a5fa",t:"→ Compiling auth.ts..."},
      {c:"#ef4444",t:"✗ Error: JWT_SECRET is not defined"},
      {c:"#ef4444",t:"  at refreshAccessToken (auth.ts:9:5)"},
      {c:"#4e5168",t:"  Check your .env file and try again."},
    ];
    return [
      {c:"#60a5fa",t:"→ Compiling auth.ts..."},
      {c:"#34d399",t:"✓ Compiled successfully (0 errors)"},
      {c:"#60a5fa",t:"→ Running with mock token..."},
      {c:"#34d399",t:"✓ Token verified: user_id=42"},
      {c:"#34d399",t:"✓ New access token issued"},
      {c:"#4e5168",t:"  expires_in: 900s (15 minutes)"},
    ];
  }

  function render() {
    el.innerHTML = `
    <div class="page" style="padding:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div>
          <div class="page-title">Code Workspace</div>
          <div class="page-sub">TypeScript · DevFlow/backend · auth module</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-sm btn-secondary" id="theme-btn">☀ Theme</button>
          <button class="btn btn-sm btn-primary" id="run-btn">▶ Run</button>
        </div>
      </div>

      <div style="display:flex;border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--border);height:520px">
        <!-- File Tree -->
        <div style="width:176px;background:#111118;border-right:1px solid var(--border);padding:10px 8px;flex-shrink:0">
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.8px;padding:4px 8px;margin-bottom:6px">EXPLORER</div>
          ${Object.keys(files).map(f=>`
            <div class="file-item${activeFile===f?' active':''}" data-file="${f}" onclick="window._setFile('${f}')">
              <span style="opacity:.7">📄</span>${f}
            </div>
          `).join("")}
          <div style="margin-top:8px;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.8px;padding:4px 8px">TESTS</div>
          <div class="file-item" style="padding-left:20px"><span style="opacity:.7">🧪</span>auth.test.ts</div>
        </div>

        <!-- Editor -->
        <div style="flex:1;background:#0d0e16;display:flex;flex-direction:column;overflow:hidden">
          <!-- Tabs -->
          <div style="display:flex;background:#0a0b12;border-bottom:1px solid var(--border);padding:0 8px;gap:2px;flex-shrink:0">
            ${Object.keys(files).map(f=>`
              <div style="padding:8px 16px;font-size:12px;color:${activeFile===f?'#818cf8':'#4e5168'};cursor:pointer;border-bottom:2px solid ${activeFile===f?'#818cf8':'transparent'};transition:all .15s" onclick="window._setFile('${f}')">${f}</div>
            `).join("")}
          </div>
          <!-- Code -->
          <div class="code-font" id="editor-body" style="flex:1;padding:14px 16px;overflow:auto;font-size:12.5px;line-height:1.8;color:#c9d1d9">
            ${buildEditor()}
          </div>
        </div>

        <!-- Console -->
        <div style="width:300px;background:#0a0b12;border-left:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0">
          <div style="padding:10px 14px;background:#0d0e16;border-bottom:1px solid var(--border);font-size:11px;color:var(--text-muted);display:flex;align-items:center;justify-content:space-between">
            <span>Console</span>
            <div style="display:flex;align-items:center;gap:8px">
              <span id="con-status" style="color:#22c55e;font-size:10px">● ready</span>
              <span onclick="document.getElementById('con-body').innerHTML='<div style=color:#4e5168;font-family:monospace;font-size:12px>Console cleared.</div>'" style="cursor:pointer;color:var(--text-muted);font-size:11px">Clear</span>
            </div>
          </div>
          <div class="code-font" id="con-body" style="flex:1;padding:12px;overflow-y:auto;font-size:11.5px;line-height:1.7">
            <div style="color:#60a5fa">→ DevFlow Runtime v2.4</div>
            <div style="color:#4e5168">TypeScript 5.4 · Node 20</div>
            <div style="color:#4e5168">────────────────────</div>
            <div style="color:#22c55e">✓ Compiled auth.ts</div>
            <div style="color:#4e5168">Waiting...</div>
          </div>
        </div>
      </div>
    </div>`;

    // Style file items inline since we're generating html
    document.querySelectorAll(".file-item").forEach(f => {
      f.style.cssText = "display:flex;align-items:center;gap:6px;padding:5px 8px;border-radius:5px;cursor:pointer;font-size:12px;color:#6b7280;transition:all .15s;font-family:'JetBrains Mono',monospace";
      if (f.classList.contains("active")) { f.style.background="#1e1e3f"; f.style.color="#818cf8"; }
      f.onmouseenter = () => { if(!f.classList.contains("active")) { f.style.background="#1a1b2e"; f.style.color="#c9d1d9"; } };
      f.onmouseleave = () => { if(!f.classList.contains("active")) { f.style.background=""; f.style.color="#6b7280"; } };
    });

    document.getElementById("run-btn").onclick = () => {
      const status = document.getElementById("con-status");
      const body = document.getElementById("con-body");
      status.style.color = "#f59e0b"; status.textContent = "● running";
      setTimeout(() => {
        const lines = getConsoleOutput();
        lines.forEach(l => {
          const d = document.createElement("div");
          d.style.color = l.c; d.textContent = l.t;
          body.appendChild(d); body.scrollTop = body.scrollHeight;
        });
        status.style.color = "#22c55e"; status.textContent = "● ready";
      }, 500);
    };
  }

  window._setFile = (f) => { activeFile = f; render(); };
  render();
}

// ─────────────────────────────────────────────
// RENDER: LEARNING TRACKER
// ─────────────────────────────────────────────

async function renderLearning(el) {
  const data = await apiFetch("/progress");
  const d = data.data;

  el.innerHTML = `
  <div class="page">
    <div class="page-header">
      <div>
        <div class="page-title">Learning Tracker</div>
        <div class="page-sub">Your growth journey · ${d.user.streak}-day streak 🔥 · Level ${d.user.level}</div>
      </div>
      <button class="btn btn-primary btn-sm">+ Add Course</button>
    </div>

    <!-- XP Bar -->
    <div class="card" style="margin-bottom:20px;background:linear-gradient(135deg,rgba(79,110,247,0.08),rgba(167,139,250,0.08));border-color:var(--border-accent)">
      <div style="display:flex;align-items:center;gap:16px">
        <div style="text-align:center;flex-shrink:0">
          <div style="font-size:24px;font-weight:700;color:var(--accent)">${d.user.level}</div>
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px">Level</div>
        </div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:12px;font-weight:600">Level ${d.user.level}</span>
            <span style="font-size:12px;color:var(--text-muted)">${d.user.xp} / ${d.user.xp_to_next} XP</span>
          </div>
          <div class="progress-track" style="height:8px">
            <div class="progress-fill" style="width:${Math.round((d.user.xp/d.user.xp_to_next)*100)}%;background:linear-gradient(90deg,var(--accent),var(--purple))"></div>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">${d.user.xp_to_next - d.user.xp} XP to Level ${d.user.level+1}</div>
        </div>
        <div style="display:flex;gap:20px;flex-shrink:0">
          ${[["🔥","Streak",d.user.streak+"d"],["✅","Done",d.stats.tasks_completed],["🔀","PRs",d.stats.prs_merged]].map(([icon,label,val])=>`
            <div style="text-align:center">
              <div style="font-size:18px">${icon}</div>
              <div style="font-size:16px;font-weight:600">${val}</div>
              <div style="font-size:10px;color:var(--text-muted)">${label}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:20px;align-items:start">
      <!-- Skill Progress -->
      <div class="card">
        <div class="card-header"><div class="card-title">Skill Progress</div></div>
        ${d.skills.map(s=>`
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div style="width:108px;font-size:13px;font-weight:500;flex-shrink:0">${s.name}</div>
            <div class="progress-track" style="flex:1">
              <div class="progress-fill" style="width:${s.level}%;background:${s.color}"></div>
            </div>
            <div style="width:32px;font-size:12px;color:var(--text-muted);text-align:right">${s.level}%</div>
          </div>
        `).join("")}
      </div>

      <!-- Activity Heatmap -->
      <div class="card">
        <div class="card-header"><div class="card-title">Activity (12 weeks)</div></div>
        <div style="display:flex;flex-wrap:wrap;gap:3px">
          ${Array.from({length:84},(_,i)=>{
            const lvls=["","s1","s2","s3","s4"];
            const l=lvls[Math.floor(Math.random()*5)];
            const colors={"":"var(--bg-overlay)",s1:"#c7d0fc",s2:"#818cf8",s3:"#4f6ef7",s4:"#3730a3"};
            return `<div style="width:12px;height:12px;border-radius:2px;background:${colors[l]||colors[""]}"></div>`;
          }).join("")}
        </div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:10px;font-size:11px;color:var(--text-muted)">
          Less
          ${["var(--bg-overlay)","#c7d0fc","#818cf8","#4f6ef7","#3730a3"].map(c=>`<div style="width:10px;height:10px;border-radius:2px;background:${c}"></div>`).join("")}
          More
        </div>
      </div>
    </div>

    <!-- Courses -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-header"><div class="card-title">Active Courses</div><span class="tag tag-blue">${d.courses.length} enrolled</span></div>
      ${d.courses.map(c=>`
        <div style="padding:12px 0;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:14px">
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:500;margin-bottom:2px">${c.title}</div>
            <div style="font-size:11px;color:var(--text-muted)">${c.hours_spent}h / ${c.total_hours}h · <span class="tag tag-muted" style="font-size:10px">${c.category}</span></div>
            <div class="progress-track" style="margin-top:8px;height:5px"><div class="progress-fill" style="width:${c.progress}%"></div></div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:18px;font-weight:700;color:var(--accent)">${c.progress}%</div>
          </div>
        </div>
      `).join("")}
    </div>

    <!-- Achievements -->
    <div class="card">
      <div class="card-header"><div class="card-title">Achievements</div></div>
      <div class="grid-3">
        ${d.achievements.map(a=>`
          <div style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);opacity:${a.earned?1:0.4}">
            <div style="width:36px;height:36px;border-radius:10px;background:var(--accent-dim);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${a.icon}</div>
            <div>
              <div style="font-size:13px;font-weight:600">${a.title}</div>
              <div style="font-size:11px;color:var(--text-muted)">${a.description}</div>
            </div>
            ${a.earned?`<span class="tag tag-green" style="margin-left:auto">✓</span>`:`<span class="tag tag-muted" style="margin-left:auto">🔒</span>`}
          </div>
        `).join("")}
      </div>
    </div>
  </div>`;
}

// ─────────────────────────────────────────────
// ADD TASK MODAL
// ─────────────────────────────────────────────

function openAddTaskModal() {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal">
      <div class="modal-title">New Task</div>
      <div class="modal-sub">Add a task to your DevFlow planner</div>
      <div class="form-group">
        <label class="form-label">Title *</label>
        <input class="form-input" id="mt-title" placeholder="e.g. Refactor authentication module" autofocus/>
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" id="mt-desc" placeholder="What needs to be done?"></textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select class="form-select" id="mt-priority">
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Deadline</label>
          <input class="form-input" id="mt-deadline" type="date"/>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Tags (comma-separated)</label>
        <input class="form-input" id="mt-tags" placeholder="e.g. backend, api, bugfix"/>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
        <button class="btn btn-secondary" onclick="this.closest('.modal-backdrop').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="submitNewTask()">Create Task</button>
      </div>
    </div>`;
  backdrop.onclick = e => { if(e.target===backdrop) backdrop.remove(); };
  document.body.appendChild(backdrop);
}

async function submitNewTask() {
  const title = document.getElementById("mt-title")?.value.trim();
  if (!title) { showToast("Title is required", "error"); return; }
  const body = {
    title,
    description: document.getElementById("mt-desc")?.value || "",
    priority:    document.getElementById("mt-priority")?.value || "medium",
    deadline:    document.getElementById("mt-deadline")?.value || "",
    tags:        (document.getElementById("mt-tags")?.value || "").split(",").map(s=>s.trim()).filter(Boolean),
  };
  const data = await apiFetch("/add-task", { method:"POST", body: JSON.stringify(body) });
  document.querySelector(".modal-backdrop")?.remove();
  if (data.success || data.task) {
    showToast(`Task "${title}" created!`, "success");
    // Inject into fallback so the page updates
    FALLBACK.tasks.tasks.push(data.task || {...body, id:Date.now(), status:"pending", created_at:new Date().toISOString().slice(0,10), comments:[], activity:[{event:"Task created",time:"just now"}]});
    navigate("tasks");
  } else {
    showToast("Failed to create task", "error");
  }
}

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────

function showToast(msg, type="info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const icons = { success:"✓", error:"✗", info:"ℹ" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]||"ℹ"}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ─────────────────────────────────────────────
// BOOTSTRAP
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.replace("#","") || "dashboard";
  navigate(hash);
  // Mark active nav
  document.querySelectorAll(".nav-item[data-page]").forEach(el => {
    el.classList.toggle("active", el.dataset.page === hash);
  });
});
