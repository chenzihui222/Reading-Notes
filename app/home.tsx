"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Note, Like } from "@/lib/db";
import type { User } from "@/lib/auth";

interface Props {
  notes: Note[];
  user: User | null;
}

const GITHUB_SVG = (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

function isUrl(str: string): boolean {
  return /^https?:\/\//i.test(str.trim());
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr + "Z");
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

// Grid paper background with dot-grid ripple effect
function useGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let width = 0, height = 0, animId = 0;
    let mouseX = -1000, mouseY = -1000;
    const dpr = window.devicePixelRatio || 1;

    interface Dot { x: number; y: number; baseX: number; baseY: number; vx: number; vy: number; }
    let dots: Dot[] = [];

    const GRID = 28;
    const DOT_R = 0.8;
    const MOUSE_R = 160;
    const CONNECT_R = 100;
    const PUSH = 14;
    const SPRING = 0.04;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const cols = Math.ceil(width / GRID) + 1;
      const rows = Math.ceil(height / GRID) + 1;
      const ox = (width - (cols - 1) * GRID) / 2;
      const oy = (height - (rows - 1) * GRID) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ox + c * GRID, y = oy + r * GRID;
          dots.push({ x, y, baseX: x, baseY: y, vx: 0, vy: 0 });
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw grid lines (light)
      ctx.strokeStyle = "rgba(190, 175, 145, 0.28)";
      ctx.lineWidth = 0.5;
      if (dots.length > 0) {
        const cols = Math.ceil(width / GRID) + 1;
        const rows = Math.ceil(height / GRID) + 1;
        const ox = (width - (cols - 1) * GRID) / 2;
        const oy = (height - (rows - 1) * GRID) / 2;
        for (let c = 0; c < cols; c++) {
          const x = ox + c * GRID;
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let r = 0; r < rows; r++) {
          const y = oy + r * GRID;
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }
      }

      // Update dots — mouse pushes, spring back
      for (const dot of dots) {
        const dx = dot.x - mouseX, dy = dot.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_R && dist > 0) {
          const force = (1 - dist / MOUSE_R) * PUSH;
          const ang = Math.atan2(dy, dx);
          dot.vx += Math.cos(ang) * force * 0.06;
          dot.vy += Math.sin(ang) * force * 0.06;
        }
        dot.vx += (dot.baseX - dot.x) * SPRING;
        dot.vy += (dot.baseY - dot.y) * SPRING;
        dot.vx *= 0.88;
        dot.vy *= 0.88;
        dot.x += dot.vx;
        dot.y += dot.vy;
      }

      // Connection lines near mouse
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        const dA = Math.sqrt((a.x - mouseX) ** 2 + (a.y - mouseY) ** 2);
        if (dA > MOUSE_R * 1.5) continue;
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dB = Math.sqrt((b.x - mouseX) ** 2 + (b.y - mouseY) ** 2);
          if (dB > MOUSE_R * 1.5) continue;
          const d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (d < CONNECT_R) {
            const alpha = (1 - d / CONNECT_R) * 0.18 * Math.min(1, 1 - Math.max(dA, dB) / (MOUSE_R * 1.5));
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(243, 128, 32, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const dot of dots) {
        const dx = dot.x - mouseX, dy = dot.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let alpha = 0.15, radius = DOT_R, color = "180, 168, 140";
        if (dist < MOUSE_R) {
          const t = 1 - dist / MOUSE_R;
          alpha = 0.15 + t * 0.65;
          radius = DOT_R + t * 2;
          const r = Math.round(180 + (243 - 180) * t);
          const g = Math.round(168 + (128 - 168) * t);
          const b = Math.round(140 + (32 - 140) * t);
          color = `${r}, ${g}, ${b}`;
        }
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    }

    const glow = glowRef.current;
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (glow) { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; glow.classList.add("active"); }
    };
    const onLeave = () => { mouseX = -1000; mouseY = -1000; glow?.classList.remove("active"); };

    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    resize();
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseleave", onLeave); };
  }, []);

  return { canvasRef, glowRef };
}

function QuickCapture({ onSaved }: { onSaved: () => void }) {
  const [content, setContent] = useState("");
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = useCallback(async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), reference: reference.trim() }),
      });
      setContent("");
      setReference("");
      onSaved();
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [content, reference, onSaved]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSave();
      }
    },
    [handleSave]
  );

  return (
    <div className="capture-box">
      <textarea
        ref={textareaRef}
        className="capture-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What did you learn today?"
        rows={3}
      />
      <div className="capture-bottom">
        <input
          className="capture-ref"
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Reference — URL or source text (optional)"
        />
        <button
          className="btn btn-accent"
          onClick={handleSave}
          disabled={saving || !content.trim()}
        >
          {saving ? "Saving..." : "Save"}
          <span className="capture-shortcut">⌘↵</span>
        </button>
      </div>
    </div>
  );
}

