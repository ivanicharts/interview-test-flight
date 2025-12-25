import Link from 'next/link';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // If logged in → go straight to app
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/dashboard');

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold tracking-tight">Interview Test Flight</div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              privacy-first
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login" prefetch={false}>
                Sign in
              </Link>
            </Button>
            <Button asChild>
              <Link href="/login" prefetch={false}>
                Get started
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge variant="secondary">JD + CV → analysis → mock interview</Badge>

              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Practice interviews with real feedback — fast.
              </h1>

              <p className="text-muted-foreground max-w-xl text-base md:text-lg">
                Paste a Job Description and your CV, get a structured match report with gaps and rewrite suggestions,
                then run a question-by-question mock interview with scoring and improvements.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/login" prefetch={false}>
                  Start with a JD
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login?next=%2Fjd%2Fnew" prefetch={false}>
                  Jump to create JD
                </Link>
              </Button>
            </div>

            <div className="text-muted-foreground text-xs">
              Built for minimal retention, delete-anytime controls, and readable reports.
            </div>
          </div>

          {/* Right panel */}
          <Card className="space-y-4 p-5 md:p-6">
            <div className="space-y-1">
              <div className="text-sm font-semibold">What you’ll get</div>
              <div className="text-muted-foreground text-sm">In ~2–5 minutes of setup time.</div>
            </div>

            <Separator />

            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full" />
                <div>
                  <div className="font-medium">Structured match report</div>
                  <div className="text-muted-foreground">Score, evidence mapping, gaps, and rewrite suggestions.</div>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full" />
                <div>
                  <div className="font-medium">Mock interview flow</div>
                  <div className="text-muted-foreground">
                    One question at a time, rubric scoring, actionable feedback.
                  </div>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full" />
                <div>
                  <div className="font-medium">Session history</div>
                  <div className="text-muted-foreground">Easy navigation across attempts and progress.</div>
                </div>
              </li>
            </ul>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-semibold">Privacy-first</div>
              <div className="text-muted-foreground text-sm">
                You control retention. Delete data anytime in Settings (and RLS enforces ownership).
              </div>
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12 space-y-6 md:mt-16">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold md:text-2xl">How it works</h2>
            <p className="text-muted-foreground text-sm">Simple flow, structured outputs, easy iteration.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="space-y-2 p-5">
              <div className="text-sm font-semibold">1) Paste JD + CV</div>
              <div className="text-muted-foreground text-sm">
                Create a JD entry once. Reuse your CV and iterate quickly.
              </div>
            </Card>

            <Card className="space-y-2 p-5">
              <div className="text-sm font-semibold">2) Get match analysis</div>
              <div className="text-muted-foreground text-sm">
                See what matches, what’s missing, and what to improve.
              </div>
            </Card>

            <Card className="space-y-2 p-5">
              <div className="text-sm font-semibold">3) Practice interview</div>
              <div className="text-muted-foreground text-sm">
                Answer question-by-question (text/audio later), get feedback and improved answers.
              </div>
            </Card>
          </div>

          {/* CTA strip */}
          <Card className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center md:p-6">
            <div>
              <div className="text-base font-semibold">Ready to run a test flight?</div>
              <div className="text-muted-foreground text-sm">Sign in and create your first JD.</div>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/login" prefetch={false}>
                  Sign in
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login?next=%2Fdashboard" prefetch={false}>
                  Go to dashboard
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-4 py-6 sm:flex-row sm:items-center">
          <div className="text-muted-foreground text-xs">© {new Date().getFullYear()} Interview Test Flight</div>
          <div className="text-muted-foreground text-xs">Built with Next.js + Supabase + shadcn/ui</div>
        </div>
      </footer>
    </div>
  );
}
