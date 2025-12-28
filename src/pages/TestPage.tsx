import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { StickyScrollReveal } from "@/components/ui/sticky-scroll-reveal";
import SectionHeading from "@/components/SectionHeading";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import { expoImages, navItems } from "@/data/expo-data";

const TestPage = () => {
  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [intensity, setIntensity] = useState([50]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNavbar navItems={[...navItems, { name: "Test", href: "/test" }]} />

      <section className="container-custom pt-28 pb-12 space-y-4">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-primary">Playground</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold">Component Test Bed</h1>
          <p className="text-muted-foreground max-w-2xl">
            Use this page to try components and interactions without touching the live sections.
          </p>
        </header>
      </section>

      <section className="container-custom pb-12">
        <SectionHeading
          eyebrow="Demo Section"
          title={
            <>
              WHAT IS <br className="hidden sm:block" /> ICE EXHIBITIONS
            </>
          }
          subtitle="Gradient heading wrapped in animated background lines to validate motion, contrast, and layout spacing."
        />
      </section>

      <section className="container-custom pb-16">
        <div className="pb-10">
          <PointerHighlight
            rectangleClassName="bg-neutral-200 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
            pointerClassName="border-yellow-500/50 bg-yellow-500/10"
            className="w-full justify-center"
          >
            <div className="mx-auto max-w-2xl text-center text-2xl font-bold tracking-tight md:text-4xl">
              There has to be some{" "}
              <span className="relative z-10">background to animate too</span>
            </div>
          </PointerHighlight>
        </div>

        <div className="pb-10 space-y-6">
          <SectionHeading
            eyebrow="Parallax Demo"
            title="Vertical parallax gallery"
            subtitle="Testing the ParallaxScroll component with expo imagery."
          />
          <ParallaxScroll
            images={[...Object.values(expoImages), ...Object.values(expoImages)]}
          />
        </div>

        <div className="pb-10 space-y-8">
          <SectionHeading
            eyebrow="Sticky Scroll"
            title="Feature narrative with sticky preview"
            subtitle="Borrowed from the sample you shared—tracks the active card and updates a preview panel."
            align="left"
          />
          <StickyScrollReveal
            content={[
              {
                title: "Collaborative Editing",
                description:
                  "Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly.",
                content: (
                  <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white text-lg font-semibold">
                    Collaborative Editing
                  </div>
                ),
              },
              {
                title: "Real time changes",
                description:
                  "See changes as they happen. Track every modification in real time—no confusion about the latest version.",
                content: (
                  <div className="flex h-full w-full items-center justify-center text-white">
                    <img
                      src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80"
                      className="h-full w-full object-cover"
                      alt="Real-time board demo"
                    />
                  </div>
                ),
              },
              {
                title: "Version control",
                description:
                  "Always work on the most recent version. Keep teams aligned and flowing without manual updates.",
                content: (
                  <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] text-white text-lg font-semibold">
                    Version control
                  </div>
                ),
              },
              {
                title: "Running out of content",
                description:
                  "Real-time updates with zero stress about version control. Stay in sync and keep the narrative moving.",
                content: (
                  <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white text-lg font-semibold">
                    Running out of content
                  </div>
                ),
              },
            ]}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
              <CardDescription>Simple stateful widgets you can tweak.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name input</label>
                <Input
                  placeholder="Type anything"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">Echo: {name || "—"}</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2">
                <div>
                  <p className="text-sm font-medium">Toggle</p>
                  <p className="text-xs text-muted-foreground">Enabled: {enabled ? "Yes" : "No"}</p>
                </div>
                <Switch checked={enabled} onCheckedChange={setEnabled} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Intensity</p>
                  <span className="text-xs text-muted-foreground">{intensity[0]}%</span>
                </div>
                <Slider value={intensity} onValueChange={setIntensity} max={100} step={5} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tabs + Buttons</CardTitle>
              <CardDescription>Quick layout to verify styling.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="one" className="w-full">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="one">One</TabsTrigger>
                  <TabsTrigger value="two">Two</TabsTrigger>
                  <TabsTrigger value="three">Three</TabsTrigger>
                </TabsList>
                <TabsContent value="one" className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Tab one: use this to test text and spacing.
                  </p>
                  <Button size="sm">Small action</Button>
                </TabsContent>
                <TabsContent value="two" className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Tab two: check hover/focus states.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                  </div>
                </TabsContent>
                <TabsContent value="three" className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Tab three: combine with other components.
                  </p>
                  <Button variant="destructive">Destructive</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default TestPage;
