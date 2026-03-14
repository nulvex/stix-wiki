import * as HoverCard from '@radix-ui/react-hover-card';
import { Link } from '@tanstack/react-router';
import {
  formatObjectTypeName,
  getObjectPageInfo,
  getObjectPreviewData,
} from '@/lib/object-pages';

interface ObjectTypeLinkProps {
  type: string;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export function ObjectTypeLink({ type }: ObjectTypeLinkProps) {
  const objectPage = getObjectPageInfo(type);
  const previewData = getObjectPreviewData(type);

  if (!objectPage) {
    return <code className="rounded bg-fd-secondary px-1.5 py-0.5 font-mono text-xs text-fd-accent-foreground">{type}</code>;
  }

  return (
    <HoverCard.Root openDelay={150} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <Link to="/docs/$" params={{ _splat: objectPage.slug }} className="no-underline">
          <code className="rounded bg-fd-secondary px-1.5 py-0.5 font-mono text-xs text-fd-accent-foreground transition-colors hover:bg-blue-500/20 hover:text-blue-300">
            {type}
          </code>
        </Link>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          side="bottom"
          align="start"
          sideOffset={6}
          className="z-[9999] w-[30rem] max-w-[80vw] max-h-96 overflow-y-auto rounded-md border border-fd-border bg-fd-card p-4 text-xs text-fd-card-foreground shadow-xl ring-1 ring-black/10"
        >
          <h4 className="m-0 text-sm font-semibold">{formatObjectTypeName(type)}</h4>
          <p className="mb-2 mt-1 text-xs text-fd-muted-foreground">{objectPage.section}</p>

          {previewData?.description ? (
            <p className="m-0 text-xs leading-relaxed text-fd-muted-foreground">
              {truncate(previewData.description, 260)}
            </p>
          ) : null}

          <div className="mt-3 space-y-2">
            {previewData?.requiredProperties.length ? (
              <div>
                <p className="m-0 mb-1 text-[11px] font-semibold uppercase tracking-wide text-fd-muted-foreground">
                  Required Properties
                </p>
                <div className="flex flex-wrap gap-1">
                  {previewData.requiredProperties.map((property) => (
                    <code key={property} className="rounded bg-fd-secondary px-1.5 py-0.5 font-mono text-[11px] text-fd-accent-foreground">
                      {property}
                    </code>
                  ))}
                </div>
              </div>
            ) : null}

            {previewData?.typeProperties.length ? (
              <div>
                <p className="m-0 mb-1 text-[11px] font-semibold uppercase tracking-wide text-fd-muted-foreground">
                  Type-specific Properties
                </p>
                <div className="flex flex-wrap gap-1">
                  {previewData.typeProperties.map((property) => (
                    <code key={property} className="rounded bg-fd-secondary px-1.5 py-0.5 font-mono text-[11px] text-fd-accent-foreground">
                      {property}
                    </code>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
