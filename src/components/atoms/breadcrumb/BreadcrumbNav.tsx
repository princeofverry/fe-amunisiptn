"use client";

import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "./BreadcrumbContext";

export default function BreadcrumbNav() {
  const { items } = useBreadcrumb();
  if (!items || items.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList className="min-w-0 text-xs text-muted-foreground leading-none">
        {items.map((c, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <Fragment key={`${c.label}-${c.href ?? idx}`}>
              <BreadcrumbItem className="min-w-0">
                {isLast || !c.href ? (
                  <BreadcrumbPage className="truncate text-xs font-medium text-foreground">
                    {c.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    asChild
                    className="truncate text-xs hover:text-foreground hover:underline"
                  >
                    <Link href={c.href}>{c.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator className="mx-1 scale-75" />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