function LikeButton({ note, user, onToggled }: { note: Note; user: User | null; onToggled: () => void }) {
  const [likes, setLikes] = useState<Like[]>(note.likes);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setLikes(note.likes);
  }, [note.likes]);

  const hasLiked = user ? likes.some((l) => l.github_id === user.github_id) : false;

  const handleToggle = useCallback(async () => {
    if (!user) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    // Optimistic update
    if (hasLiked) {
      setLikes((prev) => prev.filter((l) => l.github_id !== user.github_id));
    } else {
      setLikes((prev) => [...prev, { github_id: user.github_id, github_login: user.github_login }]);
    }

    await fetch(`/api/notes/${note.id}/like`, { method: "POST" });
    onToggled();
  }, [note.id, user, hasLiked, onToggled]);

  return (
    <div className="like-section">
      <button
        className={`like-btn ${hasLiked ? "liked" : ""} ${animating ? "like-pop" : ""}`}
        onClick={handleToggle}
        disabled={!user}
        title={user ? (hasLiked ? "Unlike" : "Like") : "Login to like"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {likes.length > 0 && <span className="like-count">{likes.length}</span>}
      </button>
      {likes.length > 0 && (
        <div className="like-avatars">
          {likes.map((l) => (
            <img
              key={l.github_id}
              className="like-avatar"
              src={`https://avatars.githubusercontent.com/u/${l.github_id}?s=32`}
              alt={l.github_login}
              title={l.github_login}
              width={20}
              height={20}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NoteItem({ note, isAdmin, user, onChanged }: { note: Note; isAdmin: boolean; user: User | null; onChanged: () => void }) {
  const handleDelete = useCallback(async () => {
    if (!confirm("Delete this note?")) return;
    await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
    onChanged();
  }, [note.id, onChanged]);

  return (
    <div className="note-item">
      <div className="note-content">{note.content}</div>
      {note.reference && (
        <div className="note-ref">
          {isUrl(note.reference) ? (
            <a href={note.reference} target="_blank" rel="noopener noreferrer" className="note-ref-link">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              {note.reference.replace(/^https?:\/\//, "").split("/")[0]}
            </a>
          ) : (
            <span className="note-ref-text">— {note.reference}</span>
          )}
        </div>
      )}
      <div className="note-meta">
        <span className="note-time">{formatTime(note.created_at)}</span>
        <LikeButton note={note} user={user} onToggled={onChanged} />
        {isAdmin && (
          <button className="note-delete" onClick={handleDelete}>delete</button>
        )}
      </div>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <span className="footer-brand-dot" />
              <span className="footer-brand-name">Zihui Chen</span>
            </div>
            <p className="footer-brand-desc">
              All about tech and finance.
            </p>
          </div>
          <div>
            <div className="footer-heading">Projects</div>
            <div className="footer-links">
              <a href="https://zihuichen.com" target="_blank" rel="noopener noreferrer" className="footer-link">Homepage</a>
              <a href="https://vc.zihuichen.com" target="_blank" rel="noopener noreferrer" className="footer-link">VC Radar</a>
              <a href="https://notes.zihuichen.com" className="footer-link">Notes</a>
            </div>
          </div>
          <div>
            <div className="footer-heading">Links</div>
            <div className="footer-links">
              <a href="https://github.com/chenzihui222" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">&copy; {year} Zihui Chen</span>
          <a href="https://github.com/chenzihui222" target="_blank" rel="noopener noreferrer" className="footer-social">{GITHUB_SVG}</a>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage({ notes: initialNotes, user }: Props) {
  const { canvasRef, glowRef } = useGridBackground();
  const [notes, setNotes] = useState(initialNotes);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/notes");
    const data = (await res.json()) as { notes: Note[] };
    setNotes(data.notes);
  }, []);

  return (
    <>
      <div className="accent-bar" />
      <canvas id="ink-canvas" ref={canvasRef} />
      <div id="mouse-glow" ref={glowRef} />

      <div className="app">
        <nav className="nav anim-fade-up">
          <a href="/" className="nav-brand">
            <span className="nav-dot" />
            <span className="nav-title">Zihui Notes</span>
          </a>
          <div className="nav-links">
            <a href="https://zihuichen.com" target="_blank" rel="noopener noreferrer" className="nav-link">Home</a>
            <a href="https://vc.zihuichen.com" target="_blank" rel="noopener noreferrer" className="nav-link">VC Radar</a>
          </div>
          <div className="nav-actions">
            {user ? (
              <form action="/api/auth/logout" method="POST" style={{ display: "inline" }}>
                <button type="submit" className="btn btn-ghost">
                  <span className="user-badge">@{user.github_login}</span>
                  Logout
                </button>
              </form>
            ) : (
              <a href="/api/auth/login" className="btn">
                {GITHUB_SVG}
                Sign in
              </a>
            )}
          </div>
        </nav>

        {/* Quick capture for admins */}
        {user?.isAdmin && (
          <div className="anim-fade-up anim-stagger-1">
            <QuickCapture onSaved={refresh} />
          </div>
        )}

        {/* Notes feed */}
        <div className="notes-feed anim-fade-up anim-stagger-2">
          {notes.length === 0 ? (
            <div className="empty-state">
              <p>No notes yet.</p>
            </div>
          ) : (
            notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isAdmin={user?.isAdmin ?? false}
                user={user}
                onChanged={refresh}
              />
            ))
          )}
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
