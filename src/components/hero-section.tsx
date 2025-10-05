import { Link } from '@tanstack/react-router';
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Red gradient blob - top left */}
        <div className="absolute -top-40 -left-40 w-196 h-196 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-3xl opacity-70" />

        {/* Purple/pink absolute gradient blob - top right */}
        <div className="absolute -top-20 -right-20 w-180 h-180 bg-gradient-to-bl from-purple-500/20 to-pink-500/10 rounded-full blur-3xl opacity-60" />

        {/* Blue gradienabsolute t blob - bottom left */}
        <div className="absolute -bottom-32 -left-20 w-196 h-196 bg-gradient-to-tr from-blue-500/15 to-cyan-500/10 rounded-full blur-3xl opacity-50" />

        {/* Orange gradiabsolute ent blob - bottom right */}
        <div className="absolute -bottom-20 -right-32 w-172 h-172 bg-gradient-to-tl from-orange-500/15 to-primary/10 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="flex flex-col gap-6 max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-left">
          The right way to organize the world's <span className="text-primary">cyber intelligence</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl text-left leading-relaxed">
          STIX Wiki is a community portal for everything related to the Structured Threat Information Expression (STIX™)
          language and serialization format used to exchange cyber threat intelligence (CTI)
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Button size="lg" variant="outline" asChild>
            <Link to="/docs/$">Introduction</Link>
          </Button>
          <Button size="lg" asChild>
            <Link to="/docs/$" params={{ _splat: 'getting-started' }} className="gap-2">
              Start building
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
